import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Search, FileText, Fingerprint, Monitor, ArrowRight, Scale, Activity } from 'lucide-react';
import { Container } from '../ui/Container';

const services = [
  {
    id: 'questioned-documents',
    title: 'Questioned Documents',
    desc: 'Verify authenticity and detect forgery scientifically with advanced handwriting and signature analysis.',
    icon: <FileText size={32} />,
    colSpan: 'md:col-span-2 lg:col-span-2',
    rowSpan: 'row-span-1 lg:row-span-2',
    color: 'from-blue-500/20 to-blue-600/5',
  },
  {
    id: 'cyber',
    title: 'Cyber Forensics',
    desc: 'Digital evidence recovery and data analysis for complex cybercrimes.',
    icon: <Monitor size={32} />,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    color: 'from-cyan-500/20 to-cyan-600/5',
  },
  {
    id: 'fingerprint',
    title: 'Fingerprint Investigation',
    desc: 'Accurate identification with unique ridge patterns using chemical and digital enhancement.',
    icon: <Fingerprint size={32} />,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    color: 'from-accent/20 to-accent/5',
  },
  {
    id: 'crime-scene',
    title: 'Crime Scene Investigation',
    desc: 'Systematic analysis and evidence collection directly from the field.',
    icon: <Search size={32} />,
    colSpan: 'md:col-span-2',
    rowSpan: 'row-span-1',
    color: 'from-purple-500/20 to-purple-600/5',
  },
  {
    id: 'polygraph',
    title: 'Polygraph Examination',
    desc: 'Accurately assess truthfulness with advanced physiological monitoring.',
    icon: <Activity size={32} />,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
    color: 'from-rose-500/20 to-rose-600/5',
  },
];

export default function Expertise() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative py-32 bg-primary overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Precision <span className="text-accent">Expertise.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              We operate at the intersection of science, law, and technology. Our deeply qualified experts provide multidisciplinary forensic solutions globally.
            </p>
          </div>
          <motion.div whileHover={{ x: 5 }} className="hidden md:block">
            <Link to="/services" className="flex items-center gap-2 text-accent font-semibold hover:text-white transition-colors">
              View All Services <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {services.map((srv) => (
            <motion.div
              key={srv.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              style={{ willChange: 'transform', transformPerspective: 1000 }}
              whileHover={{ 
                scale: 1.02, 
                rotateX: 2, 
                rotateY: -2,
                boxShadow: "none"
              }}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl transition-colors hover:border-white/20 ${srv.colSpan} ${srv.rowSpan}`}
            >
              <Link to={`/services/${srv.id}`} className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${srv.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="absolute top-8 right-8 text-white/20 group-hover:text-accent transition-colors duration-500 group-hover:scale-110 transform">
                  {srv.icon}
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-slate-400 font-light line-clamp-3 group-hover:text-slate-300 transition-colors">
                    {srv.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {/* Quick link card to complete the grid */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            style={{ willChange: 'transform' }}
            whileHover={{ scale: 1.02 }}
            className="group relative rounded-3xl overflow-hidden border border-accent/20 bg-accent/5 backdrop-blur-xl flex items-center justify-center col-span-1 md:col-span-1 lg:col-span-1 auto-rows-[250px]"
          >
             <Link to="/services" className="flex flex-col items-center justify-center p-8 w-full h-full text-center">
                <div className="w-16 h-16 rounded-full border border-accent/50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300 mb-4">
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-white font-semibold">Explore All<br/>Forensic Services</span>
             </Link>
          </motion.div>
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/services" className="inline-flex items-center gap-2 text-accent font-semibold hover:text-white transition-colors">
            View All Services <ArrowRight size={20} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
