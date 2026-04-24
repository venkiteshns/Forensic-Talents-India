import { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SuccessModal } from '../components/ui/SuccessModal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: '',
    enquiryCategory: '',
    educationType: '',
    customRequirement: '',
    professionalService: '',
    cyberSubService: '',
    message: '',
    nationality: 'India'
  });

  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = (data = formData) => {
    let newErrors = {};
    if (!data.name.trim()) newErrors.name = "Full Name is required.";
    if (!data.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    } else {
      if (data.nationality === 'India' && !/^[6-9][0-9]{9}$/.test(data.phone.trim())) {
        newErrors.phone = "Please enter a valid 10-digit Indian phone number.";
      } else if (data.nationality !== 'India' && !/^\+?[0-9]{8,15}$/.test(data.phone.trim())) {
        newErrors.phone = "Please enter a valid international phone number.";
      }
    }

    if (!data.email.trim()) newErrors.email = "Email Address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Please enter a valid email address.";
    
    if (!data.enquiryCategory) newErrors.enquiryCategory = "Type of Enquiry is required.";
    
    if (data.enquiryCategory === 'Educational') {
      if (!data.educationType) newErrors.educationType = "Educational Enquiry Type is required.";
      if (data.educationType === 'Other' && !data.customRequirement.trim()) {
        newErrors.customRequirement = "Please describe your requirement.";
      }
    }
    
    if (data.enquiryCategory === 'Professional') {
      if (!data.professionalService) newErrors.professionalService = "Professional Service is required.";
      if (data.professionalService === 'Cyber Forensic' && !data.cyberSubService) {
        newErrors.cyberSubService = "Cyber Forensic Service is required.";
      }
    }

    if (!data.message.trim()) newErrors.message = "Message is required.";
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
      const newData = { ...prev, [name]: value };
      
      // Reset dependent fields
      if (name === 'enquiryCategory') {
        newData.educationType = '';
        newData.customRequirement = '';
        newData.professionalService = '';
        newData.cyberSubService = '';
      }
      if (name === 'educationType' && value !== 'Other') {
        newData.customRequirement = '';
      }
      if (name === 'professionalService' && value !== 'Cyber Forensic') {
        newData.cyberSubService = '';
      }
      
      return newData;
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

    let subjectLine = 'Contact Us Form';
    if (formData.enquiryCategory === 'Educational') {
      subjectLine = `Educational Enquiry: ${formData.educationType}`;
    } else if (formData.enquiryCategory === 'Professional') {
      subjectLine = `Professional Enquiry: ${formData.professionalService}`;
    }

    const payload = { ...formData, subject: subjectLine };

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
        setFormData({
          name: '', company: '', phone: '', email: '', subject: '', enquiryCategory: '', educationType: '', customRequirement: '', professionalService: '', cyberSubService: '', message: '', nationality: 'India'
        });
        setErrors({});
        setTouched({});
        setShowSuccessModal(true);
      } else {
        setStatus('server_error');
      }
    } catch (error) {
      setStatus('server_error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-88px)]">
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/contact_banner.png" alt="Contact Us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            Reach out to our professional experts for highly confidential consultations, academic training inquiries, or precise investigative support. We operate with strict discretion and prompt communication globally.
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>

              {/* {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  Please fix the highlighted errors before submitting.
                </div>
              )} */}
              {status === 'server_error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  Something went wrong while sending your message. Please try again later.
                </div>
              )}

              <form noValidate onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-lg border ${touched.name && errors.name ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder="John Doe" />
                    {touched.name && errors.name && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} onBlur={handleBlur} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Legal Firm LLC" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-lg border ${touched.phone && errors.phone ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder="+91 XXXXX XXXXX" />
                    {touched.phone && errors.phone && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-lg border ${touched.email && errors.email ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all`} placeholder="john@example.com" />
                    {touched.email && errors.email && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nationality *</label>
                  <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white">
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Type of Enquiry */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Type of Enquiry *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="enquiryCategory" value="Educational" checked={formData.enquiryCategory === 'Educational'} onChange={handleChange} onBlur={handleBlur} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700">Educational</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="enquiryCategory" value="Professional" checked={formData.enquiryCategory === 'Professional'} onChange={handleChange} onBlur={handleBlur} className="w-4 h-4 text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700">Professional</span>
                    </label>
                  </div>
                  {touched.enquiryCategory && errors.enquiryCategory && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.enquiryCategory}</p>}
                </div>

                {/* Conditional Educational */}
                {formData.enquiryCategory === 'Educational' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Educational Enquiry Type *</label>
                      <select name="educationType" value={formData.educationType} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-lg border ${touched.educationType && errors.educationType ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white`}>
                        <option value="">Select an Option</option>
                        <option value="Courses">Courses</option>
                        <option value="Internships">Internships</option>
                        <option value="Training">Training</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Other">Other</option>
                      </select>
                      {touched.educationType && errors.educationType && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.educationType}</p>}
                    </div>

                    {formData.educationType === 'Other' && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Please describe your requirement *</label>
                        <textarea name="customRequirement" value={formData.customRequirement} onChange={handleChange} onBlur={handleBlur} rows="3" className={`w-full px-4 py-3 rounded-lg border ${touched.customRequirement && errors.customRequirement ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`} placeholder="Describe your educational needs..."></textarea>
                        {touched.customRequirement && errors.customRequirement && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.customRequirement}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Conditional Professional */}
                {formData.enquiryCategory === 'Professional' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Select Professional Service *</label>
                      <select name="professionalService" value={formData.professionalService} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-lg border ${touched.professionalService && errors.professionalService ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white`}>
                        <option value="">Select a Service</option>
                        <option value="Fingerprint Verification">Fingerprint Verification</option>
                        <option value="Signature Verification">Signature Verification</option>
                        <option value="Handwriting Analysis">Handwriting Analysis</option>
                        <option value="Polygraph Testing">Polygraph Testing</option>
                        <option value="Police Clearance Certificate (PCC)">Police Clearance Certificate (PCC)</option>
                        <option value="Crime Scene Investigation">Crime Scene Investigation</option>
                        <option value="Cyber Forensic">Cyber Forensic</option>
                        <option value="Biological Analysis">Biological Analysis</option>
                        <option value="Toxicology Analysis">Toxicology Analysis</option>
                      </select>
                      {touched.professionalService && errors.professionalService && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.professionalService}</p>}
                    </div>

                    {formData.professionalService === 'Cyber Forensic' && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Cyber Forensic Service *</label>
                        <select name="cyberSubService" value={formData.cyberSubService} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 rounded-lg border ${touched.cyberSubService && errors.cyberSubService ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white`}>
                          <option value="">Select a Cyber Service</option>
                          <option value="63(4)(c) Certificate BSA">63(4)(c) Certificate BSA</option>
                          <option value="65B Certificate">65B Certificate</option>
                          <option value="Audio Analysis">Audio Analysis</option>
                          <option value="Video Analysis">Video Analysis</option>
                          <option value="Image Analysis">Image Analysis</option>
                          <option value="WhatsApp Chat Analysis">WhatsApp Chat Analysis</option>
                          <option value="Social Media Analysis">Social Media Analysis</option>
                          <option value="Other">Other</option>
                        </select>
                        {touched.cyberSubService && errors.cyberSubService && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.cyberSubService}</p>}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} rows="5" className={`w-full px-4 py-3 rounded-lg border ${touched.message && errors.message ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`} placeholder="How can we help you?"></textarea>
                  {touched.message && errors.message && <p className="text-red-500 text-sm mt-1 animate-in fade-in duration-300">{errors.message}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Submit Enquiry'}
                </Button>
              </form>
            </div>

            {/* Contact Details & Map */}
            <div className="lg:col-span-5 space-y-8">

              {/* Contact Info Card */}
              <div className="bg-primary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><MapPin size={100} /></div>
                <h3 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h3>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Corporate Office (HEAD Office)</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        A-411, Supath-II Complex,<br />
                        Opp. Old Wadaj Bus Stop,<br />
                        Old Wadaj, Ashram Road,<br />
                        Ahmedabad - 380013, Gujarat, INDIA
                      </p>
                      <p className="text-sm text-slate-300 mt-1 flex items-center gap-2"><Phone size={14} className="text-accent" /> +91 704 666 9919</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Register Office</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        A-19, Narayan Park Society, Nikol,<br />
                        Ahmedabad, Gujarat, INDIA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Branch Office (Hyderabad)</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        B-105, Bharani Apartments,<br />
                        Saleem Nagar Colony, Malakpet Extension,<br />
                        Malakpet, Hyderabad - 500036,<br />
                        Telangana, India
                      </p>
                      <p className="text-sm text-slate-300 mt-1 flex items-center gap-2"><Phone size={14} className="text-accent" /> +91 98851 14772</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Email Address</h4>
                      <p className="text-sm text-slate-300">info@forensictalents.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Working Hours</h4>
                      <p className="text-sm text-slate-300">Mon - Sat: 10:00 AM – 6:00 PM<br />Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.1850804330325!2d72.56706014528432!3d23.053675261596013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85ba5ced6ad9%3A0xdf204dd95bd17ad5!2sForensic%20Talents%20INDIA!5e0!3m2!1sen!2sin!4v1775825809703!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location Map"
                ></iframe>
              </div>

            </div>
          </div>
        </Container>
      </section>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div >
  );
}
