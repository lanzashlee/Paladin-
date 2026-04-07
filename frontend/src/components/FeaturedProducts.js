import React from 'react';
import { Link } from 'react-router-dom';
import { coverageOfferings } from '../data/insuranceContent';

function FeaturedProducts() {
  return (
    <section className="relative py-24 overflow-hidden bg-white w-full" id="coverage-offerings">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[760px] h-[300px] rounded-full bg-[#002DB5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 w-[360px] h-[360px] rounded-full bg-[#F7F4EF] blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="text-center mb-16">
        <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F7F4EF] text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-5 border border-[#d8cbb8] shadow-sm">
          Coverage Portfolio
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#012E72] tracking-tight mb-4">
          Our Coverage Offerings
        </h2>
        <p className="text-base sm:text-lg text-[#010407]/75 max-w-3xl mx-auto leading-relaxed">
          Explore a curated suite of protection options for businesses, property owners, and
          families, each designed to match real-world risk and long-term peace of mind.
        </p>
      </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverageOfferings.map((p) => (
          <article
            key={p.number}
            className="relative overflow-hidden rounded-3xl border border-[#e7dccb] bg-white group min-h-[340px] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#002DB5]/10 transition-all duration-300 shadow-lg shadow-[#012E72]/5"
          >
            <div className="relative h-44 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${p.image})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/15 via-transparent to-[#F7F4EF]/70" aria-hidden="true" />
              <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white border border-[#d8cbb8] flex items-center justify-center shadow-md shadow-[#012E72]/10 shrink-0">
                <span className="text-[#012E72] text-base font-black">{p.number}</span>
              </div>
            </div>

            <div className="relative z-10 p-7 sm:p-8 pt-6 flex flex-col gap-4 min-h-[180px] bg-white">
              <div className="flex items-center justify-end">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#002DB5] font-semibold">Featured</span>
              </div>

              <h3 className="text-xl font-bold text-[#012E72] group-hover:text-[#002DB5] transition-colors">
                {p.title}
              </h3>
              <p className="text-[#010407]/75 text-sm leading-relaxed text-justify flex-1">
                {p.description}
              </p>
            </div>
          </article>
        ))}
        </div>

        <div className="relative z-10 mt-12 flex justify-center">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 bg-[#012E72] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
          >
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
