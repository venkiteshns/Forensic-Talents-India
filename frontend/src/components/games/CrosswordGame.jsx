import React, { useState, useEffect, useRef } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, PenTool, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import CrosswordWorker from './crosswordWorker?worker';

const fetchWordSet = async () => {
  try {
    const storedPlayedIds = JSON.parse(localStorage.getItem('playedCrosswordIds') || '[]');
    const res = await api.get(`/game/crossword?playedIds=${storedPlayedIds.join(',')}`);

    if (res.data && res.data.words && res.data.words.length > 0) {
      if (res.data.resetOccurred) {
        localStorage.setItem('playedCrosswordIds', JSON.stringify([res.data._id]));
      } else {
        localStorage.setItem('playedCrosswordIds', JSON.stringify([...storedPlayedIds, res.data._id]));
      }
      return res.data.words;
    }
  } catch (err) {
    console.error("Failed to fetch crossword words:", getErrorMessage(err));
  }
  
  return [
    { word: 'FORENSIC', clue: 'Scientific analysis for crime' },
    { word: 'CRIME', clue: 'Unlawful act' },
    { word: 'SCENE', clue: 'Location of the crime' },
    { word: 'EVIDENCE', clue: 'Material proof' },
    { word: 'CLUE', clue: 'Lead for investigation' },
  ];
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

const generateWithTimeout = (worker, words, ms = 10000) => {
  return Promise.race([
    generatePuzzleWithWorker(worker, words),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Generation timeout")), ms))
  ]);
};

export default function CrosswordGame({ onQuit }) {
  const [puzzleData, setPuzzleData] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [activeWordId, setActiveWordId] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, loading, playing, completed, error
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [puzzleQueue, setPuzzleQueue] = useState([]);
  const isGeneratingRef = useRef(false);
  const workerRef = useRef(null);

  const gameSectionRef = useRef(null);
  const inputRefs = useRef({});

  useEffect(() => {
    workerRef.current = new CrosswordWorker();
    
    const cached = localStorage.getItem('crosswordPuzzleCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPuzzleQueue(parsed);
        }
      } catch (e) {}
    }
    
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  const generateInBackground = () => {
    if (!workerRef.current || isGeneratingRef.current) return;
    
    setPuzzleQueue(prev => {
      if (prev.length >= 2) return prev;
      
      isGeneratingRef.current = true;
      (async () => {
        try {
          const words = await fetchWordSet();
          const result = await generateWithTimeout(workerRef.current, words, 10000);
          
          setPuzzleQueue(q => {
            const newQ = [...q, result];
            if (newQ.length > 3) newQ.shift();
            localStorage.setItem('crosswordPuzzleCache', JSON.stringify(newQ));
            return newQ;
          });
        } catch (err) {
          console.error("Background generation failed:", getErrorMessage(err));
        } finally {
          isGeneratingRef.current = false;
        }
      })();
      
      return prev;
    });
  };

  useEffect(() => {
    generateInBackground();
  }, [puzzleQueue]);

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

  useEffect(() => {
    if (gameState === 'completed') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
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
    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    if (puzzleQueue.length > 0) {
      const nextPuzzle = puzzleQueue[0];
      const remaining = puzzleQueue.slice(1);
      setPuzzleQueue(remaining);
      localStorage.setItem('crosswordPuzzleCache', JSON.stringify(remaining));
      
      setTimeout(() => applyPuzzle(nextPuzzle), 50);
    } else {
      try {
        const words = await fetchWordSet();
        const result = await generateWithTimeout(workerRef.current, words, 10000);
        applyPuzzle(result);
      } catch (err) {
        console.error("Sync generation failed:", getErrorMessage(err));
        setGameState('error');
      }
    }
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
        width: 8px;
        height: 8px;
        background-color: #0f172a;
        border-radius: 50%;
        animation: floatUp 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }
    `;
    document.head.appendChild(style);

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particle.style.opacity = Math.random() * 0.5 + 0.3;
      burstDiv.appendChild(particle);
    }

    document.body.appendChild(burstDiv);
    setTimeout(() => {
      if (document.body.contains(burstDiv)) document.body.removeChild(burstDiv);
      if (document.head.contains(style)) document.head.removeChild(style);
    }, 2500);
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
      triggerConfetti();
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
    const char = val.slice(-1).toUpperCase(); // only keep last typed char
    if (!/^[A-Z]*$/.test(char)) return; // letters only

    if (char) {
      setLetter(r, c, char);
      moveToNext(r, c);
    } else {
      clearCell(r, c);
    }
  };

  const handleKeyDown = (e, r, c) => {
    if (!puzzleData || gameState !== 'playing') return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveTo(r - 1, c);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveTo(r + 1, c);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveTo(r, c - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveTo(r, c + 1);
    } else if (e.key === 'Backspace') {
      if (!userInputs[`${r}-${c}`]) {
        e.preventDefault();
        moveToPrevious(r, c);
      } else {
        e.preventDefault();
        clearCell(r, c);
      }
    }
  };

  const handleCellClick = (r, c, cellWords) => {
    if (gameState !== 'playing') return;
    setActiveCell({ r, c });

    // Toggle active word direction if intersection
    if (cellWords.length > 1) {
      const idx = cellWords.indexOf(activeWordId);
      if (idx !== -1) {
        setActiveWordId(cellWords[(idx + 1) % cellWords.length]);
      } else {
        setActiveWordId(cellWords[0]);
      }
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
              Forensic Crossword
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Test your knowledge of forensic science terminology.
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

        {gameState === 'error' && (
          <Container>
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-3xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-red-900 mb-3">Invalid Puzzle Configuration</h2>
              <p className="text-red-700 mb-8 leading-relaxed">
                The generated crossword contains structural mismatches and cannot be rendered safely. Please restart or try another set.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={initGame} variant="primary" className="bg-red-600 hover:bg-red-700 border-none px-6">
                  <RefreshCw size={18} className="mr-2" /> Try Again
                </Button>
                <button onClick={onQuit} className="px-6 py-2 text-red-600 font-semibold hover:bg-red-100 rounded-lg transition-colors">
                  Go Back
                </button>
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
                    <PenTool className="text-primary" size={24} />
                    Crossword Grid
                  </h2>
                  <p className="text-slate-500 mt-1">Fill in the answers based on the clues below.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" />
                      {formatTime(timeElapsed)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">

                {/* The Grid */}
                <div className="lg:w-3/5 pb-4 w-full max-w-full overflow-hidden flex justify-center items-start">
                  <div
                    className="grid bg-slate-300 border border-slate-300 mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${puzzleData.gridSizeC}, 1fr)`,
                      gap: '2px',
                      width: 'min(100%, 500px)',
                    }}
                  >
                    {gridData.map((row, r) =>
                      row.map((cell, c) => {
                        if (!cell.isActive) {
                          return <div key={`${r}-${c}`} className="w-full aspect-square bg-transparent" />;
                        }

                        const isActiveWord = cell.words.includes(activeWordId);
                        const isActiveCell = activeCell?.r === r && activeCell?.c === c;

                        return (
                          <div
                            key={`${r}-${c}`}
                            className={cn(
                              "relative w-full aspect-square transition-colors cell",
                              isActiveCell ? "active bg-[#facc1533] outline outline-2 outline-[#facc15] z-20" : isActiveWord ? "bg-amber-50" : "bg-white"
                            )}
                            onClick={() => handleCellClick(r, c, cell.words)}
                          >
                            {cell.num && (
                              <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold text-slate-600 select-none pointer-events-none leading-none z-10">
                                {cell.num}
                              </span>
                            )}
                            <input
                              ref={el => inputRefs.current[`${r}-${c}`] = el}
                              type="text"
                              maxLength={1}
                              value={userInputs[`${r}-${c}`] || ''}
                              onChange={(e) => handleCellChange(r, c, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, r, c)}
                              onFocus={() => handleCellClick(r, c, cell.words)}
                              disabled={gameState === 'completed'}
                              className={cn(
                                "absolute inset-0 w-full h-full text-center font-bold text-sm sm:text-lg md:text-xl uppercase bg-transparent outline-none caret-transparent cursor-pointer m-0 p-0",
                                gameState === 'completed' && userInputs[`${r}-${c}`] === cell.correctChar ? "text-green-600" : "text-slate-800"
                              )}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Clues */}
                <div className="lg:w-2/5 flex flex-col gap-8">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 uppercase text-sm tracking-wider">Across</h3>
                    <ul className="space-y-3">
                      {puzzleData.words.filter(w => w.dir === 'across').map(w => (
                        <li
                          key={w.id}
                          onClick={() => {
                            if (gameState !== 'playing') return;
                            setActiveWordId(w.id);
                            setActiveCell({ r: w.r, c: w.c });
                            inputRefs.current[`${w.r}-${w.c}`]?.focus();
                          }}
                          className={cn(
                            "text-sm p-2 rounded-lg cursor-pointer transition-colors border",
                            activeWordId === w.id ? "bg-amber-50 border-amber-200 text-amber-900 font-medium shadow-sm" : "border-transparent text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <span className="font-bold mr-2">{w.num}.</span>
                          {w.clue}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 uppercase text-sm tracking-wider">Down</h3>
                    <ul className="space-y-3">
                      {puzzleData.words.filter(w => w.dir === 'down').map(w => (
                        <li
                          key={w.id}
                          onClick={() => {
                            if (gameState !== 'playing') return;
                            setActiveWordId(w.id);
                            setActiveCell({ r: w.r, c: w.c });
                            inputRefs.current[`${w.r}-${w.c}`]?.focus();
                          }}
                          className={cn(
                            "text-sm p-2 rounded-lg cursor-pointer transition-colors border",
                            activeWordId === w.id ? "bg-amber-50 border-amber-200 text-amber-900 font-medium shadow-sm" : "border-transparent text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <span className="font-bold mr-2">{w.num}.</span>
                          {w.clue}
                        </li>
                      ))}
                    </ul>
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
            </Container>
          )}

        {gameState === 'completed' && (
          <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[4px] flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-[300px] sm:max-w-[360px] min-h-[220px] bg-white rounded-[12px] sm:rounded-[16px] shadow-2xl p-5 sm:p-6 text-center box-border animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center">

              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-100/60">
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
              </div>

              {/* Title */}
              <h2 className="text-[18px] sm:text-[22px] font-heading font-bold text-slate-900 mb-2 tracking-tight">
                Puzzle Completed!
              </h2>

              {/* Subtitle */}
              <p className="text-slate-500 text-[13px] sm:text-sm mb-4 leading-relaxed">
                Great job filling out all the forensic clues.
              </p>

              {/* Time badge */}
              <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg px-4 py-1.5 text-sm font-semibold text-slate-700 mb-4">
                Time: <span className="text-primary font-bold">{formatTime(timeElapsed)}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-[10px] justify-center w-full">
                <button
                  onClick={initGame}
                  className="w-full h-10 px-6 bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all font-bold rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Play Again
                </button>
                <button
                  onClick={onQuit}
                  className="w-full h-10 px-6 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  Back to Games
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
