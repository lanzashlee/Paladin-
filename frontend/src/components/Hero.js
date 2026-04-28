import React from 'react';
import { Link } from 'react-router-dom';

const heroImage = '/Paladin%20UI.png';
const heroTags = ['Professional', 'Commercial', 'Landlord', 'Contractors', 'Watercraft', 'Auto'];
const heroStats = [
  ['30 +', 'Coverage Option'],
  ['9', 'States Served'],
  ['FAST', 'Quote Turnaround'],
];

function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#efeeea]"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <div className="lg:hidden mx-auto max-w-[680px] px-4 sm:px-6 pt-4 pb-8">
        <p className="text-[#0f3a88] text-lg sm:text-xl font-medium mb-2">Welcome to</p>
        <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
          <span className="block font-serif text-[3rem] sm:text-[4rem] font-bold">PALADIN</span>
          <span className="block mt-1 text-[1.5rem] sm:text-[2rem] font-serif text-[#103472] max-w-[15ch] leading-[1.05]">
            Professional Insurance Solutions
          </span>
        </h1>

        <p className="mt-5 text-[#181818] text-sm sm:text-[15px] leading-relaxed max-w-[44ch]">
          Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {heroStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl bg-[#f0efec] px-3 py-2.5 shadow-[0_8px_14px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[#0b3a89] font-extrabold text-[1.5rem] leading-none">{value}</p>
              <p className="mt-1 text-[0.72rem] uppercase tracking-[0.08em] text-[#7b7b7b] font-semibold">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2.5">
          {heroTags.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full bg-[#f0efec] px-4 py-1 text-[11px] font-medium text-[#1e1e1e] shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
            >
              {item}
            </span>
          ))}
          <Link
            to="/service"
            className="inline-flex items-center rounded-full bg-[#f0efec] px-4 py-1 text-[11px] font-medium text-[#1e1e1e] shadow-[0_3px_8px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#0b3a89] hover:text-white"
          >
            and More
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            to="/quote"
            className="inline-flex items-center justify-center rounded-full bg-[#f0efec] text-[#161a22] text-xs py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
          >
            Request <span className="ml-1 font-bold text-[#0b3a89]">a Quote</span>
          </Link>
          <a
            href="tel:8056926900"
            className="inline-flex items-center justify-center rounded-full bg-[#f0efec] text-[#161a22] text-xs py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
          >
            Call <span className="ml-1 font-bold text-[#0b3a89]">805 - 692 - 6900</span>
          </a>
        </div>
      </div>

      <div className="hidden lg:block relative mx-auto max-w-[1365px] h-[760px] px-4 lg:px-6 xl:px-8">
        <div className="absolute left-[clamp(12px,3vw,72px)] top-[clamp(88px,8vw,112px)] w-[min(390px,32vw)] max-w-[390px]">
          <p className="text-[#0f3a88] text-[clamp(1.2rem,1.5vw,1.9rem)] leading-none font-medium mb-2">Welcome to</p>

          <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
            <span className="block font-serif text-[clamp(3.8rem,6.3vw,6.6rem)] leading-[0.86] font-bold">PALADIN</span>
            <span className="block mt-1 text-[clamp(1.75rem,3.1vw,3.1rem)] font-serif text-[#103472] max-w-[15ch] leading-[0.95]">
              Professional Insurance Solutions
            </span>
          </h1>

          <p className="mt-6 text-[#181818] text-[clamp(0.88rem,1.02vw,0.98rem)] leading-relaxed max-w-[40ch]">
            Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-2.5 gap-y-2.5 max-w-[400px]">
            {heroTags.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full bg-[#f0efec] px-3.5 py-1 text-[10px] font-medium text-[#1e1e1e] shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
              >
                {item}
              </span>
            ))}
            <Link
              to="/service"
              className="inline-flex items-center rounded-full bg-[#f0efec] px-3.5 py-1 text-[10px] font-medium text-[#1e1e1e] shadow-[0_3px_8px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#0b3a89] hover:text-white"
            >
              and More
            </Link>
          </div>
        </div>

        <div className="absolute right-[clamp(16px,3vw,34px)] top-[clamp(88px,8vw,96px)] w-[min(220px,18vw)] flex flex-col gap-3">
          {heroStats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl bg-[#f0efec] px-4 py-3 shadow-[0_8px_14px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[#0b3a89] font-extrabold text-[1.9rem] leading-none">{value}</p>
              <p className="mt-1 text-[0.78rem] uppercase tracking-[0.08em] text-[#7b7b7b] font-semibold">{label}</p>
            </div>
          ))}
        </div>

        <div className="absolute right-[clamp(16px,3vw,34px)] bottom-[clamp(36px,4vw,56px)] w-[min(220px,18vw)] flex flex-col gap-2.5">
          <Link
            to="/quote"
            className="inline-flex items-center justify-center rounded-full bg-[#f0efec] text-[#161a22] text-xs py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
          >
            Get <span className="ml-1 font-bold text-[#0b3a89]">Free Quote</span>
          </Link>
          <a
            href="tel:8056926900"
            className="inline-flex items-center justify-center rounded-full bg-[#f0efec] text-[#161a22] text-xs py-2.5 shadow-[0_6px_10px_rgba(0,0,0,0.16)]"
          >
            Call <span className="ml-1 font-bold text-[#0b3a89]">805 - 692 - 6900</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
