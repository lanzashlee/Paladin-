import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const faqSections = [
  {
    title: 'ABOUT PALADIN',
    items: [
      {
        question: 'What is Paladin Professional Insurance Solutions?',
        answer:
          'Paladin Professional Insurance Solutions is a full-service independent insurance agency based in Ventura, CA. We specialize in delivering premium protection across personal, commercial, and specialty lines. Our consultative, hands-on approach means we craft coverage that truly fits your life and your business — not a generic, off-the-shelf policy.',
        tags: ['about', 'agency', 'independent', 'ventura'],
      },
      {
        question: 'What makes Paladin different from other insurance agencies?',
        answer:
          "Paladin is an independent agency, meaning our agents aren't tied to a single insurance carrier. With over 20 years of industry experience, we shop across multiple providers to find you the best coverage at the best price. We take a family-first, consultative approach — treating every client the way we would our own family.",
        tags: ['difference', 'independent', 'carriers', 'experience'],
      },
      {
        question: 'How long has Paladin been in the insurance industry?',
        answer:
          'Our agents bring over 20 years of experience in the insurance industry. This deep expertise allows us to navigate complex coverage options and match clients with the right policies across a wide range of personal, commercial, and specialty lines.',
        tags: ['experience', 'years', 'history'],
      },
      {
        question: 'Is Paladin an independent insurance agency?',
        answer:
          'Yes. Paladin is a fully independent insurance agency. This means we are not bound to any single insurance carrier, allowing us to compare multiple providers on your behalf and find the most competitive coverage tailored to your specific needs.',
        tags: ['independent', 'carrier', 'compare'],
      },
    ],
  },
  {
    title: 'CONSULTATIONS & REQUESTS',
    items: [
      {
        question: 'How do I request a personalized consultation?',
        answer:
          'If you need proper and affordable coverage, you can request a consultation directly through our website or by contacting us at 805-692-6900 or support@paladinbusinessservices.net. One of our licensed agents will work with you to craft a personalized insurance plan that fits your specific needs.',
        tags: ['consultation', 'request', 'phone', 'email'],
      },
      {
        question: 'How do I request proof of insurance?',
        answer:
          'You can submit a proof of insurance request through our website. One of our licensed agents will send it out to you as soon as possible. For urgent requests, you may also call us directly at 805-692-6900 during business hours.',
        tags: ['proof of insurance', 'certificate', 'urgent'],
      },
      {
        question: 'How do I make changes to my existing policy?',
        answer:
          'Policy changes are easy to request. Simply submit your change request through our website or contact our office and we will update your policy accordingly. Our agents are available Monday through Friday, 9:00 AM – 5:00 PM, to assist with any modifications.',
        tags: ['policy', 'changes', 'modifications'],
      },
      {
        question: 'How do I update my contact information on file?',
        answer:
          'To update your contact details on an existing policy, you can submit a request through our website or reach out to us directly by phone or email. Our team will process the update promptly to ensure your records stay current.',
        tags: ['contact', 'update', 'information'],
      },
      {
        question: 'How do I report a claim?',
        answer:
          'You can report a claim through our website or by contacting our office. Once your claim is submitted, one of our licensed agents will reach out to you shortly to provide personalized support and guidance throughout the entire claims process.',
        tags: ['claim', 'report'],
      },
      {
        question: 'Can I request a call from a Paladin agent?',
        answer:
          'Yes. If you need further assistance or simply prefer to speak with someone, you can request a call through our website. One of our licensed agents will reach out to you promptly to address your questions or concerns.',
        tags: ['call', 'agent', 'callback'],
      },
    ],
  },
  {
    title: 'WORKING WITH US',
    items: [
      {
        question: 'What industries and clients does Paladin work with?',
        answer:
          'Paladin works with a wide range of clients — licensed professionals (doctors, lawyers, accountants, IT consultants, real estate agents), business owners of all sizes, landlords, contractors, fleet operators, and individual personal insurance clients. If you have something worth protecting, we have a solution built for you.',
        tags: ['industries', 'clients', 'professionals', 'business'],
      },
      {
        question: 'Can Paladin handle coverage needs across multiple insurance types?',
        answer:
          "Absolutely. Paladin specializes in coordinating coverage across multiple lines. For example, a contractor might need General Liability, Workers' Compensation, Commercial Auto, and Umbrella Insurance together. Our agents assess your full risk profile and build a comprehensive, cohesive plan that covers all your bases.",
        tags: ['coverage', 'multiple lines', 'bundling', 'commercial'],
      },
      {
        question: 'Do you provide one-on-one guidance throughout the process?',
        answer:
          "Yes. One-on-one guidance is central to Paladin's promise. From your first consultation to policy finalization, a dedicated licensed agent will walk you through every step — explaining your options, comparing providers, and making sure you fully understand what you're covered for and why.",
        tags: ['guidance', 'agent', 'consultation'],
      },
      {
        question: "Can I work with Paladin if I'm outside of California?",
        answer:
          'Yes! Paladin is licensed in California (CA), Arizona (AZ), Idaho (ID), Illinois (IL), Indiana (IN), Nevada (NV), North Carolina (NC), Ohio (OH), and Texas (TX). If your business or property is in any of these states, our agents can work with you — in person or remotely.',
        tags: ['states', 'licensed', 'remote', 'california'],
      },
      {
        question: 'Do you offer ongoing support after I get a policy?',
        answer:
          "Yes. Paladin's commitment doesn't end when you sign your policy. Our agents remain available Monday through Friday, 9:00 AM – 5:00 PM, to assist with questions, policy adjustments, renewals, and claims guidance. You'll always have a trusted advisor in your corner.",
        tags: ['support', 'renewal', 'ongoing'],
      },
      {
        question: 'Is my personal and business information kept confidential?',
        answer:
          "Absolutely. At Paladin, we treat every client's information with the same care and discretion we would apply to our own family. Your data is used solely to find and manage the right coverage for you and is never shared without your explicit consent.",
        tags: ['privacy', 'confidential', 'data'],
      },
    ],
  },
  {
    title: 'CONTACT & OFFICE',
    items: [
      {
        question: "What are Paladin's office hours?",
        answer:
          'Our team is available Monday through Friday, 9:00 AM – 5:00 PM. We are closed on Saturdays and Sundays. If you need to reach us outside of office hours, you can send an email to support@paladinbusinessservices.net and an agent will get back to you on the next business day.',
        tags: ['hours', 'schedule', 'weekend'],
      },
      {
        question: 'How can I contact Paladin?',
        answer:
          "You can reach us through any of the following: Phone: 805-692-6900 | Fax: 805-830-1680 | Email: support@paladinbusinessservices.net | Address: 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003. We're happy to assist through whichever channel is most convenient for you.",
        tags: ['contact', 'phone', 'fax', 'email', 'address'],
      },
      {
        question: "Where is Paladin's office located?",
        answer:
          'Our office is located at 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003. We welcome visits during business hours (Monday–Friday, 9:00 AM – 5:00 PM) and are also available by phone and email for clients who prefer remote assistance.',
        tags: ['location', 'address', 'ventura', 'visit'],
      },
    ],
  },
];

