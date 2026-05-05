import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, PenTool, X, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import CrosswordWorker from './crosswordWorker?worker';
import LevelSelector from './LevelSelector';
import CompletionModal from './CompletionModal';
import UniversalProModal from './UniversalProModal';
import TimeoutModal from './TimeoutModal';
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

const generatePuzzleWithWorker = (worker, payload) => {
  return new Promise((resolve, reject) => {
    if (!worker) return reject(new Error("Worker not initialized"));
    
    const handleMessage = (e) => {
      worker.removeEventListener('message', handleMessage);
      if (e.data.success) resolve({ puzzleData: e.data.puzzleData, gridData: e.data.gridData });
      else reject(new Error(e.data.error));
    };
    
    worker.addEventListener('message', handleMessage);
    worker.postMessage({ type: 'GENERATE', ...payload });
  });
};

const generateWithTimeout = (worker, payload, ms = 15000) => {
  return Promise.race([
    generatePuzzleWithWorker(worker, payload),
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
  const [activeDirection, setActiveDirection] = useState('across');
  const [completedWords, setCompletedWords] = useState({});
  const [errorCells, setErrorCells] = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [cellSize, setCellSize] = useState(36);
  const MAX_GRID_ROWS = 22; // max rows to show on desktop before clipping
  const [isMobileSmall, setIsMobileSmall] = useState(typeof window !== 'undefined' ? window.innerWidth < 510 : false);
  const [showAllClues, setShowAllClues] = useState(false);
  const gridWrapperRef = useRef(null);

  const [nextGameData, setNextGameData] = useState(null);
  const [wordsPool, setWordsPool] = useState({ level: null, words: [], autoOptimize: true });
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

    const fetchWithTimeout = (url, timeout = 3000) => {
      return Promise.race([
        api.get(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
      ]);
    };

    try {
      const res = await fetchWithTimeout(`/crossword/${lvl}`, 3000);
      const data = res.data;

      if (!data || !data.words || data.words.length === 0) {
        throw new Error("Empty dataset");
      }

      if (!isValidSet(data.words)) {
        throw new Error("Invalid dataset structure");
      }

      setWordsPool({ level: lvl, words: data.words, autoOptimize: data.autoOptimize });
      localStorage.setItem(cacheKey, JSON.stringify({ words: data.words, autoOptimize: data.autoOptimize }));
      setIsOffline(false);

    } catch (err) {
      console.warn("Using fallback crossword:", err.message);

      const cached = localStorage.getItem(cacheKey);
      let fallbackWords = crosswordFallbackData[lvl];

      if (cached) {
        const parsed = JSON.parse(cached);
        fallbackWords = Array.isArray(parsed) ? parsed : parsed.words || crosswordFallbackData[lvl];
      }
      setWordsPool({ level: lvl, words: fallbackWords, autoOptimize: true });
      setIsOffline(true);
    } finally {
      setIsDataLoading(false);
    }
  };

  const getColumnCount = (gridCols, screenWidth) => {
    if (screenWidth < 510) {
      return Math.min(gridCols, 15);
    }
    return gridCols;
  };

  const validateGrid = (columnCount, containerWidth) => {
    if (!containerWidth) return columnCount;
    const cellSize = containerWidth / columnCount;
    if (cellSize < 18) {
      return 12; // fallback to fewer columns
    }
    return columnCount;
  };

  useEffect(() => {
    const keysToUpdate = Object.keys(completedWords).filter(key => completedWords[key]?.completed && !completedWords[key]?.animated);
    if (keysToUpdate.length > 0) {
      const timer = setTimeout(() => {
        setCompletedWords(prev => {
          const next = { ...prev };
          keysToUpdate.forEach(key => {
            if (next[key]) next[key] = { ...next[key], animated: true };
          });
          return next;
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [completedWords]);

  useEffect(() => {
    if (!gridWrapperRef.current || !puzzleData?.gridSizeC) return;
    const columns = puzzleData.gridSizeC;
    const observer = new ResizeObserver(entries => {
      if (!entries[0]) return;
      const containerWidth = entries[0].contentRect.width;
      const rows = puzzleData.gridSizeR || 10;
      
      // Calculate max width-based cell size
      const availableWidth = containerWidth - 16 - ((columns - 1) * 2);
      const widthBasedSize = availableWidth / columns;
      
      // Calculate max height-based cell size (90vh constraint)
      const availableHeight = (window.innerHeight * 0.9) - 16 - ((rows - 1) * 2);
      const heightBasedSize = availableHeight / rows;
      
      // Take the smaller of the two, but don't shrink below usability threshold (18px)
      const exactCellSize = Math.max(Math.min(widthBasedSize, heightBasedSize), 18);
      setCellSize(exactCellSize);
    });
    observer.observe(gridWrapperRef.current);
    return () => observer.disconnect();
  }, [puzzleData?.gridSizeC, gameState]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileSmall(window.innerWidth < 510);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
           const fetchWithTimeout = (url, timeout = 3000) => {
             return Promise.race([
               api.get(url),
               new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
             ]);
           };
           try {
             const res = await fetchWithTimeout(`/crossword/${lvl}`, 3000);
             if (res.data && res.data.words && isValidSet(res.data.words)) {
               localStorage.setItem(cacheKey, JSON.stringify({ words: res.data.words, autoOptimize: res.data.autoOptimize }));
             }
           } catch {}
         }
       };
       preloadLevel(nextLvl);
    }
  }, [level]);

  const generatePuzzle = useCallback(async (pool, lvl) => {
    const { words } = pool;
    if (!workerRef.current || !words || words.length === 0) return null;
    
    let attempts = 0;
    while (attempts < 3) {
      const selectedWords = shuffle(words);
      
      try {
        const isMobileSmall = window.innerWidth < 510;
        let maxCols = 25; // Desktop max columns (enough room for 20 words)
        if (isMobileSmall) {
          const containerWidth = gridWrapperRef.current?.clientWidth || (window.innerWidth - 48);
          maxCols = validateGrid(13, containerWidth);
        }

        const payload = { 
          words: selectedWords, 
          level: lvl,
          isMobileSmall,
          maxCols
        };
        const result = await generateWithTimeout(workerRef.current, payload, 10000);
        return result;
      } catch (err) {
        console.error("Worker generation failed, retrying...", err.message || err);
        attempts++;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (wordsPool.level === level && wordsPool.words.length > 0 && (gameState === 'idle' || gameState === 'playing') && !isGeneratingRef.current) {
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
      interval = setInterval(() => {
        setTimeElapsed(t => {
          const next = t + 1;
          if (level === 'pro' && next >= 300) {
            setGameState('timeout');
            clearInterval(interval);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'completed' || gameState === 'timeout') document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [gameState]);

  useEffect(() => {
    const isRestrictedLevel = level === 'hard' || level === 'pro';
    if (isMobileSmall && isRestrictedLevel && puzzleData?.words && puzzleData.words.length < 6) {
      console.warn(`Dataset contains fewer than 6 questions (${puzzleData.words.length}). Displaying all.`);
    }
  }, [puzzleData, isMobileSmall, level]);

  const applyPuzzle = (puzzle) => {
    setPuzzleData(puzzle.puzzleData);
    setGridData(puzzle.gridData);
    setUserInputs({});
    setCompletedWords({});
    setShowAllClues(false);
    if (puzzle.puzzleData.words.length > 0) {
      const firstWord = puzzle.puzzleData.words[0];
      setActiveWordId(firstWord.id);
      setActiveDirection(firstWord.dir);
      setActiveCell({ r: firstWord.r, c: firstWord.c });
    }
    setTimeElapsed(0);
    setGameState('playing');
  };

  const startGameLogic = async () => {
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

  const handleStartGameClick = async () => {
    if (level === 'pro' && gameState !== 'warning') {
      setGameState('warning');
      return;
    }
    startGameLogic();
  };

  const initGame = () => {
    handleStartGameClick();
    setTimeout(() => {
      const el = document.getElementById('gameStart');
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLevelChange = (newLevel) => {
    if (!isUnlocked(newLevel)) return;
    setLevel(newLevel);
    setNextGameData(null);
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

  const checkWordCompletion = (wordId, currentInputs) => {
    if (!puzzleData || !wordId) return false;
    const wordObj = puzzleData.words.find(w => w.id === wordId);
    if (!wordObj || !wordObj.ans) return false;
    
    let userWord = "";
    let r = wordObj.r;
    let c = wordObj.c;
    for (let i = 0; i < wordObj.ans.length; i++) {
      const char = currentInputs[`${r}-${c}`] || "";
      userWord += char;
      if (wordObj.dir === 'across') c++;
      else r++;
    }
    return userWord === wordObj.ans;
  };

  const isWordComplete = (wordId, currentInputs) => {
    if (!puzzleData || !wordId) return false;
    const wordObj = puzzleData.words.find(w => w.id === wordId);
    if (!wordObj || !wordObj.ans) return false;
    
    let r = wordObj.r;
    let c = wordObj.c;
    for (let i = 0; i < wordObj.ans.length; i++) {
      const char = currentInputs[`${r}-${c}`];
      if (!char || char.trim() === "") return false;
      if (wordObj.dir === 'across') c++;
      else r++;
    }
    return true;
  };

  const triggerWordError = (wordObj) => {
    const cells = [];
    let r = wordObj.r;
    let c = wordObj.c;
    for (let i = 0; i < wordObj.ans.length; i++) {
      cells.push(`${r}-${c}`);
      if (wordObj.dir === 'across') c++;
      else r++;
    }
    
    setErrorCells(prev => {
      const next = { ...prev };
      cells.forEach(key => next[key] = true);
      return next;
    });
    
    setTimeout(() => {
      setErrorCells(prev => {
        const next = { ...prev };
        cells.forEach(key => delete next[key]);
        return next;
      });
    }, 1000);
  };

  const validateWords = (newInputs, cellWords) => {
    if (!puzzleData || !cellWords) return;
    setCompletedWords(prev => {
      let changed = false;
      const next = { ...prev };
      cellWords.forEach(wordId => {
        const wordObj = puzzleData.words.find(w => w.id === wordId);
        if (wordObj) {
          const key = `${wordObj.dir}-${wordId}`;
          const isComplete = isWordComplete(wordId, newInputs);
          
          if (isComplete) {
            const isCorrect = checkWordCompletion(wordId, newInputs);
            if (isCorrect) {
              if (!next[key]?.completed) {
                next[key] = { completed: true, animated: false };
                changed = true;
              }
            } else {
              triggerWordError(wordObj);
              if (next[key]) {
                delete next[key];
                changed = true;
              }
            }
          } else {
            if (next[key]) {
              delete next[key];
              changed = true;
            }
          }
        }
      });
      return changed ? next : prev;
    });
  };

  const moveTo = (r, c) => {
    if (gridData[r] && gridData[r][c] && gridData[r][c].isActive) {
      setActiveCell({ r, c });
      setTimeout(() => {
        inputRefs.current[`${r}-${c}`]?.focus();
      }, 0);
    }
  };

  const getNextCell = (row, col) => {
    if (activeDirection === "across") return { row, col: col + 1 };
    if (activeDirection === "down") return { row: row + 1, col };
    return { row, col: col + 1 };
  };

  const moveToNext = (r, c) => {
    const next = getNextCell(r, c);
    moveTo(next.row, next.col);
  };

  const moveToPrevious = (r, c) => {
    const targetR = activeDirection === "across" ? r : r - 1;
    const targetC = activeDirection === "across" ? c - 1 : c;
    if (gridData[targetR] && gridData[targetR][targetC] && gridData[targetR][targetC].isActive) {
      clearCell(targetR, targetC);
      moveTo(targetR, targetC);
    }
  };

  const clearCell = (r, c) => {
    const newInputs = { ...userInputs, [`${r}-${c}`]: '' };
    setUserInputs(newInputs);
    validateWords(newInputs, gridData[r][c].words);
  };

  const setLetter = (r, c, letter) => {
    const newInputs = { ...userInputs, [`${r}-${c}`]: letter };
    setUserInputs(newInputs);
    checkWin(newInputs);
    validateWords(newInputs, gridData[r][c].words);
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
      else { 
        const { isCorrect } = getCellState(gridData[r][c].words);
        if (isCorrect) {
          e.preventDefault();
          moveToPrevious(r, c);
        } else {
          e.preventDefault(); clearCell(r, c); 
        }
      }
    } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        const { isCorrect } = getCellState(gridData[r][c].words);
        if (isCorrect) {
            e.preventDefault();
            moveToNext(r, c);
        }
    }
  };

  const handleFocus = (r, c, cellWords) => {
    if (gameState !== 'playing') return;
    setActiveCell({ r, c });
    if (!cellWords.includes(activeWordId)) {
      const acrossWord = puzzleData.words.find(w => cellWords.includes(w.id) && w.dir === 'across');
      const downWord = puzzleData.words.find(w => cellWords.includes(w.id) && w.dir === 'down');
      if (activeDirection === 'across' && acrossWord) setActiveWordId(acrossWord.id);
      else if (activeDirection === 'down' && downWord) setActiveWordId(downWord.id);
      else if (acrossWord) { setActiveDirection('across'); setActiveWordId(acrossWord.id); }
      else if (downWord) { setActiveDirection('down'); setActiveWordId(downWord.id); }
    }
  };

  const handleCellClick = (r, c, cellWords) => {
    if (gameState !== 'playing') return;
    setActiveCell({ r, c });

    const acrossWord = puzzleData.words.find(w => cellWords.includes(w.id) && w.dir === 'across');
    const downWord = puzzleData.words.find(w => cellWords.includes(w.id) && w.dir === 'down');

    if (activeCell?.r === r && activeCell?.c === c && acrossWord && downWord) {
      if (activeDirection === 'across') {
        setActiveDirection('down');
        setActiveWordId(downWord.id);
      } else {
        setActiveDirection('across');
        setActiveWordId(acrossWord.id);
      }
    } else {
      if (activeDirection === 'across' && acrossWord) {
        setActiveWordId(acrossWord.id);
      } else if (activeDirection === 'down' && downWord) {
        setActiveWordId(downWord.id);
      } else {
        if (acrossWord) {
          setActiveDirection('across');
          setActiveWordId(acrossWord.id);
        } else if (downWord) {
          setActiveDirection('down');
          setActiveWordId(downWord.id);
        }
      }
    }
    inputRefs.current[`${r}-${c}`]?.focus();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getCellState = (cellWords) => {
    if (!puzzleData) return { isCorrect: false, isCorrectActiveWord: false, shouldAnimate: false };
    let isCorrect = false;
    let isCorrectActiveWord = false;
    let shouldAnimate = false;
    cellWords.forEach(wordId => {
      const wordObj = puzzleData.words.find(w => w.id === wordId);
      const state = wordObj && completedWords[`${wordObj.dir}-${wordId}`];
      if (state && state.completed) {
        isCorrect = true;
        if (wordId === activeWordId) isCorrectActiveWord = true;
        if (!state.animated) shouldAnimate = true;
      }
    });
    return { isCorrect, isCorrectActiveWord, shouldAnimate };
  };

  const validatedWords = React.useMemo(() => {
    if (!puzzleData || !puzzleData.words) return null;
    if (isMobileSmall) return puzzleData.words;

    const MIN_REQUIRED = 6;
    if (puzzleData.words.length >= MIN_REQUIRED) return puzzleData.words;

    console.warn(`Insufficient clues for ${level}. Found: ${puzzleData.words.length}`);
    return null;
  }, [puzzleData, isMobileSmall, level]);

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
          <div className="max-w-2xl mx-auto game-container text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            <div className="max-w-5xl mx-auto game-container relative overflow-hidden">
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



        {(gameState === 'playing' || gameState === 'completed') && puzzleData && !validatedWords && (
          <Container key={`board-${level}`}>
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center mt-8">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Insufficient Clues</h3>
              <p className="text-slate-600 mb-6">
                This crossword set does not meet the minimum requirement. Please update the dataset.
              </p>
              <Button onClick={() => setGameState('idle')} variant="outline">
                Back to Difficulty Selection
              </Button>
            </div>
          </Container>
        )}

        {(gameState === 'playing' || gameState === 'completed') && validatedWords && gridData && gridData.length > 0 && (
          <Container key={`board-${level}`}>
            <div className="max-w-5xl mx-auto game-container relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <PenTool className="text-primary" size={24} /> Crossword Grid <span className="text-sm font-normal text-slate-500 uppercase ml-2 bg-slate-100 px-2 py-1 rounded">{level}</span>
                  </h2>
                  <p className="text-slate-500 mt-1">Fill in the answers based on the clues below.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time{level === 'pro' && ' Left'}</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" /> {formatTime(level === 'pro' ? Math.max(0, 300 - timeElapsed) : timeElapsed)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={cn("crossword-layout", level === 'pro' && "pro-layout")}>
                <div className="grid-section pb-4">
                  <div ref={gridWrapperRef} className="grid-wrapper">
                    <div
                      key={`grid-${level}-${puzzleData.gridSizeC}`}
                      className={cn("crossword-grid", level === 'pro' && "pro")}
                      style={{
                        gridTemplateColumns: !isMobileSmall ? `repeat(${puzzleData.gridSizeC}, ${cellSize}px)` : `repeat(${puzzleData.gridSizeC}, minmax(0, 1fr))`,
                        // Use exact cellSize for row heights to ensure perfect squares, matching the grid columns
                        gridAutoRows: !isMobileSmall ? `${cellSize}px` : undefined,
                        // Parent grid-container handles max-height 90vh via CSS/JS logic, this just prevents overflow bugs
                        maxHeight: !isMobileSmall ? '90vh' : undefined,
                        overflow: !isMobileSmall ? 'hidden' : undefined,
                        transition: 'max-height 0.2s ease',
                        '--cols': puzzleData.gridSizeC,
                        '--rows': puzzleData.gridSizeR
                      }}
                    >
                      {gridData.map((row, r) =>
                        row.map((cell, c) => {
                          
                          if (!cell.isActive) {
                            return (
                              <div 
                                key={`${r}-${c}`} 
                                className="cell-blocked"
                              />
                            );
                          }
                          const isActiveWord = cell.words.includes(activeWordId);
                        const isActiveCell = activeCell?.r === r && activeCell?.c === c;
                        
                        const { isCorrect, isCorrectActiveWord, shouldAnimate } = getCellState(cell.words);
                        const isCompletedGame = gameState === 'completed';
                        
                        const showDarkGreen = isCompletedGame ? false : isCorrectActiveWord;
                        const showLightGreen = isCompletedGame ? true : (isCorrect && !isCorrectActiveWord);
                        const isError = errorCells[`${r}-${c}`];
                        
                        const bgClass = isError ? "wrong-cell" :
                                        showDarkGreen ? "cell-correct-active" :
                                        showLightGreen ? "cell-correct" :
                                        isActiveCell ? "cell-active bg-blue-50" :
                                        isActiveWord ? "bg-slate-50" : "";

                        const textClass = (showDarkGreen || showLightGreen) ? "text-[#166534]" : 
                                          isError ? "text-[#7F1D1D]" : "text-slate-800";
                                          
                        const outlineClass = "";
                        const animationClass = shouldAnimate ? "cell-correct-animate" : isError ? "word-shake" : "";
                        const lockedClass = isCorrect ? "pointer-events-none opacity-90" : "";

                        return (
                          <div
                            key={`${r}-${c}`}
                            className={cn("cell", bgClass, outlineClass, animationClass, lockedClass)}
                            onClick={() => handleCellClick(r, c, cell.words)}
                            style={{ fontSize: Math.max(cellSize * 0.45, 9) }}
                          >
                            {cell.num && <span className="cell-number">{cell.num}</span>}
                            <input
                              ref={el => inputRefs.current[`${r}-${c}`] = el}
                              type="text" maxLength={2} value={userInputs[`${r}-${c}`] || ''}
                              onChange={(e) => handleCellChange(r, c, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, r, c)}
                              onFocus={() => handleFocus(r, c, cell.words)}
                              readOnly={isCompletedGame || isCorrect}
                              className={cn("cell-letter", textClass)}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                  </div>
                </div>

                <div className="clues-section flex flex-col gap-8 pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {(() => {
                    let visibleWords = puzzleData.words;
                    const isRestrictedLevel = level === 'hard' || level === 'pro';
                    
                    if (isMobileSmall && isRestrictedLevel && !showAllClues) {
                      const total = puzzleData.words.length;
                      if (total > 6) {
                        const estimatedFit = Math.min(9, Math.max(6, total));
                        visibleWords = puzzleData.words.slice(0, estimatedFit);
                      }
                    }

                    const acrossWords = visibleWords.filter(w => w.dir === 'across').sort((a, b) => a.num - b.num);
                    const downWords = visibleWords.filter(w => w.dir === 'down').sort((a, b) => a.num - b.num);
                    const hiddenCount = puzzleData.words.length - visibleWords.length;
                    const hasHiddenWords = hiddenCount > 0;

                    return (
                      <>
                        {acrossWords.length > 0 && (
                          <div>
                            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 uppercase text-sm tracking-wider">Across</h3>
                            <ul className="space-y-3">
                              {acrossWords.map(w => (
                                <li key={w.id} onClick={() => { if (gameState !== 'playing') return; setActiveDirection('across'); setActiveWordId(w.id); setActiveCell({ r: w.r, c: w.c }); inputRefs.current[`${w.r}-${w.c}`]?.focus(); }} className={cn("text-sm p-2 rounded-lg cursor-pointer transition-colors border", activeWordId === w.id ? "bg-amber-50 border-amber-200 text-amber-900 font-medium shadow-sm" : completedWords[`across-${w.id}`]?.completed ? "bg-green-50 border-green-200 text-green-800" : "border-transparent text-slate-600 hover:bg-slate-50")}>
                                  <span className="font-bold mr-2">{w.num}.</span>{w.clue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {downWords.length > 0 && (
                          <div>
                            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2 uppercase text-sm tracking-wider">Down</h3>
                            <ul className="space-y-3">
                              {downWords.map(w => (
                                <li key={w.id} onClick={() => { if (gameState !== 'playing') return; setActiveDirection('down'); setActiveWordId(w.id); setActiveCell({ r: w.r, c: w.c }); inputRefs.current[`${w.r}-${w.c}`]?.focus(); }} className={cn("text-sm p-2 rounded-lg cursor-pointer transition-colors border", activeWordId === w.id ? "bg-amber-50 border-amber-200 text-amber-900 font-medium shadow-sm" : completedWords[`down-${w.id}`]?.completed ? "bg-green-50 border-green-200 text-green-800" : "border-transparent text-slate-600 hover:bg-slate-50")}>
                                  <span className="font-bold mr-2">{w.num}.</span>{w.clue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {hasHiddenWords && (
                          <div className="mt-4 flex justify-center">
                            <Button 
                              variant="outline" 
                              onClick={() => setShowAllClues(true)}
                              className="w-full text-sm font-medium border-slate-300 text-slate-600 hover:bg-slate-50"
                            >
                              Load more questions ({hiddenCount} hidden)
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}

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

        {gameState === 'warning' && (
          <UniversalProModal
            constraintType="time"
            onStart={() => startGameLogic()}
            onCancel={() => {
              setGameState('idle');
              setLevel('hard');
            }}
          />
        )}

        {gameState === 'timeout' && (
          <TimeoutModal
            level={level}
            onPlayAgain={initGame}
            onQuit={onQuit}
          />
        )}
      </div>
    </div>
  );
}
