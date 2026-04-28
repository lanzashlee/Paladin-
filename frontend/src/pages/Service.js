import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialsPreview from '../components/TestimonialsPreview';
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

function InsuranceLineCard({ item, className = '' }) {
  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e7dccb] bg-white group shadow-lg shadow-[#012E72]/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#012E72]/12 ${className}`}>
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/20 via-transparent to-[#F7F4EF]/75" aria-hidden="true" />
        <div className="absolute top-4 left-4 h-12 min-w-12 px-2 rounded-2xl bg-white border border-[#d8cbb8] flex items-center justify-center shrink-0 shadow-md">
          <span className="text-[#012E72] text-xs sm:text-sm font-black leading-none text-center">{item.badge}</span>
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex flex-1 flex-col">
        <div className="flex items-center justify-end gap-4 mb-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#002DB5] font-semibold">Insurance Line</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#012E72] mb-3 leading-tight group-hover:text-[#002DB5] transition-colors">
          {item.title}
        </h3>
        <p className="text-[#010407]/75 text-sm sm:text-[15px] leading-relaxed text-justify">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function Service() {
  const coverageBadgeByTitle = {
    'Renters Insurance': 'RE',
    'Umbrella Insurance': 'UM',
    'Disability Insurance': 'DI',
    'Flood Insurance': 'FL',
    'Identity Theft Protection': 'ID',
  };

  const allInsuranceLines = [
    ...insuranceLines,
    ...coverageOfferings.map((item) => ({
      ...item,
      badge: coverageBadgeByTitle[item.title] || 'CV',
    })),
  ];
  const lineCount = allInsuranceLines.length;
  const hasTwoCardsOnLastRow = lineCount % 3 === 2;

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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">
              {allInsuranceLines.map((item, index) => {
                const isSecondToLast = index === lineCount - 2;
                const isLast = index === lineCount - 1;
                const centeredLastRowClass =
                  hasTwoCardsOnLastRow && isSecondToLast
                    ? 'xl:col-span-2 xl:col-start-2'
                    : hasTwoCardsOnLastRow && isLast
                      ? 'xl:col-span-2 xl:col-start-4'
                      : 'xl:col-span-2';

                return (
                  <InsuranceLineCard
                    key={item.title}
                    item={item}
                    className={centeredLastRowClass}
                  />
                );
              })}
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

        <TestimonialsPreview />

        <section className="relative py-10 sm:py-12 bg-white">
          <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#f8fbff] px-8 py-9 sm:px-10 sm:py-10 text-center">
              <h2 className="text-2xl sm:text-[2rem] font-extrabold text-[#012E72] tracking-tight">
                Not sure what insurance to take?
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#010407]/70 leading-relaxed max-w-2xl mx-auto">
                Talk with our team for personalized guidance and get the right coverage based on your needs and budget.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/contact?request=consultation#quick-actions"
                  className="inline-flex items-center justify-center w-full sm:w-auto min-w-[220px] bg-[#012E72] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
                >
                  Personalized Consultation
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full sm:w-auto min-w-[220px] border border-[#012E72]/35 text-[#012E72] px-6 py-3 rounded-full font-bold hover:bg-[#012E72]/5 transition-all hover:-translate-y-0.5"
                >
                  Contact Us Directly
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Service;

