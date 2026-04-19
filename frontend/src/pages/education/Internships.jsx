import { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Award, Briefcase, MapPin, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { EnrollModal } from '../../components/education/EnrollModal';
import { PageIntro, AdvantagesList, WhyChooseUs } from '../../components/education/SharedSections';

export default function Internships() {
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEnrollClick = (category, duration) => {
    setEnrollModal({ isOpen: true, course: { category, prog: { duration } } });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Header Section */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}>
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

            {/* Online Internship */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 transform hover:-translate-y-2 transition-transform duration-300 relative flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Online Internship</h3>
              <p className="text-slate-500 mb-6 font-medium">Virtual Practical Exposure</p>

              <div className="mb-6 flex items-baseline text-slate-900">
                <span className="text-4xl font-extrabold tracking-tight">₹6,500</span>
                <span className="ml-1 text-slate-500 font-medium">/ 1 Month</span>
              </div>

              <div className="border-t border-slate-100 pt-6 flex-grow">
                <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Benefits included</h4>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <Award className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Recognized Certificate of Internship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Search className="text-primary flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Virtual Case Studies & Assignments</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button variant="outline" size="lg" className="w-full justify-center group border-slate-300 hover:border-primary hover:bg-slate-50 text-slate-800" onClick={() => handleEnrollClick("Online Internship", "1 Month")}>
                  Apply Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Offline Internship */}
            <div className="bg-gradient-to-b from-primary to-primary-dark rounded-2xl p-8 shadow-2xl transform hover:-translate-y-2 transition-transform duration-300 relative border-2 border-accent flex flex-col">
              <div className="absolute top-0 right-0 bg-accent text-primary font-bold text-xs px-3 py-1.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
                Best Value / Recommended
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Offline Internship</h3>
              <p className="text-accent-light mb-6 font-medium">In-Lab Premium Experience</p>

              <div className="mb-6 flex items-baseline text-white">
                <span className="text-4xl font-extrabold tracking-tight">₹8,500</span>
                <span className="ml-1 text-slate-300 font-medium">/ 1 Month</span>
              </div>

              <div className="border-t border-white/10 pt-6 flex-grow">
                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Benefits included</h4>
                <ul className="space-y-4 text-slate-200">
                  <li className="flex items-start gap-3">
                    <Award className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Recognized Certificate of Internship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Briefcase className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Exclusive Welcome Kit & Official T-Shirt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="font-medium">Field Visits: Mortuary & Police Station</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button variant="accent" size="lg" className="w-full justify-center group shadow-[0_0_20px_rgba(46,204,113,0.3)]" onClick={() => handleEnrollClick("Offline Internship", "1 Month")}>
                  Apply Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
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
