import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-image.png';

function Hero() {
  return (
    <section id="hero" className="relative bg-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 lg:pt-5 pb-6 lg:pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_0.95fr_0.45fr] lg:grid-rows-[auto_auto] gap-5 sm:gap-6 lg:gap-x-8 lg:gap-y-6 items-start">
          <div className="pt-1 sm:pt-3 lg:pt-14 lg:col-start-1 lg:row-start-1">
            <p className="text-[#123f93] text-xl sm:text-2xl mb-2">Welcome to</p>
            <h1 className="leading-[0.96] tracking-tight text-[#0b3a89]">
              <span className="block text-[2.9rem] sm:text-6xl lg:text-7xl font-black">PALADIN</span>
              <span className="block text-[1.3rem] sm:text-[2rem] lg:text-[2.9rem] font-medium text-[#11346f] mt-1 leading-tight max-w-[18ch]">
                Professional Insurance Solutions
              </span>
            </h1>

            <p className="mt-5 sm:mt-7 text-[#14161d] text-sm sm:text-base leading-relaxed max-w-[40ch] font-medium">
              Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start self-start overflow-visible lg:col-start-2 lg:row-span-2">
            <img
              src={heroImage}
              alt="Paladin building"
              className="w-full max-w-[560px] sm:max-w-[640px] lg:w-[145%] lg:max-w-none h-auto object-contain object-top lg:-ml-8"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 sm:pt-3 lg:pt-14 lg:grid-cols-1 lg:gap-2 lg:items-end lg:col-start-3 lg:row-start-1">
            {[
              ['30+', 'Coverage Option'],
              ['9', 'States Served'],
              ['FAST', 'Quote  Turnaround'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="w-full lg:max-w-[188px] rounded-2xl px-2.5 sm:px-3.5 py-2.5 bg-[#f4f2ed] shadow-[0_7px_11px_rgba(0,0,0,0.17)]"
              >
                <p className="text-[1.35rem] sm:text-[1.85rem] font-extrabold text-[#0b3a89] leading-none">{value}</p>
                <p className="mt-0.5 text-[0.62rem] sm:text-[0.82rem] uppercase tracking-[0.06em] text-[#787878] font-semibold leading-snug">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 sm:mt-4 lg:mt-0 flex flex-wrap gap-2.5 max-w-[430px] lg:col-start-1 lg:row-start-2">
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

          <div className="mt-2 sm:mt-3 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 w-full lg:max-w-[188px] lg:col-start-3 lg:row-start-2 lg:justify-self-end">
            <a
              href="#contact-location"
              className="inline-flex items-center justify-center rounded-full bg-[#f4f2ed] text-[#161a22] text-xs py-2 shadow-[0_6px_9px_rgba(0,0,0,0.16)]"
            >
              Get <span className="text-[#0b3a89] font-bold ml-1">Free Quote</span>
            </a>
            <a
              href="tel:8056926900"
              className="inline-flex items-center justify-center rounded-full bg-[#f4f2ed] text-[#161a22] text-xs py-2 shadow-[0_6px_9px_rgba(0,0,0,0.16)]"
            >
              Call <span className="text-[#0b3a89] font-bold ml-1">805 - 692 - 6900</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
