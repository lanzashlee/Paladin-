import React from 'react';
import './ContactInfo.css';

function ContactInfo() {
  return (
    <section className="contact-info" id="contact">
      <h2>Contact Paladin Professional Insurance Solutions</h2>
      <div className="contact-info__details">
        <p><strong>Address:</strong> 3787 Transport ST Suite A7 Box #5, Ventura, CA 93003</p>
        <p><strong>Phone:</strong> <a href="tel:8056926900">805-692-6900</a></p>
        <p><strong>Fax:</strong> 805-830-1680</p>
        <p><strong>Email:</strong> <a href="mailto:support@paladinbusinessservices.net">support@paladinbusinessservices.net</a></p>
        <p><strong>License #:</strong> 6010043 (CA, AZ, ID, IL, IN, NV, NC, OH, TX)</p>
        <p><strong>Office Hours:</strong> Mon-Fri 09:00 am – 05:00 pm</p>
      </div>
      <div className="contact-info__links">
        <a href="#" className="contact-info__link">Online Bill Pay</a>
        <a href="#" className="contact-info__link">e-Pay Now</a>
      </div>
    </section>
  );
}

export default ContactInfo;
