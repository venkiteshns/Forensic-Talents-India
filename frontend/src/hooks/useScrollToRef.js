import { useRef } from 'react';

export const useScrollToRef = () => {
  const ref = useRef(null);

  const scroll = () => {
    if (!ref.current) return;

    const y =
      ref.current.getBoundingClientRect().top +
      window.pageYOffset - 80; // 80px offset for header

    window.scrollTo({ top: y, behavior: "smooth" });
    
    // UX Improvement: Highlight effect
    ref.current.classList.add("highlight-scroll");
    setTimeout(() => {
      if (ref.current) {
        ref.current.classList.remove("highlight-scroll");
      }
    }, 800);
  };

  return [ref, scroll];
};
