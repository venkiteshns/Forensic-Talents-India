import { useState, useEffect } from 'react';
import { Star, Upload, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import ReviewCard from '../ui/ReviewCard';
import TestimonialCarousel from '../ui/TestimonialCarousel';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';
import { motion } from 'framer-motion';
import { containerVariants, textVariants, cardVariants } from '../../animations';

// Helper: get initials from name (e.g. "John Ken" → "JK", "John" → "J")
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
}

export default function ReviewsSection({ type }) {
  const [serviceReviews, setServiceReviews] = useState([]);
  const [educationReviews, setEducationReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [reviewType, setReviewType] = useState('');
  const [form, setForm] = useState({ name: '', email: '', rating: 5, review: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ type: '', name: '', email: '', review: '' });

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Photo size must be less than 5MB.");
        setPhotoFile(null);
        setPhotoPreview('');
        e.target.value = '';
      } else {
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setErrorMsg('');
      }
    }
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: '' }));
  };

  const validate = () => {
    const errs = { type: '', name: '', email: '', review: '' };
    let valid = true;
    if (!reviewType) {
      errs.type = 'Please select a type — Service (Case work) or Education (Training).';
      valid = false;
    }
    if (!form.name.trim()) {
      errs.name = 'Full name is required.';
      valid = false;
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
      valid = false;
    }
    if (!form.email.trim()) {
      errs.email = 'Email address is required.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.';
      valid = false;
    }
    if (!form.review.trim()) {
      errs.review = 'Please write your review before submitting.';
      valid = false;
    } else if (form.review.trim().length < 10) {
      errs.review = 'Review must be at least 10 characters.';
      valid = false;
    }
    setFieldErrors(errs);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('rating', form.rating);
      formData.append('review', form.review);
      formData.append('type', reviewType);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMode(true);
      setForm({ name: '', email: '', rating: 5, review: '' });
      setReviewType('');
      setFieldErrors({ type: '', name: '', email: '', review: '' });
      setPhotoFile(null);
      setPhotoPreview('');
      
      setTimeout(() => {
        setSuccessMode(false);
      }, 5000);
      
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full h-auto bg-white py-16 md:py-24 px-4 border-t border-slate-100 relative">
      <Container>
        
        {/* Client Testimonials (Service) */}
        {(!type || type === 'service') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="mb-14"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />)}
              </div>
            ) : serviceReviews.length === 0 ? (
              <>
                <div className="mb-8">
                  <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">CLIENT VOICES</p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">Client Testimonials</h2>
                  <p className="text-sm text-slate-500">Feedback from our forensic investigation and legal consultancy clients.</p>
                </div>
                <div className="w-full max-w-md mx-auto py-6 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">
                  No reviews currently registered.
                </div>
              </>
            ) : (
              <TestimonialCarousel
                testimonials={serviceReviews}
                supertag="CLIENT VOICES"
                title="Client Testimonials"
                description="Feedback from our forensic investigation and legal consultancy clients."
              />
            )}
          </motion.div>
        )}

        {/* Student Testimonials (Education) */}
        {(!type || type === 'education') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="mb-14"
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />)}
              </div>
            ) : educationReviews.length === 0 ? (
              <>
                <div className="mb-8">
                  <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">STUDENT VOICES</p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">Student Testimonials</h2>
                  <p className="text-sm text-slate-500">Hear from participants of our professional forensic training and internship programs.</p>
                </div>
                <div className="w-full max-w-md mx-auto py-6 border border-dashed border-slate-200 rounded-xl text-center text-sm text-slate-400">
                  No reviews currently registered.
                </div>
              </>
            ) : (
              <TestimonialCarousel
                testimonials={educationReviews}
                supertag="STUDENT VOICES"
                title="Student Testimonials"
                description="Hear from participants of our professional forensic training and internship programs."
              />
            )}
          </motion.div>
        )}

        {/* Submission Form */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants} className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-0"></div>
          
          <div className="relative z-10">
            <motion.div variants={textVariants} className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-3">Share Your Experience</h3>
              <p className="text-slate-600 max-w-lg mx-auto">Your feedback helps us maintain the highest standards of scientific excellence and education.</p>
            </motion.div>

            {successMode ? (
              <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-100 flex flex-col items-center animate-in zoom-in-95 duration-500">
                <CheckCircle2 size={48} className="text-green-500 mb-4" />
                <h4 className="text-xl font-bold mb-2">Review Submitted!</h4>
                <p className="text-green-700">Thank you for your feedback. It will appear on our website after a brief quality review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ── Type of Review ── Always visible ── */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Type of Review *</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'service',   label: 'Service',   desc: 'Case work' },
                      { value: 'education', label: 'Education', desc: 'Training' }
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`flex flex-col gap-1 rounded-lg border p-4 cursor-pointer transition-all ${
                          reviewType === opt.value
                            ? 'border-yellow-500 bg-yellow-50 shadow-sm'
                            : fieldErrors.type
                              ? 'bg-white border-red-300 hover:border-red-400'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="reviewType"
                          value={opt.value}
                          checked={reviewType === opt.value}
                          onChange={() => {
                            setReviewType(opt.value);
                            setFieldErrors(fe => ({ ...fe, type: '' }));
                          }}
                          className="sr-only"
                        />
                        <span className={`text-sm font-bold ${
                          reviewType === opt.value ? 'text-yellow-700' : 'text-slate-700'
                        }`}>{opt.label}</span>
                        <span className={`text-xs ${
                          reviewType === opt.value ? 'text-yellow-600' : 'text-slate-400'
                        }`}>{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.type && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span> {fieldErrors.type}
                    </p>
                  )}
                </div>

                {/* ── Name & Email ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      className={`w-full px-5 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
                        fieldErrors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="Enter your name"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><span>⚠</span> {fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      className={`w-full px-5 py-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
                        fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="your@email.com"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><span>⚠</span> {fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* ── Rating ── */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Overall Rating *</label>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setForm(f => ({ ...f, rating: star }))} className="p-1.5 transition-transform hover:scale-125 focus:outline-none group">
                        <Star size={32} className={star <= form.rating ? "text-accent fill-accent" : "text-slate-300 group-hover:text-slate-400"} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo and Review */}
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Profile Photo (Optional)</label>
                    <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="relative">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                            <Upload size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer" />
                        <p className="text-[11px] text-slate-400 mt-2">Recommended: Square image, max 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Detailed Review *</label>
                    <textarea
                      rows={5}
                      value={form.review}
                      onChange={set('review')}
                      className={`w-full px-5 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none ${
                        fieldErrors.review ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="Describe your experience with our team..."
                    />
                    {fieldErrors.review && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><span>⚠</span> {fieldErrors.review}</p>
                    )}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button type="submit" disabled={submitting} className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-2xl font-bold text-base sm:text-lg sm:px-12 sm:py-4 shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                    {submitting ? 'Submitting...' : 'Submit Your Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

      </Container>
    </section>

  );
}
