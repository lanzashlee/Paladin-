import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    num: '1',
    title: 'General Liability',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    desc: 'Protects businesses from financial loss due to third-party claims for bodily injury, property damage, and personal injury. Our policies offer broad coverage and 24/7 assistance.',
  },
  {
    num: '2',
    title: 'Renters Insurance',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    desc: 'Protect your belongings and liability as a renter. Our policies cover theft, fire, water damage, and more - tailored to your specific rental situation.',
  },
  {
    num: '3',
    title: 'Umbrella Insurance',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    desc: "Get additional liability coverage beyond your existing policies. Our umbrella insurance provides extra protection for your assets and peace of mind when standard limits aren't enough.",
  },
  {
    num: '4',
    title: "Workers' Compensation",
    image:
      'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1200&q=80',
    desc: 'Provides financial support and medical benefits to employees injured or ill due to their job - covering medical expenses, lost wages, rehabilitation costs, and death benefits for dependents.',
  },
  {
    num: '5',
    title: 'Flood Insurance',
    image:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    desc: 'Protect your home and belongings from flood damage caused by natural disasters, burst pipes, and other water-related incidents. We help identify your flood risk and find the right level of coverage.',
  },
  {
    num: '6',
    title: 'Commercial Auto Insurance',
    image:
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1200&q=80',
    desc: 'Protects against financial losses from accidents, property damage, and liability claims involving business vehicles - including bodily injury, property damage, theft, vandalism, and legal costs.',
  },
  {
    num: '7',
    title: 'Cyber Liability Insurance',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    desc: 'Designed to protect businesses from financial losses stemming from cyberattacks and data breaches - covering data recovery, legal fees, and notification expenses required by data protection laws.',
  },
  {
    num: '8',
    title: 'Earthquake Insurance',
    image:
      'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=1200&q=80',
    desc: 'A specialized form of property coverage designed to protect against the financial impact of earthquake damage - filling the gap left by standard homeowners or commercial policies that exclude seismic events.',
  },
  {
    num: '9',
    title: 'Commercial Insurance',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    desc: 'A broad safeguard for businesses offering protection against liabilities, property damage, employee injuries, and other potential losses arising from everyday operations. Custom-tailored for your industry.',
  },
];

function FeaturedProducts() {
  return (
    <section className="relative py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full overflow-hidden" id="coverage-offerings">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[760px] h-[300px] rounded-full bg-[#0077b6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 w-[360px] h-[360px] rounded-full bg-sky-200/60 blur-3xl" />

      <div className="relative z-10 text-center mb-16">
        <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0077b6]/10 text-[#0077b6] text-xs font-semibold tracking-widest uppercase mb-5 border border-[#0077b6]/20">
          Coverage Portfolio
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0a0a0a] tracking-tight mb-4">
          Our Coverage Offerings
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore a curated suite of protection options for businesses, property owners, and
          families, each designed to match real-world risk and long-term peace of mind.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <article
            key={p.num}
            className="relative overflow-hidden rounded-3xl border border-white/20 p-7 sm:p-8 flex flex-col gap-4 group min-h-[340px] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${p.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/45 to-[#0a0a0a]/65" aria-hidden="true" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <span className="text-white text-base font-black">{p.num}</span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-semibold">Featured</span>
            </div>

            <h3 className="relative z-10 text-xl font-bold text-white drop-shadow-sm group-hover:text-[#7dd3fc] transition-colors">
              {p.title}
            </h3>
            <p className="relative z-10 text-white/95 text-sm leading-relaxed text-justify drop-shadow-sm flex-1">
              {p.desc}
            </p>
          </article>
        ))}
      </div>

      <div className="relative z-10 mt-12 flex justify-center">
        <Link
          to="/service"
          className="inline-flex items-center gap-2 bg-[#0077b6] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/20 hover:bg-[#00639a] transition-all hover:-translate-y-0.5"
        >
          Explore All Services
        </Link>
      </div>
    </section>
  );
}

export default FeaturedProducts;
