import { Container } from '../ui/Container';
import { CheckCircle2, Award, BookOpen } from 'lucide-react';

export const PageIntro = ({ title, text }) => (
  <Container className="mb-16 animate-in fade-in duration-700">
    <div className="text-center max-w-4xl mx-auto">
      {title && <h2 className="text-3xl font-heading font-bold text-primary mb-6">{title}</h2>}
      <p className="text-slate-600 text-lg leading-relaxed">{text}</p>
    </div>
  </Container>
);

export const AdvantagesList = ({ title = "Advantages", items }) => (
  <Container className="mb-20 animate-in fade-in duration-700 delay-100">
    {title && <h2 className="text-2xl font-heading font-bold text-slate-800 mb-8 text-center">{title}</h2>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="bg-slate-50 text-accent p-2 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-slate-700 font-medium">{item}</span>
        </div>
      ))}
    </div>
  </Container>
);

export const WhyChooseUs = () => (
  <section className="py-20 bg-slate-100/50 border-t border-slate-200 mt-20">
    <Container className="animate-in fade-in duration-700 delay-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-heading font-bold text-slate-800 mb-8 flex items-center justify-center gap-3">
          <Award className="text-accent" size={32} /> Why Choose Forensic Talents India?
        </h2>
        <div className="space-y-4">
          {[
            "Industry-oriented training approach",
            "Integration of theory with real-world practice",
            "Guidance from experienced forensic professionals",
            "Flexible online and offline study modes",
            "Exposure to actual investigative methodologies",
            "Certification recognized for professional growth"
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform group">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <span className="text-slate-700 font-medium text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);
