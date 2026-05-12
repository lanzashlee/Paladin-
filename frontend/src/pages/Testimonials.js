import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  {
    name: 'Juan Hernandez',
    title: '',
    quote:
      'Denise and her team at Paladin Professional Insurance Solutions are truly professionals. Always ready to bend backwards to help their clients with all insurance certificate needs. We (JMH Fire Protection) are very happy and pleased with their service.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'GG Alexandra',
    title: '',
    quote:
      'Working with Paladin has been a great experience. They are attentive to customer needs and provide great products and excellent service. The whole team is courteous and they treat every client like VIP.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Pete Ibarra',
    title: '',
    quote:
      'Paladin is exactly who you want on your side for business insurance. They are knowledgeable, responsive, and make the entire process straightforward.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Terrence Whitehead',
    title: '',
    quote:
      'It is always a pleasure working with Paladin Professional Insurance. Their agents are extremely nice and professional.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Taima Brown',
    title: '',
    quote:
      'I was looking for a new place to get my homeowners insurance and I was referred to Denise. She was able to get me a policy that was less than half of what I paid the previous year.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Ursula Cato',
    title: '',
    quote:
      'They listened to what my needs were and provided great service. Friendly and knowledgeable.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'mark daquilla',
    title: '',
    quote: 'Great service and friendly staff.',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'James G',
    title: '',
    quote:
      'This place utilizes extremely dishonest business practices, policies will be unclear, expect vague charges and lack of customer service. I do not recommend giving this operation your business as they prioritize profits over the well being of their policy holders. Stay away.',
    result: '3 weeks ago',
    rating: 1,
  },
  {
    name: 'Edgar Jeknavorjian',
    title: '',
    quote: 'I get my cyber insurance through Paladin. Great service and answer all my questions.',
    result: '3 weeks ago',
    rating: 5,
  },
  {
    name: 'Keoshi Delivery LLC',
    title: '',
    quote:
      'Paladin is the best insurance company I have worked with thus far. As a transportation company we know how difficult it is to find a great agency that will find us great carriers. Paladin is a one stop shop for everything I need. Thank you!',
    result: 'a month ago',
    rating: 5,
  },
  {
    name: 'Carol Ellinger',
    title: '',
    quote:
      'Glad I found the Paladin Insurance Company when my other insurance company stopped insuring homes in our area. Knowledgeable, professional and always ready to help are traits I appreciate and the Paladin Team, especially Denise P., demonstrates these qualities to assure I receive top service.',
    result: '2 days ago',
    rating: 5,
  },
  {
    name: 'James Freer',
    title: '',
    quote:
      'Paladin once again checked out my insurance options and worked out suitable coverage policies. Good communication has been provided concerning steps along the way.',
    result: '3 days ago',
    rating: 5,
  },
  {
    name: 'Janet Sprissler',
    title: '',
    quote:
      'Denise and her team are very insightful and knowledgeable. Great service and friendly to work with. When I had a hard time getting insurance they saved the day.',
    result: '5 days ago',
    rating: 5,
  },
  {
    name: 'Kris Grasty',
    title: '',
    quote:
      'Paladin Professional Insurance Solutions is the easiest insurance company to work with ! The staff are always on top of important information . I had a hard time getting home owner\'s insurance. They were the only insurance company that would help me ! I highly recommend them !',
    result: '5 days ago',
    rating: 5,
  },
  {
    name: 'Erica Feldscher',
    title: '',
    quote:
      'Working with Paladin has been a great experience. Communication was clear and punctual.',
    result: 'a week ago',
    rating: 5,
  },
  {
    name: 'Shawn McMaster',
    title: '',
    quote:
      'I had a great experience with Paladin! I found them to be very helpful with my homeowners insurance needs--help that no one else seemed able to offer.',
    result: '2 weeks ago',
    rating: 5,
  },
];

const overallRating = 4.7;
const totalReviews = 19;

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

  const index = name.length % palette.length;
  return palette[index];
}

