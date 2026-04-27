import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { PageIntro, WhyChooseUs } from '../../components/education/SharedSections';

export default function Blogs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <img src="/images/banners/education_banner.png" alt="Blogs Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Forensic Insights
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
              Stay updated with our latest case studies, research articles, and field notes from industry experts.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <PageIntro
        title="Knowledge Sharing Platform"
        text="A dedicated continuous learning resource offering deep insights into forensic science advancements, real-world case studies, and modern investigative methodologies."
      />

      {/* Blogs Section */}
      <section className="py-8 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Blog Card 1 */}
            <a href="https://forensictalents.blogspot.com/2026/02/virtospy-digital-autopsy-that-lets-dead.html?m=1" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img src="/images/banners/services_banner.png" alt="Blog Post" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Technology</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">Virtopsy: Digital Autopsy That Lets the Dead Speak</h3>
                <p className="text-slate-600 mb-6 flex-grow line-clamp-3">An emerging non-invasive post-mortem technique leveraging 3D imaging technology to examine bodies without traditional dissection.</p>
                <div className="text-accent font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Blog Card 2 */}
            <a href="https://forensictalents.blogspot.com/2026/02/the-silent-witness-comprehensive-guide.html?m=1" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img src="/images/services/crime-scene.png" alt="Blog Post" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Guide</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">The Silent Witness: Comprehensive Guide</h3>
                <p className="text-slate-600 mb-6 flex-grow line-clamp-3">Understanding the vital role of physical evidence and silent clues in solving and building robust criminal investigations.</p>
                <div className="text-accent font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>

            {/* Blog Card 3 */}
            <a href="https://forensictalents.blogspot.com/2025/05/forensic-linguistics-where-language.html?m=1" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden group transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-slate-800 relative overflow-hidden">
                <img src="/images/services/questioned-documents.png" alt="Blog Post" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-accent text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">Linguistics</span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">Forensic Linguistics: Where Language Meets Law</h3>
                <p className="text-slate-600 mb-6 flex-grow line-clamp-3">Exploring how language, speech patterns, and textual analysis can be used as critical evidence in legal proceedings and interrogations.</p>
                <div className="text-accent font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          </div>

          <div className="text-center">
            <a href="https://forensictalents.blogspot.com/?m=1" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="group border-slate-300 hover:border-primary hover:bg-slate-100 text-slate-800 font-bold px-8">
                View All Blogs <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          </div>
        </Container>
      </section>

    </div>
  );
}
