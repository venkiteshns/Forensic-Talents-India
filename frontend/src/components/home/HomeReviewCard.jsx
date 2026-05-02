import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

// Helper: get initials from name
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
}

export default function HomeReviewCard({ review }) {
  const [isClamped, setIsClamped] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkClamp = () => {
      if (textRef.current && !expanded) {
        setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };
    checkClamp();
    const observer = new ResizeObserver(checkClamp);
    if (textRef.current) observer.observe(textRef.current);
    window.addEventListener('resize', checkClamp);
    return () => {
      window.removeEventListener('resize', checkClamp);
      observer.disconnect();
    };
  }, [review.review, expanded]);

  return (
    <div className="bg-[#0D1117]/60 backdrop-blur-xl rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col h-full min-h-[220px] p-8 group hover:border-[rgba(255,255,255,0.15)] relative overflow-hidden">
      {/* Subtle top light catcher */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header Section */}
      <div className="flex flex-row items-center justify-between shrink-0 mb-6 gap-4">
        <div className="flex items-center gap-4">
          {review.profileImage ? (
            <img src={review.profileImage} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0 border border-[#D4AF37]/40" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#05070A] flex items-center justify-center text-[#D4AF37] font-bold text-lg shadow-sm shrink-0 border border-[#D4AF37]/40">
              {getInitials(review.name)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-[#F8FAFC] text-[1.1rem] leading-tight line-clamp-1">{review.name}</h4>
            <p className="text-[#94A3B8] text-[0.8rem] uppercase tracking-wider mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 shrink-0 bg-[#05070A]/50 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.05)]">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} className={star <= review.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-slate-800"} />
          ))}
        </div>
      </div>
      
      {/* Review Text */}
      <div className="flex-grow relative overflow-visible">
        <p 
          ref={textRef} 
          className={cn(
            "text-[#E2E8F0] leading-[1.6] text-[15px] font-sans whitespace-pre-line",
            expanded ? "block overflow-visible" : "line-clamp-4 overflow-hidden"
          )}
        >
          "{review.review}"
        </p>
      </div>

      {/* Read More Button */}
      <div className="pt-6 shrink-0 mt-auto">
        {(isClamped || expanded) && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[13px] font-bold text-[#D4AF37] hover:text-[#F8FAFC] transition-colors border-b border-transparent hover:border-[#F8FAFC] pb-0.5"
          >
            {expanded ? "Show Less" : "Read Full Review"}
          </button>
        )}
      </div>
    </div>
  );
}
