import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { RefreshCw, Play, CheckCircle2, Clock, ArrowLeft, Fingerprint, Dna, Microscope, BadgeAlert, Camera, Search, Pipette, Briefcase } from 'lucide-react';
import { cn } from '../../utils/cn';

import api from '../../utils/api';

const ICONS = [
  { id: 'fingerprint', component: Fingerprint, color: 'text-blue-500' },
  { id: 'dna', component: Dna, color: 'text-green-500' },
  { id: 'microscope', component: Microscope, color: 'text-purple-500' },
  { id: 'badge', component: BadgeAlert, color: 'text-amber-500' },
  { id: 'camera', component: Camera, color: 'text-slate-500' },
  { id: 'search', component: Search, color: 'text-rose-500' },
  { id: 'pipette', component: Pipette, color: 'text-teal-500' },
  { id: 'briefcase', component: Briefcase, color: 'text-indigo-500' },
];

const generateDeck = (useIcons, customImages) => {
  let baseItems = [];

  if (!useIcons && customImages && customImages.length >= 4) {
    baseItems = customImages.map((img, index) => ({
      id: `img-${index}`,
      imageUrl: img,
      isImage: true
    }));
  } else {
    baseItems = [...ICONS];
  }

  const deck = [...baseItems, ...baseItems].map((item, index) => ({
    ...item,
    uniqueId: `${item.id}-${index}`
  }));

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function MatchingGame({ onQuit }) {
  const [gameConfig, setGameConfig] = useState({ useIcons: true, images: [] });

  const [deck, setDeck] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, completed
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

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

    let config = { useIcons: true, images: [] };
    try {
      const storedPlayedIds = JSON.parse(localStorage.getItem('playedMatchingGameIds') || '[]');
      const res = await api.get(`/game/matching?playedIds=${storedPlayedIds.join(',')}`);
      if (res.data) {
        if (res.data.resetOccurred) {
          localStorage.setItem('playedMatchingGameIds', JSON.stringify([res.data._id]));
        } else {
          localStorage.setItem('playedMatchingGameIds', JSON.stringify([...storedPlayedIds, res.data._id]));
        }
        
        config = {
          useIcons: res.data.useIcons,
          images: res.data.images || []
        };
      }
    } catch (err) {
      console.error("Using fallback icons. Error:", err.message);
    }
    
    setGameConfig(config);
    setDeck(generateDeck(config.useIcons, config.images));
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setMoves(0);
    setTimeElapsed(0);
    setGameState('playing');
    setIsGameComplete(false);
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
      // Add random colors based on game theme
      const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#f43f5e'];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      burstDiv.appendChild(particle);
    }

    document.body.appendChild(burstDiv);
    setTimeout(() => {
      if (document.body.contains(burstDiv)) document.body.removeChild(burstDiv);
      if (document.head.contains(style)) document.head.removeChild(style);
    }, 2500);
  };

  const handleCardClick = (index) => {
    if (gameState !== 'playing') return;
    if (flippedIndices.length === 2) return; // Wait for animation
    if (flippedIndices.includes(index)) return; // Already flipped
    if (matchedIds.has(deck[index].id)) return; // Already matched

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIndex, secondIndex] = newFlipped;
      if (deck[firstIndex].id === deck[secondIndex].id) {
        // Match!
        setTimeout(() => {
          setMatchedIds(prev => {
            const newSet = new Set(prev);
            newSet.add(deck[firstIndex].id);
            const totalPairs = deck.length / 2;
            console.log("Matched:", newSet.size, "Total:", totalPairs);
            
            if (newSet.size === totalPairs) {
              setGameState('completed');
              setIsGameComplete(true);
              triggerConfetti();
            }
            return newSet;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Fallback validation (extra safety)
  useEffect(() => {
    if (gameState === 'playing' && deck.length > 0) {
      const totalPairs = deck.length / 2;
      if (matchedIds.size === totalPairs && !isGameComplete) {
        setGameState('completed');
        setIsGameComplete(true);
        triggerConfetti();
      }
    }
  }, [matchedIds, deck.length, gameState, isGameComplete]);

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
              Forensic Memory Match
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Test your memory. Find the matching pairs of forensic equipment and evidence.
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
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 max-w-3xl mx-auto">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] sm:aspect-square bg-slate-100 rounded-xl sm:rounded-2xl animate-pulse"></div>
                ))}
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
                    Memory Grid
                  </h2>
                  <p className="text-slate-500 mt-1">Flip cards to find pairs.</p>
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
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Moves</p>
                    <div className="text-xl font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">
                      {moves}
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 max-w-3xl mx-auto">
                {deck.map((card, index) => {
                  const isFlipped = flippedIndices.includes(index) || matchedIds.has(card.id);
                  const isMatched = matchedIds.has(card.id);
                  const Icon = card.component;

                  return (
                    <div
                      key={card.uniqueId}
                      className="aspect-[3/4] sm:aspect-square relative cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onClick={() => handleCardClick(index)}
                    >
                      <div
                        className={cn(
                          "w-full h-full relative transition-transform duration-500 shadow-sm hover:shadow-md rounded-xl sm:rounded-2xl",
                          isFlipped ? "[transform:rotateY(180deg)]" : ""
                        )}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Front (Hidden state) */}
                        <div
                          className="absolute inset-0 backface-hidden bg-slate-100 border-2 border-slate-200 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="w-full h-full opacity-10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          <Fingerprint className="absolute text-slate-300 w-1/3 h-1/3" />
                        </div>

                        {/* Back (Revealed state) */}
                        <div
                          className={cn(
                            "absolute inset-0 backface-hidden bg-white border-2 rounded-xl sm:rounded-2xl flex items-center justify-center rotate-y-180 overflow-hidden",
                            isMatched ? "border-green-400 bg-green-50" : "border-primary"
                          )}
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          {card.isImage ? (
                            <img src={card.imageUrl} alt="Card Match" className="w-full h-full object-cover opacity-90" />
                          ) : (
                            <Icon className={cn("w-1/2 h-1/2", isMatched ? "text-green-500" : card.color)} />
                          )}
                          {isMatched && (
                            <div className="absolute top-2 right-2 text-green-500 bg-white rounded-full shadow-sm p-0.5">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={initGame} variant="outline" className="flex items-center gap-2 font-bold text-slate-600">
                  <RefreshCw size={18} /> Restart
                </Button>
                <button
                  onClick={onQuit}
                  className="px-6 py-2.5 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                  Quit Game
                </button>
              </div>

              {isGameComplete && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100/50">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-slate-900 mb-2 tracking-tight">Perfect Match!</h3>
                  <p className="text-slate-600 mb-8 max-w-md text-base leading-relaxed">
                    You have successfully matched all evidence pairs.
                    <br /><br />
                    <span className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                      Time: <span className="text-primary font-bold">{formatTime(timeElapsed)}</span> • Moves: <span className="text-primary font-bold">{moves}</span>
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
