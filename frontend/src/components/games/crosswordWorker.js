import crosswordLib from 'crossword-layout-generator';

// ─── Utilities ────────────────────────────────────────────────────────────────

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const silentCall = (fn) => {
  const noop = () => {};
  const orig = { log: console.log, warn: console.warn, error: console.error };
  console.log = noop; console.warn = noop; console.error = noop;
  try { return fn(); } finally {
    console.log = orig.log; console.warn = orig.warn; console.error = orig.error;
  }
};

// ─── Connected-component filter (keep largest cluster) ────────────────────────

const keepLargestComponent = (placedWords) => {
  if (placedWords.length === 0) return [];

  const wordCells = placedWords.map(pw => {
    const cells = new Set();
    for (let i = 0; i < pw.ans.length; i++) {
      const r = pw.dir === 'across' ? pw.r : pw.r + i;
      const c = pw.dir === 'across' ? pw.c + i : pw.c;
      cells.add(`${r},${c}`);
    }
    return cells;
  });

  const adj = placedWords.map(() => []);
  for (let i = 0; i < placedWords.length; i++) {
    for (let j = i + 1; j < placedWords.length; j++) {
      for (const cell of wordCells[i]) {
        if (wordCells[j].has(cell)) { adj[i].push(j); adj[j].push(i); break; }
      }
    }
  }

  const visited = new Array(placedWords.length).fill(false);
  let largestComponent = [];

  for (let start = 0; start < placedWords.length; start++) {
    if (visited[start]) continue;
    const component = [];
    const queue = [start];
    visited[start] = true;
    while (queue.length > 0) {
      const cur = queue.shift();
      component.push(cur);
      for (const nb of adj[cur]) {
        if (!visited[nb]) { visited[nb] = true; queue.push(nb); }
      }
    }
    if (component.length > largestComponent.length) largestComponent = component;
  }

  return largestComponent.map(idx => placedWords[idx]);
};

// ─── CRITICAL: Standard crossword numbering (top-to-bottom, left-to-right) ───
//
// Cells are scanned in reading order. A cell gets a number if it is the
// START of an across word (nothing to its left in the same row) OR the
// START of a down word (nothing above it in the same column).
// All words share the SAME number counter – one number per starting cell,
// not one number per word.  This is the only numbering scheme accepted by
// all crossword conventions.

const assignStandardNumbers = (words, gridSizeR, gridSizeC) => {
  // Build a letter grid to know which cells are active
  const letterGrid = Array.from({ length: gridSizeR }, () =>
    new Array(gridSizeC).fill(null)
  );
  for (const w of words) {
    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;
      letterGrid[r][c] = w.ans[i];
    }
  }

  // Map: "r,c" → assigned crossword number
  const cellNumMap = {};
  let counter = 1;

  for (let r = 0; r < gridSizeR; r++) {
    for (let c = 0; c < gridSizeC; c++) {
      if (!letterGrid[r][c]) continue;

      const startsAcross =
        (c === 0 || !letterGrid[r][c - 1]) &&
        letterGrid[r][c + 1] != null;

      const startsDown =
        (r === 0 || !letterGrid[r - 1][c]) &&
        letterGrid[r + 1] != null && letterGrid[r + 1][c] != null;

      if (startsAcross || startsDown) {
        cellNumMap[`${r},${c}`] = counter++;
      }
    }
  }

  // Assign the number to each word based on its starting cell
  return words.map(w => {
    const key = `${w.r},${w.c}`;
    const num = cellNumMap[key];
    if (num == null) {
      // This word's start cell was not assigned a number – shouldn't happen
      // with a valid layout, but guard against it.
      throw new Error(
        `Word "${w.ans}" at (${w.r},${w.c}) dir=${w.dir} has no assigned number. Layout is invalid.`
      );
    }
    return {
      ...w,
      num,
      id: `${num}${w.dir === 'across' ? 'A' : 'D'}`,
    };
  });
};

// ─── Layout validation ────────────────────────────────────────────────────────

/**
 * Full strict validation:
 *  1. No letter conflicts at shared cells.
 *  2. Every cell in every word's path is actually occupied.
 *  3. Word length matches actual grid slots (no ghost cells).
 *  4. No word is an orphan (except when there is only 1 word – impossible here).
 */
