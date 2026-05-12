import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';
import useReviews from '../hooks/useReviews';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_SUBHEADING = 'Constantia, "Times New Roman", serif';
const FONT_BODY = '"Times New Roman", Times, serif';

const previewTestimonials = [
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

function TestimonialsPreview() {
  const { reviews, loading, error } = useReviews(3);
  const [displayTestimonials, setDisplayTestimonials] = useState(previewTestimonials);

  // Update testimonials when reviews are loaded
  useEffect(() => {
    if (reviews && reviews.reviews && reviews.reviews.length > 0) {
      // Transform Google reviews to match our testimonial format
      const googleReviews = reviews.reviews.map((review) => ({
        name: review.author || review.reviewer_name || 'Google Reviewer',
        title: '',
        quote: review.text || review.review || '',
        result: review.relative_time_description || 'Recently',
        rating: review.rating || 5,
      }));
      setDisplayTestimonials(googleReviews);
    }
    // If no reviews or error, fall back to hardcoded testimonials
  }, [reviews]);

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

          {/* Right Testimonials - Responsive Layout */}
          <div className="order-2 relative w-full lg:flex lg:items-center lg:justify-center">
            {/* Mobile: Stacked cards */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {displayTestimonials.map((item) => (
                <article
                  key={item.name}
                  className="flex w-full flex-col rounded-lg border border-[#e3e8f2] bg-white p-3 shadow-[0_10px_24px_rgba(1,46,114,0.12)] sm:rounded-xl sm:p-4"
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="inline-flex h-7 sm:h-8 w-7 sm:w-8 items-center justify-center rounded-full bg-[#f4f2ee] border border-[#d7d7d7] text-[#003a99]">
                      <Quote className="h-3 sm:h-4 w-3 sm:w-4" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[#f4c542]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3 sm:h-3.5 w-3 sm:w-3.5 ${star <= (item.rating || 5) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>

                  <p className="mb-2 sm:mb-3 text-sm leading-relaxed text-[#010407]/85" style={{ fontFamily: FONT_BODY }}>
                    &ldquo;{item.quote.substring(0, 85)}...&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#f0f0f0] gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`h-7 sm:h-8 w-7 sm:w-8 rounded-full bg-gradient-to-br ${getAvatarStyle(item.name)} text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center flex-shrink-0`}
                        style={{ fontFamily: FONT_DISPLAY }}
                        aria-hidden="true"
                      >
                        {getInitials(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold leading-tight text-[#003a99]" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>{item.name}</p>
                      </div>
                    </div>
                    <p className="ml-1 whitespace-nowrap text-[10px] text-[#7a7a7a] flex-shrink-0" style={{ fontFamily: FONT_BODY }}>{item.result || 'Client Review'}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop: Floating staggered cards */}
            <div className="hidden lg:block relative mx-auto h-[610px] w-full max-w-[700px]">
              {displayTestimonials.map((item, index) => (
                <article
                  key={item.name}
                  className="absolute flex flex-col rounded-lg border border-[#e3e8f2] bg-white p-3.5 shadow-[0_12px_26px_rgba(1,46,114,0.14)] md:p-4"
                  style={{
                    width: '338px',
                    top: index === 0 ? '4px' : index === 1 ? '150px' : '336px',
                    left: index === 1 ? '66px' : 'auto',
                    right: index !== 1 ? '18px' : 'auto',
                    zIndex: displayTestimonials.length - index,
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f2ee] border border-[#d7d7d7] text-[#003a99]">
                      <Quote className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-0.5 text-[#f4c542]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3 w-3 ${star <= (item.rating || 5) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>

                  <p className="mb-2.5 text-sm leading-relaxed text-[#010407]/85" style={{ fontFamily: FONT_BODY }}>
                    &ldquo;{item.quote.substring(0, 200)}...&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#f0f0f0]">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`h-7 w-7 rounded-full bg-gradient-to-br ${getAvatarStyle(item.name)} text-white text-[9px] font-extrabold flex items-center justify-center flex-shrink-0`}
                        style={{ fontFamily: FONT_DISPLAY }}
                        aria-hidden="true"
                      >
                        {getInitials(item.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold leading-tight text-[#003a99]" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>{item.name}</p>
                      </div>
                    </div>
                    <p className="ml-2 whitespace-nowrap text-[10px] text-[#7a7a7a] flex-shrink-0" style={{ fontFamily: FONT_BODY }}>{item.result || 'Client Review'}</p>
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