import { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    subject: '',
    service: '',
    enquiryType: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    else if (formData.email.indexOf('@') < 1 || formData.email.lastIndexOf('.') < formData.email.indexOf('@') + 2) newErrors.email = "Email Address is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch("https://forensic-talents-india.onrender.com/api/contact", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '', company: '', phone: '', email: '', subject: '', service: '', enquiryType: '', message: ''
        });
        setTimeout(() => setStatus(''), 5000);
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

              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  Thank you! Your message has been sent successfully. We will get back to you shortly.
                </div>
              )}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`} placeholder="John Doe" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Legal Firm LLC" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`} placeholder="+91 XXXXX XXXXX" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`} placeholder="john@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service of Interest</label>
                    <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white">
                      <option value="">Select a Service</option>
                      <option value="pcc">Police Clearance Certificate</option>
                      <option value="qde">Questioned Documents</option>
                      <option value="fingerprint">Fingerprint Examination</option>
                      <option value="cyber">Cyber Forensics</option>
                      <option value="crime-scene">Crime Scene Investigation</option>
                      <option value="cross-examination">Cross Examination</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Course / Internship Enquiry</label>
                    <select name="enquiryType" value={formData.enquiryType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white">
                      <option value="">Select an Option for Course Related Enquiry</option>
                      <option value="fingerprint-course">Fingerprint Course</option>
                      <option value="handwriting-course">Handwriting Course</option>
                      <option value="cyber-course">Cyber Forensics Course</option>
                      <option value="crime-scene-course">Crime Scene Course</option>
                      <option value="internship">Internship Opportunity</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="5" className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none`} placeholder="How can we help you?"></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
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
                      <h4 className="font-semibold text-slate-200 mb-1">Office Address</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        A-411, Supath-II Complex,<br />
                        Opp. Old Wadaj Bus Stop,<br />
                        Old Wadaj, Ashram Road,<br />
                        Ahmedabad – 380013, Gujarat, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Phone Number</h4>
                      <p className="text-sm text-slate-300">+91 704 666 9919</p>
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
    </div >
  );
}
