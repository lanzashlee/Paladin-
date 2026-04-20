import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-image.png';

function Hero() {
  return (
    <section id="hero" className="relative bg-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-10 pt-4 lg:pt-5 pb-2 lg:pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_0.95fr_0.45fr] gap-6 lg:gap-8 items-start">
          <div className="pt-3 lg:pt-14">
            <p className="text-[#123f93] text-2xl mb-2">Welcome to</p>
            <h1 className="leading-[0.96] tracking-tight text-[#0b3a89]">
              <span className="block text-7xl sm:text-8xl font-black">PALADIN</span>
              <span className="block text-[2.45rem] sm:text-5xl font-medium text-[#11346f] mt-1">
                Professional Insurance Solutions
              </span>
            </h1>

            <p className="mt-7 text-[#14161d] text-base leading-relaxed max-w-[37ch] font-medium">
              Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5 max-w-[430px]">
              {['Professional', 'Commercial', 'Landlord', 'Contractors', 'Watercraft', 'Auto'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full px-4 py-1 text-xs font-medium shadow-[0_4px_7px_rgba(0,0,0,0.16)] bg-[#f4f2ed] text-[#1b1f26]"
                >
                  {item}
                </span>
              ))}
              <Link
                to="/service"
                className="inline-flex items-center rounded-full px-4 py-1 text-xs font-medium shadow-[0_4px_7px_rgba(0,0,0,0.16)] bg-[#f4f2ed] text-[#1b1f26] hover:bg-[#0b3a89] hover:text-white transition-colors"
              >
                and More
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-start self-start">
            <img
              src={heroImage}
              alt="Paladin building"
              className="w-full max-w-[520px] h-auto object-contain object-top"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 lg:pt-0 lg:items-end">
            {[
              ['30 +', 'Coverage Option'],
              ['9', 'States Served'],
              ['FAST', 'Quote  Turnaround'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="w-full max-w-[188px] rounded-2xl px-3.5 py-2.5 bg-[#f4f2ed] shadow-[0_7px_11px_rgba(0,0,0,0.17)]"
              >
                <p className="text-[1.85rem] font-extrabold text-[#0b3a89] leading-none">{value}</p>
                <p className="mt-0.5 text-[0.82rem] uppercase tracking-[0.07em] text-[#787878] font-semibold leading-snug">{label}</p>
              </div>
            ))}

            <div className="pt-0.5 flex flex-col gap-2 w-full max-w-[188px]">
              <a
                href="#contact-location"
                className="inline-flex items-center justify-center rounded-full bg-[#f4f2ed] text-[#161a22] text-xs py-1.5 shadow-[0_6px_9px_rgba(0,0,0,0.16)]"
              >
                Get <span className="text-[#0b3a89] font-bold ml-1">Free Quote</span>
              </a>
              <a
                href="tel:8056926900"
                className="inline-flex items-center justify-center rounded-full bg-[#f4f2ed] text-[#161a22] text-xs py-1.5 shadow-[0_6px_9px_rgba(0,0,0,0.16)]"
              >
                Call <span className="text-[#0b3a89] font-bold ml-1">805 - 692 - 6900</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
