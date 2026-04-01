import React from 'react';

const products = [
  {
    num: '1',
    title: 'General Liability',
    desc: 'Protects businesses from financial loss due to third-party claims for bodily injury, property damage, and personal injury. Our policies offer broad coverage and 24/7 assistance.',
  },
  {
    num: '2',
    title: 'Renters Insurance',
    desc: 'Protect your belongings and liability as a renter. Our policies cover theft, fire, water damage, and more - tailored to your specific rental situation.',
  },
  {
    num: '3',
    title: 'Umbrella Insurance',
    desc: "Get additional liability coverage beyond your existing policies. Our umbrella insurance provides extra protection for your assets and peace of mind when standard limits aren't enough.",
  },
  {
    num: '4',
    title: "Workers' Compensation",
    desc: 'Provides financial support and medical benefits to employees injured or ill due to their job - covering medical expenses, lost wages, rehabilitation costs, and death benefits for dependents.',
  },
  {
    num: '5',
    title: 'Flood Insurance',
    desc: 'Protect your home and belongings from flood damage caused by natural disasters, burst pipes, and other water-related incidents. We help identify your flood risk and find the right level of coverage.',
  },
  {
    num: '6',
    title: 'Commercial Auto Insurance',
    desc: 'Protects against financial losses from accidents, property damage, and liability claims involving business vehicles - including bodily injury, property damage, theft, vandalism, and legal costs.',
  },
  {
    num: '7',
    title: 'Cyber Liability Insurance',
    desc: 'Designed to protect businesses from financial losses stemming from cyberattacks and data breaches - covering data recovery, legal fees, and notification expenses required by data protection laws.',
  },
  {
    num: '8',
    title: 'Earthquake Insurance',
    desc: 'A specialized form of property coverage designed to protect against the financial impact of earthquake damage - filling the gap left by standard homeowners or commercial policies that exclude seismic events.',
  },
  {
    num: '9',
    title: 'Commercial Insurance',
    desc: 'A broad safeguard for businesses offering protection against liabilities, property damage, employee injuries, and other potential losses arising from everyday operations. Custom-tailored for your industry.',
  },
];

function FeaturedProducts() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto w-full" id="coverage-offerings">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-[#0a0a0a] tracking-tight mb-4">Our Coverage Offerings</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We proudly offer a comprehensive suite of insurance products designed to protect what
          matters most to you and your business.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.num}
            className="glass-panel rounded-3xl p-8 flex flex-col gap-4 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0077b6] flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <span className="text-white text-base font-black">{p.num}</span>
            </div>

            <h3 className="text-xl font-bold text-[#0a0a0a] group-hover:text-[#0077b6] transition-colors">{p.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
