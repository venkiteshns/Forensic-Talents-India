import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { ArrowLeft, FileText, Image, Video, Download, Eye, Play, Loader2 } from 'lucide-react';
import bgImage from '../../assets/forensic-lab-bg.png';
import { CardSkeleton } from '../../components/ui/Skeletons';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://forensic-talents-india.onrender.com/api';

const TYPE_CONFIG = {
  pdf: { label: 'PDF', Icon: FileText, cta: 'Download', CtaIcon: Download, color: '#f87171' },
  image: { label: 'Image', Icon: Image, cta: 'Download', CtaIcon: Download, color: '#60a5fa' },
  youtube: { label: 'YouTube', Icon: Video, cta: 'Watch', CtaIcon: Play, color: '#f87171' },
};

function ResourceCard({ resource, index }) {
  const cfg = TYPE_CONFIG[resource.type] || TYPE_CONFIG.pdf;
  const { Icon, CtaIcon } = cfg;

  const isYoutube = resource.type === 'youtube';
  const isImage = resource.type === 'image';
  const isPdf = resource.type === 'pdf';

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };
  const ytId = isYoutube ? getYoutubeId(resource.fileUrl) : null;

  const getDownloadUrl = (url) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/fl_attachment/');
    }
    return url;
  };

  const actionUrl = (isPdf || isImage) ? getDownloadUrl(resource.fileUrl) : resource.fileUrl;

  return (
    <div className="group bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Media Preview (16:9 Aspect Ratio) */}
      <div className="relative w-full pt-[56.25%] bg-slate-50 border-b border-slate-100 overflow-hidden">
        {isImage && (
          <img src={resource.fileUrl} alt={resource.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        )}

        {isYoutube && ytId && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={resource.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
              loading="lazy"
            />
            <div className="relative z-10 w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:bg-red-500 transition-colors">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>
        )}
        {isYoutube && !ytId && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <Video size={32} className="text-slate-400" />
          </div>
        )}

        {isPdf && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {/* Background Image */}
            <img 
              src={`/images/pdf-bgs/${(index % 7) + 1}.png`} 
              alt="PDF Background" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              loading="lazy" 
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 to-slate-900/60 group-hover:from-slate-800/50 group-hover:to-slate-900/70 transition-colors duration-300"></div>
            
            {/* Icon and Label */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-white/20 shadow-lg">
                <FileText size={32} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white drop-shadow-md tracking-wide">PDF Document</span>
            </div>
          </div>
        )}

        {/* Type Badge Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm">
          <Icon size={14} style={{ color: cfg.color }} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-800 text-lg mb-2 leading-snug line-clamp-2">{resource.title}</h3>
        {resource.description && (
          <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{resource.description}</p>
        )}

        <a
          href={actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={isPdf || isImage}
          className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors shadow-sm"
        >
          <CtaIcon size={18} />
          {isPdf ? "Download PDF" : isImage ? "Download Image" : cfg.cta}
        </a>
      </div>
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Link 
            to="/education"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium backdrop-blur-md shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Education
          </Link>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
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
              {resources.map((r, index) => <ResourceCard key={r._id} resource={r} index={index} />)}
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
