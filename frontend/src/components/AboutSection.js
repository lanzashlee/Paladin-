import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck } from 'lucide-react';

function AboutSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const isMission = activeSlide === 0;

  const goPrev = () => setActiveSlide((current) => (current === 0 ? 1 : 0));
  const goNext = () => setActiveSlide((current) => (current === 1 ? 0 : 1));

  return (
    <section className="relative py-10 md:py-16 bg-[#edf2f8] w-full overflow-hidden" id="who-we-are">
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#c6d8f3]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#d6c6aa]/25 blur-3xl" />

      <div className="max-w-[980px] mx-auto px-4 md:px-6 w-full relative z-10">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-[#c9b9a3] bg-[#f5f1e9] px-4 sm:px-5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[#123f93] uppercase shadow-[0_6px_14px_rgba(7,32,76,0.12)]">
            Who We Are
          </span>
        </div>

        <div className="relative rounded-[1.2rem] sm:rounded-[1.4rem] border border-[#d8e0ee] bg-[linear-gradient(180deg,#f8fbff_0%,#edf3fb_100%)] p-4 md:p-6 shadow-[0_20px_45px_rgba(14,40,86,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.78fr] gap-4 md:gap-5 items-stretch">
            <div className="rounded-2xl border border-[#dbe3f1] bg-white/95 p-4 sm:p-5 md:p-7 flex flex-col justify-start shadow-[0_10px_24px_rgba(16,45,93,0.08)]">
              <h2 className="text-center text-[1.55rem] sm:text-[1.85rem] md:text-[2.1rem] font-extrabold text-[#123f93] mb-2 uppercase tracking-tight">
                Who We Are
              </h2>
              <p className="text-center text-[1.2rem] sm:text-[1.35rem] md:text-[1.6rem] font-bold text-[#10141e] mb-3 leading-tight">
                " Protecting what <span className="italic">matters</span> most "
              </p>
              <p className="text-[#1b1f28] text-[14px] sm:text-[15px] md:text-[17px] leading-[1.62] text-left md:text-justify max-w-[48ch] mx-auto">
                Paladin Professional Insurance Solutions is a full-service independent insurance agency
                committed to delivering premium protection across personal, commercial, and specialty
                lines. We understand that every client is unique — which is why we take a consultative,
                hands-on approach to crafting coverage that truly fits your life and your business.
              </p>

              <div className="mt-5 text-center">
                <Link
                  to="/about"
                  className="inline-flex items-center rounded-full border border-[#c9b9a3] bg-[#f5f1e9] text-[#123f93] px-4 py-1 text-[11px] font-bold tracking-[0.06em] shadow-[0_6px_12px_rgba(12,38,81,0.12)] hover:bg-[#123f93] hover:border-[#123f93] hover:text-white transition-colors"
                >
                  ABOUT PALADIN
                </Link>
              </div>
            </div>

            <div className="self-start w-full justify-self-end min-h-[320px] sm:min-h-[350px] lg:h-[440px]">
              <div
                className={`w-full h-full rounded-2xl border border-[#29569e] bg-[linear-gradient(155deg,#114b9d_0%,#0b3579_100%)] text-white p-5 md:p-6 shadow-[0_14px_30px_rgba(9,31,68,0.35)] transition-opacity duration-300 overflow-hidden ${
                  isMission ? 'opacity-100' : 'opacity-100'
                }`}
              >
                {isMission ? (
                  <div className="flex h-full flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-white flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="text-white text-[1.2rem] md:text-[1.35rem] font-bold tracking-[0.04em] uppercase">
                        OUR MISSION
                      </div>
                    </div>

                    <p className="text-white/95 text-[14px] md:text-[16px] leading-[1.65] text-left md:text-justify">
                      Our mission is to provide you with the quality service and care that you deserve. We
                      understand the unique challenges of owning and operating a business. This is why we
                      are dedicated to providing you with hassle-free insurance service that best suits your
                      needs.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col overflow-y-auto pr-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-white flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="text-white text-[1.2rem] md:text-[1.35rem] font-bold tracking-[0.04em] uppercase">
                        OUR PROMISE
                      </div>
                    </div>

                    <p className="text-white/95 text-[14px] md:text-[16px] leading-[1.65] mb-2">
                      With agents that have over 20 years of experience in the insurance industry, we take
                      pride in being able to service you. We promise to:
                    </p>
                    <ul className="list-disc pl-5 text-white/95 text-[14px] md:text-[16px] leading-[1.55] space-y-1 marker:text-[#d4e4ff]">
                      <li>Find you the correct coverage at an unbeatable price</li>
                      <li>Provide one-on-one guidance through every step of the process</li>
                      <li>Treat every client as we would our own family</li>
                      <li>Deliver peace of mind — knowing you're covered at a fair rate</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="hidden md:flex absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-[#cfdae9] bg-white/85 text-[#123f93] shadow-[0_8px_18px_rgba(11,41,89,0.16)] hover:bg-[#123f93] hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="hidden md:flex absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full border border-[#cfdae9] bg-white/85 text-[#123f93] shadow-[0_8px_18px_rgba(11,41,89,0.16)] hover:bg-[#123f93] hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-5 h-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="mt-6 flex md:hidden items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full border border-[#c7d4e8] bg-white px-4 py-2 text-[#123f93] text-sm font-semibold shadow-[0_6px_12px_rgba(11,41,89,0.12)]"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-[#123f93] bg-[#123f93] px-4 py-2 text-white text-sm font-semibold shadow-[0_6px_12px_rgba(11,41,89,0.18)]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
