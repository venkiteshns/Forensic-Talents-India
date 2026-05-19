import React, { useState, useEffect, useRef } from 'react';
import { countries } from '../../data/countries';

// ─────────────────────────────────────────────────────────────────────────────
// CountryPhoneInput — strict state-separation architecture
//
// DESIGN PRINCIPLE:
//   Two completely isolated concerns:
//     1. `selectedCountry.dialCode`  — visual prefix label (read-only span)
//     2. `rawPhone`                  — the user's typed digits (input value)
//
// They NEVER mix until the submit handler calls:
//   `${selectedCountry.dialCode} ${rawPhone}` (assembled in handleChange)
//
// The circular-dependency pattern (emit composed → parent stores →
// passes back as `value` → decompose) that caused dial codes to leak
// into the text box has been eliminated entirely.
//   - `value` is only read ONCE on mount (ref-guarded initializer).
//   - Country changes clear `rawPhone` locally and emit '' to parent.
//   - The value-sync effect ONLY runs when the external value resets
//     to empty (e.g. after a successful form submission).
// ─────────────────────────────────────────────────────────────────────────────

export default function CountryPhoneInput({
  value,
  onChange,
  error,
  touched,
  countryName,
  onCountryChange,
  name = 'phone',
  label = 'Phone Number',
  required = false,
  onBlur,
}) {
  // ── rawPhone: ONLY what the user physically types ─────────────────────────
  const [rawPhone, setRawPhone] = useState('');

  const selectedCountry =
    countries.find((c) => c.name === countryName || c.code === countryName) ||
    countries.find((c) => c.code === 'IN');

  // ── Mount initializer ─────────────────────────────────────────────────────
  // Read the external value exactly ONCE on mount to restore a saved/prefilled
  // number. Uses a ref flag so it never re-runs on re-renders.
  // Safely extracts raw digits regardless of whether the stored value is a
  // composed string ("+91 9876543210") or plain digits ("9876543210").
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (value && typeof value === 'string') {
      const spaceIdx = value.indexOf(' ');
      const raw = spaceIdx !== -1
        ? value.slice(spaceIdx + 1).trim()   // extract digits after dial code
        : value.replace(/\D/g, '');           // already raw — strip any stray chars
      setRawPhone(raw);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form-reset detector ───────────────────────────────────────────────────
  // If the parent explicitly resets formData.phone to '' (e.g. after a
  // successful submit), mirror that reset locally.
  // This is the ONLY value-prop effect; it is guarded to ignore the
  // normal composed-string updates so it can never re-inject dial codes.
  useEffect(() => {
    if (!value || value === '') {
      setRawPhone('');
    }
  }, [value]);

  // ── Country-change guard ──────────────────────────────────────────────────
  // When nationality changes:
  //   • Clear rawPhone  → text box goes blank immediately
  //   • Emit ''         → parent formData.phone resets to empty (not the dial
  //                        code string), so form validation correctly requires
  //                        the user to re-enter a number for the new country.
  //
  // CRITICAL: We emit '' (not selectedCountry.dialCode). Emitting the dial
  // code caused parent to store "+355", which fed back through the value prop
  // and the old else-branch stripped it to "355" — injecting it into the box.
  const prevCountryCode = useRef(selectedCountry.code);
  useEffect(() => {
    if (prevCountryCode.current === selectedCountry.code) return;
    prevCountryCode.current = selectedCountry.code;

    setRawPhone('');
    onChange({ target: { name, value: '' } });
  }, [selectedCountry.code]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Input handler ─────────────────────────────────────────────────────────
  // Strip everything except digits (no spaces, no dashes, no +).
  // rawPhone stays as pure digits; the composed value is assembled here
  // and emitted to the parent for validation/submission.
  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawPhone(digits);
    // Compose only for the parent — the input itself never sees the dial code
    onChange({ target: { name, value: `${selectedCountry.dialCode} ${digits}`.trim() } });
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur({
        target: { name, value: `${selectedCountry.dialCode} ${rawPhone}`.trim() },
      });
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex rounded-xl overflow-hidden border transition-all shadow-sm bg-white focus-within:ring-2 focus-within:ring-accent focus-within:border-transparent ${
          touched && error
            ? 'border-red-400 focus-within:ring-red-500'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* ── Dial code: purely visual, read-only, never part of input value ── */}
        <div className="flex-shrink-0 bg-slate-50 border-r border-slate-200 flex items-center justify-center px-4 font-medium text-slate-600 select-none pointer-events-none">
          {selectedCountry.dialCode}
        </div>

        {/* ── Phone input: value is ONLY rawPhone (user-typed digits) ── */}
        <input
          type="tel"
          id={name}
          name={name}
          value={rawPhone}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!(touched && error)}
          aria-describedby={touched && error ? `${name}-error` : undefined}
          className="w-full px-4 py-3 border-none focus:outline-none bg-transparent"
          placeholder="Enter number"
          inputMode="numeric"
        />
      </div>

      {touched && error && (
        <p id={`${name}-error`} className="text-[#EF4444] text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
