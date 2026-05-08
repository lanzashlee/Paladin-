import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

const testimonials = [
  {
    name: 'Jelitza Gutierrez',
    title: '',
    quote:
      'I had a great experience with Paladin Professional Insurance Solutions. Denise and Lionel are incredibly kind, knowledgeable, and professional throughout the entire process. They truly go above and beyond - even if you have been denied coverage elsewhere, they work hard to find a solution that fits your needs. Their company name really says it all! I highly recommend them to anyone looking for reliable and supportive insurance professionals.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Aj Laboriante',
    title: '',
    quote:
      'I do not leave reviews often, but when service is this good, it deserves to be recognized. They truly operate at a different level. From the very first conversation, I felt like I was not just another policy number. I was actually taken care of. Denise and Lionel took care of me personally, walked me through every detail, answered all my questions (and I had a lot), and made sure I understood exactly what I was getting. No pressure. No confusion. Just clear communication and real professionalism. What really stood out was how responsive they were. Calls returned quickly, emails answered promptly, and they made the entire process smooth and stress-free. If you are looking for an insurance company that actually values relationships, explains things clearly, and treats you like family, hit them up. Highly recommend.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Plumbing Done Right',
    title: '',
    quote:
      'Since I have started my Plumbing Business a few years ago Paladin Insurance Services Solutions has been absolutely Great! From Denise, Lionel and all their Staff are professional. They handle my insurance needs and short notice requests in moments. Thank you Paladin Insurance!',
    result: 'a month ago',
    rating: 5,
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

function TestimonialsCarousel() {
  return (
    <section id="what-our-clients-say" className="bg-[#012E72] py-12 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-10 md:gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-28">
          {/* Left Content */}
          <div className="order-1 flex h-full flex-col items-start justify-center pt-4 text-left lg:pt-12">
            <div className="inline-flex items-center mb-5 sm:mb-7 w-fit">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-[#F7F4EF] px-4 py-1.5 text-[#003a99] shadow-sm">
                <Quote className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: FONT_BODY }}>Testimonials</span>
              </div>
            </div>

            <h2 className="mb-4 max-w-[520px] text-3xl font-extrabold leading-tight tracking-tight text-white sm:mb-6 md:text-4xl" style={{ fontFamily: FONT_DISPLAY }}>
              SEE WHAT ALL THE TALK IS ABOUT!
            </h2>

            <p className="mb-7 max-w-[460px] text-base leading-relaxed text-white/85 sm:mb-10 md:text-lg" style={{ fontFamily: FONT_BODY }}>
              Trusted by businesses and families who value responsive service,
              practical guidance, and dependable protection.
            </p>

            <Link
              to="/testimonials"
              className="inline-flex w-fit items-center justify-center rounded-full border border-[#d8dbe3] bg-transparent px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#003a99]"
              style={{ fontFamily: FONT_BODY }}
            >
              View more
            </Link>
          </div>

          {/* Right - Inverted Triangle Setup (2 on top, 1 on bottom) */}
          <div className="order-2 relative w-full flex justify-center">
            <div className="w-full max-w-[650px]">
              {/* Top Two Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[0, 1].map((idx) => (
                  <article key={testimonials[idx].name} className="flex flex-col rounded-lg border border-[#e3e8f2] bg-white p-4 shadow-[0_12px_26px_rgba(1,46,114,0.14)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(1,46,114,0.2)]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f2ee] border border-[#d7d7d7] text-[#003a99]">
                        <Quote className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-0.5 text-[#f4c542]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-3 w-3 ${star <= (testimonials[idx].rating || 5) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>

                    <p className="mb-4 text-xs sm:text-sm leading-relaxed text-[#010407]/85 line-clamp-4" style={{ fontFamily: FONT_BODY }}>
                      &ldquo;{testimonials[idx].quote}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-[#f0f0f0] gap-2 mt-auto">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarStyle(testimonials[idx].name)} text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0`}
                          style={{ fontFamily: FONT_DISPLAY }}
                          aria-hidden="true"
                        >
                          {getInitials(testimonials[idx].name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-bold leading-tight text-[#003a99]" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>{testimonials[idx].name}</p>
                        </div>
                      </div>
                      <p className="ml-1 whitespace-nowrap text-[9px] text-[#7a7a7a] flex-shrink-0" style={{ fontFamily: FONT_BODY }}>{testimonials[idx].result || 'Client Review'}</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom Card - Centered */}
              <div className="flex justify-center">
                <article className="w-full max-w-[300px] flex flex-col rounded-lg border border-[#e3e8f2] bg-white p-4 shadow-[0_12px_26px_rgba(1,46,114,0.14)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(1,46,114,0.2)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f2ee] border border-[#d7d7d7] text-[#003a99]">
                      <Quote className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[#f4c542]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3 w-3 ${star <= (testimonials[2].rating || 5) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>

                  <p className="mb-4 text-xs sm:text-sm leading-relaxed text-[#010407]/85 line-clamp-4" style={{ fontFamily: FONT_BODY }}>
                    &ldquo;{testimonials[2].quote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#f0f0f0] gap-2 mt-auto">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarStyle(testimonials[2].name)} text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0`}
                        style={{ fontFamily: FONT_DISPLAY }}
                        aria-hidden="true"
                      >
                        {getInitials(testimonials[2].name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs sm:text-sm font-bold leading-tight text-[#003a99]" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>{testimonials[2].name}</p>
                      </div>
                    </div>
                    <p className="ml-1 whitespace-nowrap text-[9px] text-[#7a7a7a] flex-shrink-0" style={{ fontFamily: FONT_BODY }}>{testimonials[2].result || 'Client Review'}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsCarousel;
