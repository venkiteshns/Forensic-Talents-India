import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import LevelSelector from './LevelSelector';
import CompletionModal from './CompletionModal';
import useGameProgress from './useGameProgress';

const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop';

const JIGSAW_LEVELS = {
  easy:    { grid: 2 },
  medium:  { grid: 3 },
  hard:    { grid: 4 },
  pro:     { grid: 5, moves: 30 }
};

const generatePuzzlePieces = (gridSize) => {
  const pieces = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      pieces.push({
        id: `piece-${r}-${c}`,
        correctRow: r,
        correctCol: c,
        currentRow: r,
        currentCol: c,
      });
    }
  }

  const positions = pieces.map(p => ({ r: p.currentRow, c: p.currentCol }));
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  pieces.forEach((p, idx) => {
    p.currentRow = positions[idx].r;
    p.currentCol = positions[idx].c;
  });

  return pieces;
};

const loadAndSliceImage = (url, gridSize) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      const boardSize = 600;
      const canvas = document.createElement('canvas');
      canvas.width = boardSize;
      canvas.height = boardSize;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, boardSize, boardSize);

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (canvas.width - scaledWidth) / 2;
      const offsetY = (canvas.height - scaledHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      const newPieceImages = {};
      const pieceSize = boardSize / gridSize;

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const pieceCanvas = document.createElement('canvas');
          pieceCanvas.width = pieceSize;
          pieceCanvas.height = pieceSize;
          const pCtx = pieceCanvas.getContext('2d');

          pCtx.drawImage(
            canvas,
            c * pieceSize, r * pieceSize, pieceSize, pieceSize,
            0, 0, pieceSize, pieceSize
          );

          newPieceImages[`piece-${r}-${c}`] = pieceCanvas.toDataURL('image/jpeg', 0.9);
        }
      }
      resolve({ pieceImages: newPieceImages, puzzleImage: url });
    };
    img.onerror = () => {
      resolve({ pieceImages: {}, puzzleImage: url });
    };
  });
};

