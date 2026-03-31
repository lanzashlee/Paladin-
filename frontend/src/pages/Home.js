import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Header />
      <Hero />
      
      {/* Welcome Block built with Tailwind */}
      <section className="py-20 px-8">
        <div className="glass-panel max-w-4xl mx-auto rounded-3xl p-10 text-center shadow-xl shadow-blue-500/5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0077b6] tracking-tight mb-6">
            Welcome To Paladin Professional <br className="hidden md:block"/> Insurance Solutions
          </h2>
          <div className="text-sm md:text-base text-[#0a0a0a] font-medium flex flex-wrap justify-center items-center gap-x-2 gap-y-3 leading-relaxed max-w-3xl mx-auto mb-8">
            <span className="font-bold text-[#0077b6]">Professional</span>
            <span className="text-gray-300">#</span>
            <span className="font-bold text-[#0077b6]">Commercial</span>
            <span className="text-gray-300">#</span>
            <span className="font-bold text-[#0077b6]">Landlord</span>
            <span className="text-gray-300">#</span>
            <span className="font-bold text-[#0077b6]">Contractors</span>
            <span className="text-gray-300">#</span>
            <span className="font-bold text-[#0077b6]">Watercraft</span>
            <span className="text-gray-300">#</span>
            <span className="font-bold text-[#0077b6]">Auto</span>
            <span className="text-gray-600">and More</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="bg-[#0a0a0a] text-white w-full sm:w-auto px-8 py-3 rounded-full font-bold shadow hover:bg-gray-800 transition-colors">
              Get Quote Today
            </a>
            <a href="tel:8056926900" className="bg-transparent border border-[#0a0a0a] text-[#0a0a0a] w-full sm:w-auto px-8 py-3 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors">
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <FeaturedProducts />
      <WhyChooseUs />
      <ContactInfo />
      <Footer />
    </>
  );
}

export default Home;
