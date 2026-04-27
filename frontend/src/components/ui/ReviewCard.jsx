import { useState, useRef, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function ReviewCard({ review }) {
  const [isClamped, setIsClamped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkClamp = () => {
      if (textRef.current) {
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
  }, [review.review]);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[220px] sm:h-[240px] md:h-[260px] overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            {review.photo ? (
              <img src={review.photo} alt={review.name} className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 border border-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold text-lg shadow-sm shrink-0 border border-slate-100">
                {review.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-900 leading-tight line-clamp-1">{review.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {/* Rating */}
          <div className="flex items-center gap-0.5 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={14} className={star <= review.rating ? "text-accent fill-accent" : "text-slate-200"} />
            ))}
          </div>
        </div>
        
        {/* Review Text */}
        <div className="flex-grow overflow-hidden relative p-5 pb-0 sm:p-6 sm:pb-0">
          <p 
            ref={textRef} 
            className="text-slate-700 leading-relaxed text-sm whitespace-pre-line line-clamp-3 sm:line-clamp-4 md:line-clamp-5"
          >
            "{review.review}"
          </p>
        </div>

        {/* Read More Button Container */}
        <div className="px-5 sm:px-6 pt-3 pb-5 shrink-0 min-h-[44px]">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={cn(
              "text-xs font-bold text-primary hover:text-primary-dark transition-colors border-b border-transparent hover:border-primary-dark pb-0.5",
              isClamped ? "inline-block" : "hidden"
            )}
          >
            Read More
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col relative animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 z-[60] text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors rounded-full p-2"
            >
              <X size={20} />
            </button>
            
            <div className="p-6 md:p-8 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100 shrink-0">
                {review.photo ? (
                  <img src={review.photo} alt={review.name} className="w-14 h-14 rounded-full object-cover shadow-sm shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-sm shrink-0">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{review.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={star <= review.rating ? "text-accent fill-accent" : "text-slate-200"} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[15px]">
                "{review.review}"
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
