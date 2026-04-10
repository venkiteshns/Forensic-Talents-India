import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowRight, Shield, Search, FileText, Fingerprint, Monitor, Scale } from 'lucide-react';
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
            <div key={srv.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
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
