import React from 'react';

const UserNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      
      {/* Clean, Corporate Card Container */}
      <div className="relative flex flex-col items-center text-center p-10 md:p-16 max-w-2xl w-full bg-white border border-gray-200 rounded-xl shadow-sm">
        
        {/* Brand-Colored 404 */}
        <h1 className="text-7xl md:text-9xl font-extrabold text-[#0A0F1E] tracking-tight mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-[#0A0F1E] mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-10 text-base md:text-lg leading-relaxed max-w-md mx-auto">
          We apologize, but we couldn't find the page you were looking for. The link might be outdated, or the page may have been moved.
        </p>

        {/* Corporate Button Matching Hero Section */}
        <a 
          href="/" 
          className="inline-block px-8 py-3 bg-[#D4AF37] text-[#0A0F1E] font-semibold text-sm md:text-base rounded-md hover:bg-[#c4a030] transition-colors duration-200 shadow-sm"
        >
          Return to Homepage
        </a>
        
      </div>
    </div>
  );
};

export default UserNotFound;
