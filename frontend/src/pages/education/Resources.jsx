import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { ArrowLeft, FileText, Image, Video, Download, Eye, Play, Loader2 } from 'lucide-react';
import bgImage from '../../assets/forensic-lab-bg.png';

const API_URL = 'https://forensic-talents-india.onrender.com/api';

const TYPE_CONFIG = {
  pdf:     { label: 'PDF',     Icon: FileText, cta: 'Download', CtaIcon: Download, accent: '#DC2626', bg: '#FEF2F2' },
  image:   { label: 'Image',   Icon: Image,    cta: 'View',     CtaIcon: Eye,      accent: '#2563EB', bg: '#EFF6FF' },
  youtube: { label: 'YouTube', Icon: Video,    cta: 'Watch',    CtaIcon: Play,     accent: '#DC2626', bg: '#FFF1F2' },
};

function ResourceCard({ resource }) {
  const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.pdf;
  const { Icon, CtaIcon } = cfg;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Type banner */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: cfg.bg }}>
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Icon size={20} style={{ color: cfg.accent }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cfg.accent }}>
          {cfg.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-800 text-base mb-2 leading-snug">{resource.title}</h3>
        {resource.description && (
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{resource.description}</p>
        )}

        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: cfg.accent }}
        >
          <CtaIcon size={16} />
          {cfg.cta}
        </a>
      </div>
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/resources`)
      .then(r => r.json())
      .then(data => setResources(Array.isArray(data) ? data : []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  const hasResources = resources.length > 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Hero */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16 overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-[#0B1120]/70 backdrop-blur-[1px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 drop-shadow-md">
              Forensic Resources &amp; Downloads
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              Professional materials to enhance your forensic knowledge and career growth.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : hasResources ? (
          <>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Available Resources</h2>
                <p className="text-slate-500 text-sm mt-1">{resources.length} resource{resources.length !== 1 ? 's' : ''} available</p>
              </div>
              <Link to="/education" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                <ArrowLeft size={16} /> Back to Education
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(r => <ResourceCard key={r._id} resource={r} />)}
            </div>
          </>
        ) : (
          /* Coming soon fallback */
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl duration-700 animate-in fade-in slide-in-from-bottom-8 md:p-16">
              {/* Background Accent */}
              <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />
              
              {/* Icon */}
              <div className="mb-8 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 shadow-inner">
                  <FileText size={48} className="text-accent" />
                </div>
              </div>

              <h2 className="mb-6 font-heading text-3xl font-bold text-slate-800">
                Resources Coming Soon
              </h2>
              
              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
                Downloadable resources will be available soon.
                <br /><br />
                We are preparing high-quality forensic materials, guides, and reference documents to support students, professionals, and legal experts. These resources will be updated shortly to provide valuable insights and practical knowledge.
              </p>

              {/* Expectations block */}
              <div className="mx-auto mb-12 max-w-2xl rounded-2xl border border-slate-100 bg-slate-50 p-8 text-left shadow-sm">
                <h3 className="mb-4 text-center font-bold text-slate-800">What to expect:</h3>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    "Career-focused forensic materials",
                    "Case-based learning resources",
                    "Legal and investigative reference guides",
                    "Industry-relevant documentation"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-3 mt-1 flex h-2 w-2 flex-shrink-0 items-center justify-center rounded-full bg-primary" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/education" className="flex w-full items-center justify-center rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark sm:w-auto">
                  <ArrowLeft size={20} className="mr-2" /> Back to Education
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
