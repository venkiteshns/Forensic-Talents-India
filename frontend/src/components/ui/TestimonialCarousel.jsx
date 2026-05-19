import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard';

// ─── Per-Card Viewport Observer Variants ────────────────────────────────────
// Each card owns its own IntersectionObserver via whileInView.
// margin: "0px 0px -40px 0px" → card must be 40px inside the bottom
//   viewport edge before its spring fires. Prevents any below-fold pre-animation.
// Spring physics: stiffness 120 / damping 22 → crisp, premium deceleration.
// ─────────────────────────────────────────────────────────────────────────────

export default function TestimonialCarousel({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto items-stretch">
      {testimonials.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ type: 'spring', stiffness: 120, damping: 22, delay: (i % 3) * 0.08 }}
          className="h-full"
        >
          <ReviewCard review={item} />
        </motion.div>
      ))}
    </div>
  );
}
