import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, AnimatePresence, useInView, useMotionValue, useTransform, animate,
} from 'framer-motion';
import {
  ArrowRight, Shield, Search, FileText, Fingerprint, Monitor,
  GraduationCap, Scale, BrainCircuit, Users, Award, Activity,
  Bell, Leaf, Landmark, X,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import api from '../utils/api';
import ReviewsSection from '../components/education/ReviewsSection';
import SeamlessVideoBackground from '../components/home/SeamlessVideoBackground';


// ─── Motion System ────────────────────────────────────────────────
// Single source of truth. Tuned for premium pacing.
// IMPORTANT: willChange and backfaceVisibility are intentionally
// OMITTED — Framer Motion manages GPU layers internally.
// Setting them statically on every element simultaneously causes
// the "stuck on first frame" GPU spike at mount.

const SPRING = {
  entry: { type: 'spring', stiffness: 48, damping: 20, mass: 1.1 },
  card: { type: 'spring', stiffness: 60, damping: 22, mass: 0.95 },
  hover: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
};

// ── Variant definitions ──────────────────────────────────────────

// Stagger orchestrator: controls timing only, no visual state.
// delayChildren: pause before first child animates (lets parent settle)
// staggerChildren: gap between each sibling's entrance
const staggerContainer = (stagger = 0.1, delay = 2) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// Word clip-reveal: used for hero headline words.
const wordReveal = {
  hidden: { y: '108%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { type: 'spring', stiffness: 52, damping: 20, mass: 1 },
  },
};

// Section entrance: fade + rise for section-level containers.
const sectionFadeUp = {
  hidden: { y: 44, opacity: 0 },
  show: { y: 0, opacity: 1, transition: SPRING.entry },
};

// Card entrance: y:40 gives enough vertical travel to read the cascade.
// Spring: damping 20, stiffness 80, mass 1 — slightly heavy, not bouncy.
const cardReveal = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0, opacity: 1,
    transition: { type: 'spring', damping: 20, stiffness: 80, mass: 1 },
  },
};

// Stat reveal: scale + fade for number blocks.
const statReveal = {
  hidden: { scale: 0.88, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: SPRING.card },
};

// ─── Hero Variants ──────────────────────────────────────────────────
// Pure variant architecture — FOUC FIX.
//
// WHY THIS ELIMINATES FOUC:
// When Framer Motion sees initial="hidden" on a parent with staggerChildren,
// it applies the `hidden` variant to every child SYNCHRONOUSLY during
// React's render phase — before the browser's first paint.
// This is fundamentally different from useAnimation/useEffect which fire
// AFTER the first paint (in the microtask queue), causing the flash.
//
// The browser paints: everything already invisible.
// Then animate="visible" propagates down the variant tree.
// Zero flash. Zero jank. Zero setTimeout.

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1,
    },
  },
};

// Logo: scale-up + fade — first in the stagger chain
const heroLogo = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 40, damping: 15, mass: 1.5 },
  },
};

// Headline word: clip-reveal rises from behind overflow mask
const heroWord = {
  hidden: { y: '108%', opacity: 0 },
  visible: {
    y: '0%', opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Sub-copy + CTAs: fade + gentle rise
const heroFadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 40, damping: 15, mass: 1.5 },
  },
};

// ─── Scroll Reveal Wrapper ─────────────────────────────────────────

