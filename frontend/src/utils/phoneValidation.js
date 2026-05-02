import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { countries } from '../data/countries';

/**
 * Validates a phone number based on the selected country.
 * @param {string} phone - The phone number (usually includes dial code).
 * @param {string} countryName - The name or code of the country.
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export const validatePhoneNumber = (phone, countryName) => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: "Phone number is required." };
  }

  // Find the country object to get the ISO code
  const country = countries.find(c => c.name === countryName || c.code === countryName) || countries.find(c => c.code === 'IN');
  const countryCode = country?.code || 'IN';

  // Basic numeric check - strip everything but digits
  const numericOnly = phone.replace(/\D/g, '');
  
  // Special handling for India as requested
  if (countryCode === 'IN') {
    // Extract the national part by removing the dial code.
    const dialCode = country.dialCode || '+91';
    let value = phone;
    if (phone.startsWith(dialCode)) {
      value = phone.slice(dialCode.length).trim();
    }

    if (!/^\d+$/.test(value)) {
      return { isValid: false, error: "Only numeric digits are allowed." };
    }
    if (!/^[6-9]/.test(value)) {
      return { isValid: false, error: "Numbers starting with 0-5 are not accepted. Please start with 6, 7, 8, or 9." };
    }
    if (value.length !== 10) {
      return { isValid: false, error: "Indian phone numbers must be exactly 10 digits." };
    }
  } else {
    // General validation for other countries
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    
    if (!phoneNumber || !phoneNumber.isPossible()) {
      return { 
        isValid: false, 
        error: `Please enter a valid phone number for ${country?.name || 'the selected country'}.` 
      };
    }
  }

  return { isValid: true, error: null };
};
