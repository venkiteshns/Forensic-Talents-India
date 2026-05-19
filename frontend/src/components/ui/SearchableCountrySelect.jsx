import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Check } from 'lucide-react';
import { countries } from '../../data/countries';

export default function SearchableCountrySelect({ 
  value, 
  onChange, 
  error, 
  touched, 
  label = "Country", 
  required = false,
  name = "nationality"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.dialCode.includes(searchTerm)
  );

  const selectedCountry = countries.find(c => c.name === value || c.code === value) || countries.find(c => c.name === 'India');

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      {/* Hidden sentinel: gives scroll-to-error a real focusable DOM node to target
          when this custom dropdown widget is in an error state.              */}
      <input
        type="text"
        id={name}
        name={name}
        aria-invalid={!!(touched && error)}
        aria-describedby={touched && error ? `${name}-error` : undefined}
        tabIndex={-1}
        readOnly
        aria-hidden="true"
        className="sr-only"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      />
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
        <span className="text-slate-700 truncate">{selectedCountry?.name || 'Select a country'}</span>
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
          <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                ref={(el) => {
                  if (el && document.activeElement !== el) {
                    // Prevent browser from aggressively scrolling to the portal
                    el.focus({ preventScroll: true });
                  }
                }}
                placeholder="Search country..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar" style={{ overscrollBehavior: 'contain' }}>
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">No countries found</div>
            ) : (
              filteredCountries.map(country => (
                <div 
                  key={country.code}
                  onClick={() => {
                    onChange(country.name, country);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedCountry?.code === country.code ? 'bg-primary/5 text-primary font-medium' : 'text-slate-700'}`}
                >
                  <span className="truncate pr-4">{country.name}</span>
                  <span className="text-slate-400 text-xs shrink-0">{country.dialCode}</span>
                </div>
              ))
            )}
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
