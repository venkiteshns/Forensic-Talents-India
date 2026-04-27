import { useState, useEffect } from 'react';
import { Star, Upload, CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import ReviewCard from '../ui/ReviewCard';
import api from '../../utils/api';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [form, setForm] = useState({ name: '', email: '', rating: 5, review: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
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
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMode(true);
      setForm({ name: '', email: '', rating: 5, review: '' });
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
    <section className="py-16 bg-white relative z-10 border-t border-slate-100">
      <Container>
        
        {/* Existing Reviews */}
        <div className="mb-20">
          <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">Student Testimonials</h2>
          
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-pulse w-8 h-8 bg-slate-300 rounded-full"></div></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </div>
          )}
        </div>

        {/* Submission Form */}
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-3">Share Your Experience</h3>
            <p className="text-slate-600">Your feedback helps us improve and guides future students on their forensic journey.</p>
          </div>

          {successMode ? (
            <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center border border-green-100 flex flex-col items-center animate-in zoom-in-95 duration-500">
              <CheckCircle2 size={48} className="text-green-500 mb-4" />
              <h4 className="text-xl font-bold mb-2">Thank You!</h4>
              <p className="text-green-700">Your review has been submitted and is pending approval by our team.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 mb-4">
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <input type="text" required value={form.name} onChange={set('name')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <input type="email" required value={form.email} onChange={set('email')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo (Optional)</label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <Upload size={20} />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Rating *</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setForm(f => ({ ...f, rating: star }))} className="p-1 transition-transform hover:scale-110 focus:outline-none">
                        <Star size={28} className={star <= form.rating ? "text-accent fill-accent" : "text-slate-300"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review *</label>
                <textarea required rows={4} value={form.review} onChange={set('review')} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y" placeholder="Tell us about your experience with our programs..."></textarea>
              </div>

              <div className="text-center pt-2">
                <button type="submit" disabled={submitting} className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>

      </Container>
    </section>
  );
}
