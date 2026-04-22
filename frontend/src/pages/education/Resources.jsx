import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { ArrowLeft, FileDown } from 'lucide-react';
import bgImage from '../../assets/forensic-lab-bg.png';

export default function Resources() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16 overflow-hidden" style={{ minHeight: '400px' }}>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-[#0B1120]/70 backdrop-blur-[1px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 drop-shadow-md">
              Forensic Resources & Downloads
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
              Professional materials to enhance your forensic knowledge and career growth.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Coming Soon Section */}
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-slate-100 text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            
            {/* Animated Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center shadow-inner animate-[bounce_3s_ease-in-out_infinite]">
                <FileDown size={48} className="text-accent" />
              </div>
            </div>

            <h2 className="text-3xl font-heading font-bold text-slate-800 mb-6">
              Downloadable resources will be available soon.
            </h2>
            
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              We are preparing high-quality forensic materials, guides, and reference documents to support students, professionals, and legal experts. These resources will be updated shortly to provide valuable insights and practical knowledge.
            </p>

            {/* Value Highlight Section */}
            <div className="bg-slate-50 rounded-2xl p-8 max-w-2xl mx-auto mb-12 text-left border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 text-center">What to expect:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Career-focused forensic materials",
                  "Case-based learning resources",
                  "Legal and investigative reference guides",
                  "Industry-relevant documentation"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/education"
                className="flex items-center justify-center px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Education
              </Link>
              
              <Link 
                to="/education/certificates"
                className="flex items-center justify-center px-8 py-3.5 bg-white text-primary border-2 border-primary font-semibold rounded-xl hover:bg-primary/5 transition-all duration-300 w-full sm:w-auto"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
