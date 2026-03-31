import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about">
      <h2>About Paladin Insurance Brokers</h2>
      <p>
        Paladin Insurance is an independent insurance broker dedicated to providing personalized insurance solutions for individuals, families, and businesses. With years of experience and a commitment to client satisfaction, we help you find the best coverage at the best price.
      </p>
      <ul className="about__list">
        <li>Independent, client-focused advice</li>
        <li>Access to top insurance carriers</li>
        <li>Custom solutions for auto, home, business, life, and health</li>
        <li>Fast claims support and expert guidance</li>
      </ul>
    </section>
  );
}

export default About;
