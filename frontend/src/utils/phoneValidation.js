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
    // If it's India, we expect exactly 10 digits for the national number
    // The phone string from CountryPhoneInput is likely "+91 1234567890"
    const phoneNumber = parsePhoneNumberFromString(phone, 'IN');
    
    if (!phoneNumber) {
      return { isValid: false, error: "Please enter a valid Indian phone number." };
    }

    if (phoneNumber.country !== 'IN') {
      return { isValid: false, error: "Please enter a valid Indian phone number (+91)." };
    }

    const nationalNumber = phoneNumber.nationalNumber;
    if (nationalNumber.length !== 10) {
      return { isValid: false, error: "Indian phone numbers must be exactly 10 digits." };
    }

    if (!phoneNumber.isValid()) {
      return { isValid: false, error: "Invalid Indian phone number format." };
    }
  } else {
    // General validation for other countries
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
    
    if (!phoneNumber || !phoneNumber.isValid()) {
      return { 
        isValid: false, 
        error: `Please enter a valid phone number for ${country?.name || 'the selected country'}.` 
      };
    }
  }

  return { isValid: true, error: null };
};
