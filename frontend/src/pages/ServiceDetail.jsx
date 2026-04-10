import { useParams, Link, Navigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, FileText, Fingerprint, Shield, Link as LinkIcon, BadgeCheck, Search, Database, MessageSquare, Mail, MapPin, Mic, HardDrive, Scale, History, Camera, GitCompare, ShieldAlert, Beaker, ClipboardList, Eye, Landmark, UserCheck, Scan, PenTool, FileSearch, FileEdit, FileQuestion, Droplet, Award } from 'lucide-react';
import extractedData from '../data/extracted_docs.json';

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
        features.push({ title: line, details: []});
      }
    }
  }

  return { intro, features, process };
}

export default function ServiceDetail() {
  const { id } = useParams();

  const serviceMap = {
    'pcc': { 
      title: 'Police Clearance Certificate', 
      file: 'Police Clearance Certificate.docx',
      catchyIntro: "Seamlessly navigate background checks with our globally accepted, error-free Police Clearance and Fingerprinting services."
    },
    'questioned-documents': { 
      title: 'Questioned Documents Examination', 
      file: 'Questioned Document Examination.docx',
      catchyIntro: "Uncover the truth behind disputed documents through rigorous scientific examination of handwriting, forgery, and authenticity."
    },
    'fingerprint': { 
      title: 'Fingerprint Investigation', 
      file: 'Fingerprint examination.docx',
      catchyIntro: "Precision fingerprint analysis utilizing world-class methods for flawless identity verification and criminal investigation."
    },
    'cyber': { 
      title: 'Cyber Forensics & Digital Investigation', 
      file: 'Cyber Forensics.docx',
      catchyIntro: "Advanced digital investigation recovering critical evidence from devices and networks to combat modern cyber threats."
    },
    'crime-scene': { 
      title: 'Crime Scene Investigation', 
      file: 'Crime Scene Investigation.docx',
      catchyIntro: "Expert evidence collection, preservation, and precise scene reconstruction to capture the full story behind the crime."
    },
    'cross-examination': { 
      title: 'Forensic Cross Examination', 
      file: 'Forensic Cross Examination.docx',
      catchyIntro: "Strategic evaluation and questioning of forensic evidence to ensure scientific validity and legally reliable courtroom outcomes."
    },
  };

  const serviceInfo = serviceMap[id];
  
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
        <Container className="relative z-10">
          <Link to="/services" className="inline-flex items-center text-accent hover:text-accent-light mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Services
          </Link>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white drop-shadow-md">{serviceInfo.title}</h1>
          <p className="text-slate-200 text-xl max-w-3xl leading-relaxed drop-shadow">{serviceInfo.catchyIntro}</p>
        </Container>
      </div>

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

      {/* PCC Specific Custom Section */}
      {id === 'pcc' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">

            {/* Benefits of Our Services Section */}
            <div className="mb-20">
              <h3 className="text-3xl font-heading font-bold text-primary mb-8 border-b pb-4">Benefits of Our Services</h3>
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
    </div>
  );
}
