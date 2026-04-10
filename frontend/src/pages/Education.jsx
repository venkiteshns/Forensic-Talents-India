import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BookOpen, Award, Briefcase, GraduationCap, Clock, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Education() {
  const courses = [
    {
      category: "Fingerprint Analysis",
      icon: <FingerprintIcon />,
      programs: [
        { duration: "1 Week Certificate Course", price: "1500 - 2000", topics: ["History & Principles", "Fingerprint Patterns", "Development & Lifting", "ACE-V Method Basics"] },
        { duration: "1 Month Certificate Course", price: "3500 - 5000", topics: ["Composition of Sweat", "Surfaces & Print Types", "Latent Fingerprints", "Advanced Modern Applications"] }
      ]
    },
    {
      category: "Handwriting & Signature Analysis",
      icon: <FileSignatureIcon />,
      programs: [
        { duration: "1 Week Certificate Course", price: "Contact us", topics: ["Handwriting Characteristics", "Forgeries & Alterations", "Paper & Ink Analysis", "Security Features"] },
        { duration: "1 Month Certificate Course", price: "Contact us", topics: ["Types of Handwritings", "Art Forgery Detection", "Electronic Signatures", "Court Testimony Prep"] }
      ]
    },
    {
      category: "Cyber Forensics",
      icon: <MonitorIcon />,
      programs: [
        { duration: "1 Week Certificate Course", price: "Contact us", topics: ["Digital Evidence Handling", "Windows Forensics Basics", "Network & Email Forensics"] },
        { duration: "1 Month Certificate Course", price: "Contact us", topics: ["Malware & Dark Web", "Cloud Forensics", "Password Cracking", "Investigation Toolkits"] }
      ]
    },
    {
      category: "Crime Scene Management",
      icon: <SearchIcon />,
      programs: [
        { duration: "1 Week Certificate Course", price: "Contact us", topics: ["Securing the Scene", "Search Methods", "Collection & Packaging", "Chain of Custody"] },
        { duration: "1 Month Certificate Course", price: "Contact us", topics: ["Crime Scene Reconstruction", "BNSS Procedures", "Criminal Trial Support", "Advanced Evaluation"] }
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
      <section className="bg-primary text-white py-16 text-center">
        <Container>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Education & Training Programs</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Industry-oriented forensic science training designed to provide both theoretical knowledge and practical exposure by top-tier experts.
          </p>
        </Container>
      </section>

      {/* Courses */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 p-6 border-b flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-lg shadow">
                    {cat.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-primary">{cat.category}</h2>
                </div>
                <div className="p-6 divide-y divide-slate-100">
                  {cat.programs.map((prog, pIdx) => (
                    <div key={pIdx} className="py-6 first:pt-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Clock size={18} className="text-accent" /> {prog.duration}
                        </h3>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 border border-green-200">
                          <IndianRupee size={14} /> {prog.price}
                        </span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                        {prog.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
                  <Briefcase className="text-accent" /> Internship Opportunities
                </h2>
                <p className="text-slate-300 mb-6 relative z-10 leading-relaxed">
                  We provide exclusive internship programs where students can work on real or simulated forensic cases, gain field-level experience, enhance practical investigation skills, and build professional confidence.
                </p>
                <ul className="space-y-2 mb-8 text-slate-200 relative z-10">
                  <li className="flex items-center gap-2"><GraduationCap size={16}/> Offline classroom training</li>
                  <li className="flex items-center gap-2"><GraduationCap size={16}/> Live demonstrations</li>
                  <li className="flex items-center gap-2"><GraduationCap size={16}/> Access to leading forensic tools</li>
                </ul>
                <Button variant="accent" size="lg" className="w-full relative z-10 text-primary">
                  <Link to="/contact">Enroll Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

// Icon Components (local to avoid massive imports)
function FingerprintIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12C2 17.5 6.5 22 12 22a9.7 9.7 0 0 0 3-.5"/><path d="M21.5 12A9.5 9.5 0 0 0 12 2.5a9.5 9.5 0 0 0-9.5 9.5"/><path d="M5.5 12a6.5 6.5 0 0 1 13 0"/><path d="M18.5 12a6.5 6.5 0 0 0-13 0"/><path d="M8.5 12a3.5 3.5 0 0 1 7 0"/><path d="M15.5 12a3.5 3.5 0 0 0-7 0"/><path d="M11 12h2"/></svg> }
function FileSignatureIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M14.5 18 19 13v-3.5L14.5 5 10 9.5V13"/><path d="M4 22h14"/><path d="M7 13v5M11 13v5"/></svg> }
function MonitorIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg> }
function SearchIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> }
