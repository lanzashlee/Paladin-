import React from 'react';
import { Link } from 'react-router-dom';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

const heroImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80';
const heroStats = [
  ['30+', 'Coverage Options'],
  ['9', 'States Served'],
  ['FAST', 'Quote Turnaround'],
];

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#efeeea]"
    >
      {/* Use an <img> behind content so left/right empty areas show the same solid hero background color. */}
      <img
        src={heroImage}
        alt="Modern corporate office building"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full origin-top object-cover object-top pointer-events-none z-0"
        loading="lazy"
        decoding="async"
      />

      {/* Gradient overlay that blends image to background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#efeeea]/95 via-[#efeeea]/60 to-[#efeeea]/10 z-1" aria-hidden="true" />

      {/* Mobile readability: blur/dim the background image behind text */}
      <div className="absolute inset-0 bg-[#efeeea]/30 backdrop-blur-sm md:hidden z-0" aria-hidden="true" />

      <div className="lg:hidden mx-auto max-w-[680px] px-4 sm:px-6 pt-4 pb-8 relative z-10">
        <p className="text-[#0b347f] text-lg sm:text-xl font-medium mb-2" style={{ fontFamily: FONT_BODY, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Welcome to</p>
        <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
          <span className="block font-sans text-[3rem] sm:text-[4rem] font-bold" style={{ fontFamily: FONT_DISPLAY, textShadow: '0 3px 6px rgba(0,0,0,0.25)' }}>PALADIN</span>
          <span className="block mt-1 text-[1.35rem] sm:text-[1.75rem] font-sans text-[#0b347f] max-w-[15ch] leading-[1.05]" style={{ fontFamily: FONT_SUBHEADING, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Professional Insurance Solutions
          </span>
        </h1>

        <p className="mt-5 text-[#0f1419] text-sm sm:text-[15px] leading-relaxed max-w-[44ch]" style={{ fontFamily: FONT_BODY, textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
          Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-0">
          {heroStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl bg-[#f0efec] border border-[#d8cbb8] px-2 py-3 shadow-[0_5px_10px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center min-h-[66px]"
            >
              <p className="text-[#0b3a89] font-extrabold text-[1.25rem] sm:text-[1.5rem] leading-none" style={{ fontFamily: FONT_DISPLAY }}>
                {value}
              </p>
              <p className="mt-1 text-[0.62rem] sm:text-[0.72rem] uppercase tracking-[0.08em] text-[#7b7b7b] font-semibold text-center leading-tight" style={{ fontFamily: FONT_BODY }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: quote + call buttons */}
        <div className="mt-5 flex flex-col items-start gap-2.5">
          <Link
            to="/quote"
            className="inline-flex w-[190px] max-w-full items-center justify-center rounded-full border border-[#d8cbb8] bg-[#f0efec] text-[#161a22] text-xs font-semibold py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)] transition-colors hover:bg-[#012E72] hover:text-white"
            style={{ fontFamily: FONT_BODY }}
          >
            Request a <span className="ml-1 font-bold text-[#0b3a89]" style={{ fontFamily: FONT_SUBHEADING }}>Quote</span>
          </Link>
          <a
            href="tel:8056926900"
            className="inline-flex w-[190px] max-w-full items-center justify-center rounded-full border border-[#d8cbb8] bg-[#f0efec] text-[#161a22] text-xs font-semibold py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)] transition-colors hover:bg-[#012E72] hover:text-white"
            style={{ fontFamily: FONT_BODY }}
          >
            Call <span className="ml-1 font-bold text-[#0b3a89]" style={{ fontFamily: FONT_SUBHEADING }}>805 - 692 - 6900</span>
          </a>
        </div>
      </div>

      <div className="hidden lg:block relative mx-auto max-w-[1365px] h-[660px] px-4 lg:px-6 xl:px-8 z-10">
        <div className="absolute left-[clamp(12px,3vw,72px)] top-[clamp(88px,8vw,112px)] w-[min(390px,32vw)] max-w-[390px]">
          <p className="text-[#0b347f] text-[clamp(1.2rem,1.5vw,1.9rem)] leading-none font-medium mb-2" style={{ fontFamily: FONT_BODY, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Welcome to</p>

          <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
            <span className="block font-sans text-[clamp(3.8rem,6.3vw,6.6rem)] leading-[0.86] font-bold" style={{ fontFamily: FONT_DISPLAY, textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>PALADIN</span>
            <span className="block mt-1 text-[clamp(1.6rem,2.7vw,2.8rem)] font-sans text-[#0b347f] max-w-[15ch] leading-[0.95]" style={{ fontFamily: FONT_SUBHEADING, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Professional Insurance Solutions
            </span>
          </h1>

          <p className="mt-6 text-[#0f1419] text-[clamp(0.88rem,1.02vw,0.98rem)] leading-relaxed max-w-[40ch]" style={{ fontFamily: FONT_BODY, textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
          </p>

          {/* Move quote/call buttons under the coverage options (left side) */}
          <div className="mt-7 flex flex-col items-start gap-2.5 w-[min(220px,18vw)]">
            <Link
              to="/quote"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#d8cbb8] bg-[#f0efec] text-[#161a22] text-xs py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
              style={{ fontFamily: FONT_BODY }}
            >
              Request a <span className="ml-1 font-bold text-[#0b3a89]" style={{ fontFamily: FONT_SUBHEADING }}>Quote</span>
            </Link>
            <a
              href="tel:8056926900"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#d8cbb8] bg-[#f0efec] text-[#161a22] text-xs py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
              style={{ fontFamily: FONT_BODY }}
            >
              Call <span className="ml-1 font-bold text-[#0b3a89]" style={{ fontFamily: FONT_SUBHEADING }}>805 - 692 - 6900</span>
            </a>
          </div>
        </div>

        <div className="absolute right-[clamp(16px,3vw,34px)] top-1/2 -translate-y-1/2 w-[min(220px,18vw)] flex flex-col gap-1">
          {heroStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl bg-[#f0efec] px-4 py-3 shadow-[0_4px_9px_rgba(0,0,0,0.12)]"
            >
              <p className="text-[#0b3a89] font-extrabold text-[1.9rem] leading-none" style={{ fontFamily: FONT_DISPLAY }}>{value}</p>
              <p className="mt-1 text-[0.78rem] uppercase tracking-[0.08em] text-[#7b7b7b] font-semibold" style={{ fontFamily: FONT_BODY }}>{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Hero;
