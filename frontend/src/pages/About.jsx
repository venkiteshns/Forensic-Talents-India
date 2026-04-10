import { Container } from '../components/ui/Container';
import { Target, Eye, ShieldCheck, CheckCircle2, Users } from 'lucide-react';

export default function About() {
  const offerings = [
    { title: "Questioned Document Examination (QDE)", desc: "Scientific analysis of disputed documents to determine authenticity, alterations, forgery, or fabrication." },
    { title: "Handwriting and Signature Analysis", desc: "Detailed examination of writing characteristics to establish authorship or detect forgery." },
    { title: "Fingerprint Examination", desc: "Identification and comparison of fingerprint impressions for personal identification and crime investigation." },
    { title: "Cyber Forensics", desc: "Recovery, preservation, and analysis of digital evidence from electronic devices and online platforms." },
    { title: "Forensic Psychology", desc: "Behavioral analysis, profiling, and psychological assessment relevant to criminal and civil cases." },
    { title: "Legal and Forensic Consultancy", desc: "Strategic guidance to legal professionals based on scientific findings." }
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
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/about_banner.png" alt="About Forensic Talents" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">About Forensic Talents India</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            A distinguished and forward-thinking organization dedicated to delivering scientifically precise, ethically grounded forensic solutions. We bridge the critical gap between complex forensic science and the steadfast pursuit of justice, bringing absolute clarity to every investigation.
          </p>
        </Container>
      </section>

      {/* About & Welcome Details */}
      <section className="py-20 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">Welcome to Forensic Talents India</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Forensic Talents India stands as a distinguished and forward-thinking organization in the domain of forensic science and investigation, dedicated to delivering scientifically precise, ethically grounded, and legally admissible forensic solutions. The organization was established with a clear and purposeful vision—to bridge the longstanding gap between scientific analysis and legal interpretation, thereby strengthening the justice delivery system.
                </p>
                <p>
                  In an era where the complexity of crimes and disputes is constantly evolving, the need for accurate forensic intervention has become more critical than ever. Recognizing this demand, Forensic Talents India operates at the intersection of science, law, and technology, offering multidisciplinary expertise that supports both investigative processes and judicial outcomes.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-accent shadow-sm my-6">
                  <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-accent" /> Evidentiary Legal Value
                  </h3>
                  <p className="text-sm text-slate-700">
                    The organization provides expert opinions under <strong>Section 39 of the Bharatiya Sakshya Adhiniyam, 2023</strong>, which corresponds to <strong>Section 45 of the Indian Evidence Act</strong>. These expert opinions hold significant evidentiary value in courts, assisting judges and legal professionals in understanding technical aspects of evidence.
                  </p>
                </div>
                <p>
                  Additionally, the organization specializes in examining critical legal and financial documents, such as wills, property deeds, agreements, cheques, affidavits, certificates, contracts, and other disputed materials. Each case is handled with methodical precision, scientific rigor, and legal awareness, ensuring dependable outcomes.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-primary mb-4">About Us</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-2 border-slate-200 pl-4">
                  Forensic science is fundamentally defined as “the application of scientific principles and techniques for the purpose of law.” It plays an indispensable role in modern justice systems by enabling the objective discovery of truth through evidence-based analysis.
                </p>
                <div className="space-y-4">
                  <p className="font-bold text-slate-800 text-sm">This principle is translated into practice through the integration of:</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Advanced analytical techniques</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Modern forensic instruments</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Standardized methodologies</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Continuous research and innovation</li>
                  </ul>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The organization is driven by a team of highly qualified, experienced, and specialized forensic professionals. Their work is guided by accuracy, impartiality, and adherence to legal standards, ensuring that every conclusion is scientifically valid and fully admissible during legal scrutiny and cross-examinations.
                  </p>
                </div>
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
                    <CheckCircle2 size={20} className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm leading-relaxed"><strong className="text-slate-800">{item.title}:</strong> {item.desc}</span>
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
