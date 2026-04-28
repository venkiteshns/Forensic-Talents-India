import crosswordLib from 'crossword-layout-generator';

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
      let shared = false;
      for (const cell of wordCells[i]) {
        if (wordCells[j].has(cell)) { shared = true; break; }
      }
      if (shared) { adj[i].push(j); adj[j].push(i); }
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

  const MAX_ATTEMPTS = 50;

  const isValidLayout = (placedWords) => {
    const grid = {};
    for (const w of placedWords) {
      for (let i = 0; i < w.ans.length; i++) {
        const r = w.dir === 'across' ? w.r : w.r + i;
        const c = w.dir === 'across' ? w.c + i : w.c;
        const key = `${r}-${c}`;
        
        // Strict intersection validation: No conflicting letters allowed
        if (grid[key] && grid[key] !== w.ans[i]) {
          return false;
        }
        grid[key] = w.ans[i];
      }
    }
    
    // Strict continuity validation: Ensure no "holes" and grid is perfectly contiguous for all words
    for (const w of placedWords) {
      for (let i = 0; i < w.ans.length; i++) {
        const r = w.dir === 'across' ? w.r : w.r + i;
        const c = w.dir === 'across' ? w.c + i : w.c;
        if (!grid[`${r}-${c}`]) {
          return false;
        }
      }
    }
    
    return true;
  };

  const scoreResult = (rawResult) => {
    if (!rawResult) return { score: -1, placed: [], connected: [] };
    const placed = rawResult.filter(item => item.orientation !== 'none').map((item, i) => ({
      id: `${i + 1}${item.orientation === 'across' ? 'A' : 'D'}`,
      num: i + 1,
      dir: item.orientation,
      ans: item.answer,
      clue: item.clue,
      r: item.starty - 1,
      c: item.startx - 1,
    }));
    
    if (!isValidLayout(placed)) {
      return { score: -1, placed: [], connected: [] };
    }
    
    const connected = keepLargestComponent(placed);
    const score = placed.length * 10 + connected.length * 5;
    return { score, placed, connected };
  };

  let best = { score: -1, placed: [], connected: [] };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Always shuffle for maximum randomization across queue generations
    const ordered = shuffleArray(inputClues);

    const layout = silentCall(() => crosswordLib.generateLayout(ordered));
    if (!layout?.result) continue;

    const candidate = scoreResult(layout.result);
    // Add small random noise to score to avoid identical layouts winning every time
    candidate.score += Math.random() * 0.5;

    if (candidate.score > best.score) best = candidate;
    if (best.connected.length === inputClues.length) break;
  }

  const finalWords = best.connected.length >= 3 ? best.connected : best.placed;
  if (finalWords.length < 3) {
    throw new Error(`Only ${finalWords.length} word(s) could be connected. Need at least 3.`);
  }

  let num = 1;
  const numberedWords = finalWords.map(pw => ({
    ...pw,
    id: `${num}${pw.dir === 'across' ? 'A' : 'D'}`,
    num: num++,
  }));

  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  numberedWords.forEach(pw => {
    const endR = pw.dir === 'down' ? pw.r + pw.ans.length - 1 : pw.r;
    const endC = pw.dir === 'across' ? pw.c + pw.ans.length - 1 : pw.c;
    if (pw.r < minR) minR = pw.r; if (endR > maxR) maxR = endR;
    if (pw.c < minC) minC = pw.c; if (endC > maxC) maxC = endC;
  });

  numberedWords.forEach(pw => { pw.r -= minR; pw.c -= minC; });

  const gridSizeR = maxR - minR + 1;
  const gridSizeC = maxC - minC + 1;

  const safeWords = numberedWords.filter(pw => {
    const endR = pw.dir === 'down' ? pw.r + pw.ans.length - 1 : pw.r;
    const endC = pw.dir === 'across' ? pw.c + pw.ans.length - 1 : pw.c;
    if (endR >= gridSizeR || endC >= gridSizeC) return false;
    return true;
  });

  if (safeWords.length < 3) throw new Error('Too few words remain after safety filtering.');

  return { gridSizeR, gridSizeC, words: safeWords };
};

const generateGridData = (puzzleData) => {
  if (!puzzleData || !puzzleData.words || puzzleData.gridSizeR === 0) return [];

  const makeCell = () => ({ isActive: false, correctChar: '', num: null, words: [] });
  const grid = Array.from({ length: puzzleData.gridSizeR }, () =>
    Array.from({ length: puzzleData.gridSizeC }, makeCell)
  );

  puzzleData.words.forEach(w => {
    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;

      if (r < 0 || r >= puzzleData.gridSizeR || c < 0 || c >= puzzleData.gridSizeC) {
        throw new Error(`Word ${w.ans} out of bounds at ${r},${c}`);
      }

      if (grid[r][c].isActive && grid[r][c].correctChar !== w.ans[i]) {
        throw new Error(`Fatal collision detected at ${r},${c} for ${w.ans}`);
      }

      grid[r][c] = {
        ...grid[r][c],
        isActive: true,
        correctChar: w.ans[i],
        num: i === 0 ? w.num : grid[r][c].num,
        words: [...grid[r][c].words, w.id],
      };
    }
  });

  return grid;
};

self.onmessage = (e) => {
  const { type, words } = e.data;
  if (type === 'GENERATE') {
    try {
      const puzzleData = generateLayout(words);
      const gridData = generateGridData(puzzleData);
      self.postMessage({ success: true, puzzleData, gridData });
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    }
  }
};
