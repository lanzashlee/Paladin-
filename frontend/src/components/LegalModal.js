import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

function LegalModal({ isOpen, content, onClose }) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

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
  }, [isOpen, onClose]);

  if (!isOpen || !content) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#010407]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close legal modal"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-[#e7dccb] bg-white shadow-2xl shadow-[#012E72]/20"
      >
        <div className="relative overflow-hidden border-b border-[#e7dccb] px-6 py-5 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-[#002DB5]/10 blur-3xl" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center rounded-full border border-[#d8cbb8] bg-[#F7F4EF] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#002DB5]">
                {content.badge}
              </p>
              <h3 id={titleId} className="mt-3 text-2xl font-bold text-[#012E72]">
                {content.title}
              </h3>
              <p className="mt-1 text-xs font-semibold tracking-wide uppercase text-[#010407]/55">
                Last Updated: {content.lastUpdated}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#010407]/75">
                {content.intro}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e7dccb] bg-white text-[#012E72] transition-colors hover:bg-[#F7F4EF]"
              aria-label="Close legal modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 space-y-6">
          {content.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h4 className="text-base font-bold text-[#012E72]">{section.heading}</h4>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-[#010407]/80">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
