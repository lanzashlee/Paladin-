import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import InsuranceLines from '../components/InsuranceLines';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
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
      <Carriers />
      <FeaturedProducts />
      <WhyChooseUs />
      <TestimonialsPreview />
      <OfficeHours />
      <ContactInfo />
      <MapLocation className="pt-0 -mt-10" />
      <Footer />
    </>
  );
}

export default Home;
