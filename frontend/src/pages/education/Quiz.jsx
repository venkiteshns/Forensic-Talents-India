import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { BrainCircuit, CheckCircle, PlayCircle, Calendar, ArrowLeft, Award, ShieldCheck, Search } from 'lucide-react';
import { EnrollModal } from '../../components/education/EnrollModal';
import { PageIntro, AdvantagesList, WhyChooseUs } from '../../components/education/SharedSections';
import { QuizSkeleton } from '../../components/ui/Skeletons';
import api from '../../utils/api';

export default function Quiz() {
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
    const fetchQuiz = async () => {
      try {
        const res = await api.get('/quiz/latest');
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching quiz", err);
      } finally {
        setLoading(false);
        if (window.location.hash) {
          setTimeout(() => {
            const element = document.getElementById(window.location.hash.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    };
    fetchQuiz();
  }, []);

  const handleStartQuiz = () => {
    if (quiz && quiz.formLink) {
      window.open(quiz.formLink, '_blank');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Header */}
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
          <img src="/images/banners/education_banner.png" alt="Quiz Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Test Your Knowledge
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
              Engage deeply with real-world case studies and enhance your investigative understanding.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro & Advantages */}
      <PageIntro
        title="Monthly Forensic Quiz Initiative"
        text="Participate in our interactive, case-based learning approach. The Monthly Forensic Quiz Program is specifically designed to hone your analytical and investigative skills by challenging you with complex real-world forensic scenarios."
      />
      <AdvantagesList
        title="Why Participate?"
        items={[
          "Enhances critical thinking",
          "Improves forensic + legal understanding",
          "Case-based real-world scenarios",
          "Certification for performance"
        ]}
      />

      {/* Certification Info */}
      <section className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Award className="mx-auto text-accent mb-4" size={48} />
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">Certification</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Participants who participate in the quiz and accomplishes are awarded certificates, which serve as recognition of their knowledge, critical thinking ability, and commitment to learning in the field of forensic science.
            </p>
          </div>
        </Container>
      </section>

      {/* Quiz Details */}
      <section id="quiz_box_section" className="py-8 relative z-10">
        <Container>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">

            {/* Background Texture */}
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
              <BrainCircuit className="w-full h-full text-primary scale-150 translate-x-1/4 -translate-y-1/4" />
            </div>

            <div className="md:w-1/2 relative z-10">
              <span className="text-accent font-bold tracking-wider uppercase text-sm mb-3 block">Monthly Initiative</span>

              {loading ? (
                <QuizSkeleton />
              ) : quiz && quiz.isVisible ? (
                <>
                  <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">{quiz.title}</h2>
                  <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                    {quiz.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-slate-700 font-medium">
                      <Calendar className="text-accent" size={20} /> Date: {new Date(quiz.date).toLocaleDateString()}
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle className="text-accent" size={20} /> Case-Based Learning
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle className="text-accent" size={20} /> Earn Certificates of Merit
                    </li>
                  </ul>
                  <Button variant="primary" size="lg" className="group shadow-lg" onClick={handleStartQuiz}>
                    <PlayCircle size={20} className="mr-2 group-hover:scale-110 transition-transform" /> Take the Quiz Now
                  </Button>
                </>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-heading font-bold text-primary mb-4">Current Status</h2>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {quiz ? `Previous quiz was conducted on ${new Date(quiz.date).toLocaleDateString()}. A new quiz will be announced shortly.` : "A new quiz will be announced shortly."}
                  </p>
                </div>
              )}
            </div>

            <div className="md:w-1/2 relative z-10">
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl shadow-inner border border-slate-100">
                <div className="border-b border-slate-200 pb-4 mb-6">
                  <h4 className="font-bold text-slate-800 text-xl">📝 Sample Quiz Format</h4>
                  <p className="text-slate-600 text-sm mt-1">Each quiz typically includes:</p>
                </div>
                <div className="space-y-6">
                  <div className="group transition-all duration-300 hover:translate-x-1">
                    <h5 className="font-bold text-primary flex items-center gap-2 mb-2 group-hover:text-accent transition-colors">
                      <span className="text-accent group-hover:scale-125 transition-transform">🔹</span> Case Study Section
                    </h5>
                    <p className="text-slate-600 text-sm leading-relaxed pl-7">
                      A detailed narrative describing the background, crime scene, forensic findings, investigation, and legal proceedings.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-primary flex items-center gap-2 mb-2">
                      <span className="text-accent">🔹</span> Question Section
                    </h5>
                    <div className="space-y-4 pl-7">
                      <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 cursor-default group/card">
                        <h6 className="font-bold text-slate-800 text-sm mb-1 group-hover/card:text-primary transition-colors">Q: One-Word / Short Answer Questions</h6>
                        <p className="text-slate-600 text-sm italic">Focused on key factual and conceptual aspects of the case.</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 cursor-default group/card">
                        <h6 className="font-bold text-slate-800 text-sm mb-1 group-hover/card:text-primary transition-colors">Q: Multiple Choice Questions (MCQs)</h6>
                        <p className="text-slate-600 text-sm italic">Designed to test deeper understanding, interpretation, and application of forensic principles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Certificate Verification Section */}
      <section className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Container>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden group">
            {/* Decorative Background Element */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6 shadow-sm border border-accent/10">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Verify Your Certificate</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Authenticity matters in forensics. Use our official verification tool to validate certificates issued for the Monthly Forensic Quiz Program.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                    <CheckCircle className="text-green-500" size={18} />
                    <span>Official Record</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                    <CheckCircle className="text-green-500" size={18} />
                    <span>Instant Result</span>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="bg-slate-50/50 p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-inner backdrop-blur-sm relative">
                  <label htmlFor="cert_verify_input" className="block text-slate-800 font-bold mb-3 text-lg">
                    Certificate Number
                  </label>
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          id="cert_verify_input"
                          placeholder="e.g., FOR-T/AB/XXXX01"
                          className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all font-medium text-lg shadow-sm"
                        />
                      </div>
                      <Button
                        variant="primary"
                        size="lg"
                        className="sm:px-10 py-4 h-auto rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Search size={20} />
                        <span>Verify</span>
                      </Button>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-slate-500 text-center flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Unique number can be found at the bottom of your certificate.
                  </p>
                </div>
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
