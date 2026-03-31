import React from 'react';
import './Services.css';

const services = [
  { title: 'Auto Insurance', desc: 'Comprehensive coverage for your vehicle and peace of mind on the road.' },
  { title: 'Home Insurance', desc: 'Protect your home and belongings from unexpected events.' },
  { title: 'Business Insurance', desc: 'Tailored solutions for small and large businesses.' },
  { title: 'Life Insurance', desc: 'Secure your family’s future with flexible life insurance plans.' },
  { title: 'Health Insurance', desc: 'Affordable health coverage for individuals and families.' },
];

function Services() {
  return (
    <section className="services">
      <h2>Our Services</h2>
      <div className="services__list">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
