import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, FileSearch, Beaker, Scale } from 'lucide-react';
import { Container } from './Container';

// ─── Data ─────────────────────────────────────────────────────────────────────
const defaultSteps = [
  { title: 'Enquiry & Consultation', desc: 'Submit your case via website, phone, email, or WhatsApp', icon: MessageSquare },
  { title: 'Case Evaluation', desc: 'Experts assess the case and determine the required forensic approach', icon: Search },
  { title: 'Evidence / Data Collection', desc: 'Relevant documents, samples, or data collected securely', icon: FileSearch },
  { title: 'Scientific Analysis / Execution', desc: 'Detailed forensic examination using validated methodologies', icon: Beaker },
  { title: 'Certified Report / Outcome', desc: 'Court-admissible report or professional outcome delivered', icon: Scale },
];

const serviceOverrides = {
  pcc: {
    2: { title: 'Document submission & verification', desc: 'Relevant documents collected and verified' },
    3: { title: 'Background validation process', desc: 'Thorough background checks conducted' },
    4: { title: 'Certificate issuance', desc: 'Official clearance certificate delivered' },
  },
  'questioned-documents': {
    2: { title: 'Handwriting / signature sample', desc: 'Sample collection and secure gathering' },
    3: { title: 'Laboratory comparison', desc: 'Scientific analysis and comparison in lab' },
    4: { title: 'Authenticity verification report', desc: 'Court-admissible verification report delivered' },
  },
  fingerprint: {
    2: { title: 'Fingerprint recording / lifting', desc: 'Secure collection of fingerprint evidence' },
    3: { title: 'Pattern analysis', desc: 'Detailed scientific pattern comparison' },
    4: { title: 'Identification report', desc: 'Court-admissible identification report delivered' },
  },
  cyber: {
    2: { title: 'Digital evidence collection', desc: 'Secure acquisition of digital devices and data' },
    3: { title: 'Data recovery & cyber analysis', desc: 'In-depth technical forensic analysis' },
    4: { title: 'Technical forensic report', desc: 'Court-admissible digital findings report delivered' },
  },
  'crime-scene': {
    2: { title: 'On-site investigation', desc: 'Expert team deployment to the scene' },
    3: { title: 'Evidence documentation & preservation', desc: 'Secure evidence handling and logging' },
    4: { title: 'Scene reconstruction report', desc: 'Detailed scene analysis and reconstruction' },
  },
  polygraph: {
    2: { title: 'Subject preparation', desc: 'Pre-test interview and psychological setup' },
    3: { title: 'Controlled testing procedure', desc: 'Physiological monitoring and questioning' },
    4: { title: 'Behavioral analysis report', desc: 'Professional outcome and findings delivered' },
  },
  'workplace-assessments': {
    1: { title: 'Case briefing & internal review', desc: 'Experts assess the organizational context' },
    2: { title: 'Employee / environment analysis', desc: 'Relevant behavioral data collected securely' },
    3: { title: 'Risk & integrity assessment', desc: 'Detailed psychological and risk evaluation' },
    4: { title: 'Assessment report', desc: 'Professional assessment outcome delivered' },
  },
  'forensic-training': {
    1: { title: 'Program enrollment', desc: 'Register for specialized forensic courses' },
    2: { title: 'Structured training modules', desc: 'Comprehensive academic curriculum' },
    3: { title: 'Hands-on practical exposure', desc: 'Real-world forensic scene scenarios' },
    4: { title: 'Certification', desc: 'Professional certification delivered' },
  },
  'cross-examination': {
    1: { title: 'Case file review', desc: 'Detailed study of existing case files and expert preparation' },
    2: { title: 'Evidence interpretation', desc: 'Scientific review and opinion framing' },
    3: { title: 'Courtroom support', desc: 'Strategic cross-examination support during trial' },
    4: { title: 'Expert testimony', desc: 'Court-admissible expert testimony and clarification' },
  },
};

// ─── Motion Variants ──────────────────────────────────────────────────────────
//
// custom = isEven (boolean)
// Desktop: even cards (left col) slide in from LEFT (x: -80)
//          odd cards (right col) slide in from RIGHT (x: +80)
// Mobile:  always slide from right (x: +40) — avoids left-side clip

