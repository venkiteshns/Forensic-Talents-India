import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ShieldAlert, Zap, Car, Home, Smartphone, Laptop, MapPin, Globe } from 'lucide-react';

const getTopicIcon = (id) => {
  switch (id) {
    case 'vehicles-and-transport': return <Car size={20} />;
    case 'smart-home-devices': return <Home size={20} />;
    case 'mobile-phones': return <Smartphone size={20} />;
    case 'computers-online-accounts': return <Laptop size={20} />;
    case 'tracking-technologies': return <MapPin size={20} />;
    case 'everyday-apps': return <Globe size={20} />;
    default: return <Globe size={20} />;
  }
};

const accordionVariants = {
  initial: { height: 0, opacity: 0, scale: 0.98 },
  animate: { height: 'auto', opacity: 1, scale: 1 },
  exit: { height: 0, opacity: 0, scale: 0.98 }
};

const springTransition = { type: 'spring', stiffness: 200, damping: 25, mass: 1 };

const Hotspot = ({ node, index, isActive, onClick }) => {
  const getTooltipPosition = (x) => {
    if (x < 20) return 'left-0';
    if (x > 80) return 'right-0';
    return 'left-1/2 -translate-x-1/2';
  };

  return (
    <motion.div
      className="absolute group z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 + index * 0.1 }}
      onClick={() => onClick(index)}
    >
      <div
        className="relative flex items-center justify-center cursor-pointer"
        style={{ width: 'clamp(14px, 3.5vw, 24px)', height: 'clamp(14px, 3.5vw, 24px)' }}
      >
        {/* Subtle Pulse Ring (No shadow) */}
        <motion.div
          className={`absolute inset-0 rounded-full ${isActive ? 'bg-[#D4AF37]' : 'bg-slate-300'}`}
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: index * 0.2 }}
        />

        {/* Solid Core */}
        <motion.div
          className={`relative w-full h-full rounded-full transition-colors duration-300 ${isActive ? 'bg-[#D4AF37] border-2 border-white' : 'bg-slate-900 group-hover:bg-slate-700 border-2 border-white'
            }`}
          animate={{ scale: isActive ? 1.15 : 1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Tooltip on hover (desktop only) */}
        <div className={`absolute top-full mt-2 whitespace-nowrap bg-white border border-slate-200 text-slate-900 text-[10px] sm:text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-semibold tracking-wide uppercase shadow-none z-30 ${getTooltipPosition(node.coordinates.x)}`}>
          {node.title}
        </div>
      </div>
    </motion.div>
  );
};

