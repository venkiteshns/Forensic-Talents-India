import React, { useState, useCallback } from 'react';
import { useParams, Link, Navigate, useSearchParams } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, FileText, Fingerprint, Shield, Link as LinkIcon, BadgeCheck, Search, Database, MessageSquare, Mail, MapPin, Mic, HardDrive, Scale, History, Camera, GitCompare, ShieldAlert, Beaker, ClipboardList, Eye, Landmark, UserCheck, Scan, PenTool, FileSearch, FileEdit, FileQuestion, Droplet, Award, Activity, Users, Monitor, BrainCircuit, Lightbulb, Target, Briefcase, GraduationCap, BookOpen, LineChart } from 'lucide-react';
import extractedData from '../data/extracted_docs.json';

import { serviceDetails } from '../data/serviceDetails';
import FAQAccordion from '../components/ui/FAQAccordion';
import ServiceProcess from '../components/ui/ServiceProcess';
import InteractiveForensicMap from '../components/ui/InteractiveForensicMap';
import TopicForensicDashboard from '../components/ui/TopicForensicDashboard';
import { techTourData } from '../data/techTourData';
import { AnimatePresence, motion } from 'framer-motion';
// ─── Decentralized Motion Variants ─────────────────────────────────────────
// Each element owns its own viewport observer — no parent stagger dependency.
const VP = { once: true, margin: '0px 0px -60px 0px', amount: 0.15 };

const cardEntranceVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: (index % 3) * 0.12,
    },
  }),
};

const textGlideVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 22 },
  },
};

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 110, damping: 22 },
  },
};

