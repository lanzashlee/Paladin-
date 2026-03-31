import React from 'react';
import { MapPin, Phone, Printer, Mail, Clock, Shield } from 'lucide-react';

function ContactInfo() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto w-full" id="contact">
      <div className="glass-panel rounded-[3rem] p-12 lg:p-16 flex flex-col lg:flex-row gap-16 relative overflow-hidden shadow-2xl shadow-blue-900/5 border border-white/60">
        
        {/* Decorative circle graphic */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl z-0 pointer-events-none"></div>

        {/* Left side: Content */}
        <div className="flex-1 relative z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0a0a0a] leading-tight mb-8">
            Connect with Paladin Support
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#0077b6] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Corporate Address</p>
                <p className="text-gray-600 mt-1 hover:text-[#0077b6] transition-colors"><a href="https://maps.google.com" target="_blank" rel="noreferrer">3787 Transport ST Suite A7 Box #5<br/>Ventura, CA 93003</a></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-[#0077b6]" />
              <p className="text-gray-600 font-medium"><a href="tel:8056926900" className="hover:text-[#0077b6] transition-colors">805-692-6900</a></p>
            </div>

            <div className="flex items-center gap-4">
              <Printer className="w-6 h-6 text-[#0077b6]" />
              <p className="text-gray-600 font-medium">805-830-1680 <span className="text-sm font-normal text-gray-400">(Fax)</span></p>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-[#0077b6]" />
              <p className="text-gray-600 font-medium"><a href="mailto:support@paladinbusinessservices.net" className="hover:text-[#0077b6] transition-colors">support@paladinbusinessservices.net</a></p>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200/60">
              <Shield className="w-6 h-6 text-[#0077b6]" />
              <p className="text-gray-600 text-sm">License #: <span className="font-medium text-[#0a0a0a]">6010043</span><br/>(CA, AZ, ID, IL, IN, NV, NC, OH, TX)</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-[#0077b6]" />
              <p className="text-gray-600 text-sm">Mon-Fri 09:00 am – 05:00 pm</p>
            </div>
          </div>
        </div>

        {/* Right side: Action block */}
        <div className="flex-1 flex flex-col justify-center items-start lg:items-end text-left lg:text-right relative z-10">
          <div className="bg-[#0a0a0a] text-white rounded-3xl p-10 w-full max-w-sm shadow-xl">
            <h3 className="text-2xl font-bold mb-2 text-center lg:text-right">Quick Payments</h3>
            <p className="text-gray-400 text-sm mb-8 text-center lg:text-right">Securely manage your policies and bills right from our portal.</p>
            
            <div className="flex flex-col gap-4">
              <a href="#" className="w-full text-center bg-[#0077b6] text-white py-3.5 rounded-full font-bold hover:bg-blue-600 transition-colors">
                Online Bill Pay
              </a>
              <a href="#" className="w-full text-center bg-transparent border border-gray-600 text-white py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors">
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
