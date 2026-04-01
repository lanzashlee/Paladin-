import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactInfo from '../components/ContactInfo';
import { Send } from 'lucide-react';

function Contact() {
  return (
    <>
      <Header />
      
      <main className="pt-16 pb-24 px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-[#0077b6] text-xs font-semibold tracking-widest uppercase mb-4">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0a0a0a] tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about a policy, need a quote, or want to say hello? 
            Fill out the form below or reach out to us directly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Contact Form */}
          <div className="flex-1 glass-panel rounded-3xl p-10 shadow-xl shadow-blue-900/5">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Send us a Message</h2>
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="John Doe"
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077b6]/50 focus:border-[#0077b6] transition-colors"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="john@example.com"
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077b6]/50 focus:border-[#0077b6] transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  placeholder="How can we help?"
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077b6]/50 focus:border-[#0077b6] transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</label>
                <textarea 
                  id="message"
                  rows="5"
                  placeholder="Type your message here..."
                  className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077b6]/50 focus:border-[#0077b6] transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="mt-2 inline-flex items-center justify-center gap-2 bg-[#0077b6] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Contact Information (Imported Component) */}
          <div className="flex-1">
             {/* Re-using ContactInfo but wrapped to remove its inner paddings/margins to fit here, or we can just render the raw HTML if we don't want the section wrapper. For simplicity, we just render it. Note: ContactInfo has py-24 px-8 max-w-7xl by default, which might be too large here. I'll modify ContactInfo to accept className props or just render it outside the flex container. */}
          </div>
        </div>
      </main>

      {/* Render ContactInfo below the form instead of side-by-side to preserve its existing layout since it acts as a full section */}
      <div className="mt-[-8rem]">
        <ContactInfo />
      </div>

      <Footer />
    </>
  );
}

export default Contact;
