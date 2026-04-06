import React from 'react';
import { ShieldCheck, TrendingDown, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#0077b6]" />,
    title: 'Personalized Service',
    desc: 'One-on-one assistance with a licensed agent to customize an insurance plan that meets your exact needs.'
  },
  {
    icon: <TrendingDown className="w-8 h-8 text-[#0077b6]" />,
    title: 'Competitive Rates',
    desc: 'Affordable rates with flexible payment options. Get covered quickly at a price you can absolutely afford.'
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-[#0077b6]" />,
    title: 'Quality and Care',
    desc: 'We treat clients like family. Our promise: the right coverage at an unbeatable price for ultimate peace of mind.'
  }
];

function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0a0a] -skew-y-3 origin-bottom-left z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="text-center mb-16 mt-8">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Why Choose Paladin?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-8">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                {r.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{r.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
