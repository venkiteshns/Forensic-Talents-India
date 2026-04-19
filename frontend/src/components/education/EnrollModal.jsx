import { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Send, CheckCircle2 } from 'lucide-react';

export function EnrollModal({ isOpen, course, onClose }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', professionStatus: '', additionalInfo: ''
  });
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
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
      courseDetails: `${course?.category} - ${course?.prog?.duration}`,
      enquiryType: 'Course Enrollment',
      message: formData.additionalInfo || 'No additional notes.',
      subject: subjectLine
    };

    try {
      const response = await fetch("https://forensic-talents-india.onrender.com/api/contact", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', age: '', professionStatus: '', additionalInfo: '' });
        setTimeout(() => {
          setStatus('');
          onClose();
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
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
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-3">Request Sent Successfully!</h4>
              <p className="text-slate-600 text-lg">Our admissions team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                  Connection error. Please try submitting again.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm" placeholder="e.g. Rahul Sharma" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm" placeholder="rahul@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm" placeholder="e.g. 24" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Professional Status <span className="text-red-500">*</span></label>
                    <select required name="professionStatus" value={formData.professionStatus} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm bg-white">
                      <option value="">Select Status</option>
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Other">Other</option>
                    </select>
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
          )}
        </div>
      </div>
    </div>
  );
}
