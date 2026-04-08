import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const testimonials = [
  {
    name: 'Olivia Ramirez',
    title: 'Owner, Ventura Coastal Cafe',
    quote:
      'Paladin made our renewal process clear and stress-free. They found gaps we did not know existed and fixed them before busy season started.',
    result: 'Improved renewal timeline by 3 weeks',
  },
  {
    name: 'Jason Kim',
    title: 'Operations Manager, Brightline Logistics',
    quote:
      'Their team explained every recommendation in plain language. We now have stronger commercial auto protection without increasing confusion for our team.',
    result: 'Expanded fleet coverage with clearer limits',
  },
  {
    name: 'Monica Alvarez',
    title: 'Principal, Alvarez Property Group',
    quote:
      'The responsiveness is outstanding. Every policy change and certificate request is handled quickly, and we always know who to call.',
    result: 'Same-day certificate turnaround',
  },
  {
    name: 'Ethan Brooks',
    title: 'Founder, Stonegate Contracting',
    quote:
      'They helped us build a better liability strategy as we grew. It feels like having a dedicated risk partner, not just an agency.',
    result: 'Liability structure aligned to project growth',
  },
  {
    name: 'Priya Shah',
    title: 'Director, Northstar Wellness Clinics',
    quote:
      'Our policy review was detailed and practical. Paladin walked us through each step and gave us confidence in every decision.',
    result: 'Reduced policy uncertainty across teams',
  },
  {
    name: 'Daniel Turner',
    title: 'Managing Partner, Turner Real Estate Advisors',
    quote:
      'From onboarding to annual review, everything has been organized and professional. They consistently deliver guidance we can act on.',
    result: 'Stronger annual coverage planning process',
  },
  {
    name: 'Grace Molina',
    title: 'Owner, Molina Family Dental',
    quote:
      'Paladin helped us simplify policy decisions and explained each option clearly. We feel more secure knowing our clinic is properly protected.',
    result: 'Clearer policy decisions for clinic operations',
  },
  {
    name: 'Noah Peterson',
    title: 'General Manager, Sierra Valley Manufacturing',
    quote:
      'Their team was proactive from day one. They reviewed our coverage in detail and gave practical recommendations we could implement immediately.',
    result: 'Faster implementation of risk recommendations',
  },
  {
    name: 'Ariana Lopez',
    title: 'Director, Lopez Event Productions',
    quote:
      'Every renewal conversation is organized and focused. We always understand what changed, why it changed, and what it means for our business.',
    result: 'More confident and predictable renewal process',
  },
];

function TestimonialCard({ item }) {
  return (
    <article className="group h-full rounded-3xl border border-[#e7dccb] bg-white p-6 shadow-lg shadow-[#012E72]/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#012E72]/10 transition-all duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d8cbb8] bg-[#F7F4EF] text-[#002DB5]">
          <Quote className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1 text-[#F4B400]">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>

      <p className="text-[#010407]/80 leading-relaxed text-sm md:text-base flex-1">&ldquo;{item.quote}&rdquo;</p>

      <div className="mt-6 pt-4 border-t border-[#efe6d7]">
        <p className="font-bold text-[#012E72] text-base">{item.name}</p>
        <p className="text-sm text-[#010407]/70">{item.title}</p>
        <p className="mt-2 inline-flex rounded-full bg-[#F7F4EF] px-3 py-1 text-xs font-semibold text-[#002DB5] border border-[#d8cbb8]">
          {item.result}
        </p>
      </div>
    </article>
  );
}

function Testimonials() {
  return (
    <div className="min-h-screen bg-[#EEF3FF] flex flex-col text-[#010407]">
      <Header />

      <main className="relative overflow-hidden">
        <section className="relative bg-[#012E72] py-20 md:py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(247,244,239,0.3),transparent_40%)]" />
          <div className="relative max-w-6xl mx-auto text-center text-white">
            <p className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-xs font-semibold tracking-[0.18em] uppercase">
              Client Stories
            </p>
            <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Testimonials From Businesses We Protect
            </h1>
            <p className="mt-5 max-w-3xl mx-auto text-[#F7F4EF] text-base md:text-lg leading-relaxed">
              Every account is personal to us. Here is what Paladin clients say about the way we guide coverage decisions, communicate clearly, and stay dependable year-round.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-[#EEF3FF] to-[#DCE7FF] border-y border-[#cfdcf8]">
          <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        <section className="py-14 md:py-16 px-6 bg-[#012E72]">
          <div className="max-w-6xl mx-auto p-2 md:p-4 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Ready For A Better Insurance Experience?</h2>
            <p className="mt-3 text-[#F7F4EF] max-w-3xl mx-auto">
              We would love to learn about your goals and build a coverage strategy that fits your business, team, and long-term plans.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#012E72] shadow-lg shadow-[#010407]/20 hover:bg-[#F7F4EF] transition-colors"
              >
                Request A Quote
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white px-7 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Testimonials;