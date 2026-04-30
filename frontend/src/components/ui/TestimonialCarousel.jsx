import React, { useRef, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import './TestimonialCarousel.css';

// JS Timed Auto-Scroll Hook (Standard Auto-Scroll, no infinite loop)
const useAutoScroll = (ref, speedSeconds) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isPaused = false;
    let timer;
    const intervalMs = speedSeconds * 100; // e.g., 28 -> 2800ms

    const scrollNext = () => {
      if (!isPaused && el) {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        
        // Find the width of one card + gap
        const firstChild = el.children[0]?.children[0];
        const cardWidth = firstChild ? firstChild.offsetWidth + 16 : 300;

        // If we reached the end, rewind smoothly to the start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
      
      // Schedule next jump
      timer = setTimeout(scrollNext, intervalMs);
    };

    // Start the timed loop
    timer = setTimeout(scrollNext, intervalMs);

    const pause = () => { isPaused = true; };
    const resume = () => { 
      // Slight delay before resuming after touch
      setTimeout(() => { isPaused = false; }, 1000); 
    };

    // Native DOM listeners to avoid React state re-renders
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [ref, speedSeconds]);
};

export default function TestimonialCarousel({ testimonials, speed = 40 }) {
  const scrollRef = useRef(null);

  // Standard timed auto-scroll across all devices
  useAutoScroll(scrollRef, speed);

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0]?.children[0];
      const cardWidth = firstChild ? firstChild.offsetWidth + 16 : 300;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      const firstChild = scrollRef.current.children[0]?.children[0];
      const cardWidth = firstChild ? firstChild.offsetWidth + 16 : 300;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="testimonial-wrapper relative group">
      <button className="nav left hidden sm:flex" onClick={scrollLeftBtn} aria-label="Previous testimonial">
        &lsaquo;
      </button>

      <div 
        className="carousel-viewport" 
        ref={scrollRef}
      >
        <div className="carousel-track">
          {testimonials.map((item, i) => (
            <div className="testimonial-card" key={i}>
              <ReviewCard review={item} />
            </div>
          ))}
        </div>
      </div>

      <button className="nav right hidden sm:flex" onClick={scrollRightBtn} aria-label="Next testimonial">
        &rsaquo;
      </button>
    </div>
  );
}
