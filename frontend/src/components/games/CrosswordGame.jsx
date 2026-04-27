import React, { useState, useEffect, useRef } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, PenTool } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';

const generateLayout = (wordList) => {
  const gridSize = 30; // large enough for initial placement
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  const placedWords = [];

  const sortedWords = [...wordList].sort((a, b) => b.word.length - a.word.length);

  const canPlace = (word, r, c, dir) => {
    if (dir === 'across') {
      if (c < 0 || c + word.length > gridSize || r < 0 || r >= gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[r][c+i] !== null && grid[r][c+i] !== word[i]) return false;
        if (grid[r][c+i] === null) {
          if (r > 0 && grid[r-1][c+i] !== null) return false;
          if (r < gridSize-1 && grid[r+1][c+i] !== null) return false;
        }
      }
      if (c > 0 && grid[r][c-1] !== null) return false;
      if (c + word.length < gridSize && grid[r][c+word.length] !== null) return false;
    } else {
      if (r < 0 || r + word.length > gridSize || c < 0 || c >= gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[r+i][c] !== null && grid[r+i][c] !== word[i]) return false;
        if (grid[r+i][c] === null) {
          if (c > 0 && grid[r+i][c-1] !== null) return false;
          if (c < gridSize-1 && grid[r+i][c+1] !== null) return false;
        }
      }
      if (r > 0 && grid[r-1][c] !== null) return false;
      if (r + word.length < gridSize && grid[r+word.length][c] !== null) return false;
    }
    return true;
  };

  const placeWord = (wordObj, r, c, dir, num) => {
    const word = wordObj.word;
    placedWords.push({
      id: `${num}${dir === 'across' ? 'A' : 'D'}`,
      num,
      dir,
      ans: word,
      clue: wordObj.clue,
      r,
      c
    });
    for (let i = 0; i < word.length; i++) {
      if (dir === 'across') {
        grid[r][c+i] = word[i];
      } else {
        grid[r+i][c] = word[i];
      }
    }
  };

  let num = 1;
  if (sortedWords.length > 0) {
    const first = sortedWords.shift();
    const r = Math.floor(gridSize / 2);
    const c = Math.floor((gridSize - first.word.length) / 2);
    placeWord(first, r, c, 'across', num++);
  }

  const unplaced = [];
  for (const wordObj of sortedWords) {
    const word = wordObj.word;
    let placed = false;
    for (const pw of placedWords) {
      if (placed) break;
      for (let i = 0; i < word.length; i++) {
        if (placed) break;
        for (let j = 0; j < pw.ans.length; j++) {
          if (word[i] === pw.ans[j]) {
            const dir = pw.dir === 'across' ? 'down' : 'across';
            const r = pw.dir === 'across' ? pw.r - i : pw.r + j;
            const c = pw.dir === 'across' ? pw.c + j : pw.c - i;
            if (canPlace(word, r, c, dir)) {
              const existing = placedWords.find(w => w.r === r && w.c === c);
              placeWord(wordObj, r, c, dir, existing ? existing.num : num++);
              placed = true;
              break;
            }
          }
        }
      }
    }
    if (!placed) unplaced.push(wordObj);
  }

  for (const wordObj of unplaced) {
    const word = wordObj.word;
    let placed = false;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (canPlace(word, r, c, 'across')) {
          placeWord(wordObj, r, c, 'across', num++);
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  }

  if (placedWords.length === 0) return { gridSizeR: 0, gridSizeC: 0, words: [] };

  let minR = gridSize, maxR = 0, minC = gridSize, maxC = 0;
  placedWords.forEach(pw => {
    minR = Math.min(minR, pw.r);
    maxR = Math.max(maxR, pw.dir === 'down' ? pw.r + pw.ans.length - 1 : pw.r);
    minC = Math.min(minC, pw.c);
    maxC = Math.max(maxC, pw.dir === 'across' ? pw.c + pw.ans.length - 1 : pw.c);
  });

  placedWords.forEach(pw => {
    pw.r -= minR;
    pw.c -= minC;
  });

  return {
    gridSizeR: maxR - minR + 1,
    gridSizeC: maxC - minC + 1,
    words: placedWords
  };
};

const generateGridData = (puzzleData) => {
  if (!puzzleData || !puzzleData.words) return [];
  let grid = Array(puzzleData.gridSizeR).fill(null).map(() => 
    Array(puzzleData.gridSizeC).fill({ isActive: false, char: '', num: null, words: [] })
  );

  puzzleData.words.forEach(w => {
    for (let i = 0; i < w.ans.length; i++) {
      const r = w.dir === 'across' ? w.r : w.r + i;
      const c = w.dir === 'across' ? w.c + i : w.c;
      
      const isStart = i === 0;
      
      grid[r][c] = {
        ...grid[r][c],
        isActive: true,
        correctChar: w.ans[i],
        num: isStart ? w.num : grid[r][c].num,
        words: [...grid[r][c].words, w.id]
      };
    }
  });

  return grid;
};

