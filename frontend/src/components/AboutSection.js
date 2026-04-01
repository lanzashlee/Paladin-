import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck } from 'lucide-react';

function AboutSection() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto w-full" id="about">
      {/* Section heading */}
      <div className="text-center mb-16">
        <p className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-[#0077b6] text-xs font-semibold tracking-widest uppercase mb-4">
          About Paladin
        </p>
        <h2 className="text-4xl font-extrabold text-[#0a0a0a] tracking-tight mb-6">
          Who We Are
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Paladin Professional Insurance Solutions is a full-service independent insurance agency
          committed to delivering premium protection across personal, commercial, and specialty
          lines. We understand that every client is unique — which is why we take a consultative,
          hands-on approach to crafting coverage that truly fits your life and your business.
        </p>
      </div>

      {/* Mission & Promise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Our Mission */}
        <div className="glass-panel rounded-3xl p-10 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0077b6]/10 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-[#0077b6]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0a0a0a]">Our Mission</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-justify">
            Our mission is to provide you with the quality service and care that you deserve. We
            understand the unique challenges of owning and operating a business. This is why we are
            dedicated to providing you with hassle-free insurance service that best suits your needs.
          </p>
        </div>

        {/* Our Promise */}
        <div className="glass-panel rounded-3xl p-10 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0077b6]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#0077b6]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0a0a0a]">Our Promise</h3>
          </div>
          <p className="text-gray-600 leading-relaxed mb-3">
            With agents that have over 20 years of experience in the insurance industry, we take
            pride in being able to service you. We promise to:
          </p>
          <ul className="text-gray-600 leading-relaxed space-y-2 pl-5 list-disc text-left">
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
          className="inline-flex items-center gap-2 bg-[#0077b6] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
        >
          Learn More About Us
        </Link>
      </div>
    </section>
  );
}

export default AboutSection;
