import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  error, 
  touched, 
  label, 
  placeholder = "Select an option",
  required = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (dropdownMenuRef.current && dropdownMenuRef.current.contains(event.target))
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown position
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const updatePosition = () => {
        if (!dropdownRef.current) return;
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999
        });
      };
      
      updatePosition();
      
      // Use capture phase to catch scroll events from any scrollable container (like the modal)
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );

  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : placeholder;

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-1.5 relative z-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        ref={dropdownRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all shadow-sm bg-white relative z-10 ${
          touched && error ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 hover:border-slate-300'
        } ${isOpen ? 'ring-2 ring-accent border-transparent' : ''}`}
      >
        <span className={`truncate ${!value ? 'text-slate-500' : 'text-slate-700'}`}>{displayValue}</span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={dropdownMenuRef}
          style={dropdownStyle}
          className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar" style={{ overscrollBehavior: 'contain' }}>
            {options.map((opt, idx) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const isSelected = value === optValue;
              
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${isSelected ? 'bg-primary/5 text-primary font-medium' : 'text-slate-700'}`}
                >
                  <span className="truncate pr-4">{optLabel}</span>
                  {isSelected && <Check size={16} className="text-primary shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
      
      {touched && error && (
        <p className="text-red-500 text-sm mt-1 relative z-1">{error}</p>
      )}
    </div>
  );
}
