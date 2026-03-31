import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <section className="contact">
      <h2>Contact Us</h2>
      <p>Have questions or need a quote? Reach out to our team today.</p>
      <form className="contact__form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required />
        <button type="submit">Send Message</button>
      </form>
      <div className="contact__info">
        <p><strong>Email:</strong> info@paladin-insurance.com</p>
        <p><strong>Phone:</strong> (555) 123-4567</p>
        <p><strong>Address:</strong> 123 Main St, Suite 200, City, State</p>
      </div>
    </section>
  );
}

export default Contact;
