import { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BookOpen, Award, Briefcase, GraduationCap, Clock, IndianRupee, ChevronDown, ChevronUp, X, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Education() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', professionStatus: '', additionalInfo: ''
  });
  const [status, setStatus] = useState('');

  const toggleDetails = (id) => {
    setExpandedProgram(expandedProgram === id ? null : id);
  };

  const handleEnrollClick = (category, prog) => {
    setEnrollModal({ isOpen: true, course: { category, prog } });
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setStatus('loading');

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      professionStatus: formData.professionStatus,
      courseDetails: `${enrollModal.course.category} - ${enrollModal.course.prog.duration}`,
      enquiryType: 'Course Enrollment',
      message: formData.additionalInfo || 'No additional notes.'
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
          setEnrollModal({ isOpen: false, course: null });
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const courses = [
    {
      category: "Fingerprint Analysis Courses",
      icon: <FingerprintIcon />,
      programs: [
        {
          id: "fingerprint-1-week",
          duration: "1 Week Certificate Course",
          price: "1500 - 2000",
          desc: "This short-term course provides a foundational understanding of fingerprint science and its importance in forensic investigations. It is ideal for beginners who want to explore the basics of forensic identification.",
          topics: [
            "Introduction, History, and Principles of Fingerprints",
            "Formation of Friction Ridges & Basic Terminology",
            "Fingerprint Patterns and Classification (basic)",
            "Ridge Characteristics (Minutiae)",
            "Types of Fingerprints & Crime Scene Surfaces",
            "Development, Lifting, and Preservation of Fingerprints",
            "ACE-V Method and Identification Basics",
            "Applications of Fingerprinting in Forensics"
          ]
        },
        {
          id: "fingerprint-1-month",
          duration: "1 Month Certificate Course",
          price: "3500 - 5000",
          desc: "This comprehensive program offers in-depth knowledge and practical training in fingerprint examination and identification techniques.",
          topics: [
            "Introduction to Fingerprints", "History of Fingerprints", "Principles of Fingerprints", "Formation of Friction Ridges in Humans", "Composition of Sweat", "Fingerprint Patterns", "Types of Surfaces", "Systematic Classification of Fingerprints", "Ridge Characteristics (Minutiae)", "Recording of Fingerprints", "Types of Fingerprints Found at a Crime Scene", "Development of Latent Fingerprints", "Lifting Fingerprints", "Preservation of Fingerprints", "ACE-V Method", "Advanced Modern Applications", "Basic Terminology"
          ]
        }
      ]
    },
    {
      category: "Handwriting & Signature Analysis Courses",
      icon: <FileSignatureIcon />,
      programs: [
        {
          id: "handwriting-1-week",
          duration: "1 Week Certificate Course",
          price: "1500 - 2000",
          desc: "This course introduces the fundamentals of handwriting examination and signature verification.",
          topics: [
            "Introduction, History, and Principles of Document Examination", "Handwriting Examination and Characteristics", "Handwriting Forgeries and Alterations", "Paper, Ink, and Writing Instruments", "Printing Processes and Basic Font Analysis", "Security Features in Documents", "Document Examination Tools"
          ]
        },
        {
          id: "handwriting-1-month",
          duration: "1 Month Certificate Course",
          price: "3500 - 5000",
          desc: "An advanced program focusing on detailed examination and forensic analysis of handwriting and signatures.",
          topics: [
            "Introduction to Document Examination", "History and Development of Questioned Documents", "Principles of Document Examination", "Significance of Document Examination in Forensic Science", "Techniques of Photographing Documents", "Factors Affecting Handwriting", "Handwriting Characteristics and Analysis", "Types of Paper and Their Examination", "Writing Instruments and Ink Examination", "Types of Handwriting Forgeries", "Evaluation of Forged Handwriting", "Types of Alterations in Documents", "Types of Printing Processes", "Font Anatomy and Typography Analysis", "Examination of Electronic Signatures", "Security Features in Official Documents (PAN Card, Voter ID, etc.)", "Art Forgery Detection", "Document Examination Instruments and Tools", "Report Writing", "Expert Witness Testimony in Court"
          ]
        }
      ]
    },
    {
      category: "Cyber Forensics Courses",
      icon: <MonitorIcon />,
      programs: [
        {
          id: "cyber-1-week",
          duration: "1 Week Certificate Course",
          price: "1500 - 2000",
          desc: "This course provides a basic understanding of cybercrime and digital forensic investigation.",
          topics: [
            "Introduction, Evolution, and Legal Framework of Cyber Forensics", "Digital Evidence and Role of First Responder", "Evidence Handling and Chain of Custody", "Data Acquisition, Hard Disks, and File Systems (Basics)", "Computer Forensic Investigation Process and Tools", "Windows and Deleted Data Forensics (Basics)", "Network, Web, and Email Forensics (Overview)", "Mobile Forensics, Reporting, and Court Testimony"
          ]
        },
        {
          id: "cyber-1-month",
          duration: "1 Month Certificate Course",
          price: "3500 - 5000",
          desc: "An advanced course covering digital investigation techniques and practical forensic analysis.",
          topics: [
            "Introduction to Cyber Forensics", "Evolution of Computer Forensics", "Types of cyber attacks", "Legal Framework and Cyber Laws", "Searching and Seizing Digital Evidence (With & Without Warrant)", "Role of First Responder", "Types of Digital Evidence", "Evidence Handling and Chain of Custody", "Hard Disks and File Systems", "Windows Forensics", "Data Acquisition and Duplication", "Deleted File Recovery Techniques", "Computer Forensic Investigation Process", "Investigation Toolkits and Forensic Software", "Image File Forensics and Steganography", "Password Cracking Techniques", "Network Forensics", "Investigation of Wireless Attacks", "Web Attack Investigation", "Email Forensics and Tracking", "Types of Email Crimes", "Mobile Forensics", "Cloud and Emerging Technologies Forensics", "Malware and Dark Web Forensics", "Report Writing in Cyber Forensics", "Expert Witness Testimony in Court", "Setting Up a Computer Forensics Laboratory"
          ]
        }
      ]
    },
    {
      category: "Crime Scene Management Courses",
      icon: <SearchIcon />,
      programs: [
        {
          id: "crime-1-week",
          duration: "1 Week Certificate Course",
          price: "1500 - 2000",
          desc: "This course provides basic knowledge of crime scene handling and investigation procedures.",
          topics: [
            "Introduction to Crime Scene and Securing the Scene", "Crime Scene Contamination and Preventive Measures", "Search Methods and Evaluation of Crime Scene", "Types of Evidence and Crime Scene Processing", "Collection, Packaging, and Preservation of Evidence", "Chain of Custody and Forwarding to Laboratory", "Crime Scene Reconstruction, Legal Procedure (BNSS), and Report Writing"
          ]
        },
        {
          id: "crime-1-month",
          duration: "1 Month Certificate Course",
          price: "3500 - 5000",
          desc: "A detailed program focused on professional crime scene investigation and management.",
          topics: [
            "Introduction to crime scene", "Meaning of Crime Scene Contamination", "Securing the Crime Scene", "Prevention of Crime Scene Contamination and Protective Measures", "Search Methods in Crime Scene Investigation", "Evaluation of Crime Scene", "Processing of Crime Scene", "Types of Evidence", "Collection and Packaging of Evidence", "Safety Measures During Collection of Evidence", "Preservation of Evidence", "Handling of Evidence", "Chain of Custody", "Forwarding of Evidence to Laboratory", "Crime Scene Reconstruction", "Investigation Procedure under BNSS", "Criminal Trial", "Report Writing"
          ]
        }
      ]
    }
  ];

  const features = [
    "Practical hands-on training",
    "Real case study exposure",
    "Guidance from experienced forensic experts",
    "Industry-relevant curriculum",
    "Certification upon successful completion"
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/education_banner.png" alt="Forensic Education" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Education & Training Programs</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            Industry-oriented forensic science training designed to provide deep theoretical knowledge fused with hands-on practical exposure. Delivered directly by top-tier field experts, preparing you for real-world forensic challenges.
          </p>
        </Container>
      </section>

      {/* Courses */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-max">
                <div className="bg-slate-100 p-6 border-b flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg shadow flex-shrink-0">
                    {cat.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-primary">{cat.category}</h2>
                </div>
                <div className="p-6 divide-y divide-slate-100">
                  {cat.programs.map((prog) => {
                    const isExpanded = expandedProgram === prog.id;
                    return (
                      <div key={prog.id} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock size={18} className="text-accent" /> {prog.duration}
                          </h3>
                          {prog.price.includes('Contact') ? (
                            <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold border border-slate-200 w-max">
                              {prog.price}
                            </span>
                          ) : (
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 border border-green-200 w-max">
                              <IndianRupee size={14} /> {prog.price}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 mb-2">
                          <Button variant="secondary" size="sm" onClick={() => toggleDetails(prog.id)} className="flex items-center gap-1 group">
                            {isExpanded ? (
                              <><ChevronUp size={16} className="text-primary" /> Hide Details</>
                            ) : (
                              <><ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform text-primary" /> Show Details</>
                            )}
                          </Button>
                          <Button variant="primary" size="sm" onClick={() => handleEnrollClick(cat.category, prog)}>
                            Enroll Now
                          </Button>
                        </div>

                        {/* Expandable Course Details */}
                        {isExpanded && (
                          <div className="mt-4 bg-slate-50 p-5 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                            <p className="text-slate-700 italic mb-5 text-sm leading-relaxed border-l-4 border-l-accent pl-4">{prog.desc}</p>
                            <h4 className="font-bold text-primary mb-3 text-sm flex items-center gap-2">
                              <BookOpen size={16} className="text-accent" /> Course Content Snapshot:
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                              {prog.topics.map((topic, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Training Features & Internship */}
      <section className="py-16 bg-white border-y border-slate-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-6 flex items-center gap-2">
                <Award className="text-accent" /> Why Choose Our Training?
              </h2>
              <ul className="space-y-4">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <BookOpen size={20} className="text-primary" />
                    <span className="font-medium text-slate-700">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="bg-primary text-white p-8 rounded-xl shadow-lg relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Briefcase size={120} />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-2 relative z-10">
                  <Briefcase className="text-accent" /> <span className="text-white">Internship Opportunities</span>
                </h2>
                <p className="text-slate-300 mb-6 relative z-10 leading-relaxed">
                  We provide exclusive internship programs where students can work on real or simulated forensic cases, gain field-level experience, enhance practical investigation skills, and build professional confidence.
                </p>
                <ul className="space-y-2 mb-8 text-slate-200 relative z-10">
                  <li className="flex items-center gap-2"><GraduationCap size={16} /> Offline classroom training</li>
                  <li className="flex items-center gap-2"><GraduationCap size={16} /> Live demonstrations</li>
                  <li className="flex items-center gap-2"><GraduationCap size={16} /> Access to leading forensic tools</li>
                </ul>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="w-full relative z-10 text-primary"
                  onClick={() => handleEnrollClick("Internship Opportunity", { duration: "General Application" })}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Enroll Modal */}
      {enrollModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-primary">Course Enrollment</h3>
                <p className="text-sm text-slate-500 mt-1">{enrollModal.course?.category} - {enrollModal.course?.prog.duration}</p>
              </div>
              <button onClick={() => { setEnrollModal({ isOpen: false, course: null }); setStatus(''); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Enrollment Request Sent!</h4>
                  <p className="text-slate-600">Our team will get back to you shortly with next steps.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                      Something went wrong. Please try again later.
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                      <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="John Doe" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="e.g. 24" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                        <select required name="professionStatus" value={formData.professionStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white">
                          <option value="">Select Status</option>
                          <option value="Student">Student</option>
                          <option value="Working Professional">Working Professional</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                      <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" placeholder="Any specific requirements..."></textarea>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end mt-4">
                    <Button type="button" variant="ghost" onClick={() => { setEnrollModal({ isOpen: false, course: null }); setStatus(''); }} className="mr-2">Cancel</Button>
                    <Button type="submit" variant="primary" disabled={status === 'loading'} className="flex items-center gap-2">
                      {status === 'loading' ? 'Sending...' : <><Send size={16} /> Submit Request</>}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon Components (local to avoid massive imports)
function FingerprintIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12C2 17.5 6.5 22 12 22a9.7 9.7 0 0 0 3-.5" /><path d="M21.5 12A9.5 9.5 0 0 0 12 2.5a9.5 9.5 0 0 0-9.5 9.5" /><path d="M5.5 12a6.5 6.5 0 0 1 13 0" /><path d="M18.5 12a6.5 6.5 0 0 0-13 0" /><path d="M8.5 12a3.5 3.5 0 0 1 7 0" /><path d="M15.5 12a3.5 3.5 0 0 0-7 0" /><path d="M11 12h2" /></svg> }
function FileSignatureIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M14.5 18 19 13v-3.5L14.5 5 10 9.5V13" /><path d="M4 22h14" /><path d="M7 13v5M11 13v5" /></svg> }
function MonitorIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg> }
function SearchIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> }
