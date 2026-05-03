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

// ─── Subset Optimization ────────────────────────────────────────────────────────

const GRID_LIMITS = {
  easy:   7,
  medium: 8,
  hard:   10,
  pro:    10,
};

function selectMobileOptimizedWords(allWords) {
  // Step 1: sort by shortest length first, but keep them reasonably long for intersections
  const sorted = [...allWords].sort((a, b) => a.word.length - b.word.length);

  let selected = [];

  // Pick a good starting word (medium length)
  const startIdx = Math.floor(sorted.length / 2);
  if (sorted.length > 0) {
    selected.push(sorted[startIdx]);
    sorted.splice(startIdx, 1);
  }

  while (selected.length < 9 && sorted.length > 0) {
    let bestWord = null;
    let bestScore = -1;
    let bestIdx = -1;

    for (let i = 0; i < sorted.length; i++) {
      const wordObj = sorted[i];
      let overlapCount = 0;
      
      // Count how many unique letters this word shares with the already selected words
      const letters = new Set(wordObj.word.split(''));
      for (const w of selected) {
        for (const l of letters) {
          if (w.word.includes(l)) {
             overlapCount++;
          }
        }
      }

      if (overlapCount > bestScore) {
        bestScore = overlapCount;
        bestWord = wordObj;
        bestIdx = i;
      }
    }

    if (bestScore > 0) {
      selected.push(bestWord);
      sorted.splice(bestIdx, 1);
    } else {
      // If no overlap found, just pick the next shortest to fill
      selected.push(sorted[0]);
      sorted.splice(0, 1);
    }
  }

  return selected;
}

function selectOptimalWords(allWords, limit = 10) {
  if (!allWords || allWords.length === 0) return [];
  // Step 1: sort by length (desc)
  const sorted = [...allWords].sort((a, b) => b.word.length - a.word.length);

  // Step 2: pick top candidates by intersection potential
  let selected = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const word = sorted[i];

    const hasCommonLetter = selected.some(w =>
      w.word.split("").some(letter => word.word.includes(letter))
    );

    if (hasCommonLetter) {
      selected.push(word);
    }

    if (selected.length === limit) break;
  }

  // fallback: fill to minimum 7 if possible
  while (selected.length < 7 && selected.length < sorted.length) {
    const unselected = sorted.filter(w => !selected.includes(w));
    if (unselected.length === 0) break;
    selected.push(unselected[0]);
  }

  return selected.slice(0, limit);
}

function prepareWordsForGrid(allWords, level, isMobileSmall) {
  if (isMobileSmall) {
    return selectMobileOptimizedWords(allWords);
  }
  const limit = GRID_LIMITS[level] || 10;
  return selectOptimalWords(allWords, limit);
}

// ─── Main layout generator ────────────────────────────────────────────────────

const generateLayoutCore = (wordList, level = 'easy', isMobileSmall = false, maxCols = 15) => {
  if (!wordList || wordList.length === 0) return { gridSizeR: 0, gridSizeC: 0, words: [] };

  let pool = [...wordList];
  if (isMobileSmall) {
    const MOBILE_MAX_LENGTH = 8;
    const filtered = pool.filter(w => w.word.length <= MOBILE_MAX_LENGTH);
    if (filtered.length >= 3) {
      pool = filtered;
    }
  }

  // Always optimize — select best intersecting subset capped to GRID_LIMITS[level]
  const optimizedWords = prepareWordsForGrid(pool, level, isMobileSmall);

  const seen = new Set();
  const inputClues = optimizedWords
    .map(w => ({ answer: w.word.toUpperCase().replace(/[^A-Z]/g, ''), clue: w.clue.trim() }))
    .filter(w => {
      if (w.answer.length < 3 || seen.has(w.answer)) return false;
      seen.add(w.answer);
      return true;
    });

  if (inputClues.length === 0) throw new Error('No valid words to generate a crossword.');

  const MAX_ATTEMPTS = 150;

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
    // Attempt 0: Strictly sorted by length (longest first)
    // Other attempts: Sorted with random jitter to explore alternative packings
    const ordered = [...inputClues].sort((a, b) => {
      if (attempt === 0) return b.answer.length - a.answer.length;
      const lenDiff = b.answer.length - a.answer.length;
      const randomJitter = (Math.random() - 0.5) * 6;
      return lenDiff + randomJitter;
    });

    const layout = silentCall(() => crosswordLib.generateLayout(ordered));
    if (!layout?.result) continue;

    const placed = parseRaw(layout.result);
    if (placed.length === 0) continue;

    // Compute bounds before validation so we can pass gridSizeR/C
    const { minR, maxR, minC, maxC } = computeBounds(placed);
    const gridSizeR = maxR - minR + 1;
    const gridSizeC = maxC - minC + 1;

    // Strict column enforcement
    if (gridSizeC > maxCols) continue;

    // Normalize to zero-origin
    const normalized = placed.map(w => ({ ...w, r: w.r - minR, c: w.c - minC }));

    // Strict layout validation
    if (!isValidLayout(normalized, gridSizeR, gridSizeC)) continue;

    // Keep only the largest connected component
    const connected = keepLargestComponent(normalized);
    if (connected.length < 3) continue;

    // Re-validate the connected subset
    const { minR: cr, maxR: eR, minC: cc, maxC: eC } = computeBounds(connected);
    const cGridR = eR - cr + 1;
    const cGridC = eC - cc + 1;
    const reNorm = connected.map(w => ({ ...w, r: w.r - cr, c: w.c - cc }));

    if (!isValidLayout(reNorm, cGridR, cGridC)) continue;

    // SCORING LOGIC:
    // 1. Maximize connected words (highest priority)
    // 2. Minimize bounding box area (trim unused space, pack tightly)
    // 3. Maximize overlaps naturally by minimizing area for the same word count
    const area = cGridR * cGridC;
    // Tighter packing: penalize width to encourage vertical growth if it saves space, but primarily minimize area
    const score = (connected.length * 100000) - (area * 10) - cGridC;

    if (!best || score > best.score) {
      best = { score, words: reNorm, gridSizeR: cGridR, gridSizeC: cGridC };
    }
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

const generateLayout = (wordList, level = 'easy', isMobileSmall = false, maxCols = 15) => {
  if (!isMobileSmall) {
    return generateLayoutCore(wordList, level, false, maxCols);
  }

  const isRestricted = level === 'hard' || level === 'pro';
  const minWordsRequired = isRestricted ? Math.min(6, wordList.length) : 3;
  const MOBILE_MAX_COLS = maxCols;
  
  let attemptWords = [...wordList];

  while (attemptWords.length >= minWordsRequired) {
    try {
      const grid = generateLayoutCore(attemptWords, level, true, maxCols);
      // Only accept if it fits the columns AND contains the minimum required words
      if (grid.gridSizeC <= MOBILE_MAX_COLS && grid.words.length >= minWordsRequired) {
        return grid;
      }
    } catch (e) {
      // Ignore generation failure, proceed to drop a word
    }
    
    // Remove the longest word to make it smaller
    attemptWords.sort((a, b) => a.word.length - b.word.length);
    attemptWords.pop();
  }

  // Fallback if all strictly constrained grids fail
  // We STILL enforce maxCols to prevent completely broken layouts
  return generateLayoutCore(wordList, level, true, maxCols);
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
  const { type, words, level, isMobileSmall, maxCols } = e.data;
  if (type !== 'GENERATE') return;

  const MAX_RETRIES = 5;
  let lastError = null;

  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    try {
      const puzzleData = generateLayout(words, level, isMobileSmall, maxCols);
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
