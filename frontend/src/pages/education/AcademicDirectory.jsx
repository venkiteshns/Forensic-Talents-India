import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/ui/Container';
import { ArrowLeft, ExternalLink, MapPin, Building2, ChevronDown, Search, X } from 'lucide-react';
import { academicDirectoryData } from '../../data/academicDirectoryData';
import { containerVariants, textVariants } from '../../animations';

// ─── Motion Variants ────────────────────────────────────────────────────────
// Each row is an independent viewport observer. margin: "0px 0px -60px 0px"
// ensures rows below the fold never animate until the user scrolls there.
const rowVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,          // subtle 40ms per-row cascade
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],  // Apple quiet-luxury deceleration
    },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Constants ──────────────────────────────────────────────────────────────
const ALL_STATES = Object.keys(academicDirectoryData.states).sort();
const ALL_FILTER = 'All States';

// ─── Sub-components ─────────────────────────────────────────────────────────

function NationalCard({ institution }) {
  const campuses = institution.locations.split(',').map((l) => l.trim());
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <a
              href={institution.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-900 text-base hover:text-primary transition-colors leading-snug group flex items-center gap-1.5"
            >
              {institution.name}
              <ExternalLink size={13} className="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
            </a>
            <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">National University</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {campuses.map((campus, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1"
          >
            <MapPin size={10} className="text-slate-400 flex-shrink-0" />
            {campus}
          </span>
        ))}
      </div>
    </div>
  );
}

function InstitutionRow({ institution, index }) {
  return (
    <motion.div
      variants={rowVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: '0px 0px -60px 0px' }}
      className="group flex flex-col items-start gap-2 py-4 border-b border-slate-100 last:border-0 md:flex-row md:items-center md:justify-between md:gap-4"
    >
      {/* Col 1 – Icon + Institution Name */}
      <div className="flex items-start gap-3 pr-4 w-full md:w-auto md:min-w-0">
        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-primary/10 transition-colors flex items-center justify-center flex-shrink-0 mt-0.5">
          <Building2 size={13} className="text-slate-500 group-hover:text-primary transition-colors" />
        </div>
        <div className="min-w-0 flex-1">
          <a
            href={institution.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-start gap-1.5"
          >
            {/* No truncate — name wraps freely on mobile */}
            <span className="font-semibold text-slate-800 hover:text-primary transition-colors text-sm leading-snug break-words">
              {institution.name}
            </span>
            <ExternalLink
              size={11}
              className="opacity-0 group-hover/link:opacity-50 transition-opacity mt-0.5 flex-shrink-0"
            />
          </a>
          {/* City badge: stacks below name on mobile only */}
          <div className="flex items-center gap-1 mt-1 md:hidden">
            <MapPin size={11} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500 font-medium">{institution.city}</span>
          </div>
        </div>
      </div>

      {/* Col 2 – City: right-aligned on desktop, hidden on mobile (shown above) */}
      <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
        <MapPin size={12} className="text-slate-400" />
        <span className="text-sm text-slate-500 font-medium">{institution.city}</span>
      </div>
    </motion.div>
  );
}

function StateSection({ stateName, institutions }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -80px 0px' }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
    >
      {/* State Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h3 className="font-bold text-slate-800 text-sm tracking-wide">{stateName}</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 rounded-full px-2.5 py-0.5">
          {institutions.length} {institutions.length === 1 ? 'institution' : 'institutions'}
        </span>
      </div>

      {/* Rows */}
      <div className="px-6 divide-y divide-slate-50">
        {institutions.map((inst, i) => (
          <InstitutionRow key={i} institution={inst} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <Search size={24} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No institutions found</h3>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
        {query
          ? `No results match "${query}". Try a different state or clear your search.`
          : 'No institutions available for the selected filter.'}
      </p>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AcademicDirectory() {
  const [selectedState, setSelectedState] = useState(ALL_FILTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [dropdownOpen]);

  // Derived filtered data
  const filteredStates = useMemo(() => {
    const statesObj = academicDirectoryData.states;
    const q = searchQuery.toLowerCase().trim();

    const entries =
      selectedState === ALL_FILTER
        ? Object.entries(statesObj)
        : [[selectedState, statesObj[selectedState] ?? []]];

    return entries
      .map(([state, institutions]) => ({
        state,
        institutions: q
          ? institutions.filter(
              (inst) =>
                inst.name.toLowerCase().includes(q) ||
                inst.city.toLowerCase().includes(q)
            )
          : institutions,
      }))
      .filter(({ institutions }) => institutions.length > 0)
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [selectedState, searchQuery]);

  const totalCount = filteredStates.reduce((acc, s) => acc + s.institutions.length, 0);
  const isEmpty = filteredStates.length === 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={containerVariants}
        className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-12"
        style={{ minHeight: '340px' }}
      >
        {/* Back link */}
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Link
            to="/education"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium backdrop-blur-md shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Education
          </Link>
        </div>

        <div className="absolute inset-0 z-0">
          <img
            src="/images/banners/education_banner.webp"
            alt="Institutional Directory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]" />
        </div>

        <Container className="relative z-10">
          <motion.div variants={containerVariants} className="max-w-4xl mx-auto">
            <motion.h1
              variants={textVariants}
              className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
            >
              Institutional Directory
            </motion.h1>
            <motion.p
              variants={textVariants}
              className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              A meticulously compiled registry of authorized universities and institutions
              offering recognized forensic science qualifications across India.
            </motion.p>
          </motion.div>
        </Container>
      </motion.section>

      <Container>

        {/* ── National Universities ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 px-3">
              National Universities
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {academicDirectoryData.national.map((inst, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <NationalCard institution={inst} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Sticky Filter Bar ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-sm py-4 mb-8 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search institution or city…"
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* State Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-primary/40 transition-colors min-w-[180px] justify-between"
              >
                <span className="truncate">{selectedState}</span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="max-h-72 overflow-y-auto py-1.5">
                      {[ALL_FILTER, ...ALL_STATES].map((state) => (
                        <button
                          key={state}
                          onClick={() => {
                            setSelectedState(state);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                            selectedState === state
                              ? 'bg-primary/5 text-primary font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result count pill */}
            {!isEmpty && (
              <span className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1.5 whitespace-nowrap">
                {totalCount} institutions
              </span>
            )}
          </div>
        </div>

        {/* ── State Grid ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <EmptyState key="empty" query={searchQuery} />
          ) : (
            <motion.div
              key={`${selectedState}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-6"
            >
              {filteredStates.map(({ state, institutions }) => (
                <StateSection key={state} stateName={state} institutions={institutions} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </Container>
    </div>
  );
}
