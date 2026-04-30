import React from 'react';
import { Link } from 'react-router-dom';
import { insuranceLines } from '../data/insuranceContent';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

function InsuranceLines() {
  return (
    <section className="py-24 bg-[#F7F4EF] relative overflow-hidden" id="insurance-lines">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#002DB5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-white text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-4 border border-[#d8cbb8] shadow-sm" style={{ fontFamily: FONT_BODY }}>
            What We Cover
          </p>
          <h2 className="text-4xl font-extrabold text-[#012E72] tracking-tight mb-4" style={{ fontFamily: FONT_DISPLAY }}>
            OUR INSURANCE LINES
          </h2>
          <p className="text-[#010407]/75 text-lg max-w-2xl leading-relaxed align-middle mx-auto" style={{ fontFamily: FONT_BODY }}>
            Paladin serves a wide range of clients across multiple insurance lines. Whether you are a
            business owner, landlord, contractor, or individual, we have a solution built for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insuranceLines.map((line, i) => (
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
                  <span className="text-[#012E72] text-lg font-black" style={{ fontFamily: FONT_DISPLAY }}>{line.badge}</span>
                </div>
              </div>

              <div className="relative z-10 p-8 pt-6 flex flex-col gap-4 min-h-[155px] bg-white">
                <h3 className="text-xl font-bold text-[#012E72] group-hover:text-[#002DB5] transition-colors" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>
                  {line.title}
                </h3>
                <p className="text-[#010407]/75 text-sm leading-relaxed flex-1 text-justify" style={{ fontFamily: FONT_BODY }}>{line.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 align-middle text-center">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 bg-[#012E72] text-white px-10 py-3.5 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
            style={{ fontFamily: FONT_BODY }}
          >
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default InsuranceLines;
