import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactInfo from '../components/ContactInfo';
import MapLocation from '../components/MapLocation';
import { Send } from 'lucide-react';
import ConsultationRequestForm from '../components/ConsultationRequestForm';
import DocumentRequestForm from '../components/DocumentRequestForm';
import PolicyChangeForm from '../components/PolicyChangeForm';
import UpdateContactInfoForm from '../components/UpdateContactInfoForm';
import ClaimReportForm from '../components/ClaimReportForm';
import CallRequestForm from '../components/CallRequestForm';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const EMAIL_REGEX = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const isValidEmailFormat = (emailValue = '') => {
  const email = String(emailValue).trim();
  if (!email || !EMAIL_REGEX.test(email)) {
    return false;
  }

  const [localPart = '', domainPart = ''] = email.split('@');

  // Disallow consecutive dots or dot-at-edges in local/domain parts.
  if (
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    domainPart.startsWith('.') ||
    domainPart.endsWith('.') ||
    domainPart.includes('..')
  ) {
    return false;
  }

  return true;
};

function Contact() {
  const location = useLocation();
  const [activeRequest, setActiveRequest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!isValidEmailFormat(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Please provide a little more detail (min 15 characters).';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (isSubmitted) {
      setIsSubmitted(false);
    }

    if (submitError) {
      setSubmitError('');
    }

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    setSubmitError('');

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to send message right now.');
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Unable to send message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestCards = [
    {
      id: 'consultation',
      title: 'Personalized Consultation',
      desc: 'Do you need proper and affordable coverage? Request a consultation now to have a personalized insurance plan that fits your specific needs.',
      cta: 'Request',
      component: ConsultationRequestForm,
    },
    {
      id: 'documents',
      title: 'Request Proof of Insurance or Other Documents',
      desc: 'Request proof of insurance below! One of our licensed agents will send it out as soon as possible.',
      cta: 'Request',
      component: DocumentRequestForm,
    },
    {
      id: 'policy-change',
      title: 'Policy Change',
      desc: 'Do you need to make any changes to your existing policy? Submit your request below and we will update your policy accordingly.',
      cta: 'Request',
      component: PolicyChangeForm,
    },
    {
      id: 'update-info',
      title: 'Update Contact Info or Other Insured Items',
      desc: 'Request a policy update information on an existing policy below.',
      cta: 'Request',
      component: UpdateContactInfoForm,
    },
    {
      id: 'claim',
      title: 'Report a Claim',
      desc: 'Report a claim below. One of our licensed agents will contact you shortly to provide personalized service throughout the claim process.',
      cta: 'Report',
      component: ClaimReportForm,
    },
    {
      id: 'call',
      title: 'Request a Call',
      desc: 'Do you need further assistance? Request a call below and one of our licensed agents will reach out to you promptly.',
      cta: 'Request',
      component: CallRequestForm,
    },
  ];

  const activeCard = requestCards.find((card) => card.id === activeRequest);
  const ActiveRequestForm = activeCard?.component;

  useEffect(() => {
    const requestAliases = {
      consultation: 'consultation',
      documents: 'documents',
      'document-request': 'documents',
      'policy-change': 'policy-change',
      'update-info': 'update-info',
      'update-contact-info': 'update-info',
      claim: 'claim',
      'claim-report': 'claim',
      call: 'call',
      'call-request': 'call',
    };

    const params = new URLSearchParams(location.search);
    const requestFromQuery = String(params.get('request') || '').trim().toLowerCase();
    const mappedRequest = requestAliases[requestFromQuery];

    if (mappedRequest) {
      setActiveRequest(mappedRequest);

      const quickActionsSection = document.getElementById('quick-actions');
      if (quickActionsSection) {
        setTimeout(() => {
          quickActionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }
    }

    const handleOpenRequest = (event) => {
      const incomingRequest = String(event?.detail?.requestId || '').trim().toLowerCase();
      const nextRequest = requestAliases[incomingRequest];
      if (!nextRequest) {
        return;
      }

      setActiveRequest(nextRequest);

      const quickActionsSection = document.getElementById('quick-actions');
      if (quickActionsSection) {
        quickActionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('paladin:open-contact-request', handleOpenRequest);
    return () => {
      window.removeEventListener('paladin:open-contact-request', handleOpenRequest);
    };
  }, [location.search]);

  return (
    <>
      <Header />
      
      <main id="get-in-touch" className="pt-16 pb-0 px-8 max-w-7xl mx-auto w-full text-[#010407]">
        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-[#F7F4EF] text-[#012E72] text-xs font-semibold tracking-widest uppercase mb-4 border border-[#e7dccb] shadow-sm">
            Get In Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#012E72] tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-[#010407]/80 max-w-2xl mx-auto leading-relaxed">
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
              className="w-full h-full rounded-3xl shadow-lg shadow-[#012E72]/10 object-cover scale-x-[-1]"
            />
          </div>

          {/* Right: Contact Form */}
          <div className="flex-1 bg-white rounded-3xl p-8 border border-[#e7dccb] shadow-xl shadow-[#012E72]/5">
            <h2 className="text-2xl font-bold text-[#012E72] mb-6">Send us a Message</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-[#010407]/80">
                    Full Name <span className="text-[#002DB5]">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={`px-4 py-3 rounded-xl border bg-[#F7F4EF]/40 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                        : 'border-[#d8cbb8] focus:ring-[#002DB5]/40 focus:border-[#002DB5]'
                    }`}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#010407]/80">
                    Email Address <span className="text-[#002DB5]">*</span>
                  </label>
                  <input 
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    id="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`px-4 py-3 rounded-xl border bg-[#F7F4EF]/40 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                        : 'border-[#d8cbb8] focus:ring-[#002DB5]/40 focus:border-[#002DB5]'
                    }`}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-[#010407]/80">
                  Subject <span className="text-[#002DB5]">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`px-4 py-3 rounded-xl border bg-[#F7F4EF]/40 focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errors.subject
                      ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                      : 'border-[#d8cbb8] focus:ring-[#002DB5]/40 focus:border-[#002DB5]'
                  }`}
                />
                <p className="text-xs text-[#010407]/55">Enter a short subject so we can route your message to the right team.</p>
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-[#010407]/80">
                  Message <span className="text-[#002DB5]">*</span>
                </label>
                <textarea 
                  id="message"
                  rows="6"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`px-4 py-3 rounded-xl border bg-[#F7F4EF]/40 focus:bg-white focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-300 focus:border-red-500'
                      : 'border-[#d8cbb8] focus:ring-[#002DB5]/40 focus:border-[#002DB5]'
                  }`}
                ></textarea>
                <div className="text-xs text-[#010407]/50 text-right">{formData.message.length} characters</div>
                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
              </div>

              {isSubmitted && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium">
                  Message sent successfully. Our team will get back to you soon.
                </div>
              )}

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                  {submitError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 inline-flex items-center justify-center gap-2 bg-[#012E72] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Service Request Cards Section */}
        <section id="quick-actions" className="relative mt-20 left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#F7F4EF] px-5 py-14 sm:px-8 sm:py-16 border-y border-[#e7dccb]">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[620px] h-[240px] rounded-full bg-[#002DB5]/10 blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-[#002DB5] text-xs font-semibold tracking-widest uppercase mb-4 border border-[#d8cbb8] shadow-sm">
                Quick Actions
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#012E72] tracking-tight mb-3">
                How Can We Help You Today?
              </h2>
              <p className="text-[#010407]/75 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
                Complete the applicable form below and submit it to our office via email, fax, or in person. Our team
                will review your request and respond within 1-2 business days. Fields marked with an asterisk (*) are
                required.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requestCards.map((card, index) => (
                <article
                  key={card.title}
                  className="group relative overflow-hidden rounded-2xl border border-[#e7dccb] bg-white p-7 shadow-lg shadow-[#012E72]/5 hover:shadow-xl hover:shadow-[#002DB5]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col items-start"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#002DB5]/[0.03] via-transparent to-[#002DB5]/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative mb-4 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-[#F7F4EF] text-[#002DB5] border border-[#d8cbb8] px-3 text-xs font-black tracking-wide">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <h3 className="relative text-xl font-bold text-[#012E72] mb-3">{card.title}</h3>
                  <p className="relative text-[#010407]/75 text-sm leading-relaxed mb-6 flex-1 text-justify">
                    {card.desc}
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveRequest(card.id)}
                    className="relative inline-flex items-center justify-center gap-2 bg-[#012E72] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
                  >
                    {card.cta}
                    <span aria-hidden="true">→</span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Render ContactInfo below the form instead of side-by-side to preserve its existing layout since it acts as a full section */}
      <ContactInfo />

      <MapLocation />

      <Footer />

      {ActiveRequestForm && activeCard && (
        <ActiveRequestForm onClose={() => setActiveRequest(null)} />
      )}
    </>
  );
}

export default Contact;
