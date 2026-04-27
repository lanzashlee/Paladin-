import React from 'react';
import { Link } from 'react-router-dom';
import TeamMemberAndy from '../assets/SIR ANDY.png';
import TeamMemberDenise from '../assets/MS DENISE.png';
import TeamMemberDonna from '../assets/DONNA.png';

const teamImageCards = {
  andy: {
    alt: 'Sir Andy portrait',
    src: TeamMemberAndy,
  },
  denise: {
    alt: 'Ms Denise portrait',
    src: TeamMemberDenise,
  },
  donna: {
    alt: 'Donna portrait',
    src: TeamMemberDonna,
  },
};

const requestCards = [
  {
    id: 'consultation',
    title: 'Personalized Consultation',
    desc: 'Get guidance on affordable coverage options tailored to your specific needs.',
  },
  {
    id: 'documents',
    title: 'Request Insurance Documents',
    desc: 'Request COI, evidence of insurance, ACORD forms, and other policy documents.',
  },
  {
    id: 'policy-change',
    title: 'Policy Change',
    desc: 'Submit updates for existing policy details and coverage changes.',
  },
  {
    id: 'update-info',
    title: 'Update Contact or Insured Info',
    desc: 'Update your contact details and other insured information on file.',
  },
  {
    id: 'claim',
    title: 'Report a Claim',
    desc: 'Start a claim report and receive support from one of our licensed agents.',
  },
  {
    id: 'call',
    title: 'Request a Call',
    desc: 'Request a callback and our team will contact you as soon as possible.',
  },
];

function Team() {
  return (
    <>
      <section id="team-preview" className="relative overflow-hidden bg-[#f6f8fc] py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#c9d8ee]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-6 h-56 w-56 rounded-full bg-[#d9e4f5]/45 blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_1.15fr] md:gap-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full border border-[#b8c7dc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#012E72] shadow-[0_6px_14px_rgba(1,46,114,0.15)]">
              People behind Paladin
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[#012E72] md:text-4xl">
              Meet The Team
            </h2>

            <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-[#010407]/75 md:text-lg">
              Dedicated professionals committed to securing what matters most to you.
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-7">
            <Link
              to="/about#meet-the-team"
              aria-label="View Ms Denise profile in Meet the Team"
              className="w-full max-w-[260px] rounded-[2rem] border border-[#d3ddea] bg-white p-1 shadow-[0_12px_24px_rgba(1,46,114,0.16)] transition-transform duration-300 hover:-translate-y-1 sm:max-w-[280px]"
            >
              <img
                src={teamImageCards.denise.src}
                alt={teamImageCards.denise.alt}
                className="block h-auto w-full rounded-[2rem] object-contain"
              />
            </Link>

            <div className="flex w-full max-w-[260px] flex-col items-center gap-6 sm:max-w-[280px]">
              <Link
                to="/about#meet-the-team"
                aria-label="View Sir Andy profile in Meet the Team"
                className="w-full rounded-[2rem] border border-[#d3ddea] bg-white p-1 shadow-[0_12px_24px_rgba(1,46,114,0.16)] transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={teamImageCards.andy.src}
                  alt={teamImageCards.andy.alt}
                  className="block h-auto w-full rounded-[2rem] object-contain"
                />
              </Link>
              <Link
                to="/about#meet-the-team"
                aria-label="View Donna profile in Meet the Team"
                className="w-full rounded-[2rem] border border-[#d3ddea] bg-white p-1 shadow-[0_12px_24px_rgba(1,46,114,0.16)] transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={teamImageCards.donna.src}
                  alt={teamImageCards.donna.alt}
                  className="block h-auto w-full rounded-[2rem] object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#e6dac9] bg-[#f4eee6] py-14 sm:py-16">
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#002DB5]/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-56 w-56 rounded-full bg-white/45 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#012E72]/70">Quick Actions</p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#012E72] sm:text-3xl">How Can We Help You Today?</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#010407]/75 sm:text-base">
              Choose the request type you need below, then use one button to open the full Quick Actions section on Contact.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requestCards.map((card, index) => (
              <article
                key={card.id}
                className="rounded-2xl border border-[#e1d8ca] bg-white px-5 py-5 shadow-[0_10px_20px_rgba(0,0,0,0.10)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#012E72]/55">{String(index + 1).padStart(2, '0')}</p>
                <h4 className="mt-2 font-serif text-lg font-semibold leading-snug text-[#111827]">{card.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#010407]/75">{card.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-7 flex justify-start">
            <Link
              to="/contact#quick-actions"
              className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(1,46,114,0.18)] transition-colors hover:bg-[#002DB5]"
            >
              Open Contact Quick Actions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Team;