const isValidLayout = (placedWords, gridSizeR, gridSizeC) => {
  const grid = {};

  for (const w of placedWords) {
    // Rule 3: word must fit exactly in its declared length
    const endR = w.dir === 'down'   ? w.r + w.ans.length - 1 : w.r;
    const endC = w.dir === 'across' ? w.c + w.ans.length - 1 : w.c;

    if (endR >= gridSizeR || endC >= gridSizeC) return false;

    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;
      const key = `${r}-${c}`;
      const letter = w.ans[i];

      // Rule 1: no conflicting letters
      if (grid[key] && grid[key] !== letter) return false;
      grid[key] = letter;
    }
  }

  // Rule 2: continuity – every cell in word path is occupied
  for (const w of placedWords) {
    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;
      if (!grid[`${r}-${c}`]) return false;
    }
  }

  return true;
};

// ─── Main layout generator ────────────────────────────────────────────────────

const generateLayout = (wordList) => {
  if (!wordList || wordList.length === 0) return { gridSizeR: 0, gridSizeC: 0, words: [] };

  const seen = new Set();
  const inputClues = wordList
    .map(w => ({ answer: w.word.toUpperCase().replace(/[^A-Z]/g, ''), clue: w.clue.trim() }))
    .filter(w => {
      if (w.answer.length < 3 || seen.has(w.answer)) return false;
      seen.add(w.answer);
      return true;
    });

  if (inputClues.length === 0) throw new Error('No valid words to generate a crossword.');

  const MAX_ATTEMPTS = 60;

  const parseRaw = (rawResult) => {
    if (!rawResult) return [];
    return rawResult
      .filter(item => item.orientation !== 'none')
      .map(item => ({
        dir: item.orientation,
        ans: item.answer,
        clue: item.clue,
        r: item.starty - 1,
        c: item.startx - 1,
      }));
  };

  const computeBounds = (words) => {
    let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
    for (const w of words) {
      const endR = w.dir === 'down'   ? w.r + w.ans.length - 1 : w.r;
      const endC = w.dir === 'across' ? w.c + w.ans.length - 1 : w.c;
      if (w.r < minR) minR = w.r;
      if (endR > maxR) maxR = endR;
      if (w.c < minC) minC = w.c;
      if (endC > maxC) maxC = endC;
    }
    return { minR, maxR, minC, maxC };
  };

  let best = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const ordered = shuffleArray(inputClues);
    const layout = silentCall(() => crosswordLib.generateLayout(ordered));
    if (!layout?.result) continue;

    const placed = parseRaw(layout.result);
    if (placed.length === 0) continue;

    // Compute bounds before validation so we can pass gridSizeR/C
    const { minR, maxR, minC, maxC } = computeBounds(placed);
    const gridSizeR = maxR - minR + 1;
    const gridSizeC = maxC - minC + 1;

    // Normalize to zero-origin
    const normalized = placed.map(w => ({ ...w, r: w.r - minR, c: w.c - minC }));

    // Strict layout validation
    if (!isValidLayout(normalized, gridSizeR, gridSizeC)) continue;

    // Keep only the largest connected component
    const connected = keepLargestComponent(normalized);
    if (connected.length < 3) continue;

    // Re-validate the connected subset (may be a subset of normalized)
    const { minR: cr, maxR: eR, minC: cc, maxC: eC } = computeBounds(connected);
    const cGridR = eR - cr + 1;
    const cGridC = eC - cc + 1;
    const reNorm = connected.map(w => ({ ...w, r: w.r - cr, c: w.c - cc }));

    if (!isValidLayout(reNorm, cGridR, cGridC)) continue;

    const score = connected.length * 10 + Math.random() * 0.5;
    if (!best || score > best.score) {
      best = { score, words: reNorm, gridSizeR: cGridR, gridSizeC: cGridC };
    }

    // Perfect: all words placed and connected
    if (best.words.length === inputClues.length) break;
  }

  if (!best || best.words.length < 3) {
    throw new Error(
      `Only ${best?.words.length ?? 0} word(s) could be connected. Need at least 3.`
    );
  }

  // ── Assign standard crossword numbers (the SINGLE source of truth) ──
  const numberedWords = assignStandardNumbers(best.words, best.gridSizeR, best.gridSizeC);

  // Final bounds-check safety filter (paranoia guard)
  const safeWords = numberedWords.filter(w => {
    const endR = w.dir === 'down'   ? w.r + w.ans.length - 1 : w.r;
    const endC = w.dir === 'across' ? w.c + w.ans.length - 1 : w.c;
    return endR < best.gridSizeR && endC < best.gridSizeC;
  });

  if (safeWords.length < 3) throw new Error('Too few words remain after safety filtering.');

  return { gridSizeR: best.gridSizeR, gridSizeC: best.gridSizeC, words: safeWords };
};

