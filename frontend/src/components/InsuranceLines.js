import React from 'react';
import { Link } from 'react-router-dom';

const lines = [
  {
    badge: 'P',
    title: 'Professional Insurance',
    desc: 'Designed for licensed professionals, consultants, and service providers. Professional Liability (Errors & Omissions) protects you from claims of negligence, mistakes, or failure to deliver services as promised. Ideal for doctors, lawyers, accountants, real estate agents, IT professionals, and more.',
  },
  {
    badge: 'C',
    title: 'Commercial Insurance',
    desc: 'A comprehensive category of coverage built for businesses of all sizes. Commercial insurance bundles essential protections — including property, liability, and business interruption — into tailored policies that keep your operations running even when the unexpected happens.',
  },
  {
    badge: 'L',
    title: 'Landlord Insurance',
    desc: 'Purpose-built for property owners who rent out residential or commercial spaces. Covers your building structure, loss of rental income, liability for tenant injuries, and damages caused by tenants — giving you confidence to lease your properties without worry.',
  },
  {
    badge: 'Co',
    title: 'Contractors Insurance',
    desc: "Contractors face unique on-site risks every day. Our contractors insurance covers general liability, tools and equipment, completed operations, and workers' compensation — protecting both your crew and your business from accidents, property damage, or third-party claims on the job.",
  },
  {
    badge: 'W',
    title: 'Watercraft Insurance',
    desc: 'Whether you own a fishing boat, a personal watercraft, or a luxury yacht, watercraft insurance provides protection on and off the water. Coverage typically includes physical damage to the vessel, liability for injuries or property damage, fuel spill liability, and storage or transit coverage.',
  },
  {
    badge: 'A',
    title: 'Auto Insurance',
    desc: 'From personal vehicles to full commercial fleets, our auto insurance solutions are designed to fit your driving needs. Coverage options include liability, collision, comprehensive, uninsured motorist, and medical payments — ensuring you and your passengers are protected on every journey.',
  },
];

function InsuranceLines() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden" id="insurance-lines">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#0077b6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-white/5 text-[#0077b6] text-xs font-semibold tracking-widest uppercase mb-4 border border-white/10">
            What We Cover
          </p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Our Insurance Lines
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Paladin serves a wide range of clients across multiple insurance lines. Whether you are a
            business owner, landlord, contractor, or individual, we have a solution built for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lines.map((line, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col gap-4 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Badge */}
              <div className="w-14 h-14 rounded-2xl bg-[#0077b6] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <span className="text-white text-lg font-black">{line.badge}</span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                {line.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{line.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 bg-[#0077b6] text-white px-10 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
          >
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default InsuranceLines;
