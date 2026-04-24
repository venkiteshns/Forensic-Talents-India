import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export function SuccessModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative flex flex-col transform transition-transform duration-300 scale-100 animate-in zoom-in-95">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center pt-10">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-[6px] border-green-100/30">
            <CheckCircle2 size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Request Submitted Successfully
          </h3>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            Our team has received your enquiry. Our experts will review your case and get in touch with you shortly.
          </p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8">
            <p className="text-sm text-slate-500">
              For urgent matters, you may also contact us via phone or WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full justify-center shadow-md hover:shadow-lg transition-all"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-center text-slate-600 border-slate-200 hover:bg-slate-50"
              onClick={() => {
                onClose();
                navigate('/');
              }}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
