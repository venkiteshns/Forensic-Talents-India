import { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { BookOpen, Clock, IndianRupee, ChevronDown, ChevronUp, CheckCircle, Globe, MapPin, Fingerprint, Monitor, Search, PenTool } from 'lucide-react';
import { EnrollModal } from '../../components/education/EnrollModal';
import { PageIntro, AdvantagesList, WhyChooseUs } from '../../components/education/SharedSections';

export default function Certificates() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleDetails = (id) => {
    setExpandedProgram(expandedProgram === id ? null : id);
  };

  const handleEnrollClick = (category, prog) => {
    setEnrollModal({ isOpen: true, course: { category, prog } });
  };

  const courses = [
    {
      category: "Fingerprint Analysis",
      icon: <Fingerprint size={28} />,
      programs: [
        {
          id: "fingerprint-1-week",
          duration: "1 Week Certificate Course",
          price: "1500 - 2000",
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
          price: "3500 - 5000",
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
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/education_banner.png" alt="Certificates Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Certificate Courses
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
              Specialized programs crafted by industry experts to advance your forensic career with practical, hands-on knowledge.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro & Advantages */}
      <PageIntro
        title="Structured Forensic Learning"
        text="We offer a structured progression of forensic learning—from foundational principles to advanced analytical techniques. Our certificate courses cover essential domains including Fingerprint Analysis, Cyber Forensics, Handwriting Examination, and Crime Scene Management, expertly designed to turn theoretical knowledge into practical expertise."
      />
      <AdvantagesList
        title="Key Advantages"
        items={[
          "Practical exposure to forensic techniques",
          "Structured curriculum designed by experts",
          "Real-world case relevance",
          "Certification for professional credibility"
        ]}
      />

      {/* Course List */}
      <section className="py-8 relative z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden group hover:border-accent/50 transition-colors duration-300">
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



      <EnrollModal
        isOpen={enrollModal.isOpen}
        course={enrollModal.course}
        onClose={() => setEnrollModal({ isOpen: false, course: null })}
      />
    </div>
  );
}
