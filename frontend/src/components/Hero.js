import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Globe, Zap, FileText, Phone } from 'lucide-react';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

const heroImage = '/Paladin HQ.png';

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#efeeea]"
    >
      {/* Use an <img> behind content so left/right empty areas show the same solid hero background color. */}
      <img
        src={heroImage}
        alt="Paladin Insurance headquarters office entrance"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full origin-top object-cover object-left pointer-events-none z-0"
        style={{
          transform: 'scale(0.97)',
          filter: 'brightness(1.08) contrast(1.12) saturate(1.05)',
          WebkitFilter: 'brightness(1.08) contrast(1.12) saturate(1.05)'
        }}
        loading="lazy"
        decoding="async"
      />

      {/* Gradient overlay on left side only */}
      <div className="absolute inset-0 z-1" style={{
        background: 'linear-gradient(to right, rgba(239,238,234,1) 0%, rgba(239,238,234,0.98) 18%, rgba(239,238,234,0.88) 30%, rgba(239,238,234,0.55) 43%, rgba(239,238,234,0.18) 55%, transparent 68%)',
        pointerEvents: 'none'
      }} aria-hidden="true" />

      {/* Mobile readability: blur/dim the background image behind text */}
      <div className="absolute inset-0 bg-[#efeeea]/20 backdrop-blur-xs md:hidden z-0" aria-hidden="true" />

      <div className="lg:hidden mx-auto max-w-[680px] px-4 sm:px-6 pt-0 pb-0 relative z-10">
        <p className="text-[#0b347f] text-lg sm:text-xl font-medium mb-2" style={{ fontFamily: FONT_BODY }}>Welcome to</p>
        <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
          <span className="block font-sans text-[3rem] sm:text-[4rem] font-bold text-[#0b3a89]" style={{ fontFamily: FONT_DISPLAY }}>PALADIN</span>
          <span className="block mt-1 text-[1.35rem] sm:text-[1.75rem] font-sans text-[#0b347f] max-w-[15ch] leading-[1.05]" style={{ fontFamily: FONT_SUBHEADING }}>
            Professional Insurance Solutions
          </span>
        </h1>

        <p className="mt-5 text-[#4a5568] text-sm sm:text-[15px] leading-relaxed max-w-[44ch]" style={{ fontFamily: FONT_BODY }}>
          Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
        </p>

        {/* Mobile: quote + call buttons */}
        <div className="mt-6 flex flex-col items-start gap-3 w-full">
          <Link
            to="/quote"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0b3a89] to-[#0a2a6b] text-white text-sm font-semibold py-3 shadow-[0_6px_12px_rgba(11,58,137,0.3)] transition-all hover:shadow-[0_10px_20px_rgba(11,58,137,0.4)] hover:-translate-y-0.5"
            style={{ fontFamily: FONT_BODY }}
          >
            <FileText className="w-4 h-4" />
            Request a Quote
          </Link>
          <a
            href="tel:8056926900"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#0b3a89] text-[#0b3a89] text-sm font-semibold py-3 bg-white shadow-[0_4px_10px_rgba(11,58,137,0.15)] transition-all hover:bg-[#0b3a89] hover:text-white hover:shadow-[0_8px_16px_rgba(11,58,137,0.3)] hover:-translate-y-0.5"
            style={{ fontFamily: FONT_BODY }}
          >
            <Phone className="w-4 h-4" />
            Call 805 - 692 - 6900
          </a>
        </div>
      </div>

      <div className="hidden lg:block relative mx-auto max-w-[1365px] h-[660px] px-4 lg:px-6 xl:px-8 z-10">
        <div className="absolute left-[clamp(12px,3vw,72px)] top-[40%] -translate-y-1/2 w-[min(360px,30vw)] max-w-[360px] px-6 py-8">
          <p className="text-[#0b347f] text-[clamp(1rem,1.3vw,1.6rem)] leading-none font-medium mb-3" style={{ fontFamily: FONT_BODY }}>Welcome to</p>

          <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
            <span className="block font-sans text-[clamp(3.2rem,5.5vw,5.8rem)] leading-[0.86] font-bold text-[#0b3a89]" style={{ fontFamily: FONT_DISPLAY }}>PALADIN</span>
            <span className="block mt-1 text-[clamp(1.4rem,2.3vw,2.4rem)] font-sans text-[#0b347f] max-w-[15ch] leading-[0.95]" style={{ fontFamily: FONT_SUBHEADING }}>
              Professional Insurance Solutions
            </span>
          </h1>

          <p className="mt-5 text-[#4a5568] text-[clamp(0.8rem,0.95vw,0.9rem)] leading-relaxed max-w-[38ch]" style={{ fontFamily: FONT_BODY }}>
            Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-col items-stretch gap-3 w-full">
            <Link
              to="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0b3a89] to-[#0a2a6b] text-white text-sm font-semibold py-3 shadow-[0_8px_16px_rgba(11,58,137,0.3)] transition-all hover:shadow-[0_12px_24px_rgba(11,58,137,0.4)] hover:-translate-y-0.5"
              style={{ fontFamily: FONT_BODY }}
            >
              <FileText className="w-4 h-4" />
              Request a Quote
            </Link>
            <a
              href="tel:8056926900"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0b3a89] text-[#0b3a89] text-sm font-semibold py-3 bg-white shadow-[0_4px_12px_rgba(11,58,137,0.15)] transition-all hover:bg-[#0b3a89] hover:text-white hover:shadow-[0_8px_20px_rgba(11,58,137,0.3)] hover:-translate-y-0.5"
              style={{ fontFamily: FONT_BODY }}
            >
              <Phone className="w-4 h-4" />
              Call 805 - 692 - 6900
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
