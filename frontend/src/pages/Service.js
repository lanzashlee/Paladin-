import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const insuranceLines = [
  {
    badge: 'P',
    title: 'Professional Insurance',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    description:
      'Designed for licensed professionals, consultants, and service providers. Professional Liability (Errors & Omissions) protects you from claims of negligence, mistakes, or failure to deliver services as promised. Ideal for doctors, lawyers, accountants, real estate agents, IT professionals, and more.',
    details: [
      'Professional Liability (Errors & Omissions) coverage',
      'Claims of negligence, mistakes, or failure to deliver services as promised',
      'Ideal for doctors, lawyers, accountants, real estate agents, IT professionals, and more',
    ],
  },
  {
    badge: 'C',
    title: 'Commercial Insurance',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description:
      'A comprehensive category of coverage built for businesses of all sizes. Commercial insurance bundles essential protections including property, liability, and business interruption into tailored policies that keep your operations running even when the unexpected happens.',
    details: [
      'Includes property, liability, and business interruption',
      'Tailored policies for businesses of all sizes',
      'Helps keep operations running when the unexpected happens',
    ],
  },
  {
    badge: 'L',
    title: 'Landlord Insurance',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    description:
      'Purpose-built for property owners who rent out residential or commercial spaces. Covers your building structure, loss of rental income, liability for tenant injuries, and damages caused by tenants giving you confidence to lease your properties without worry.',
    details: [
      'Covers building structure and rental income',
      'Helps with liability for tenant injuries',
      'Addresses damages caused by tenants',
    ],
  },
  {
    badge: 'Co',
    title: 'Contractors Insurance',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    description:
      'Contractors face unique on-site risks every day. Our contractors insurance covers general liability, tools and equipment, completed operations, and workers compensation protecting both your crew and your business from accidents, property damage, or third-party claims on the job.',
    details: [
      'General liability, tools and equipment, and completed operations',
      'Workers compensation protection for your crew',
      'Helps with accidents, property damage, and third-party claims',
    ],
  },
  {
    badge: 'W',
    title: 'Watercraft Insurance',
    image:
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80',
    description:
      'Whether you own a fishing boat, a personal watercraft, or a luxury yacht, watercraft insurance provides protection on and off the water. Coverage typically includes physical damage to the vessel, liability for injuries or property damage, fuel spill liability, and storage or transit coverage.',
    details: [
      'Physical damage to the vessel',
      'Liability for injuries or property damage',
      'Fuel spill, storage, and transit coverage',
    ],
  },
  {
    badge: 'A',
    title: 'Auto Insurance',
    image:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    description:
      'From personal vehicles to full commercial fleets, our auto insurance solutions are designed to fit your driving needs. Coverage options include liability, collision, comprehensive, uninsured motorist, and medical payments ensuring you and your passengers are protected on every journey.',
    details: [
      'Liability, collision, and comprehensive coverage',
      'Uninsured motorist and medical payments options',
      'Built for personal vehicles and commercial fleets',
    ],
  },
];

const coverageOfferings = [
  {
    number: '01',
    title: 'General Liability',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    description:
      'Protects businesses from financial loss due to third-party claims for bodily injury, property damage, and certain types of personal injury. Our policies offer broad coverage and 24/7 assistance.',
    details: [
      'Third-party bodily injury and property damage coverage',
      'Broad coverage and 24/7 assistance',
      'Useful for storefronts, offices, and service businesses',
    ],
  },
  {
    number: '02',
    title: 'Renters Insurance',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    description:
      'Protect your belongings and liability as a renter. Our policies cover theft, fire, water damage, and more tailored to your specific rental situation.',
    details: [
      'Covers theft, fire, water damage, and more',
      'Protects your belongings and liability as a renter',
      'Tailored to your specific rental situation',
    ],
  },
  {
    number: '03',
    title: 'Umbrella Insurance',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    description:
      'Get additional liability coverage beyond your existing policies. Our umbrella insurance provides extra protection for your assets and peace of mind when standard limits are not enough.',
    details: [
      'Additional liability coverage beyond existing policies',
      'Extra protection for your assets and peace of mind',
      'Useful when standard limits are not enough',
    ],
  },
  {
    number: '04',
    title: "Workers' Compensation",
    image:
      'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1200&q=80',
    description:
      "Workers' compensation insurance provides financial support and medical benefits to employees injured or ill due to their job, covering medical expenses, lost wages, rehabilitation costs, and death benefits for dependents.",
    details: [
      'Medical expenses, lost wages, and rehabilitation costs',
      'Financial support for employees injured or ill due to their job',
      'Death benefits for dependents',
    ],
  },
  {
    number: '05',
    title: 'Flood Insurance',
    image:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    description:
      'Protect your home and belongings from flood damage caused by natural disasters, burst pipes, and other water-related incidents. We help identify your flood risk and find the right level of coverage.',
    details: [
      'Flood damage caused by natural disasters and burst pipes',
      'Helps identify your flood risk',
      'Find the right level of coverage',
    ],
  },
  {
    number: '06',
    title: 'Commercial Auto Insurance',
    image:
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1200&q=80',
    description:
      'Protects against financial losses from accidents, property damage, and liability claims involving business vehicles including bodily injury, property damage, theft, vandalism, and legal costs.',
    details: [
      'Bodily injury, property damage, theft, and vandalism',
      'Legal costs and damages if your business is held responsible',
      'Designed for business vehicles',
    ],
  },
  {
    number: '07',
    title: 'Cyber Liability Insurance',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    description:
      'Designed to protect businesses from financial losses stemming from cyberattacks and data breaches, covering data recovery, legal fees, and notification expenses required by data protection laws.',
    details: [
      'Financial losses from cyberattacks and data breaches',
      'Data recovery, legal fees, and notification expenses',
      'Helpful for businesses handling sensitive data',
    ],
  },
  {
    number: '08',
    title: 'Earthquake Insurance',
    image:
      'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=1200&q=80',
    description:
      'A specialized form of property coverage designed to protect against the financial impact of earthquake damage. Unlike standard homeowners or commercial policies that exclude seismic events, earthquake insurance provides coverage for repairs or rebuilding costs resulting from seismic activity.',
    details: [
      'Coverage for repairs or rebuilding costs',
      'Protection against the financial impact of earthquake damage',
      'Useful where seismic events are excluded by standard policies',
    ],
  },
  {
    number: '09',
    title: 'Commercial Insurance',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description:
      'A crucial safeguard for businesses offering protection against a wide array of financial risks that can arise from everyday operations. This type of insurance encompasses policies designed to cover liabilities, property damage, employee injuries, and other potential losses.',
    details: [
      'Protection against liabilities, property damage, and employee injuries',
      'Covers a wide array of financial risks',
      'Designed for everyday business operations',
    ],
  },
];

