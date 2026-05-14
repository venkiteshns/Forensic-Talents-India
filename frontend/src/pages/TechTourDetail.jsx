import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import techData from '../data/techData.json';

const TechTourDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const categoryData = techData.find((cat) => cat.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">404 - Not Found</h1>
        <p className="text-slate-600 mb-8">The technology category you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/services/cyber"
            className="inline-flex items-center text-slate-500 hover:text-amber-500 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              {categoryData.categoryTitle}
            </h1>
          </motion.div>
          {/* Sections */}
          <div className="space-y-16">
            {categoryData.sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
              >
                <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mt-2 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-amber-500 rounded-full mr-3"></span>
                  {section.sectionTitle}
                </h2>

                {/* Standard text lines directly under the section */}
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-4 mb-8">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start text-slate-600 leading-relaxed text-lg">
                        <span className="text-amber-500 mr-3 mt-2 flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4" cy="4" r="4" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Blocks directly under the section (no subsection) */}
                {section.blocks && section.blocks.length > 0 && (
                  <div className="mb-8">
                    {section.blocks.map((block, bIdx) => {
                      const isRisk = block.blockLabel.toLowerCase().includes('risk');
                      return (
                        <div key={bIdx} className="mb-6">
                          <h4 className={`text-xs font-bold uppercase tracking-widest mt-6 mb-2 ${isRisk ? 'text-rose-600' : 'text-slate-500'}`}>
                            {block.blockLabel}
                          </h4>
                          <ul className="space-y-2 pl-4 border-l-2 border-slate-100 ml-2">
                            {block.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start text-slate-600 leading-relaxed text-md">
                                <span className={`${isRisk ? 'text-rose-400' : 'text-slate-400'} mr-3 mt-2 flex-shrink-0`}>
                                  <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="2" cy="2" r="2" />
                                  </svg>
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subsections (Numbered Points) */}
                {section.subSections && section.subSections.length > 0 && (
                  <div className="space-y-12">
                    {section.subSections.map((sub, subIdx) => (
                      <div key={subIdx} className="ml-0 md:ml-4 border-l-[3px] border-amber-100 pl-6">
                        <h3 className="text-xl font-semibold text-slate-900 mt-2 mb-4 tracking-tight">
                          {sub.subTitle}
                        </h3>

                        {/* Items under subsection */}
                        {sub.items && sub.items.length > 0 && (
                          <ul className="space-y-3 mb-6">
                            {sub.items.map((subItem, sItemIdx) => (
                              <li key={sItemIdx} className="flex items-start text-slate-600 leading-relaxed">
                                <span className="text-amber-500 mr-3 mt-2 flex-shrink-0">
                                  <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="6" height="6" rx="1" />
                                  </svg>
                                </span>
                                <span>{subItem}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Blocks under subsection */}
                        {sub.blocks && sub.blocks.length > 0 && (
                          <div className="mt-6">
                            {sub.blocks.map((block, bIdx) => {
                              const isRisk = block.blockLabel.toLowerCase().includes('risk');
                              return (
                                <div key={bIdx} className="mb-6">
                                  <h4 className={`text-xs font-bold uppercase tracking-widest mt-6 mb-2 ${isRisk ? 'text-rose-600' : 'text-slate-500'}`}>
                                    {block.blockLabel}
                                  </h4>
                                  <ul className="space-y-2 pl-4 border-l-2 border-slate-100 ml-2">
                                    {block.items.map((item, iIdx) => (
                                      <li key={iIdx} className="flex items-start text-slate-600 leading-relaxed text-md">
                                        <span className={`${isRisk ? 'text-rose-400' : 'text-slate-400'} mr-3 mt-2 flex-shrink-0`}>
                                          <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="2" cy="2" r="2" />
                                          </svg>
                                        </span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default TechTourDetail;
