import React from 'react';
import './WhyChooseUs.css';

const reasons = [
  {
    title: 'Personalized Service',
    desc: 'One-on-one assistance with a licensed agent to customize an insurance plan that meets your needs.'
  },
  {
    title: 'Competitive Rates',
    desc: 'Affordable rates with flexible payment options. Get covered quickly at a price you can afford.'
  },
  {
    title: 'Quality and Care',
    desc: 'We treat clients like family. Our promise: the right coverage at an unbeatable price for peace of mind.'
  }
];

function WhyChooseUs() {
  return (
    <section className="why-choose-us">
      <h2>Why Choose Paladin?</h2>
      <div className="why-choose-us__list">
        {reasons.map((r, i) => (
          <div className="why-card" key={i}>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