const cardVariants = {
  hidden: (isEven) => ({
    opacity: 0,
    x: typeof window !== 'undefined' && window.innerWidth < 768
      ? 40
      : (isEven ? -80 : 80),
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 130, damping: 22, mass: 1 },
  },
};

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: { type: 'spring', stiffness: 130, damping: 22, delay: 0.1 },
  },
};

// ─── Compact variant motion variants ─────────────────────────────────────────
// Even (left col) → enters from left; Odd (right col) → enters from right.
const compactCardVariants = {
  hidden: (isEven) => ({ opacity: 0, x: isEven ? -30 : 30 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 140, damping: 22, mass: 0.9 },
  },
};

const compactNodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.15, 1],
    opacity: 1,
    transition: { type: 'spring', stiffness: 140, damping: 22, delay: 0.08 },
  },
};

// ─── One row of the compact zig-zag ──────────────────────────────────────────
function CompactStep({ step, index }) {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    /*
      3-column grid: [card-left] [node] [card-right]
      grid-cols-[1fr_2rem_1fr] keeps both card columns equal and places
      the node column (2rem = 32px node width) exactly in the centre.
      Node is IN the DOM flow → no absolute top offsets, perfect alignment.
      `group` on the wrapper drives the hover-dark transition on the node.
    */
    <div className="group grid grid-cols-[1fr_2rem_1fr] items-center w-full mb-4 last:mb-0">

      {/* LEFT SLOT — card if even, empty spacer if odd */}
      {isEven ? (
        <motion.div
          custom={true}
          variants={compactCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4, margin: '0px 0px -20px 0px' }}
          className="bg-slate-50 border border-slate-200 rounded-lg p-3 mr-2 text-left"
        >
          <h4 className="text-[11px] font-bold text-slate-800 mb-0.5 leading-snug">{step.title}</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</p>
        </motion.div>
      ) : <div />}

      {/* CENTER NODE — always in col-2, always level with its card */}
      <motion.div
        variants={compactNodeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        className="
          w-8 h-8 rounded-full flex-shrink-0
          flex items-center justify-center
          border-2 border-slate-300
          bg-white text-slate-600
          group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white
          transition-colors duration-250 z-10
        "
      >
        <Icon size={13} strokeWidth={1.8} />
      </motion.div>

      {/* RIGHT SLOT — card if odd, empty spacer if even */}
      {isEven ? <div /> : (
        <motion.div
          custom={false}
          variants={compactCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4, margin: '0px 0px -20px 0px' }}
          className="bg-slate-50 border border-slate-200 rounded-lg p-3 ml-2 text-left"
        >
          <h4 className="text-[11px] font-bold text-slate-800 mb-0.5 leading-snug">{step.title}</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">{step.desc}</p>
        </motion.div>
      )}

    </div>
  );
}

