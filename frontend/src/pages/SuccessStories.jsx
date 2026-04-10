import { Container } from '../components/ui/Container';
import { Award, Globe, Scale, BookOpen, MapPin } from 'lucide-react';

export default function SuccessStories() {
  const stats = [
    { num: "450+", desc: "Forensic cases handled across diverse domains" },
    { num: "50+", desc: "Theft and robbery cases successfully solved" },
    { num: "500+", desc: "Professionals trained in forensic applications" }
  ];

  const categories = [
    {
      title: "Insurance & Accident Investigations",
      desc: "Delivered precise forensic analysis in disputed insurance claims and accident reconstructions, helping organizations identify fraudulent claims and establish the true sequence of events.",
      icon: <Scale className="text-accent h-8 w-8" />
    },
    {
      title: "Crime & Medico-Legal Cases",
      desc: "Supported law enforcement and legal teams in complex criminal investigations by analyzing critical physical evidence bridging the gap between medical science and the law.",
      icon: <Award className="text-accent h-8 w-8" />
    },
    {
      title: "Corporate & Financial Fraud",
      desc: "Successfully detected forgery, falsified signatures, and altered financial documents in high-stakes corporate disputes.",
      icon: <BookOpen className="text-accent h-8 w-8" />
    }
  ];

  const globalImpact = [
    { location: "Cairo University, Egypt", type: "International Workshop" },
    { location: "Lima, Peru", type: "Forensic Delegation & Training" }
  ];

  return (
    <div className="bg-white min-h-[calc(100vh-88px)]">
      {/* Header */}
      <section className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent" style={{ minHeight: '340px' }}>
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/success_stories_banner.png" alt="Success Stories" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Our Success & Impact</h1>
          <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
            A proven track record of delivering absolute truth, solidifying undeniable evidence, and shaping justice globally. We pride ourselves on the high-profile results our scientific expertise has provided to courtrooms worldwide.
          </p>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-100 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl font-bold text-primary mb-4">{stat.num}</div>
                <p className="text-slate-600 font-medium">{stat.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Achievements Cards */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">Case Highlights</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We have successfully resolved critical investigations across a wide spectrum of legal disciplines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((cat, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-md">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{cat.title}</h3>
                <p className="text-slate-600 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* International Impact Timeline/Cards */}
      <section className="py-20 bg-primary text-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3">
                <Globe className="text-accent" size={32} /> Global Footprint
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8">
                Our expertise is recognized beyond borders. We have been invited to participate in and lead international forensic workshops and training sessions, sharing our methodologies with global experts.
              </p>
            </div>
            
            <div className="space-y-6">
              {globalImpact.map((impact, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{impact.location}</h4>
                    <p className="text-slate-300">{impact.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
