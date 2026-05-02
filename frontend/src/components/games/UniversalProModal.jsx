import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

// constraintType can be 'time' or 'moves'
const UniversalProModal = ({ constraintType = 'time', onStart, onCancel }) => {
  
  // Lock background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; }
  }, []);

  const content = {
    time: {
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "Welcome to the Pro Tier. To accurately assess advanced cognitive agility, this challenge is conducted under strict time constraints. Precision and efficiency are essential."
    },
    moves: {
      icon: (
        <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      text: "Welcome to the Pro Tier. To accurately assess advanced spatial reasoning and memory retention, this challenge is conducted under a strict move limit. Strategic planning and precise execution are essential."
    }
  };

  const activeContent = content[constraintType];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-screen flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      
      <div className="relative flex flex-col items-center text-center p-8 md:p-12 max-w-lg w-full bg-white border border-gray-200 rounded-xl shadow-2xl">
        
        {/* Dynamic Icon */}
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[#D4AF37]/10">
          {activeContent.icon}
        </div>
        
        <h2 className="text-2xl font-bold text-[#0A0F1E] mb-3">
          Pro-Tier Challenge
        </h2>
        
        {/* Dynamic Text */}
        <p className="text-slate-600 mb-8 text-sm md:text-base leading-relaxed">
          {activeContent.text}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors w-full sm:w-auto"
          >
            Go Back
          </button>
          
          <button 
            onClick={onStart}
            className="px-6 py-2.5 bg-[#D4AF37] text-[#0A0F1E] font-semibold rounded-md hover:bg-[#c4a030] transition-colors shadow-sm w-full sm:w-auto"
          >
            Accept & Begin
          </button>
        </div>
        
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UniversalProModal;
