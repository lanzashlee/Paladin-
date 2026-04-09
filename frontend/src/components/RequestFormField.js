import React from 'react';

export const inputClassName =
  'w-full rounded-xl border border-[#d8cbb8] bg-[#F7F4EF]/40 px-4 py-3 text-[#010407] placeholder:text-[#010407]/35 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002DB5]/40 focus:border-[#002DB5] transition-colors';

function FieldGroup({ label, htmlFor, required = false, children, hint, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#010407]/80">
        {label} {required && <span className="text-[#002DB5]">*</span>}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : hint && <p className="text-xs text-[#010407]/55">{hint}</p>}
    </div>
  );
}

export default FieldGroup;