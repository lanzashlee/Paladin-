import React from 'react';
import { MapPin, Phone, Printer, Mail } from 'lucide-react';

function ContactInfo() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto w-full" id="contact-location">
      <div className="rounded-[3rem] p-12 lg:p-16 flex flex-col lg:flex-row gap-16 relative overflow-hidden bg-white border border-[#e7dccb] shadow-2xl shadow-[#012E72]/5">
        
        {/* Decorative circle graphic */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#002DB5]/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

        {/* Left side: Content */}
        <div className="flex-1 relative z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#012E72] leading-tight mb-8">
            Contact & Location
          </h2>
          <p className="text-[#010407]/80 leading-relaxed mb-8 max-w-2xl">
            We'd love to hear from you. Reach out to us through any of the channels below - our
            licensed agents are ready to assist.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#002DB5] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#010407]/75 font-medium mt-1 hover:text-[#002DB5] transition-colors"><a href="https://maps.google.com" target="_blank" rel="noreferrer">3787 Transport ST Suite A7 Box #5<br/>Ventura, CA 93003</a></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-[#002DB5]" />
              <p className="text-[#010407]/75 font-medium"><a href="tel:8056926900" className="hover:text-[#002DB5] transition-colors">805-692-6900</a></p>
            </div>

            <div className="flex items-center gap-4">
              <Printer className="w-6 h-6 text-[#002DB5]" />
              <p className="text-[#010407]/75 font-medium">805-830-1680</p>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-[#002DB5]" />
              <p className="text-[#010407]/75 font-medium"><a href="mailto:support@paladinbusinessservices.net" className="hover:text-[#002DB5] transition-colors">support@paladinbusinessservices.net</a></p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#002DB5]" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M22 12.06C22 6.488 17.523 2 12 2 6.477 2 2 6.488 2 12.06c0 5.026 3.657 9.197 8.438 9.944v-7.031H8.078v-2.913h2.36V9.845c0-2.335 1.388-3.626 3.514-3.626.999 0 2.043.178 2.043.178v2.27h-1.151c-1.135 0-1.489.708-1.489 1.434v1.72h2.533l-.405 2.913h-2.128v7.031C18.343 21.257 22 17.086 22 12.06Z" />
                </svg>
              </span>
              <p className="text-[#010407]/75 font-medium"><a href="#" className="hover:text-[#002DB5] transition-colors">Paladin Professional Insurance Solutions</a></p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#002DB5]" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-2.75a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z" />
                </svg>
              </span>
              <p className="text-[#010407]/75 font-medium"><a href="#" className="hover:text-[#002DB5] transition-colors">@paladin.insurance</a></p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#002DB5]" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.339 17.338H6.169V10h2.17Zm-1.085-8.274a1.258 1.258 0 1 1 1.257-1.258 1.257 1.257 0 0 1-1.257 1.258Zm10.079 8.274h-2.169v-3.6c0-.86-.015-1.967-1.198-1.967-1.2 0-1.384.936-1.384 1.905v3.662H10.313V10h2.083v1.005h.03a2.284 2.284 0 0 1 2.058-1.133c2.2 0 2.606 1.448 2.606 3.33Z" />
                </svg>
              </span>
              <p className="text-[#010407]/75 font-medium"><a href="#" className="hover:text-[#002DB5] transition-colors">Paladin Professional Insurance Solutions</a></p>
            </div>
          </div>
        </div>

        {/* Right side: Action block */}
        <div className="flex-1 flex flex-col justify-center items-start lg:items-end text-left lg:text-right relative z-10">
          <div className="bg-[#012E72] text-white rounded-3xl p-10 w-full max-w-sm shadow-xl shadow-[#012E72]/15">
            <h3 className="text-2xl font-bold mb-2 text-center lg:text-center">Quick Payments</h3>
            <p className="text-[#F7F4EF] text-sm mb-8 text-center lg:text-center">Securely manage your policies and bills right from our portal.</p>
            
            <div className="flex flex-col gap-4">
              <a href="#" className="w-full text-center bg-white text-[#012E72] py-3.5 rounded-full font-bold hover:bg-[#F7F4EF] transition-colors">
                Online Bill Pay
              </a>
              <a href="#" className="w-full text-center bg-transparent border border-white/60 text-white py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors">
                e-Pay Now
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default ContactInfo;
