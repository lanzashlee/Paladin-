import React from 'react';
import { Handshake, CircleDollarSign, Star } from 'lucide-react';

const reasons = [
  {
    icon: <Handshake className="w-8 h-8 text-[#0077b6]" />,
    title: 'Personalized Service',
    desc:
      'Unforeseen events and a lack of the right kind of insurance can spell trouble quickly. When you choose our insurance services, you will have one-on-one assistance with a licensed agent who will guide you through every step to customize an insurance plan that specifically meets your needs.',
  },
  {
    icon: <CircleDollarSign className="w-8 h-8 text-[#0077b6]" />,
    title: 'Competitive Rates',
    desc:
      'Many financial experts will tell you poor planning can be costly. We make it a priority to offer affordable rates with flexible payment options to cover your company. Paladin Professional Insurance Solutions will get you covered quickly and at a price you can afford.',
  },
  {
    icon: <Star className="w-8 h-8 text-[#0077b6]" />,
    title: 'Quality and Care',
    desc:
      'Everyone has different insurance needs — there is no one-size-fits-all solution. We take pride in servicing our clients as we would for our own family. Our promise is to find you the correct coverage at an unbeatable price, giving you peace of mind that you are fully protected at a fair rate.',
  },
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
              <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs; 
