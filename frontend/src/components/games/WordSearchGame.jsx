import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, Trophy, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';

const FALLBACK_WORDS = [
  'FORENSIC',
  'EVIDENCE',
  'DNA',
  'CRIME',
  'ANALYSIS',
  "FINGERPRINT"
];

const GRID_SIZE = 14;

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

const generateGrid = (wordsToFind) => {
  let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

  const canPlaceWord = (word, startRow, startCol, dr, dc) => {
    for (let i = 0; i < word.length; i++) {
      let r = startRow + i * dr;
      let c = startCol + i * dc;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (word) => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      let r = Math.floor(Math.random() * GRID_SIZE);
      let c = Math.floor(Math.random() * GRID_SIZE);
      let dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      let [dr, dc] = dir;

      if (canPlaceWord(word, r, c, dr, dc)) {
        for (let i = 0; i < word.length; i++) {
          grid[r + i * dr][c + i * dc] = word[i];
        }
        placed = true;
      }
      attempts++;
    }
    return placed;
  };

  let allPlaced = false;
  let gridAttempts = 0;

  while (!allPlaced && gridAttempts < 50) {
    grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    allPlaced = true;
    for (const word of wordsToFind) {
      if (!placeWord(word)) {
        allPlaced = false;
        break;
      }
    }
    gridAttempts++;
  }

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters.charAt(Math.floor(Math.random() * letters.length));
      }
    }
  }

  return grid;
};

const getPath = (r1, c1, r2, c2) => {
  const dr = r2 - r1;
  const dc = c2 - c1;

  if (dr === 0 && dc === 0) return [{ r: r1, c: c1 }];

  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
    return [{ r: r1, c: c1 }];
  }

  const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
  const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  let path = [];
  for (let i = 0; i <= steps; i++) {
    path.push({ r: r1 + i * stepR, c: c1 + i * stepC });
  }
  return path;
};

const Cell = memo(({ letter, r, c, isSelected, isFound, onPointerDown, onPointerMove, onPointerUp }) => {
  return (
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
  );
});
Cell.displayName = 'Cell';

