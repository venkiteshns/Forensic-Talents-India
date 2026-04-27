import { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../components/ui/Container';
import { Eye, ShieldCheck, CheckCircle2, Users, Calendar, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';

export default function About() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide refs
  const autoSlideRef = useRef(null);
  const isPausedRef = useRef(false);

  // Touch / swipe refs
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getImages = useCallback(() => {
    if (!selectedEvent) return [];
    return [selectedEvent.coverImage, ...(selectedEvent.images || [])].filter(Boolean);
  }, [selectedEvent]);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    const imgs = getImages();
    if (imgs.length === 0) return;
    setIsTransitioning(true);
    setCurrentImageIndex(((index % imgs.length) + imgs.length) % imgs.length);
    setTimeout(() => setIsTransitioning(false), 420);
  }, [isTransitioning, getImages]);

  const nextImage = useCallback(() => {
    const imgs = getImages();
    if (imgs.length === 0) return;
    goTo(currentImageIndex + 1);
  }, [currentImageIndex, getImages, goTo]);

  const prevImage = useCallback(() => {
    const imgs = getImages();
    if (imgs.length === 0) return;
    goTo(currentImageIndex - 1);
  }, [currentImageIndex, getImages, goTo]);

  // ─── Auto-slide ────────────────────────────────────────────────────────────
  const startAutoSlide = useCallback(() => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentImageIndex((prev) => {
          const imgs = [selectedEvent?.coverImage, ...(selectedEvent?.images || [])].filter(Boolean);
          if (imgs.length <= 1) return prev;
          return (prev + 1) % imgs.length;
        });
      }
    }, 3500);
  }, [selectedEvent]);

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      setCurrentImageIndex(0);
      setIsTransitioning(false);
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
    return () => stopAutoSlide();
  }, [selectedEvent]);

  // ─── Modal open/close ─────────────────────────────────────────────────────
  const openEventModal = (event) => {
    setSelectedEvent(event);
  };

  const closeEventModal = () => {
    stopAutoSlide();
    setSelectedEvent(null);
  };

  // ─── Touch / Swipe handlers ───────────────────────────────────────────────
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isPausedRef.current = true;
  };

  const handleTouchMove = (e) => {
    // prevent vertical scroll hijack only when horizontal swipe is dominant
    if (touchStartXRef.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartXRef.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartYRef.current);
    if (dx > dy) e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    const threshold = 40;
    if (Math.abs(dx) > threshold) {
      dx < 0 ? nextImage() : prevImage();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    // Resume auto-slide after 2s
    setTimeout(() => { isPausedRef.current = false; }, 2000);
  };

  // Pause on hover (desktop)
  const handleMouseEnter = () => { isPausedRef.current = true; };
  const handleMouseLeave = () => { isPausedRef.current = false; };

  const offerings = [
    { title: "Questioned Document Examination (QDE)", desc: "Scientific analysis of disputed documents to determine authenticity, alterations, forgery, or fabrication." },
    { title: "Handwriting and Signature Analysis", desc: "Detailed examination of writing characteristics to establish authorship or detect forgery." },
    { title: "Fingerprint Examination", desc: "Identification and comparison of fingerprint impressions for personal identification and crime investigation." },
    { title: "Cyber Forensics", desc: "Recovery, preservation, and analysis of digital evidence from electronic devices and online platforms." },
    { title: "Forensic Psychology", desc: "Behavioral analysis, profiling, and psychological assessment relevant to criminal and civil cases." },
    { title: "Legal and Forensic Consultancy", desc: "Strategic guidance to legal professionals based on scientific findings." }
  ];

  const clients = [
    "Legal professionals and advocates",
    "Government agencies & law enforcement",
    "Banks and financial institutions",
    "Insurance companies",
    "Corporate entities",
    "Private individuals"
  ];

  const whyChooseUs = [
    "Highly trained & experienced forensic experts",
    "Court-admissible reports (Sec 45 IEA / Sec 39 BSA)",
    "Extensive courtroom cross-examination support",
    "State-of-the-art ethical methodologies",
    "Strict confidentiality and data security"
  ];

  return (
    <div className="bg-white pb-20">
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/about_banner.png" alt="About Forensic Talents" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">About Forensic Talents India</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            A distinguished and forward-thinking organization dedicated to delivering scientifically precise, ethically grounded forensic solutions. We bridge the critical gap between complex forensic science and the steadfast pursuit of justice, bringing absolute clarity to every investigation.
          </p>
        </Container>
      </section>

      {/* About & Welcome Details */}
      <section className="py-20 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">Welcome to Forensic Talents India</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Forensic Talents India stands as a distinguished and forward-thinking organization in the domain of forensic science and investigation, dedicated to delivering scientifically precise, ethically grounded, and legally admissible forensic solutions. The organization was established with a clear and purposeful vision—to bridge the longstanding gap between scientific analysis and legal interpretation, thereby strengthening the justice delivery system.
                </p>
                <p>
                  In an era where the complexity of crimes and disputes is constantly evolving, the need for accurate forensic intervention has become more critical than ever. Recognizing this demand, Forensic Talents India operates at the intersection of science, law, and technology, offering multidisciplinary expertise that supports both investigative processes and judicial outcomes.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-accent shadow-sm my-6">
                  <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-accent" /> Evidentiary Legal Value
                  </h3>
                  <p className="text-sm text-slate-700">
                    The organization provides expert opinions under <strong>Section 39 of the Bharatiya Sakshya Adhiniyam, 2023</strong>, which corresponds to <strong>Section 45 of the Indian Evidence Act</strong>. These expert opinions hold significant evidentiary value in courts, assisting judges and legal professionals in understanding technical aspects of evidence.
                  </p>
                </div>
                <p>
                  Additionally, the organization specializes in examining critical legal and financial documents, such as wills, property deeds, agreements, cheques, affidavits, certificates, contracts, and other disputed materials. Each case is handled with methodical precision, scientific rigor, and legal awareness, ensuring dependable outcomes.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-primary mb-4">About Us</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 italic border-l-2 border-slate-200 pl-4">
                  Forensic science is fundamentally defined as “the application of scientific principles and techniques for the purpose of law.” It plays an indispensable role in modern justice systems by enabling the objective discovery of truth through evidence-based analysis.
                </p>
                <div className="space-y-4">
                  <p className="font-bold text-slate-800 text-sm">This principle is translated into practice through the integration of:</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Advanced analytical techniques</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Modern forensic instruments</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Standardized methodologies</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent flex-shrink-0" /> Continuous research and innovation</li>
                  </ul>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    The organization is driven by a team of highly qualified, experienced, and specialized forensic professionals. Their work is guided by accuracy, impartiality, and adherence to legal standards, ensuring that every conclusion is scientifically valid and fully admissible during legal scrutiny and cross-examinations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Do & Why Choose Us */}
      <section className="py-16 bg-secondary-light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Offerings */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <ShieldCheck className="text-accent" /> What We Do
              </h3>
              <ul className="space-y-4">
                {offerings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={20} className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm leading-relaxed"><strong className="text-slate-800">{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Users className="text-accent" /> Why Choose Us
              </h3>
              <ul className="space-y-4">
                {whyChooseUs.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 size={20} className="text-accent mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Events & Activities */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-4">
            <Calendar className="text-accent h-8 w-8" />
            <h2 className="text-3xl font-heading font-bold text-primary">Events & Activities</h2>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No events found at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event._id} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => openEventModal(event)}>
                  <div className="h-48 relative overflow-hidden bg-slate-200">
                    {event.coverImage ? (
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                      <h3 className="text-white font-bold text-lg leading-snug">{event.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-4">{event.description}</p>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500 uppercase tracking-wider">
                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Date TBD'}
                      </span>
                      <span className="text-accent group-hover:text-primary transition-colors flex items-center gap-1">View Details <Eye size={14} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>


      {/* Clients */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-heading font-bold text-primary mb-10 text-center">Who We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {clients.map((client, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-lg text-center hover:bg-primary hover:text-white transition-colors duration-300">
                <p className="font-medium">{client}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm overflow-hidden"
          onClick={closeEventModal}
        >
          <div
            className="w-full max-w-[900px] bg-white rounded-xl shadow-2xl flex flex-col relative overflow-hidden"
            style={{ maxHeight: '90vh', animation: 'modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes modalIn {
                from { opacity: 0; transform: scale(0.93) translateY(12px); }
                to   { opacity: 1; transform: scale(1)   translateY(0); }
              }
              .carousel-track {
                display: flex;
                width: 100%;
                height: 100%;
                will-change: transform;
                transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .carousel-slide {
                flex: 0 0 100%;
                width: 100%;
                height: 100%;
                position: relative;
              }
              /* Dots */
              .carousel-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
                background: rgba(255,255,255,0.45);
                cursor: pointer;
                transition: background 0.25s, transform 0.25s;
                border: none;
                padding: 0;
              }
              .carousel-dot.active {
                background: #fff;
                transform: scale(1.35);
              }
              /* Arrow visibility: always visible on mobile, hover on desktop */
              .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.45);
                color: #fff;
                border: none;
                border-radius: 50%;
                padding: 8px;
                cursor: pointer;
                z-index: 40;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, opacity 0.2s;
                /* always visible on mobile */
                opacity: 0.75;
              }
              .carousel-arrow:hover { background: rgba(0,0,0,0.75); opacity: 1; }
              @media (min-width: 768px) {
                /* hidden by default on desktop; shown on group-hover */
                .carousel-arrow { opacity: 0; }
                .carousel-container:hover .carousel-arrow { opacity: 1; }
              }
            `}</style>

            <button
              onClick={closeEventModal}
              className="absolute top-4 right-4 z-[60] text-slate-700 hover:text-black bg-white/80 hover:bg-white transition-colors rounded-full p-2 shadow-md"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="w-full flex flex-col h-full overflow-hidden">
              {/* ── Carousel Area ── */}
              {(() => {
                const allImages = [selectedEvent.coverImage, ...(selectedEvent.images || [])].filter(Boolean);
                if (allImages.length > 0) {
                  return (
                    <div
                      className="carousel-container w-full h-[260px] md:h-[340px] bg-slate-900 relative flex-shrink-0 overflow-hidden"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Blurred ambient background */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <img
                          src={allImages[currentImageIndex]}
                          className="w-full h-full object-cover blur-2xl opacity-25 scale-110"
                          style={{ transition: 'opacity 0.5s ease' }}
                          alt=""
                          aria-hidden="true"
                        />
                      </div>

                      {/* Sliding track — translateX approach */}
                      <div
                        className="carousel-track z-10 relative"
                        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                      >
                        {allImages.map((src, idx) => (
                          <div key={idx} className="carousel-slide">
                            <img
                              src={src}
                              alt={`Event image ${idx + 1}`}
                              loading={idx === 0 ? 'eager' : 'lazy'}
                              draggable={false}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                userSelect: 'none',
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Arrows (only if >1 image) */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            className="carousel-arrow"
                            style={{ left: '12px' }}
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={22} />
                          </button>
                          <button
                            className="carousel-arrow"
                            style={{ right: '12px' }}
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            aria-label="Next image"
                          >
                            <ChevronRight size={22} />
                          </button>

                          {/* Dot indicators */}
                          <div
                            className="absolute bottom-4 left-1/2 z-50 flex gap-2 px-3 py-2 rounded-full"
                            style={{ transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)' }}
                          >
                            {allImages.map((_, idx) => (
                              <button
                                key={idx}
                                className={`carousel-dot${idx === currentImageIndex ? ' active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                                aria-label={`Go to image ${idx + 1}`}
                              />
                            ))}
                          </div>

                          {/* Image counter */}
                          <div
                            className="absolute top-3 right-3 z-50 text-xs font-semibold text-white px-2 py-1 rounded-full"
                            style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}
                          >
                            {currentImageIndex + 1} / {allImages.length}
                          </div>
                        </>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full h-[260px] md:h-[340px] bg-slate-100 flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                      <ImageIcon size={48} className="mb-2 opacity-40" />
                      <p className="text-sm">No images available</p>
                    </div>
                  );
                }
              })()}

              {/* Content Area (Scrollable) */}
              <div
                className="p-6 md:p-8 bg-white overflow-y-auto z-0"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style dangerouslySetInnerHTML={{
                  __html: `
                  .overflow-y-auto::-webkit-scrollbar { display: none; }
                `}} />

                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h3>
                <p className="text-sm text-accent mb-6 font-semibold uppercase tracking-wider">
                  {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBD'}
                </p>

                <div className="prose prose-slate prose-base max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
