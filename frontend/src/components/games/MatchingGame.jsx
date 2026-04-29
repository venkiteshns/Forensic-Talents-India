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

const ICONS = [
  { id: 'fingerprint', component: Fingerprint, color: 'text-blue-500' },
  { id: 'dna', component: Dna, color: 'text-green-500' },
  { id: 'microscope', component: Microscope, color: 'text-purple-500' },
  { id: 'badge', component: BadgeAlert, color: 'text-amber-500' },
  { id: 'camera', component: Camera, color: 'text-slate-500' },
  { id: 'search', component: Search, color: 'text-rose-500' },
  { id: 'pipette', component: Pipette, color: 'text-teal-500' },
  { id: 'briefcase', component: Briefcase, color: 'text-indigo-500' },
  { id: 'signature', component: FileSignature, color: 'text-cyan-500' },
  { id: 'gavel', component: Gavel, color: 'text-yellow-600' },
  { id: 'shield', component: Shield, color: 'text-red-600' },
  { id: 'flask', component: FlaskConical, color: 'text-emerald-500' }
];

const MEMORY_LEVELS = {
  easy:    { pairs: 2 },
  medium:  { pairs: 6 },
  hard:    { pairs: 9 },
  pro:     { pairs: 12, maxMoves: 18 }
};

const generateDeck = (useIcons, customImages, numPairs) => {
  let baseItems = [];

  if (!useIcons && customImages && customImages.length >= numPairs) {
    baseItems = customImages.slice(0, numPairs).map((img, index) => ({
      id: `img-${index}`,
      imageUrl: img,
      isImage: true
    }));
  } else {
    // Duplicate some icons if we don't have enough (unlikely since we have 12 and max pairs is 12)
    baseItems = [...ICONS].slice(0, numPairs);
  }

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
  
  const [gameConfig, setGameConfig] = useState({ useIcons: true, images: [] });
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);

  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const gameSectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const storedPlayedIds = JSON.parse(localStorage.getItem('playedMatchingGameIds') || '[]');
      const res = await api.get(`/game/matching?playedIds=${storedPlayedIds.join(',')}`);
      if (res.data) {
        setGameConfig({ useIcons: res.data.useIcons, images: res.data.images || [] });
      }
    } catch (err) {
      console.error("Using fallback icons.");
    }
  };

  const generateGameData = useCallback((config, lvl) => {
    const deck = generateDeck(config.useIcons, config.images, MEMORY_LEVELS[lvl].pairs);
    return { deck, config: MEMORY_LEVELS[lvl] };
  }, []);

  useEffect(() => {
    if (gameState === 'idle' || gameState === 'playing') {
      setNextGame(generateGameData(gameConfig, level));
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
                Pro Level: You have a maximum of 18 moves. Plan carefully and play strategically.
              </div>
            )}
            <Button onClick={handleStartGameClick} variant="primary" className="px-8 py-3 text-lg flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg transition-all mt-6">
              <Play size={20} /> Start Game
            </Button>
          </div>
        </Container>
      )}

      <div ref={gameSectionRef} className="scroll-mt-32 relative z-10">
        {(gameState === 'playing' || gameState === 'completed' || gameState === 'failed') && currentGame && (
          <Container>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
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

              <div className="grid gap-3 sm:gap-4 max-w-[80vh] mx-auto overflow-hidden" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', maxHeight: '80vh' }}>
                {currentGame.deck.map((card, index) => {
                  const isFlipped = flippedIndices.includes(index) || matchedIds.has(card.id);
                  const isMatched = matchedIds.has(card.id);
                  const Icon = card.component;

                  return (
                    <div key={card.uniqueId} className="aspect-square relative cursor-pointer w-full max-w-[120px] mx-auto" style={{ perspective: '1000px' }} onClick={() => handleCardClick(index)}>
                      <div className={cn("w-full h-full relative transition-transform duration-500 shadow-sm hover:shadow-md rounded-xl", isFlipped && "[transform:rotateY(180deg)]")} style={{ transformStyle: 'preserve-3d' }}>
                        <div className="absolute inset-0 bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                          <Fingerprint className="absolute text-slate-300 w-1/3 h-1/3" />
                        </div>
                        <div className={cn("absolute inset-0 bg-white border-2 rounded-xl flex items-center justify-center overflow-hidden", isMatched ? "border-green-400 bg-green-50" : "border-primary")} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                          {card.isImage ? (
                            <img src={card.imageUrl} alt="Card Match" className="w-full h-full object-cover opacity-90" />
                          ) : (
                            <Icon className={cn("w-1/2 h-1/2", isMatched ? "text-green-500" : card.color)} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4 mt-8">
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
