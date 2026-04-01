import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Service() {
  const services = [
    {
      id: 'professional',
      title: 'Professional',
      image:
        'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
      summary:
        'Coverage for professionals, consultants, and office-based businesses against liability and claim costs.',
      details: [
        'Professional liability and E&O options',
        'General liability for day-to-day operations',
        'Flexible limits based on your contract requirements',
      ],
    },
    {
      id: 'commercial',
      title: 'Commercial',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      summary:
        'Smart protection packages for growing businesses, properties, and teams.',
      details: [
        'Business owner policies (BOP) and package options',
        'Commercial property and equipment coverage',
        'Workers compensation and umbrella support',
      ],
    },
    {
      id: 'landlord',
      title: 'Landlord',
      image:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
      summary:
        'Rental property coverage built for single-family, multi-unit, and investment properties.',
      details: [
        'Dwelling and structure coverage for rental homes',
        'Liability protection for landlord risks',
        'Loss of rental income endorsements available',
      ],
    },
    {
      id: 'contractors',
      title: 'Contractors',
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      summary:
        'Insurance solutions for contractors and trade professionals on every job size.',
      details: [
        'General liability for contractors and subcontractors',
        'Inland marine and tools/equipment options',
        'Bond support for licensing and bid requirements',
      ],
    },
    {
      id: 'watercraft',
      title: 'Watercraft',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      summary:
        'Boat and watercraft coverage for recreational and seasonal use.',
      details: [
        'Hull, liability, and medical payment options',
        'Trailer and gear coverage add-ons',
        'Protection for accidents on and off the water',
      ],
    },
    {
      id: 'auto-more',
      title: 'Auto and More',
      image:
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',
      summary:
        'Personal auto and specialty coverage options tailored to your lifestyle.',
      details: [
        'Personal auto with deductible and limit flexibility',
        'SR22, teen driver, and multi-vehicle options',
        'Bundle opportunities with home and renters policies',
      ],
    },
  ];

  const [activeServiceId, setActiveServiceId] = useState(services[0].id);
  const activeService = services.find((service) => service.id === activeServiceId);

  const handleCardClick = (serviceId) => {
    setActiveServiceId(serviceId);

    const infoSection = document.getElementById('service-information');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Header />

      <main className="pt-10 pb-20 px-5 md:px-8 max-w-7xl mx-auto w-full">
        <section className="mb-12 text-center">
          <div className="flex items-center justify-center gap-6 mb-2">
            <span className="h-px w-14 bg-gray-600" aria-hidden="true" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] leading-tight">
              Welcome To Paladin Professional Insurance Solutions
            </h1>
            <span className="h-px w-14 bg-gray-600" aria-hidden="true" />
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Select a service to view coverage highlights and learn how we can customize your policy.
          </p>
        </section>

        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const isActive = service.id === activeServiceId;

              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => handleCardClick(service.id)}
                  className={`relative min-h-[290px] md:min-h-[320px] overflow-hidden rounded-sm text-left transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                    isActive ? 'ring-4 ring-[#0077b6]' : 'ring-1 ring-black/5'
                  }`}
                  aria-pressed={isActive}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/15" />
                  <div className="relative h-full p-6 flex items-end">
                    <h3 className="text-white font-extrabold text-4xl md:text-5xl leading-none drop-shadow-sm">
                      {service.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {activeService && (
          <section id="service-information" className="mb-16 scroll-mt-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#111111] mb-2">
                    {activeService.title}
                  </h2>
                  <p className="text-gray-700 max-w-3xl">{activeService.summary}</p>
                </div>
                <a
                  href="/quote"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#0077b6] text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get a Quote
                </a>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeService.details.map((detail) => (
                  <li
                    key={detail}
                    className="rounded-xl bg-[#f4f9ff] border border-blue-100 px-4 py-3 text-sm text-gray-700"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Service;
