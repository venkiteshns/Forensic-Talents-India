import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Car, Home, Smartphone, Laptop, MapPin, Globe, MousePointer2 } from 'lucide-react';
import { Container } from './Container';

const topics = [
  { id: 'vehicles', title: 'Vehicles and Transport Systems', top: '28%', left: '26%', icon: Car },
  { id: 'smart-home', title: 'Smart Home Devices', top: '25%', left: '68%', icon: Home },
  { id: 'mobile-phones', title: 'Mobile Phones', top: '60%', left: '28%', icon: Smartphone },
  { id: 'computers', title: 'Computers & Online Accounts', top: '55%', left: '75%', icon: Laptop },
  { id: 'tracking', title: 'Tracking Technologies', top: '75%', left: '52%', icon: MapPin },
  { id: 'everyday-apps', title: 'Everyday Apps & Connected Services', top: '45%', left: '50%', icon: Globe },
];

const pulseVariants = {
  initial: { scale: 1, opacity: 0.4 },
  animate: (index) => ({
    scale: 1.8,
    opacity: 0,
    transition: {
      repeat: Infinity,
      duration: 2.5,
      ease: "easeOut",
      delay: index * 0.2,
    },
  }),
};

const innerCoreVariants = {
  animate: (index) => ({
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "easeInOut",
      delay: index * 0.2,
    },
  }),
};

const Hotspot = ({ topic, index, setHasInteracted, onSelectTopic }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', delay: index * 0.1, stiffness: 300, damping: 20 }}
      className="absolute z-10"
      style={{ top: topic.top, left: topic.left, transform: 'translate(-50%, -50%)' }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          setHasInteracted(true);
          if (onSelectTopic) {
            onSelectTopic(topic.id);
          } else {
            navigate(`/tech-tour?topic=${topic.id}`);
          }
        }}
        className="group relative flex items-center justify-center w-[clamp(32px,6vw,64px)] h-[clamp(32px,6vw,64px)]"
      >
        {/* Pulsing Outer Ring */}
        <motion.div
          custom={index}
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 rounded-full bg-cyan-400"
        />

        {/* Inner Core */}
        <motion.div
          custom={index}
          variants={innerCoreVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
          className="absolute inset-0 z-10 rounded-full bg-white border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer transition-colors"
        >
          <div className="w-[30%] h-[30%] rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        </motion.div>

        {/* Topic Label */}
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-md text-slate-800 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[clamp(10px,1.2vw,14px)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl border border-slate-200/50 uppercase tracking-wide">
          {topic.title}
        </div>
      </button>
    </motion.div>
  );
};

export default function InteractiveForensicMap({ onSelectTopic }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  return (
    <section id="tech-tour" className="py-24 bg-slate-50 relative overflow-hidden">
      <Container className="max-w-7xl relative z-10">

        {/* Title Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="overflow-hidden pb-2 inline-block">
            <motion.h2
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
              className="text-2xl sm:text-4xl lg:text-6xl font-heading font-bold text-primary leading-tight"
            >
              TECH TOUR: AN INTERACTIVE EXPLORATION
            </motion.h2>
          </div>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl">
            Explore the digital footprint hidden in everyday devices.
          </p>
        </div>

        {/* Instructional Hint - Repositioned outside map */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center mb-6"
            >
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-slate-400"
                  >
                    <MousePointer2 size={16} />
                  </motion.div>
                  <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold">
                    SELECT A FOCAL POINT TO BEGIN YOUR INQUIRY
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fluid Container for Mobile (No Scrollbars) */}
        <div className="w-full">
          {/* Anti-Gravity Section Animation wrapper */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full aspect-[16/9] relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200"
          >
            {/* Background Image */}
            <img
              src="/images/techTour/tech_tour.webp"
              alt="Forensic Ecosystem"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Map Overlay */}
            <div className="absolute inset-0">
              {topics.map((topic, index) => (
                <Hotspot
                  key={topic.id}
                  topic={topic}
                  index={index}
                  setHasInteracted={setHasInteracted}
                  onSelectTopic={onSelectTopic}
                />
              ))}
            </div>
          </motion.div>
        </div>

      </Container>
    </section>
  );
}
