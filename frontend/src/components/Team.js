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

function Team() {
  return (
    <section id="team-preview" className="relative overflow-hidden bg-[#f6f8fc] py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#c9d8ee]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-6 h-56 w-56 rounded-full bg-[#d9e4f5]/45 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_1.15fr] md:gap-14">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full border border-[#b8c7dc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#012E72] shadow-[0_6px_14px_rgba(1,46,114,0.15)]">
            People behind Paladin
          </span>

          <h2 className="mt-6 text-3xl font-extrabold  tracking-tight text-[#012E72] md:text-4xl">
            MEET THE TEAM
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
  );
}

export default Team;
