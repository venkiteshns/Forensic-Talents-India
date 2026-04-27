import React, { useState, useEffect, useRef } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

import api from '../../utils/api';

// Fallback theme image
const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop';
const GRID_SIZE = 3; // 3x3 puzzle

const generatePuzzlePieces = () => {
  const pieces = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
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

export default function JigsawGame({ onQuit }) {
  const [puzzleImage, setPuzzleImage] = useState(null);
  const [pieceImages, setPieceImages] = useState({});

  const [pieces, setPieces] = useState([]);
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const gameSectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadAndSliceImage = (url) => {
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
        const pieceSize = boardSize / GRID_SIZE;

        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
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
        setPieceImages(newPieceImages);
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
    });
  };

  const handleStartGameClick = async () => {
    setGameState('loading');
    
    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    let imgUrl = FALLBACK_IMAGE_URL;
    try {
      const storedPlayedIds = JSON.parse(localStorage.getItem('playedJigsawIds') || '[]');
      const res = await api.get(`/game/jigsaw?playedIds=${storedPlayedIds.join(',')}`);
      
      if (res.data && res.data.imageUrl) {
        imgUrl = res.data.imageUrl;
        
        if (res.data.resetOccurred) {
          localStorage.setItem('playedJigsawIds', JSON.stringify([res.data._id]));
        } else {
          localStorage.setItem('playedJigsawIds', JSON.stringify([...storedPlayedIds, res.data._id]));
        }
      }
    } catch (err) {
      console.error("Using fallback jigsaw. Error:", err.message);
    }
    
    setPuzzleImage(imgUrl);
    await loadAndSliceImage(imgUrl);

    setPieces(generatePuzzlePieces());
    setSelectedPieceId(null);
    setMoves(0);
    setTimeElapsed(0);
    setGameState('playing');
    setIsGameComplete(false);
  };

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

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

  const checkWin = (currentPieces) => {
    const isWin = currentPieces.every(p => p.correctRow === p.currentRow && p.correctCol === p.currentCol);
    if (isWin) {
      setGameState('completed');
      setIsGameComplete(true);
      triggerConfetti();
    }
  };

  // Fallback validation (extra safety)
  useEffect(() => {
    if (gameState === 'playing' && pieces.length > 0) {
      const isWin = pieces.every(p => p.correctRow === p.currentRow && p.correctCol === p.currentCol);
      if (isWin && !isGameComplete) {
        setGameState('completed');
        setIsGameComplete(true);
        triggerConfetti();
      }
    }
  }, [pieces, gameState, isGameComplete]);

  const handlePieceClick = (clickedId) => {
    if (gameState !== 'playing') return;

    if (!selectedPieceId) {
      // Select the first piece
      setSelectedPieceId(clickedId);
    } else {
      if (selectedPieceId === clickedId) {
        // Deselect if clicked again
        setSelectedPieceId(null);
        return;
      }

      // Swap the two pieces
      setMoves(m => m + 1);
      setPieces(prev => {
        const p1 = prev.find(p => p.id === selectedPieceId);
        const p2 = prev.find(p => p.id === clickedId);

        const tempR = p1.currentRow;
        const tempC = p1.currentCol;

        const newPieces = prev.map(p => {
          if (p.id === selectedPieceId) {
            return { ...p, currentRow: p2.currentRow, currentCol: p2.currentCol };
          }
          if (p.id === clickedId) {
            return { ...p, currentRow: tempR, currentCol: tempC };
          }
          return p;
        });

        checkWin(newPieces);
        return newPieces;
      });
      setSelectedPieceId(null);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // The actual visual grid dimensions
  // We use CSS Grid to position pieces absolutely based on their current row/col
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
              Jigsaw Puzzle: The Image Restorer
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Analyze the fragments. Click two tiles to swap their positions and restore the original image.
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
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 w-full">
                <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-32 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="w-full max-w-[600px] aspect-square bg-slate-100 animate-pulse border border-slate-200 shadow-xl rounded-xl"></div>
            </div>
          </Container>
        )}

        {(gameState === 'playing' || gameState === 'completed') && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="text-primary" size={24} />
                    Jigsaw Swap
                  </h2>
                  <p className="text-slate-500 mt-1">Select two pieces to swap them.</p>
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
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Swaps</p>
                    <div className="text-xl font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">
                      {moves}
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Area */}
              <div className="w-full max-w-[600px] aspect-square relative bg-[#000] overflow-hidden border border-slate-700 shadow-xl">
                {pieces.map((piece) => {
                  const isSelected = selectedPieceId === piece.id;
                  const isCorrect = piece.currentRow === piece.correctRow && piece.currentCol === piece.currentCol;

                  return (
                    <div
                      key={piece.id}
                      onClick={() => handleCardClick(piece.id)} // For keyboard users or fallback
                      onMouseDown={() => handlePieceClick(piece.id)}
                      className={cn(
                        "absolute transition-all duration-300 ease-in-out border border-white/20 bg-black cursor-pointer overflow-hidden",
                        isSelected ? "z-20 ring-4 ring-primary ring-inset scale-105 shadow-xl" : "z-10 hover:z-20 hover:scale-[1.02] hover:shadow-lg"
                      )}
                      style={{
                        width: `${100 / GRID_SIZE}%`,
                        height: `${100 / GRID_SIZE}%`,
                        left: `${(piece.currentCol * 100) / GRID_SIZE}%`,
                        top: `${(piece.currentRow * 100) / GRID_SIZE}%`,
                      }}
                    >
                      {/* The image slice */}
                      <div
                        className={cn(
                          "w-full h-full transition-all duration-500",
                          gameState === 'completed' ? "opacity-100" : isCorrect ? "opacity-90 grayscale-[20%]" : "opacity-80"
                        )}
                      >
                        {pieceImages[piece.id] && (
                          <img src={pieceImages[piece.id]} alt="puzzle piece" className="w-full h-full object-cover block m-0 p-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Target Image Reference */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-700 shadow-sm shrink-0 bg-[#000] flex items-center justify-center p-2">
                  <img src={puzzleImage} alt="Target" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={initGame} variant="outline" className="flex items-center gap-2 font-bold text-slate-600 justify-center">
                    <RefreshCw size={18} /> Restart Puzzle
                  </Button>
                  <button
                    onClick={onQuit}
                    className="px-6 py-2.5 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    Quit Game
                  </button>
                </div>
              </div>

              {isGameComplete && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100/50">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-slate-900 mb-2 tracking-tight">Image Restored!</h3>
                  <p className="text-slate-600 mb-8 max-w-md text-base leading-relaxed">
                    You have successfully assembled the evidence.
                    <br /><br />
                    <span className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      Time: <span className="text-primary font-bold">{formatTime(timeElapsed)}</span> • Swaps: <span className="text-primary font-bold">{moves}</span>
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
