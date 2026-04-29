import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, Search, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import LevelSelector from './LevelSelector';
import CompletionModal from './CompletionModal';
import useGameProgress from './useGameProgress';

const FALLBACK_LEVEL_WORDS = {
  easy: ["DNA", "BLOOD", "FIBER", "TRACE"],
  medium: ["FORENSIC", "EVIDENCE", "AUTOPSY", "TOXIC", "POISON", "CRIME"],
  hard: ["FINGERPRINT", "BALLISTICS", "PATHOLOGY", "CYBERCRIME", "WEAPON", "SUSPECT", "VICTIM", "WITNESS", "DETECTIVE"],
  pro: ["CHROMATOGRAPHY", "ENTOMOLOGY", "SEROLOGY", "CRIMINOLOGY", "TOXICOLOGY", "DNA", "BLOOD", "FIBER", "TRACE", "FORENSIC", "EVIDENCE", "AUTOPSY"]
};

const WORD_SEARCH_LEVELS = {
  easy:    { words: 4, grid: 6 },
  medium:  { words: 6, grid: 8 },
  hard:    { words: 9, grid: 12 },
  pro:     { words: 12, grid: 15 }
};

const DIRECTIONS = [
  [0, 1],   // Right
  [1, 0],   // Down
  [1, 1],   // Diagonal Down-Right
  [-1, 1],  // Diagonal Up-Right
  [0, -1],  // Left
  [-1, 0],  // Up
  [-1, -1], // Diagonal Up-Left
  [1, -1]   // Diagonal Down-Left
];

const generateGrid = (wordsPool, config) => {
  const { words: numWords, grid: gridSize } = config;
  const validWords = wordsPool.filter(w => w.length <= gridSize);
  
  if (validWords.length < numWords) return null;
  
  const shuffled = [...validWords].sort(() => 0.5 - Math.random());
  const selectedWords = shuffled.slice(0, numWords);

  let grid = null;
  let allPlaced = false;
  let gridAttempts = 0;

  const canPlaceWord = (word, startRow, startCol, dr, dc, tempGrid) => {
    for (let i = 0; i < word.length; i++) {
      let r = startRow + i * dr;
      let c = startCol + i * dc;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
      if (tempGrid[r][c] !== '' && tempGrid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (word, tempGrid) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      let r = Math.floor(Math.random() * gridSize);
      let c = Math.floor(Math.random() * gridSize);
      let dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      let [dr, dc] = dir;

      if (canPlaceWord(word, r, c, dr, dc, tempGrid)) {
        for (let i = 0; i < word.length; i++) {
          tempGrid[r + i * dr][c + i * dc] = word[i];
        }
        placed = true;
      }
      attempts++;
    }
    return placed;
  };

  while (!allPlaced && gridAttempts < 200) {
    let tempGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    allPlaced = true;
    for (const word of selectedWords) {
      if (!placeWord(word, tempGrid)) {
        allPlaced = false;
        break;
      }
    }
    if (allPlaced) grid = tempGrid;
    gridAttempts++;
  }

  if (!grid) return null;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters.charAt(Math.floor(Math.random() * letters.length));
      }
    }
  }

  return { grid, wordsToFind: selectedWords, gridSize };
};

const getPath = (r1, c1, r2, c2) => {
  const dr = r2 - r1;
  const dc = c2 - c1;
  if (dr === 0 && dc === 0) return [{ r: r1, c: c1 }];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [{ r: r1, c: c1 }];
  const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
  const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  let path = [];
  for (let i = 0; i <= steps; i++) {
    path.push({ r: r1 + i * stepR, c: c1 + i * stepC });
  }
  return path;
};

const Cell = memo(({ letter, r, c, isSelected, isFound, onPointerDown, onPointerMove, onPointerUp }) => (
  <div
    data-row={r}
    data-col={c}
    onPointerDown={(e) => onPointerDown(e, r, c)}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    className={cn(
      "aspect-square w-full box-border flex items-center justify-center font-bold text-xs sm:text-sm md:text-base cursor-pointer select-none rounded-sm transition-colors shadow-sm",
      isFound
        ? "bg-primary text-white shadow-inner"
        : isSelected
          ? "bg-primary/20 text-primary ring-2 ring-primary/50"
          : "bg-white text-slate-900"
    )}
  >
    {letter}
  </div>
));
Cell.displayName = 'Cell';

