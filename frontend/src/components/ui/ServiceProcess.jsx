import React from 'react';
import { MessageSquare, Search, FileSearch, Beaker, Scale } from 'lucide-react';
import { Container } from './Container';

const defaultSteps = [
  {
    title: "Enquiry & Consultation",
    desc: "Submit your case via website, phone, email, or WhatsApp",
    icon: MessageSquare
  },
  {
    title: "Case Evaluation",
    desc: "Experts assess the case and determine required forensic approach",
    icon: Search
  },
  {
    title: "Evidence / Data Collection",
    desc: "Relevant documents, samples, or data collected securely",
    icon: FileSearch
  },
  {
    title: "Scientific Analysis / Execution",
    desc: "Detailed forensic examination using validated methodologies",
    icon: Beaker
  },
  {
    title: "Certified Report / Outcome",
    desc: "Court-admissible report or professional outcome delivered",
    icon: Scale
  }
];

const serviceOverrides = {
  'pcc': {
    2: { title: "Document submission & verification", desc: "Relevant documents collected and verified" },
    3: { title: "Background validation process", desc: "Thorough background checks conducted" },
    4: { title: "Certificate issuance", desc: "Official clearance certificate delivered" }
  },
  'questioned-documents': {
    2: { title: "Handwriting / signature sample", desc: "Sample collection and secure gathering" },
    3: { title: "Laboratory comparison", desc: "Scientific analysis and comparison in lab" },
    4: { title: "Authenticity verification report", desc: "Court-admissible verification report delivered" }
  },
  'fingerprint': {
    2: { title: "Fingerprint recording / lifting", desc: "Secure collection of fingerprint evidence" },
    3: { title: "Pattern analysis", desc: "Detailed scientific pattern comparison" },
    4: { title: "Identification report", desc: "Court-admissible identification report delivered" }
  },
  'cyber': {
    2: { title: "Digital evidence collection", desc: "Secure acquisition of digital devices and data" },
    3: { title: "Data recovery & cyber analysis", desc: "In-depth technical forensic analysis" },
    4: { title: "Technical forensic report", desc: "Court-admissible digital findings report delivered" }
  },
  'crime-scene': {
    2: { title: "On-site investigation", desc: "Expert team deployment to the scene" },
    3: { title: "Evidence documentation & preservation", desc: "Secure evidence handling and logging" },
    4: { title: "Scene reconstruction report", desc: "Detailed scene analysis and reconstruction" }
  },
  'polygraph': {
    2: { title: "Subject preparation", desc: "Pre-test interview and psychological setup" },
    3: { title: "Controlled testing procedure", desc: "Physiological monitoring and questioning" },
    4: { title: "Behavioral analysis report", desc: "Professional outcome and findings delivered" }
  },
  'workplace-assessments': {
    1: { title: "Case briefing & internal review", desc: "Experts assess the organizational context" },
    2: { title: "Employee / environment analysis", desc: "Relevant behavioral data collected securely" },
    3: { title: "Risk & integrity assessment", desc: "Detailed psychological and risk evaluation" },
    4: { title: "Assessment report", desc: "Professional assessment outcome delivered" }
  },
  'forensic-training': {
    1: { title: "Program enrollment", desc: "Register for specialized forensic courses" },
    2: { title: "Structured training modules", desc: "Comprehensive academic curriculum" },
    3: { title: "Hands-on practical exposure", desc: "Real-world forensic scene scenarios" },
    4: { title: "Certification", desc: "Professional certification delivered" }
  },
  'cross-examination': {
    1: { title: "Case file review", desc: "Detailed study of existing case files and expert preparation" },
    2: { title: "Evidence interpretation", desc: "Scientific review and opinion framing" },
    3: { title: "Courtroom support", desc: "Strategic cross-examination support during trial" },
    4: { title: "Expert testimony", desc: "Court-admissible expert testimony and clarification" }
  }
};

export default function ServiceProcess({ serviceId }) {
  const overrides = serviceOverrides[serviceId] || {};
  
  const steps = defaultSteps.map((step, index) => {
    if (overrides[index]) {
      return { ...step, ...overrides[index] };
    }
    return step;
  });

  return (
    <div className="bg-slate-50 py-20 border-b border-slate-100">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800">Forensic Service Process</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">A structured, scientific approach ensuring absolute accuracy, confidentiality, and legal admissibility at every step.</p>
        </div>

        <div className="max-w-5xl mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Vertical Connector Line */}
          <div className="absolute left-[35px] md:left-1/2 top-4 bottom-4 w-px bg-slate-200 md:-translate-x-1/2"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0; // index 0, 2, 4 -> Left side
            const stepNumber = String(index + 1).padStart(2, '0');

            return (
              <div 
                key={index} 
                className={`group relative flex flex-col md:flex-row items-start md:items-center mb-12 last:mb-0 w-full ${!isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon Marker */}
                <div className="absolute left-[35px] md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm z-10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  <Icon size={24} strokeWidth={1.5} className="transition-colors duration-300 ease-in-out" />
                </div>

                {/* Card Container */}
                <div className={`w-full md:w-1/2 pl-[84px] md:pl-0 ${isEven ? 'md:pr-14' : 'md:pl-14'}`}>
                  {/* The Card */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-transparent shadow-sm hover:shadow-md hover:border-slate-200 transform-gpu transition-all duration-300 ease-out hover:-translate-y-1.5 relative overflow-hidden block">
                    
                    {/* Subtle Background Step Number */}
                    <div className="absolute -top-6 -right-4 text-slate-50 font-heading font-bold text-[100px] select-none pointer-events-none group-hover:text-slate-100 transition-colors duration-300 leading-none">
                      {stepNumber}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10 tracking-tight">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed relative z-10">{step.desc}</p>
                  </div>
                </div>

                {/* Empty Space for alternate layout */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto border-t border-slate-200 pt-8 animate-in fade-in duration-700 delay-300">
          <p className="text-sm md:text-base font-medium text-slate-600">
            All reports and expert opinions are prepared in accordance with legal standards and are admissible in courts across India and abroad.
          </p>
        </div>
      </Container>
    </div>
  );
}
