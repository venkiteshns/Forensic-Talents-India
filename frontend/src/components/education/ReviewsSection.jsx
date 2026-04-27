import { useState, useEffect } from 'react';
import { Star, Upload, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import ReviewCard from '../ui/ReviewCard';
import api from '../../utils/api';

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
  const [visibleService, setVisibleService] = useState(3);
  const [visibleEducation, setVisibleEducation] = useState(3);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [form, setForm] = useState({ name: '', email: '', rating: 5, review: '', type: type || 'service' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('rating', form.rating);
      formData.append('review', form.review);
      formData.append('type', form.type);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMode(true);
      setForm({ name: '', email: '', rating: 5, review: '', type: type || 'service' });
      setPhotoFile(null);
      setPhotoPreview('');
      
      setTimeout(() => {
        setSuccessMode(false);
      }, 5000);
      
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <Container>
        
        {/* Client Testimonials (Service) */}
        {(!type || type === 'service') && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Client Testimonials</h2>
              <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Feedback from our forensic investigation and legal consultancy clients.</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : serviceReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 italic">No client reviews yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                  {serviceReviews.slice(0, visibleService).map((r) => (
                    <ReviewCard key={r._id} review={r} />
                  ))}
                </div>
                
                {visibleService < serviceReviews.length && (
                  <div className="text-center">
                    <button 
                      onClick={() => setVisibleService(prev => prev + 6)}
                      className="inline-flex items-center gap-2 px-6 py-2 border-2 border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-100 hover:border-slate-300 transition-all"
                    >
                      View More Reviews
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Student Testimonials (Education) */}
        {(!type || type === 'education') && (
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Student Testimonials</h2>
              <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
              <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Hear from participants of our professional forensic training and internship programs.</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : educationReviews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 italic">No student reviews yet.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                  {educationReviews.slice(0, visibleEducation).map((r) => (
                    <ReviewCard key={r._id} review={r} />
                  ))}
                </div>

                {visibleEducation < educationReviews.length && (
                  <div className="text-center">
                    <button 
                      onClick={() => setVisibleEducation(prev => prev + 6)}
                      className="inline-flex items-center gap-2 px-6 py-2 border-2 border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-100 hover:border-slate-300 transition-all"
                    >
                      View More Testimonials
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Submission Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-0"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-3">Share Your Experience</h3>
              <p className="text-slate-600 max-w-lg mx-auto">Your feedback helps us maintain the highest standards of scientific excellence and education.</p>
            </div>

            {successMode ? (
              <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-100 flex flex-col items-center animate-in zoom-in-95 duration-500">
                <CheckCircle2 size={48} className="text-green-500 mb-4" />
                <h4 className="text-xl font-bold mb-2">Review Submitted!</h4>
                <p className="text-green-700">Thank you for your feedback. It will appear on our website after a brief quality review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Full Name *</label>
                    <input type="text" required value={form.name} onChange={set('name')} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email Address *</label>
                    <input type="email" required value={form.email} onChange={set('email')} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" placeholder="your@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Review Type Selector - Only show if type is not fixed */}
                  {!type && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Type of Review *</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'service', label: 'Service', desc: 'Case work' },
                          { value: 'education', label: 'Education', desc: 'Training' }
                        ].map(opt => (
                          <label key={opt.value} className={`flex flex-col gap-0.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            form.type === opt.value
                              ? 'border-accent bg-accent/5 text-primary'
                              : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-600'
                          }`}>
                            <input
                              type="radio" name="reviewTypeGlobal" value={opt.value}
                              checked={form.type === opt.value}
                              onChange={() => setForm(f => ({ ...f, type: opt.value }))}
                              className="sr-only"
                            />
                            <span className="text-sm font-bold">{opt.label}</span>
                            <span className="text-xs opacity-60">{opt.desc}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  <div className={type ? "lg:col-span-2" : ""}>
                    <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Overall Rating *</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button type="button" key={star} onClick={() => setForm(f => ({ ...f, rating: star }))} className="p-1.5 transition-transform hover:scale-125 focus:outline-none group">
                          <Star size={32} className={star <= form.rating ? "text-accent fill-accent" : "text-slate-300 group-hover:text-slate-400"} />
                        </button>
                      ))}
                    </div>
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
                    <textarea required rows={5} value={form.review} onChange={set('review')} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none" placeholder="Describe your experience with our team..."></textarea>
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
        </div>

      </Container>
    </section>

  );
}
