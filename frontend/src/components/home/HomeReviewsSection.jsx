import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import TestimonialCarousel from '../ui/TestimonialCarousel';
import HomeReviewCard from './HomeReviewCard';
import HomeReviewForm from './HomeReviewForm';
import api from '../../utils/api';

// ─── Section Header Reveal Variants ────────────────────────────────────────
// amount: 0.1 → fires the moment the top edge of the header crosses into view.
// margin: "0px 0px -40px 0px" → requires 40px inside the bottom edge before
// firing, which prevents any below-fold pre-animation on tight mobile screens.
// ────────────────────────────────────────────────────────────────────────────
const sectionRevealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 22 },
  },
};

export default function HomeReviewsSection() {
  const [serviceReviews, setServiceReviews] = useState([]);
  const [educationReviews, setEducationReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [sRes, eRes] = await Promise.all([
        api.get('/reviews?type=service'),
        api.get('/reviews?type=education'),
      ]);
      setServiceReviews(sRes.data);
      setEducationReviews(eRes.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ── py-16 md:py-20 → natural fluid height, zero artificial expansion ──
    // bg-transparent inherits the page bg (white), border-t for clean edge
    <section className="w-full h-auto py-16 md:py-20 bg-transparent">
      <Container>

        {/* ── Client Testimonials ───────────────────────────────── */}
        <div className="mb-16">
          {/* Per-element header observer — fires at amount:0.1 immediately */}
          <motion.div
            variants={sectionRevealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#94A3B8] mb-2">
              CLIENT VOICES
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#F8FAFC] mb-4">
              Client <span className="text-[#D4AF37]">Testimonials.</span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto text-base font-light">
              Feedback from our forensic investigation and legal consultancy clients.
            </p>
          </motion.div>

          {loading ? (
            // ── Skeleton: tight 3-col grid, no overflow gap ──
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white/5 border border-white/5 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : serviceReviews.length === 0 ? (
            // ── Tight empty-state: collapses to minimal height ──
            <div className="w-full max-w-md mx-auto py-6 border border-dashed border-slate-200/20 rounded-xl text-center text-sm text-slate-500">
              No reviews currently registered.
            </div>
          ) : (
            // ── TestimonialCarousel: now a fluid grid (no speed/CardComponent) ──
            <TestimonialCarousel testimonials={serviceReviews} />
          )}
        </div>

        {/* ── Student Testimonials ──────────────────────────────── */}
        <div className="mb-16">
          <motion.div
            variants={sectionRevealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#94A3B8] mb-2">
              STUDENT VOICES
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#F8FAFC] mb-4">
              Student <span className="text-[#D4AF37]">Testimonials.</span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto text-base font-light">
              Hear from participants of our professional forensic training and internship programs.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-white/5 border border-white/5 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : educationReviews.length === 0 ? (
            <div className="w-full max-w-md mx-auto py-6 border border-dashed border-slate-200/20 rounded-xl text-center text-sm text-slate-500">
              No reviews currently registered.
            </div>
          ) : (
            <TestimonialCarousel testimonials={educationReviews} />
          )}
        </div>

        {/* ── Submission Form ───────────────────────────────────── */}
        <HomeReviewForm />

      </Container>
    </section>
  );
}
