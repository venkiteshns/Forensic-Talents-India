import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, RefreshCw, GraduationCap } from 'lucide-react';

export default function CompletionModal({ 
  level, 
  timeElapsed, 
  moves, 
  onPlayAgain, 
  onNextLevel, 
  onQuit, 
  totalLevels = 4 
}) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Map string levels to numbers for the progress bar
  const levelMap = { 'easy': 1, 'medium': 2, 'hard': 3, 'pro': 4 };
  const currentLevelNum = typeof level === 'number' ? level : (levelMap[level] || 1);
  const displayTotal = Math.max(currentLevelNum, totalLevels);

  // Dynamic Titles
  const titles = ["Level Completed", "Excellent Work", "Well Done", "Outstanding Performance"];
  const dynamicTitle = useMemo(() => titles[Math.floor(Math.random() * titles.length)], []);

  useEffect(() => {
    // Show subtle confetti for a premium feel
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Deterministic alternation based on level number
  // Odd levels (1, 3, 5...) -> internship
  // Even levels (2, 4...) -> courses
  const ctaType = currentLevelNum % 2 !== 0 ? 'internships' : 'courses';

  const handleExplore = () => {
    if (ctaType === 'courses') {
      navigate('/education/certificates');
    } else {
      navigate('/education/internships');
    }
  };

  const handleSecondaryAction = () => {
    if (onNextLevel && currentLevelNum < displayTotal) {
      onNextLevel();
    } else {
      onPlayAgain();
    }
  };

  return createPortal(
    <div className="modal-overlay">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[10000]">
          {Array.from({ length: 32 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: ['#16A34A', '#22C55E', '#2563EB', '#60A5FA'][Math.floor(Math.random() * 4)],
                animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="modal-container animate-modal-entry">
        {/* Success Icon */}
        <div className="success-icon-container">
          <div className="success-icon-bg">
            <CheckCircle2 className="w-8 h-8 text-[#16A34A]" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="modal-title">{dynamicTitle}</h2>
        
        {/* Progress Display */}
        <div className="progress-section">
          <div className="progress-text">Level {currentLevelNum} / {displayTotal} completed</div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(currentLevelNum / displayTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Performance Summary */}
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">TIME</span>
            <span className="stat-value">{timeElapsed}</span>
          </div>
          {moves !== undefined && moves !== null && (
            <div className="stat-item">
              <span className="stat-label">MOVES</span>
              <span className="stat-value">{moves}</span>
            </div>
          )}
        </div>
        
        {/* Reinforcement Message */}
        <p className="reinforcement-message">
          You’ve successfully completed this challenge with strong accuracy and focus.
          <br /><br />
          Ready to take your skills to the next level? Explore {ctaType === 'courses' ? 'structured courses' : 'internship programs'} designed to build real-world expertise.
        </p>
        
        {/* CTA Section */}
        <div className="cta-group">
          <button 
            onClick={handleExplore} 
            className="primary-cta"
          >
            <GraduationCap className="w-5 h-5" />
            Explore {ctaType === 'courses' ? 'Certified Courses' : 'Internship Programs'}
          </button>
          
          <button 
            onClick={handleSecondaryAction} 
            className="secondary-cta"
          >
            Continue Playing
            <ChevronRight className="w-4 h-4" />
          </button>

          <button 
            onClick={onPlayAgain} 
            className="text-link-cta"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restart Level
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          z-index: 9999;
          animation: fade-in 300ms ease-out;
        }

        .modal-container {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 32px 24px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .animate-modal-entry {
          animation: modal-scale-in 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .success-icon-container {
          margin-bottom: 20px;
        }

        .success-icon-bg {
          width: 64px;
          height: 64px;
          background: #ECFDF5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #D1FAE5;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 12px;
        }

        .progress-section {
          width: 100%;
          margin-bottom: 24px;
          max-width: 280px;
        }

        .progress-text {
          font-size: 12px;
          font-weight: 600;
          color: #16A34A;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .progress-bar-container {
          width: 100%;
          height: 6px;
          background: #ECFDF5;
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #22C55E;
          border-radius: 100px;
          transition: width 1s cubic-bezier(0.65, 0, 0.35, 1);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 16px;
          width: 100%;
          margin-bottom: 24px;
          padding: 16px;
          background: #F8FAFC;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 10px;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #1E293B;
        }

        .reinforcement-message {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 32px;
          padding: 0 8px;
        }

        .cta-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .primary-cta {
          background: #2563EB;
          color: white;
          height: 48px;
          border-radius: 12px;
          font-weight: 600;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 200ms ease;
          border: none;
          cursor: pointer;
          font-size: 15px;
        }

        .primary-cta:hover {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15);
        }

        .secondary-cta {
          background: transparent;
          color: #475569;
          height: 48px;
          border-radius: 12px;
          font-weight: 600;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 200ms ease;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          font-size: 14px;
        }

        .secondary-cta:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          color: #1E293B;
        }

        .text-link-cta {
          background: transparent;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: color 200ms ease;
        }

        .text-link-cta:hover {
          color: #64748B;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-scale-in {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        @media (max-width: 480px) {
          .modal-container {
            width: 92%;
            padding: 32px 20px;
          }
          .modal-title {
            font-size: 18px;
          }
        }
      `}} />
    </div>,
    document.body
  );
}