// 4-column cascade for the Questioned Documents grid
const subServiceCardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 22,
      mass: 1,
      delay: (index % 4) * 0.12,
    },
  }),
};
// ─── KeyOfferingsAccordion ───────────────────────────────────────────────────
// Mutually exclusive single-active accordion for Key Offerings.
// Each row has its own whileInView entrance; open/close is spring-animated.
function KeyOfferingsAccordion({ features }) {
  const [activeId, setActiveId] = useState(null);

  const toggle = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {features.map((feat, idx) => {
        const isOpen = activeId === idx;
        const title = feat.title.replace('Our Services Include', '').trim();
        const hasDetails = feat.details && feat.details.length > 0;

        return (
          <motion.div
            key={idx}
            custom={idx}
            variants={cardEntranceVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ backgroundColor: '#f8fafc' }}
          viewport={VP}
          >
            {/* Header row — always visible */}
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-start gap-4 py-5 text-left group focus:outline-none"
              aria-expanded={isOpen}
            >
              {/* Step counter */}
              <span className="flex-shrink-0 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Title */}
              <span className="flex-1 text-base md:text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors duration-200 leading-snug pt-1.5">
                {title}
              </span>

              {/* Spinner icon */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-slate-400 group-hover:text-slate-600 transition-colors duration-200 mt-1 text-xl leading-none select-none"
                aria-hidden
              >
                +
              </motion.span>
            </button>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
              {isOpen && (hasDetails ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                  className="overflow-hidden"
                >
                  <ul className="pl-20 pb-6 space-y-2">
                    {feat.details.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="content-empty"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                  className="overflow-hidden"
                >
                  <p className="pl-20 pb-6 text-sm text-slate-500 leading-relaxed italic">
                    Detailed sub-service breakdown available upon consultation.
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

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
    } else if (line.includes('FAQs') || line.includes('Benefits of Our Services') || line.includes('Countries Covered')) {
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
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTopicId = searchParams.get('topic');
  const activeTopic = activeTopicId ? techTourData[activeTopicId] : null;

  const handleSelectTopic = (topicId) => {
    const mapToDataKeys = {
      'vehicles': 'vehicles-and-transport',
      'smart-home': 'smart-home-devices',
      'mobile-phones': 'mobile-phones',
      'computers': 'computers-online-accounts',
      'tracking': 'tracking-technologies',
      'everyday-apps': 'everyday-apps'
    };
    const targetId = mapToDataKeys[topicId] || topicId;
    setSearchParams({ topic: targetId });
  };

  const handleCloseTechTour = () => {
    setSearchParams({});
    setTimeout(() => {
      document.getElementById('tech-tour')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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
        style={{ backgroundImage: `url('/images/services/${id}.webp')` }}
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
          <div>
            <motion.h1
              variants={sectionHeaderVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white drop-shadow-md"
            >{serviceInfo.title}</motion.h1>
            <motion.p
              variants={textGlideVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="text-slate-200 text-xl max-w-3xl leading-relaxed drop-shadow"
            >{serviceInfo.catchyIntro}</motion.p>
          </div>
        </Container>
      </div>

      {id === 'forensic-training' || id === 'workplace-assessments' ? (
        <ServiceProcess serviceId={id} />
      ) : (
        <Container className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* LEFT SIDE (Key Offerings) */}
            <div className="col-span-1 lg:col-span-2 order-2 lg:order-1 max-w-full">
              {id === 'fingerprint' && (
                <motion.div
                  variants={cardEntranceVariants}
                  custom={0}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VP}
                  className="mb-12 bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-primary"
                >
                  <h3 className="text-xl font-bold text-primary mb-3">Expert Legal Validity</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    We provide complete solutions in fingerprint examination matters, and our expert opinion is acceptable under <span className="font-semibold text-primary">Section 39 of the Bharatiya Sakshya Adhiniyam, 2023</span> (formerly Section 45 of the Indian Evidence Act) by all the Courts of India and abroad. We are pleased to support you, whenever you need our services.
                  </p>
                </motion.div>
              )}

              <motion.h2
                variants={sectionHeaderVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="text-3xl font-heading font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4"
              >Key Offerings</motion.h2>

              {parsed.features.length > 0 ? (
                <KeyOfferingsAccordion features={parsed.features} />
              ) : (
                <motion.p
                  variants={textGlideVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={VP}
                  className="text-slate-500 italic text-sm border-y border-slate-200 py-6"
                >Detailed service breakdown available upon consultation. Our experts provide scientifically accurate testing verified under Section 39 of the Bharatiya Sakshya Adhiniyam, 2023.</motion.p>
              )}

              {/* Countries Covered Section - PCC Only */}
              {id === 'pcc' && (
                <div className="py-10">
                  <motion.h2
                    variants={sectionHeaderVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VP}
                    className="text-3xl font-heading font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4"
                  >Countries Covered</motion.h2>
                  <motion.p
                    variants={textGlideVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VP}
                    className="text-slate-600 mb-8 leading-relaxed"
                  >
                    Our services are available across multiple countries, ensuring compliance with each region's legal and procedural standards.
                  </motion.p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {[
                      'USA', 'Canada', 'UK', 'UAE', 'Australia', 'Singapore', 'New Zealand', 'Saudi Arabia'
                    ].map((country, idx) => (
                      <motion.div
                        key={idx}
                        custom={idx}
                        variants={cardEntranceVariants}
                        initial="hidden"
                        whileInView="visible"
                        whileHover={{ y: -3, borderColor: '#94a3b8' }}
                        viewport={VP}
                        className="flex items-center gap-3 p-4 rounded-lg bg-white border border-slate-200"
                      >
                        <Globe className="text-accent flex-shrink-0" size={20} />
                        <span className="font-semibold text-slate-800">{country}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p
                    variants={textGlideVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={VP}
                    className="text-slate-600 italic"
                  >
                    And many more. We stay updated with the latest requirements of each country to ensure compliance and smooth processing.
                  </motion.p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE (Process Flow) */}
            <div className="col-span-1 order-1 lg:order-2">
              <div className="sticky top-24 bg-white lg:border-l lg:border-slate-100 lg:pl-8">
                <ServiceProcess serviceId={id} compact={true} />
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* PCC Specific Custom Section */}
      {id === 'pcc' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">

            {/* Benefits of Our Services Section */}
            <div className="mb-20">
              <motion.h3
                variants={sectionHeaderVariants}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
                className="text-3xl font-heading font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4"
              >Why Choose Us?</motion.h3>
              <div className="space-y-4">
                {[
                  { title: 'Accurate and Error-Free Fingerprint Submission', desc: 'We ensure high-quality fingerprint capture and proper documentation, minimizing the chances of rejection.' },
                  { title: 'Faster Processing Support', desc: 'Our expertise helps in reducing delays by ensuring correct application and submission from the beginning.' },
                  { title: 'End-to-End Guidance for Documentation', desc: 'We provide complete support from start to finish, making the process simple and stress-free.' },
                  { title: 'Confidential and Secure Handling', desc: 'All personal information and documents are handled with strict confidentiality and professionalism.' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={cardEntranceVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -3, borderColor: '#94a3b8' }}
                    viewport={VP}
                    className="bg-white p-6 rounded-lg border border-slate-200 flex items-start gap-4"
                  >
                    <CheckCircle2 size={24} className="text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Section header — tracking tag + title */}
            <motion.p
              variants={textGlideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2"
            >Global Transit &amp; Jurisdictions</motion.p>

            <motion.h2
              variants={sectionHeaderVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4"
            >Streamlined Fingerprint Services for Your Visa and Immigration Needs</motion.h2>

            <motion.p
              variants={textGlideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              className="text-slate-600 mb-10 leading-relaxed"
            >
              We offer a convenient one-stop solution to assist you with the fingerprint requirements for your visa and immigration applications. Our services encompass:
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-16">
              {[
                { icon: Fingerprint, title: 'Fingerprint Capture on Designated Cards', desc: <span>We handle fingerprints for various destinations, including <span className="font-semibold text-slate-800">Australia, UK, Nigeria, South Africa</span>, using the appropriate cards like <span className="font-semibold text-slate-800">FD-258 and C-216C</span>.</span> },
                { icon: Globe, title: 'RCMP Fingerprints for Canada & Other Services', desc: <span>In addition to visa fingerprints, we assist with RCMP fingerprints for Canada, FBI Police Clearance certificates, and PCCs from <span className="font-semibold text-slate-800">Singapore, Thailand, Dubai, Oman</span>.</span> },
                { icon: Shield, title: 'Error-Free Fingerprint Capture', desc: <span>We ensure accurate and <span className="font-semibold text-slate-800">ZERO Error result</span> fingerprint capturing to avoid delays in your application process and guarantee acceptance.</span> },
                { icon: BadgeCheck, title: 'MEA Fingerprint Attestation', desc: 'For certain destinations, we handle the attestation of your fingerprints by the Ministry of External Affairs (MEA) for enhanced legal validity.' },
                { icon: UserCheck, title: 'Identity Verification Support', desc: 'We assist applicants in preparing the supporting identification documents required alongside biometric fingerprint submissions.' },
                { icon: FileText, title: 'Documentation & Dispatch', desc: 'End-to-end support from fingerprint capture to courier dispatch — we track submissions and confirm receipt at the respective authority.' },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, borderColor: '#94a3b8' }}
                  viewport={{ once: true, margin: '0px 0px -60px 0px', amount: 0.15 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 22,
                    delay: (idx % 3) * 0.1,
                  }}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between cursor-default group"
                >
                  {/* Icon badge */}
                  <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center mb-5 flex-shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <Icon size={22} />
                  </motion.div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={cardEntranceVariants} custom={0} initial="hidden" whileInView="visible" viewport={VP} className="mb-16 bg-white p-8 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="text-accent" /> Additional Specialized Needs
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We also provide specialized fingerprinting aimed towards obtaining a <span className="font-semibold text-primary">Physiotherapy License</span> for states within the USA, including <span className="font-semibold text-primary">Michigan, New York, Florida, Nebraska, and Louisiana</span>.
              </p>
            </motion.div>

            {/* ── Geographical Coverage & Jurisdictional Perimeter ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-heading font-bold text-primary mb-3">
                Geographical Coverage &amp; Jurisdictional Perimeter
              </h2>

              {/* Lead paragraph */}
              <p className="text-slate-600 leading-relaxed mb-8 max-w-3xl">
                Forensic Talents India is an independent forensic laboratory headquartered in{' '}
                <span className="font-semibold text-slate-800">Gujarat</span>, providing
                pan-India Police Clearance Certificate support. Our macro-level processing
                pipeline handles applicants across all Indian states, while our micro-level
                deployment teams maintain hyper-local operational nodes in{' '}
                <span className="font-semibold text-slate-800">Gujarat</span>,{' '}
                <span className="font-semibold text-slate-800">Telangana</span>, and{' '}
                <span className="font-semibold text-slate-800">Andhra Pradesh</span> for
                in-person fingerprint capture, document verification, and same-day processing.
              </p>

              {/* ── Gujarat ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-lg font-bold text-slate-800">Gujarat Jurisdictions</h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
                    33 Districts
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
                    'Junagadh', 'Gandhinagar', 'Anand', 'Mehsana', 'Surendranagar', 'Amreli',
                    'Bharuch', 'Kheda', 'Patan', 'Banaskantha', 'Sabarkantha', 'Aravalli',
                    'Mahisagar', 'Botad', 'Morbi', 'Devbhoomi Dwarka', 'Gir Somnath',
                    'Porbandar', 'Kutch', 'Narmada', 'Tapi', 'Navsari', 'Valsad',
                    'Dang', 'Dahod', 'Chhota Udaipur', 'Panchmahal'
                  ].map((city, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.018 }}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg"
                    >
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{city}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── Telangana ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-lg font-bold text-slate-800">Telangana Jurisdictions</h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
                    15 Core Nodes
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    'Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar',
                    'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad',
                    'Suryapet', 'Siddipet', 'Sangareddy', 'Medak', 'Mancherial'
                  ].map((city, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.025 }}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg"
                    >
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{city}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── Andhra Pradesh ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-lg font-bold text-slate-800">Andhra Pradesh Jurisdictions</h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
                    5 Strategic Hubs
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool'
                  ].map((city, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.06 }}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg"
                    >
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{city}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Administrative Advisory Box */}
              <motion.div variants={cardEntranceVariants} custom={0} initial="hidden" whileInView="visible" viewport={VP} className="flex gap-0 border border-slate-200 rounded-xl overflow-hidden">
                {/* Forensic Gold accent bar */}
                <div className="w-1 flex-shrink-0 bg-accent" />
                <div className="px-6 py-5 bg-white flex-1">
                  <p className="text-sm font-bold text-slate-700 mb-1.5">Administrative Advisory</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Upon successful submission of your fingerprints and supporting documents,
                    Forensic Talents India coordinates directly with the relevant police authority
                    or consular office on your behalf. Our laboratory team tracks the complete
                    processing loop — from initial submission to certificate dispatch — and
                    notifies you at each stage. All applications are handled in strict compliance
                    with the procedural standards of the destination country.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Application Forms Section */}

            <div>
              <motion.h3 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <LinkIcon size={24} className="text-accent" /> Official PCC Application Forms
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <motion.a custom={0} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} href="https://www.edo.cjis.gov/#/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">USA PCC (FBI)</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a custom={1} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} href="https://rcmp.ca/en" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">Canada PCC (RCMP)</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a custom={2} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} href="https://www.acro.police.uk/s/acro-services/police-certificates/police-certificates-form" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">UK PCC (ACRO)</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a custom={3} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} href="https://service.upf.go.ug/Register.aspx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">Uganda PCC</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a custom={4} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} href="https://www.cid.go.ke/index.php/services/police-clearance-certificate.html" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-accent hover:shadow-md transition-all group">
                  <span className="font-semibold text-slate-700">Kenya PCC</span>
                  <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </div>

          </div>
        </Container>
      )}

      {/* Cyber Forensics Specific Custom Section */}
      {id === 'cyber' && (
        <>
        <Container className="py-16 border-t border-slate-100">
          {/* Legal Validity & Digital Evidence Compliance Section */}
          <motion.div variants={cardEntranceVariants} custom={0} initial="hidden" whileInView="visible" viewport={VP} className="bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-start gap-6">
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
          </motion.div>
          <div className="max-w-5xl mx-auto">
            <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 text-center">Our Cyber Forensics Services</motion.h2>
            <motion.p variants={textGlideVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              We leverage cutting-edge technology and established methodologies to resolve complex digital puzzles and deliver actionable evidence.
            </motion.p>



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <motion.div custom={0} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Search size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Digital Evidence Collection</h3>
                <p className="text-slate-600 leading-relaxed">Our team securely collects digital evidence from any device to support your case.</p>
              </motion.div>

              <motion.div custom={1} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Database size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Recovery</h3>
                <p className="text-slate-600 leading-relaxed">We recover deleted or hidden data, providing crucial pieces for your investigation.</p>
              </motion.div>

              <motion.div custom={2} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <MessageSquare size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Social Media Investigations</h3>
                <p className="text-slate-600 leading-relaxed">We discreetly investigate social media platforms (WhatsApp, Facebook, etc.) to uncover relevant information.</p>
              </motion.div>

              <motion.div custom={3} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mail size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Email Tracking</h3>
                <p className="text-slate-600 leading-relaxed">Track the origin and path of emails to identify senders and recipients.</p>
              </motion.div>

              <motion.div custom={4} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <MapPin size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">IP Address Tracing</h3>
                <p className="text-slate-600 leading-relaxed">Identify the location of suspicious online activity through IP address tracking.</p>
              </motion.div>

              <motion.div custom={5} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mic size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Voice Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Verify voice alterations used in recordings to determine authenticity.</p>
              </motion.div>

              <motion.div custom={6} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <HardDrive size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Data Retrieval</h3>
                <p className="text-slate-600 leading-relaxed">Recover lost data from damaged or formatted storage devices.</p>
              </motion.div>

              <motion.div custom={7} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <BadgeCheck size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Guidance</h3>
                <p className="text-slate-600 leading-relaxed">Our forensic consultants provide comprehensive analysis and clear explanations for legal proceedings.</p>
              </motion.div>

              <motion.div custom={8} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scale size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Cross-Examination Support</h3>
                <p className="text-slate-600 leading-relaxed">We empower you to effectively challenge opposing expert testimony in court.</p>
              </motion.div>

              <motion.div custom={9} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group lg:col-span-3 lg:w-1/3 lg:mx-auto">
                <div className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors mx-auto">
                  <History size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">Digital Scene Reconstruction</h3>
                <p className="text-slate-600 leading-relaxed text-center">Piece together the digital timeline of events for a clear understanding of the crime.</p>
              </motion.div>

            </div>
          </div>
        </Container>
        <InteractiveForensicMap onSelectTopic={handleSelectTopic} />
        
        <AnimatePresence>
          {activeTopic && (
            <motion.div
              key="dashboard"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex bg-slate-50/95 backdrop-blur-xl"
            >
              <TopicForensicDashboard 
                topic={activeTopic} 
                onClose={handleCloseTechTour} 
                onSwitchTopic={handleSelectTopic}
                allTopics={techTourData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
      )}
      {/* Fingerprint Specific Custom Section */}
      {id === 'fingerprint' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 text-center">Fingerprint Identification and Analysis Services</motion.h2>
            <motion.p variants={textGlideVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              We offer a comprehensive suite of fingerprint services to meet your needs, including:
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <motion.div custom={10} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scan size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fingerprint Recovery</h3>
                <p className="text-slate-600 leading-relaxed">We can develop fingerprints from various surfaces, including objects, documents, and photographs, using advanced techniques.</p>
              </motion.div>

              <motion.div custom={11} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <GitCompare size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fingerprint Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Our experts can compare and match fingerprints to identify individuals or link them to a crime scene.</p>
              </motion.div>

              <motion.div custom={12} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Camera size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Forensic Fingerprint Photography</h3>
                <p className="text-slate-600 leading-relaxed">We capture high-quality images of fingerprints for detailed examination and documentation.</p>
              </motion.div>

              <motion.div custom={13} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Search size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Crime Scene processing</h3>
                <p className="text-slate-600 leading-relaxed">Our services include the development, lifting, and analysis of fingerprints found at crime scenes.</p>
              </motion.div>

              <motion.div custom={14} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileText size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Examination for Documents</h3>
                <p className="text-slate-600 leading-relaxed">We analyze fingerprints on documents like wills, agreements, and contracts, providing expert opinions on their authenticity.</p>
              </motion.div>

              <motion.div custom={15} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ShieldAlert size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Comparison in Forgery Cases</h3>
                <p className="text-slate-600 leading-relaxed">We assist in forgery investigations by comparing fingerprints on suspect documents.</p>
              </motion.div>

              <motion.div custom={16} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Beaker size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Development Techniques</h3>
                <p className="text-slate-600 leading-relaxed">We utilize various methods, including powders and chemicals, to develop latent (invisible or faint) fingerprints.</p>
              </motion.div>

              <motion.div custom={17} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ClipboardList size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Fingerprinting for Records</h3>
                <p className="text-slate-600 leading-relaxed">We take and record fingerprints for background checks, employment purposes, or other record-keeping needs.</p>
              </motion.div>

              <motion.div custom={18} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Eye size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Latent Fingerprint Development</h3>
                <p className="text-slate-600 leading-relaxed">We have the expertise to develop faint or invisible fingerprints for identification purposes.</p>
              </motion.div>

              <motion.div custom={19} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Landmark size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Examination on Legal Documents</h3>
                <p className="text-slate-600 leading-relaxed">We analyze fingerprints on legal documents such as wills, contracts, and property deeds, providing expert opinions in court.</p>
              </motion.div>

              <motion.div custom={20} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group md:col-span-2 lg:col-span-1">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <UserCheck size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Witness Services</h3>
                <p className="text-slate-600 leading-relaxed">We provide forensic opinions on fingerprint comparisons for questioned or disputed documents in legal proceedings.</p>
              </motion.div>

            </div>
          </div>
        </Container>
      )}

      {/* Questioned Documents Specific Custom Section */}
      {id === 'questioned-documents' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 text-center">Comprehensive Document Examination Services</motion.h2>
            <motion.p variants={textGlideVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              We employ scientific methods and expert scrutiny to uncover forgery, verify authenticity, and establish the truth in questioned documents.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: PenTool,      title: 'Handwritten Signature Forgery Detection', desc: 'Identifying if a signature has been forged through cutting and pasting or imitation.' },
                { icon: FileSearch,   title: 'Forensic Document Analysis',              desc: 'Examining disputed or forged documents using photography and other techniques.' },
                { icon: BadgeCheck,   title: 'Document Verification',                  desc: 'Confirming the authenticity of certificates, ID cards, and other critical credentials.' },
                { icon: FileEdit,     title: 'Handwriting Analysis',                   desc: 'Detecting alterations, substitutions, insertions, or deletions within handwriting.' },
                { icon: ShieldAlert,  title: 'General Forgery Detection',              desc: 'Identifying any type of forgery beyond handwriting, ensuring scientific clarity.' },
                { icon: FileQuestion, title: 'Anonymous Document Examination',         desc: 'Analyzing anonymous letters to potentially identify the author or source reliably.' },
                { icon: Droplet,      title: 'Paper & Ink Analysis',                  desc: 'Determining the key characteristics of paper and ink used in a disputed document.' },
                { icon: Award,        title: 'Certificate Authenticity',               desc: 'Confirming the rigorous legitimacy and validity of professional certificates.' },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={subServiceCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover={{ y: -5, borderColor: '#94a3b8' }}
                  viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col group"
                >
                  <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon size={28} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      )}

      {/* Polygraph Specific Custom Section */}
      {id === 'polygraph' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 text-center">Polygraph Examination Services</motion.h2>
            <motion.p variants={textGlideVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              Our polygraph testing services evaluate truthfulness using advanced physiological monitoring, providing reliable insights for criminal investigations, corporate inquiries, and dispute resolution.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <motion.div custom={29} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Activity size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Lie Detection Testing</h3>
                <p className="text-slate-600 leading-relaxed">Evaluate truthfulness using physiological responses like heart rate, respiration, and skin conductivity during structured questioning.</p>
              </motion.div>

              <motion.div custom={30} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <FileQuestion size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Pre-Test Interviews</h3>
                <p className="text-slate-600 leading-relaxed">Formulate careful, unbiased questions across relevant, control, and neutral categories to ensure highly accurate results.</p>
              </motion.div>

              <motion.div custom={31} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Monitor size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Advanced Data Analysis</h3>
                <p className="text-slate-600 leading-relaxed">Experts score and interpret complex charts with computer-assisted methods to eliminate bias and establish clear conclusions.</p>
              </motion.div>

              <motion.div custom={32} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Search size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Criminal Investigations</h3>
                <p className="text-slate-600 leading-relaxed">Narrow down suspects and verify witness statements effectively to support major law enforcement and private investigations.</p>
              </motion.div>

              <motion.div custom={33} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Users size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Employee Screening</h3>
                <p className="text-slate-600 leading-relaxed">Maintain organizational integrity by screening personnel for internal investigations involving misconduct, theft, or fraud.</p>
              </motion.div>

              <motion.div custom={34} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scale size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Reporting</h3>
                <p className="text-slate-600 leading-relaxed">Receive structured, meticulous reports detailing the methodology and conclusions, designed to assist legal and executive authorities.</p>
              </motion.div>

            </div>
          </div>
        </Container>
      )}

      {/* Workplace Assessments Specific Custom Section */}
      {id === 'workplace-assessments' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4 text-center">Overview</motion.h2>
            <p className="text-slate-600 mb-12 text-lg text-center max-w-3xl mx-auto">
              The most complex variable in any organization is human behavior. Our Forensic Psychological Workplace Assessments provide organizations with a scientific, independent evaluation of the psychological and behavioral health of their workforce. By utilizing validated psychometric tools and forensic psychology principles, we help management look beneath the surface to identify behavioral risks, optimize cognitive performance, and ensure a secure, resilient, and ethically sound workplace.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <motion.div custom={35} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <BrainCircuit size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Forensic Psychometric Profiling <br /> (Personality & Behavior)</h3>
                <p className="text-slate-600 leading-relaxed">Moving beyond standard personality quizzes, we utilize validated forensic tools to assess deep-seated behavioral traits, including emotional intelligence, risk tolerance, and susceptibility to unethical behavior. This is crucial for high-stakes hiring, leadership development, and identifying potential culture-clashes.</p>
              </motion.div>
              <motion.div custom={36} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Lightbulb size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Cognitive & Behavioral Performance Analysis</h3>
                <p className="text-slate-600 leading-relaxed">We evaluate the psychological drivers behind employee performance. By assessing cognitive flexibility, decision-making capabilities under pressure, and problem-solving styles, we help organizations align the right psychological profiles with specific operational roles.</p>
              </motion.div>
              <motion.div custom={37} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Activity size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Stress & Workload Assessment </h3>
                <p className="text-slate-600 leading-relaxed">Burnout is a profound organizational risk. We measure cognitive load and psychological resilience to ensure optimal resource allocation. This assessment helps prevent severe fatigue, reducing the risk of critical errors and safeguarding employee mental well-being.</p>
              </motion.div>
              <motion.div custom={38} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <ShieldAlert size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Integrity & Counter-Productive Work Behavior (CWB) Audits</h3>
                <p className="text-slate-600 leading-relaxed">A specialized psychological evaluation designed to detect propensities for rule-breaking, insubordination, internal fraud, or hostility. This proactive screening protects your organization's assets and reputation from internal threats.</p>
              </motion.div>
              <motion.div custom={39} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Users size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Leadership Competency & Succession Dynamics</h3>
                <p className="text-slate-600 leading-relaxed">An evidence-based psychological evaluation of future leaders, focusing on their capacity for empathy, strategic cognition, and crisis management, ensuring your organization’s future is in psychologically capable hands.</p>
              </motion.div>
              <motion.div custom={40} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-t-4 border-t-accent group">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Scale size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Workplace Conflict & Risk Escalation Assessment</h3>
                <p className="text-slate-600 leading-relaxed">When internal disputes arise, we provide an objective, psychological analysis of the individuals involved to determine the root cause of the conflict, the risk of escalation, and the most effective psychological interventions.</p>
              </motion.div>
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

            <motion.div variants={cardEntranceVariants} custom={0} initial="hidden" whileInView="visible" viewport={VP} className="bg-primary text-white p-8 md:p-12 rounded-2xl text-center relative overflow-hidden">
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
            </motion.div>



          </div>
        </Container>
      )}

      {/* Forensic Training Specific Custom Section */}
      {id === 'forensic-training' && (
        <Container className="py-16 border-t border-slate-100">
          <div className="max-w-6xl mx-auto">
            {/* PART 1: INTRO PARAGRAPH */}
            <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6 text-center">Overview</motion.h2>
            <motion.p variants={textGlideVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-slate-600 mb-16 text-lg text-center max-w-4xl mx-auto leading-relaxed">
              In an era where technology-driven crime outpaces traditional security measures, specialized knowledge is the only viable defense. Forensic Talents INDIA LLP provides elite, research-backed training programs designed to empower professionals across the legal, financial, and corporate spectrum. <br /> <br /> Our programs bridge the gap between academic theory and field application, ensuring that stakeholders can identify, preserve, and utilize evidence with scientific precision and legal defensibility.
            </motion.p>

            {/* PART 2: TRAINING TRACKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* Card 1 */}
              <motion.div custom={0} variants={cardEntranceVariants} initial="hidden" whileInView="visible" whileHover={{ y: -5, borderColor: '#94a3b8' }} viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-accent group overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/infographic-law.webp"
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
              </motion.div>

              {/* Card 2 */}
              <motion.div custom={1} variants={cardEntranceVariants} initial="hidden" whileInView="visible" whileHover={{ y: -5, borderColor: '#94a3b8' }} viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-accent group overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/infographic-banking.webp"
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
              </motion.div>

              {/* Card 3 */}
              <motion.div custom={2} variants={cardEntranceVariants} initial="hidden" whileInView="visible" whileHover={{ y: -5, borderColor: '#94a3b8' }} viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-accent group overflow-hidden">
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/infographic-corporate.webp"
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
              </motion.div>

              {/* Card 4 */}
              <motion.div custom={3} variants={cardEntranceVariants} initial="hidden" whileInView="visible" viewport={VP} className="bg-white p-8 rounded-xl border border-slate-200 border-l-4 border-l-accent group lg:col-span-1 overflow-hidden">
                {/* Image Section */}
                <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-slate-100 bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-700">
                  <img
                    src="/images/services/academic-infographic.webp"
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
              </motion.div>
            </div>

            {/* PART 3: PEDAGOGICAL APPROACH SECTION */}
            <motion.div variants={cardEntranceVariants} custom={0} initial="hidden" whileInView="visible" viewport={VP} className="bg-slate-50 p-10 md:p-12 rounded-2xl border border-slate-200 mb-20">
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
            </motion.div>

            {/* PART 4: WHY PARTNER SECTION */}
            <motion.div variants={cardEntranceVariants} custom={0} initial="hidden" whileInView="visible" viewport={VP} className="bg-primary text-white p-10 md:p-14 rounded-2xl relative overflow-hidden">
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
            </motion.div>



          </div>
        </Container >
      )
      }

      {/* Frequently Asked Questions */}
      {
        serviceInfo.faqs && serviceInfo.faqs.length > 0 && (
          <Container className="py-16 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
              <motion.h2 variants={sectionHeaderVariants} initial="hidden" whileInView="visible" viewport={VP} className="text-3xl font-heading font-bold text-slate-800 mb-8 flex items-center gap-3">
                <MessageSquare className="text-accent" size={32} /> Frequently Asked Questions
              </motion.h2>
              <FAQAccordion faqs={serviceInfo.faqs} />
            </div>
          </Container>
        )
      }

    </div >
  );
}
