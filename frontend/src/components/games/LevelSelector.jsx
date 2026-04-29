import React from 'react';
import { cn } from '../../utils/cn';
import { Lock, Check } from 'lucide-react';

const LEVELS = ["easy", "medium", "hard", "pro"];

export default function LevelSelector({ currentLevel, onSelectLevel, isUnlocked }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-4">
        {LEVELS.map((lvl) => {
          const unlocked = isUnlocked(lvl);
          
          return (
            <button
              key={lvl}
              disabled={!unlocked}
              onClick={() => onSelectLevel(lvl)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 capitalize shadow-sm border",
                currentLevel === lvl 
                  ? "bg-slate-900 text-white border-slate-900 scale-[1.02] shadow-md" 
                  : unlocked 
                    ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300" 
                    : "opacity-60 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200"
              )}
            >
              {lvl}
              {!unlocked && <Lock size={14} className="ml-0.5" />}
              {unlocked && lvl !== currentLevel && <Check size={14} className="ml-0.5 text-green-600 opacity-0" />}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-slate-500 h-5 mt-1 font-medium">
        {!isUnlocked(LEVELS[LEVELS.length - 1]) && "Complete the previous level to unlock the next stage."}
      </p>
    </div>
  );
}
