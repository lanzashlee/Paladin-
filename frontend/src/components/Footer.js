import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const today = new Date().getDay(); // 0 = Sunday
  const officeHours = [
    { label: 'Sun', value: 'Closed' },
    { label: 'Mon', value: '09:00 am – 05:00 pm' },
    { label: 'Tue', value: '09:00 am – 05:00 pm' },
    { label: 'Wed', value: '09:00 am – 05:00 pm' },
    { label: 'Thu', value: '09:00 am – 05:00 pm' },
    { label: 'Fri', value: '09:00 am – 05:00 pm' },
    { label: 'Sat', value: 'Closed' }
  ];

  const hoursColumnLeft = [0, 1, 2, 3];
  const hoursColumnRight = [4, 5, 6];

  const renderHourRow = (idx) => {
    const item = officeHours[idx];
    const isToday = idx === today;
    const textClass = isToday ? 'font-semibold text-[#012E72]' : 'text-[#010407]/75';
    return (
      <div
        key={item.label}
        className="flex items-center justify-between rounded-lg bg-white border border-[#e7dccb] px-3 py-2"
        aria-label={`${item.label} hours`}
      >
        <span className={textClass}>{item.label}</span>
        <span className={textClass}>{item.value}</span>
      </div>
    );
  };

  return (
    <footer className="bg-[#F7F4EF] text-[#010407]/80 py-12 border-t border-[#e7dccb]">
      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col gap-8">
        <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] items-start">
          <div className="space-y-4">
            <p className="font-semibold text-[#012E72]">Contact Details</p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm text-[#010407]/80">
              <div className="space-y-1">
                <p className="font-semibold text-[#012E72]">Address</p>
                <Link to="/contact#find-us" className="text-[#010407]/75 hover:text-[#002DB5] transition-colors block">
                  3787 Transport ST Suite A7 Box #5, Ventura, CA 93003
                </Link>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#012E72]">Phone</p>
                <Link to="/contact#contact-location" className="text-[#010407]/75 hover:text-[#002DB5] transition-colors block">
                  805-692-6900
                </Link>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#012E72]">Fax</p>
                <Link to="/contact#contact-location" className="text-[#010407]/75 hover:text-[#002DB5] transition-colors block">
                  805-830-1680
                </Link>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[#012E72]">Email</p>
                <Link to="/contact#contact-location" className="text-[#010407]/75 hover:text-[#002DB5] transition-colors block">
                  support@paladinbusinessservices.net
                </Link>
              </div>
            </div>
            <div className="flex gap-4 text-[#012E72] pt-2">
              <div className="h-9 w-9 rounded-full bg-white border border-[#d8cbb8] flex items-center justify-center hover:text-[#002DB5] hover:border-[#002DB5] transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M22 12.06C22 6.488 17.523 2 12 2 6.477 2 2 6.488 2 12.06c0 5.026 3.657 9.197 8.438 9.944v-7.031H8.078v-2.913h2.36V9.845c0-2.335 1.388-3.626 3.514-3.626.999 0 2.043.178 2.043.178v2.27h-1.151c-1.135 0-1.489.708-1.489 1.434v1.72h2.533l-.405 2.913h-2.128v7.031C18.343 21.257 22 17.086 22 12.06Z" />
                </svg>
              </div>
              <div className="h-9 w-9 rounded-full bg-white border border-[#d8cbb8] flex items-center justify-center hover:text-[#002DB5] hover:border-[#002DB5] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-2.75a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z" />
                </svg>
              </div>
              <div className="h-9 w-9 rounded-full bg-white border border-[#d8cbb8] flex items-center justify-center hover:text-[#002DB5] hover:border-[#002DB5] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.339 17.338H6.169V10h2.17Zm-1.085-8.274a1.258 1.258 0 1 1 1.257-1.258 1.257 1.257 0 0 1-1.257 1.258Zm10.079 8.274h-2.169v-3.6c0-.86-.015-1.967-1.198-1.967-1.2 0-1.384.936-1.384 1.905v3.662H10.313V10h2.083v1.005h.03a2.284 2.284 0 0 1 2.058-1.133c2.2 0 2.606 1.448 2.606 3.33Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-4 text-sm text-[#010407]/80 text-left">
            <p className="font-semibold text-[#012E72]">Office Hours</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                {hoursColumnLeft.map(renderHourRow)}
              </div>
              <div className="space-y-2">
                {hoursColumnRight.map(renderHourRow)}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1 text-sm text-[#010407]/70 mt-4 md:mt-2">
          <p>Licensed in CA, AZ, ID, IL, IN, NV, NC, OH and TX</p>
          <p>Paladin Professional Insurance Solutions | Protecting What Matters, With Care That Shows</p>
        </div>
        <div className="h-px w-full bg-[#d8cbb8]" />
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Paladin Professional Insurance Solutions. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-[#002DB5] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#002DB5] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
