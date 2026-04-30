import { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

// Helper: get initials from name (e.g. "John Ken" → "JK", "John" → "J")
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
}

export default function ReviewCard({ review }) {
  const [isClamped, setIsClamped] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkClamp = () => {
      if (textRef.current && !expanded) {
        setIsClamped(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };
    
    // Check initially
    checkClamp();
    
    // Setup observer to check if fonts/layout change
    const observer = new ResizeObserver(checkClamp);
    if (textRef.current) observer.observe(textRef.current);
    
    window.addEventListener('resize', checkClamp);
    return () => {
      window.removeEventListener('resize', checkClamp);
      observer.disconnect();
    };
  }, [review.review, expanded]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-auto min-h-0">
      {/* Header Section */}
      <div className="flex flex-col min-[390px]:flex-row min-[390px]:items-center justify-between p-3.5 sm:p-4 bg-slate-50 border-b border-slate-100 shrink-0 gap-2 min-[390px]:gap-0">
        <div className="flex items-center gap-3">
          {review.profileImage ? (
            <img src={review.profileImage} alt={review.name} className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 border border-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold text-lg shadow-sm shrink-0 border border-slate-100">
              {getInitials(review.name)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-900 leading-tight line-clamp-1">{review.name}</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-0.5 shrink-0 max-[390px]:ml-[52px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} className={star <= review.rating ? "text-accent fill-accent" : "text-slate-200"} />
          ))}
        </div>
      </div>
      
      {/* Review Text */}
      <div className="flex-grow relative p-3.5 sm:p-5 pb-0 sm:pb-0 overflow-visible">
        <p 
          ref={textRef} 
          className={cn(
            "text-slate-700 leading-relaxed text-[13px] sm:text-[14px] whitespace-pre-line",
            expanded ? "block overflow-visible" : "line-clamp-4 overflow-hidden"
          )}
        >
          "{review.review}"
        </p>
      </div>

      {/* Read More Button Container */}
      <div className="px-3.5 sm:px-5 pt-3 pb-3.5 sm:pb-5 shrink-0 min-h-[44px]">
        {(isClamped || expanded) && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-[13px] sm:text-xs font-bold text-primary hover:text-primary-dark transition-colors border-b border-transparent hover:border-primary-dark pb-0.5"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
