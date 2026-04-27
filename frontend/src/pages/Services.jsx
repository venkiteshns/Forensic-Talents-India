import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowRight, Shield, Search, FileText, Fingerprint, Monitor, Scale, Activity, Users, GraduationCap, Leaf, Landmark } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Services() {
  const servicesList = [
    {
      id: 'pcc',
      title: 'Police Clearance Certificate',
      desc: 'Expert assistance in securing a Police Clearance Certificate securely, ensuring error-free fingerprints and accurate applications.',
      icon: <Shield size={32} />
    },
    {
      id: 'questioned-documents',
      title: 'Questioned Documents Examination',
      desc: 'Determine authenticity, trace authorship, and detect alterations or forgeries using advanced scientific tools.',
      icon: <FileText size={32} />
    },
    {
      id: 'fingerprint',
      title: 'Fingerprint Investigation',
      desc: 'Reliable forensic identification based on unique ridge patterns, including latent fingerprint development and enhancement.',
      icon: <Fingerprint size={32} />
    },
    {
      id: 'cyber',
      title: 'Cyber Forensics',
      desc: 'Recovery, preservation, and analysis of digital evidence. Tackle data breaches, cyber fraud, and trace digital activities.',
      icon: <Monitor size={32} />
    },
    {
      id: 'crime-scene',
      title: 'Crime Scene Investigation',
      desc: 'Systematic examination, documentation, and scientific analysis of crime scenes to collect critical physical evidence.',
      icon: <Search size={32} />
    },
    {
      id: 'cross-examination',
      title: 'Forensic Cross Examination',
      desc: 'Critical evaluation and questioning of opposing forensic evidence and expert reports for courtroom accuracy.',
      icon: <Scale size={32} />
    },
    {
      id: 'polygraph',
      title: 'Polygraph Examination',
      desc: 'Accurately assess truthfulness with advanced physiological monitoring and expert analysis for critical investigations.',
      icon: <Activity size={32} />
    },
    {
      id: 'workplace-assessments',
      title: 'Workplace Assessments',
      desc: 'Scientific evaluation of workforce behavior, psychological risks, and performance using forensic methodologies for organizational decision-making.',
      icon: <Users size={32} />
    },
    {
      id: 'forensic-training',
      title: 'Professional Forensic Training & Capacity Building',
      desc: 'Advanced, research-based forensic training programs designed for legal, corporate, and investigative professionals.',
      icon: <GraduationCap size={32} />
    },
    {
      id: 'environmental',
      title: 'Environmental Forensics',
      desc: 'Identifying pollution sources and environmental damages through advanced scientific analysis and site assessment.',
      icon: <Leaf size={32} />
    },
    {
      id: 'financial',
      title: 'Financial Forensic Investigations',
      desc: 'Detecting, analyzing, and preventing financial fraud and irregularities to maintain financial integrity.',
      icon: <Landmark size={32} />
    },
  ];

  return (
    <div className="bg-secondary-light min-h-[calc(100vh-88px)] pb-20">
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/services_banner.png" alt="Forensic Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Our Forensic Services</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            We provide specialized, legally sound scientific assistance across fundamentally critical domains. Explore our comprehensive portfolio below to view detailed breakdowns of our methodologies and forensic analysis processes.
          </p>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv) => (
            <div key={srv.id} className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-primary overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 ease-out group">
              <div className="p-8 flex-grow">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                  {srv.icon}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{srv.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed flex-grow">{srv.desc}</p>
              </div>
              <div className="px-8 pb-8 mt-auto">
                <Button variant="secondary" className="w-full justify-between group">
                  <Link to={`/services/${srv.id}`} className="flex justify-between w-full items-center">
                    View Details
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
