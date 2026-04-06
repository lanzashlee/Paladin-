import React from 'react';
import { Link } from 'react-router-dom';

const lines = [
  {
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    badge: 'P',
    title: 'Professional Insurance',
    desc: 'Designed for licensed professionals, consultants, and service providers. Professional Liability (Errors & Omissions) protects you from claims of negligence, mistakes, or failure to deliver services as promised. Ideal for doctors, lawyers, accountants, real estate agents, IT professionals, and more.',
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    badge: 'C',
    title: 'Commercial Insurance',
    desc: 'A comprehensive category of coverage built for businesses of all sizes. Commercial insurance bundles essential protections — including property, liability, and business interruption — into tailored policies that keep your operations running even when the unexpected happens.',
  },
  {
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    badge: 'L',
    title: 'Landlord Insurance',
    desc: 'Purpose-built for property owners who rent out residential or commercial spaces. Covers your building structure, loss of rental income, liability for tenant injuries, and damages caused by tenants — giving you confidence to lease your properties without worry.',
  },
  {
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Co',
    title: 'Contractors Insurance',
    desc: "Contractors face unique on-site risks every day. Our contractors insurance covers general liability, tools and equipment, completed operations, and workers' compensation — protecting both your crew and your business from accidents, property damage, or third-party claims on the job.",
  },
  {
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80',
    badge: 'W',
    title: 'Watercraft Insurance',
    desc: 'Whether you own a fishing boat, a personal watercraft, or a luxury yacht, watercraft insurance provides protection on and off the water. Coverage typically includes physical damage to the vessel, liability for injuries or property damage, fuel spill liability, and storage or transit coverage.',
  },
  {
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    badge: 'A',
    title: 'Auto Insurance',
    desc: 'From personal vehicles to full commercial fleets, our auto insurance solutions are designed to fit your driving needs. Coverage options include liability, collision, comprehensive, uninsured motorist, and medical payments — ensuring you and your passengers are protected on every journey.',
  },
];

function InsuranceLines() {
  return (
    <section className="py-24 bg-[#F7F4EF] relative overflow-hidden" id="insurance-lines">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#002DB5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-white text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-4 border border-[#d8cbb8] shadow-sm">
            What We Cover
          </p>
          <h2 className="text-4xl font-extrabold text-[#012E72] tracking-tight mb-4">
            Our Insurance Lines
          </h2>
          <p className="text-[#010407]/75 text-lg max-w-2xl leading-relaxed align-middle mx-auto">
            Paladin serves a wide range of clients across multiple insurance lines. Whether you are a
            business owner, landlord, contractor, or individual, we have a solution built for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lines.map((line, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl border border-[#e7dccb] bg-white hover:-translate-y-1 transition-all duration-300 group shadow-lg shadow-[#012E72]/5"
            >
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${line.image})` }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/15 via-transparent to-[#F7F4EF]/70" aria-hidden="true" />
                <div className="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-white border border-[#d8cbb8] flex items-center justify-center shadow-lg shadow-[#012E72]/10">
                  <span className="text-[#012E72] text-lg font-black">{line.badge}</span>
                </div>
              </div>

              <div className="relative z-10 p-8 pt-6 flex flex-col gap-4 min-h-[155px] bg-white">
                <h3 className="text-xl font-bold text-[#012E72] group-hover:text-[#002DB5] transition-colors">
                  {line.title}
                </h3>
                <p className="text-[#010407]/75 text-sm leading-relaxed flex-1 text-justify">{line.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 align-middle text-center">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 bg-[#012E72] text-white px-10 py-3.5 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
          >
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default InsuranceLines;
