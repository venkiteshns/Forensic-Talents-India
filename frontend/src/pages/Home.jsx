import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Search, FileText, Fingerprint, Monitor, CheckCircle, GraduationCap, Scale, BrainCircuit, Users, Award, Activity, Bell, Leaf, Landmark, Star, MessageSquare, Send } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import ReviewCard from '../components/ui/ReviewCard';
import api from '../utils/api';

export default function Home() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, review: '' });
  const [reviewStatus, setReviewStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get('/quiz/latest');
        if (res.data && res.data.isVisible) {
          setActiveQuiz(res.data);
        }
      } catch (err) {
        console.error("Error fetching quiz", err);
      }
    };
    
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };

    fetchQuiz();
    fetchReviews();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewStatus({ type: 'loading', message: 'Submitting...' });
    try {
      await api.post('/reviews', reviewForm);
      setReviewStatus({ type: 'success', message: 'Review submitted successfully! It will appear after approval.' });
      setReviewForm({ name: '', email: '', rating: 5, review: '' });
    } catch (err) {
      setReviewStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit review' });
    }
  };
  const services = [
    { id: 'pcc', title: 'Police Clearance', desc: 'Secure PCC for visa & employment securely.', icon: <Shield size={24} /> },
    { id: 'questioned-documents', title: 'Questioned Documents', desc: 'Verify authenticity and detect forgery scientifically.', icon: <FileText size={24} /> },
    { id: 'fingerprint', title: 'Fingerprint Investigation', desc: 'Accurate identification with unique ridge patterns.', icon: <Fingerprint size={24} /> },
    { id: 'cyber', title: 'Cyber Forensics', desc: 'Digital evidence recovery and data analysis.', icon: <Monitor size={24} /> },
    { id: 'crime-scene', title: 'Crime Scene Investigation', desc: 'Systematic analysis and evidence collection.', icon: <Search size={24} /> },
    { id: 'cross-examination', title: 'Cross Examination', desc: 'Critical evaluation of forensic evidence in courts.', icon: <Scale size={24} /> },
    { id: 'polygraph', title: 'Polygraph Examination', desc: 'Accurately assess truthfulness with advanced physiological monitoring.', icon: <Activity size={24} /> },
    { id: 'workplace-assessments', title: 'Workplace Assessments', desc: 'Scientific evaluation of workforce behavior, psychological risks, and performance using forensic methodologies.', icon: <Users size={24} /> },
    { id: 'forensic-training', title: 'Professional Forensic Training', desc: 'Advanced, research-based forensic training programs designed for legal, corporate, and investigative professionals.', icon: <GraduationCap size={24} /> },
    { id: 'environmental', title: 'Environmental Forensics', desc: 'Identifying pollution sources and environmental damages through advanced scientific analysis and site assessment.', icon: <Leaf size={24} /> },
    { id: 'financial', title: 'Financial Forensic Investigations', desc: 'Detecting, analyzing, and preventing financial fraud and irregularities to maintain financial integrity.', icon: <Landmark size={24} /> },
  ];

  const stats = [
    { num: '450+', label: 'Forensic Cases Handled' },
    { num: '50+', label: 'Theft Cases Solved' },
    { num: '500+', label: 'Professionals Trained' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="fade-in">
            <img src="/assets/logo.png" alt="Forensic Talents" className="h-28 md:h-36 mb-8 mx-auto object-contain bg-white rounded-lg p-2" />
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Scientific Truth. <span className="text-accent">Legal Strength.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Delivering scientifically precise, ethically grounded, and legally admissible forensic solutions to strengthen the justice delivery system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" className="group">
                <Link to="/contact" className="flex items-center gap-2">
                  Book Consultation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Dynamic Quiz Banner */}
      {activeQuiz && (
        <div className="bg-accent text-primary py-3 px-4 shadow-md relative z-20">
          <Container className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 font-semibold text-center md:text-left">
              <div className="flex shrink-0 items-center justify-center w-9 h-9 rounded-full bg-black/10 hover:scale-110 transition-transform animate-pulse">
                <Bell className="h-5 w-5 md:h-6 md:w-6 text-slate-900" />
              </div>
              <span>New Quiz Available: {activeQuiz.title} – Participate Now</span>
            </div>
            <Link to="/education/quiz" className="bg-primary text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-[#1E293B] transition-colors whitespace-nowrap mt-1 md:mt-0">
              Take Quiz
            </Link>
          </Container>
        </div>
      )}

      {/* About Preview */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">About Forensic Talents India</h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              We operate at the intersection of science, law, and technology. Our deeply qualified experts provide multidisciplinary forensic solutions ranging from questioned documents to cyber forensics. Reports and expert opinions provided are valid under Section 39 of the Bharatiya Sakshya Adhiniyam, 2023 (Section 45 of the Indian Evidence Act), highly respected across Indian and International courts.
            </p>
            <Button variant="ghost">
              <Link to="/about" className="flex items-center gap-2 font-semibold">
                Read Our Story <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-secondary-light">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Expertise</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive forensic interventions tailored to support investigative processes and judicial outcomes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <Link to={`/services/${srv.id}`} key={srv.id} className="group block">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="w-14 h-14 bg-primary/5 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    {srv.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{srv.title}</h3>
                  <p className="text-slate-600 mb-6">{srv.desc}</p>
                  <span className="text-accent font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Education Preview */}
      <section className="py-20 bg-white">
        <Container>
          <div className="mb-12 relative flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 mb-2">Education</h2>
              <div className="h-1 w-20 bg-accent rounded-full relative">
                <div className="absolute top-1/2 left-6 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>

            <Link to="/education" className="hidden md:flex items-center text-accent font-semibold hover:text-accent-light transition-colors group">
              Show more <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link to="education/quiz" className="bg-slate-50 hover:bg-white py-6 px-4 md:p-8 border border-transparent border-l-4 border-l-accent hover:border-slate-100 rounded-lg flex flex-col items-center justify-center text-center aspect-auto md:aspect-square transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
              <BrainCircuit className="w-8 h-8 md:w-12 md:h-12 text-accent mb-2 md:mb-4 group-hover:-translate-y-2 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-sm md:text-lg font-bold text-slate-700 leading-tight">Quiz</h3>
            </Link>
            <Link to="/education/internships" className="bg-slate-50 hover:bg-white py-6 px-4 md:p-8 border border-transparent border-l-4 border-l-accent hover:border-slate-100 rounded-lg flex flex-col items-center justify-center text-center aspect-auto md:aspect-square transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
              <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-accent mb-2 md:mb-4 group-hover:-translate-y-2 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-sm md:text-lg font-bold text-slate-700 leading-tight">Internship</h3>
            </Link>

            <Link to="education/certificates" className="bg-slate-50 hover:bg-white py-6 px-4 md:p-8 border border-transparent border-l-4 border-l-accent hover:border-slate-100 rounded-lg flex flex-col items-center justify-center text-center aspect-auto md:aspect-square transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
              <Award className="w-8 h-8 md:w-12 md:h-12 text-accent mb-2 md:mb-4 group-hover:-translate-y-2 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-sm md:text-lg font-bold text-slate-700 leading-tight">Certificate Courses</h3>
            </Link>

            <Link to="/education/blogs" className="bg-slate-50 hover:bg-white py-6 px-4 md:p-8 border border-transparent border-l-4 border-l-accent hover:border-slate-100 rounded-lg flex flex-col items-center justify-center text-center aspect-auto md:aspect-square transition-all duration-300 group hover:shadow-xl relative overflow-hidden">
              <FileText className="w-8 h-8 md:w-12 md:h-12 text-accent mb-2 md:mb-4 group-hover:-translate-y-2 transition-transform duration-300" strokeWidth={1.5} />
              <h3 className="text-sm md:text-lg font-bold text-slate-700 leading-tight">Blogs</h3>
            </Link>
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/education" className="inline-flex items-center text-accent font-semibold hover:text-accent-light transition-colors group">
              Show more <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-primary text-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            {stats.map((stat, idx) => (
              <div key={idx} className="pt-6 md:pt-0">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.num}</div>
                <div className="text-slate-300 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Reviews & Testimonials Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Client Testimonials</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Hear what our clients and partners have to say about our forensic services and training programs.</p>
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Your Name</label>
                  <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Email <span className="text-slate-400 font-normal lowercase">(kept private)</span></label>
                  <input required type="email" value={reviewForm.email} onChange={e => setReviewForm({...reviewForm, email: e.target.value})} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm({...reviewForm, rating: star})} className="focus:outline-none transition-transform hover:scale-110">
                        <Star size={24} className={star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Your Review</label>
                  <textarea required rows={4} value={reviewForm.review} onChange={e => setReviewForm({...reviewForm, review: e.target.value})} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none" placeholder="Tell us about your experience..." />
                </div>
                <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2" disabled={reviewStatus.type === 'loading'}>
                  <Send size={16} /> Submit Feedback
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
              Get Expert Forensic Support Today
            </h2>
            <p className="text-slate-600 mb-10 text-lg">
              Whether you need document verification, crime scene analysis, or expert cross-examination support, we are here to provide definitive scientific truth.
            </p>
            <Button variant="primary" size="lg">
              <Link to="/contact">Request a Callback</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
