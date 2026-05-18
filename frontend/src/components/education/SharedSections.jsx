import { Container } from '../ui/Container';
import { CheckCircle2, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, textVariants, cardVariants } from '../../animations';

export const PageIntro = ({ title, text }) => (
  <Container className="mb-16">
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={containerVariants} className="text-center max-w-4xl mx-auto">
      {title && <motion.h2 variants={textVariants} className="text-3xl font-heading font-bold text-primary mb-6">{title}</motion.h2>}
      <motion.p variants={textVariants} className="text-slate-600 text-lg leading-relaxed">{text}</motion.p>
    </motion.div>
  </Container>
);

export const AdvantagesList = ({ title = "Advantages", items }) => (
  <Container className="mb-20">
    <div>
      {title && <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={textVariants} className="text-2xl font-heading font-bold text-slate-800 mb-8 text-center">{title}</motion.h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item, idx) => (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            style={{ willChange: 'transform' }}
            key={idx}
            className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <motion.div variants={cardVariants} className="bg-slate-50 text-accent p-2 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </motion.div>
            <motion.span variants={textVariants} className="text-slate-700 font-medium">{item}</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  </Container>
);

export const WhyChooseUs = () => (
  <section className="py-20 bg-slate-100/50 border-t border-slate-200 mt-20">
    <Container>
      <div className="max-w-4xl mx-auto">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={textVariants} className="text-3xl font-heading font-bold text-slate-800 mb-8 flex items-center justify-center gap-3">
          <Award className="text-accent" size={32} /> Why Choose Forensic Talents India?
        </motion.h2>
        <div className="space-y-4">
          {[
            "Industry-oriented training approach",
            "Integration of theory with real-world practice",
            "Guidance from experienced forensic professionals",
            "Flexible online and offline study modes",
            "Exposure to actual investigative methodologies",
            "Certification recognized for professional growth"
          ].map((benefit, idx) => (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              style={{ willChange: 'transform' }}
              key={idx}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform group"
            >
              <motion.div variants={cardVariants} className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 flex-shrink-0 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </motion.div>
              <motion.span variants={textVariants} className="text-slate-700 font-medium text-lg">{benefit}</motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);
