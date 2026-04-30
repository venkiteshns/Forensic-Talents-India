import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { X, Send, Copy, CreditCard, CheckCircle2, Wifi, MapPin } from 'lucide-react';
import { SuccessModal } from '../ui/SuccessModal';
import CountryPhoneInput from '../ui/CountryPhoneInput';
import SearchableCountrySelect from '../ui/SearchableCountrySelect';
import CustomSelect from '../ui/CustomSelect';
import { validatePhoneNumber } from '../../utils/phoneValidation';

// ── PART 3 & 7: internshipId + internshipMode are passed in; mode is never asked of the user ──
export function EnrollModal({ isOpen, course, onClose }) {
  // course: { category, prog: { duration }, internshipId, internshipMode }
  const internshipId   = course?.internshipId   ?? null;
  const internshipMode = course?.internshipMode  ?? null;   // 'online' | 'offline' | null

  const targetType = (() => {
    if (course?.category?.toLowerCase().includes('quiz')) return 'Quiz';
    if (course?.category?.toLowerCase().includes('internship')) return 'Internship';
    return 'Course';
  })();

  const [courseMode, setCourseMode] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', nationality: 'India',
    qualification: '', status: '', institutionName: '', organizationName: '',
    transactionId: '', additionalInfo: ''
  });
  const [paymentProof, setPaymentProof]       = useState(null);
  const [status, setStatus]                   = useState('');
  const [errors, setErrors]                   = useState({});
  const [touched, setTouched]                 = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [copiedField, setCopiedField]         = useState('');

  useEffect(() => {
    if (isOpen) {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://forensic-talents-india.onrender.com/api';
      fetch(`${BACKEND_URL}/payment-settings`)
        .then(res => res.json())
        .then(data => setPaymentSettings(data))
        .catch(err => console.error("Failed to fetch payment settings", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (course?.prog?.modes?.length === 1) {
      setCourseMode(course.prog.modes[0]);
    }
  }, [course]);

  // Default nationality to India and handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, nationality: prev.nationality || 'India' }));
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const validate = (data = formData) => {
    let newErrors = {};
    if (!data.name.trim())  newErrors.name  = "Full Name is required.";
    if (!data.email.trim()) newErrors.email = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Please enter a valid email address.";

    const phoneValidation = validatePhoneNumber(data.phone, data.nationality || 'India');
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;

    if (!data.qualification.trim()) newErrors.qualification = "Qualification is required.";
    if (!data.status)               newErrors.status        = "Current Status is required.";
    if (!data.transactionId.trim()) newErrors.transactionId = "Transaction ID is required.";
    if (!paymentProof)              newErrors.paymentProof  = "Payment proof is required.";

    // Nationality is required for Internship and Course
    if ((targetType === 'Course' || targetType === 'Internship') && !data.nationality) {
      newErrors.nationality = "Nationality is required.";
    }

    const showModeSelection = targetType === 'Course' && course?.prog?.modes?.length > 1;
    if (showModeSelection && !courseMode) {
      newErrors.courseMode = "Please select a mode of study.";
    }

    return newErrors;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, paymentProof: "File size must be less than 5MB." }));
        setPaymentProof(null);
        e.target.value = '';
      } else {
        setPaymentProof(file);
        setErrors(prev => ({ ...prev, paymentProof: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const allTouched = Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(prev => ({ ...prev, ...allTouched, paymentProof: true }));

      setTimeout(() => {
        const firstErrorField = document.querySelector(`[name="${Object.keys(newErrors)[0]}"]`);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus({ preventScroll: true });
        }
      }, 50);
      return;
    }

    setStatus('loading');

    setStatus('loading');

    // ── PART 4: Submission payload — mode is sourced from internshipMode, never from user ──
    const payload = new FormData();
    payload.append('name',          formData.name);
    payload.append('email',         formData.email);
    payload.append('phone',         formData.phone);
    if (formData.nationality) payload.append('nationality', formData.nationality);
    payload.append('qualification', formData.qualification);
    payload.append('status',        formData.status);
    if (formData.institutionName)  payload.append('institutionName',  formData.institutionName);
    if (formData.organizationName) payload.append('organizationName', formData.organizationName);
    payload.append('transactionId', formData.transactionId);
    payload.append('additionalInfo', formData.additionalInfo);
    payload.append('targetType',    targetType);
    payload.append('targetName',    `${course?.category || 'Program'} - ${course?.prog?.duration || ''}`.trim());
    
    if (internshipId)   payload.append('internshipId', internshipId);
    if (internshipMode) payload.append('mode', internshipMode);   // backend will override from DB anyway
    
    if (targetType === 'Course') {
      const finalMode = courseMode || course?.prog?.modes?.[0];
      if (finalMode) payload.append('mode', finalMode);
      if (course?.prog?.priceINR) payload.append('priceINR', course.prog.priceINR);
      const isOnline = finalMode?.toLowerCase() === 'online';
      if (isOnline && course?.prog?.priceUSD) payload.append('priceUSD', course.prog.priceUSD);
    }

    if (targetType === 'Internship') {
      if (course?.priceINR) payload.append('priceINR', course.priceINR);
      if (internshipMode === 'online' && course?.priceUSD) payload.append('priceUSD', course.priceUSD);
    }
    
    payload.append('paymentProof', paymentProof);

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://forensic-talents-india.onrender.com/api';
      const response = await fetch(`${BACKEND_URL}/enroll`, { method: "POST", body: payload });
      if (response.ok) {
        setStatus('');
        setFormData({
          name: '', email: '', phone: '', nationality: 'India',
          qualification: '', status: '', institutionName: '', organizationName: '',
          transactionId: '', additionalInfo: ''
        });
        setCourseMode('');
        setPaymentProof(null);
        setErrors({});
        setTouched({});
        onClose();
        setShowSuccessModal(true);
      } else {
        const errData = await response.json();
        console.error(errData);
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  // ── PART 7: Read-only mode badge ─────────────────────────────────────────
  const ModeBadge = () => {
    if (!internshipMode) return null;
    const isOnline = internshipMode === 'online';
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${
        isOnline
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}>
        {isOnline ? <Wifi size={12} /> : <MapPin size={12} />}
        Internship Type: {isOnline ? 'Online' : 'Offline'}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-primary">Enrollment Request</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {course?.category} - {course?.prog?.duration}
                </p>
                {/* ── PART 7: Read-only internship type badge ── */}
                {internshipMode && (
                  <div className="mt-2">
                    <ModeBadge />
                  </div>
                )}
              </div>
              <button onClick={() => { onClose(); setStatus(''); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
              <form noValidate onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                    Connection error. Please try submitting again.
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-2">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.name && errors.name ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="e.g. Rahul Sharma" />
                      {touched.name && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.email && errors.email ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="rahul@example.com" />
                      {touched.email && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-4">
                    <CountryPhoneInput
                      name="phone"
                      value={formData.phone}
                      countryName={formData.nationality || 'India'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.phone}
                      touched={touched.phone}
                      label="Contact Number"
                      required={true}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-2">Academic / Professional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Qualification <span className="text-red-500">*</span></label>
                      <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.qualification && errors.qualification ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="e.g. B.Sc Forensic Science" />
                      {touched.qualification && errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                      <CustomSelect
                        label="Current Status"
                        value={formData.status}
                        onChange={(val) => {
                          setFormData(prev => ({ ...prev, status: val }));
                          if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                        }}
                        options={['Student', 'Professional']}
                        placeholder="Select Status"
                        error={errors.status}
                        touched={touched.status}
                        required={true}
                      />
                    </div>
                  </div>

                  {formData.status === 'Student' && (
                    <div className="flex flex-col gap-1 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Institution Name (Optional)</label>
                      <input type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-accent focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" placeholder="Your University/College" />
                    </div>
                  )}

                  {formData.status === 'Professional' && (
                    <div className="flex flex-col gap-1 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Organization Name (Optional)</label>
                      <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-accent focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" placeholder="Your Company/Organization" />
                    </div>
                  )}
                </div>

                {/* ── Nationality is required for Internship and Course ─────────────────── */}
                {(targetType === 'Course' || targetType === 'Internship') && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-2">Location Details</h4>
                    <div className="flex flex-col gap-1 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <SearchableCountrySelect
                        label="Nationality"
                        value={formData.nationality}
                        onChange={(name) => {
                          setFormData(prev => ({ ...prev, nationality: name }));
                          if (errors.nationality) setErrors(prev => ({ ...prev, nationality: null }));
                        }}
                        error={errors.nationality}
                        touched={touched.nationality}
                        required={true}
                      />
                    </div>
                  </div>
                )}

                {/* ── Internship Pricing ── */}
                {targetType === 'Internship' && course?.priceINR && (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                         <div>
                            <p className="text-sm font-bold text-slate-800">Internship Fee ({internshipMode === 'online' ? 'Online' : 'Offline'})</p>
                            <p className="text-xs text-slate-500 mt-0.5">Please review the applicable pricing below.</p>
                         </div>
                         <div className="flex gap-3">
                            <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-center shadow-sm min-w-[90px]">
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">INR</p>
                               <p className="text-lg font-bold text-green-600 leading-none">₹{Number(course.priceINR).toLocaleString("en-IN")}</p>
                            </div>
                            {internshipMode === 'online' && course.priceUSD && (
                              <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-center shadow-sm min-w-[90px]">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">USD</p>
                                 <p className="text-lg font-bold text-blue-600 leading-none">${course.priceUSD}</p>
                              </div>
                            )}
                         </div>
                      </div>
                  </div>
                )}

                {/* ── PART 1: Course Mode & Pricing ── */}
                {targetType === 'Course' && course?.prog?.modes?.length > 0 && (() => {
                  const modes = course.prog.modes;
                  const showModeSelection = modes.length > 1;
                  const activeMode = courseMode || (modes.length === 1 ? modes[0] : '');
                  const isOnline = activeMode.toLowerCase() === 'online';
                  const isOffline = activeMode.toLowerCase() === 'offline';
                  
                  return (
                  <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b border-slate-100 pb-2">Program Preferences</h4>
                    
                    {showModeSelection && (
                      <div className="flex flex-col gap-1 mb-4">
                        <CustomSelect
                          label="Mode of Study"
                          value={courseMode}
                          onChange={(val) => {
                            setCourseMode(val);
                            if (errors.courseMode) setErrors(prev => ({...prev, courseMode: null}));
                          }}
                          options={modes.map((m) => ({
                            value: m,
                            label: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
                          }))}
                          placeholder="Select Mode"
                          error={errors.courseMode}
                          touched={touched.courseMode}
                          required={true}
                        />
                      </div>
                    )}

                    {activeMode && (
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm animate-in fade-in zoom-in-95 duration-200">
                         <div>
                            <p className="text-sm font-bold text-slate-800">Course Fee ({activeMode.charAt(0).toUpperCase() + activeMode.slice(1).toLowerCase()})</p>
                            <p className="text-xs text-slate-500 mt-0.5">Please review the applicable pricing below.</p>
                         </div>
                         <div className="flex gap-3">
                            {isOffline && !isOnline && (
                              <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-center shadow-sm min-w-[90px]">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">INR</p>
                                 <p className="text-lg font-bold text-green-600 leading-none">₹{Number(course.prog.priceINR).toLocaleString("en-IN")}</p>
                              </div>
                            )}
                            {isOnline && (
                              <>
                                <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-center shadow-sm min-w-[90px]">
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">INR</p>
                                   <p className="text-lg font-bold text-green-600 leading-none">₹{Number(course.prog.priceINR).toLocaleString("en-IN")}</p>
                                </div>
                                {course.prog.priceUSD && (
                                  <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-lg text-center shadow-sm min-w-[90px]">
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">USD</p>
                                     <p className="text-lg font-bold text-blue-600 leading-none">${course.prog.priceUSD}</p>
                                  </div>
                                )}
                              </>
                            )}
                         </div>
                      </div>
                    )}
                  </div>
                  );
                })()}

                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 border-b border-slate-100 pb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Payment Details</h4>
                      <p className="text-xs text-slate-500 leading-relaxed text-left">Please complete your payment using our secure credentials and upload the proof below.</p>
                    </div>
                    <button type="button" onClick={() => setShowPaymentModal(true)} className="text-sm font-bold text-accent hover:text-accent-hover flex items-center justify-center gap-1.5 transition-colors bg-accent/5 hover:bg-accent/10 px-4 py-2.5 sm:py-2 rounded-lg border border-accent/20 whitespace-nowrap w-full sm:w-auto min-h-[44px] sm:min-h-0">
                      <CreditCard size={16} /> View Payment Credentials
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Transaction ID <span className="text-red-500">*</span></label>
                      <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.transactionId && errors.transactionId ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="e.g. UTR / Ref No." />
                      {touched.transactionId && errors.transactionId && <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>}
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Payment Screenshot <span className="text-red-500">*</span></label>
                      <input type="file" name="paymentProof" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className={`w-full px-4 py-2.5 rounded-xl border ${touched.paymentProof && errors.paymentProof ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm bg-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20`} />
                      <p className="text-xs text-slate-500 mt-0.5">Max size: 5MB (JPG, PNG, WEBP)</p>
                      {touched.paymentProof && errors.paymentProof && <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4 pt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm resize-none" placeholder="Any specific requirements..."></textarea>
                </div>

                <div className="pt-4 mt-6 flex items-center justify-between gap-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => { onClose(); setStatus(''); }} className="flex-1 md:flex-none w-full md:w-auto border-slate-200 text-slate-500 text-sm hover:bg-slate-50 h-10 px-4">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={status === 'loading'} className="flex-1 md:flex-none w-full md:w-auto flex items-center justify-center gap-2 shadow-lg hover:shadow-xl h-10 px-4 md:px-6 font-bold whitespace-nowrap">
                    {status === 'loading' ? 'Submitting...' : (
                      <>
                        <Send size={16} />
                        <span className="sm:hidden">Submit</span>
                        <span className="hidden sm:inline">Submit Application</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && paymentSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2"><CreditCard size={18} /> Payment Details</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {paymentSettings.qrCodeUrl && (
                <div className="flex justify-center border-b border-slate-100 pb-5">
                  <div className="border border-slate-200 rounded-xl p-2 bg-white shadow-sm">
                    <img src={paymentSettings.qrCodeUrl} alt="Payment QR Code" className="w-40 h-40 object-cover" />
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {[
                  { label: 'Account Name',   value: paymentSettings.accountName,   key: 'name' },
                  { label: 'Account Number', value: paymentSettings.accountNumber, key: 'acc' },
                  { label: 'IFSC Code',      value: paymentSettings.ifscCode,      key: 'ifsc' },
                  { label: 'Bank Name',      value: paymentSettings.bankName,      key: 'bank' },
                ].map(({ label, value, key }) => (
                  <div key={key} className="flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-sm font-bold text-slate-800">{value}</p>
                    </div>
                    <button type="button" onClick={() => copyToClipboard(value, key)} className="text-slate-400 hover:text-primary transition-colors p-1.5" title="Copy">
                      {copiedField === key ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button type="button" onClick={() => setShowPaymentModal(false)} variant="primary" className="w-full text-sm py-2.5">Close</Button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
