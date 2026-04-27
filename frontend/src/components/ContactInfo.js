import React from 'react';
import { MapPin, Phone, Printer, Mail } from 'lucide-react';

function ContactInfo({ className = '' }) {
  const rowCardClass =
    'flex items-stretch rounded-xl overflow-hidden bg-white min-h-[54px] border border-[#7ca0d6] shadow-[0_2px_6px_rgba(3,27,76,0.1)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#f6f9ff] hover:shadow-[0_5px_12px_rgba(3,27,76,0.14)]';
  const rowIconClass =
    'w-[54px] shrink-0 bg-[#0c3f90] text-[#f7fbff] border-r border-[#2f62aa] flex items-center justify-center';
  const rowTextClass =
    'px-3.5 py-2 text-[#0a3d90] text-[15px] md:text-[16px] font-semibold hover:text-[#083275] transition-colors flex items-center';
  const locationRowCardClass =
    'flex items-stretch rounded-xl overflow-hidden bg-white min-h-[54px] border border-[#7ca0d6] shadow-[0_2px_6px_rgba(3,27,76,0.1)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#f6f9ff] hover:shadow-[0_5px_12px_rgba(3,27,76,0.14)]';
  const locationIconClass =
    'w-[54px] shrink-0 bg-[#0c3f90] text-[#f7fbff] border-r border-[#2f62aa] flex items-center justify-center';
  const locationTextClass =
    'px-3.5 py-2 text-[#0a3d90] text-[15px] md:text-[16px] leading-[1.3] font-semibold hover:text-[#083275] transition-colors';

  return (
    <section className={`pt-12 pb-20 md:pt-14 md:pb-24 bg-[linear-gradient(180deg,#f3f6fb_0%,#e8edf6_100%)] border-y border-[#d7e1ef] ${className}`} id="contact-location">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8">
        <div className="rounded-[1.35rem] border border-[#b9cdec] bg-white p-5 md:p-7 shadow-[0_14px_30px_rgba(6,35,86,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-[0.46fr_0.54fr] gap-8 md:gap-10 items-start justify-items-center">
          <div className="pt-1 w-full max-w-[360px] flex flex-col items-center lg:items-start">
            <h2 className="text-[#0a3d90] font-extrabold tracking-tight text-4xl leading-tight">
              CONTACT & LOCATION
            </h2>
            <p className="mt-4 text-[#234f90] text-[14px] md:text-[15px] leading-[1.45] text-justify max-w-[320px]">
              We'd love to hear from you. Reach out to us through any of the channels below - our
              licensed agents are ready to assist.
            </p>

            <div className="mt-9 w-full max-w-[340px] rounded-[14px] bg-[linear-gradient(165deg,#0a3f95_0%,#072f73_100%)] text-white px-6 py-5 shadow-[0_5px_12px_rgba(4,31,85,0.2)] border border-[#3f69ad]">
              <h3 className="text-center uppercase text-[20px] font-extrabold tracking-[0.02em] text-white">
                Quick Payments
              </h3>
              <p className="mt-1.5 text-center text-[13px] leading-[1.35] text-[#edf4ff]">
                Securely manage your policies and bills right from our portal.
              </p>
              <div className="mt-4 flex flex-col items-center gap-3">
                <a
                  href="#"
                  className="w-[190px] text-center rounded-full bg-white text-[#0b4ba8] py-2.5 text-[14px] font-bold border border-white hover:bg-[#0b4ba8] hover:text-white transition-colors"
                >
                  e-Pay Now
                </a>
                <a
                  href="#"
                  className="w-[190px] text-center rounded-full bg-white text-[#0b4ba8] py-2.5 text-[14px] font-bold border border-white hover:bg-[#0b4ba8] hover:text-white transition-colors"
                >
                  Online Bill Pay
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 w-full max-w-[520px]">
            <div className={locationRowCardClass}>
              <div className={locationIconClass}>
                <MapPin className="w-5 h-5" />
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className={locationTextClass}>
                3787 Transport ST Suite A7 Box #5 Ventura,
                <br />
                CA 93003
              </a>
            </div>

            <div className={rowCardClass}>
              <div className={rowIconClass}>
                <Phone className="w-5 h-5" />
              </div>
              <a href="tel:8056926900" className={rowTextClass}>
                805-692-6900
              </a>
            </div>

            <div className={rowCardClass}>
              <div className={rowIconClass}>
                <Printer className="w-5 h-5" />
              </div>
              <p className={rowTextClass}>805-830-1680</p>
            </div>

            <div className={rowCardClass}>
              <div className={rowIconClass}>
                <Mail className="w-5 h-5" />
              </div>
              <a href="mailto:admin@paladinbusinessservices.net" className={`${rowTextClass} break-all`}>
                admin@paladinbusinessservices.net
              </a>
            </div>

            <div className={rowCardClass}>
              <div className={rowIconClass}>
                <span aria-hidden="true" className="text-[#f7fbff]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M22 12.06C22 6.488 17.523 2 12 2 6.477 2 2 6.488 2 12.06c0 5.026 3.657 9.197 8.438 9.944v-7.031H8.078v-2.913h2.36V9.845c0-2.335 1.388-3.626 3.514-3.626.999 0 2.043.178 2.043.178v2.27h-1.151c-1.135 0-1.489.708-1.489 1.434v1.72h2.533l-.405 2.913h-2.128v7.031C18.343 21.257 22 17.086 22 12.06Z" />
                  </svg>
                </span>
              </div>
              <a href="https://www.facebook.com/profile.php?id=61573336433957" target="_blank" rel="noopener noreferrer" className={rowTextClass}>
                Paladin Professional Insurance Solutions
              </a>
            </div>

            <div className={rowCardClass}>
              <div className={rowIconClass}>
                <span aria-hidden="true" className="text-[#f7fbff]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-2.75a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z" />
                  </svg>
                </span>
              </div>
              <a href="https://www.instagram.com/paladin_professional_insurance/" target="_blank" rel="noopener noreferrer" className={`${rowTextClass} break-all`}>
                @paladin_professional_insurance
              </a>
            </div>

            <div className={rowCardClass}>
              <div className={rowIconClass}>
                <span aria-hidden="true" className="text-[#f7fbff]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.339 17.338H6.169V10h2.17Zm-1.085-8.274a1.258 1.258 0 1 1 1.257-1.258 1.257 1.257 0 0 1-1.257 1.258Zm10.079 8.274h-2.169v-3.6c0-.86-.015-1.967-1.198-1.967-1.2 0-1.384.936-1.384 1.905v3.662H10.313V10h2.083v1.005h.03a2.284 2.284 0 0 1 2.058-1.133c2.2 0 2.606 1.448 2.606 3.33Z" />
                  </svg>
                </span>
              </div>
              <a href="https://www.linkedin.com/company/paladin-professional-insurance-solutions/about/" target="_blank" rel="noopener noreferrer" className={rowTextClass}>
                Paladin Professional Insurance Solutions
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default ContactInfo;