export default function JigsawGame({ onQuit }) {
  const { isUnlocked, unlockNextLevel } = useGameProgress('jigsaw');
  const [level, setLevel] = useState('easy');
  
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);

  const [gameState, setGameState] = useState('idle');
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  const gameSectionRef = useRef(null);
  const isGeneratingRef = useRef(false);

  const loadLevel = async (lvl) => {
    setIsLoading(true);
    const cacheKey = `jigsaw-${lvl}`;
    const cached = localStorage.getItem(cacheKey);
    let data;

    try {
      if (cached) {
        data = JSON.parse(cached);
      } else {
        const res = await api.get(`/game/jigsaw?level=${lvl}`);
        if (!res.data || !res.data.imageUrl) throw new Error("Empty dataset");
        data = res.data;
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Data load failed:", err);
      // Fallback ONLY here
      setImageUrl(FALLBACK_IMAGE_URL);
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
         const cacheKey = `jigsaw-${lvl}`;
         if (!localStorage.getItem(cacheKey)) {
           try {
             const res = await api.get(`/game/jigsaw?level=${lvl}`);
             if (res.data && res.data.imageUrl) localStorage.setItem(cacheKey, JSON.stringify(res.data));
           } catch {}
         }
       };
       preloadLevel(nextLvl);
    }
  }, [level]);

  const generateGameData = useCallback(async (url, lvl) => {
    const config = JIGSAW_LEVELS[lvl];
    const pieces = generatePuzzlePieces(config.grid);
    const { pieceImages } = await loadAndSliceImage(url, config.grid);
    return { pieces, pieceImages, config, puzzleImage: url };
  }, []);

  useEffect(() => {
    if ((gameState === 'idle' || gameState === 'playing') && !isGeneratingRef.current && imageUrl) {
      isGeneratingRef.current = true;
      generateGameData(imageUrl, level).then(next => {
        setNextGame(next);
        isGeneratingRef.current = false;
      });
    }
  }, [imageUrl, level, gameState, generateGameData]);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'completed' || gameState === 'failed') document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [gameState]);

  const handleStartGameClick = async () => {
    setGameState('loading');
    setTimeout(() => gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    try {
      let gameToPlay = nextGame;
      if (!gameToPlay) {
        gameToPlay = await generateGameData(imageUrl, level);
      }
      
      if (!gameToPlay || !gameToPlay.pieces) throw new Error("Invalid game data");
      
      setCurrentGame(gameToPlay);
      setSelectedPieceId(null);
      setMoves(0);
      setTimeElapsed(0);
      setGameState('playing');
    } catch (err) {
      console.error(err);
      setGameState('error');
    }
  };

  const initGame = () => handleStartGameClick();

  const handleLevelChange = (newLevel) => {
    if (!isUnlocked(newLevel)) return;
    setLevel(newLevel);
    if (gameState !== 'idle') setGameState('idle');
  };

  const handlePieceClick = (clickedId) => {
    if (gameState !== 'playing') return;

    if (!selectedPieceId) {
      setSelectedPieceId(clickedId);
    } else {
      if (selectedPieceId === clickedId) {
        setSelectedPieceId(null);
        return;
      }

      const newMoves = moves + 1;
      setMoves(newMoves);
      
      setCurrentGame(prev => {
        const p1 = prev.pieces.find(p => p.id === selectedPieceId);
        const p2 = prev.pieces.find(p => p.id === clickedId);

        const tempR = p1.currentRow;
        const tempC = p1.currentCol;

        const newPieces = prev.pieces.map(p => {
          if (p.id === selectedPieceId) return { ...p, currentRow: p2.currentRow, currentCol: p2.currentCol };
          if (p.id === clickedId) return { ...p, currentRow: tempR, currentCol: tempC };
          return p;
        });

        const isWin = newPieces.every(p => p.correctRow === p.currentRow && p.correctCol === p.currentCol);
        if (isWin) {
          setGameState('completed');
          unlockNextLevel(level);
        } else if (prev.config.moves && newMoves >= prev.config.moves) {
          setGameState('failed');
        }

        return { ...prev, pieces: newPieces };
      });
      setSelectedPieceId(null);
    }
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Jigsaw Puzzle</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Analyze the fragments. Swap tiles to restore the image.</p>
          </div>
        </Container>
      </section>

      {gameState === 'idle' && (
        <Container id="levelSelectionArea" className="mb-12 relative z-10 scroll-mt-32">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Select Difficulty</h2>
            <LevelSelector currentLevel={level} onSelectLevel={handleLevelChange} isUnlocked={isUnlocked} />
            {level === 'pro' && (
              <div className="bg-red-50 text-red-700 text-sm font-bold p-3 rounded-xl mt-4 max-w-md mx-auto border border-red-100">
                Pro Level: Moves are limited. Complete the puzzle efficiently.
              </div>
            )}
            <div className="mt-8 flex justify-center px-3">
              <button 
                onClick={initGame} 
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
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 w-full">
                <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-32 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="w-full max-w-[60vh] max-h-[60vh] aspect-square rounded-xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:400%_100%] animate-[shimmer_1.2s_infinite]"></div>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                  0% { background-position: 100% 0; }
                  100% { background-position: -100% 0; }
                }
              `}} />
            </div>
          </Container>
        )}

        {gameState === 'error' && (
          <Container>
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-3xl p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-red-900 mb-3">Failed to load game</h2>
              <p className="text-red-700 mb-8 leading-relaxed">
                Unable to load image data. Please try again.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={initGame} variant="primary" className="bg-red-600 hover:bg-red-700 border-none px-6">
                  <RefreshCw size={18} className="mr-2" /> Retry
                </Button>
                <button onClick={onQuit} className="px-6 py-2 text-red-600 font-semibold hover:bg-red-100 rounded-lg transition-colors">
                  Go Back
                </button>
              </div>
            </div>
          </Container>
        )}

        {(gameState === 'playing' || gameState === 'completed' || gameState === 'failed') && currentGame && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="text-primary" size={24} /> Jigsaw Swap <span className="text-sm font-normal text-slate-500 uppercase ml-2 bg-slate-100 px-2 py-1 rounded">{level}</span>
                  </h2>
                  <p className="text-slate-500 mt-1">Select two pieces to swap them.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" /> {formatTime(timeElapsed)}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Swaps</p>
                    <div className={cn("text-xl font-bold px-4 py-1.5 rounded-lg border", currentGame.config.moves && moves >= currentGame.config.moves - 5 ? "text-red-600 bg-red-50 border-red-200" : "text-primary bg-primary/10 border-primary/20")}>
                      {moves} {currentGame.config.moves && `/ ${currentGame.config.moves}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[60vh] max-h-[60vh] aspect-square relative bg-[#000] overflow-hidden border border-slate-700 shadow-xl">
                {currentGame.pieces.map((piece) => {
                  const isSelected = selectedPieceId === piece.id;
                  const isCorrect = piece.currentRow === piece.correctRow && piece.currentCol === piece.currentCol;
                  
                  return (
                    <div
                      key={piece.id}
                      onClick={() => handlePieceClick(piece.id)}
                      className={cn(
                        "absolute top-0 left-0 transition-transform duration-300 ease-in-out border border-white/20 bg-black cursor-pointer overflow-hidden",
                        isSelected ? "z-20 ring-4 ring-primary ring-inset scale-105 shadow-xl" : "z-10 hover:z-20 hover:scale-[1.02] hover:shadow-lg"
                      )}
                      style={{
                        width: `${100 / currentGame.config.grid}%`,
                        height: `${100 / currentGame.config.grid}%`,
                        transform: `translate(${piece.currentCol * 100}%, ${piece.currentRow * 100}%)`,
                      }}
                    >
                      <div className={cn("w-full h-full transition-all duration-500", gameState === 'completed' ? "opacity-100" : isCorrect ? "opacity-90 grayscale-[20%]" : "opacity-80")}>
                        {currentGame.pieceImages[piece.id] && (
                          <img src={currentGame.pieceImages[piece.id]} alt="puzzle piece" className="w-full h-full object-cover block m-0 p-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-700 shadow-sm shrink-0 bg-[#000] flex items-center justify-center p-2">
                  <img src={currentGame.puzzleImage} alt="Target" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={initGame} variant="outline" className="flex items-center gap-2 font-bold text-slate-600 justify-center">
                    <RefreshCw size={18} /> Restart Puzzle
                  </Button>
                  <button onClick={onQuit} className="px-6 py-2.5 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                    Quit Game
                  </button>
                </div>
              </div>
            </div>
          </Container>
        )}

        {gameState === 'completed' && (
          <CompletionModal
            level={level}
            timeElapsed={formatTime(timeElapsed)}
            moves={moves}
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

        {gameState === 'failed' && (
          <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[4px] flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="w-full max-w-[300px] sm:max-w-[360px] bg-white rounded-[16px] shadow-2xl p-6 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-red-100/60">
                <RefreshCw className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <h2 className="text-[22px] font-heading font-bold text-slate-900 mb-2">Out of Moves!</h2>
              <p className="text-slate-500 text-sm mb-4">You exceeded the maximum allowed swaps.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-1.5 text-sm font-semibold text-slate-700 mb-6 w-full flex justify-center gap-3">
                <span>Time: <span className="text-primary">{formatTime(timeElapsed)}</span></span>
                <span>Swaps: <span className="font-bold text-red-500">{moves}</span></span>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <button onClick={initGame} className="w-full h-10 bg-slate-900 text-white hover:bg-slate-800 shadow-md font-bold rounded-lg flex items-center justify-center gap-2 text-sm">
                  <Play className="w-4 h-4 fill-white" /> Try Again
                </button>
                <button onClick={() => setGameState('idle')} className="w-full h-10 font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center text-sm">
                  Change Level
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
