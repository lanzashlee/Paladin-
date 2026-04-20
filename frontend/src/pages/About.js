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
      <section id="company-overview" className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7F4EF] text-[#002DB5] text-sm font-bold mb-6 border border-[#d8cbb8]">
              <Building2 className="w-4 h-4" />
              <span>Company Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#012E72] mb-6 leading-tight">
              A Legacy of <br/><span className="text-[#002DB5]">Protection & Trust</span>
            </h2>
            <p className="text-[#010407]/75 text-base md:text-lg leading-relaxed mb-4 font-medium text-justify">
              Paladin Professional Insurance Solutions is a full-service independent insurance agency committed to delivering premium protection across personal, commercial, and specialty lines.
            </p>
            <p className="text-[#010407]/75 text-base md:text-lg leading-relaxed font-medium text-justify">
              We understand that every client is unique — which is why we take a consultative, hands-on approach to crafting coverage that truly fits your life and your business.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
             <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-[#012E72]/10 border-8 border-[#F7F4EF]">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Modern Office" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#012E72]/75 via-[#012E72]/20 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="text-2xl font-bold">Paladin Headquarters</p>
                    <p className="font-medium text-[#F7F4EF]">Where focus meets dedication</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-promise" className="bg-[#F7F4EF] py-16 px-6 border-y border-[#e7dccb]">
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
      <section id="meet-the-team" className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#012E72] mb-3">Meet The Team</h2>
            <p className="text-base md:text-lg text-[#010407]/60 max-w-2xl mx-auto font-medium text-center">
              Dedicated professionals committed to securing what matters most to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Denise Pomboonreung", role: "CEO", bio: "Sets the vision for the agency, leads client relationships, and drives long-term growth with a service-first mindset.", img: TeamMember1 },
              { name: "Andy Zubia", role: "President", bio: "Oversees company strategy and daily execution, keeping the team aligned and the client experience consistent.", img: TeamMember2 },
              { name: "Donna Jumdail", role: "Operations Lead", bio: "Manages workflow, coordination, and service follow-through so every request moves smoothly from start to finish.", img: TeamMember3 },
            ].map((member, idx) => (
              <div key={idx} className="group text-center bg-[#F7F4EF] border border-[#e7dccb] p-6 rounded-3xl shadow-xl shadow-[#012E72]/5 hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-48 h-48 mx-auto rounded-[2rem] overflow-hidden mb-8 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-bold text-[#012E72] mb-1">{member.name}</h3>
                <p className="text-[#002DB5] font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-[#010407]/70 text-sm leading-relaxed font-medium text-justify">{member.bio}</p>
              </div>
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
