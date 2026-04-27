import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const encodedMessage = encodeURIComponent(message.trim());
    window.open(`https://wa.me/917046669919?text=${encodedMessage}`, '_blank');
    setMessage('');
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Card */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-[#25D366] p-4 flex justify-between items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MessageCircle size={100} />
            </div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img src="/assets/logo.png" alt="Forensic Talents" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Need help?</h4>
                <p className="text-xs opacity-90">Contact via WhatsApp</p>
              </div>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors relative z-10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Preview */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 h-32 overflow-y-auto">
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-700 max-w-[85%] float-left border border-slate-100">
              Hello! 👋 How can we assist you with our forensic services or training programs?
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white flex gap-2 items-center">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#20bd5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Launcher Button */}
      {!isExpanded && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in flex items-center gap-2 group"
          aria-label="Open WhatsApp Chat"
        >
          <MessageCircle size={24} />
          <span className="font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
            Chat with us
          </span>
        </button>
      )}
    </div>
  );
}
