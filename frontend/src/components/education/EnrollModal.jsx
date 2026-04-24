import { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { SuccessModal } from '../ui/SuccessModal';

export function EnrollModal({ isOpen, course, onClose }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', professionStatus: '', nationality: 'India', mode: 'online', additionalInfo: ''
  });
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = (data = formData) => {
    let newErrors = {};
    if (!data.name.trim()) newErrors.name = "Full Name is required.";
    if (!data.email.trim()) newErrors.email = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Please enter a valid email address.";
    
    if (!data.phone.trim()) {
      newErrors.phone = "Contact Number is required.";
    } else {
      const finalNationality = data.nationality || 'India';
      if (finalNationality === 'India' && !/^[6-9][0-9]{9}$/.test(data.phone.trim())) {
        newErrors.phone = "Please enter a valid 10-digit Indian phone number.";
      } else if (finalNationality !== 'India' && !/^\+?[0-9]{8,15}$/.test(data.phone.trim())) {
        newErrors.phone = "Please enter a valid international phone number.";
      }
    }
    
    if (data.age) {
      const parsedAge = parseInt(data.age, 10);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
        newErrors.age = "Please enter a valid age.";
      }
    }
    
    if (!data.professionStatus) newErrors.professionStatus = "Professional Status is required.";
    
    if (!data.mode) newErrors.mode = "Mode of Learning is required.";
    if (data.mode === 'online' && !data.nationality) {
      newErrors.nationality = "Nationality is required for online learning.";
    }
    
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const currentErrors = validate();
    setErrors(currentErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'mode' && value === 'offline') updated.nationality = '';
      if (name === 'mode' && value === 'online' && !updated.nationality) updated.nationality = 'India';
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const allTouched = Object.keys(newErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(prev => ({ ...prev, ...allTouched }));
      
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

    let subjectLine = 'Course Enrollment';
    if (course?.category?.toLowerCase().includes('quiz')) {
      subjectLine = 'Quiz Enrollment';
    } else if (course?.category?.toLowerCase().includes('internship')) {
      subjectLine = 'Internship Enrollment';
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      professionStatus: formData.professionStatus,
      nationality: formData.nationality,
      mode: formData.mode,
      courseDetails: `${course?.category} - ${course?.prog?.duration}`,
      enquiryType: 'Course Enrollment',
      message: formData.additionalInfo || 'No additional notes.',
      subject: subjectLine
    };

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://forensic-talents-india.onrender.com/api';
      const response = await fetch(`${BACKEND_URL}/contact`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus('');
        setFormData({ name: '', email: '', phone: '', age: '', professionStatus: '', nationality: 'India', mode: 'online', additionalInfo: '' });
        setErrors({});
        setTouched({});
        onClose();
        setShowSuccessModal(true);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold text-primary">Enrollment Request</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {course?.category} - {course?.prog?.duration}
            </p>
          </div>
          <button onClick={() => { onClose(); setStatus(''); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

            <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                  Connection error. Please try submitting again.
                </div>
              )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.name && errors.name ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="e.g. Rahul Sharma" />
                    {touched.name && errors.name && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.email && errors.email ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="rahul@example.com" />
                      {touched.email && errors.email && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.phone && errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="+91 XXXXX XXXXX" />
                      {touched.phone && errors.phone && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.phone}</p>}
                    </div>
                  </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Mode of Learning <span className="text-red-500">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex-1 hover:bg-slate-100 transition-colors">
                      <input type="radio" name="mode" value="online" checked={formData.mode === 'online'} onChange={handleChange} onBlur={handleBlur} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700 font-medium">Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex-1 hover:bg-slate-100 transition-colors">
                      <input type="radio" name="mode" value="offline" checked={formData.mode === 'offline'} onChange={handleChange} onBlur={handleBlur} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700 font-medium">Offline</span>
                    </label>
                  </div>
                  {touched.mode && errors.mode && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.mode}</p>}
                </div>

                {formData.mode === 'online' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Nationality <span className="text-red-500">*</span></label>
                    <select name="nationality" value={formData.nationality} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.nationality && errors.nationality ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm bg-white`}>
                      <option value="">Select your country</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Other">Other</option>
                    </select>
                    {touched.nationality && errors.nationality && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.nationality}</p>}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Age</label>
                    <input type="number" min="0" max="120" name="age" value={formData.age} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.age && errors.age ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm`} placeholder="e.g. 24" />
                    {touched.age && errors.age && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Professional Status <span className="text-red-500">*</span></label>
                    <select name="professionStatus" value={formData.professionStatus} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-xl border ${touched.professionStatus && errors.professionStatus ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-accent'} focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm bg-white`}>
                      <option value="">Select Status</option>
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Other">Other</option>
                    </select>
                    {touched.professionStatus && errors.professionStatus && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.professionStatus}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Additional Notes</label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm resize-none" placeholder="Any specific requirements or questions..."></textarea>
                </div>
              </div>

                <div className="pt-6 mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => { onClose(); setStatus(''); }} className="border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</Button>
                  <Button type="submit" variant="primary" disabled={status === 'loading'} className="flex items-center gap-2 shadow-lg hover:shadow-xl">
                    {status === 'loading' ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
                  </Button>
                </div>
              </form>
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
