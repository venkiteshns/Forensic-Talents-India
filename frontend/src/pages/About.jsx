import { Container } from '../components/ui/Container';
import { Target, Eye, ShieldCheck, CheckCircle2, Users } from 'lucide-react';

export default function About() {
  const offerings = [
    "Questioned Document Examination",
    "Handwriting and Signature Analysis",
    "Fingerprint Examination",
    "Cyber Forensics",
    "Forensic Psychology",
    "Legal and Forensic Consultancy"
  ];

  const clients = [
    "Legal professionals and advocates",
    "Government agencies & law enforcement",
    "Banks and financial institutions",
    "Insurance companies",
    "Corporate entities",
    "Private individuals"
  ];

  const whyChooseUs = [
    "Highly trained & experienced forensic experts",
    "Court-admissible reports (Sec 45 IEA / Sec 39 BSA)",
    "Extensive courtroom cross-examination support",
    "State-of-the-art ethical methodologies",
    "Strict confidentiality and data security"
  ];

  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <section className="bg-primary pt-20 pb-16 text-center shadow-inner">
        <Container>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">About Forensic Talents India</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            A distinguished and forward-thinking organization dedicated to delivering scientifically precise, ethically grounded forensic solutions.
          </p>
        </Container>
      </section>

      {/* Intro & Legal Validity */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">Our Organization</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We operate at the critical intersection of science, law, and technology. Our vision is to bridge the longstanding gap between scientific analysis and legal interpretation, strengthening the justice delivery system.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Forensic science is the application of scientific principles for law. We ensure every conclusion is scientifically valid and legally defensible using modern forensic instruments and standardized methodologies.
              </p>
              <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-accent">
                <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-accent" /> Legal Validity
                </h3>
                <p className="text-sm text-slate-700">
                  Our expert opinions are provided under Section 39 of the Bharatiya Sakshya Adhiniyam, 2023 (Section 45 of the Indian Evidence Act). These hold significant evidentiary value in India and abroad, assisting judges and legal professionals.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-6 rounded-xl flex flex-col items-center text-center">
                <Target size={40} className="text-primary mb-4" />
                <h4 className="font-bold text-primary mb-2">Our Mission</h4>
                <p className="text-sm text-slate-600">To provide undeniable scientific truth that solidifies legal strength in courts.</p>
              </div>
              <div className="bg-primary/5 p-6 rounded-xl flex flex-col items-center text-center transform translate-y-6">
                <Eye size={40} className="text-accent mb-4" />
                <h4 className="font-bold text-primary mb-2">Our Vision</h4>
                <p className="text-sm text-slate-600">To establish a comprehensive, trusted one-stop solution for all investigations.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Do & Why Choose Us */}
      <section className="py-16 bg-secondary-light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Offerings */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <ShieldCheck className="text-accent" /> What We Do
              </h3>
              <ul className="space-y-4">
                {offerings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Why Choose Us */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Users className="text-accent" /> Why Choose Us
              </h3>
              <ul className="space-y-4">
                {whyChooseUs.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={20} className="text-accent mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Clients */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-heading font-bold text-primary mb-10 text-center">Who We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {clients.map((client, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-lg text-center hover:bg-primary hover:text-white transition-colors duration-300">
                <p className="font-medium">{client}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
