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
    <section id="what-our-clients-say" className="bg-[#003a99] py-12 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr] gap-10 md:gap-12 lg:gap-28 items-start">
          {/* Left Content */}
          <div className="flex flex-col justify-start">
            <div className="inline-flex items-center mb-5 sm:mb-7 w-fit">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#f2f0ea] text-[#003a99] shadow-[0_2px_0_rgba(0,0,0,0.12)]">
                <Quote className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium tracking-[0.02em]">Testimonials</span>
              </div>
            </div>

            <h2 className="max-w-[360px] font-serif text-[2rem] leading-[1.08] sm:text-[2.7rem] md:text-[3.1rem] lg:text-[3.6rem] font-semibold uppercase text-white mb-4 sm:mb-6">
              SEE WHAT ALL THE TALK IS ABOUT!
            </h2>

            <p className="text-white text-sm sm:text-[15px] md:text-base leading-[1.45] mb-7 sm:mb-10 max-w-[320px] font-semibold">
              Trusted by businesses and families who value responsive service,
              practical guidance, and dependable protection.
            </p>

            <Link
              to="/testimonials"
              className="inline-flex items-center justify-center w-fit rounded-[2px] border border-[#d8dbe3] bg-transparent text-white font-medium px-6 py-2.5 text-sm hover:bg-white hover:text-[#003a99] transition-colors duration-300"
            >
              View more
            </Link>
          </div>

          {/* Right Testimonials - Responsive Layout */}
          <div className="relative w-full">
            {/* Mobile: Stacked cards */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {previewTestimonials.map((item) => (
                <article
                  key={item.name}
                  className="rounded-lg sm:rounded-xl bg-white p-3 sm:p-4 shadow-[0_10px_24px_rgba(0,0,0,0.18)] flex flex-col w-full"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="inline-flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full bg-[#f4f2ee] border border-[#d7d7d7] text-[#003a99]">
                      <Quote className="h-3 sm:h-4 w-3 sm:w-4" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[#f4c542]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 sm:h-3.5 w-3 sm:w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#010407] leading-relaxed text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                    &ldquo;{item.quote.substring(0, 85)}...&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#f0f0f0] gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-gradient-to-br ${getAvatarStyle(item.name)} text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center flex-shrink-0`}
                        aria-hidden="true"
                      >
                        {getInitials(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#003a99] text-xs leading-tight truncate">{item.name}</p>
                      </div>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-[#999] whitespace-nowrap ml-1 flex-shrink-0">Owner, Ventura Coastal Cafe</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop: Floating staggered cards */}
            <div className="hidden lg:block relative ml-auto h-[620px] w-full max-w-[660px]">
              {previewTestimonials.map((item, index) => (
                <article
                  key={item.name}
                  className="absolute rounded-lg bg-white p-3.5 md:p-4 shadow-[0_12px_26px_rgba(0,0,0,0.24)] flex flex-col"
                  style={{
                    width: '340px',
                    top: index === 0 ? '0px' : index === 1 ? '210px' : '420px',
                    left: index === 1 ? '40px' : 'auto',
                    right: index !== 1 ? '40px' : 'auto',
                    zIndex: previewTestimonials.length - index,
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f2ee] border border-[#d7d7d7] text-[#003a99]">
                      <Quote className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[#f4c542]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#010407] leading-[1.08] text-[11px] md:text-xs font-medium mb-2.5 font-serif">
                    &ldquo;Paladin made our renewal process clear and stress-free. They found gaps we did not know existed and fixed them before busy season started.&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#f0f0f0]">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarStyle(item.name)} text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0`}
                        aria-hidden="true"
                      >
                        {getInitials(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-normal text-[#5f5f5f] text-[9px] leading-tight truncate">Olivia Ramirez</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-[#6e6e6e] whitespace-nowrap ml-2 flex-shrink-0">Owner, Ventura Coastal Cafe</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsPreview;