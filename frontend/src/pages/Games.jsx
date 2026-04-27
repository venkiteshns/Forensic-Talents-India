import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Search, Image as ImageIcon, CheckSquare, PenTool, Play } from 'lucide-react';
import { cn } from '../utils/cn';

// Import Games
import WordSearchGame from '../components/games/WordSearchGame';
import MatchingGame from '../components/games/MatchingGame';
import JigsawGame from '../components/games/JigsawGame';
import CrosswordGame from '../components/games/CrosswordGame';

const GAMES = [
  {
    id: 'word-search',
    title: 'Word Search',
    description: 'Find hidden forensic and investigative terms within the grid. Test your observation skills.',
    icon: Search,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50'
  },
  {
    id: 'matching',
    title: 'Memory Match',
    description: 'Test your memory. Find the matching pairs of forensic equipment and evidence.',
    icon: CheckSquare,
    color: 'bg-green-500',
    lightColor: 'bg-green-50'
  },
  {
    id: 'jigsaw',
    title: 'Jigsaw Puzzle',
    description: 'Analyze the fragments. Swap tiles to restore the forensic image.',
    icon: ImageIcon,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50'
  },
  {
    id: 'crossword',
    title: 'Crossword',
    description: 'Test your knowledge of forensic science terminology with this interactive crossword.',
    icon: PenTool,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50'
  }
];

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeGame]);

  const handleQuit = () => {
    setActiveGame(null);
  };

  // If a game is active, render it instead of the hub
  if (activeGame === 'word-search') return <WordSearchGame onQuit={handleQuit} />;
  if (activeGame === 'matching') return <MatchingGame onQuit={handleQuit} />;
  if (activeGame === 'jigsaw') return <JigsawGame onQuit={handleQuit} />;
  if (activeGame === 'crossword') return <CrosswordGame onQuit={handleQuit} />;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-12" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Forensic Games Hub
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Test your investigative skills and forensic knowledge with our interactive training exercises. Select a module below to begin.
            </p>
          </div>
        </Container>
      </section>

      {/* Game Selection Grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {GAMES.map((game, idx) => {
            const Icon = game.icon;
            return (
              <div 
                key={game.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => setActiveGame(game.id)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-8 flex-grow">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner", game.lightColor)}>
                    <Icon className={cn("w-8 h-8", game.color.replace('bg-', 'text-'))} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {game.description}
                  </p>
                </div>
                
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                  <span className="font-bold text-slate-700 group-hover:text-primary transition-colors">
                    Play Now
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
