import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhyChooseUs from '../components/WhyChooseUs';

import TeamMember1 from '../assets/team_member_1_1774940222890.png';
import TeamMember2 from '../assets/team_member_2_1774940252257.png';
import TeamMember3 from '../assets/team_member_3_1774940454549.png';

export default function About() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0077b6]/80 to-[#0a0a0a] z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white mt-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
            Building trust and protecting futures through expert insurance solutions.
          </p>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#0077b6] text-sm font-bold mb-6">
              <Building2 className="w-4 h-4" />
              <span>Company Overview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a0a0a] mb-8 leading-tight">
              A Legacy of <br/><span className="text-[#0077b6]">Protection & Trust</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6 font-medium text-justify">
              Paladin Business Services was founded with a singular purpose: to provide unparalleled protection for individuals, families, and businesses. We started as an independent agency driven by the core belief that every client deserves personalized attention and comprehensive coverage at competitive rates.
            </p>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium text-justify">
              Over the years, we've grown into a trusted community partner, expanding our expertise across professional liability, commercial coverage, and personal insurance. Our journey has always been guided by our commitment to acting as a true "Paladin" – a steadfast champion for our clients' security and peace of mind.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
             <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Modern Office" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 flex items-end p-8">
                  <div className="text-white">
                    <p className="text-2xl font-bold">Paladin Headquarters</p>
                    <p className="font-medium text-white/80">Where focus meets dedication</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 rounded-[2rem] border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-[#0077b6]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-[#0077b6] group-hover:text-white transition-colors duration-300">
                <Target className="w-10 h-10 text-[#0077b6] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-4xl font-extrabold text-[#0a0a0a] mb-6">Our Mission</h3>
              <p className="text-gray-600 text-xl leading-relaxed font-medium text-justify">
                Our mission is to provide you with the quality service and care you deserve. We understand the unique challenges of owning and operating a business, which is why we’re committed to hassle-free insurance service built around your needs. With agents who bring 20+ years of experience in the insurance industry, we take pride in being reliable advocates—delivering clear guidance, responsive support, and peace of mind every step of the way.
              </p>
            </div>
            
            <div className="p-12 rounded-[2rem] border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-[#0077b6]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-[#0077b6] group-hover:text-white transition-colors duration-300">
                <Lightbulb className="w-10 h-10 text-[#0077b6] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-4xl font-extrabold text-[#0a0a0a] mb-6">Our Vision</h3>
              <p className="text-gray-600 text-xl leading-relaxed font-medium text-justify">
                To set the industry standard for integrity and client care in the insurance marketplace. We envision a future where navigating insurance is simple and transparent, allowing businesses and individuals to thrive with absolute confidence in their security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* The Team Section */}
      <section className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a0a0a] mb-4">Meet The Team</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium text-center">
              Dedicated professionals committed to securing what matters most to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Michael Sterling", role: "Founder & Principal Broker", bio: "With over 20 years in the industry, Michael founded Paladin to bring a higher standard of care to commercial insurance.", img: TeamMember1 },
              { name: "Sarah Jenkins", role: "Head of Client Relations", bio: "Sarah ensures every client receives the personalized, attentive service that Paladin is universally known for.", img: TeamMember2 },
              { name: "David Chen", role: "Senior Risk Analyst", bio: "David specializes in designing tailored liability strategies for both emerging businesses and established enterprises.", img: TeamMember3 },
            ].map((member, idx) => (
              <div key={idx} className="group text-center bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-48 h-48 mx-auto rounded-[2rem] overflow-hidden mb-8 shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-2xl font-bold text-[#0a0a0a] mb-2">{member.name}</h3>
                <p className="text-[#0077b6] font-bold text-lg mb-4">{member.role}</p>
                <p className="text-gray-500 leading-relaxed font-medium text-justify">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80')] opacity-10 mix-blend-overlay object-cover"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">Ready to Experience the Paladin Difference?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed font-medium">
            Let our experienced team formulate a protection strategy uniquely tailored for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/service" className="bg-white text-[#0077b6] px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-2xl">
              Learn More About Our Services
            </Link>
            <Link to="/quote" className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              Contact Us For a Quote
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
