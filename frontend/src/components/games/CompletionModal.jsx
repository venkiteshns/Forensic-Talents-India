import React, { useEffect, useState } from 'react';
import { CheckCircle2, Award, ChevronRight, RefreshCw, Grid } from 'lucide-react';

export default function CompletionModal({ level, timeElapsed, moves, onPlayAgain, onNextLevel, onQuit }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const isPro = level === 'pro';

  useEffect(() => {
    if (isPro) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [isPro]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-300">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-sm bg-amber-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'][Math.floor(Math.random() * 4)],
                animation: `confetti-drop ${1.2 + Math.random() * 0.6}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                animationDelay: `${Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-[420px] bg-[#111827] rounded-xl shadow-2xl p-6 md:p-8 text-center flex flex-col items-center justify-center relative z-10 border border-slate-800 animate-in zoom-in-95 duration-200">
        
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-5 border border-emerald-500/20">
          {isPro ? <Award className="w-7 h-7" strokeWidth={2} /> : <CheckCircle2 className="w-7 h-7" strokeWidth={2} />}
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          {isPro ? "Congratulations" : "Level Completed"}
        </h2>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-[300px]">
          {isPro 
            ? "You have completed the Pro Level. This reflects strong attention to detail and problem-solving ability." 
            : "Well done. You've successfully completed this level."}
        </p>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-6 py-3 text-sm text-slate-300 mb-8 flex justify-center gap-6 w-full">
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Time</span>
            <span className="font-semibold text-white text-base">{timeElapsed}</span>
          </div>
          {moves !== undefined && moves !== null && (
            <div>
              <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Moves</span>
              <span className="font-semibold text-white text-base">{moves}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 w-full">
          {!isPro && (
            <button 
              onClick={onNextLevel} 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
            >
              Continue to Next Level <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          <button 
            onClick={onPlayAgain} 
            className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Play Again
          </button>

          {isPro && (
            <button 
              onClick={onQuit} 
              className="w-full h-12 bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors mt-2"
            >
              <Grid className="w-4 h-4" /> Explore Other Games
            </button>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes confetti-drop {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
      `}} />
    </div>
  );
}
