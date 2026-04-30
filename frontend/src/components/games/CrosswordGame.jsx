import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, PenTool, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import CrosswordWorker from './crosswordWorker?worker';
import LevelSelector from './LevelSelector';
import CompletionModal from './CompletionModal';
import useGameProgress from './useGameProgress';
import { useScrollToRef } from '../../hooks/useScrollToRef';
import { crosswordFallbackData } from '../../data/crosswordFallback';

const isValidSet = (words) => {
  return words.every(w =>
    w.word &&
    w.clue &&
    w.word.length >= 3 &&
    /^[A-Z]+$/.test(w.word)
  );
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const CROSSWORD_LEVELS = {
  easy:    { words: 4 },
  medium:  { words: 6 },
  hard:    { words: 8 },
  pro:     { words: 10 }
};

const FALLBACK_PUZZLE = {
  puzzleData: {
    gridSizeR: 5, gridSizeC: 5,
    words: [
      { id: "1A", word: "CASE", clue: "Investigation matter", dir: "across", r: 0, c: 0, num: 1, ans: "CASE" },
      { id: "1D", word: "CELL", clue: "Prison room", dir: "down", r: 0, c: 0, num: 1, ans: "CELL" }
    ]
  },
  gridData: [
    [{ isActive: true, correctChar: "C", num: 1, words: ["1A", "1D"] }, { isActive: true, correctChar: "A", num: null, words: ["1A"] }, { isActive: true, correctChar: "S", num: null, words: ["1A"] }, { isActive: true, correctChar: "E", num: null, words: ["1A"] }, { isActive: false, correctChar: "", num: null, words: [] }],
    [{ isActive: true, correctChar: "E", num: null, words: ["1D"] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }],
    [{ isActive: true, correctChar: "L", num: null, words: ["1D"] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }],
    [{ isActive: true, correctChar: "L", num: null, words: ["1D"] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }],
    [{ isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }, { isActive: false, correctChar: "", num: null, words: [] }]
  ]
};

const generatePuzzleWithWorker = (worker, words) => {
  return new Promise((resolve, reject) => {
    if (!worker) return reject(new Error("Worker not initialized"));
    
    const handleMessage = (e) => {
      worker.removeEventListener('message', handleMessage);
      if (e.data.success) resolve({ puzzleData: e.data.puzzleData, gridData: e.data.gridData });
      else reject(new Error(e.data.error));
    };
    
    worker.addEventListener('message', handleMessage);
    worker.postMessage({ type: 'GENERATE', words });
  });
};

const generateWithTimeout = (worker, words, ms = 15000) => {
  return Promise.race([
    generatePuzzleWithWorker(worker, words),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Generation timeout")), ms))
  ]);
};

export default function CrosswordGame({ onQuit }) {
  const { isUnlocked, unlockNextLevel } = useGameProgress('crossword');
  const [level, setLevel] = useState('easy');

  const [puzzleData, setPuzzleData] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [activeWordId, setActiveWordId] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [nextGameData, setNextGameData] = useState(null);
  const [wordsPool, setWordsPool] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const isGeneratingRef = useRef(false);
  const workerRef = useRef(null);

  const difficultySectionRef = useRef(null);
  const [startRef, scrollToStart] = useScrollToRef();
  const inputRefs = useRef({});

  const scrollToDifficultySection = () => {
    setTimeout(() => {
      if (!difficultySectionRef.current) return;
      if (window.innerWidth < 640) {
        difficultySectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } else {
        const yOffset = -80;
        const y = difficultySectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    }, 100);
  };


  const loadLevel = async (lvl) => {
    setIsDataLoading(true);
    const cacheKey = `crossword-${lvl}`;

    try {
      const res = await api.get(`/game/crossword?level=${lvl}`);
      const data = res.data;

      if (!data || !data.words || data.words.length === 0) {
        throw new Error("Empty dataset");
      }

      if (!isValidSet(data.words)) {
        throw new Error("Invalid dataset structure");
      }

      setWordsPool(data.words);
      localStorage.setItem(cacheKey, JSON.stringify(data.words));
      setIsOffline(false);

    } catch (err) {
      console.warn("Using fallback crossword:", err.message);

      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        setWordsPool(Array.isArray(parsed) ? parsed : parsed.words || crosswordFallbackData[lvl]);
      } else {
        setWordsPool(crosswordFallbackData[lvl]);
      }
      setIsOffline(true);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    workerRef.current = new CrosswordWorker();
    
    loadLevel(level);

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [level]);

  useEffect(() => {
    const levels = ["easy", "medium", "hard", "pro"];
    const idx = levels.indexOf(level);
    if (idx >= 0 && idx < levels.length - 1) {
       const nextLvl = levels[idx+1];
       const preloadLevel = async (lvl) => {
         const cacheKey = `crossword-${lvl}`;
         if (!localStorage.getItem(cacheKey)) {
           try {
             const res = await api.get(`/game/crossword?level=${lvl}`);
             if (res.data && res.data.words && isValidSet(res.data.words)) {
               localStorage.setItem(cacheKey, JSON.stringify(res.data.words));
             }
           } catch {}
         }
       };
       preloadLevel(nextLvl);
    }
  }, [level]);

  const generatePuzzle = useCallback(async (words, lvl) => {
    if (!workerRef.current || !words || words.length === 0) return null;
    
    const targetWords = CROSSWORD_LEVELS[lvl].words;
    let attempts = 0;
    while (attempts < 3) {
      // Pick a subset + some extra for better intersection chances
      const selectedWords = shuffle(words).slice(0, targetWords + 4);
      
      try {
        const result = await generateWithTimeout(workerRef.current, selectedWords, 10000);
        return result;
      } catch (err) {
        console.error("Worker generation failed, retrying...", getErrorMessage(err));
        attempts++;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (wordsPool.length > 0 && (gameState === 'idle' || gameState === 'playing') && !isGeneratingRef.current) {
      isGeneratingRef.current = true;
      generatePuzzle(wordsPool, level).then(res => {
        setNextGameData(res);
        isGeneratingRef.current = false;
      });
    }
  }, [wordsPool, level, gameState, generatePuzzle]);

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

  const applyPuzzle = (puzzle) => {
    setPuzzleData(puzzle.puzzleData);
    setGridData(puzzle.gridData);
    setUserInputs({});
    if (puzzle.puzzleData.words.length > 0) {
      setActiveWordId(puzzle.puzzleData.words[0].id);
      setActiveCell({ r: puzzle.puzzleData.words[0].r, c: puzzle.puzzleData.words[0].c });
    }
    setTimeElapsed(0);
    setGameState('playing');
  };

  const handleStartGameClick = async () => {
    setGameState('loading');

    let gameToPlay = nextGameData;
    if (!gameToPlay) {
      gameToPlay = await generatePuzzle(wordsPool, level);
    }

    if (!gameToPlay) {
      console.warn("Using fallback crossword data due to generation failure.");
      gameToPlay = FALLBACK_PUZZLE;
    }

    if (gameToPlay) {
      applyPuzzle(gameToPlay);
      setNextGameData(null); // Clear next game so it generates a new one
    }
  };

  const initGame = () => handleStartGameClick();

  const handleLevelChange = (newLevel) => {
    if (!isUnlocked(newLevel)) return;
    setLevel(newLevel);
    if (gameState !== 'idle') setGameState('idle');
  };

  const checkWin = (currentInputs) => {
    if (!puzzleData) return;
    let allCorrect = true;
    for (let r = 0; r < puzzleData.gridSizeR; r++) {
      for (let c = 0; c < puzzleData.gridSizeC; c++) {
        const cell = gridData[r] && gridData[r][c];
        if (cell && cell.isActive) {
          const userChar = currentInputs[`${r}-${c}`] || '';
          if (userChar.toUpperCase() !== cell.correctChar) {
            allCorrect = false;
            break;
          }
        }
      }
    }

    if (allCorrect) {
      setGameState('completed');
      unlockNextLevel(level);
    }
  };

  const moveTo = (r, c) => {
    if (gridData[r] && gridData[r][c] && gridData[r][c].isActive) {
      setActiveCell({ r, c });
      const cellWords = gridData[r][c].words;
      if (cellWords && cellWords.length > 0 && !cellWords.includes(activeWordId)) {
        setActiveWordId(cellWords[0]);
      }
      setTimeout(() => {
        inputRefs.current[`${r}-${c}`]?.focus();
      }, 0);
    }
  };

  const getDirection = () => {
    if (!activeWordId || !puzzleData) return 'across';
    const activeWord = puzzleData.words.find(w => w.id === activeWordId);
    return activeWord ? activeWord.dir : 'across';
  };

  const moveToNext = (r, c) => {
    if (getDirection() === "across") moveTo(r, c + 1);
    else moveTo(r + 1, c);
  };

  const moveToPrevious = (r, c) => {
    if (getDirection() === "across") {
      const targetR = r;
      const targetC = c - 1;
      if (gridData[targetR] && gridData[targetR][targetC] && gridData[targetR][targetC].isActive) {
        clearCell(targetR, targetC);
        moveTo(targetR, targetC);
      }
    } else {
      const targetR = r - 1;
      const targetC = c;
      if (gridData[targetR] && gridData[targetR][targetC] && gridData[targetR][targetC].isActive) {
        clearCell(targetR, targetC);
        moveTo(targetR, targetC);
      }
    }
  };

  const clearCell = (r, c) => {
    const newInputs = { ...userInputs, [`${r}-${c}`]: '' };
    setUserInputs(newInputs);
  };

  const setLetter = (r, c, letter) => {
    const newInputs = { ...userInputs, [`${r}-${c}`]: letter };
    setUserInputs(newInputs);
    checkWin(newInputs);
  };

  const handleCellChange = (r, c, val) => {
    if (!puzzleData || gameState !== 'playing') return;
    const char = val.slice(-1).toUpperCase();
    if (!/^[A-Z]*$/.test(char)) return;

    if (char) {
      setLetter(r, c, char);
      moveToNext(r, c);
    } else {
      clearCell(r, c);
    }
  };

  const handleKeyDown = (e, r, c) => {
    if (!puzzleData || gameState !== 'playing') return;

    if (e.key === 'ArrowUp') { e.preventDefault(); moveTo(r - 1, c); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveTo(r + 1, c); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveTo(r, c - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); moveTo(r, c + 1); }
    else if (e.key === 'Backspace') {
      if (!userInputs[`${r}-${c}`]) { e.preventDefault(); moveToPrevious(r, c); }
      else { e.preventDefault(); clearCell(r, c); }
    }
  };

  const handleCellClick = (r, c, cellWords) => {
    if (gameState !== 'playing') return;
    setActiveCell({ r, c });

    if (cellWords.length > 1) {
      const idx = cellWords.indexOf(activeWordId);
      if (idx !== -1) setActiveWordId(cellWords[(idx + 1) % cellWords.length]);
      else setActiveWordId(cellWords[0]);
    } else if (cellWords.length === 1) {
      setActiveWordId(cellWords[0]);
    }
    inputRefs.current[`${r}-${c}`]?.focus();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Forensic Crossword</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Test your knowledge of forensic science terminology.</p>
          </div>
        </Container>
      </section>

      {gameState === 'idle' && (
        <Container ref={difficultySectionRef} id="difficulty-section" className="mb-12 relative z-10 scroll-mt-32">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Select Difficulty</h2>
            <LevelSelector currentLevel={level} onSelectLevel={handleLevelChange} isUnlocked={isUnlocked} />

            <div className="mt-8 flex justify-center px-3">
              <button 
                ref={startRef}
                onClick={handleStartGameClick} 
                disabled={isDataLoading}
                className="start-game-btn w-full max-w-[260px] mx-auto flex items-center justify-center gap-2 text-[13px] min-[320px]:text-sm sm:text-base font-bold px-[12px] py-[10px] min-[320px]:px-4 min-[320px]:py-3 sm:px-6 sm:py-4 rounded-[10px] min-[320px]:rounded-xl bg-accent hover:bg-accent-light text-slate-900 transition-all duration-200 shadow-lg hover:shadow-accent/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" /> {isDataLoading ? 'Loading Data...' : 'Start Game'}
              </button>
            </div>
          </div>
        </Container>
      )}
      <div id="gameStart" className="relative z-10">
        {gameState === 'loading' && (
          <Container>
            <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-32 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-3/5 overflow-x-auto pb-4">
                  <div className="aspect-[4/3] bg-slate-100 animate-pulse rounded-xl"></div>
                </div>
                <div className="lg:w-2/5 flex flex-col gap-8">
                  <div className="h-64 bg-slate-100 animate-pulse rounded-xl"></div>
                  <div className="h-64 bg-slate-100 animate-pulse rounded-xl"></div>
                </div>
              </div>
            </div>
          </Container>
        )}



        {(gameState === 'playing' || gameState === 'completed') && puzzleData && (
          <Container>
            <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <PenTool className="text-primary" size={24} /> Crossword Grid <span className="text-sm font-normal text-slate-500 uppercase ml-2 bg-slate-100 px-2 py-1 rounded">{level}</span>
                  </h2>
                  <p className="text-slate-500 mt-1">Fill in the answers based on the clues below.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" /> {formatTime(timeElapsed)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-3/5 pb-4 w-full max-w-full overflow-hidden flex justify-center items-start">
                  <div
                    className="grid bg-slate-300 border border-slate-300 mx-auto max-h-[80vh]"
                    style={{ gridTemplateColumns: `repeat(${puzzleData.gridSizeC}, 1fr)`, gap: '2px', width: 'min(100%, 500px)' }}
                  >
                    {gridData.map((row, r) =>
                      row.map((cell, c) => {
                        if (!cell.isActive) return <div key={`${r}-${c}`} className="w-full aspect-square bg-transparent" />;
                        const isActiveWord = cell.words.includes(activeWordId);
                        const isActiveCell = activeCell?.r === r && activeCell?.c === c;

                        return (
                          <div
                            key={`${r}-${c}`}
                            className={cn("relative w-full aspect-square transition-colors cell", isActiveCell ? "active bg-[#facc1533] outline outline-2 outline-[#facc15] z-20" : isActiveWord ? "bg-amber-50" : "bg-white")}
                            onClick={() => handleCellClick(r, c, cell.words)}
                          >
                            {cell.num && <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold text-slate-600 select-none pointer-events-none leading-none z-10">{cell.num}</span>}
                            <input
                              ref={el => inputRefs.current[`${r}-${c}`] = el}
                              type="text" maxLength={1} value={userInputs[`${r}-${c}`] || ''}
                              onChange={(e) => handleCellChange(r, c, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, r, c)}
                              onFocus={() => handleCellClick(r, c, cell.words)}
                              disabled={gameState === 'completed'}
                              className={cn("absolute inset-0 w-full h-full text-center font-bold text-sm sm:text-lg md:text-xl uppercase bg-transparent outline-none caret-transparent cursor-pointer m-0 p-0", gameState === 'completed' && userInputs[`${r}-${c}`] === cell.correctChar ? "text-green-600" : "text-slate-800")}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="lg:w-2/5 flex flex-col gap-8 max-h-[80vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 uppercase text-sm tracking-wider">Across</h3>
                    <ul className="space-y-3">
                      {[...puzzleData.words].filter(w => w.dir === 'across').sort((a, b) => a.num - b.num).map(w => (
                        <li key={w.id} onClick={() => { if (gameState !== 'playing') return; setActiveWordId(w.id); setActiveCell({ r: w.r, c: w.c }); inputRefs.current[`${w.r}-${w.c}`]?.focus(); }} className={cn("text-sm p-2 rounded-lg cursor-pointer transition-colors border", activeWordId === w.id ? "bg-amber-50 border-amber-200 text-amber-900 font-medium shadow-sm" : "border-transparent text-slate-600 hover:bg-slate-50")}>
                          <span className="font-bold mr-2">{w.num}.</span>{w.clue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 uppercase text-sm tracking-wider">Down</h3>
                    <ul className="space-y-3">
                      {[...puzzleData.words].filter(w => w.dir === 'down').sort((a, b) => a.num - b.num).map(w => (
                        <li key={w.id} onClick={() => { if (gameState !== 'playing') return; setActiveWordId(w.id); setActiveCell({ r: w.r, c: w.c }); inputRefs.current[`${w.r}-${w.c}`]?.focus(); }} className={cn("text-sm p-2 rounded-lg cursor-pointer transition-colors border", activeWordId === w.id ? "bg-amber-50 border-amber-200 text-amber-900 font-medium shadow-sm" : "border-transparent text-slate-600 hover:bg-slate-50")}>
                          <span className="font-bold mr-2">{w.num}.</span>{w.clue}
                        </li>
                      ))}
                    </ul>
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
              setNextGameData(null);
              requestAnimationFrame(() => {
                scrollToDifficultySection();
              });
            }}
            onQuit={onQuit}
          />
        )}
      </div>
    </div>
  );
}
