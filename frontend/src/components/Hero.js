import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-image.png';

function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Full hero background image */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-[76%_center] lg:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ecf3f8] via-[#ecf3f8]/98 via-[50%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#eef2f5]/70 via-transparent to-transparent" />
      </div>

      {/* Mobile/tablet background tone */}
      <div className="absolute inset-0 bg-[#ecf3f8] lg:hidden pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-[#0077b6]/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 w-64 h-64 rounded-full bg-sky-200/50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-16 sm:pb-18 lg:pb-24">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center max-w-2xl lg:min-h-[560px]">

          <h1 className="font-extrabold text-[#0d1117] leading-[1.1] sm:leading-[1.15] mb-4 sm:mb-6 tracking-tight">
            <span className="text-xl lg:text-2xl">Welcome To</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0077b6]">PALADIN</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl">Professional Insurance Solutions</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed font-medium max-w-[62ch]">
            Coverage built for professionals, businesses, property owners, and families who want a clear path to the right protection.
          </p>

          <div className="flex flex-col gap-2 mb-8 sm:mb-10">
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
              {['Professional', 'Commercial', 'Landlord', 'Contractors'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-sm border bg-white/50 text-[#0077b6] border-[#0077b6]/10"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
              {['Watercraft', 'Auto'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-sm border bg-white/50 text-[#0077b6] border-[#0077b6]/10"
                >
                  {item}
                </span>
              ))}
              <Link
                to="/service"
                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-sm border bg-white/50 text-gray-700 border-gray-300/50 transition-all duration-200 hover:bg-[#0077b6] hover:text-white hover:border-[#0077b6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-[#0077b6]/40"
              >
                and More
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
            <a
              href="#contact"
              className="inline-flex items-center justify-center bg-[#0077b6] text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:bg-[#00639a] transition-all hover:-translate-y-0.5"
            >
              Get Free Quote
            </a>
            <a
              href="tel:8056926900"
              className="inline-flex items-center justify-center bg-white/50 text-[#0d1117] border border-gray-300/50 px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-sm hover:border-[#0077b6] hover:text-[#0077b6] hover:bg-white/70 transition-all hover:-translate-y-0.5"
            >
              Call 805-692-6900
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-lg">
            <div className="rounded-xl bg-white/40 border border-white/30 p-3 sm:p-4 shadow-sm backdrop-blur-sm">
              <p className="text-lg sm:text-2xl font-black text-[#0d1117]">30+</p>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Coverage Options</p>
            </div>
            <div className="rounded-xl bg-white/40 border border-white/30 p-3 sm:p-4 shadow-sm backdrop-blur-sm">
              <p className="text-lg sm:text-2xl font-black text-[#0d1117]">9</p>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">States Served</p>
            </div>
            <div className="rounded-xl bg-white/40 border border-white/30 p-3 sm:p-4 shadow-sm backdrop-blur-sm col-span-2 sm:col-span-1">
              <p className="text-lg sm:text-2xl font-black text-[#0d1117]">Fast</p>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Quote Turnaround</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