export default function WordSearchGame({ onQuit }) {
  const { isUnlocked, unlockNextLevel } = useGameProgress('wordsearch');
  const [level, setLevel] = useState('easy');
  
  const [wordsPool, setWordsPool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);

  const [foundWords, setFoundWords] = useState([]);
  const [foundCells, setFoundCells] = useState(new Set());
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  const gameSectionRef = useRef(null);

  const loadLevel = async (lvl) => {
    setIsLoading(true);
    const cacheKey = `wordsearch-${lvl}`;
    const cached = localStorage.getItem(cacheKey);
    let data;

    try {
      if (cached) {
        data = JSON.parse(cached);
      } else {
        const res = await api.get(`/game/word-search?level=${lvl}`);
        if (!res.data || !res.data.words || res.data.words.length === 0) throw new Error("Empty dataset");
        data = res.data;
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
      setWordsPool(data.words);
    } catch (err) {
      console.error("Data load failed:", err);
      // Fallback ONLY here
      setWordsPool(FALLBACK_LEVEL_WORDS[lvl]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLevel(level);
  }, [level]);

  useEffect(() => {
    const levels = ["easy", "medium", "hard", "pro"];
    const idx = levels.indexOf(level);
    if (idx >= 0 && idx < levels.length - 1) {
       const nextLvl = levels[idx+1];
       const preloadLevel = async (lvl) => {
         const cacheKey = `wordsearch-${lvl}`;
         if (!localStorage.getItem(cacheKey)) {
           try {
             const res = await api.get(`/game/word-search?level=${lvl}`);
             if (res.data && res.data.words) localStorage.setItem(cacheKey, JSON.stringify(res.data));
           } catch {}
         }
       };
       preloadLevel(nextLvl);
    }
  }, [level]);

  const generateGameData = useCallback((pool, lvl) => {
    let attempts = 0;
    if (pool && pool.length > 0) {
      while (attempts < 50) {
        const game = generateGrid(pool, WORD_SEARCH_LEVELS[lvl]);
        if (game) return game;
        attempts++;
      }
    }
    
    // Fallback if pool is empty or if it failed to generate 50 times
    attempts = 0;
    while (attempts < 50) {
      const fallbackGame = generateGrid(FALLBACK_LEVEL_WORDS[lvl], WORD_SEARCH_LEVELS[lvl]);
      if (fallbackGame) return fallbackGame;
      attempts++;
    }
    return null;
  }, []);

  useEffect(() => {
    if ((gameState === 'idle' || gameState === 'playing') && wordsPool) {
      const next = generateGameData(wordsPool, level);
      setNextGame(next);
    }
  }, [wordsPool, level, gameState, generateGameData]);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'completed') document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [gameState]);

  const handleStartGameClick = () => {
    setGameState('loading');
    setTimeout(() => gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    
    // Yield to the main thread so the loading skeleton renders
    setTimeout(() => {
      const gameToPlay = nextGame || generateGameData(wordsPool, level);
      
      setCurrentGame(gameToPlay);
      setFoundWords([]);
      setFoundCells(new Set());
      setTimeElapsed(0);
      setGameState('playing');
      setIsDragging(false);
      setStartCell(null);
      setCurrentPath([]);
    }, 50);
  };

  const initGame = () => {
    setGameState('idle');
    setTimeout(() => handleStartGameClick(), 50);
  };

  const handleLevelChange = (newLevel) => {
    if (!isUnlocked(newLevel)) return;
    setLevel(newLevel);
    if (gameState === 'playing' || gameState === 'completed') {
      setGameState('idle');
      setCurrentGame(null);
    }
  };

  const handlePointerDown = useCallback((e, r, c) => {
    if (gameState !== 'playing') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setStartCell({ r, c });
    setCurrentPath([{ r, c }]);
  }, [gameState]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !startCell || gameState !== 'playing') return;
    e.preventDefault();
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element && element.dataset.row) {
      const r = parseInt(element.dataset.row);
      const c = parseInt(element.dataset.col);
      const path = getPath(startCell.r, startCell.c, r, c);
      setCurrentPath(path);
    }
  }, [isDragging, startCell, gameState]);

  const handlePointerUp = useCallback((e) => {
    if (e && e.currentTarget && e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    if (!isDragging || gameState !== 'playing' || !currentGame) return;

    let word = "";
    currentPath.forEach(({ r, c }) => { word += currentGame.grid[r][c]; });
    let revWord = word.split('').reverse().join('');

    const matchedWord = currentGame.wordsToFind.find(w => (w === word || w === revWord) && !foundWords.includes(w));

    if (matchedWord) {
      setFoundWords(prev => {
        const newFound = [...prev, matchedWord];
        if (newFound.length === currentGame.wordsToFind.length) {
          setGameState('completed');
          unlockNextLevel(level);
        }
        return newFound;
      });

      setFoundCells(prev => {
        const newSet = new Set(prev);
        currentPath.forEach(({ r, c }) => newSet.add(`${r},${c}`));
        return newSet;
      });
    }

    setIsDragging(false);
    setStartCell(null);
    setCurrentPath([]);
  }, [isDragging, currentPath, currentGame, foundWords, gameState, level]);

  useEffect(() => {
    const handleGlobalPointerUp = () => { if (isDragging) handlePointerUp(); };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging, handlePointerUp]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCellInPath = (r, c) => currentPath.some(p => p.r === r && p.c === c);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans animate-in fade-in duration-500">
      <section className="relative pt-32 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-12 min-h-[340px]">
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <button onClick={onQuit} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium backdrop-blur-md shadow-sm">
            <ArrowLeft size={18} /> Back to Games
          </button>
        </div>
        <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        </div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto pt-8 md:pt-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Forensic Word Search</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Find hidden forensic and investigative terms within the grid. Test your observation skills.</p>
          </div>
        </Container>
      </section>

      {gameState === 'idle' && (
        <Container id="levelSelectionArea" className="mb-12 relative z-10 scroll-mt-32">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Select Difficulty</h2>
            <LevelSelector currentLevel={level} onSelectLevel={handleLevelChange} isUnlocked={isUnlocked} />
            <div className="mt-8 flex justify-center px-3">
              <button 
                onClick={handleStartGameClick} 
                disabled={isLoading || !nextGame}
                className="w-full max-w-[260px] mx-auto flex items-center justify-center gap-2 text-[13px] min-[320px]:text-sm sm:text-base font-bold px-[12px] py-[10px] min-[320px]:px-4 min-[320px]:py-3 sm:px-6 sm:py-4 rounded-[10px] min-[320px]:rounded-xl bg-accent hover:bg-accent-light text-slate-900 transition-all duration-200 shadow-lg hover:shadow-accent/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Start Game
                  </>
                )}
              </button>
            </div>
          </div>
        </Container>
      )}

      <div ref={gameSectionRef} id="gameStart" className="scroll-mt-32 relative z-10">
        {gameState === 'loading' && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-32 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3 flex-shrink-0 relative w-full flex justify-center items-center overflow-hidden pb-4 px-2 box-border">
                  <div className="w-full aspect-square max-w-[80vh] rounded-xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:400%_100%] animate-[shimmer_1.2s_infinite]"></div>
                </div>
                <div className="lg:w-1/3 flex flex-col">
                  <div className="h-64 bg-slate-100 animate-pulse rounded-xl"></div>
                </div>
              </div>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                  0% { background-position: 100% 0; }
                  100% { background-position: -100% 0; }
                }
              `}} />
            </div>
          </Container>
        )}

        {(gameState === 'playing' || gameState === 'completed') && currentGame && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Search className="text-primary" size={24} /> Find the Words <span className="text-sm font-normal text-slate-500 uppercase ml-2 bg-slate-100 px-2 py-1 rounded">{level}</span>
                  </h2>
                  <p className="text-slate-500 mt-1">Select letters in straight lines to form words.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" /> {formatTime(timeElapsed)}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Progress</p>
                    <div className="text-xl font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">
                      {foundWords.length} / {currentGame.wordsToFind.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3 flex-shrink-0 relative w-full flex justify-center items-center overflow-hidden pb-4 px-2 box-border">
                  <div
                    className="grid gap-[1px] sm:gap-0.5 md:gap-1 bg-slate-100 p-1.5 sm:p-3 rounded-xl select-none mx-auto w-full max-w-[80vh] max-h-[80vh]"
                    style={{ gridTemplateColumns: `repeat(${currentGame.gridSize}, minmax(0, 1fr))`, touchAction: 'none' }}
                  >
                    {currentGame.grid.map((row, r) =>
                      row.map((letter, c) => {
                        const cellId = `${r},${c}`;
                        return (
                          <Cell
                            key={cellId} r={r} c={c} letter={letter}
                            isSelected={isCellInPath(r, c)}
                            isFound={foundCells.has(cellId)}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                          />
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full flex flex-col max-h-[80vh]">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Target Words</h3>
                    <div className="flex flex-wrap lg:flex-col gap-2 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                      {currentGame.wordsToFind.map((word) => (
                        <div key={word} className={cn("px-3 py-2 rounded-lg text-sm font-semibold transition-colors", foundWords.includes(word) ? "bg-green-100 text-green-800 line-through shadow-inner border border-green-200" : "bg-white text-slate-900 shadow-sm border border-slate-300")}>
                          {word}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-8 flex flex-col gap-3">
                      <Button onClick={initGame} variant="outline" className="w-full flex items-center justify-center gap-2 font-bold text-slate-600 hover:text-slate-900 border-slate-300">
                        <RefreshCw size={16} /> Restart Puzzle
                      </Button>
                      <button onClick={onQuit} className="w-full py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Quit Game
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )}

        {gameState === 'completed' && (
          <CompletionModal
            level={level}
            timeElapsed={formatTime(timeElapsed)}
            moves={null}
            onPlayAgain={initGame}
            onNextLevel={() => {
              const next = unlockNextLevel(level) || 'easy';
              setLevel(next);
              setGameState('idle');
              setCurrentGame(null);
            }}
            onQuit={onQuit}
          />
        )}
      </div>
    </div>
  );
}
