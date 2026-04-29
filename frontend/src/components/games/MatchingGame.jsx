import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, Fingerprint, Dna, Microscope, BadgeAlert, Camera, Search, Pipette, Briefcase, FileSignature, Gavel, Shield, FlaskConical } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import LevelSelector from './LevelSelector';
import CompletionModal from './CompletionModal';
import useGameProgress from './useGameProgress';



const MEMORY_LEVELS = {
  easy:    { pairs: 2 },
  medium:  { pairs: 4 },
  hard:    { pairs: 8 },
  pro:     { pairs: 12, maxMoves: 35 }
};

const generateDeck = (customImages, numPairs) => {
  if (!customImages || customImages.length < numPairs) return [];
  
  const imagesToUse = customImages.slice(0, numPairs);
  // Preload images to prevent lag during gameplay
  imagesToUse.forEach(url => {
    const img = new Image();
    img.src = url;
  });
  
  const baseItems = imagesToUse.map((img, index) => ({
    id: `img-${index}`,
    imageUrl: img,
    isImage: true
  }));

  const deck = [...baseItems, ...baseItems].map((item, index) => ({
    ...item,
    uniqueId: `${item.id}-${index}`
  }));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function MatchingGame({ onQuit }) {
  const { isUnlocked, unlockNextLevel } = useGameProgress('matching');
  const [level, setLevel] = useState('easy');
  
  const [gameConfig, setGameConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);

  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [cardSize, setCardSize] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateLayout = () => {
      const COLS = 4;
      const GAP = 8;
      const cardsCount = currentGame ? currentGame.deck.length : (gameState === 'loading' ? 16 : 0);
      if (cardsCount === 0) return;

      const rows = Math.ceil(cardsCount / COLS);
      
      // HEIGHT constraint
      const maxHeight = window.innerHeight * 0.9 - 140; // account for header and controls
      const totalGapHeight = GAP * (rows - 1);
      const heightBased = Math.floor((maxHeight - totalGapHeight) / rows);

      // WIDTH constraint (REAL FIX)
      const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
      const totalGapWidth = GAP * (COLS - 1);
      const widthBased = Math.floor((containerWidth - totalGapWidth) / COLS);

      // FINAL SIZE
      const calculatedSize = Math.min(heightBased, widthBased);
      
      const MIN = 32;
      const finalSize = Math.max(calculatedSize, MIN);
      
      setCardSize(finalSize);
    };

    calculateLayout();
    setTimeout(calculateLayout, 0); // ensure DOM is measured after initial render

    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [currentGame?.deck?.length, gameState]);

  const gameSectionRef = useRef(null);

  const loadLevel = async (lvl) => {
    setIsLoading(true);
    setGameConfig(null); // clear previous
    const cacheKey = `matching-${lvl}`;
    const cached = localStorage.getItem(cacheKey);

    try {
      if (cached) {
        const data = JSON.parse(cached);
        if (data.images && data.images.length > 0) {
          setGameConfig({ images: data.images });
          return;
        }
      }
      
      const res = await api.get(`/game/matching?level=${lvl}`);
      if (!res.data || !res.data.images?.length) {
        throw new Error("Empty dataset");
      }
      localStorage.setItem(cacheKey, JSON.stringify(res.data));
      setGameConfig({ images: res.data.images });
      
    } catch (err) {
      console.error("Data load failed:", err);
      setGameConfig(null);
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
         const cacheKey = `matching-${lvl}`;
         if (!localStorage.getItem(cacheKey)) {
           try {
             const res = await api.get(`/game/matching?level=${lvl}`);
             if (res.data) localStorage.setItem(cacheKey, JSON.stringify(res.data));
           } catch {}
         }
       };
       preloadLevel(nextLvl);
    }
  }, [level]);

  const generateGameData = useCallback((config, lvl) => {
    if (!config || !config.images || config.images.length < MEMORY_LEVELS[lvl].pairs) return null;
    const deck = generateDeck(config.images, MEMORY_LEVELS[lvl].pairs);
    return { deck, config: MEMORY_LEVELS[lvl] };
  }, []);

  useEffect(() => {
    if ((gameState === 'idle' || gameState === 'playing') && gameConfig) {
      setNextGame(generateGameData(gameConfig, level));
    } else if (!gameConfig) {
      setNextGame(null);
    }
  }, [gameConfig, level, gameState, generateGameData]);

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

  const handleStartGameClick = () => {
    setGameState('loading');
    setTimeout(() => gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    const gameToPlay = nextGame || generateGameData(gameConfig, level);
    setCurrentGame(gameToPlay);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setTimeElapsed(0);
    setGameState('playing');
  };

  const initGame = () => handleStartGameClick();

  const handleLevelChange = (newLevel) => {
    if (!isUnlocked(newLevel)) return;
    setLevel(newLevel);
    if (gameState !== 'idle') setGameState('idle');
  };

  const handleCardClick = (index) => {
    if (gameState !== 'playing' || isAnimating) return;
    if (flippedIndices.length >= 2) return;
    if (flippedIndices.includes(index) || matchedIds.has(currentGame.deck[index].id)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);
      setIsAnimating(true);
      
      const [firstIndex, secondIndex] = newFlipped;
      if (currentGame.deck[firstIndex].id === currentGame.deck[secondIndex].id) {
        setTimeout(() => {
          setMatchedIds(prev => {
            const newSet = new Set(prev).add(currentGame.deck[firstIndex].id);
            if (newSet.size === currentGame.config.pairs) {
              setGameState('completed');
              unlockNextLevel(level);
            } else if (currentGame.config.maxMoves && newMoves >= currentGame.config.maxMoves) {
              setGameState('failed');
            }
            return newSet;
          });
          setFlippedIndices([]);
          setIsAnimating(false);
        }, 500);
      } else {
        setTimeout(() => {
          if (currentGame.config.maxMoves && newMoves >= currentGame.config.maxMoves) {
            setGameState('failed');
          }
          setFlippedIndices([]);
          setIsAnimating(false);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans animate-in fade-in duration-500">
      <style dangerouslySetInnerHTML={{__html: `
        .game-layout {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 10px;
        }
        .header-section {
          width: 100%;
        }
        .controls-section {
          align-self: center;
        }
        .game-wrapper {
          width: 100%;
          max-width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          padding: 0 12px;
          box-sizing: border-box;
        }
        .card {
          width: 100%;
          height: 100%;
        }
        @media (max-width: 640px) {
          .game-layout {
            gap: 6px;
          }
        }
      `}} />
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Forensic Memory Match</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">Test your memory. Find the matching pairs of forensic equipment and evidence.</p>
          </div>
        </Container>
      </section>

      {gameState === 'idle' && (
        <Container className="mb-12 relative z-10">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Select Difficulty</h2>
            <LevelSelector currentLevel={level} onSelectLevel={handleLevelChange} isUnlocked={isUnlocked} />
            {level === 'pro' && (
              <div className="bg-red-50 text-red-700 text-sm font-bold p-3 rounded-xl mt-4 max-w-md mx-auto border border-red-100">
                Pro Level: You have a maximum of 35 moves. Plan carefully and play strategically.
              </div>
            )}
            <div className="mt-8 flex flex-col justify-center items-center px-3 gap-3">
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
              {!isLoading && !nextGame && (
                <p className="text-red-500 text-sm font-semibold max-w-sm mx-auto text-center">
                  No dataset available for this level. Please ask an admin to add one.
                </p>
              )}
            </div>
          </div>
        </Container>
      )}

      <div ref={gameSectionRef} id="gameStart" className="scroll-mt-32 relative z-10">
        {gameState === 'loading' && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative game-layout">
              <div className="header-section flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="w-48 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="w-32 h-8 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              {(() => {
                const COLS = 4;
                const GAP = 8;
                const rows = 4;
                const maxWidth = COLS * cardSize + GAP * (COLS - 1);
                return (
                  <div ref={containerRef} className="game-wrapper">
                    <div 
                      className="game-board" 
                      style={{ 
                        display: "grid",
                        gridTemplateColumns: `repeat(${COLS}, ${cardSize}px)`,
                        gridTemplateRows: `repeat(${rows}, ${cardSize}px)`,
                        gap: `${GAP}px`,
                        justifyContent: "center",
                        maxWidth: `${maxWidth}px`,
                        margin: "0 auto"
                      }}
                    >
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="card rounded-xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:400%_100%] animate-[shimmer_1.2s_infinite]" />
                      ))}
                    </div>
                  </div>
                );
              })()}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                  0% { background-position: 100% 0; }
                  100% { background-position: -100% 0; }
                }
              `}} />
            </div>
          </Container>
        )}

        {(gameState === 'playing' || gameState === 'completed' || gameState === 'failed') && currentGame && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative game-layout">
              <div className="header-section flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Search className="text-primary" size={24} /> Memory Grid <span className="text-sm font-normal text-slate-500 uppercase ml-2 bg-slate-100 px-2 py-1 rounded">{level}</span>
                  </h2>
                  <p className="text-slate-500 mt-1">Flip cards to find pairs.</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-slate-800 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-100">
                      <Clock size={18} className="text-accent" /> {formatTime(timeElapsed)}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Moves</p>
                    <div className={cn("text-xl font-bold px-4 py-1.5 rounded-lg border", currentGame.config.maxMoves && moves >= currentGame.config.maxMoves - 3 ? "text-red-600 bg-red-50 border-red-200" : "text-primary bg-primary/10 border-primary/20")}>
                      {moves} {currentGame.config.maxMoves && `/ ${currentGame.config.maxMoves}`}
                    </div>
                  </div>
                </div>
              </div>

              {(() => {
                const COLS = 4;
                const GAP = 8;
                const rows = Math.ceil(currentGame.deck.length / COLS);
                const maxWidth = COLS * cardSize + GAP * (COLS - 1);
                return (
                  <div ref={containerRef} className="game-wrapper">
                    <div 
                      className="game-board" 
                      style={{ 
                        display: "grid",
                        gridTemplateColumns: `repeat(${COLS}, ${cardSize}px)`,
                        gridTemplateRows: `repeat(${rows}, ${cardSize}px)`,
                        gap: `${GAP}px`,
                        justifyContent: "center",
                        maxWidth: `${maxWidth}px`,
                        margin: "0 auto"
                      }}
                    >
                      {currentGame.deck.map((card, index) => {
                        const isFlipped = flippedIndices.includes(index) || matchedIds.has(card.id);
                        const isMatched = matchedIds.has(card.id);
                        return (
                          <div key={card.uniqueId} className="card relative cursor-pointer mx-auto" style={{ perspective: '1000px' }} onClick={() => handleCardClick(index)}>
                          <div className={cn("w-full h-full relative transition-transform duration-500 shadow-sm hover:shadow-md rounded-xl", isFlipped && "[transform:rotateY(180deg)]")} style={{ transformStyle: 'preserve-3d' }}>
                            <div className="absolute inset-0 bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                              <Fingerprint className="absolute text-slate-300 w-1/3 h-1/3" />
                            </div>
                            <div className={cn("absolute inset-0 bg-white border-2 rounded-xl flex items-center justify-center overflow-hidden p-1.5", isMatched ? "border-green-400 bg-green-50" : "border-primary")} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                              <img src={card.imageUrl} alt="Card Match" className="w-full h-full object-cover opacity-90 rounded-md" />
                            </div>
                          </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="controls-section flex justify-center gap-4">
                <Button onClick={initGame} variant="outline" className="flex items-center gap-2 font-bold text-slate-600">
                  <RefreshCw size={18} /> Restart
                </Button>
                <button onClick={onQuit} className="px-6 py-2.5 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent">
                  Quit Game
                </button>
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
              <p className="text-slate-500 text-sm mb-4">You exceeded the maximum allowed moves.</p>

              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-1.5 text-sm font-semibold text-slate-700 mb-6 w-full flex justify-center gap-3">
                <span>Time: <span className="text-primary">{formatTime(timeElapsed)}</span></span>
                <span>Moves: <span className="font-bold text-red-500">{moves}</span></span>
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
