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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
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
        className="relative z-10 w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-[1.75rem] border border-[#e6dccf] bg-[#fcfbf8] shadow-[0_24px_70px_rgba(1,46,114,0.22)] flex flex-col"
      >
        <div className="relative shrink-0 overflow-hidden border-b border-[#e6dccf] px-5 py-5 sm:px-8 sm:py-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#002DB5]/8 blur-3xl" />
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="inline-flex items-center rounded-full border border-[#d8cbb8] bg-[#f7f2e9] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#002DB5] shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                {content.badge}
              </p>
              <h3 id={titleId} className="mt-3 text-[2rem] font-extrabold leading-none text-[#012E72] sm:text-[2.35rem]">
                {content.title}
              </h3>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#010407]/55">
                Last Updated: {content.lastUpdated}
              </p>
              <p className="mt-4 max-w-3xl text-[15px] leading-[1.7] text-[#010407]/78 sm:text-[16px]">
                {content.intro}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#dbcdb8] bg-white text-[#012E72] shadow-[0_6px_14px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#f7f2e9]"
              aria-label="Close legal modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
          <div className="space-y-0">
            {content.sections.map((section, index) => (
              <section
                key={section.heading}
                className={`py-5 sm:py-6 ${index !== content.sections.length - 1 ? 'border-b border-[#eadfce]' : ''}`}
              >
                <h4 className="text-[1.05rem] font-extrabold text-[#012E72] sm:text-[1.15rem]">
                  {section.heading}
                </h4>
                <div className="mt-3 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[15px] leading-[1.75] text-[#010407]/80 sm:text-[16px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
