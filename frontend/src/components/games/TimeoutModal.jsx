import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, RefreshCw, Grid } from 'lucide-react';

export default function TimeoutModal({ level, onPlayAgain, onQuit }) {
  useEffect(() => {
    const headerHeight = document.querySelector("header")?.offsetHeight || 72;
    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handlePlayAgain = () => {
    setTimeout(() => {
      onPlayAgain();
      document.getElementById("gameStart")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 120);
  };

  return createPortal(
    <div className="modal-overlay animate-in fade-in duration-300">
      <div className="modal-box shadow-2xl text-center flex flex-col items-center justify-center relative z-10 border border-slate-800 animate-in zoom-in-95 duration-250" style={{ scrollbarWidth: 'none' }}>
        
        <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-5 border border-red-500/20">
          <Clock className="w-7 h-7" strokeWidth={2} />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Time's Up!
        </h2>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-[300px]">
          You have reached the 5-minute time limit for the Pro Tier challenge. Precision and speed are critical.
        </p>
        
        <div className="flex flex-col gap-3 w-full">
          <button 
            onClick={handlePlayAgain} 
            className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>

          <button 
            onClick={onQuit} 
            className="w-full h-12 bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white font-semibold rounded-lg flex items-center justify-center gap-2 text-sm transition-colors mt-2"
          >
            <Grid className="w-4 h-4" /> Explore Other Games
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --header-height: 72px;
        }
        .modal-overlay {
          position: fixed;
          top: var(--header-height);
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9999;
        }
        .modal-box {
          width: min(92%, 420px);
          max-height: calc(100vh - var(--header-height) - 32px);
          overflow-y: auto;
          border-radius: 16px;
          padding: 20px;
          background: #0f172a;
        }
        @media (max-height: 600px) {
          .modal-box {
            max-height: calc(100vh - var(--header-height) - 16px);
          }
        }
      `}} />
    </div>,
    document.body
  );
}
