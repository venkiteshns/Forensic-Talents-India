import { useState, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={`border rounded-xl transition-all duration-300 overflow-hidden ${
              isOpen ? 'border-primary/30 shadow-md bg-white' : 'border-slate-200 bg-slate-50 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`font-bold pr-8 ${isOpen ? 'text-primary' : 'text-slate-800'}`}>
                {faq.question}
              </span>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isOpen ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </button>
            <div 
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
