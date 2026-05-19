import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, Fingerprint, Dna, Microscope, BadgeAlert, Camera, Search, Pipette, Briefcase, FileSignature, Gavel, Shield, FlaskConical, Crosshair, Scale, Skull, Eye, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import LevelSelector from './LevelSelector';
import CompletionModal from './CompletionModal';
import UniversalProModal from './UniversalProModal';
import useGameProgress from './useGameProgress';
import { useScrollToRef } from '../../hooks/useScrollToRef';



const MEMORY_LEVELS = {
  easy:    { pairs: 2 },
  medium:  { pairs: 4 },
  hard:    { pairs: 8 },
  pro:     { pairs: 12, maxMoves: 35 }
};

// ─── Lucide-React Forensic Fallback Icon Deck ────────────────────────────────
// Used whenever the backend API is unreachable (network outage, DB drop, etc.).
// 12 unique icons → duplicated + shuffled → up to 24-card game matrix (Pro level).
const FORENSIC_FALLBACK_ICONS = [
  { id: 'f-1',  type: 'fingerprint',   bg: '#EFF6FF', icon: <Fingerprint className="w-8 h-8" style={{ color: '#2563EB' }} /> },  // blue
  { id: 'f-2',  type: 'ballistics',    bg: '#FEF2F2', icon: <Crosshair   className="w-8 h-8" style={{ color: '#DC2626' }} /> },  // red
  { id: 'f-3',  type: 'cyber',         bg: '#F0FDF4', icon: <Shield      className="w-8 h-8" style={{ color: '#16A34A' }} /> },  // green
  { id: 'f-4',  type: 'analysis',      bg: '#FFF7ED', icon: <Search      className="w-8 h-8" style={{ color: '#EA580C' }} /> },  // orange
  { id: 'f-5',  type: 'legal',         bg: '#FAF5FF', icon: <Scale       className="w-8 h-8" style={{ color: '#7C3AED' }} /> },  // purple
  { id: 'f-6',  type: 'pathology',     bg: '#FFF1F2', icon: <Skull       className="w-8 h-8" style={{ color: '#BE123C' }} /> },  // rose
  { id: 'f-7',  type: 'surveillance',  bg: '#F0F9FF', icon: <Eye         className="w-8 h-8" style={{ color: '#0284C7' }} /> },  // sky
  { id: 'f-8',  type: 'documentation', bg: '#FEFCE8', icon: <FileText    className="w-8 h-8" style={{ color: '#CA8A04' }} /> },  // amber
  { id: 'f-9',  type: 'forensic-lab',  bg: '#F0FDF4', icon: <Microscope  className="w-8 h-8" style={{ color: '#059669' }} /> },  // emerald
  { id: 'f-10', type: 'judiciary',     bg: '#FFF7ED', icon: <Gavel       className="w-8 h-8" style={{ color: '#B45309' }} /> },  // brown
  { id: 'f-11', type: 'crime-scene',   bg: '#F5F3FF', icon: <Camera      className="w-8 h-8" style={{ color: '#6D28D9' }} /> },  // violet
  { id: 'f-12', type: 'investigation', bg: '#FFF1F2', icon: <Briefcase   className="w-8 h-8" style={{ color: '#9F1239' }} /> },  // crimson
];

const preloadImages = (images) => {
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

const generateDeck = (customImages, numPairs) => {
  if (!customImages || customImages.length < numPairs) return [];
  
  const imagesToUse = customImages.slice(0, numPairs);
  // Preload images to prevent lag during gameplay
  preloadImages(imagesToUse);
  
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

// Builds a paired + shuffled icon deck from FORENSIC_FALLBACK_ICONS.
// numPairs is capped at 8 (the array length) — pro mode will use 8 pairs.
const generateIconDeck = (numPairs) => {
  const icons = FORENSIC_FALLBACK_ICONS.slice(0, Math.min(numPairs, FORENSIC_FALLBACK_ICONS.length));
  return [...icons, ...icons]
    .map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
      isIcon: true,
    }))
    .sort(() => Math.random() - 0.5);
};