const TopicForensicDashboard = ({ topic, onClose, onSwitchTopic, allTopics }) => {
  const [activePoint, setActivePoint] = useState(0);
  const navigate = useNavigate();
  const accordionRefs = useRef([]);

  // Reset active point when topic changes
  useEffect(() => {
    setActivePoint(0);
  }, [topic?.id]);
  const [isMobile, setIsMobile] = useState(false);

  const handleNodeClick = (index) => {
    setActivePoint(index);
  };

  useEffect(() => {
    if (isMobile && activePoint !== null && accordionRefs.current[activePoint]) {
      setTimeout(() => {
        accordionRefs.current[activePoint].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [activePoint, isMobile]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Use lg as desktop breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent background scrolling when dashboard is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!topic) return null;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden text-slate-900"
    >
      {/* Header Area */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 pointer-events-none">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors pointer-events-auto group shadow-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Return to Ecosystem
        </button>
      </div>

      {!isMobile ? (
        /* Desktop Split-Screen Layout (45/55) */
        <div className="grid grid-cols-[auto_0.9fr_1.1fr] h-full w-full pt-24 pb-8 px-8 gap-8 max-w-[1920px] mx-auto">
          {/* Executive Sidebar / Service Switcher */}
          {allTopics && onSwitchTopic && (
            <div className="w-20 h-full border border-slate-200 bg-slate-50 flex flex-col items-center py-8 gap-4 shrink-0 relative z-20">
              {Object.values(allTopics).map((t) => {
                const isActive = t.id === topic.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSwitchTopic(t.id)}
                    className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-slate-900 text-white border border-slate-900' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-900 shadow-none'}`}
                  >
                    {getTopicIcon(t.id)}

                    {/* Tooltip */}
                    <div className="absolute left-full ml-4 whitespace-nowrap bg-slate-900 text-white text-xs px-4 py-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none font-semibold tracking-wide uppercase z-50 shadow-none">
                      <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45" />
                      {t.title}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Center: Interactive Map (45% Image) */}
          <div className="relative h-full border border-slate-200 bg-slate-50 shadow-none overflow-visible flex flex-col items-center justify-center p-2">
            <div className="absolute top-6 text-center z-20 pointer-events-none">
              <p className="text-xs font-mono tracking-[0.2em] text-slate-500 uppercase bg-white px-4 py-1 border border-slate-200 shadow-none font-bold">
                SELECT NODES
              </p>
            </div>

            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
              className="relative w-full aspect-video"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <img
                  src={`/images/techTour/${topic.imageName}`}
                  alt={topic.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0">
                  {topic.nodes.map((node, i) => (
                    <Hotspot
                      key={node.id}
                      node={node}
                      index={i}
                      isActive={activePoint === i}
                      onClick={handleNodeClick}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side: Executive Detail Panel (55% Content) */}
          <div className="h-full flex flex-col border border-slate-200 bg-white p-8 relative overflow-hidden shadow-none">
            <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight relative z-10">
              {topic.title}
            </h2>

            <div className="flex-1 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePoint}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={springTransition}
                  className="absolute inset-0 overflow-y-auto pr-4 custom-scrollbar flex flex-col"
                >
                  <h3 className="text-2xl xl:text-3xl font-bold text-slate-900 mb-8 leading-snug tracking-tight">
                    {topic.nodes[activePoint].title}
                  </h3>

                  <div className="space-y-10 flex-1">
                    <div className="space-y-4">
                      <h4 className="text-sm font-mono tracking-widest uppercase font-bold text-slate-500">How It Works</h4>
                      <p className="text-slate-700 leading-relaxed text-lg xl:text-xl font-medium">
                        {topic.nodes[activePoint].howItWorks}
                      </p>
                    </div>

                    <div className="space-y-4 border border-slate-200 bg-slate-50 p-7 relative shadow-none">
                      <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />
                      <h4 className="text-sm font-mono tracking-widest uppercase font-bold text-slate-900 mb-2">Risks</h4>

                      {topic.nodes[activePoint].detailedRisks && Array.isArray(topic.nodes[activePoint].detailedRisks) ? (
                        <ul className="list-disc pl-5 space-y-3">
                          {topic.nodes[activePoint].detailedRisks.map((risk, idx) => (
                            <li key={idx} className="text-slate-800 leading-relaxed text-lg xl:text-xl">
                              {risk.category && <span className="font-bold">{risk.category}: </span>}
                              <span>{risk.detail || risk}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-800 leading-relaxed text-lg xl:text-xl font-medium">
                          {topic.nodes[activePoint].riskAnalysis}
                        </p>
                      )}
                    </div>

                    {/* Context / Examples */}
                    {(topic.nodes[activePoint].contextualNote || topic.nodes[activePoint].context || (activePoint === topic.nodes.length - 1 && (topic.id === 'everyday-apps' || topic.id === 'vehicles-and-transport'))) && (
                      <div className="pt-4">
                        {topic.nodes[activePoint].contextualNote || topic.nodes[activePoint].context ? (
                          <>
                            <h4 className="text-sm font-mono tracking-widest uppercase font-bold text-slate-500 mb-3">In Context</h4>
                            <p className="text-slate-600 font-medium italic text-lg leading-relaxed">
                              {topic.nodes[activePoint].contextualNote || topic.nodes[activePoint].context}
                            </p>
                          </>
                        ) : null}

                        {/* Final Point Logic as fallback if no context exists but it's the last point of specific topics */}
                        {activePoint === topic.nodes.length - 1 && (topic.id === 'everyday-apps' || topic.id === 'vehicles-and-transport') && !(topic.nodes[activePoint].contextualNote || topic.nodes[activePoint].context) && (
                          <p className="text-slate-600 font-medium italic text-lg mt-2">
                            Awareness is the first step; professional mitigation is the second.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Minimalist Flat CTA (Sticky Bottom) & Progress Indicators */}
            <div className="pt-6 mt-6 border-t border-slate-200 relative z-10 flex flex-col gap-6 bg-white">
              <div className="flex justify-center gap-2">
                {topic.nodes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePoint(i)}
                    className={`h-1 transition-all duration-300 ease-out ${activePoint === i ? 'w-10 bg-[#D4AF37]' : 'w-4 bg-slate-200 hover:bg-slate-300'}`}
                    aria-label={`Go to point ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigate('/contact?reason=forensic-consultation')}
                className="w-full bg-[#D4AF37] transition-colors duration-200 hover:bg-[#c4a132] shadow-none"
              >
                <div className="px-6 py-4 text-center">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-slate-900">
                    GET EXPERT HELP
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Layout */
        <div className="flex flex-col w-full overflow-y-auto custom-scrollbar pb-12 pt-28 px-4 bg-white text-slate-900">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 text-center">
            {topic.title}
          </h2>

          <div className="mb-6">
            <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold text-center">
              Select nodes to reveal forensic risks
            </p>
          </div>

          {/* Animated Header Image Area */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
            className="relative w-full aspect-video mb-8 bg-slate-50 border border-slate-200 overflow-visible p-2"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <img
                src={`/images/techTour/${topic.imageName}`}
                alt={topic.title}
                className="w-full block h-full object-contain p-2"
              />
              <div className="absolute inset-0">
                {topic.nodes.map((node, i) => (
                  <Hotspot
                    key={node.id}
                    node={node}
                    index={i}
                    isActive={activePoint === i}
                    onClick={handleNodeClick}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Expandable Cards List */}
          <div className="space-y-3">
            {topic.nodes.map((node, i) => {
              const isExpanded = activePoint === i;

              return (
                <motion.div
                  layout
                  ref={el => accordionRefs.current[i] = el}
                  key={node.id}
                  onClick={() => handleNodeClick(isExpanded ? null : i)}
                  className={`border transition-all duration-200 overflow-hidden cursor-pointer shadow-none ${isExpanded ? 'bg-white border-slate-400' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                >
                  <motion.div layout className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isExpanded ? 'bg-[#D4AF37]' : 'bg-slate-300'}`} />
                      <h3 className={`font-bold tracking-wide transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-600'}`}>
                        {node.title}
                      </h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-180 text-slate-900' : 'text-slate-400'}`} />
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        variants={accordionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={springTransition}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-5 pt-2 border-t border-slate-200 space-y-6">
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-500">How It Works</h4>
                            <p className="text-slate-700 text-sm font-medium leading-relaxed">
                              {node.howItWorks}
                            </p>
                          </div>

                          <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 relative overflow-hidden shadow-none">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />
                            <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-900">Risks</h4>

                            {node.detailedRisks && Array.isArray(node.detailedRisks) ? (
                              <ul className="list-disc pl-4 space-y-2">
                                {node.detailedRisks.map((risk, idx) => (
                                  <li key={idx} className="text-slate-800 text-sm leading-relaxed">
                                    {risk.category && <span className="font-bold">{risk.category}: </span>}
                                    <span>{risk.detail || risk}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                {node.riskAnalysis}
                              </p>
                            )}
                          </div>

                          {/* Context / Examples */}
                          {(node.contextualNote || node.context || (i === topic.nodes.length - 1 && (topic.id === 'everyday-apps' || topic.id === 'vehicles-and-transport'))) && (
                            <div className="pt-2">
                              {node.contextualNote || node.context ? (
                                <>
                                  <h4 className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-500 mb-2">In Context</h4>
                                  <p className="text-slate-600 font-medium italic text-sm leading-relaxed">
                                    {node.contextualNote || node.context}
                                  </p>
                                </>
                              ) : null}

                              {i === topic.nodes.length - 1 && (topic.id === 'everyday-apps' || topic.id === 'vehicles-and-transport') && !(node.contextualNote || node.context) && (
                                <p className="text-slate-600 font-medium italic text-sm mt-2">
                                  Awareness is the first step; professional mitigation is the second.
                                </p>
                              )}
                            </div>
                          )}

                          {/* Minimalist Mobile CTA Button */}
                          <div className="mt-6">
                            <button
                              onClick={() => navigate('/contact?reason=forensic-consultation')}
                              className="w-full bg-[#D4AF37] transition-colors duration-200 hover:bg-[#c4a132] shadow-none"
                            >
                              <div className="px-4 py-3 text-center">
                                <span className="text-xs font-bold tracking-widest uppercase text-slate-900">
                                  CONSULT US
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TopicForensicDashboard;
