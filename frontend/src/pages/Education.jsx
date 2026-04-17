import { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BookOpen, Award, Briefcase, GraduationCap, Clock, IndianRupee, ChevronDown, ChevronUp, X, Send, CheckCircle2, Globe, MapPin, ExternalLink, Fingerprint, Monitor, Search, PenTool, PlayCircle, FileText, CheckCircle, Shield, BrainCircuit, ArrowRight } from 'lucide-react';

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

    let subjectLine = `New Registration: ${enrollModal.course.category}`;
    if (enrollModal.course.category.toLowerCase().includes('quiz')) {
      subjectLine = `New Quiz Registration: Monthly Forensic Quiz`;
    } else if (enrollModal.course.category.toLowerCase().includes('internship')) {
      subjectLine = `New Internship Application: ${enrollModal.course.category}`;
    } else {
      subjectLine = `New Course Registration: ${enrollModal.course.category} - ${enrollModal.course.prog.duration}`;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      professionStatus: formData.professionStatus,
      courseDetails: `${enrollModal.course.category} - ${enrollModal.course.prog.duration}`,
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
      category: "Fingerprint Analysis",
      icon: <Fingerprint size={28} />,
      programs: [
        {
          id: "fingerprint-1-week",
          duration: "1 Week Certificate Course",
          price: "2500",
          modes: ["Online", "Offline"],
          desc: "This short-term course provides a foundational understanding of fingerprint science and its importance in forensic investigations. Ideal for beginners.",
          topics: [
            "Introduction, History, and Principles of Fingerprints",
            "Formation of Friction Ridges & Basic Terminology",
            "Fingerprint Patterns and Classification (basic)",
            "Ridge Characteristics (Minutiae)",
            "Types of Fingerprints & Crime Scene Surfaces",
            "Development, Lifting, and Preservation",
            "ACE-V Method and Identification Basics",
            "Applications of Fingerprinting in Forensics"
          ]
        },
        {
          id: "fingerprint-1-month",
          duration: "1 Month Certificate Course",
          price: "8000",
          modes: ["Online", "Offline"],
          desc: "This comprehensive program offers in-depth knowledge and practical training in fingerprint examination and identification techniques.",
          topics: [
            "Introduction to Fingerprints", "History & Principles", "Formation of Friction Ridges", "Composition of Sweat", "Fingerprint Patterns & Classification", "Ridge Characteristics (Minutiae)", "Recording & Types of Fingerprints", "Development of Latent Fingerprints", "Lifting & Preservation", "ACE-V Method", "Advanced Modern Applications", "Basic Terminology"
          ]
        }
      ]
    },
    {
      category: "Handwriting & Signature Analysis",
      icon: <PenTool size={28} />,
      programs: [
        {
          id: "handwriting-1-week",
          duration: "1 Week Certificate Course",
          price: "2500",
          modes: ["Online", "Offline"],
          desc: "This course introduces the fundamentals of handwriting examination and signature verification.",
          topics: [
            "Principles of Document Examination", "Handwriting Examination and Characteristics", "Handwriting Forgeries and Alterations", "Paper, Ink, and Writing Instruments", "Printing Processes & Font Analysis", "Security Features in Documents", "Document Examination Tools"
          ]
        },
        {
          id: "handwriting-1-month",
          duration: "1 Month Certificate Course",
          price: "8000",
          modes: ["Online", "Offline"],
          desc: "An advanced program focusing on detailed examination and forensic analysis of handwriting and signatures.",
          topics: [
            "Introduction & History", "Principles of Document Examination", "Techniques of Photographing Documents", "Factors Affecting Handwriting", "Handwriting Characteristics & Analysis", "Paper & Ink Examination", "Types of Forgeries", "Evaluation of Forged Handwriting", "Alterations in Documents", "Printing Processes & Font Anatomy", "Electronic Signatures & Security Features", "Art Forgery Detection", "Report Writing & Court Testimony"
          ]
        }
      ]
    },
    {
      category: "Cyber Forensics",
      icon: <Monitor size={28} />,
      programs: [
        {
          id: "cyber-1-week",
          duration: "1 Week Certificate Course",
          price: "2500",
          modes: ["Online", "Offline"],
          desc: "This course provides a basic understanding of cybercrime and digital forensic investigation.",
          topics: [
            "Introduction & Legal Framework", "Digital Evidence & First Responder", "Evidence Handling & Chain of Custody", "Data Acquisition & File Systems", "Investigation Process & Tools", "Windows & Deleted Data Forensics", "Network, Web, and Email Forensics", "Mobile Forensics & Court Testimony"
          ]
        },
        {
          id: "cyber-1-month",
          duration: "1 Month Certificate Course",
          price: "8000",
          modes: ["Online", "Offline"],
          desc: "An advanced course covering digital investigation techniques and practical forensic analysis.",
          topics: [
            "Evolution of Computer Forensics", "Types of Cyber Attacks & Cyber Laws", "Searching and Seizing Digital Evidence", "Hard Disks, File Systems & Windows Forensics", "Data Acquisition & Duplication", "Deleted File Recovery Techniques", "Investigation Toolkits & Software", "Image File Forensics & Steganography", "Password Cracking & Network Forensics", "Web & Wireless Attacks", "Email & Mobile Forensics", "Cloud & Dark Web Forensics", "Report Writing & Setting Up a Lab"
          ]
        }
      ]
    },
    {
      category: "Crime Scene Management",
      icon: <Search size={28} />,
      programs: [
        {
          id: "crime-1-week",
          duration: "1 Week Certificate Course",
          price: "2500",
          modes: ["Online", "Offline"],
          desc: "This course provides basic knowledge of crime scene handling and investigation procedures.",
          topics: [
            "Introduction & Securing the Scene", "Contamination & Preventive Measures", "Search Methods & Evaluation", "Types of Evidence & Processing", "Collection, Packaging & Preservation", "Chain of Custody & Forwarding", "Crime Scene Reconstruction & Report Writing"
          ]
        },
        {
          id: "crime-1-month",
          duration: "1 Month Certificate Course",
          price: "8000",
          modes: ["Online", "Offline"],
          desc: "A detailed program focused on professional crime scene investigation and management.",
          topics: [
            "Introduction to Crime Scene", "Crime Scene Contamination", "Securing & Protective Measures", "Search Methods & Evaluation", "Processing & Types of Evidence", "Collection, Packaging & Safety Measures", "Preservation & Handling of Evidence", "Chain of Custody & Forwarding", "Crime Scene Reconstruction", "Investigation Procedure under BNSS", "Criminal Trial & Report Writing"
          ]
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img src="/images/banners/education_banner.png" alt="Education Background" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-primary/80 to-primary/40"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* <span className="bg-accent/20 text-accent-light px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-6 inline-block backdrop-blur-md border border-accent/30">Forensic Talents Academy</span> */}
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 drop-shadow-lg">
              Master the Science of <br /><span className="text-accent">Investigation</span>
            </h1>
            <p className="text-slate-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow">
              Industry-oriented forensic science training designed to provide deep theoretical knowledge fused with hands-on practical exposure.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. CERTIFICATE COURSES SECTION */}
      <section className="py-24 relative z-10 -mt-10">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Certificate Courses</h2>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Specialized programs crafted by industry experts to advance your forensic career.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden group hover:border-accent/50 transition-colors duration-300">
                <div className="bg-slate-900 p-8 border-b border-slate-800 flex items-center gap-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-5 -translate-y-1/4 translate-x-1/4">
                    {cat.icon}
                  </div>
                  <div className="w-16 h-16 bg-accent/20 text-accent flex items-center justify-center rounded-xl shadow-inner flex-shrink-0 relative z-10 backdrop-blur-md border border-accent/30">
                    {cat.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white relative z-10 tracking-wide">{cat.category}</h2>
                </div>

                <div className="p-8 divide-y divide-slate-100">
                  {cat.programs.map((prog) => {
                    const isExpanded = expandedProgram === prog.id;
                    return (
                      <div key={prog.id} className="py-8 first:pt-0 last:pb-0">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                              <Clock size={20} className="text-accent" /> {prog.duration}
                            </h3>
                            <div className="flex gap-2">
                              {prog.modes.map(mode => (
                                <span key={mode} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                                  {mode === 'Online' ? <Globe size={12} /> : <MapPin size={12} />} {mode}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-lg font-bold flex items-center gap-1 border border-green-200 w-max md:ml-auto shadow-sm">
                              <IndianRupee size={18} /> {prog.price}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                          <Button variant="primary" size="lg" onClick={() => handleEnrollClick(cat.category, prog)} className="w-full min-[501px]:w-auto shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 justify-center">
                            Enroll Now
                          </Button>
                          <Button variant="secondary" size="lg" onClick={() => toggleDetails(prog.id)} className="flex items-center justify-center gap-2 group w-full min-[501px]:w-auto">
                            {isExpanded ? (
                              <><ChevronUp size={18} className="text-primary" /> Hide Details</>
                            ) : (
                              <><ChevronDown size={18} className="group-hover:translate-y-1 transition-transform text-primary" /> Show Details</>
                            )}
                          </Button>
                        </div>

                        {/* Expandable Syllabus */}
                        {isExpanded && (
                          <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
                            <p className="text-slate-700 italic mb-6 text-sm leading-relaxed border-l-4 border-l-accent pl-4">{prog.desc}</p>
                            <h4 className="font-bold text-primary mb-4 text-sm flex items-center gap-2 uppercase tracking-wide">
                              <BookOpen size={16} className="text-accent" /> Syllabus Breakdown
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600">
                              {prog.topics.map((topic, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2 leading-relaxed">
                                  <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
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

      {/* 3. INTERNSHIPS SECTION (FROM POSTER) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Forensics Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="fingerprint-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10 Q 20 5 30 15 T 50 10 T 70 20" stroke="white" fill="none" strokeWidth="1" />
                <path d="M15 25 Q 25 15 40 25 T 60 15 T 80 30" stroke="white" fill="none" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fingerprint-pattern)" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="text-center mb-16">
            <span className="bg-accent/20 text-accent-light px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase mb-4 inline-block backdrop-blur-md border border-accent/30">Summer Lab Based</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Internship Program</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl">
              Jumpstart your career and acquire practical, real-world experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Areas to Explore */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700 hover:border-accent/50 transition-colors shadow-2xl h-full flex flex-col">
              <h3 className="text-xl font-bold text-accent mb-6 flex items-center gap-3">
                <Search size={24} /> Areas You Will Explore
              </h3>
              <ul className="space-y-4 text-slate-300 flex-grow">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Crime Scene Investigation & Management</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Questioned Documents</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Fingerprint Identification</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Digital & Cyber Forensics</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Trace Evidence & Biology</li>
              </ul>
            </div>

            {/* Online Internship */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:-translate-y-2 transition-transform duration-300 relative flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Online Internship</h3>
              <p className="text-slate-500 mb-6 font-medium">Virtual Practical Exposure</p>

              <div className="mb-6 flex items-baseline text-slate-900">
                <span className="text-4xl font-extrabold tracking-tight">₹6,500</span>
                <span className="ml-1 text-slate-500 font-medium">/ 1 Month</span>
              </div>

              <div className="border-t border-slate-100 pt-6 flex-grow">
                <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Benefits included</h4>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Award className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Recognized Certificate of Internship</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button variant="outline" size="lg" className="w-full justify-center group border-slate-300 hover:border-primary hover:bg-slate-50 text-slate-800" onClick={() => handleEnrollClick("Online Internship", { duration: "1 Month" })}>
                  Get Started <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Offline Internship */}
            <div className="bg-gradient-to-b from-primary to-primary-dark rounded-2xl p-8 shadow-2xl transform hover:-translate-y-2 transition-transform duration-300 relative border-2 border-accent flex flex-col">
              <div className="absolute top-0 right-0 bg-accent text-primary font-bold text-xs px-3 py-1.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
                Best Value / Recommended
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Offline Internship</h3>
              <p className="text-accent-light mb-6 font-medium">In-Lab Premium Experience</p>

              <div className="mb-6 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">₹8,500</span>
                <span className="ml-1 text-slate-300 font-medium">/ 1 Month</span>
              </div>

              <div className="border-t border-white/10 pt-6 flex-grow">
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Benefits included</h4>
                <ul className="space-y-4 text-slate-200">
                  <li className="flex items-start gap-3">
                    <Award className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Recognized Certificate of Internship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Briefcase className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Exclusive Welcome Kit & Official T-Shirt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Field Visits: Mortuary & Police Station</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button variant="accent" size="lg" className="w-full justify-center group shadow-[0_0_20px_rgba(46,204,113,0.3)]" onClick={() => handleEnrollClick("Offline Internship", { duration: "1 Month" })}>
                  Get Started <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* WHY CHOOSE OUR TRAINING SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-slate-800 mb-8 flex items-center gap-3">
              <Award className="text-accent" size={32} /> Why Choose Our Training?
            </h2>
            <div className="space-y-4">
              {[
                "Practical hands-on training",
                "Real case study exposure",
                "Guidance from experienced forensic experts",
                "Industry-relevant curriculum",
                "Certification upon successful completion"
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0 border border-slate-100">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-slate-700 font-medium text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. QUIZ SECTION */}
      <section className="py-24 bg-white border-b border-slate-100">
        <Container>
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">

            {/* Background Texture */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
              <BrainCircuit className="w-full h-full text-primary scale-150 translate-x-1/4 -translate-y-1/4" />
            </div>

            <div className="md:w-1/2 relative z-10">
              <span className="text-accent font-bold tracking-wider uppercase text-sm mb-3 block">Monthly Initiative</span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">Test Your Forensic Knowledge</h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                Engage deeply with real-world case studies and enhance your investigative understanding through our Monthly Forensic Quiz Program.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle className="text-accent" size={20} /> Case-Based Learning
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle className="text-accent" size={20} /> Real-life criminal investigations
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle className="text-accent" size={20} /> Earn Certificates of Merit
                </li>
              </ul>
              <Button variant="primary" size="lg" className="group shadow-lg" onClick={() => handleEnrollClick("Quiz Participation", { duration: "Monthly" })}>
                <PlayCircle size={20} className="mr-2 group-hover:scale-110 transition-transform" /> Register for Quiz Now
              </Button>
            </div>

            <div className="md:w-1/2 relative z-10">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h4 className="font-bold text-slate-800 text-lg">📝 Sample Case Study Format</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h5 className="font-bold text-primary text-sm mb-1">Q: Multiple Choice Question</h5>
                    <p className="text-slate-600 text-sm italic">Designed to test deeper understanding, interpretation, and application of forensic principles.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h5 className="font-bold text-primary text-sm mb-1">Q: Short Answer Question</h5>
                    <p className="text-slate-600 text-sm italic">Focused on key factual and conceptual aspects of the case.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 5. BLOG SECTION */}
      <section className="py-24 bg-slate-50">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Forensic Insights</h2>
              <div className="w-20 h-1.5 bg-accent rounded-full mb-4"></div>
              <p className="text-slate-600 max-w-2xl text-lg">Stay updated with our latest case studies, research articles, and field notes from the experts.</p>
            </div>
            <a href="https://forensictalents.blogspot.com/?m=1" target="_blank" rel="noopener noreferrer" className="shrink-0">
              <Button variant="outline" size="lg" className="group bg-white border-slate-300 hover:border-primary text-slate-800 font-bold">
                View More Blogs <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Card 1 */}
            <a href="https://forensictalents.blogspot.com/2026/02/virtospy-digital-autopsy-that-lets-dead.html?m=1" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img src="/images/banners/services_banner.png" alt="Blog Post" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Technology</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">Virtopsy: Digital Autopsy That Lets the Dead Speak</h3>
                <p className="text-slate-600 mb-6 flex-grow line-clamp-3">An emerging non-invasive post-mortem technique leveraging 3D imaging technology to examine bodies without traditional dissection.</p>
                <div className="text-accent font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Blog Card 2 */}
            <a href="https://forensictalents.blogspot.com/2026/02/the-silent-witness-comprehensive-guide.html?m=1" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img src="/images/services/crime-scene.png" alt="Blog Post" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Guide</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">The Silent Witness: Comprehensive Guide</h3>
                <p className="text-slate-600 mb-6 flex-grow line-clamp-3">Understanding the vital role of physical evidence and silent clues in solving and building robust criminal investigations.</p>
                <div className="text-accent font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Blog Card 3 */}
            <a href="https://forensictalents.blogspot.com/2025/05/forensic-linguistics-where-language.html?m=1" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col h-full md:hidden lg:flex">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img src="/images/services/questioned-documents.png" alt="Blog Post" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Linguistics</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">Forensic Linguistics: Where Language Meets Law</h3>
                <p className="text-slate-600 mb-6 flex-grow line-clamp-3">Exploring how language, speech patterns, and textual analysis can be used as critical evidence in legal proceedings and interrogations.</p>
                <div className="text-accent font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

          </div>
        </Container>
      </section>

      {/* Enroll Modal (Kept unchanged structurally to preserve functionality) */}
      {enrollModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-primary">Enrollment Request</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">{enrollModal.course?.category} - {enrollModal.course?.prog.duration}</p>
              </div>
              <button onClick={() => { setEnrollModal({ isOpen: false, course: null }); setStatus(''); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
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
                    <Button type="button" variant="outline" onClick={() => { setEnrollModal({ isOpen: false, course: null }); setStatus(''); }} className="border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</Button>
                    <Button type="submit" variant="primary" disabled={status === 'loading'} className="flex items-center gap-2 shadow-lg hover:shadow-xl">
                      {status === 'loading' ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
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
