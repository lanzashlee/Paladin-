import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck } from 'lucide-react';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

function AboutSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const isMission = activeSlide === 0;
  const isPromise = activeSlide === 1;

  const goPrev = () => setActiveSlide((current) => (current > 0 ? current - 1 : current));
  const goNext = () => setActiveSlide((current) => (current < 1 ? current + 1 : current));

  return (
    <section className="relative py-10 md:py-16 bg-[#edf2f8] w-full overflow-hidden" id="who-we-are">
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#c6d8f3]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#d6c6aa]/25 blur-3xl" />

      <div className="max-w-[980px] mx-auto px-4 md:px-6 w-full relative z-10">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-[#c9b9a3] bg-[#f5f1e9] px-4 sm:px-5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[#123f93] uppercase shadow-[0_6px_14px_rgba(7,32,76,0.12)]" style={{ fontFamily: FONT_BODY }}>
            Who We Are
          </span>
        </div>

        <div className="relative rounded-[1.2rem] sm:rounded-[1.4rem] border border-[#d8e0ee] bg-[linear-gradient(180deg,#f8fbff_0%,#edf3fb_100%)] p-4 md:p-6 shadow-[0_20px_45px_rgba(14,40,86,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.78fr] gap-4 md:gap-5 items-stretch">
            <div className="rounded-2xl border border-[#dbe3f1] bg-white/95 p-4 sm:p-5 md:p-7 flex flex-col justify-start shadow-[0_10px_24px_rgba(16,45,93,0.08)]">
              <h2 className="text-center text-[1.55rem] sm:text-[1.85rem] md:text-[2.1rem] font-extrabold text-[#123f93] mb-2 uppercase tracking-tight" style={{ fontFamily: FONT_DISPLAY }}>
                ABOUT PALADIN
              </h2>
              <p className="text-center text-[1.2rem] sm:text-[1.35rem] md:text-[1.6rem] font-semibold text-[#10141e] mb-3 leading-tight" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>
                "Protecting what matters, with care that shows"
              </p>
              <p className="text-[#1b1f28] text-[14px] sm:text-[15px] md:text-[17px] leading-[1.62] text-left md:text-justify max-w-[48ch] mx-auto" style={{ fontFamily: FONT_BODY }}>
                Paladin Professional Insurance Solutions is a full-service independent insurance agency
                committed to delivering premium protection across personal, commercial, and specialty
                lines. We understand that every client is unique — which is why we take a consultative,
                hands-on approach to crafting coverage that truly fits your life and your business.
              </p>
            </div>

            <div className="self-start w-full justify-self-end">
              <div
                className={`w-full rounded-2xl border border-[#29569e] bg-[linear-gradient(155deg,#114b9d_0%,#0b3579_100%)] text-white p-5 md:p-6 shadow-[0_14px_30px_rgba(9,31,68,0.35)] transition-opacity duration-300 overflow-hidden flex flex-col ${
                  isMission ? 'opacity-100' : 'opacity-100'
                }`}
              >
                <div className="grid">
                  <div
                    className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 ${
                      isMission ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-white flex items-center justify-center">
                        <Target className="w-[1.55rem] h-[1.55rem] sm:w-[1.85rem] sm:h-[1.85rem] md:w-[2.1rem] md:h-[2.1rem]" />
                      </div>
                      <h2 className="text-center text-[1.55rem] sm:text-[1.85rem] md:text-[2.1rem] font-extrabold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: FONT_DISPLAY }}>
                        OUR MISSION
                      </h2>
                    </div>

                    <p className="text-white/95 text-[14px] sm:text-[15px] md:text-[17px] leading-[1.62] text-left md:text-justify" style={{ fontFamily: FONT_BODY }}>
                      Our mission is to provide you with the quality service and care that you deserve. We
                      understand the unique challenges of owning and operating a business. This is why we
                      are dedicated to providing you with hassle-free insurance service that best suits your
                      needs.
                    </p>
                  </div>
                  <div
                    className={`col-start-1 row-start-1 flex flex-col transition-opacity duration-300 ${
                      isPromise ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-white flex items-center justify-center">
                        <ShieldCheck className="w-[1.55rem] h-[1.55rem] sm:w-[1.85rem] sm:h-[1.85rem] md:w-[2.1rem] md:h-[2.1rem]" />
                      </div>
                      <h2 className="text-center text-[1.55rem] sm:text-[1.85rem] md:text-[2.1rem] font-extrabold text-white mb-2 uppercase tracking-tight" style={{ fontFamily: FONT_DISPLAY }}>
                        OUR PROMISE
                      </h2>
                    </div>

                    <p className="text-white/95 text-[14px] sm:text-[15px] md:text-[17px] leading-[1.62] mb-2" style={{ fontFamily: FONT_BODY }}>
                      With agents that have over 20 years of experience in the insurance industry, we take
                      pride in being able to service you. We promise to:
                    </p>
                    <ul className="list-disc pl-5 text-white/95 text-[14px] sm:text-[15px] md:text-[17px] leading-[1.62] space-y-1 marker:text-[#d4e4ff]" style={{ fontFamily: FONT_BODY }}>
                      <li>Find you the correct coverage at an unbeatable price</li>
                      <li>Provide one-on-one guidance through every step of the process</li>
                      <li>Treat every client as we would our own family</li>
                      <li>Deliver peace of mind — knowing you're covered at a fair rate</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={isMission}
                    aria-label="Show Our Mission or Previous Card"
                    className={`rounded-full border px-4 py-2 text-[#123f93] text-sm font-semibold shadow-[0_6px_12px_rgba(11,41,89,0.12)] transition-colors ${
                      isMission
                        ? 'border-[#dbe3f1] bg-[#eef3fb] opacity-55 cursor-not-allowed'
                        : 'border-[#c7d4e8] bg-white hover:bg-[#123f93] hover:text-white'
                    }`}
                    style={{ fontFamily: FONT_BODY }}
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isPromise}
                    aria-label="Show Our Promise or Next Card"
                    className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-[0_6px_12px_rgba(11,41,89,0.18)] transition-colors ${
                      isPromise
                        ? 'border-[#dbe3f1] bg-[#eef3fb] text-[#123f93] opacity-55 cursor-not-allowed'
                        : 'border-[#123f93] bg-[#123f93] text-white hover:bg-[#0f3272]'
                    }`}
                    style={{ fontFamily: FONT_BODY }}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
