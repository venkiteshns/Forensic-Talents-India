import React, { useState, useEffect } from 'react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { countries } from '../../data/countries';

export default function CountryPhoneInput({ 
  value, 
  onChange, 
  error, 
  touched, 
  countryName,
  onCountryChange,
  name = "phone",
  label = "Phone Number", 
  required = false,
  onBlur
}) {
  const [localNumber, setLocalNumber] = useState('');

  const selectedCountry = countries.find(c => c.name === countryName || c.code === countryName) || countries.find(c => c.code === 'IN');

  // Sync external value to internal local number on mount or external changes
  useEffect(() => {
    if (value && typeof value === 'string') {
      try {
        const phoneNumber = parsePhoneNumberFromString(value, selectedCountry.code);
        if (phoneNumber) {
          setLocalNumber(phoneNumber.nationalNumber);
        } else {
          // If it doesn't parse cleanly, strip the dialcode if present
          if (value.startsWith(selectedCountry.dialCode)) {
            setLocalNumber(value.slice(selectedCountry.dialCode.length).trim());
          } else {
            setLocalNumber(value);
          }
        }
      } catch (e) {
        setLocalNumber(value);
      }
    } else {
      setLocalNumber('');
    }
  }, [value, selectedCountry.code]);

  const handleChange = (e) => {
    // Only allow numbers and spaces in the input
    let inputVal = e.target.value.replace(/[^\d\s]/g, '');
    
    // Format as you type
    const formatter = new AsYouType(selectedCountry.code);
    formatter.input(inputVal);
    
    // Keep raw numeric input for local state to avoid jumpy cursors with spaces
    setLocalNumber(inputVal);
    
    // Emit full number to parent
    const fullNumber = `${selectedCountry.dialCode} ${inputVal}`.trim();
    onChange({ target: { name, value: fullNumber } });
  };

  const handleBlur = (e) => {
    // Call the parent's onBlur if provided
    if (onBlur) {
      onBlur({ target: { name, value: `${selectedCountry.dialCode} ${localNumber}`.trim() } });
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`flex rounded-xl overflow-hidden border transition-all shadow-sm bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent ${
          touched && error ? 'border-red-400 focus-within:ring-red-500' : 'border-slate-200 hover:border-slate-300'
        }`}>
        
        {/* Country Code Prefix */}
        <div className="flex-shrink-0 bg-slate-50 border-r border-slate-200 flex items-center justify-center px-4 font-medium text-slate-600 select-none">
          {selectedCountry.dialCode}
        </div>
        
        {/* Phone Input */}
        <input 
          type="tel" 
          value={localNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-4 py-3 border-none focus:outline-none bg-transparent" 
          placeholder="Enter number" 
        />
      </div>
      
      {touched && error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
