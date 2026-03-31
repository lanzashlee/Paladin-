import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const faqs = [
  {
    question: 'What services does Paladin Business Services offer?',
    answer:
      'Paladin Business Services specializes in business consulting, compliance services, strategy development, and more. We help businesses streamline their operations and ensure they’re in full compliance with industry regulations. For more details, check out our Services page.',
    tags: ['services', 'what you do', 'offerings'],
  },
  {
    question: 'How do I get started with a consultation?',
    answer:
      'Getting started is easy! Simply visit our Book a Consultation page, select a time that works for you, and fill out a brief form. We\'ll confirm your booking and send you the details.',
    tags: ['consultation', 'getting started', 'booking'],
  },
  {
    question: 'What industries do you work with?',
    answer:
      'We work with a variety of industries including real estate, insurance, small businesses, startups, and corporate enterprises. Our services are customizable to meet the unique needs of each industry.',
    tags: ['industries', 'who you help'],
  },
  {
    question: 'How much does a consultation cost?',
    answer:
      'Our initial consultation is free. During this session, we’ll assess your business needs and discuss how we can help you. Afterward, we’ll provide a quote based on the services you’re interested in.',
    tags: ['pricing', 'cost', 'consultation fee'],
  },
  {
    question: 'How long does it take to see results from your services?',
    answer:
      'Results vary depending on the service and complexity of your needs; however, many of our clients start seeing positive changes within a few weeks to a couple of months.',
    tags: ['results', 'timeline'],
  },
  {
    question: 'Do you offer ongoing support after the consultation?',
    answer:
      'Yes. We offer ongoing support for clients who need continued consultation, compliance monitoring, or strategy adjustments. We can tailor a long-term support plan to fit your needs.',
    tags: ['support', 'ongoing help'],
  },
  {
    question: 'Is my business information kept confidential?',
    answer:
      'Absolutely. We take privacy and security seriously. All information shared with us is kept confidential, and we adhere to strict data protection policies.',
    tags: ['privacy', 'confidentiality', 'security'],
  },
  {
    question: 'Can I work with you if my business is located outside of your city?',
    answer:
      'Yes, we work with clients across the country and internationally. We offer virtual consultations and services to businesses wherever you are located.',
    tags: ['location', 'remote', 'virtual'],
  },
  {
    question: 'What makes Paladin Business Services different from other consulting firms?',
    answer:
      'We focus on providing personalized, actionable strategies that drive tangible results. Our team brings years of expertise across various industries and delivers tailored solutions to help you achieve your business goals.',
    tags: ['difference', 'why choose', 'unique'],
  },
  {
    question: 'How can I contact you for more information?',
    answer:
      'You can reach us via email or through our contact page. You can also request a quote directly from our quote request page.',
    tags: ['contact', 'more information'],
  },
];

export default function FAQ() {
  const [query, setQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((item) => {
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
      return inQuestion || inAnswer || inTags;
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Intro Section */}
        <section className="py-14 md:py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <p className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-[#0077b6] text-xs font-semibold tracking-wide uppercase mb-3">
              Help Center
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a] mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Got questions? We’ve got answers. Here’s a list of common questions our clients ask
              before working with us.
            </p>

            {/* Search */}
            <div className="mt-6 max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions (e.g. pricing, consultation, industries)"
                  className="w-full rounded-full border border-gray-200 px-5 py-3.5 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent"
                />
              </div>
              {query && (
                <p className="mt-2 text-xs text-gray-500">
                  Showing {filteredFaqs.length} result{filteredFaqs.length === 1 ? '' : 's'} for "
                  {query}".
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-14 md:py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-5">
              {filteredFaqs.map((item, index) => (
                <details
                  key={item.question}
                  className="group bg-white border border-gray-100 rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-sm hover:shadow-md transition-shadow"
                  open={index === 0 && !query}
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h2 className="text-sm md:text-base font-semibold text-[#0a0a0a] pr-4">
                      {item.question}
                    </h2>
                    <span className="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 text-xs group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="mt-2 text-xs md:text-sm text-gray-600 leading-relaxed text-justify">
                    {item.answer}
                  </div>
                </details>
              ))}

              {filteredFaqs.length === 0 && (
                <p className="text-center text-gray-500 text-xs md:text-sm mt-5">
                  No questions matched your search. Try different keywords or browse the full list.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-14 md:py-16 px-6 bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Still have questions?
            </h2>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              If you didn’t find the answer you were looking for, we’re here to help.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
              <Link
                to="/quote"
                className="bg-white text-[#0077b6] px-7 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-md hover:bg-gray-100 transition-colors"
              >
                Request a Quote
              </Link>
              <Link
                to="/contact"
                className="border border-white text-white px-7 py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-white/10 transition-colors"
              >
                Contact Us Directly
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

