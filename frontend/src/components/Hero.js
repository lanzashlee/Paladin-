import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-image.png';

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#f4f4f4]">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8 pt-5 pb-8 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.02fr_0.54fr] lg:min-h-[640px] gap-6 lg:gap-8 items-start">
          <div className="pt-3 lg:pt-16 order-1">
            <p className="text-[#0f3a88] text-lg sm:text-xl font-medium mb-2">Welcome to</p>

            <h1 className="leading-[0.92] tracking-tight text-[#0b347f]">
              <span className="block font-serif text-[3rem] sm:text-[4.4rem] lg:text-[5.2rem] font-bold">PALADIN</span>
              <span className="block mt-1 text-[1.55rem] sm:text-[2.1rem] lg:text-[2.35rem] font-serif text-[#103472] max-w-[15ch] leading-[1.05]">
                Professional Insurance Solutions
              </span>
            </h1>

            <p className="mt-5 text-[#181818] text-sm sm:text-[15px] leading-relaxed max-w-[44ch]">
              Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2.5 max-w-[440px]">
              {['Professional', 'Commercial', 'Landlord', 'Contractors', 'Watercraft', 'Auto'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-[#f0efec] px-4 py-1 text-[11px] sm:text-xs font-medium text-[#1e1e1e] shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
                >
                  {item}
                </span>
              ))}
              <Link
                to="/service"
                className="inline-flex items-center rounded-full bg-[#f0efec] px-4 py-1 text-[11px] sm:text-xs font-medium text-[#1e1e1e] shadow-[0_3px_8px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#0b3a89] hover:text-white"
              >
                and More
              </Link>
            </div>
          </div>

          <div className="order-2 lg:self-end">
            <img
              src={heroImage}
              alt="Paladin Insurance tower"
              className="mx-auto w-full max-w-[660px] lg:max-w-none lg:w-[112%] lg:-ml-10 object-contain object-bottom"
            />
          </div>

          <div className="order-3 flex flex-col gap-3 lg:pt-16">
            {[
              ['30 +', 'Coverage Option'],
              ['9', 'States Served'],
              ['FAST', 'Quote Turnaround'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="w-full sm:max-w-[220px] lg:max-w-[210px] rounded-2xl bg-[#f0efec] px-4 py-3 shadow-[0_8px_14px_rgba(0,0,0,0.18)]"
              >
                <p className="text-[#0b3a89] font-extrabold text-[1.9rem] leading-none">{value}</p>
                <p className="mt-1 text-[0.78rem] uppercase tracking-[0.08em] text-[#7b7b7b] font-semibold">{label}</p>
              </div>
            ))}

            <div className="mt-1 lg:mt-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 lg:pb-8">
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
        </div>
      </div>
    </section>
  );
}

export default Hero;
