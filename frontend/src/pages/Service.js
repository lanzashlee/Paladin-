import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { coverageOfferings, insuranceLines } from '../data/insuranceContent';

function SectionHeader({ eyebrow, title, description, dark = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
      <p
        className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.22em] uppercase border ${
          dark
            ? 'bg-white/10 text-[#F7F4EF] border-white/20'
            : 'bg-[#F7F4EF] text-[#002DB5] border-[#d8cbb8]'
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`mt-5 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${dark ? 'text-white' : 'text-[#012E72]'}`}>
        {title}
      </h2>
      <p className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-justify ${dark ? 'text-[#F7F4EF]' : 'text-[#010407]/75'}`}>
        {description}
      </p>
    </div>
  );
}

function InsuranceLineCard({ item }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[#e7dccb] bg-white min-h-[280px] group shadow-xl shadow-[#012E72]/5">
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/20 via-transparent to-[#F7F4EF]/70" aria-hidden="true" />
        <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white border border-[#d8cbb8] flex items-center justify-center shrink-0 shadow-md">
          <span className="text-[#012E72] text-sm font-black">{item.badge}</span>
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex h-full flex-col">
        <div className="flex items-center justify-end gap-4 mb-3">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#002DB5] font-semibold">Insurance Line</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#012E72] mb-2 group-hover:text-[#002DB5] transition-colors">
          {item.title}
        </h3>
        <p className="text-[#010407]/75 text-xs sm:text-sm leading-relaxed text-justify">
          {item.description}
        </p>

        <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#010407]/80 text-justify">
          {item.details.map((detail) => (
            <li key={detail} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#002DB5] shrink-0" aria-hidden="true" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CoverageCard({ item }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[#e7dccb] bg-white p-5 sm:p-6 flex flex-col gap-3 group min-h-[280px] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#002DB5]/10 transition-all duration-300 shadow-lg shadow-[#012E72]/5">
      <div className="relative h-40 -m-5 mb-4 sm:-m-6 sm:mb-5 overflow-hidden rounded-t-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/15 via-transparent to-[#F7F4EF]/75" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-[#F7F4EF] border border-[#d8cbb8] flex items-center justify-center shadow-md shadow-[#012E72]/10 shrink-0">
          <span className="text-[#012E72] text-sm font-black">{item.number}</span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#002DB5] font-semibold">Featured</span>
      </div>

      <h3 className="relative z-10 text-lg sm:text-xl font-bold text-[#012E72] group-hover:text-[#002DB5] transition-colors">
        {item.title}
      </h3>
      <p className="relative z-10 text-[#010407]/75 text-xs sm:text-sm leading-relaxed text-justify">
        {item.description}
      </p>

      <ul className="relative z-10 mt-1 space-y-2 text-xs sm:text-sm text-[#010407]/80 text-justify">
        {item.details.map((detail) => (
          <li key={detail} className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#002DB5] shrink-0" aria-hidden="true" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CoverageSectionHeader() {
  return (
    <div className="relative z-10 text-center mb-16">
      <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F7F4EF] text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-5 border border-[#d8cbb8] shadow-sm">
        Coverage Portfolio
      </p>
      <h2 className="text-4xl sm:text-5xl font-extrabold text-[#012E72] tracking-tight mb-4">
        COVERAGE OFFERINGS
      </h2>
      <p className="text-base sm:text-lg text-[#010407]/75 max-w-3xl mx-auto leading-relaxed text-justify">
        Explore the same coverage portfolio styling used on the homepage, with the individual
        offerings shown as a unified card grid.
      </p>
    </div>
  );
}

function Service() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <section id="insurance-lines" className="relative bg-[#F7F4EF] py-20 md:py-24 overflow-hidden border-y border-[#e7dccb]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#002DB5]/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="WHAT WE COVER"
              title="OUR INSURANCE LINES"
              description="Paladin serves a wide range of clients across multiple insurance lines. Each card below is presented up front so the full structure stays clear and consistent."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {insuranceLines.map((item) => (
                <InsuranceLineCard key={item.title} item={item} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 bg-[#012E72] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </section>

        <section className="relative py-24 overflow-hidden bg-white w-full" id="coverage-offerings">
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[760px] h-[300px] rounded-full bg-[#002DB5]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 w-[360px] h-[360px] rounded-full bg-[#F7F4EF] blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
            <CoverageSectionHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coverageOfferings.map((item) => (
                <CoverageCard key={item.title} item={item} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 bg-[#012E72] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Service;

