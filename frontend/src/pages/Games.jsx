import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Search, Image as ImageIcon, CheckSquare, PenTool, Play, Info } from 'lucide-react';
import { cn } from '../utils/cn';

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
  const navigate = useNavigate();

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

      {/* Disclaimer Section */}
      <Container className="mb-10 relative z-10 -mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg shadow-slate-200/50">
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-bold mr-1 tracking-tight">Disclaimer:</strong>
                These interactive modules are designed strictly for educational engagement and entertainment purposes. Participation in these exercises does not confer any formal certifications, academic credits, or professional rewards.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Game Selection Grid */}
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {GAMES.map((game, idx) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => navigate(`/games/${game.id}`)}
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
