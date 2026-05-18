import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { BookOpen, Award, PenTool, BrainCircuit, ArrowRight, FileDown, GraduationCap } from 'lucide-react';
import { PageIntro, WhyChooseUs } from '../components/education/SharedSections';
import ReviewsSection from '../components/education/ReviewsSection';
import { motion } from 'framer-motion';
import { containerVariants, textVariants, cardVariants, scaleHover, vp } from '../animations';

export default function Education() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Certificate Courses",
      description: "Industry-oriented certification programs crafted by forensic experts. Choose from short-term to advanced courses covering Fingerprinting, Cyber Forensics, and more.",
      icon: <BookOpen size={40} className="text-white" />,
      link: "/education/certificates",
      bgClass: "from-blue-900 to-slate-900"
    },
    {
      title: "Internship Programs",
      description: "Jumpstart your career with virtual or in-lab practical exposure. Work on simulated cases, examine evidence, and build professional confidence.",
      icon: <Award size={40} className="text-white" />,
      link: "/education/internships",
      bgClass: "from-slate-800 to-slate-900"
    },
    {
      title: "Forensic Insights & Blogs",
      description: "Stay updated with our latest case studies, research articles, and field notes analyzing the intersection of science and law.",
      icon: <PenTool size={40} className="text-white" />,
      link: "/education/blogs",
      bgClass: "from-slate-700 to-slate-900"
    },
    {
      title: "Interactive Forensic Quiz",
      description: "Test your investigative understanding through our Monthly Forensic Quiz Program using authentic criminal case studies.",
      icon: <BrainCircuit size={40} className="text-white" />,
      link: "/education/quiz",
      bgClass: "from-primary to-primary-dark"
    },
    {
      title: "Forensic Resources",
      description: "Access downloadable materials, reference guides, and career-focused resources to support your forensic journey.",
      icon: <FileDown size={40} className="text-white" />,
      link: "/education/resources",
      bgClass: "from-blue-800 to-slate-800"
    },
    {
      title: "Institutional Directory",
      description: "Access a meticulously compiled registry of authorized universities, national campuses, and specialized institutions offering recognized forensic qualifications across India.",
      icon: <GraduationCap size={40} className="text-white" />,
      link: "/education/academic-directory",
      bgClass: "from-indigo-900 to-slate-900"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants}
        className="relative pt-24 pb-20 text-center flex items-center justify-center border-b-[8px] border-accent mb-16" style={{ minHeight: '340px' }}
      >
        <div className="absolute inset-0 z-0">
          <img src="/images/banners/education_banner.webp" alt="Education Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px]"></div>
        </div>
        <Container className="relative z-10">
          <motion.div variants={containerVariants} className="max-w-4xl mx-auto">
            <motion.h1 variants={textVariants} className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Master the Science of Investigation
            </motion.h1>
            <motion.p variants={textVariants} className="text-slate-200 text-lg max-w-3xl mx-auto leading-relaxed">
              A premier gateway to high-end forensic education. Enhance your expertise through specialized training, immersive internships, and continuous learning.
            </motion.p>
          </motion.div>
        </Container>
      </motion.section>

      {/* Intro Section */}
      <PageIntro 
        title="Education & Training Excellence" 
        text="At Forensic Talents India, we offer industry-oriented forensic science training programs designed to provide deep theoretical knowledge fused with hands-on practical exposure. Our comprehensive curriculum is expertly curated for students, professionals, and individuals aspiring to build a robust career in forensic science, investigation, and legal support services."
      />

      {/* Hub Grid Section */}
      <section className="py-8 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
                variants={cardVariants}
                custom={idx}
                whileHover={scaleHover.hover}
                transition={{ delay: (idx % 3) * 0.25 }}
                className="h-full"
              >
                <Link
                  to={section.link}
                  className="group relative bg-white rounded-3xl p-1 shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="bg-white rounded-3xl p-8 md:p-10 h-full flex flex-col relative z-10 border border-slate-100">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${section.bgClass} flex items-center justify-center mb-8 shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                      {section.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                      {section.description}
                    </p>

                    <div className="flex items-center text-primary font-bold mt-auto group-hover:gap-3 gap-2 transition-all">
                      Explore Module <ArrowRight size={20} className="text-accent" />
                    </div>
                  </div>

                  {/* Subtle Hover Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.bgClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Reviews Section */}
      <ReviewsSection type="education" />

      {/* Why Choose Us */}
      <WhyChooseUs />
    </div>
  );
}
