import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';

const previewTestimonials = [
  {
    name: 'Jelitza Gutierrez',
    title: '',
    quote:
      'I had a great experience with Paladin Professional Insurance Solutions. Denise and Lionel are incredibly kind, knowledgeable, and professional throughout the entire process. They truly go above and beyond and work hard to find a solution that fits your needs.',
  },
  {
    name: 'Plumbing Done Right',
    title: '',
    quote:
      'Since I have started my Plumbing Business a few years ago Paladin Insurance Services Solutions has been absolutely great. Denise, Lionel, and all their staff are professional and handle my insurance needs and short notice requests quickly.',
  },
  {
    name: 'Keoshi Delivery LLC',
    title: '',
    quote:
      'Paladin is the best insurance company I have worked with thus far. As a transportation company, we know how difficult it is to find a great agency that will find us great carriers. Paladin is a one stop shop for everything I need.',
  },
];

function getInitials(name) {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return 'U';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getAvatarStyle(name) {
  const palette = [
    'from-[#0f3f91] to-[#245dc1]',
    'from-[#0a5f7f] to-[#1185b0]',
    'from-[#1f4f2c] to-[#2f7a3f]',
    'from-[#7d3b0d] to-[#b35a1a]',
    'from-[#6f1d6d] to-[#9c34a2]'
  ];

  return palette[name.length % palette.length];
}

function TestimonialsPreview() {
  return (
    <section id="what-our-clients-say" className="pt-16 md:pt-20 pb-8 md:pb-10 px-6 bg-gradient-to-b from-[#FFF9F0] via-[#F9F1E4] to-[#F1E4D0] border-b border-[#ddccb2]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <p className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#d8cbb8] bg-white text-xs font-semibold tracking-[0.18em] uppercase text-[#002DB5]">
            Testimonials
          </p>
          <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-[#012E72]">What Our Clients Say</h2>
          <p className="mt-3 text-[#010407]/70 max-w-3xl mx-auto">
            Trusted by businesses and families who value responsive service, practical guidance, and dependable protection.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewTestimonials.map((item) => (
            <article
              key={item.name}
              className="h-full rounded-3xl border border-[#e7dccb] bg-white p-6 shadow-lg shadow-[#012E72]/5 flex flex-col"
            >
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
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarStyle(item.name)} text-white text-sm font-extrabold flex items-center justify-center border border-white shadow-[0_4px_10px_rgba(1,46,114,0.2)]`}
                    aria-hidden="true"
                  >
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <p className="font-bold text-[#012E72] text-base leading-tight">{item.name}</p>
                    {item.title ? <p className="text-sm text-[#010407]/70">{item.title}</p> : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <Link
            to="/testimonials"
            className="inline-flex items-center justify-center rounded-full bg-[#012E72] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-colors"
          >
            View All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsPreview;