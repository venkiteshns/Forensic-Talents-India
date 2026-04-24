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
    <div className="bg-slate-50 py-16 border-b border-slate-100">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-slate-800">Forensic Service Process</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
          {/* Connectors (Desktop only) */}
          <div className="hidden lg:block absolute top-[48px] left-0 w-full h-0.5 bg-slate-200 -z-0"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex-1 bg-white hover:bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-in-out relative z-10 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center mb-6 border-2 border-primary/20 shadow-sm mx-auto relative z-10">
                  <Icon size={40} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-medium text-slate-800 mb-3 leading-snug">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center max-w-3xl mx-auto border-t border-slate-200 pt-8">
          <p className="text-sm md:text-base font-medium text-slate-600">
            All reports and expert opinions are prepared in accordance with legal standards and are admissible in courts across India and abroad.
          </p>
        </div>
      </Container>
    </div>
  );
}