export default function CrosswordGame({ onQuit }) {
  const [puzzleData, setPuzzleData] = useState(null);

  const [gridData, setGridData] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [activeWordId, setActiveWordId] = useState(null);
  const [activeCell, setActiveCell] = useState(null); 
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const gameSectionRef = useRef(null);
  const inputRefs = useRef({});

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

    let activeData = null;
    try {
      const storedPlayedIds = JSON.parse(localStorage.getItem('playedCrosswordIds') || '[]');
      const res = await api.get(`/game/crossword?playedIds=${storedPlayedIds.join(',')}`);
      
      if (res.data && res.data.words && res.data.words.length > 0) {
        activeData = generateLayout(res.data.words);
        
        if (res.data.resetOccurred) {
          localStorage.setItem('playedCrosswordIds', JSON.stringify([res.data._id]));
        } else {
          localStorage.setItem('playedCrosswordIds', JSON.stringify([...storedPlayedIds, res.data._id]));
        }
      } else {
        throw new Error("Invalid words array");
      }
    } catch (err) {
      console.error("Failed to load crossword:", err.message);
      activeData = generateLayout([
        { word: 'FORENSIC', clue: 'Scientific method for crimes' },
        { word: 'CRIME', clue: 'Punishable offense' },
        { word: 'EVIDENCE', clue: 'Body of facts' },
        { word: 'DNA', clue: 'Genetic carrier' }
      ]);
    }
    
    setPuzzleData(activeData);
    setGridData(generateGridData(activeData));
    setUserInputs({});
    if (activeData.words.length > 0) {
      setActiveWordId(activeData.words[0].id);
      setActiveCell({ r: activeData.words[0].r, c: activeData.words[0].c });
    }
    setTimeElapsed(0);
    setGameState('playing');
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

  const handleCellChange = (r, c, val) => {
    if (!puzzleData) return;
    const char = val.slice(-1).toUpperCase(); // only keep last typed char
    if (!/^[A-Z]*$/.test(char)) return; // letters only

    const newInputs = { ...userInputs, [`${r}-${c}`]: char };
    setUserInputs(newInputs);

    if (char) {
      // Move to next cell
      const activeWord = puzzleData.words.find(w => w.id === activeWordId);
      if (activeWord) {
        let nextR = r;
        let nextC = c;
        if (activeWord.dir === 'across') nextC += 1;
        else nextR += 1;

        if (gridData[nextR] && gridData[nextR][nextC] && gridData[nextR][nextC].isActive) {
          setActiveCell({ r: nextR, c: nextC });
          setTimeout(() => {
            inputRefs.current[`${nextR}-${nextC}`]?.focus();
          }, 0);
        } else {
          // check win when word ends
          checkWin(newInputs);
        }
      }
    } else {
      checkWin(newInputs);
    }
  };

  const handleKeyDown = (e, r, c) => {
    if (!puzzleData) return;
    if (e.key === 'Backspace' && !userInputs[`${r}-${c}`]) {
      // Move back
      const activeWord = puzzleData.words.find(w => w.id === activeWordId);
      if (activeWord) {
        let prevR = r;
        let prevC = c;
        if (activeWord.dir === 'across') prevC -= 1;
        else prevR -= 1;

        if (gridData[prevR] && gridData[prevR][prevC] && gridData[prevR][prevC].isActive) {
          setActiveCell({ r: prevR, c: prevC });
          setTimeout(() => {
            inputRefs.current[`${prevR}-${prevC}`]?.focus();
          }, 0);
        }
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
                <div className="lg:w-3/5 overflow-x-auto pb-4">
                  <div 
                    className="inline-grid gap-0 border border-slate-300 bg-slate-300"
                    style={{ gridTemplateColumns: `repeat(${puzzleData.gridSizeC}, minmax(0, 1fr))` }}
                  >
                    {gridData.map((row, r) => 
                      row.map((cell, c) => {
                        if (!cell.isActive) {
                          return <div key={`${r}-${c}`} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-transparent" />;
                        }

                        const isActiveWord = cell.words.includes(activeWordId);
                        const isActiveCell = activeCell?.r === r && activeCell?.c === c;

                        return (
                          <div 
                            key={`${r}-${c}`} 
                            className={cn(
                              "relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-slate-300 transition-colors",
                              isActiveCell ? "bg-amber-200" : isActiveWord ? "bg-amber-50" : "bg-white"
                            )}
                            onClick={() => handleCellClick(r, c, cell.words)}
                          >
                            {cell.num && (
                              <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold text-slate-600 select-none pointer-events-none">
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
                                "w-full h-full text-center font-bold text-sm sm:text-base md:text-xl uppercase bg-transparent outline-none caret-transparent cursor-pointer",
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

              {gameState === 'completed' && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100/50">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-slate-900 mb-2 tracking-tight">Puzzle Completed!</h3>
                  <p className="text-slate-600 mb-8 max-w-md text-base leading-relaxed">
                    Great job filling out all the forensic clues.
                    <br/><br/>
                    <span className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      Time: <span className="text-primary font-bold">{formatTime(timeElapsed)}</span>
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
