import React from 'react';
import heroImage from '../assets/hero-image.png';

function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
      {/* Full hero background image */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-[78%_center] lg:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#eef2f5] via-[#eef2f5]/98 via-[52%] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#eef2f5]/75 via-transparent to-transparent" />
      </div>

      {/* Mobile/tablet background tone */}
      <div className="absolute inset-0 bg-[#eef2f5] lg:hidden pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-14 sm:pb-16 lg:pb-24">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center max-w-xl lg:min-h-[520px]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#111] leading-[1.05] sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight max-w-[11ch]">
            Your Trusted <br /> Insurance <br /> Partner
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-7 sm:mb-10 leading-relaxed font-medium max-w-[56ch]">
            Paladin into Savings Compare Car Insurance Quotes, Customize Your Coverage, and Secure the Best Deal in Minutes
          </p>

          {/* Email Input */}
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl sm:rounded-full p-2 max-w-md shadow-sm w-full">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-gray-700 placeholder:text-gray-500"
            />
            <button className="bg-[#0077b6] text-white px-6 py-3 rounded-xl sm:rounded-full text-sm font-semibold shadow-md hover:bg-blue-700 transition-all w-full sm:w-auto">
              Get A Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