export default function WordSearchGame({ onQuit }) {
  const [wordsToFind, setWordsToFind] = useState([]);

  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundCells, setFoundCells] = useState(new Set());
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  const gridRef = useRef(null);
  const gameSectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleStartGameClick = async () => {
    setGameState('loading');

    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    let activeWords = [];
    try {
      const storedPlayedIds = JSON.parse(localStorage.getItem('playedWordSearchIds') || '[]');
      const res = await api.get(`/game/word-search?playedIds=${storedPlayedIds.join(',')}`);
      
      if (res.data && res.data.words && res.data.words.length >= 5) {
        activeWords = res.data.words;
        
        if (res.data.resetOccurred) {
          localStorage.setItem('playedWordSearchIds', JSON.stringify([res.data._id]));
        } else {
          localStorage.setItem('playedWordSearchIds', JSON.stringify([...storedPlayedIds, res.data._id]));
        }
      } else {
        throw new Error("Invalid active word set");
      }
    } catch (err) {
      console.error("Using fallback words. Error:", err.message);
      activeWords = FALLBACK_WORDS;
    }

    setWordsToFind(activeWords);
    setGrid(generateGrid(activeWords));
    setFoundWords([]);
    setFoundCells(new Set());
    setTimeElapsed(0);
    setGameState('playing');
    setIsDragging(false);
    setStartCell(null);
    setCurrentPath([]);
  };

  const initGame = () => {
    handleStartGameClick();
  };

  const triggerConfetti = () => {
    const burstDiv = document.createElement('div');
    burstDiv.className = 'fixed inset-0 pointer-events-none z-[200] overflow-hidden';

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes floatUp {
        0% { transform: translateY(100vh) scale(0); opacity: 1; }
        100% { transform: translateY(-10vh) scale(1); opacity: 0; }
      }
      .particle {
        position: absolute;
        bottom: 0;
        width: 6px;
        height: 6px;
        background-color: #0f172a;
        border-radius: 50%;
        animation: floatUp 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      burstDiv.appendChild(particle);
    }

    document.body.appendChild(burstDiv);
    setTimeout(() => {
      if (document.body.contains(burstDiv)) document.body.removeChild(burstDiv);
      if (document.head.contains(style)) document.head.removeChild(style);
    }, 2500);
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
    e.preventDefault(); // Prevent touch scroll

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
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) { }
    }

    if (!isDragging || gameState !== 'playing') return;

    let word = "";
    let revWord = "";
    currentPath.forEach(({ r, c }) => {
      word += grid[r][c];
    });

    revWord = word.split('').reverse().join('');

    const matchedWord = wordsToFind.find(w => (w === word || w === revWord) && !foundWords.includes(w));

    if (matchedWord) {
      setFoundWords(prev => {
        const newFound = [...prev, matchedWord];
        if (newFound.length === wordsToFind.length) {
          setGameState('completed');
          triggerConfetti();
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
  }, [isDragging, currentPath, grid, foundWords, gameState, wordsToFind]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) handlePointerUp();
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging, handlePointerUp]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isCellInPath = (r, c) => {
    return currentPath.some(p => p.r === r && p.c === c);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans animate-in fade-in duration-500">
      <section className="relative pt-32 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-12" style={{ minHeight: '340px' }}>
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <button
            onClick={onQuit}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium backdrop-blur-md shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Games
          </button>
        </div>
        <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        </div>
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto pt-8 md:pt-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Forensic Word Search
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Find hidden forensic and investigative terms within the grid. Test your observation skills.
            </p>
          </div>
        </Container>
      </section>

      {gameState === 'idle' && (
        <Container className="mb-12 relative z-10">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to Begin?</h2>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
              Test your analytical and observation skills with this interactive forensic exercise.
            </p>
            <Button onClick={handleStartGameClick} variant="primary" className="px-8 py-3 text-lg flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg transition-all">
              <Play size={20} /> Start Game
            </Button>
          </div>
        </Container>
      )}

      <div ref={gameSectionRef} className="scroll-mt-32 relative z-10">

        {gameState === 'loading' && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-32 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3">
                  <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse w-full"></div>
                </div>
                <div className="lg:w-1/3 flex flex-col gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        )}

        {(gameState === 'playing' || gameState === 'completed') && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Search className="text-primary" size={24} />
                    Find the Words
                  </h2>
                  <p className="text-slate-500 mt-1">Select letters in straight lines to form words.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" />
                      {formatTime(timeElapsed)}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Progress</p>
                    <div className="text-xl font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">
                      {foundWords.length} / {wordsToFind.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3 flex-shrink-0 relative w-full overflow-hidden pb-4 px-2 box-border">
                  <div
                    ref={gridRef}
                    className="grid gap-[1px] sm:gap-0.5 md:gap-1 bg-slate-100 p-1.5 sm:p-3 rounded-xl select-none w-full box-border mx-auto"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, touchAction: 'none' }}
                  >
                    {grid.map((row, r) =>
                      row.map((letter, c) => {
                        const cellId = `${r},${c}`;
                        const isFound = foundCells.has(cellId);
                        const isSelected = isCellInPath(r, c);

                        return (
                          <Cell
                            key={cellId}
                            r={r}
                            c={c}
                            letter={letter}
                            isSelected={isSelected}
                            isFound={isFound}
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
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Target Words</h3>
                    <div className="flex flex-wrap lg:flex-col gap-2 overflow-y-auto max-h-[300px] lg:max-h-none" style={{ scrollbarWidth: 'none' }}>
                      {wordsToFind.map((word) => {
                        const isFound = foundWords.includes(word);
                        return (
                          <div
                            key={word}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                              isFound
                                ? "bg-green-100 text-green-800 line-through shadow-inner border border-green-200"
                                : "bg-white text-slate-900 shadow-sm border border-slate-300"
                            )}
                          >
                            {word}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto pt-8 flex flex-col gap-3">
                      <Button onClick={initGame} variant="outline" className="w-full flex items-center justify-center gap-2 font-bold text-slate-600 hover:text-slate-900 border-slate-300">
                        <RefreshCw size={16} /> Restart Puzzle
                      </Button>
                      <button
                        onClick={onQuit}
                        className="w-full py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Quit Game
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {gameState === 'completed' && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100/50">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-slate-900 mb-2 tracking-tight">Puzzle Completed</h3>
                  <p className="text-slate-600 mb-8 max-w-md text-base leading-relaxed">
                    You have successfully completed the forensic word search.
                    <br /><br />
                    <span className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      Time: <span className="text-primary font-bold">{formatTime(timeElapsed)}</span> • Words: <span className="text-primary font-bold">{wordsToFind.length}</span>
                    </span>
                  </p>

                  <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3 w-full justify-center max-w-sm mx-auto">
                    <button
                      onClick={initGame}
                      className="w-full sm:w-auto h-10 px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all font-bold rounded-lg whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Play Again</span>
                      <span className="sm:hidden">Replay</span>
                    </button>
                    <button
                      onClick={onQuit}
                      className="w-full sm:w-auto h-10 px-6 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center"
                    >
                      Back to Games
                    </button>
                  </div>
                </div>
              )}

            </div>
          </Container>
        )}
      </div>
    </div>
  );
}
