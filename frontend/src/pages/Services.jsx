import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { ArrowRight, Shield, Search, FileText, Fingerprint, Monitor, Scale, Activity, Users, GraduationCap, Leaf, Landmark } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { containerVariants, textVariants, scaleHover } from '../animations';
import api from '../utils/api';
import ReviewsSection from '../components/education/ReviewsSection';

// Helper: get initials from name (e.g. "John Ken" → "JK", "John" → "J")
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0]?.[0]?.toUpperCase() || '?';
}

// ─── Individual Viewport-Bound Card Variants ────────────────────────────────
//
// ARCHITECTURE: Decentralized — each card owns its own IntersectionObserver.
// WHY: The parent-stagger pattern fires ALL cards the moment the grid top-edge
// enters the screen. Cards deep below the fold animate while invisible.
// Per-card observers fix this: each card waits until IT personally crosses
// the viewport threshold before animating.
//
// margin: "0px 0px -100px 0px"  →  card must be 100px inside the bottom
//                                   of the viewport before triggering.
//                                   Prevents any below-fold pre-animation.
//
// delay: (i % 3) * 0.25  →  column-position stagger within each row.
//   col 0 = 0ms | col 1 = 250ms | col 2 = 500ms
//   On 1-col mobile, every card is col-0 so delay is always 0 — natural
//   scroll order provides the stagger automatically.
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: (i % 3) * 0.25,   // 250ms gap between each column in a row
      duration: 1.2,            // cinematic, deliberately slow lift
      ease: [0.16, 1, 0.3, 1], // Apple quiet-luxury deceleration curve
    },
  }),
};
// ────────────────────────────────────────────────────────────────────────────

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="bg-secondary-light min-h-[calc(100vh-88px)]">
      {/* Header */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants}
        className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}
      >
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/services_banner.webp" alt="Our Forensic Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <motion.h1 variants={textVariants} className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Our Expertise & Solutions</motion.h1>
          <motion.p variants={textVariants} className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            Delivering scientifically rigorous and legally defensible forensic analysis across a wide spectrum of specialized domains.
          </motion.p>
        </Container>
      </motion.section>

      <Container className="pb-24">
        {/*
          ── DECENTRALIZED VIEWPORT-BOUND GRID ─────────────────────────────────
          Each card is its own viewport observer (no parent orchestrator).
          margin: "0px 0px -100px 0px" → card must physically enter 100px
          inside the bottom edge before its animation fires. Cards below
          the fold remain completely invisible until the user scrolls there.

          Column-stagger delay: (i % 3) * 0.25
            col 0 → 0ms   col 1 → 250ms   col 2 → 500ms
          On mobile (1-col), modulo always yields 0 — natural scroll order
          provides the stagger without empty timing gaps.
          ────────────────────────────────────────────────────────────────────
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv, i) => (
            <motion.div
              key={srv.id}
              variants={cardVariants}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15, margin: "0px 0px -100px 0px" }}
              whileHover={scaleHover.hover}
              style={{ willChange: 'transform' }}
              className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-primary overflow-hidden flex flex-col group"
            >
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
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Reviews & Testimonials Section */}
      <ReviewsSection type="service" />
    </div>
  );
}
