import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

function RequestModal({ badge, title, description, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#010407]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close request form"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[calc(100vh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#e7dccb] bg-white shadow-2xl shadow-[#012E72]/20"
      >
        <div className="relative overflow-hidden border-b border-[#e7dccb] px-6 py-5 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-[#002DB5]/10 blur-3xl" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center rounded-full border border-[#d8cbb8] bg-[#F7F4EF] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#002DB5]">
                {badge}
              </p>
              <h3 id={titleId} className="mt-3 font-cinzel text-2xl font-bold uppercase text-[#012E72]">
                {title}
              </h3>
              <p className="mt-2 max-w-2xl font-constantia text-sm leading-relaxed text-[#010407]/75">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e7dccb] bg-white text-[#012E72] transition-colors hover:bg-[#F7F4EF]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

export default RequestModal;