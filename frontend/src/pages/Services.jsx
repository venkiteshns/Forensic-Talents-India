import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowRight, Shield, Search, FileText, Fingerprint, Monitor, Scale, UserSearch } from 'lucide-react';
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
      id: 'detective', 
      title: 'Detective Services', 
      desc: 'Discreet, professional investigative services for both businesses and individuals to uncover the truth.', 
      icon: <UserSearch size={32} /> 
    },
  ];

  return (
    <div className="bg-secondary-light min-h-[calc(100vh-88px)] py-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Our Forensic Services</h1>
          <p className="text-slate-600 text-lg">
            We provide specialized scientific assistance across various domains. Click on a service to see a detailed breakdown of our process and offerings.
          </p>
        </div>

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