function AnimatedCounter({ from, to, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isInView, count, to]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

function FadeInSection({ children, className = '', delay = 0.3 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });

  return (
    <motion.div
      ref={ref}
      variants={sectionFadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ ...SPRING.entry, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Grid ──────────────────────────────────────────────────
// Pure layout wrapper — animation has moved to each individual Card.
// No motion here: each Card owns its viewport observer so mobile
// cards lower in the stack don't animate before the user reaches them.

function StaggerGrid({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

// ─── Card ──────────────────────────────────────────────────────────
// Each Card owns its own whileInView observer.
//
// WHY THIS IS CORRECT FOR MOBILE:
// With a parent stagger, all 11 cards register their animations at the
// moment the parent enters view. On mobile they're stacked vertically
// — cards 8-11 are hundreds of pixels below the fold and animate
// while invisible. With per-card viewport tracking (margin: '-50px'),
// each card waits until it is specifically 50px inside the screen.
//
// DESKTOP STAGGER via `delay: (index % 3) * 0.1`:
// On a 3-column desktop row, all 3 cards enter the viewport at the
// same moment. The index-modulo delay recreates the left-to-right
// sweep without a parent observer: card 0 = 0ms, card 1 = 100ms,
// card 2 = 200ms. On mobile (1-column), each card enters at a
// different scroll position so the delay is 0 for every card —
// the natural scroll provides the stagger.

function Card({ children, className = '', index = 0, divide = 3 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1, y: 0,
          transition: {
            type: 'spring', damping: 22, stiffness: 90, mass: 1,
            // Left-to-right sweep on desktop rows; 0 on mobile (natural scroll stagger)
            delay: (index % divide) * 0.2,
          },
        },
      }}
      whileHover={{
        y: -5,
        scale: 1.01,
        boxShadow: '0 24px 56px rgba(0,0,0,0.10)',
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.99, transition: { duration: 0.08 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Quiz Alert Banner ─────────────────────────────────────────────

function useQuizCountdown(scheduledDateStr) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isQuizActive, setIsQuizActive] = useState(false);

  useEffect(() => {
    if (!scheduledDateStr) return;
    const target = new Date(scheduledDateStr).getTime();

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setIsQuizActive(true);
        setTimeLeft('00h 00m 00s');
        return;
      }

      setIsQuizActive(false);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

      if (d > 0) {
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      } else {
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [scheduledDateStr]);

  return { timeLeft, isQuizActive };
}

function QuizAlertBanner({ quiz }) {
  const [dismissed, setDismissed] = useState(false);
  const { timeLeft, isQuizActive: countdownComplete } = useQuizCountdown(quiz.upcomingQuizDate);

  const handleDismiss = useCallback(() => setDismissed(true), []);

  const isActive = quiz.status === 'ACTIVE' || (quiz.upcomingQuizVisible && countdownComplete);
  const isUpcoming = quiz.upcomingQuizVisible && !countdownComplete && quiz.upcomingQuizDate;
  const isRegistration = quiz.registrationEnabled;

  const shouldShow = !dismissed && (isActive || isUpcoming || isRegistration);

  let message = '';
  let ctaText = '';
  let showButton = true;
  let showTimer = false;
  let dateText = '';

  if (isActive) {
    message = 'Monthly Forensic Quiz is now live. Participate now and test your knowledge.';
    ctaText = 'Start Quiz';
  } else if (isUpcoming) {
    message = quiz.upcomingQuizName || 'Upcoming Monthly Forensic Quiz';
    dateText = new Date(quiz.upcomingQuizDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    ctaText = 'Attend Quiz';
    showButton = false;
    showTimer = true;
  } else if (isRegistration) {
    message = 'Registrations are now open for the upcoming Monthly Forensic Quiz.';
    ctaText = 'Register Now';
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="banner"
          initial={{ opacity: 0, x: "-50%", y: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="absolute top-full left-1/2 mt-4 w-[90%] max-w-4xl z-50"
        >
          <motion.div layout className="relative overflow-hidden w-full rounded-2xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md">

            {/* Mobile Absolute Close Button */}
            <button
              onClick={handleDismiss}
              className="md:hidden absolute top-3 right-3 text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Icon + Text */}
            <div className="flex items-start sm:items-center gap-3.5 pr-10 md:pr-0">
              <div className="flex shrink-0 mt-0.5 sm:mt-0 items-center justify-center w-8 h-8 rounded-full bg-white/10 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)] border border-white/10">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-[15px] leading-snug text-slate-100 tracking-wide">
                  Quiz: {message}
                </span>
                {dateText && (
                  <span className="text-[13px] text-white/60 font-medium">
                    Scheduled: {dateText}
                  </span>
                )}
              </div>
            </div>

            {/* Right Side: CTA / Timer + Close */}
            <div className="flex items-center justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/10 md:border-t-0">
              <AnimatePresence mode="popLayout">
                {showTimer ? (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex-1 md:flex-none flex items-center justify-center md:justify-end py-1.5"
                  >
                    <span className="font-mono tabular-nums text-emerald-400 font-bold text-[17px] tracking-wider drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                      {timeLeft}
                    </span>
                  </motion.div>
                ) : showButton ? (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex-1 md:flex-none"
                  >
                    <Link
                      to="/education/quiz#quiz_box_section"
                      className="flex w-full items-center justify-center py-2 px-6 rounded-lg text-white text-[15px] font-bold bg-emerald-500 hover:scale-105 hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap"
                    >
                      {ctaText}
                    </Link>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                onClick={handleDismiss}
                className="hidden md:flex text-white/40 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Infinite Marquee ──────────────────────────────────────────────

const STATIC_SERVICE_ITEMS = [
  { label: 'Cyber Forensics', type: 'SERVICE' },
  { label: 'Questioned Document Examination', type: 'SERVICE' },
  { label: 'Audio & Video Forensics', type: 'SERVICE' },
  { label: 'Financial Forensic Investigation', type: 'SERVICE' },
  { label: 'Fingerprint Analysis', type: 'SERVICE' },
  { label: 'Malware Investigation', type: 'SERVICE' },
  { label: 'Court-Admissible Reporting', type: 'SERVICE' },
  { label: 'OSINT Intelligence', type: 'SERVICE' },
  { label: 'Police Clearance Certificate', type: 'SERVICE' },
  { label: 'Workplace Assessments', type: 'SERVICE' },
  { label: 'Professional Forensic Training', type: 'SERVICE' },
  { label: 'Environmental Forensics', type: 'SERVICE' },
  { label: 'Financial Forensic Investigations', type: 'SERVICE' },
  { label: 'Crime Scene Investigation', type: 'SERVICE' },
  { label: 'Cross Examination', type: 'SERVICE' },
  { label: 'Polygraph Examination', type: 'SERVICE' },
];

function useMarqueeItems() {
  const [items, setItems] = useState(STATIC_SERVICE_ITEMS);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.get('/courses'),
      api.get('/internships'),
    ]).then(([coursesRes, internshipsRes]) => {
      if (cancelled) return;
      const courseItems = (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value.data))
        ? coursesRes.value.data.map(c => ({ label: c.category, sub: c.title, type: 'COURSE' }))
        : [];
      const internshipItems = (internshipsRes.status === 'fulfilled' && Array.isArray(internshipsRes.value.data))
        ? internshipsRes.value.data.filter(i => i.isActive !== false).map(i => ({ label: `${i.mode === 'online' ? 'Internship - Online' : 'Internship - Offline'}`, sub: i.duration, type: 'INTERNSHIP' }))
        : [];
      const buckets = [STATIC_SERVICE_ITEMS, courseItems, internshipItems];
      const merged = [];
      const maxLen = Math.max(...buckets.map(b => b.length));
      for (let i = 0; i < maxLen; i++) {
        buckets.forEach(bucket => { if (i < bucket.length) merged.push(bucket[i]); });
      }
      if (merged.length > 0) setItems(merged);
    });
    return () => { cancelled = true; };
  }, []);

  return items;
}

function InfiniteMarquee() {
  const rawItems = useMarqueeItems();
  const items = [...rawItems, ...rawItems];
  return (
    <div className="overflow-hidden relative select-none">
      <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 44, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2, scale: 1.01, transition: { type: 'spring', stiffness: 280, damping: 26 } }}
            className={`px-4 py-2.5 md:px-5 rounded-md border whitespace-nowrap flex items-center gap-2.5 cursor-default ${item.type === 'SERVICE'
              ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              : item.type === 'INTERNSHIP'
                ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-300/80 hover:bg-emerald-400/10 hover:text-emerald-300'
                : 'border-accent/20 bg-accent/5 text-accent/80 hover:bg-accent/10 hover:text-accent'
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.type === 'SERVICE' ? 'bg-slate-400/60'
              : item.type === 'INTERNSHIP' ? 'bg-emerald-400/70'
                : 'bg-accent/70'
              }`} />
            <span className="text-sm font-medium">{item.label}</span>
            {item.sub && <span className="text-[12px] opacity-50 font-normal">{item.sub}</span>}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}


// ─── Home Page ─────────────────────────────────────────────────────

export default function Home() {
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get('/quiz/latest');
        if (res.data && (res.data.status === 'ACTIVE' || res.data.registrationEnabled || res.data.upcomingQuizVisible)) {
          setActiveQuiz(res.data);
        }
      } catch (err) {
        console.error('Error fetching quiz', err);
      }
    };
    fetchQuiz();
  }, []);

  const services = [
    { id: 'pcc', title: 'Police Clearance', desc: 'Secure PCC for visa & employment securely.', icon: <Shield size={24} /> },
    { id: 'questioned-documents', title: 'Questioned Documents', desc: 'Verify authenticity and detect forgery scientifically.', icon: <FileText size={24} /> },
    { id: 'fingerprint', title: 'Fingerprint Investigation', desc: 'Accurate identification with unique ridge patterns.', icon: <Fingerprint size={24} /> },
    { id: 'cyber', title: 'Cyber Forensics', desc: 'Digital evidence recovery and data analysis.', icon: <Monitor size={24} /> },
    { id: 'crime-scene', title: 'Crime Scene Investigation', desc: 'Systematic analysis and evidence collection.', icon: <Search size={24} /> },
    { id: 'cross-examination', title: 'Cross Examination', desc: 'Critical evaluation of forensic evidence in courts.', icon: <Scale size={24} /> },
    { id: 'polygraph', title: 'Polygraph Examination', desc: 'Accurately assess truthfulness with advanced physiological monitoring.', icon: <Activity size={24} /> },
    { id: 'workplace-assessments', title: 'Workplace Assessments', desc: 'Scientific evaluation of workforce behavior, psychological risks, and performance using forensic methodologies.', icon: <Users size={24} /> },
    { id: 'forensic-training', title: 'Professional Forensic Training', desc: 'Advanced, research-based forensic training programs designed for legal, corporate, and investigative professionals.', icon: <GraduationCap size={24} /> },
    { id: 'environmental', title: 'Environmental Forensics', desc: 'Identifying pollution sources and environmental damages through advanced scientific analysis and site assessment.', icon: <Leaf size={24} /> },
    { id: 'financial', title: 'Financial Forensic Investigations', desc: 'Detecting, analyzing, and preventing financial fraud and irregularities to maintain financial integrity.', icon: <Landmark size={24} /> },
  ];

  const stats = [
    { target: 450, suffix: '+', label: 'Forensic Cases Handled' },
    { target: 50, suffix: '+', label: 'Theft Cases Solved' },
    { target: 500, suffix: '+', label: 'Professionals Trained' },
  ];

  const eduItems = [
    { to: 'education/quiz', Icon: BrainCircuit, label: 'Quiz' },
    { to: '/education/internships', Icon: GraduationCap, label: 'Internship' },
    { to: 'education/certificates', Icon: Award, label: 'Certificate Courses' },
    { to: '/education/blogs', Icon: FileText, label: 'Blogs' },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <motion.section layout className="relative pt-24 pb-32 bg-primary overflow-hidden flex flex-col gap-6">
        <SeamlessVideoBackground />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[480px] h-[480px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        {/* ────────────────────────────────────────────────────────────
             Hero Content — single orchestrating parent
             initial="hidden" propagates to ALL children synchronously
             during React render, before the first browser paint.
             animate="visible" then drives the stagger chain.
             No useAnimation. No useEffect. No setTimeout. No rAF.
        ──────────────────────────────────────────────────────────── */}
        <Container className="relative z-10 flex flex-col items-center text-center pb-20">
          <motion.div
            layout
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center w-full"
          >

            {/* 1 ─ Logo: scale-up + fade, first stagger child */}
            <motion.div layout variants={heroLogo} className="mb-8">
              <img
                src="/assets/logo.png"
                alt="Forensic Talents India"
                className="h-28 md:h-36 mx-auto object-contain bg-white rounded-lg p-2"
                draggable={false}
                fetchPriority="high"
                loading="eager"
              />
            </motion.div>

            {/* 2 ─ Headline: each word is a stagger child with clip-reveal */}
            <motion.h1
              layout
              className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight"
              variants={staggerContainer(0.18, 0)}
            >
              <span className="overflow-hidden inline-block mr-3 pb-2">
                <motion.span className="inline-block" variants={heroWord}>
                  Scientific Truth.
                </motion.span>
              </span>
              <span className="overflow-hidden inline-block text-accent pb-2">
                <motion.span className="inline-block" variants={heroWord}>
                  Legal Strength.
                </motion.span>
              </span>
            </motion.h1>

            {/* 3 ─ Sub-copy: fade + rise, no overflow-hidden (avoids font-reflow bleed) */}
            <motion.p
              layout
              className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl"
              variants={heroFadeUp}
            >
              Delivering scientifically precise, ethically grounded, and legally
              admissible forensic solutions to strengthen the justice delivery system.
            </motion.p>

            {/* 4 ─ CTAs: last in the chain */}
            <motion.div
              layout
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={heroFadeUp}
            >
              <motion.div
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING.hover}
              >
                <Button variant="accent" size="lg" className="group">
                  <Link to="/contact" className="flex items-center gap-2">
                    Book Consultation <ArrowRight size={20} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING.hover}
              >
                <Button variant="secondary" size="lg">
                  <Link to="/services">Explore Services</Link>
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>
        </Container>
      </motion.section>

      {/* ─── TRUSTED INSTITUTIONS MARQUEE ──────────────────────── */}
      <section className="relative w-full py-10 bg-primary border-t border-white/10">
        <FadeInSection>
          <p className="text-center text-[11px] font-semibold tracking-widest text-slate-400 uppercase mb-6">
            Forensic Services &nbsp;·&nbsp; Certified Courses & Internship Programs &nbsp;·&nbsp; Investigation Specializations
          </p>
        </FadeInSection>
        <InfiniteMarquee />

        {/* ─── FLOATING QUIZ ALERT NOTIFICATION ──────────────────── */}
        <AnimatePresence>
          {activeQuiz && <QuizAlertBanner quiz={activeQuiz} />}
        </AnimatePresence>
      </section>

      {/* ─── ABOUT PREVIEW ─────────────────────────────────────── */}
      <section className="pt-48 pb-24 md:pt-36 bg-white">
        <Container>
          <FadeInSection>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">About Forensic Talents India</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                We operate at the intersection of science, law, and technology. Our deeply qualified experts provide multidisciplinary forensic solutions ranging from questioned documents to cyber forensics. Reports and expert opinions provided are valid under Section 39 of the Bharatiya Sakshya Adhiniyam, 2023 (Section 45 of the Indian Evidence Act), highly respected across Indian and International courts.
              </p>
              <motion.div whileHover={{ x: 3 }} transition={SPRING.hover}>
                <Button variant="ghost">
                  <Link to="/about" className="flex items-center gap-2 font-semibold">
                    About Us <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* ─── SERVICES GRID ─────────────────────────────────────── */}
      {/*
        FIX: StaggerGrid is the single animation orchestrator.
        Card children use inherited variants — no competing whileInView.
        This eliminates the race condition between parent + child observers.
      */}
      <section className="py-20 bg-secondary-light">
        <Container>
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Our Expertise</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Comprehensive forensic interventions tailored to support investigative processes and judicial outcomes.
              </p>
            </div>
          </FadeInSection>

          <StaggerGrid
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            stagger={0.07}
          >
            {services.map((srv, i) => (
              <Card key={srv.id} index={i} >
                <Link to={`/services/${srv.id}`} className="group block h-full">
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-accent h-full">
                    <motion.div
                      className="w-14 h-14 bg-primary/5 text-primary rounded-lg flex items-center justify-center mb-6"
                      whileHover={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                      transition={{ duration: 1.0 }}
                    >
                      {srv.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-primary mb-3">{srv.title}</h3>
                    <p className="text-slate-600 mb-6">{srv.desc}</p>
                    <span className="text-accent font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                      View Details <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </Card>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* ─── EDUCATION PREVIEW ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <Container>
          <FadeInSection>
            <div className="mb-12 relative flex justify-between items-end">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-800 mb-2">Education</h2>
                <div className="h-1 w-20 bg-accent rounded-full relative">
                  <div className="absolute top-1/2 left-6 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <Link
                to="/education"
                className="hidden md:flex items-center text-accent font-semibold hover:text-accent-light transition-colors group"
              >
                Show more <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInSection>

          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" stagger={0.10}>
            {eduItems.map(({ to, Icon, label }, i) => (
              <Card key={to} index={i} divide={4}>
                <Link
                  to={to}
                  className="bg-slate-50 hover:bg-white py-6 px-4 md:p-8 border border-transparent border-l-4 border-l-accent hover:border-slate-100 rounded-lg flex flex-col items-center justify-center text-center aspect-auto md:aspect-square transition-colors group"
                >
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  >
                    <Icon className="w-8 h-8 md:w-12 md:h-12 text-accent mb-2 md:mb-4" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="text-sm md:text-lg font-bold text-slate-700 leading-tight">{label}</h3>
                </Link>
              </Card>
            ))}
          </StaggerGrid>

          <div className="mt-8 text-center md:hidden">
            <Link to="/education" className="inline-flex items-center text-accent font-semibold hover:text-accent-light transition-colors group">
              Show more <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── STATS BANNER ──────────────────────────────────────── */}
      <section className="py-16 bg-primary text-white">
        <Container>
          <StaggerGrid
            className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-white/20"
            stagger={0.14}
          >
            {stats.map((stat, idx) => (
              <motion.div key={idx} className="pt-6 md:pt-0" variants={statReveal}>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  <AnimatedCounter from={0} to={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-slate-300 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      {/* ─── REVIEWS ───────────────────────────────────────────── */}
      <FadeInSection>
        <ReviewsSection />
      </FadeInSection>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white text-center">
        <Container>
          <FadeInSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                Get Expert Forensic Support Today
              </h2>
              <p className="text-slate-600 mb-10 text-lg">
                Whether you need document verification, crime scene analysis, or expert cross-examination support, we are here to provide definitive scientific truth.
              </p>
              <motion.div
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING.hover}
                className="inline-block"
              >
                <Button variant="primary" size="lg">
                  <Link to="/contact">Request a Callback</Link>
                </Button>
              </motion.div>
            </div>
          </FadeInSection>
        </Container>
      </section>

    </div>
  );
}