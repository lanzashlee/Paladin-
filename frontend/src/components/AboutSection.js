import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck } from 'lucide-react';
import corporateOffice from '../assets/corporate-office.jpg';

function AboutSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const goPrev = () => setActiveSlide((current) => (current === 0 ? 1 : 0));
  const goNext = () => setActiveSlide((current) => (current === 1 ? 0 : 1));

  return (
    <section className="py-8 md:py-10 bg-white w-full" id="who-we-are">
      <div className="max-w-[840px] mx-auto px-3 md:px-4 w-full">
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-[#d5c8b5] bg-[#f4f2ed] px-4 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#123f93] uppercase shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
            Who We Are
          </span>
        </div>
        <div className="relative rounded-[1.05rem] border-[3px] border-[#ece8df] bg-[#efefef] p-2.5 md:p-3 shadow-[0_8px_16px_rgba(0,0,0,0.08)] min-h-[390px] md:min-h-[430px]">
          {activeSlide === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_0.68fr] gap-2.5 md:gap-3 items-start">
              <div className="rounded-xl bg-[#efefef] p-3 md:p-3.5 pt-4 md:pt-5 flex flex-col justify-start min-h-[340px] md:min-h-[380px]">
                <h2 className="text-center text-[1.6rem] md:text-[1.75rem] font-extrabold text-[#123f93] mb-2 uppercase">
                  Who We Are
                </h2>
                <p className="text-center text-[1.35rem] md:text-[1.45rem] font-bold text-[#12151d] mb-2 leading-tight">
                  " Protecting what <span className="italic">matters</span> most "
                </p>
                <p className="text-[#1d1f26] text-[14px] md:text-[16px] leading-[1.55] text-justify max-w-[45ch] mx-auto">
                  Paladin Professional Insurance Solutions is a full-service independent insurance agency
                  committed to delivering premium protection across personal, commercial, and specialty
                  lines. We understand that every client is unique — which is why we take a consultative,
                  hands-on approach to crafting coverage that truly fits your life and your business.
                </p>

                <div className="mt-2.5 text-center">
                  <Link
                    to="/about"
                    className="inline-flex items-center rounded-full bg-[#f4f2ed] text-[#123f93] px-3.5 py-0.5 text-[10px] font-bold shadow-[0_5px_9px_rgba(0,0,0,0.14)] hover:bg-[#123f93] hover:text-white transition-colors"
                  >
                    ABOUT PALADIN
                  </Link>
                </div>
              </div>

              <div className="rounded-xl bg-[#0b3a89] text-white p-2 md:p-2.5 shadow-[0_10px_16px_rgba(0,0,0,0.2)] self-start w-full justify-self-end min-h-[340px] md:min-h-[380px] flex flex-col">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f2ed] text-[#1f4fb0] flex items-center justify-center shadow-sm">
                    <Target className="w-4.5 h-4.5" />
                  </div>
                  <div className="rounded-full bg-[#f4f2ed] text-[#123f93] px-3 py-0.5 text-sm md:text-base font-bold shadow-[0_6px_10px_rgba(0,0,0,0.18)]">
                    OUR MISSION
                  </div>
                </div>

                <p className="text-white text-[15px] md:text-[17px] leading-[1.45] text-center max-w-[26ch] mx-auto flex-1 flex items-center">
                  Our mission is to provide you with the quality service and care that you deserve. We
                  understand the unique challenges of owning and operating a business. This is why we
                  are dedicated to providing you with hassle-free insurance service that best suits your
                  needs.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[0.78fr_1fr] gap-3.5 md:gap-4 items-stretch">
              <div className="rounded-xl overflow-hidden bg-white border border-[#e5ddd0] min-h-[300px] md:min-h-[330px]">
                <img
                  src={corporateOffice}
                  alt="Professional insurance consultation"
                  className="w-full h-full min-h-[300px] md:min-h-[330px] object-cover"
                />
              </div>

              <div className="rounded-xl bg-[#efefef] p-3.5 md:p-4 flex flex-col justify-center min-h-[300px] md:min-h-[330px]">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#f4f2ed] text-[#1f4fb0] flex items-center justify-center border border-[#d9cec0]">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="rounded-full bg-[#f4f2ed] text-[#123f93] px-3.5 py-1 text-lg md:text-xl font-bold shadow-[0_6px_10px_rgba(0,0,0,0.14)]">
                    OUR PROMISE
                  </div>
                </div>

                <p className="text-[#1b1d23] text-[13px] md:text-[15px] leading-relaxed mb-2">
                  With agents that have over 20 years of experience in the insurance industry, we take
                  pride in being able to service you. We promise to:
                </p>
                <ul className="list-disc pl-5 text-[#1b1d23] text-[13px] md:text-[15px] leading-relaxed space-y-0">
                  <li>Find you the correct coverage at an unbeatable price</li>
                  <li>Provide one-on-one guidance through every step of the process</li>
                  <li>Treat every client as we would our own family</li>
                  <li>Deliver peace of mind — knowing you're covered at a fair rate</li>
                </ul>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="hidden md:flex absolute left-4 md:left-5 lg:left-6 top-1/2 -translate-y-1/2 text-[#dfdfdf] hover:text-[#bbbbbb] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-8 h-8">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="hidden md:flex absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 text-[#dfdfdf] hover:text-[#bbbbbb] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" className="w-8 h-8">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="mt-5 flex md:hidden items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full border border-[#d5c8b5] px-4 py-2 text-[#123f93] text-sm font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-[#d5c8b5] px-4 py-2 text-[#123f93] text-sm font-semibold"
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
