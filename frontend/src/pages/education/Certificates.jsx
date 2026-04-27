import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { BookOpen, Clock, IndianRupee, ChevronDown, ChevronUp, CheckCircle, Globe, MapPin, Fingerprint, Monitor, Search, PenTool, LayoutGrid, ArrowLeft } from 'lucide-react';
import { EnrollModal } from '../../components/education/EnrollModal';
import { PageIntro, AdvantagesList, WhyChooseUs } from '../../components/education/SharedSections';
import { CardSkeleton } from '../../components/ui/Skeletons';
import api from '../../utils/api';

export default function Certificates() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [enrollModal, setEnrollModal] = useState({ isOpen: false, course: null });
  const [groupedCourses, setGroupedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      const data = res.data;
      
      // Group courses by category
      const grouped = data.reduce((acc, course) => {
        const cat = course.category || "General Forensics";
        if (!acc[cat]) {
          acc[cat] = [];
        }
        // Map backend schema to frontend structure
        acc[cat].push({
          id: course._id,
          duration: course.duration,
          price: course.price,
          modes: course.mode,
          desc: course.description,
          topics: course.topics
        });
        return acc;
      }, {});

      // Assign icons based on category names
      const getIconForCategory = (catName) => {
        const name = catName.toLowerCase();
        if (name.includes('fingerprint')) return <Fingerprint size={28} />;
        if (name.includes('handwriting') || name.includes('document')) return <PenTool size={28} />;
        if (name.includes('cyber') || name.includes('digital')) return <Monitor size={28} />;
        if (name.includes('crime scene') || name.includes('investigation')) return <Search size={28} />;
        return <LayoutGrid size={28} />; // default
      };

      const finalGrouped = Object.keys(grouped).map(catName => ({
        category: catName,
        icon: getIconForCategory(catName),
        programs: grouped[catName]
      }));

      setGroupedCourses(finalGrouped);
    } catch (error) {
      console.error("Error fetching courses", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (id) => {
    setExpandedProgram(expandedProgram === id ? null : id);
  };

  const handleEnrollClick = (category, prog) => {
    setEnrollModal({ isOpen: true, course: { category, prog } });
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
          <img src="/images/banners/education_banner.png" alt="Certificates Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Certificate Courses
            </h1>
            <p className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
              Specialized programs crafted by industry experts to advance your forensic career with practical, hands-on knowledge.
            </p>
          </div>
        </Container>
      </section>

      {/* Intro & Advantages */}
      <PageIntro
        title="Structured Forensic Learning"
        text="We offer a structured progression of forensic learning—from foundational principles to advanced analytical techniques. Our certificate courses cover essential domains including Fingerprint Analysis, Cyber Forensics, Handwriting Examination, and Crime Scene Management, expertly designed to turn theoretical knowledge into practical expertise."
      />
      <AdvantagesList
        title="Key Advantages"
        items={[
          "Practical exposure to forensic techniques",
          "Structured curriculum designed by experts",
          "Real-world case relevance",
          "Certification for professional credibility"
        ]}
      />

      {/* Course List */}
      <section className="py-8 relative z-10">
        <Container>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : groupedCourses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No certificate courses are currently available. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {groupedCourses.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden group hover:border-accent/50 transition-colors duration-300">
                <div className="bg-slate-900 p-8 border-b border-slate-800 flex items-center gap-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-5 -translate-y-1/4 translate-x-1/4">
                    {cat.icon}
                  </div>
                  <div className="w-16 h-16 bg-accent/20 text-accent flex items-center justify-center rounded-xl shadow-inner flex-shrink-0 relative z-10 backdrop-blur-md border border-accent/30">
                    {cat.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white relative z-10 tracking-wide">{cat.category}</h2>
                </div>

                <div className="p-8 divide-y divide-slate-100">
                  {cat.programs.map((prog) => {
                    const isExpanded = expandedProgram === prog.id;
                    return (
                      <div key={prog.id} className="py-8 first:pt-0 last:pb-0">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                              <Clock size={20} className="text-accent" /> {prog.duration}
                            </h3>
                            <div className="flex gap-2">
                              {prog.modes.map(mode => (
                                <span key={mode} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                                  {mode === 'Online' ? <Globe size={12} /> : <MapPin size={12} />} {mode}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-lg font-bold flex items-center gap-1 border border-green-200 w-max md:ml-auto shadow-sm">
                              <IndianRupee size={18} /> {prog.price}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                          <Button variant="primary" size="lg" onClick={() => handleEnrollClick(cat.category, prog)} className="w-full min-[501px]:w-auto shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 justify-center">
                            Enroll Now
                          </Button>
                          <Button variant="secondary" size="lg" onClick={() => toggleDetails(prog.id)} className="flex items-center justify-center gap-2 group w-full min-[501px]:w-auto">
                            {isExpanded ? (
                              <><ChevronUp size={18} className="text-primary" /> Hide Details</>
                            ) : (
                              <><ChevronDown size={18} className="group-hover:translate-y-1 transition-transform text-primary" /> Show Details</>
                            )}
                          </Button>
                        </div>

                        {/* Expandable Syllabus */}
                        {isExpanded && (
                          <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
                            <p className="text-slate-700 italic mb-6 text-sm leading-relaxed border-l-4 border-l-accent pl-4">{prog.desc}</p>
                            <h4 className="font-bold text-primary mb-4 text-sm flex items-center gap-2 uppercase tracking-wide">
                              <BookOpen size={16} className="text-accent" /> Syllabus Breakdown
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-600">
                              {prog.topics.map((topic, tIdx) => (
                                <li key={tIdx} className="flex items-start gap-2 leading-relaxed">
                                  <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          )}
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
