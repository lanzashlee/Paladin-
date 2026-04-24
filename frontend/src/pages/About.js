import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ShieldCheck, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhyChooseUs from '../components/WhyChooseUs';
import MapLocation from '../components/MapLocation';
import Carriers from '../components/Carriers';

import TeamMember1 from '../assets/MS DENISE.png';
import TeamMember2 from '../assets/SIR ANDY.png';
import TeamMember3 from '../assets/DONNA.png';

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col text-[#010407]">
      <Header />

      {/* Company Overview Section */}
      <section id="company-overview" className="w-full bg-[#f7f9fd] px-0 pb-0 pt-0">
        <div className="w-full overflow-hidden bg-[#f7f9fd]">
          <div className="relative h-[130px] bg-[#0b357f]">
            <svg
              className="absolute -bottom-1 left-0 block h-[78px] w-full"
              viewBox="0 0 1440 200"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect x="0" y="0" width="1440" height="200" fill="#0b357f" />
              <path
                d="M0,96 C180,170 360,166 540,140 C720,114 900,34 1080,42 C1240,50 1350,96 1440,120 L1440,200 L0,200 Z"
                fill="#f7f9fd"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-10 px-6 pb-10 pt-4 md:grid-cols-2 md:items-center md:gap-12 md:px-12 md:pb-14 md:pt-6">
            <div className="mx-auto flex w-full max-w-xl flex-col items-start text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#002DB5] shadow-[0_8px_16px_rgba(8,35,76,0.12)]">
                <Building2 className="h-4 w-4" />
                <span>Company Overview</span>
              </div>

              <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#012E72] md:text-4xl">
                A Legacy of
                <br />
                <span className="text-[#012E72]">Protection and Trust</span>
              </h2>

              <p className="mb-4 max-w-xl text-justify text-base font-normal leading-relaxed text-[#010407]/75 md:text-lg">
                Paladin Professional Insurance Solutions is a full-service independent insurance agency committed to delivering premium protection across personal, commercial, and specialty lines.
              </p>
              <p className="max-w-xl text-justify text-base font-normal leading-relaxed text-[#010407]/75 md:text-lg">
                We understand that every client is unique - which is why we take a consultative, hands-on approach to crafting coverage that truly fits your life and your business.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_30px_rgba(8,35,76,0.2)]">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400"
                  alt="Glass office buildings"
                  className="h-[260px] w-full max-w-[430px] object-cover sm:h-[300px] md:h-[360px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-promise" className="-mt-px bg-[#F7F4EF] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="inline-flex items-center px-4 py-1 rounded-full bg-white text-[#002DB5] text-xs font-semibold tracking-wide uppercase mb-3 border border-[#d8cbb8] shadow-sm">
              Purpose & Direction
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#012E72]">
              Our Mission &amp; Our Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-[#e7dccb] bg-white shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F7F4EF] border border-[#d8cbb8] flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#002DB5]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#012E72]">Our Mission</h3>
              </div>
              <p className="text-[#010407]/75 text-sm md:text-base leading-relaxed text-justify">
                Our mission is to provide you with the quality service and care that you deserve. We
                understand the unique challenges of owning and operating a business. This is why we
                are dedicated to providing you with hassle-free insurance service that best suits your
                needs.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border border-[#e7dccb] bg-white shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F7F4EF] border border-[#d8cbb8] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#002DB5]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#012E72]">Our Promise</h3>
              </div>
              <p className="text-[#010407]/75 text-sm md:text-base leading-relaxed text-justify mb-4">
                With agents that have over 20 years of experience in the insurance industry, we take
                pride in being able to service you. We promise to:
              </p>
              <ul className="text-[#010407]/75 text-sm md:text-base leading-relaxed space-y-2 pl-5 list-disc text-left">
                <li>Find you the correct coverage at an unbeatable price</li>
                <li>Provide one-on-one guidance through every step of the process</li>
                <li>Treat every client as we would our own family</li>
                <li>Deliver peace of mind — knowing you&apos;re covered at a fair rate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* The Team Section */}
      <section id="meet-the-team" className="relative overflow-hidden bg-[#f7f9fd] px-6 py-16 md:py-20">
        <div className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full bg-[#c9d8ee]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-60 w-60 rounded-full bg-[#d9e4f5]/45 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 inline-flex items-center rounded-full border border-[#c8d3e6] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#002DB5] shadow-sm">
              Leadership Team
            </p>
            <h2 className="mb-3 text-3xl font-extrabold text-[#012E72] md:text-4xl">Meet The Team</h2>
            <p className="mx-auto max-w-2xl text-base font-medium text-[#010407]/65 md:text-lg">
              Dedicated professionals committed to securing what matters most to you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: "Denise Pomboonreung", role: "CEO", bio: "Sets the vision for the agency, leads client relationships, and drives long-term growth with a service-first mindset.", img: TeamMember1 },
              { name: "Andy Zubia", role: "President", bio: "Oversees company strategy and daily execution, keeping the team aligned and the client experience consistent.", img: TeamMember2 },
              { name: "Donna Jumdail", role: "Operations Lead", bio: "Manages workflow, coordination, and service follow-through so every request moves smoothly from start to finish.", img: TeamMember3 },
            ].map((member, idx) => (
              <article
                key={idx}
                className="group overflow-hidden rounded-[2rem] border border-[#d7dfec] bg-white shadow-[0_14px_30px_rgba(1,46,114,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(1,46,114,0.14)]"
              >
                <div className="relative overflow-hidden bg-white">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-[#012E72]">{member.name}</h3>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#002DB5]">{member.role}</p>
                  <p className="text-justify text-sm font-medium leading-relaxed text-[#010407]/70">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Carriers Section */}
      <Carriers />

      <MapLocation className="pt-8 mt-0" />

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-6 bg-[#012E72] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')] opacity-10 mix-blend-overlay object-cover"></div>
        <div className="relative z-10 max-w-3xl md:max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight">
            Ready to Experience the Paladin Difference?
          </h2>
          <p className="text-base md:text-lg text-[#F7F4EF] mb-8 leading-relaxed font-medium">
            Let our experienced team formulate a protection strategy uniquely tailored for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/service" className="bg-white text-[#012E72] px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-[#F7F4EF] transition-colors shadow-xl">
              Learn More About Our Services
            </Link>
            <Link to="/quote" className="bg-transparent border border-white text-white px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-white/10 transition-colors">
              Contact Us For a Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
