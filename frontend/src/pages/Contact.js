import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactInfo from '../components/ContactInfo';
import MapLocation from '../components/MapLocation';
import { Send } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email Address is required.';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // Placeholder success flow until API integration is added.
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const requestCards = [
    {
      title: 'Personalized Consultation',
      desc: 'Do you need proper and affordable coverage? Request a consultation now to have a personalized insurance plan that fits your specific needs.',
      cta: 'Request',
    },
    {
      title: 'Request Proof of Insurance',
      desc: 'Request proof of insurance below! One of our licensed agents will send it out as soon as possible.',
      cta: 'Request',
    },
    {
      title: 'Policy Change',
      desc: 'Do you need to make any changes to your existing policy? Submit your request below and we will update your policy accordingly.',
      cta: 'Request',
    },
    {
      title: 'Update Contact Info',
      desc: 'Request a policy update information on an existing policy below.',
      cta: 'Request',
    },
    {
      title: 'Report a Claim',
      desc: 'Report a claim below. One of our licensed agents will contact you shortly to provide personalized service throughout the claim process.',
      cta: 'Report',
    },
    {
      title: 'Request a Call',
      desc: 'Do you need further assistance? Request a call below and one of our licensed agents will reach out to you promptly.',
      cta: 'Request',
    },
  ];

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
          {/* Left: Contact Image */}
          <div className="flex-1">
            <img 
              src="https://cdn.lorex.com/images/articles/content/CostcoNext/CostcoNext-Contact.jpg" 
              alt="Contact us" 
              className="w-full h-full rounded-3xl shadow-lg shadow-blue-900/10 object-cover scale-x-[-1]"
            />
          </div>

          {/* Right: Contact Form */}
          <div className="flex-1 glass-panel rounded-3xl p-8 shadow-xl shadow-blue-900/5">
            <h2 className="text-2xl font-bold text-[#0a0a0a] mb-6">Send us a Message</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:ring-[#0077b6]/50 focus:border-[#0077b6]'
                  }`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:ring-[#0077b6]/50 focus:border-[#0077b6]'
                  }`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errors.subject
                      ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:ring-[#0077b6]/50 focus:border-[#0077b6]'
                  }`}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message"
                  rows="5"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:ring-[#0077b6]/50 focus:border-[#0077b6]'
                  }`}
                ></textarea>
                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
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
        </div>

        {/* Service Request Cards Section */}
        <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f7fbff] to-white px-5 py-14 sm:px-8 sm:py-16">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[620px] h-[240px] rounded-full bg-[#0077b6]/10 blur-3xl" />

          <div className="relative text-center mb-12">
            <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0077b6]/10 text-[#0077b6] text-xs font-semibold tracking-widest uppercase mb-4 border border-[#0077b6]/15">
              Quick Actions
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a] tracking-tight mb-3">
              How Can We Help You Today?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
              Pick a request below and our licensed team will respond as quickly as possible.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestCards.map((card, index) => (
              <article
                key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-[#0077b6]/10 bg-white/85 backdrop-blur-sm p-7 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0077b6]/[0.03] via-transparent to-[#0077b6]/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative mb-4 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-[#0077b6]/10 text-[#0077b6] border border-[#0077b6]/20 px-3 text-xs font-black tracking-wide">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <h3 className="relative text-xl font-bold text-[#0a0a0a] mb-3">{card.title}</h3>
                <p className="relative text-gray-600 text-sm leading-relaxed mb-6 flex-1 text-justify">
                  {card.desc}
                </p>

                <button className="relative inline-flex items-center justify-center gap-2 bg-[#0077b6] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5">
                  {card.cta}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Render ContactInfo below the form instead of side-by-side to preserve its existing layout since it acts as a full section */}
      <div className="mt-[-8rem]">
        <ContactInfo />
      </div>

      <MapLocation className="pt-0 -mt-10" />

      <Footer />
    </>
  );
}

export default Contact;
