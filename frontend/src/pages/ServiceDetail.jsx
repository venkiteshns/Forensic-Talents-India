import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, FileText, Fingerprint, Shield, Link as LinkIcon, BadgeCheck, Search, Database, MessageSquare, Mail, MapPin, Mic, HardDrive, Scale, History, Camera, GitCompare, ShieldAlert, Beaker, ClipboardList, Eye, Landmark, UserCheck, Scan, PenTool, FileSearch, FileEdit, FileQuestion, Droplet, Award, Activity, Users, Monitor, BrainCircuit, Lightbulb, Target, Briefcase, GraduationCap, BookOpen, LineChart } from 'lucide-react';
import extractedData from '../data/extracted_docs.json';

import { serviceDetails } from '../data/serviceDetails';
import FAQAccordion from '../components/ui/FAQAccordion';
import ServiceProcess from '../components/ui/ServiceProcess';

// Utility to parse extracted Word text safely
function parseContent(text) {
  if (!text) return { intro: '', features: [], process: [] };
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Basic heuristic parsing since it's raw text
  const intro = lines.slice(1, 4).join(' '); // Skip title

  const features = [];
  const process = [];
  let currentSection = '';

  for (let i = 4; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Our Services Include') || line.includes('Services Our Organization Provides')) {
      currentSection = 'features';
      continue;
    } else if (line.includes('FAQs') || line.includes('Benefits of Our Services')) {
      break;
    }

    if (currentSection === 'features') {
      if (line.includes(':')) {
        const parts = line.split(':');
        features.push({ title: parts[0], details: parts[1].trim() ? [parts[1].trim()] : [] });
      } else if (line.length > 50) {
        if (features.length > 0) {
          features[features.length - 1].details.push(line);
        }
      } else if (line.length > 0) {
        features.push({ title: line, details: [] });
      }
    }
  }

  return { intro, features, process };
}

