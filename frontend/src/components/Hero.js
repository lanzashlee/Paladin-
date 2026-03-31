import React from 'react';
import { Video } from 'lucide-react';
import heroImage from '../assets/hero-image.png';

function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-8 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Column - Content */}
      <div className="relative z-10 flex flex-col justify-center max-w-xl">
        <h1 className="text-5xl lg:text-7xl font-extrabold text-[#111] leading-[1.1] mb-6 tracking-tight">
          Your Trusted <br /> Insurance <br /> Partner
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">
          Paladin into Savings Compare Car Insurance Quotes, Customize Your Coverage, and Secure the Best Deal in Minutes
        </p>

        {/* Email Input */}
        <div className="relative flex items-center bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-full p-2 max-w-md shadow-sm">
          <input
            type="email"
            placeholder="Your Email"
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-gray-700 placeholder:text-gray-500"
          />
          <button className="bg-[#0077b6] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:bg-blue-700 transition-all">
            Get A Quote
          </button>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="relative z-10 w-full h-full flex justify-end">
        <div className="relative w-[90%] lg:w-[480px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
          <img
            src={heroImage}
            alt="Customer receiving car keys"
            className="w-full h-full object-cover"
          />
        </div>


      </div>
    </section>
  );
}

export default Hero;