export default function MatchingGame({ onQuit }) {
  const { isUnlocked, unlockNextLevel } = useGameProgress('matching');
  const [level, setLevel] = useState('easy');
  
  const [gameConfig, setGameConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallbackUsed, setIsFallbackUsed] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);

  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [cardSize, setCardSize] = useState(0);
  const containerRef = useRef(null);
  const difficultySectionRef = useRef(null);
  const [startRef, scrollToStart] = useScrollToRef();

  const scrollToDifficultySection = () => {
    setTimeout(() => {
      if (!difficultySectionRef.current) return;
      if (window.innerWidth < 640) {
        difficultySectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      } else {
        const yOffset = -80; // adjust based on header height
        const y = difficultySectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    }, 100);
  };
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

  // Maps named difficulty → integer for odd/even asset routing
  // odd  (easy=1, hard=3) → local forensic icon deck (zero network cost)
  // even (medium=2, pro=4) → backend image fetch with icon fallback on failure
  const LEVEL_INDEX = { easy: 1, medium: 2, hard: 3, pro: 4 };

  const loadLevel = async (lvl) => {
    setIsLoading(true);
    const levelNum   = LEVEL_INDEX[lvl] ?? 1;
    const isIconLevel = levelNum % 2 !== 0;          // 1,3 → icons; 2,4 → images
    const cacheKey   = `matching-${lvl}`;
    const MIN_LOADING_TIME = 300;
    const startTime  = Date.now();

    if (isIconLevel) {
      // ── ODD LEVEL: local forensic icon deck, no network call ─────────────────
      console.log(`[MatchingGame] Level ${levelNum} (${lvl}): Building Local Forensic Icon Matrix.`);
      setGameConfig({ isIconFallback: true });
      setIsFallbackUsed(false); // icons are intentional here, not a fallback

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));
      }
      setIsLoading(false);
      return;
    }

    // ── EVEN LEVEL: query backend for image assets ────────────────────────────
    console.log(`[MatchingGame] Level ${levelNum} (${lvl}): Querying Forensic Laboratory Database for Images.`);
    try {
      const res = await api.get(`/game/matching?level=${lvl}`);

      if (!res.data || !res.data.images || res.data.images.length === 0) {
        throw new Error("Empty dataset");
      }

      setGameConfig({ images: res.data.images, isIconFallback: false });
      localStorage.setItem(cacheKey, JSON.stringify(res.data.images));
      setIsFallbackUsed(false);

    } catch (err) {
      console.warn(
        `[MatchingGame] Database connection issue on image level (${lvl}). Swapping to Local Forensic Icon Deck safely.`,
        err.message
      );

      // Tier 1: previously cached images from a successful session
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setGameConfig({ images: JSON.parse(cached), isIconFallback: false });
      } else {
        // Tier 2: zero-network Lucide-icon deck — works fully offline
        setGameConfig({ isIconFallback: true });
      }
      setIsFallbackUsed(true);

    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise(r => setTimeout(r, MIN_LOADING_TIME - elapsed));
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLevel(level);
  }, [level]);

  // Preload the next level's images only when that next level is an even (image) level
  useEffect(() => {
    const levels = ["easy", "medium", "hard", "pro"];
    const idx = levels.indexOf(level);
    if (idx >= 0 && idx < levels.length - 1) {
      const nextLvl    = levels[idx + 1];
      const nextNum    = LEVEL_INDEX[nextLvl] ?? 1;
      const nextIsIcon = nextNum % 2 !== 0;

      if (nextIsIcon) return; // icon levels need no network preload

      const preloadNextLevel = async (nl) => {
        try {
          const res = await api.get(`/game/matching?level=${nl}`);
          if (res.data && res.data.images) {
            localStorage.setItem(`matching-${nl}`, JSON.stringify(res.data.images));
          }
        } catch {}
      };
      preloadNextLevel(nextLvl);
    }
  }, [level]);

  const generateGameData = useCallback((config, lvl) => {
    if (!config) return null;
    const pairs = MEMORY_LEVELS[lvl].pairs;

    if (config.isIconFallback) {
      // Offline path: icon deck capped at available unique icons
      const actualPairs = Math.min(pairs, FORENSIC_FALLBACK_ICONS.length);
      const deck = generateIconDeck(actualPairs);
      // CRITICAL: config.pairs must equal actualPairs so the completion
      // check (matchedIds.size === config.pairs) fires at the right moment
      return { deck, config: { ...MEMORY_LEVELS[lvl], pairs: actualPairs } };
    }

    if (!config.images || config.images.length < 2) return null;
    // Use however many images the API returned; don't hard-fail on pair count
    const availablePairs = Math.min(pairs, config.images.length);
    const deck = generateDeck(config.images, availablePairs);
    return { deck, config: { ...MEMORY_LEVELS[lvl], pairs: availablePairs } };
  }, []);

  const nextGame = useMemo(() => {
    if ((gameState === 'idle' || gameState === 'playing') && gameConfig) {
      return generateGameData(gameConfig, level);
    }
    return null;
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

  const startGameLogic = () => {
    setGameState('loading');

    const gameToPlay = nextGame || generateGameData(gameConfig, level);
    setCurrentGame(gameToPlay);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setTimeElapsed(0);
    setGameState('playing');
  };

  const handleStartGameClick = () => {
    if (level === 'pro' && gameState !== 'warning') {
      setGameState('warning');
      return;
    }
    startGameLogic();
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
        <Container ref={difficultySectionRef} id="difficulty-section" className="mb-12 relative z-10 scroll-mt-32">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Select Difficulty</h2>
            <LevelSelector currentLevel={level} onSelectLevel={handleLevelChange} isUnlocked={isUnlocked} />
            <div className="mt-8 flex flex-col justify-center items-center px-3 gap-3">
              <button 
                ref={startRef}
                onClick={handleStartGameClick} 
                disabled={isLoading || (!nextGame && level !== 'pro')}
                className="start-game-btn w-full max-w-[260px] mx-auto flex items-center justify-center gap-2 text-[13px] min-[320px]:text-sm sm:text-base font-bold px-[12px] py-[10px] min-[320px]:px-4 min-[320px]:py-3 sm:px-6 sm:py-4 rounded-[10px] min-[320px]:rounded-xl bg-accent hover:bg-accent-light text-slate-900 transition-all duration-200 shadow-lg hover:shadow-accent/30 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
      <div id="gameStart" className="relative z-10">
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
                              {card.isIcon
                                ? <div className="w-full h-full flex items-center justify-center rounded-xl border border-slate-100" style={{ backgroundColor: isMatched ? '#F0FDF4' : (card.bg || '#F8FAFC') }}>{card.icon}</div>
                                : <img src={card.imageUrl} alt="Evidence" className="w-full h-full object-cover opacity-90 rounded-md" />
                              }
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
              requestAnimationFrame(() => {
                scrollToDifficultySection();
              });
            }}
            onQuit={onQuit}
          />
        )}

        {gameState === 'warning' && (
          <UniversalProModal
            constraintType="moves"
            onStart={() => startGameLogic()}
            onCancel={() => {
              setGameState('idle');
              setLevel('hard');
            }}
          />
        )}

        {gameState === 'failed' && createPortal(
          <div 
            className="fixed z-[9999] bg-black/40 backdrop-blur-[4px] flex items-center justify-center p-4 animate-in fade-in duration-500"
            style={{
              top: `${document.querySelector('header')?.offsetHeight || 72}px`,
              left: 0,
              width: '100%',
              height: `calc(100vh - ${document.querySelector('header')?.offsetHeight || 72}px)`,
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
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
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
