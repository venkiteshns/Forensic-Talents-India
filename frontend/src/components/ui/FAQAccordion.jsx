import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function FAQBox({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: '#94a3b8' }}
      viewport={{ once: true, margin: '0px 0px -60px 0px', amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 110,
        damping: 22,
        delay: (index % 2) * 0.1,
      }}
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      {/* Header trigger */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-start gap-4 px-5 py-5 text-left group focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-sm md:text-base font-semibold text-slate-900 leading-snug group-hover:text-primary transition-colors duration-200">
          {faq.question}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 24 }}
          className="flex-shrink-0 w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-slate-400 group-hover:text-slate-700 transition-colors duration-200 text-lg leading-none select-none"
          aria-hidden
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 24 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQAccordion({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {faqs.map((faq, index) => (
        <FAQBox key={index} faq={faq} index={index} />
      ))}
    </div>
  );
}
