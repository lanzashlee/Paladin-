import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { servicesById } from '../data/servicesData';

const serviceCategories = [
  {
    id: 'professional',
    title: 'Professional',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    description: 'Essential coverage solutions for professionals and office-based businesses.',
    serviceIds: ['general-liability', 'renters-insurance', 'umbrella-insurance'],
  },
  {
    id: 'commercial',
    title: 'Commercial',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Business-focused protection for operations, assets, and digital risk.',
    serviceIds: ['commercial-insurance', 'commercial-auto-insurance', 'cyber-liability-insurance'],
  },
  {
    id: 'landlord',
    title: 'Landlord',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Property and liability options for owners, rentals, and income properties.',
    serviceIds: ['renters-insurance', 'flood-insurance', 'umbrella-insurance'],
  },
  {
    id: 'contractors',
    title: 'Contractors',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    description: 'Coverage combinations that fit trade and project-based exposures.',
    serviceIds: ['workers-compensation', 'general-liability', 'commercial-auto-insurance'],
  },
  {
    id: 'watercraft',
    title: 'Watercraft',
    image:
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80',
    description: 'Liability and extended protection options for boating-related risks.',
    serviceIds: ['umbrella-insurance', 'flood-insurance', 'general-liability'],
  },
  {
    id: 'auto-and-more',
    title: 'Auto and More',
    image:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    description: 'Vehicle and added liability coverage for personal and business needs.',
    serviceIds: ['commercial-auto-insurance', 'umbrella-insurance', 'commercial-insurance'],
  },
];

function ServiceCard({ category, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className="group block w-full text-left"
      aria-label={`View details for ${category.title}`}
      aria-pressed={isSelected}
    >
      <article
        className={`h-full rounded-sm overflow-hidden bg-white transition-transform duration-200 hover:-translate-y-1 ${
          isSelected ? 'ring-4 ring-[#0a3b73]' : ''
        }`}
      >
        <div className="border border-gray-200 mb-3 overflow-hidden relative h-[280px] md:h-[320px]">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 p-4 md:p-5 flex items-center justify-center">
            <h3 className="text-white text-4xl md:text-5xl font-bold leading-none text-center">
              {category.title}
            </h3>
          </div>
        </div>
      </article>
    </button>
  );
}

function ServicesGrid({ categories, selectedCategoryId, onSelectCategory }) {
  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {categories.map((category) => (
          <ServiceCard
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onSelect={onSelectCategory}
          />
        ))}
      </div>
    </section>
  );
}

function ServiceDetail({ category, services, onBack }) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center text-sm font-semibold text-[#0a3b73] hover:text-[#06284d]"
        >
          Back to all services
        </button>
      </div>

      <div className="mb-8">
        <p className="text-xs md:text-sm tracking-[0.18em] uppercase text-gray-600 mb-3">
          {category.title}
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111] mb-3">
          Protect What Matters Most
        </h2>
        <p className="text-gray-700 leading-relaxed">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <article key={service.id} className="h-full">
            <p className="text-xs md:text-sm tracking-[0.18em] uppercase text-[#111111] mb-3 font-semibold">
              {service.title}
            </p>

            <div className="border-4 border-[#0a3b73] mb-3 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-44 md:h-48 object-cover"
              />
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{service.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <Link
          to="/quote"
          className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#0a3b73] text-white font-semibold hover:bg-[#06284d] transition-colors"
        >
          Request a Quote
        </Link>
      </div>
    </section>
  );
}

function Service() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const selectedCategory =
    serviceCategories.find((category) => category.id === selectedCategoryId) || null;
  const selectedServices = selectedCategory
    ? selectedCategory.serviceIds.map((serviceId) => servicesById[serviceId]).filter(Boolean)
    : [];

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);

    const detailSection = document.getElementById('service-detail-screen');
    if (detailSection) {
      detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearSelection = () => {
    setSelectedCategoryId(null);
  };

  return (
    <>
      <Header />

      <main className="pt-10 pb-20 px-5 md:px-8 max-w-7xl mx-auto w-full">
        <section className="mb-12 text-center">
          <div className="flex items-center justify-center gap-6 mb-2">
            <span className="h-px w-14 bg-gray-600" aria-hidden="true" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#111111] leading-tight max-w-4xl">
              Welcome To Paladin Professional Insurance Solutions
            </h1>
            <span className="h-px w-14 bg-gray-600" aria-hidden="true" />
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Choose a service card and the full details will appear below on this same page.
          </p>
        </section>

        <ServicesGrid
          categories={serviceCategories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {selectedCategory && selectedServices.length > 0 && (
          <section id="service-detail-screen" className="scroll-mt-24">
            <ServiceDetail
              category={selectedCategory}
              services={selectedServices}
              onBack={handleClearSelection}
            />
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Service;

