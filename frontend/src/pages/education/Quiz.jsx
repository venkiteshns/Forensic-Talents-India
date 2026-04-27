import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { BrainCircuit, CheckCircle, PlayCircle, Calendar, ArrowLeft } from 'lucide-react';
import { EnrollModal } from '../../components/education/EnrollModal';
import { PageIntro, AdvantagesList, WhyChooseUs } from '../../components/education/SharedSections';
import { QuizSkeleton } from '../../components/ui/Skeletons';
import api from '../../utils/api';

export default function Quiz() {
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchQuiz = async () => {
      try {
        const res = await api.get('/quiz/latest');
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching quiz", err);
      } finally {
        setLoading(false);
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

      {/* Quiz Details */}
      <section className="py-8 relative z-10">
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
                <div className="border-b border-slate-200 pb-4 mb-4">
                  <h4 className="font-bold text-slate-800 text-lg">📝 Sample Case Study Format</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <h5 className="font-bold text-primary text-sm mb-1">Q: Multiple Choice Question</h5>
                    <p className="text-slate-600 text-sm italic">Designed to test deeper understanding, interpretation, and application of forensic principles.</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <h5 className="font-bold text-primary text-sm mb-1">Q: Short Answer Question</h5>
                    <p className="text-slate-600 text-sm italic">Focused on key factual and conceptual aspects of the case.</p>
                  </div>
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
