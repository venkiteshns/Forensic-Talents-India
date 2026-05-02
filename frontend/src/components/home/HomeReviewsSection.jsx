import { useState, useEffect } from 'react';
import { Container } from '../ui/Container';
import TestimonialCarousel from '../ui/TestimonialCarousel';
import HomeReviewCard from './HomeReviewCard';
import HomeReviewForm from './HomeReviewForm';
import api from '../../utils/api';

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
        api.get('/reviews?type=education')
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
    <section className="py-32 relative overflow-hidden bg-transparent">
      <Container>
        {/* Client Testimonials (Service) */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#F8FAFC] mb-6">
              Client <span className="text-[#D4AF37]">Testimonials.</span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg font-light">Feedback from our forensic investigation and legal consultancy clients.</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 border border-white/5 animate-pulse rounded-2xl"></div>)}
            </div>
          ) : serviceReviews.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
              <p className="text-slate-400 italic">No client reviews yet.</p>
            </div>
          ) : (
            <TestimonialCarousel testimonials={serviceReviews} speed={28} CardComponent={HomeReviewCard} />
          )}
        </div>

        {/* Student Testimonials (Education) */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#F8FAFC] mb-6">
              Student <span className="text-[#D4AF37]">Testimonials.</span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg font-light">Hear from participants of our professional forensic training and internship programs.</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 border border-white/5 animate-pulse rounded-2xl"></div>)}
            </div>
          ) : educationReviews.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
              <p className="text-slate-400 italic">No student reviews yet.</p>
            </div>
          ) : (
            <TestimonialCarousel testimonials={educationReviews} speed={32} CardComponent={HomeReviewCard} />
          )}
        </div>

        {/* Submission Form */}
        <HomeReviewForm />

      </Container>
    </section>
  );
}