export default function ServiceDetail() {
  const { id } = useParams();
  const [showAcademicOutcome, setShowAcademicOutcome] = useState(false);

  const serviceInfo = serviceDetails[id];

  if (!serviceInfo) {
    return <Navigate to="/services" replace />;
  }

  const rawText = extractedData[serviceInfo.file] || '';
  const parsed = parseContent(rawText);

  return (
    <div className="bg-white min-h-[calc(100vh-88px)]">
      <div
        className="text-white py-12 md:py-24 relative bg-primary bg-cover bg-center border-b border-primary/20"
        style={{ backgroundImage: `url('/images/services/${id}.png')` }}
      >
        <div className="absolute inset-0 bg-slate-900/85"></div>
        
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Link 
            to="/services"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium backdrop-blur-md shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Services
          </Link>
        </div>

        <Container className="relative z-10 pt-10">
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white drop-shadow-md">{serviceInfo.title}</h1>
          <p className="text-slate-200 text-xl max-w-3xl leading-relaxed drop-shadow">{serviceInfo.catchyIntro}</p>
        </Container>
      </div>

      <ServiceProcess serviceId={id} />

      {id !== 'forensic-training' && id !== 'workplace-assessments' && (
        <Container className="py-16">
          <div className="max-w-4xl">
            {id === 'fingerprint' && (
              <div className="mb-12 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-primary">
                <h3 className="text-xl font-bold text-primary mb-3">Expert Legal Validity</h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  We provide complete solutions in fingerprint examination matters, and our expert opinion is acceptable under <span className="font-semibold text-primary">Section 39 of the Bharatiya Sakshya Adhiniyam, 2023</span> (formerly Section 45 of the Indian Evidence Act) by all the Courts of India and abroad. We are pleased to support you, whenever you need our services.
                </p>
              </div>
            )}

            <h2 className="text-3xl font-heading font-bold text-primary mb-8 border-b pb-4">Key Offerings</h2>
            {parsed.features.length > 0 ? (
              <div className="space-y-8">
                {parsed.features.map((feat, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-lg border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-start gap-2">
                      <CheckCircle2 className="text-accent flex-shrink-0 mt-1" size={20} />
                      {feat.title.replace('Our Services Include', '')}
                    </h3>
                    {feat.details && feat.details.length > 0 ? (
                      <ul className="text-slate-600 leading-relaxed ml-8 list-disc space-y-2">
                        {feat.details.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-600 leading-relaxed ml-7">
                        Specialized forensic handling tailored to case requirement.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 italic">Detailed service breakdown allows us to provide scientifically accurate testing and expert opinions verified under Section 39 of the Bharatiya Sakshya Adhiniyam, 2023.</p>
            )}
          </div>
        </Container>
      )}

      {/* PCC Specific Custom Section */}
      {id === 'pcc' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">

            {/* Benefits of Our Services Section */}
            <div className="mb-20">
              <h3 className="text-3xl font-heading font-bold text-primary mb-8 border-b pb-4">Why Choose Us?</h3>
              <div className="space-y-4">

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Benefits of Our Services</h4>
                    <p className="text-slate-600">Specialized forensic handling tailored to case requirement.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Accurate and Error-Free Fingerprint Submission</h4>
                    <p className="text-slate-600">We ensure high-quality fingerprint capture and proper documentation, minimizing the chances of rejection.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Faster Processing Support</h4>
                    <p className="text-slate-600">Our expertise helps in reducing delays by ensuring correct application and submission from the beginning.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">End-to-End Guidance for Documentation</h4>
                    <p className="text-slate-600">We provide complete support from start to finish, making the process simple and stress-free.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-start gap-4">
                  <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Confidential and Secure Handling</h4>
                    <p className="text-slate-600">All personal information and documents are handled with strict confidentiality and professionalism.</p>
                  </div>
                </div>

              </div>
            </div>

            <h2 className="text-3xl font-heading font-bold text-primary mb-2">Streamlined Fingerprint Services for Your Visa and Immigration Needs</h2>
            <p className="text-slate-600 mb-10 text-lg">
              We offer a convenient one-stop solution to assist you with the fingerprint requirements for your visa and immigration applications. Our services encompass:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Fingerprint size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Fingerprint capture on designated cards</h3>
                </div>
                <p className="text-slate-600">
                  We handle fingerprints for various destinations, including <span className="font-semibold text-primary">Australia, UK, Nigeria, South Africa</span>, using the appropriate cards like <span className="font-semibold text-primary">FD-258 and C-216C</span>.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">RCMP fingerprints for Canada (& Other Services)</h3>
                </div>
                <p className="text-slate-600">
                  In addition to visa fingerprints, we assist with RCMP fingerprints for Canada, FBI Police Clearance certificates, and PCCs from <span className="font-semibold text-primary">Singapore, Thailand, Dubai, Oman</span>.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Error-free fingerprint capture</h3>
                </div>
                <p className="text-slate-600">
                  We ensure accurate and <span className="font-semibold text-primary">ZERO Error result</span> fingerprint capturing to avoid delays in your application process and guarantee acceptance.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <BadgeCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">MEA fingerprint attestation (if applicable)</h3>
                </div>
                <p className="text-slate-600">
                  For certain destinations, we can also handle the attestation of your fingerprints by the Ministry of External Affairs (MEA) for enhanced validity.
                </p>
              </div>
            </div>

            <div className="mb-16 bg-slate-50 p-8 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="text-accent" /> Additional Specialized Needs
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We also provide specialized fingerprinting aimed towards obtaining a <span className="font-semibold text-primary">Physiotherapy License</span> for states within the USA, including <span className="font-semibold text-primary">Michigan, New York, Florida, Nebraska, and Louisiana</span>.
              </p>
            </div>



            {/* Application Forms Section */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <LinkIcon size={24} className="text-accent" /> Official PCC Application Forms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <a href="https://www.edo.cjis.gov/#/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">USA PCC (FBI)</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="https://rcmp.ca/en" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">Canada PCC (RCMP)</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="https://www.acro.police.uk/s/acro-services/police-certificates/police-certificates-form" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">UK PCC (ACRO)</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="https://service.upf.go.ug/Register.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">Uganda PCC</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="https://www.cid.go.ke/index.php/services/police-clearance-certificate.html" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">Kenya PCC</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </Container>
      )}

      {/* Cyber Forensics Specific Custom Section */}
      {id === 'cyber' && (
        <Container className="py-16 border-t border-slate-100">
          {/* Legal Validity & Digital Evidence Compliance Section */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-6 md:p-8 mb-12 shadow-sm flex flex-col md:flex-row items-start gap-6 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md animate-fade-in-up">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-full flex-shrink-0 mt-1">
              <Scale size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Legal Validity & Digital Evidence Compliance</h3>
              <p className="text-slate-800 font-semibold text-lg mb-4 leading-snug">
                The reports and analysis are conducted under Cyber Forensics & Digital Investigation standards, with a strong focus on Section 63(4)(c) of the Bharatiya Sakshya Adhiniyam (BSA), formerly Section 65B of the Indian Evidence Act.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed">
                This legal provision governs the admissibility of electronic evidence in courts. It ensures that digital records such as emails, documents, audio, video, and system data are considered valid evidence only when properly certified and handled according to prescribed procedures.
              </p>
              <p className="text-slate-700 font-medium border-t border-blue-200/60 pt-4">
                This ensures that all forensic findings are legally valid, reliable, and admissible in judicial proceedings.
              </p>
            </div>
          </div>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 text-center">Our Cyber Forensics Services</h2>
            <p className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              We leverage cutting-edge technology and established methodologies to resolve complex digital puzzles and deliver actionable evidence.
            </p>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Digital Evidence Collection</h3>
                <p className="text-slate-600 leading-relaxed">Our team securely collects digital evidence from any device to support your case.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Database size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Recovery</h3>
                <p className="text-slate-600 leading-relaxed">We recover deleted or hidden data, providing crucial pieces for your investigation.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <MessageSquare size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Social Media Investigations</h3>
                <p className="text-slate-600 leading-relaxed">We discreetly investigate social media platforms (WhatsApp, Facebook, etc.) to uncover relevant information.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mail size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Email Tracking</h3>
                <p className="text-slate-600 leading-relaxed">Track the origin and path of emails to identify senders and recipients.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <MapPin size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">IP Address Tracing</h3>
                <p className="text-slate-600 leading-relaxed">Identify the location of suspicious online activity through IP address tracking.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mic size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Voice Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Verify voice alterations used in recordings to determine authenticity.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <HardDrive size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Data Retrieval</h3>
                <p className="text-slate-600 leading-relaxed">Recover lost data from damaged or formatted storage devices.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <BadgeCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Guidance</h3>
                <p className="text-slate-600 leading-relaxed">Our forensic consultants provide comprehensive analysis and clear explanations for legal proceedings.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scale size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Cross-Examination Support</h3>
                <p className="text-slate-600 leading-relaxed">We empower you to effectively challenge opposing expert testimony in court.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group lg:col-span-3 lg:w-1/3 lg:mx-auto">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors mx-auto">
                  <History size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">Digital Scene Reconstruction</h3>
                <p className="text-slate-600 leading-relaxed text-center">Piece together the digital timeline of events for a clear understanding of the crime.</p>
              </div>

            </div>
          </div>
        </Container>
      )}

      {/* Fingerprint Specific Custom Section */}
      {id === 'fingerprint' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 text-center">Fingerprint Identification and Analysis Services</h2>
            <p className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              We offer a comprehensive suite of fingerprint services to meet your needs, including:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scan size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fingerprint Recovery</h3>
                <p className="text-slate-600 leading-relaxed">We can develop fingerprints from various surfaces, including objects, documents, and photographs, using advanced techniques.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <GitCompare size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fingerprint Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Our experts can compare and match fingerprints to identify individuals or link them to a crime scene.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Camera size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Forensic Fingerprint Photography</h3>
                <p className="text-slate-600 leading-relaxed">We capture high-quality images of fingerprints for detailed examination and documentation.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Crime Scene processing</h3>
                <p className="text-slate-600 leading-relaxed">Our services include the development, lifting, and analysis of fingerprints found at crime scenes.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Examination for Documents</h3>
                <p className="text-slate-600 leading-relaxed">We analyze fingerprints on documents like wills, agreements, and contracts, providing expert opinions on their authenticity.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Comparison in Forgery Cases</h3>
                <p className="text-slate-600 leading-relaxed">We assist in forgery investigations by comparing fingerprints on suspect documents.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Beaker size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Development Techniques</h3>
                <p className="text-slate-600 leading-relaxed">We utilize various methods, including powders and chemicals, to develop latent (invisible or faint) fingerprints.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ClipboardList size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fingerprinting for Records</h3>
                <p className="text-slate-600 leading-relaxed">We take and record fingerprints for background checks, employment purposes, or other record-keeping needs.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Eye size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Latent Fingerprint Development</h3>
                <p className="text-slate-600 leading-relaxed">We have the expertise to develop faint or invisible fingerprints for identification purposes.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Landmark size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Examination on Legal Documents</h3>
                <p className="text-slate-600 leading-relaxed">We analyze fingerprints on legal documents such as wills, contracts, and property deeds, providing expert opinions in court.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group md:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <UserCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Witness Services</h3>
                <p className="text-slate-600 leading-relaxed">We provide forensic opinions on fingerprint comparisons for questioned or disputed documents in legal proceedings.</p>
              </div>

            </div>
          </div>
        </Container>
      )}

      {/* Questioned Documents Specific Custom Section */}
      {id === 'questioned-documents' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 text-center">Comprehensive Document Examination Services</h2>
            <p className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              We employ scientific methods and expert scrutiny to uncover forgery, verify authenticity, and establish the truth in questioned documents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <PenTool size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Handwritten Signature Forgery Detection</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Identifying if a signature has been forged through cutting and pasting or imitation.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileSearch size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Forensic Document Analysis</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Examining disputed or forged documents using photography and other techniques.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <BadgeCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Document Verification</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Confirming the authenticity of certificates, ID cards, and other critical credentials.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileEdit size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Handwriting Analysis</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Detecting alterations, substitutions, insertions, or deletions within handwriting.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">General Forgery Detection</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Identifying any type of forgery beyond handwriting, ensuring scientific clarity.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileQuestion size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Anonymous Document Examination</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Analyzing anonymous letters to potentially identify the author or source reliably.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Droplet size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Paper & Ink Analysis</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Determining the key characteristics of paper and ink used in a disputed document.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Award size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Certificate Authenticity</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Confirming the rigorous legitimacy and validity of professional certificates.</p>
              </div>

            </div>
          </div>
        </Container>
      )}

      {/* Polygraph Specific Custom Section */}
      {id === 'polygraph' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 text-center">Polygraph Examination Services</h2>
            <p className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              Our polygraph testing services evaluate truthfulness using advanced physiological monitoring, providing reliable insights for criminal investigations, corporate inquiries, and dispute resolution.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Lie Detection Testing</h3>
                <p className="text-slate-600 leading-relaxed">Evaluate truthfulness using physiological responses like heart rate, respiration, and skin conductivity during structured questioning.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileQuestion size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Pre-Test Interviews</h3>
                <p className="text-slate-600 leading-relaxed">Formulate careful, unbiased questions across relevant, control, and neutral categories to ensure highly accurate results.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Monitor size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Advanced Data Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Experts score and interpret complex charts with computer-assisted methods to eliminate bias and establish clear conclusions.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Criminal Investigations</h3>
                <p className="text-slate-600 leading-relaxed">Narrow down suspects and verify witness statements effectively to support major law enforcement and private investigations.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Employee Screening</h3>
                <p className="text-slate-600 leading-relaxed">Maintain organizational integrity by screening personnel for internal investigations involving misconduct, theft, or fraud.</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scale size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Reporting</h3>
                <p className="text-slate-600 leading-relaxed">Receive structured, meticulous reports detailing the methodology and conclusions, designed to assist legal and executive authorities.</p>
              </div>

            </div>
          </div>
        </Container>
      )}

      {/* Workplace Assessments Specific Custom Section */}
      {id === 'workplace-assessments' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4 text-center">Overview</h2>
            <p className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              The most complex variable in any organization is human behavior. Our Forensic Psychological Workplace Assessments provide organizations with a scientific, independent evaluation of the psychological and behavioral health of their workforce. By utilizing validated psychometric tools and forensic psychology principles, we help management look beneath the surface to identify behavioral risks, optimize cognitive performance, and ensure a secure, resilient, and ethically sound workplace.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <BrainCircuit size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Forensic Psychometric Profiling <br /> (Personality & Behavior)</h3>
                <p className="text-slate-600 leading-relaxed">Moving beyond standard personality quizzes, we utilize validated forensic tools to assess deep-seated behavioral traits, including emotional intelligence, risk tolerance, and susceptibility to unethical behavior. This is crucial for high-stakes hiring, leadership development, and identifying potential culture-clashes.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Lightbulb size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Cognitive & Behavioral Performance Analysis</h3>
                <p className="text-slate-600 leading-relaxed">We evaluate the psychological drivers behind employee performance. By assessing cognitive flexibility, decision-making capabilities under pressure, and problem-solving styles, we help organizations align the right psychological profiles with specific operational roles.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Activity size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Stress & Workload Assessment </h3>
                <p className="text-slate-600 leading-relaxed">Burnout is a profound organizational risk. We measure cognitive load and psychological resilience to ensure optimal resource allocation. This assessment helps prevent severe fatigue, reducing the risk of critical errors and safeguarding employee mental well-being.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Integrity & Counter-Productive Work Behavior (CWB) Audits</h3>
                <p className="text-slate-600 leading-relaxed">A specialized psychological evaluation designed to detect propensities for rule-breaking, insubordination, internal fraud, or hostility. This proactive screening protects your organization's assets and reputation from internal threats.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Leadership Competency & Succession Dynamics</h3>
                <p className="text-slate-600 leading-relaxed">An evidence-based psychological evaluation of future leaders, focusing on their capacity for empathy, strategic cognition, and crisis management, ensuring your organization’s future is in psychologically capable hands.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scale size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Workplace Conflict & Risk Escalation Assessment</h3>
                <p className="text-slate-600 leading-relaxed">When internal disputes arise, we provide an objective, psychological analysis of the individuals involved to determine the root cause of the conflict, the risk of escalation, and the most effective psychological interventions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Target className="text-accent" /> Strategic Value
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Predict behavioral risks early</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Legally defensible HR decisions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Improve operational resilience</span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Briefcase className="text-accent" /> Who Needs This
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Corporate leadership</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Legal professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">HR & compliance teams</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-accent mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Banking & high-security sectors</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-primary text-white p-8 md:p-12 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <Shield size={200} />
              </div>
              <h3 className="text-3xl font-heading font-bold mb-6 relative z-10 text-white">Why Choose Us</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                <div>
                  <h4 className="text-xl font-bold text-accent mb-2">Scientifically Validated</h4>
                  <p className="text-slate-200">Using proven, standardized psychological tools.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-accent mb-2">High Confidentiality</h4>
                  <p className="text-slate-200">Strict ethical standards and data protection.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-accent mb-2">Actionable Insights</h4>
                  <p className="text-slate-200">Clear reports for informed business decisions.</p>
                </div>
              </div>
            </div>



          </div>
        </Container>
      )}

      {/* Forensic Training Specific Custom Section */}
      {id === 'forensic-training' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            {/* PART 1: INTRO PARAGRAPH */}
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6 text-center animate-in fade-in duration-700">Overview</h2>
            <p className="text-slate-600 mb-16 text-lg text-center max-w-4xl mx-auto leading-relaxed animate-in fade-in duration-700 delay-100">
              In an era where technology-driven crime outpaces traditional security measures, specialized knowledge is the only viable defense. Forensic Talents INDIA LLP provides elite, research-backed training programs designed to empower professionals across the legal, financial, and corporate spectrum. <br /> <br /> Our programs bridge the gap between academic theory and field application, ensuring that stakeholders can identify, preserve, and utilize evidence with scientific precision and legal defensibility.
            </p>

            {/* PART 2: TRAINING TRACKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/infographic-law.png"
                    alt="Law Enforcement Forensic Infographic"
                    className="w-full max-w-[240px] min-[570px]:max-w-[380px] md:max-w-[280px] lg:max-w-[320px] h-auto max-h-[300px] object-contain rounded-md mx-auto transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <Scale size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Law Enforcement & Judiciary</h3>
                </div>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  Focus on evidence handling, cyber law, and forensic investigation accuracy.
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Target className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Focus:</span> Advanced crime scene management, biological evidence, digital forensics</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Briefcase className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Key Skills:</span> Evidence Integrity & The New Legal Framework (BSA)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Award className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Outcome:</span> Ability to handle high-sensitivity cases with zero-error protocols</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/infographic-banking.png"
                    alt="Banking Forensic Infographic"
                    className="w-full max-w-[240px] min-[570px]:max-w-[380px] md:max-w-[280px] lg:max-w-[320px] h-auto max-h-[300px] object-contain rounded-md mx-auto transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <Landmark size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Banking & Financial Institutions</h3>
                </div>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  Focus on fraud detection, compliance, and financial forensic intelligence.
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Target className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Focus:</span> Signature verification, fraud detection, KYC identity analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Briefcase className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Key Skills:</span> Document Security & Fraud Detection</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Award className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Outcome:</span> Reduced financial risk and improved audit capability</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/infographic-corporate.png"
                    alt="Corporate Forensic Infographic"
                    className="w-full max-w-[240px] min-[570px]:max-w-[380px] md:max-w-[280px] lg:max-w-[320px] h-auto max-h-[300px] object-contain rounded-md mx-auto transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Corporate & Security Agencies</h3>
                </div>
                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  Focus on internal risk, behavioral integrity, and forensic evaluation of workplace threats.
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Target className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Focus:</span> Forensic interviewing, employee vetting, digital footprint analysis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Briefcase className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Key Skills:</span> Internal Investigation & Workplace Integrity</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <Award className="text-accent mt-0.5 flex-shrink-0" size={16} />
                      <span><span className="font-semibold text-slate-800">Outcome:</span> Strong internal security and misconduct prevention</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group lg:col-span-1 overflow-hidden">
                {/* Image Section */}
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/academic-infographic.png"
                    alt="Academic Research Forensic Certification Outcome"
                    className="w-full max-w-[240px] min-[570px]:max-w-[380px] md:max-w-[280px] lg:max-w-[320px] h-auto max-h-[300px] object-contain rounded-md mx-auto transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Academics, Researchers & Interns</h3>
                </div>

                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                  This program is designed to bridge the gap between academic theory and real-world forensic application, equipping researchers, educators, and interns with advanced analytical, methodological, and professional skills.
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-primary mb-3 text-sm">Core Areas:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="text-accent" size={16} /> Advanced Analytical Techniques</li>
                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="text-accent" size={16} /> Research Methodology</li>
                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="text-accent" size={16} /> Teaching & Pedagogy</li>
                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="text-accent" size={16} /> Practical Exposure</li>
                    <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="text-accent" size={16} /> Professional Mentorship</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowAcademicOutcome(!showAcademicOutcome)}
                  className="w-full text-center py-2 mt-2 text-sm font-semibold text-accent hover:text-primary transition-colors flex items-center justify-center gap-2 bg-slate-50 rounded-lg"
                >
                  {showAcademicOutcome ? "Show Less" : "Show More"}
                </button>

                {showAcademicOutcome && (
                  <div className="pt-4 mt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                    <h4 className="font-semibold text-primary mb-3 text-sm">Outcome:</h4>
                    <p className="text-sm text-slate-600 mb-4">Participants graduate from this program not just as proficient lab technicians, but as <span className="font-semibold"> Holistic Forensic Leaders.</span> </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <Award className="text-accent mt-0.5 flex-shrink-0" size={16} />
                        <span><span className="font-semibold text-slate-800">Academics</span> &rarr; Improved teaching and curriculum design</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <Award className="text-accent mt-0.5 flex-shrink-0" size={16} />
                        <span><span className="font-semibold text-slate-800">Researchers</span> &rarr; Strong analytical and publishing capability</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <Award className="text-accent mt-0.5 flex-shrink-0" size={16} />
                        <span><span className="font-semibold text-slate-800">Interns</span> &rarr; Industry-ready forensic skills</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* PART 3: PEDAGOGICAL APPROACH SECTION */}
            <div className="bg-slate-50 p-10 md:p-12 rounded-2xl border border-slate-200 mb-20 animate-in fade-in duration-700">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4 flex items-center justify-center gap-3">
                  <Lightbulb className="text-accent" size={32} /> Our Pedagogical Approach: The Forensic Edge
                </h3>
                <p className="text-slate-600 text-lg">We reject dry, lecture-heavy formats. Our training is built on:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <span className="font-semibold text-slate-800">Case-Based Learning<br /><span className="text-sm font-normal text-slate-500">(real-world Indian cases)</span></span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Monitor size={24} />
                  </div>
                  <span className="font-semibold text-slate-800">Interactive Simulations<br /><span className="text-sm font-normal text-slate-500">(crime-room scenarios)</span></span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Beaker size={24} />
                  </div>
                  <span className="font-semibold text-slate-800">Hands-on Lab Access</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <BadgeCheck size={24} />
                  </div>
                  <span className="font-semibold text-slate-800">Industry-recognized Certification</span>
                </div>
              </div>
            </div>

            {/* PART 4: WHY PARTNER SECTION */}
            <div className="bg-primary text-white p-10 md:p-14 rounded-2xl relative overflow-hidden shadow-xl animate-in fade-in duration-700">
              <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <Target size={300} />
              </div>
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-12 relative z-10 text-center text-white">Why Partner with Forensic Talents INDIA LLP?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-lg">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-accent mb-3">Research-Driven</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">Curriculum based on the latest forensic advancements.</p>
                </div>
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-lg">
                    <Users className="text-white" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-accent mb-3">Customized</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">Training tailored to specific industry needs.</p>
                </div>
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-lg">
                    <Briefcase className="text-white" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-accent mb-3">Real-World</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">Exposure to actual case methodologies.</p>
                </div>
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-lg">
                    <ShieldAlert className="text-white" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-accent mb-3">Expertise</h4>
                  <p className="text-slate-300 leading-relaxed text-sm">National-level forensic professionals guiding the sessions.</p>
                </div>
              </div>
            </div>



          </div>
        </Container >
      )
      }

      {/* Frequently Asked Questions */}
      {
        serviceInfo.faqs && serviceInfo.faqs.length > 0 && (
          <Container className="py-16 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-slate-800 mb-8 flex items-center gap-3">
                <MessageSquare className="text-accent" size={32} /> Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={serviceInfo.faqs} />
            </div>
          </Container>
        )
      }

    </div >
  );
}
