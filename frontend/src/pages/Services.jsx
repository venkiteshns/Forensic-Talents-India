import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowRight, Shield, Search, FileText, Fingerprint, Monitor, Scale, Activity, Users, GraduationCap, Leaf, Landmark, Star, MessageSquare, Send, Upload, Camera } from 'lucide-react';
import { Button } from '../components/ui/Button';
import ReviewCard from '../components/ui/ReviewCard';
import api from '../utils/api';

// Helper: get initials from name (e.g. "John Ken" → "JK", "John" → "J")
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
}

export default function Services() {
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, review: '', type: 'service' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [reviewStatus, setReviewStatus] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews?type=service');
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewStatus({ type: 'loading', message: 'Submitting...' });
    try {
      const formData = new FormData();
      formData.append('name', reviewForm.name);
      formData.append('email', reviewForm.email);
      formData.append('rating', reviewForm.rating);
      formData.append('review', reviewForm.review);
      formData.append('type', reviewForm.type);
      if (photoFile) formData.append('photo', photoFile);

      await api.post('/reviews', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setReviewStatus({ type: 'success', message: 'Review submitted! It will appear after approval.' });
      setReviewForm({ name: '', email: '', rating: 5, review: '', type: 'service' });
      setPhotoFile(null);
      setPhotoPreview('');
    } catch (err) {
      setReviewStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit review' });
    }
  };

  const servicesList = [
    {
      id: 'pcc',
      title: 'Police Clearance Certificate',
      desc: 'Expert assistance in securing a Police Clearance Certificate securely, ensuring error-free fingerprints and accurate applications.',
      icon: <Shield size={32} />
    },
    {
      id: 'questioned-documents',
      title: 'Questioned Documents Examination',
      desc: 'Determine authenticity, trace authorship, and detect alterations or forgeries using advanced scientific tools.',
      icon: <FileText size={32} />
    },
    {
      id: 'fingerprint',
      title: 'Fingerprint Investigation',
      desc: 'Reliable forensic identification based on unique ridge patterns, including latent fingerprint development and enhancement.',
      icon: <Fingerprint size={32} />
    },
    {
      id: 'cyber',
      title: 'Cyber Forensics',
      desc: 'Recovery, preservation, and analysis of digital evidence. Tackle data breaches, cyber fraud, and trace digital activities.',
      icon: <Monitor size={32} />
    },
    {
      id: 'crime-scene',
      title: 'Crime Scene Investigation',
      desc: 'Systematic examination, documentation, and scientific analysis of crime scenes to collect critical physical evidence.',
      icon: <Search size={32} />
    },
    {
      id: 'cross-examination',
      title: 'Forensic Cross Examination',
      desc: 'Critical evaluation and questioning of opposing forensic evidence and expert reports for courtroom accuracy.',
      icon: <Scale size={32} />
    },
    {
      id: 'polygraph',
      title: 'Polygraph Examination',
      desc: 'Accurately assess truthfulness with advanced physiological monitoring and expert analysis for critical investigations.',
      icon: <Activity size={32} />
    },
    {
      id: 'workplace-assessments',
      title: 'Workplace Assessments',
      desc: 'Scientific evaluation of workforce behavior, psychological risks, and performance using forensic methodologies for organizational decision-making.',
      icon: <Users size={32} />
    },
    {
      id: 'forensic-training',
      title: 'Professional Forensic Training & Capacity Building',
      desc: 'Advanced, research-based forensic training programs designed for legal, corporate, and investigative professionals.',
      icon: <GraduationCap size={32} />
    },
    {
      id: 'environmental',
      title: 'Environmental Forensics',
      desc: 'Identifying pollution sources and environmental damages through advanced scientific analysis and site assessment.',
      icon: <Leaf size={32} />
    },
    {
      id: 'financial',
      title: 'Financial Forensic Investigations',
      desc: 'Detecting, analyzing, and preventing financial fraud and irregularities to maintain financial integrity.',
      icon: <Landmark size={32} />
    },
  ];

  return (
    <div className="bg-secondary-light min-h-[calc(100vh-88px)]">
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/services_banner.png" alt="Forensic Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Our Forensic Services</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            We provide specialized, legally sound scientific assistance across fundamentally critical domains. Explore our comprehensive portfolio below to view detailed breakdowns of our methodologies and forensic analysis processes.
          </p>
        </Container>
      </section>

      <Container className="pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv) => (
            <div key={srv.id} className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-primary overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 ease-out group">
              <div className="p-8 flex-grow">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                  {srv.icon}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{srv.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">{srv.desc}</p>
              </div>
              <div className="px-8 pb-8 mt-auto">
                <Button variant="secondary" className="w-full justify-between group">
                  <Link to={`/services/${srv.id}`} className="flex justify-between w-full items-center">
                    View Details
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Reviews & Testimonials Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Client Testimonials</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Hear what our clients and partners have to say about our forensic services.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Reviews Carousel/Grid */}
            <div className="lg:col-span-2">
              {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm h-full flex flex-col justify-center items-center">
                  <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
                  <p className="text-slate-500">No testimonials available yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {reviews.slice(0, 4).map(review => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-bold text-primary mb-2">Share Your Experience</h3>
              <p className="text-sm text-slate-500 mb-6">Your feedback helps us improve and maintain our high standards of service.</p>

              {reviewStatus.message && (
                <div className={`p-3 rounded-lg text-sm mb-6 ${reviewStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : reviewStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                  {reviewStatus.message}
                </div>
              )}

              <form onSubmit={submitReview} className="space-y-4">
                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Profile Photo <span className="font-normal text-slate-400 lowercase">(optional)</span></label>
                  <div className="flex items-center gap-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="relative w-14 h-14 rounded-full shrink-0 overflow-hidden border-2 border-dashed border-slate-300 hover:border-accent transition-colors group">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary/10 transition-colors">
                          {reviewForm.name ? getInitials(reviewForm.name) : <Camera size={18} className="text-slate-400" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload size={14} className="text-white" />
                      </div>
                    </button>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Click circle to upload</p>
                      <p className="text-[11px] text-slate-400">JPG, PNG or WebP</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Your Name</label>
                  <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Email <span className="text-slate-400 font-normal lowercase">(private)</span></label>
                  <input required type="email" value={reviewForm.email} onChange={e => setReviewForm({ ...reviewForm, email: e.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" placeholder="john@example.com" />
                </div>

                {/* Review Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Review Type <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'service', label: 'Service', desc: 'Forensic services' },
                      { value: 'education', label: 'Education', desc: 'Training & courses' }
                    ].map(opt => (
                      <label key={opt.value} className={`flex flex-col gap-0.5 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        reviewForm.type === opt.value
                          ? 'border-accent bg-accent/5 text-primary'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}>
                        <input
                          type="radio" name="reviewType" value={opt.value}
                          checked={reviewForm.type === opt.value}
                          onChange={() => setReviewForm({ ...reviewForm, type: opt.value })}
                          className="sr-only"
                        />
                        <span className="text-sm font-semibold">{opt.label}</span>
                        <span className="text-[11px] opacity-70">{opt.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="focus:outline-none transition-transform hover:scale-110">
                        <Star size={24} className={star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Your Review</label>
                  <textarea required rows={3} value={reviewForm.review} onChange={e => setReviewForm({ ...reviewForm, review: e.target.value })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none" placeholder="Tell us about your experience..." />
                </div>
                <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2" disabled={reviewStatus.type === 'loading'}>
                  <Send size={16} /> {reviewStatus.type === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
