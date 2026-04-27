import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import InsuranceLines from '../components/InsuranceLines';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import Team from '../components/Team';
import OfficeHours from '../components/OfficeHours';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';
import MapLocation from '../components/MapLocation';
import Carriers from '../components/Carriers';
import TestimonialsPreview from '../components/TestimonialsPreview';

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <AboutSection />
      <InsuranceLines />
      <WhyChooseUs />
      <Carriers showViewPartnersButton featuredOnly />
      {/* <FeaturedProducts /> */}
      <TestimonialsPreview />
      <Team />
      <OfficeHours />
      <ContactInfo />
      <MapLocation />
      <section className="py-14 md:py-16 px-6 bg-[#012E72] text-white">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-extrabold">Still have questions?</h2>
          <p className="text-base md:text-lg text-[#F7F4EF] max-w-2xl mx-auto leading-relaxed">
            If you didn&apos;t find the answer you were looking for, we&apos;re here to help.
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
      <Footer />
    </>
  );
}

export default Home;
