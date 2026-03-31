import React, { useState } from 'react';
import './QuoteRequest.css';

function QuoteRequest() {
  const [form, setForm] = useState({ name: '', email: '', type: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Send to backend
    setSubmitted(true);
  };

  return (
    <section className="quote-request">
      <h2>Request a Quote</h2>
      {submitted ? (
        <div className="quote-request__success">Thank you! We will contact you soon.</div>
      ) : (
        <form className="quote-request__form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" required type="email" />
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Insurance Type</option>
            <option value="auto">Auto</option>
            <option value="home">Home</option>
            <option value="business">Business</option>
            <option value="life">Life</option>
            <option value="health">Health</option>
          </select>
          <textarea name="details" value={form.details} onChange={handleChange} placeholder="Additional Details" />
          <button type="submit">Request Quote</button>
        </form>
      )}
    </section>
  );
}

export default QuoteRequest;