// ─── Public component ──────────────────────────────────────────────────────────
export default function ServiceProcess({ serviceId, compact = false }) {
  const overrides = serviceOverrides[serviceId] || {};

  const steps = defaultSteps.map((step, i) =>
    overrides[i] ? { ...step, ...overrides[i] } : step
  );

  // ── COMPACT (sticky sidebar) — centred zig-zag grid ──────────────────────
  if (compact) {
    return (
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">
          Service Process
        </h3>

        {/*
          Track container.
          The central spine line runs at left-1/2 / -translate-x-1/2,
          bisecting the two-column sub-grid inside each CompactStep.
          overflow-x-hidden guards against the initial x-offset of cards.
        */}
        <div className="relative overflow-x-hidden">
          {/* Central spine line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200 z-0 pointer-events-none" />

          {steps.map((step, i) => <CompactStep key={i} step={step} index={i} />)}
        </div>
      </div>
    );
  }

  // ── FULL-PAGE CSS Grid zig-zag timeline ────────────────────────────────────
  return (
    <div className="bg-white py-20 border-b border-slate-100">
      <Container>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 3.6, ease: [1.16, 4, 1.3, 4] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">
            Forensic Service Process
          </h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            A structured, scientific approach ensuring accuracy, confidentiality,
            and legal admissibility at every step.
          </p>
        </motion.div>

        {/*
          ── TIMELINE TRACK ────────────────────────────────────────────────────
          overflow-x-hidden is critical: prevents the initial x-offset of
          motion cards from creating a horizontal scrollbar on page load.
        */}
        <div className="relative w-full max-w-5xl mx-auto px-4 py-4 overflow-x-hidden">

          {/*
            SPINE LINE
            ──────────────────────────────────────────────────────────────────
            Mobile:  left-6 (24px) — aligns with the center of the node circle
                     which is placed at left-6 -translate-x-1/2 (center at 24px).
            Desktop: left-1/2 -translate-x-1/2 — bisects the two-column grid.
          */}
          <div
            className="
              absolute top-0 bottom-0 w-0.5 bg-slate-200
              left-6
              md:left-1/2 md:-translate-x-1/2
              z-0 pointer-events-none
            "
          />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const Icon = step.icon;

            return (
              /*
                3-column grid: [left-card] [node] [right-card]
                ──────────────────────────────────────────────────────────────
                Mobile:  single column — node hidden, card full-width + pl-14.
                Desktop: grid-cols-[1fr_5rem_1fr]
                  • Col 1: left card slot (even steps)
                  • Col 2: centre node — in DOM flow, always level with card
                  • Col 3: right card slot (odd steps)

                `group` on the wrapper lets group-hover drive the node's
                dark-fill colour transition when hovering anywhere on the row.
              */
              <div
                key={index}
                className="group relative grid grid-cols-1 md:grid-cols-[1fr_5rem_1fr] w-full mb-12 last:mb-0 items-center"
              >

                {/*
                  MOBILE SPINE NODE (absolute, only visible below md)
                  Simple circle on the left spine — hidden on desktop where
                  the grid-flow node takes over.
                */}
                <motion.div
                  variants={nodeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="
                    md:hidden
                    absolute w-10 h-10 rounded-full
                    bg-white border-2 border-slate-300 text-slate-700
                    group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white
                    transition-colors duration-200
                    flex items-center justify-center
                    left-6 -translate-x-1/2 top-6
                    z-10
                  "
                >
                  <Icon size={15} strokeWidth={1.8} />
                </motion.div>

                {/* LEFT SLOT — card if even, empty spacer if odd */}
                {isEven ? (
                  <motion.div
                    custom={true}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25, margin: '0px 0px -80px 0px' }}
                    className="
                      relative overflow-hidden
                      bg-white border border-slate-200 rounded-xl p-6
                      transition-transform duration-300 hover:-translate-y-0.5
                      text-left w-full pl-14 md:pl-6
                    "
                  >
                    <span className="absolute top-3 right-4 text-5xl font-bold text-slate-100 select-none leading-none pointer-events-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Step {index + 1}</p>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 leading-snug tracking-tight pr-10">{step.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ) : <div className="hidden md:block" />}

                {/*
                  CENTRE NODE — desktop only, in DOM flow (col 2).
                  Because it lives in the grid, it is always vertically
                  centred with the card beside it — zero top-offset needed.
                */}
                <motion.div
                  variants={nodeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="
                    hidden md:flex
                    w-10 h-10 rounded-full mx-auto flex-shrink-0
                    items-center justify-center
                    bg-white border-2 border-slate-300 text-slate-700
                    group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white
                    transition-colors duration-200
                    z-10
                  "
                >
                  <Icon size={15} strokeWidth={1.8} />
                </motion.div>

                {/* RIGHT SLOT — card if odd, empty spacer if even */}
                {isEven ? <div className="hidden md:block" /> : (
                  <motion.div
                    custom={false}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25, margin: '0px 0px -80px 0px' }}
                    className="
                      relative overflow-hidden
                      bg-white border border-slate-200 rounded-xl p-6
                      transition-transform duration-300 hover:-translate-y-0.5
                      text-left w-full pl-14 md:pl-6
                    "
                  >
                    <span className="absolute top-3 right-4 text-5xl font-bold text-slate-100 select-none leading-none pointer-events-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1.5">Step {index + 1}</p>
                    <h3 className="text-sm md:text-base font-bold text-slate-900 mb-2 leading-snug tracking-tight pr-10">{step.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </motion.div>
                )}

              </div>
            );
          })}
        </div>

        {/* Footer disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 text-center max-w-2xl mx-auto border-t border-slate-200 pt-6 text-sm text-slate-400 leading-relaxed"
        >
          All reports are prepared in accordance with legal standards and are
          admissible in courts across India and abroad.
        </motion.p>

      </Container>
    </div>
  );
}