const faqSectionAnchors = {
  'ABOUT PALADIN': 'about-paladin',
  'CONSULTATIONS & REQUESTS': 'consultations-requests',
  'WORKING WITH US': 'working-with-us',
  'CONTACT & OFFICE': 'contact-office',
};

function matchesQuery(item, q) {
  const inQuestion = item.question.toLowerCase().includes(q);
  const inAnswer = item.answer.toLowerCase().includes(q);
  const inTags = item.tags?.some((t) => t.toLowerCase().includes(q));
  return inQuestion || inAnswer || inTags;
}

export default function FAQ() {
  const [query, setQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqSections;
    return faqSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => matchesQuery(item, q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  const totalResults = useMemo(
    () => filteredSections.reduce((n, s) => n + s.items.length, 0),
    [filteredSections]
  );

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#010407]">
      <Header />

      <main className="flex-1">
        {/* Intro Section */}
        <section className="py-14 md:py-16 px-6 bg-[#F7F4EF] border-b border-[#e7dccb]">
          <div className="max-w-5xl mx-auto text-center">
            <p className="inline-flex items-center px-4 py-1 rounded-full bg-white text-[#012E72] text-xs font-semibold tracking-wide uppercase mb-3 border border-[#002DB5]/15 shadow-sm">
              Help Center
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#012E72] mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-[#010407]/80 max-w-3xl mx-auto leading-relaxed">
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
                  placeholder="Search questions (e.g. claims, consultation, office hours)"
                  className="w-full rounded-full bg-white border border-[#d8cbb8] px-5 py-3.5 text-sm md:text-base shadow-sm placeholder:text-[#010407]/45 focus:outline-none focus:ring-2 focus:ring-[#002DB5] focus:border-[#002DB5]"
                />
              </div>
              {query && (
                <p className="mt-2 text-xs text-[#010407]/65">
                  Showing {totalResults} result{totalResults === 1 ? '' : 's'} for "{query}".
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-14 md:py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            {filteredSections.map((section, sectionIndex) => (
              <div key={section.title} id={faqSectionAnchors[section.title]}>
                <h2 className="text-xs font-bold tracking-[0.2em] text-[#002DB5] mb-4 uppercase">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {section.items.map((item, itemIndex) => (
                    <details
                      key={`${section.title}-${item.question}`}
                      className="group bg-[#F7F4EF]/40 border border-[#e7dccb] rounded-2xl px-5 py-4 md:px-6 md:py-5 shadow-sm hover:shadow-md transition-shadow"
                      open={sectionIndex === 0 && itemIndex === 0 && !query}
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="text-sm md:text-base font-semibold text-[#012E72] pr-4">
                          {item.question}
                        </h3>
                        <span className="ml-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#002DB5]/25 text-[#002DB5] text-xs group-open:rotate-45 transition-transform bg-white">
                          +
                        </span>
                      </summary>
                      <div className="mt-2 text-xs md:text-sm text-[#010407]/80 leading-relaxed text-justify">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            {totalResults === 0 && (
              <p className="text-center text-[#010407]/65 text-xs md:text-sm mt-5">
                No questions matched your search. Try different keywords or browse the full list.
              </p>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-14 md:py-16 px-6 bg-[#012E72] text-white">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold">Still have questions?</h2>
            <p className="text-base md:text-lg text-[#F7F4EF] max-w-2xl mx-auto leading-relaxed">
              If you didn’t find the answer you were looking for, we’re here to help.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
              <Link
                to="/quote"
                className="bg-white text-[#012E72] px-7 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-md hover:bg-[#F7F4EF] transition-colors"
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
