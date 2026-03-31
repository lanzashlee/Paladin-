import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhyChooseUs from '../components/WhyChooseUs';

import TeamMember1 from '../assets/team_member_1_1774940222890.png';
import TeamMember2 from '../assets/team_member_2_1774940252257.png';
import TeamMember3 from '../assets/team_member_3_1774940454549.png';

const partnerNames = [
  'Partner One',
  'Partner Two',
  'Partner Three',
  'Partner Four',
  'Partner Five',
  'Partner Six',
  'Partner Seven',
  'Partner Eight',
  'Partner Nine',
  'Partner Ten',
  'Partner Eleven',
  'Partner Twelve',
  'Partner Thirteen',
  'Partner Fourteen',
  'Partner Fifteen',
  'Partner Sixteen',
  'Partner Seventeen',
  'Partner Eighteen',
  'Partner Nineteen',
  'Partner Twenty',
  // ...when you have real data, extend or replace this list
];

function PartnersSection() {
  const [page, setPage] = useState(1);
  const pageSize = 12; // number of logos per page

  const { totalPages, currentItems } = useMemo(() => {
    const totalPagesCalc = Math.max(1, Math.ceil(partnerNames.length / pageSize));
    const safePage = Math.min(page, totalPagesCalc);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;

    return {
      totalPages: totalPagesCalc,
      currentItems: partnerNames.slice(start, end),
    };
  }, [page, pageSize]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <section className="py-24 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-[#0077b6] text-xs font-semibold tracking-wide uppercase mb-4">
            Our Network
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a] mb-4">
            Our Trusted Partners &amp; Carriers
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-justify">
            At Paladin Business Services, we collaborate with a network of trusted partners and carriers to offer the highest-quality solutions tailored to your business needs. Our partnerships with industry leaders enable us to deliver unmatched services and support to all our clients.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 items-center">
          {currentItems.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center bg-[#f8fafc] border border-gray-100 rounded-2xl h-24 md:h-28 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-200"
            >
              <span className="text-xs md:text-sm font-semibold tracking-wide text-gray-500 uppercase text-center px-3">
                {name}
              </span>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  page === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  page === totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                const isActive = p === page;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive ? 'bg-[#0077b6]' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to page ${p}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-10 text-sm text-gray-500 text-center max-w-2xl mx-auto">
          We are continually expanding our partner network to bring even more value and coverage options to our clients.
        </p>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-24 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0077b6]/80 to-[#0a0a0a] z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Our Story</h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
            Building trust and protecting futures through expert insurance solutions.
          </p>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#0077b6] text-sm font-bold mb-6">
              <Building2 className="w-4 h-4" />
              <span>Company Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a] mb-6 leading-tight">
              A Legacy of <br/><span className="text-[#0077b6]">Protection & Trust</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 font-medium text-justify">
              Paladin Business Services was founded with a singular purpose: to provide unparalleled protection for individuals, families, and businesses. We started as an independent agency driven by the core belief that every client deserves personalized attention and comprehensive coverage at competitive rates.
            </p>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium text-justify">
              Over the years, we've grown into a trusted community partner, expanding our expertise across professional liability, commercial coverage, and personal insurance. Our journey has always been guided by our commitment to acting as a true "Paladin" – a steadfast champion for our clients' security and peace of mind.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
             <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Modern Office" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 flex items-end p-8">
                  <div className="text-white">
                    <p className="text-2xl font-bold">Paladin Headquarters</p>
                    <p className="font-medium text-white/80">Where focus meets dedication</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-[#0077b6] text-xs font-semibold tracking-wide uppercase mb-3">
              Purpose & Direction
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a]">
              Our Mission &amp; Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#0077b6]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#0077b6]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">Our Mission</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                Our mission is to provide you with the quality service and care you deserve. We
                understand the unique challenges of owning and operating a business, which is why
                we’re committed to hassle-free insurance service built around your needs. With
                agents who bring 20+ years of experience in the insurance industry, we take pride in
                being reliable advocates—delivering clear guidance, responsive support, and peace of
                mind every step of the way.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#0077b6]/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#0077b6]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                To set the industry standard for integrity and client care in the insurance
                marketplace. We envision a future where navigating insurance is simple and
                transparent, allowing businesses and individuals to thrive with absolute confidence
                in their security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* The Team Section */}
      <section className="py-16 md:py-20 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a] mb-3">Meet The Team</h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium text-center">
              Dedicated professionals committed to securing what matters most to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Michael Sterling", role: "Founder & Principal Broker", bio: "With over 20 years in the industry, Michael founded Paladin to bring a higher standard of care to commercial insurance.", img: TeamMember1 },
              { name: "Sarah Jenkins", role: "Head of Client Relations", bio: "Sarah ensures every client receives the personalized, attentive service that Paladin is universally known for.", img: TeamMember2 },
              { name: "David Chen", role: "Senior Risk Analyst", bio: "David specializes in designing tailored liability strategies for both emerging businesses and established enterprises.", img: TeamMember3 },
            ].map((member, idx) => (
              <div key={idx} className="group text-center bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-48 h-48 mx-auto rounded-[2rem] overflow-hidden mb-8 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0a0a] mb-1">{member.name}</h3>
                <p className="text-[#0077b6] font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed font-medium text-justify">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Carriers Section */}
      <PartnersSection />

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')] opacity-10 mix-blend-overlay object-cover"></div>
        <div className="relative z-10 max-w-3xl md:max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight">
            Ready to Experience the Paladin Difference?
          </h2>
          <p className="text-base md:text-lg text-blue-100 mb-8 leading-relaxed font-medium">
            Let our experienced team formulate a protection strategy uniquely tailored for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/service" className="bg-white text-[#0077b6] px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-gray-100 transition-colors shadow-xl">
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
