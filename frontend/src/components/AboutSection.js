import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck } from 'lucide-react';

function AboutSection() {
  return (
    <section className="py-24 bg-white w-full" id="who-we-are">
      <div className="max-w-7xl mx-auto px-8 w-full">
        {/* Section heading */}
        <div className="text-center mb-16">
        <p className="inline-flex items-center px-4 py-1 rounded-full bg-[#F7F4EF] text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-4 border border-[#e7dccb] shadow-sm">
          About Paladin
        </p>
        <h2 className="text-4xl font-extrabold text-[#012E72] tracking-tight mb-6">
          Who We Are
        </h2>
        <p className="text-lg text-[#010407]/80 max-w-3xl mx-auto leading-relaxed">
          Paladin Professional Insurance Solutions is a full-service independent insurance agency
          committed to delivering premium protection across personal, commercial, and specialty
          lines. We understand that every client is unique — which is why we take a consultative,
          hands-on approach to crafting coverage that truly fits your life and your business.
        </p>
      </div>

        {/* Mission & Promise cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Our Mission */}
        <div className="rounded-3xl p-10 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[#F7F4EF] border border-[#e7dccb] shadow-lg shadow-[#012E72]/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-[#d8cbb8]">
              <Target className="w-6 h-6 text-[#002DB5]" />
            </div>
            <h3 className="text-2xl font-bold text-[#012E72]">Our Mission</h3>
          </div>
          <p className="text-[#010407]/80 leading-relaxed text-justify">
            Our mission is to provide you with the quality service and care that you deserve. We
            understand the unique challenges of owning and operating a business. This is why we are
            dedicated to providing you with hassle-free insurance service that best suits your needs.
          </p>
        </div>

        {/* Our Promise */}
        <div className="rounded-3xl p-10 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[#F7F4EF] border border-[#e7dccb] shadow-lg shadow-[#012E72]/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F4EF] flex items-center justify-center shrink-0 border border-[#d8cbb8]">
              <ShieldCheck className="w-6 h-6 text-[#002DB5]" />
            </div>
            <h3 className="text-2xl font-bold text-[#012E72]">Our Promise</h3>
          </div>
          <p className="text-[#010407]/80 leading-relaxed mb-3">
            With agents that have over 20 years of experience in the insurance industry, we take
            pride in being able to service you. We promise to:
          </p>
          <ul className="text-[#010407]/80 leading-relaxed space-y-2 pl-5 list-disc text-left">
            <li>Find you the correct coverage at an unbeatable price</li>
            <li>Provide one-on-one guidance through every step of the process</li>
            <li>Treat every client as we would our own family</li>
            <li>Deliver peace of mind — knowing you're covered at a fair rate</li>
          </ul>
        </div>
      </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-[#012E72] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