// ─── Grid data builder ────────────────────────────────────────────────────────

const generateGridData = (puzzleData) => {
  if (!puzzleData || !puzzleData.words || puzzleData.gridSizeR === 0) return [];

  const { gridSizeR, gridSizeC, words } = puzzleData;

  const makeCell = () => ({ isActive: false, correctChar: '', num: null, words: [] });
  const grid = Array.from({ length: gridSizeR }, () =>
    Array.from({ length: gridSizeC }, makeCell)
  );

  for (const w of words) {
    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;

      if (r < 0 || r >= gridSizeR || c < 0 || c >= gridSizeC) {
        throw new Error(`Word "${w.ans}" out of bounds at (${r},${c})`);
      }

      const existing = grid[r][c];

      // Strict collision guard
      if (existing.isActive && existing.correctChar !== w.ans[i]) {
        throw new Error(
          `Fatal letter collision at (${r},${c}): expected "${existing.correctChar}", got "${w.ans[i]}" for word "${w.ans}"`
        );
      }

      // The cell number is only set for the FIRST letter of the word,
      // and only if no earlier word already set a number at that cell
      // (an intersection might share a starting number).
      const cellNum = i === 0
        ? w.num                           // always trust the assigned number
        : existing.num;                   // keep whatever was set by an earlier word

      grid[r][c] = {
        isActive: true,
        correctChar: w.ans[i],
        num: cellNum,
        words: existing.words.includes(w.id)
          ? existing.words
          : [...existing.words, w.id],
      };
    }
  }

  return grid;
};

// ─── Pre-render puzzle validator ──────────────────────────────────────────────

const validatePuzzle = (puzzleData, gridData) => {
  const { gridSizeR, gridSizeC, words } = puzzleData;

  for (const w of words) {
    let slotCount = 0;
    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;

      if (!gridData[r] || !gridData[r][c] || !gridData[r][c].isActive) {
        throw new Error(
          `Word "${w.ans}" (${w.dir} #${w.num}) has an inactive/missing cell at (${r},${c})`
        );
      }
      if (gridData[r][c].correctChar !== w.ans[i]) {
        throw new Error(
          `Word "${w.ans}" (${w.dir} #${w.num}): cell (${r},${c}) has "${gridData[r][c].correctChar}" instead of "${w.ans[i]}"`
        );
      }
      slotCount++;
    }
    if (slotCount !== w.ans.length) {
      throw new Error(
        `Word "${w.ans}" (${w.dir} #${w.num}): slot count ${slotCount} ≠ word length ${w.ans.length}`
      );
    }
  }

  // Check for duplicate word ids (two words with same number+direction)
  const idSet = new Set();
  for (const w of words) {
    if (idSet.has(w.id)) {
      throw new Error(`Duplicate word id detected: "${w.id}"`);
    }
    idSet.add(w.id);
  }
};

// ─── Worker entry point ───────────────────────────────────────────────────────

self.onmessage = (e) => {
  const { type, words } = e.data;
  if (type !== 'GENERATE') return;

  const MAX_RETRIES = 5;
  let lastError = null;

  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    try {
      const puzzleData = generateLayout(words);
      const gridData = generateGridData(puzzleData);

      // Final pre-render validation – if this throws, retry
      validatePuzzle(puzzleData, gridData);

      self.postMessage({ success: true, puzzleData, gridData });
      return;
    } catch (error) {
      lastError = error;
      // Continue to next retry
    }
  }

  // All retries exhausted
  self.postMessage({ success: false, error: lastError?.message ?? 'Unknown generation error' });
};