function TestimonialCard({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapsedCharacterCount = 320;
  const isLongQuote = item.quote.length > collapsedCharacterCount;
  const visibleQuote = isLongQuote && !isExpanded
    ? `${item.quote.slice(0, collapsedCharacterCount).trimEnd()}...`
    : item.quote;

  return (
    <article className="group h-full rounded-3xl border border-[#e7dccb] bg-white p-6 shadow-lg shadow-[#012E72]/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#012E72]/10 transition-all duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d8cbb8] bg-[#F7F4EF] text-[#002DB5]">
          <Quote className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1 text-[#F4B400]">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= (item.rating || 5) ? 'fill-current' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <p className="text-[#010407]/80 leading-relaxed text-sm md:text-base" style={{ fontFamily: FONT_BODY }}>&ldquo;{visibleQuote}&rdquo;</p>
        {isLongQuote && (
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            className="mt-2 text-[11px] font-semibold text-[#002DB5] hover:text-[#012E72] underline underline-offset-2"
            style={{ fontFamily: FONT_BODY }}
          >
            {isExpanded ? 'Show less' : 'More'}
          </button>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#efe6d7]">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full bg-gradient-to-br ${getAvatarStyle(item.name)} text-white text-sm font-extrabold flex items-center justify-center border border-white shadow-[0_4px_10px_rgba(1,46,114,0.2)]`}
            style={{ fontFamily: FONT_DISPLAY }}
            aria-hidden="true"
          >
            {getInitials(item.name)}
          </div>
          <div>
            <p className="font-bold text-[#012E72] text-base leading-tight" style={{ fontFamily: FONT_SUBHEADING, fontStyle: 'italic' }}>{item.name}</p>
            {item.title ? <p className="text-sm text-[#010407]/70" style={{ fontFamily: FONT_BODY }}>{item.title}</p> : null}
          </div>
        </div>
        <p className="mt-2 inline-flex rounded-full bg-[#F7F4EF] px-3 py-1 text-xs font-semibold text-[#002DB5] border border-[#d8cbb8]" style={{ fontFamily: FONT_BODY }}>
          {item.result}
        </p>
      </div>
    </article>
  );
}

function Testimonials() {
  return (
    <div className="min-h-screen bg-[#EEF3FF] flex flex-col text-[#010407]">
      <Header />

      <main className="relative overflow-hidden">
        <section className="relative bg-[#012E72] py-20 md:py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(247,244,239,0.3),transparent_40%)]" />
          <div className="relative max-w-6xl mx-auto text-center text-white">
            <p className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-xs font-semibold tracking-[0.18em] uppercase" style={{ fontFamily: FONT_BODY }}>
              Client Stories
            </p>
            <h1 className="mt-6 text-4xl md:text-5xl font-black tracking-tight leading-tight" style={{ fontFamily: FONT_DISPLAY }}>
              TESTIMONIALS FROM BUSINESSES WE PROTECT
            </h1>
            <p className="mt-5 max-w-3xl mx-auto text-[#F7F4EF] text-base md:text-lg leading-relaxed" style={{ fontFamily: FONT_BODY }}>
              Every account is personal to us. Here is what Paladin clients say about the way we guide coverage decisions, communicate clearly, and stay dependable year-round.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-2.5">
              <span className="text-2xl font-black leading-none" style={{ fontFamily: FONT_DISPLAY }}>{overallRating}</span>
              <div className="flex items-center gap-1 text-[#F4B400]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.floor(overallRating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#F7F4EF]" style={{ fontFamily: FONT_BODY }}>{totalReviews} reviews</span>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 px-6 bg-gradient-to-b from-[#EEF3FF] to-[#DCE7FF] border-y border-[#cfdcf8]">
          <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>
        </section>

        <section className="py-14 md:py-16 px-6 bg-[#012E72]">
          <div className="max-w-6xl mx-auto p-2 md:p-4 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white" style={{ fontFamily: FONT_DISPLAY }}>Ready For A Better Insurance Experience?</h2>
            <p className="mt-3 text-[#F7F4EF] max-w-3xl mx-auto" style={{ fontFamily: FONT_BODY }}>
              We would love to learn about your goals and build a coverage strategy that fits your business, team, and long-term plans.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#012E72] shadow-lg shadow-[#010407]/20 hover:bg-[#F7F4EF] transition-colors"
                style={{ fontFamily: FONT_BODY }}
              >
                Request A Quote
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white px-7 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                style={{ fontFamily: FONT_BODY }}
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Testimonials;
