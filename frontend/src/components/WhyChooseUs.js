import React from 'react';
import { ShieldCheck, TrendingDown, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-white" />,
    title: 'Personalized Service',
    desc: 'One-on-one assistance with a licensed agent to customize an insurance plan that meets your exact needs.'
  },
  {
    icon: <TrendingDown className="h-5 w-5 text-white" />,
    title: 'Competitive Rates',
    desc: 'Affordable rates with flexible payment options. Get covered quickly at a price you can absolutely afford.'
  },
  {
    icon: <HeartHandshake className="h-5 w-5 text-white" />,
    title: 'Quality and Care',
    desc: 'We treat clients like family. Our promise: the right coverage at an unbeatable price for ultimate peace of mind.'
  }
];

function WhyChooseUs() {
  return (
    <section id="why-choose-paladin" className="relative overflow-hidden bg-[#083b88] pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-16 w-[140%] -translate-x-1/2 rounded-b-[100%] bg-[#f3f6fb] md:h-20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="-mt-8 text-center md:-mt-10">
          <h2 className="inline-flex rounded-xl bg-[#f8fbff] px-7 py-2 text-3xl font-bold tracking-tight text-[#083b88] shadow-[0_8px_16px_rgba(1,46,114,0.24)] md:text-5xl md:font-semibold md:font-serif">
            Why Choose Paladin?
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 md:mt-14 md:grid-cols-3 md:gap-10">
          {reasons.map((r, i) => (
            <article
              key={i}
              className="rounded-3xl border border-[#d5dce8] bg-white px-7 pb-7 pt-6 text-center shadow-[0_16px_28px_rgba(255,255,255,0.28)]"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#083b88] shadow-[0_8px_16px_rgba(1,46,114,0.26)]">
                {r.icon}
              </div>
              <p className="mx-auto mt-5 inline-flex rounded-full bg-[#083b88] px-5 py-1.5 text-xs font-bold text-white">
                {r.title}
              </p>
              <p className="mx-auto mt-6 max-w-[240px] text-[17px] leading-relaxed text-[#1b1e24] md:text-lg">
                {r.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