function SectionHeader({ eyebrow, title, description, dark = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
      <p
        className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.22em] uppercase border ${
          dark
            ? 'bg-white/10 text-[#F7F4EF] border-white/20'
            : 'bg-[#F7F4EF] text-[#002DB5] border-[#d8cbb8]'
        }`}
      >
        {eyebrow}
      </p>
      <h2 className={`mt-5 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${dark ? 'text-white' : 'text-[#012E72]'}`}>
        {title}
      </h2>
      <p className={`mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-justify ${dark ? 'text-[#F7F4EF]' : 'text-[#010407]/75'}`}>
        {description}
      </p>
    </div>
  );
}

function InsuranceLineCard({ item }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[#e7dccb] bg-white min-h-[280px] group shadow-xl shadow-[#012E72]/5">
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/20 via-transparent to-[#F7F4EF]/70" aria-hidden="true" />
        <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white border border-[#d8cbb8] flex items-center justify-center shrink-0 shadow-md">
          <span className="text-[#012E72] text-sm font-black">{item.badge}</span>
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex h-full flex-col">
        <div className="flex items-center justify-end gap-4 mb-3">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#002DB5] font-semibold">Insurance Line</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#012E72] mb-2 group-hover:text-[#002DB5] transition-colors">
          {item.title}
        </h3>
        <p className="text-[#010407]/75 text-xs sm:text-sm leading-relaxed text-justify">
          {item.description}
        </p>

        <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#010407]/80 text-justify">
          {item.details.map((detail) => (
            <li key={detail} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#002DB5] shrink-0" aria-hidden="true" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function CoverageCard({ item }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-[#e7dccb] bg-white p-5 sm:p-6 flex flex-col gap-3 group min-h-[280px] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#002DB5]/10 transition-all duration-300 shadow-lg shadow-[#012E72]/5">
      <div className="relative h-40 -m-5 mb-4 sm:-m-6 sm:mb-5 overflow-hidden rounded-t-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.image})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#012E72]/15 via-transparent to-[#F7F4EF]/75" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-[#F7F4EF] border border-[#d8cbb8] flex items-center justify-center shadow-md shadow-[#012E72]/10 shrink-0">
          <span className="text-[#012E72] text-sm font-black">{item.number}</span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#002DB5] font-semibold">Featured</span>
      </div>

      <h3 className="relative z-10 text-lg sm:text-xl font-bold text-[#012E72] group-hover:text-[#002DB5] transition-colors">
        {item.title}
      </h3>
      <p className="relative z-10 text-[#010407]/75 text-xs sm:text-sm leading-relaxed text-justify">
        {item.description}
      </p>

      <ul className="relative z-10 mt-1 space-y-2 text-xs sm:text-sm text-[#010407]/80 text-justify">
        {item.details.map((detail) => (
          <li key={detail} className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#002DB5] shrink-0" aria-hidden="true" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CoverageSectionHeader() {
  return (
    <div className="relative z-10 text-center mb-16">
      <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F7F4EF] text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-5 border border-[#d8cbb8] shadow-sm">
        Coverage Portfolio
      </p>
      <h2 className="text-4xl sm:text-5xl font-extrabold text-[#012E72] tracking-tight mb-4">
        Coverage Offerings
      </h2>
      <p className="text-base sm:text-lg text-[#010407]/75 max-w-3xl mx-auto leading-relaxed text-justify">
        Explore the same coverage portfolio styling used on the homepage, with the individual
        offerings shown as a unified card grid.
      </p>
    </div>
  );
}

function Service() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <section className="relative bg-[#F7F4EF] py-20 md:py-24 overflow-hidden border-y border-[#e7dccb]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#002DB5]/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="What We Cover"
              title="Our Insurance Lines"
              description="Paladin serves a wide range of clients across multiple insurance lines. Each card below is presented up front so the full structure stays clear and consistent."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {insuranceLines.map((item) => (
                <InsuranceLineCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-24 overflow-hidden bg-white w-full" id="coverage-offerings">
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[760px] h-[300px] rounded-full bg-[#002DB5]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 w-[360px] h-[360px] rounded-full bg-[#F7F4EF] blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
            <CoverageSectionHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {coverageOfferings.map((item) => (
                <CoverageCard key={item.title} item={item} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 bg-[#012E72] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Service;

