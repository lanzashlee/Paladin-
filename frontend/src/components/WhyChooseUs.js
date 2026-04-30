import React from 'react';
import { ShieldCheck, TrendingDown, HeartHandshake } from 'lucide-react';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

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
    <section id="why-choose-paladin" className="relative overflow-hidden bg-[#083b88] py-16 md:py-20">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-6 h-64 w-64 rounded-full bg-[#4f79bf]/25 blur-3xl" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full border border-[#d8cbb8] bg-[#F7F4EF] px-6 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#002DB5] shadow-sm" style={{ fontFamily: FONT_BODY }}>
            Why Choose Us
          </p>
          <h2 className="mt-5 mb-4 text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: FONT_DISPLAY }}>
            WHY CHOOSE PALADIN?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg" style={{ fontFamily: FONT_BODY }}>
            Trusted guidance, fair pricing, and personalized protection designed around your needs.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 md:mt-14 md:grid-cols-3 md:gap-10">
          {reasons.map((r, i) => (
            <article
              key={i}
              className="rounded-3xl border border-[#d8e0ee] bg-white px-7 pb-7 pt-7 text-center shadow-[0_8px_18px_rgba(1,46,114,0.14)] transition-all duration-200 hover:-translate-y-1 hover:border-[#c9d6ea] hover:shadow-[0_12px_24px_rgba(1,46,114,0.18)]"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#0d4ca8] bg-[#083b88] shadow-[0_6px_14px_rgba(1,46,114,0.2)]">
                {r.icon}
              </div>
              <p className="mx-auto mt-5 inline-flex rounded-full bg-[#083b88] px-5 py-1.5 text-sm font-bold text-white" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>
                {r.title}
              </p>
              <p className="mx-auto mt-5 max-w-[265px] text-base leading-relaxed text-[#1b1e24] md:text-[17px]" style={{ fontFamily: FONT_BODY }}>
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
