import React, { useState } from 'react';
import { Star, Upload, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import { getErrorMessage } from '../../utils/errorHandler';

export default function HomeReviewForm() {
  const [reviewType, setReviewType] = useState('');
  const [form, setForm] = useState({ name: '', email: '', rating: 5, review: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ type: '', name: '', email: '', review: '' });

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
    <div className="max-w-4xl mx-auto bg-[#0D1117] rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none -z-0"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-4xl font-heading font-bold text-[#F8FAFC] mb-4">Share Your Experience</h3>
          <p className="text-[#94A3B8] max-w-lg mx-auto text-[15px]">Your feedback helps us maintain the highest standards of scientific excellence and education globally.</p>
        </div>

        {successMode ? (
          <div className="bg-[#D4AF37]/10 text-[#D4AF37] p-10 rounded-2xl text-center border border-[#D4AF37]/20 flex flex-col items-center animate-in zoom-in-95 duration-500 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <CheckCircle2 size={56} className="text-[#D4AF37] mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <h4 className="text-2xl font-bold text-white mb-3">Review Submitted</h4>
            <p className="text-[#94A3B8] max-w-md">Thank you for your feedback. It will appear on our website after a brief quality review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {errorMsg && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20 flex items-start gap-3">
                <span className="mt-0.5">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ── Type of Review ── */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Type of Review</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'service',   label: 'Service',   desc: 'Case work' },
                  { value: 'education', label: 'Education', desc: 'Training' }
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`relative flex flex-col gap-1 rounded-xl p-5 cursor-pointer transition-all duration-300 overflow-hidden ${
                      reviewType === opt.value
                        ? 'bg-[#D4AF37]/5 border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                        : fieldErrors.type
                          ? 'bg-[#05070A] border border-red-500/50 hover:border-red-500'
                          : 'bg-[#05070A] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]'
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
                    <span className={`text-[15px] font-bold z-10 transition-colors ${
                      reviewType === opt.value ? 'text-[#D4AF37]' : 'text-[#F8FAFC]'
                    }`}>{opt.label}</span>
                    <span className={`text-[13px] z-10 transition-colors ${
                      reviewType === opt.value ? 'text-[#D4AF37]/80' : 'text-[#94A3B8]'
                    }`}>{opt.desc}</span>
                  </label>
                ))}
              </div>
              {fieldErrors.type && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <span>⚠</span> {fieldErrors.type}
                </p>
              )}
            </div>

            {/* ── Name & Email ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  className={`w-full px-5 py-4 bg-[#05070A] border rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder-slate-600 shadow-inner ${
                    fieldErrors.name ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.05)]'
                  }`}
                  placeholder="Enter your name"
                />
                {fieldErrors.name && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  className={`w-full px-5 py-4 bg-[#05070A] border rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all text-white placeholder-slate-600 shadow-inner ${
                    fieldErrors.email ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.05)]'
                  }`}
                  placeholder="your@email.com"
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {fieldErrors.email}</p>
                )}
              </div>
            </div>

            {/* ── Rating ── */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Overall Rating</label>
              <div className="flex items-center gap-2 p-3 bg-[#05070A] rounded-xl border border-[rgba(255,255,255,0.05)] w-fit shadow-inner">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setForm(f => ({ ...f, rating: star }))} className="p-1.5 transition-transform hover:scale-110 focus:outline-none group">
                    <Star size={32} className={star <= form.rating ? "text-[#D4AF37] fill-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "text-slate-700 hover:text-slate-500"} />
                  </button>
                ))}
              </div>
            </div>

            {/* Photo and Review */}
            <div className="grid grid-cols-1 gap-8">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Profile Photo (Optional)</label>
                <div className="flex items-center gap-6 p-5 bg-[#05070A] border border-[rgba(255,255,255,0.05)] rounded-xl shadow-inner">
                  <div className="relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#0D1117] flex items-center justify-center text-slate-500 border border-dashed border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)] transition-colors">
                        <Upload size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-[#94A3B8] file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-[#0D1117] hover:file:bg-[#e2bc44] cursor-pointer file:transition-colors" />
                    <p className="text-[12px] text-slate-600 mt-2">Recommended: Square image, max 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider">Detailed Review</label>
                <textarea
                  rows={5}
                  value={form.review}
                  onChange={set('review')}
                  className={`w-full px-5 py-5 bg-[#05070A] border rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all resize-none text-white placeholder-slate-600 shadow-inner ${
                    fieldErrors.review ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.05)]'
                  }`}
                  placeholder="Describe your experience with our team..."
                />
                {fieldErrors.review && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1"><span>⚠</span> {fieldErrors.review}</p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" disabled={submitting} className="w-full sm:w-auto px-12 py-4 bg-[#D4AF37] text-[#0D1117] rounded-xl font-bold text-[16px] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                {submitting ? 'Submitting...' : 'Submit Your Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
