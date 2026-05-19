import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

// ─── Motion & Timing Tokens ───────────────────────────────────────────────────
//
// ENGINE SWAP: useAnimationControls → useMotionValue + animate()
//
// WHY THIS FIXES THE DOT LAG:
//   useAnimationControls.start() is async — setCurrentIndex is called AFTER
//   the spring resolves (~800ms). Dots always lag the full animation duration.
//
//   useMotionValue + animate() exposes the x MotionValue directly.
//   useMotionValueEvent fires synchronously INSIDE Framer's animation loop —
//   same RAF tick as the physical card position. We derive dot index from
//   the live x coordinate, so dots cross-over precisely at the 50% midpoint
//   of the spring arc. Zero async delay. Zero frame lag.
//
// INTERVAL_MS = 3300ms = ~800ms spring settle + 2500ms read-hold
// ─────────────────────────────────────────────────────────────────────────────
const GAP = 24;
const INTERVAL_MS = 3300;

// Auto-advance: high-inertia, premium settle (~800ms at 60fps)
const SLIDE_SPRING = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1,
};

// Manual buttons: tighter spring → snappier feedback
const SNAP_SPRING = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  mass: 0.8,
};


// ─── Inline Card ──────────────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
}

function CarouselCard({ review }) {
  return (
    <div
      className="w-[300px] sm:w-[360px] flex-shrink-0 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-none whitespace-normal select-none"
      style={{
        height: '220px',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        filter: 'blur(0px)',
        contain: 'paint layout',
      }}
    >
      <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-3 mb-4">
        &ldquo;{review.review}&rdquo;
      </p>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          {review.profileImage ? (
            <img
              src={review.profileImage}
              alt={review.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm flex-shrink-0 border border-slate-200">
              {getInitials(review.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-slate-900 text-sm leading-tight truncate">{review.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={12}
              className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Testimonial Carousel ─────────────────────────────────────────────────────
// Dots removed. Navigation via arrow buttons and swipe only.
// ─────────────────────────────────────────────────────────────────────────────

export default function TestimonialCarousel({
  testimonials,
  supertag,
  title,
  description,
}) {
  // ── All hooks unconditionally at the top ──────────────────────────────────

  // x MotionValue: the single source of truth for track position.
  const x = useMotionValue(0);

  // stepRef: always-fresh card+gap width for the event handler closure.
  const stepRef = useRef(384);

  // currentIndexRef: the logical step index for interval/button logic.
  const currentIndexRef = useRef(0);

  const firstCardRef   = useRef(null);
  const intervalRef    = useRef(null);
  const pausedRef      = useRef(false);
  const isAnimatingRef = useRef(false);
  const pointerStartX  = useRef(null);

  // Derived (computed before guard — all hooks must be above any return)
  const hasData = testimonials && testimonials.length > 0;
  const N = testimonials?.length || 0;
  const items = hasData ? [...testimonials, ...testimonials] : [];


  // ── Measure step from DOM ─────────────────────────────────────────────────
  // stepRef is the single source of truth — all navigation reads it directly.
  // No React state needed; ref updates are synchronous and don't trigger renders.
  useEffect(() => {
    if (!hasData) return;
    const measure = () => {
      if (firstCardRef.current) {
        stepRef.current = firstCardRef.current.offsetWidth + GAP;
      }
    };
    const t = setTimeout(measure, 50); // delay so CSS breakpoints resolve
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [hasData]);

  // ── Core navigation ───────────────────────────────────────────────────────
  // animate(x, target, spring) returns an AnimationPlaybackControls object
  // with a .then() (Promise-like), enabling the seamless reset chain:
  //   animate forward into clone → .then() → x.set(0) [instant, no spring]
  const goToIndex = useCallback(async (nextIdx, spring = SLIDE_SPRING) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    if (nextIdx >= N) {
      await animate(x, Math.round(-nextIdx * stepRef.current), spring);
      x.set(0);
      currentIndexRef.current = 0;
    } else if (nextIdx < 0) {
      await animate(x, 0, spring);
      currentIndexRef.current = 0;
    } else {
      await animate(x, Math.round(-nextIdx * stepRef.current), spring);
      currentIndexRef.current = nextIdx;
    }

    isAnimatingRef.current = false;
  }, [x, N]);

  // ── Auto-advance interval ─────────────────────────────────────────────────
  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        goToIndex(currentIndexRef.current + 1, SLIDE_SPRING);
      }
    }, INTERVAL_MS);
  }, [goToIndex]);

  useEffect(() => {
    if (!hasData) return;
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [hasData, startInterval]);

  // ── Manual nav buttons ────────────────────────────────────────────────────
  const handleLeft = useCallback(() => {
    goToIndex(Math.max(0, currentIndexRef.current - 1), SNAP_SPRING);
    startInterval();
  }, [goToIndex, startInterval]);

  const handleRight = useCallback(() => {
    goToIndex(currentIndexRef.current + 1, SNAP_SPRING);
    startInterval();
  }, [goToIndex, startInterval]);

  // ── Pointer / touch swipe ─────────────────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    pointerStartX.current = e.clientX;
    pausedRef.current = true;
    clearInterval(intervalRef.current);
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    pausedRef.current = false;

    const SWIPE_THRESHOLD = stepRef.current / 4;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta < 0) {
        goToIndex(currentIndexRef.current + 1, SNAP_SPRING);
      } else {
        handleLeft();
        return; // handleLeft restarts the interval
      }
    }
    startInterval();
  }, [goToIndex, handleLeft, startInterval]);

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!hasData) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-auto">

      {/* Header: supertag + title + description + nav buttons ─────────────── */}
      {(supertag || title || description) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            {supertag && (
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">
                {supertag}
              </p>
            )}
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-slate-500 max-w-lg">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleLeft}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleRight}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Scroll viewport: perspective forces 3D compositing context ─────────── */}
      <div className="relative w-full overflow-hidden" style={{ perspective: '1000px' }}>

        {/* ── Track: GPU-composited layer, x MotionValue, pointer swipe ────── */}
        <motion.div
          className="flex py-2 cursor-grab active:cursor-grabbing will-change-transform"
          style={{
            x,
            gap: `${GAP}px`,
            touchAction: 'pan-y',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {items.map((item, i) => (
            <div key={i} ref={i === 0 ? firstCardRef : undefined}>
              <CarouselCard review={item} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
