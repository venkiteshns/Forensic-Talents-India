import { useState, useEffect } from 'react';

const LEVELS = ["easy", "medium", "hard", "pro"];

export default function useGameProgress(gameId) {
  const [progress, setProgress] = useState('easy');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('game_progress') || '{}');
      if (stored[gameId] && LEVELS.includes(stored[gameId])) {
        setProgress(stored[gameId]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [gameId]);

  const unlockNextLevel = (currentLevel) => {
    const currentIndex = LEVELS.indexOf(currentLevel);
    const progressIndex = LEVELS.indexOf(progress);
    
    // The literal next level in the sequence
    const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : currentLevel;
    
    // Only upgrade progress if they are playing the maximum unlocked level
    if (currentIndex >= progressIndex && currentIndex < LEVELS.length - 1) {
      setProgress(nextLevel);
      try {
        const stored = JSON.parse(localStorage.getItem('game_progress') || '{}');
        stored[gameId] = nextLevel;
        localStorage.setItem('game_progress', JSON.stringify(stored));
      } catch (e) {
        console.error(e);
      }
    }
    
    return nextLevel;
  };

  const isUnlocked = (level) => {
    return LEVELS.indexOf(level) <= LEVELS.indexOf(progress);
  };

  return { progress, isUnlocked, unlockNextLevel };
}
