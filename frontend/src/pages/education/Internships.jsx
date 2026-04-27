import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Award, Briefcase, MapPin, Search, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { EnrollModal } from '../../components/education/EnrollModal';
import { PageIntro, AdvantagesList, WhyChooseUs } from '../../components/education/SharedSections';
import { CardSkeleton } from '../../components/ui/Skeletons';
import api from '../../utils/api';

export default function Internships() {
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInternships = async () => {
      try {
        const res = await api.get('/internships');
        setInternships(res.data.filter(i => i.isActive));
      } catch (error) {
        console.error("Error fetching internships", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const handleEnrollClick = (category, duration) => {
    setEnrollModal({ isOpen: true, course: { category, prog: { duration } } });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Header Section */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}>
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Link 
            to="/education"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium backdrop-blur-md shadow-sm"
          >
            <ArrowLeft size={18} /> Back to Education
          </Link>
        </div>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/education_banner.png" alt="Internships Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Internship Program
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
              Jumpstart your career and acquire practical, real-world experience in a professional forensic environment.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro & Advantages */}
      <PageIntro
        title="Hands-On Forensic Experience"
        text="Immerse yourself in authentic investigative scenarios. Our internship programs provide crucial real-world and simulated case exposure, fostering critical skill development in evidence handling, crime scene management, and analytical reasoning."
      />
      <AdvantagesList
        title="Program Benefits"
        items={[
          "Field-level exposure",
          "Direct mentorship from experts",
          "Practical investigation training",
          "Confidence building for real cases"
        ]}
      />

      {/* Internship Cards Section */}
      <section className="py-8 relative z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Areas to Explore */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-accent/50 transition-colors shadow-lg h-full flex flex-col">
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <Search size={24} className="text-accent" /> Areas You Will Explore
              </h3>
              <ul className="space-y-4 text-slate-700 flex-grow">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Crime Scene Investigation & Management</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Questioned Documents</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Fingerprint Identification</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Digital & Cyber Forensics</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" /> Trace Evidence & Biology</li>
              </ul>
            </div>

            {/* Dynamic Internships */}
            {loading ? (
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : internships.length === 0 ? (
              <div className="lg:col-span-2 text-center py-20 bg-white rounded-2xl shadow-lg border border-slate-200">
                <p className="text-slate-500 text-lg">No internships are currently available. Please check back later.</p>
              </div>
            ) : (
              internships.map((internship) => {
                const isOffline = internship.type.toLowerCase() === 'offline';
                
                return (
                  <div key={internship._id} className={`${isOffline ? 'bg-gradient-to-b from-primary to-primary-dark shadow-2xl border-2 border-accent text-white' : 'bg-white shadow-lg border border-slate-200 text-slate-900'} rounded-2xl p-8 transform hover:-translate-y-2 transition-transform duration-300 relative flex flex-col`}>
                    {isOffline && (
                      <div className="absolute top-0 right-0 bg-accent text-primary font-bold text-xs px-3 py-1.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
                        Best Value / Recommended
                      </div>
                    )}
                    <h3 className={`text-2xl font-bold mb-2 ${isOffline ? 'text-white' : 'text-slate-900'}`}>{internship.type} Internship</h3>
                    <p className={`mb-6 font-medium ${isOffline ? 'text-accent-light' : 'text-slate-500'}`}>{internship.description}</p>

                    <div className={`mb-6 flex items-baseline ${isOffline ? 'text-white' : 'text-slate-900'}`}>
                      <span className="text-4xl font-extrabold tracking-tight">₹{internship.price}</span>
                      <span className={`ml-1 font-medium ${isOffline ? 'text-slate-300' : 'text-slate-500'}`}>/ {internship.duration}</span>
                    </div>

                    <div className={`border-t pt-6 flex-grow ${isOffline ? 'border-white/10' : 'border-slate-100'}`}>
                      <h4 className={`font-bold mb-4 text-sm uppercase tracking-wide ${isOffline ? 'text-white' : 'text-slate-800'}`}>Benefits included</h4>
                      <ul className={`space-y-4 ${isOffline ? 'text-slate-200' : 'text-slate-600'}`}>
                        {internship.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Award className={`flex-shrink-0 mt-0.5 ${isOffline ? 'text-accent' : 'text-primary'}`} />
                            <span className="font-medium">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Button 
                        variant={isOffline ? "accent" : "outline"} 
                        size="lg" 
                        className={`w-full justify-center group ${isOffline ? 'shadow-[0_0_20px_rgba(46,204,113,0.3)]' : 'border-slate-300 hover:border-primary hover:bg-slate-50 text-slate-800'}`} 
                        onClick={() => handleEnrollClick(`${internship.type} Internship`, internship.duration)}
                      >
                        Apply Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Container>
      </section>


      <EnrollModal
        isOpen={enrollModal.isOpen}
        course={enrollModal.course}
        onClose={() => setEnrollModal({ isOpen: false, course: null })}
      />
    </div>
  );
}
