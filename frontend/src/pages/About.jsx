import { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Target, Eye, ShieldCheck, CheckCircle2, Users, Calendar, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';

export default function About() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
  };

  const nextImage = () => {
    if (!selectedEvent) return;
    const allImages = [selectedEvent.coverImage, ...(selectedEvent.images || [])].filter(Boolean);
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!selectedEvent) return;
    const allImages = [selectedEvent.coverImage, ...(selectedEvent.images || [])].filter(Boolean);
    if (allImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm overflow-hidden">
          <div className="w-full max-w-[900px] bg-white rounded-xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-300 overflow-hidden" style={{ maxHeight: '90vh' }}>
            <button onClick={closeEventModal} className="absolute top-4 right-4 z-[60] text-slate-700 hover:text-black bg-white/80 hover:bg-white transition-colors rounded-full p-2 shadow-md">
              <X size={20} />
            </button>

            <div className="w-full flex flex-col h-full overflow-hidden">
              {/* Carousel Area (Sticky Top) */}
              <div className="w-full h-[260px] md:h-[320px] bg-slate-100 relative flex-shrink-0 group z-10">
                {(() => {
                  const allImages = [selectedEvent.coverImage, ...(selectedEvent.images || [])].filter(Boolean);
                  if (allImages.length > 0) {
                    return (
                      <>
                        {/* Blurred Background layer */}
                        <div className="absolute inset-0 overflow-hidden">
                          <img src={allImages[currentImageIndex]} className="w-full h-full object-cover blur-xl opacity-30 scale-110 transition-opacity duration-500 ease-in-out" alt="" />
                        </div>

                        {/* Actual Images with opacity transition */}
                        {allImages.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            loading="lazy"
                            alt="Event gallery"
                            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${idx === currentImageIndex ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}
                          />
                        ))}

                        {allImages.length > 1 && (
                          <div className="z-30 absolute inset-0 pointer-events-none">
                            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <ChevronLeft size={24} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <ChevronRight size={24} />
                            </button>

                            <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-3 py-2 rounded-full backdrop-blur-sm">
                              {allImages.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  } else {
                    return (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 z-20 relative">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <p>No images available</p>
                      </div>
                    );
                  }
                })()}
              </div>

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
