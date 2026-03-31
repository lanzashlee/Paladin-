import React from 'react';
import './FeaturedProducts.css';
const products = [
  { title: 'General Liability', desc: 'Protects businesses from third-party claims for injury, property damage, and more.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { title: 'Renters Insurance', desc: 'Covers your belongings and liability as a renter against theft, fire, and more.', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { title: 'Umbrella Insurance', desc: 'Extra liability coverage for your assets and peace of mind.', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { title: "Worker's Compensation", desc: 'Financial and medical support for employees injured on the job.', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' },
  { title: 'Flood Insurance', desc: 'Covers damage from natural disasters, burst pipes, and water-related incidents.', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80' },
  { title: 'Commercial Auto', desc: 'Protects business vehicles from accidents, damage, and liability claims.', img: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80' },
  { title: 'Cyber Liability', desc: 'Covers losses and legal liabilities from cyberattacks and data breaches.', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80' },
  { title: 'Earthquake Insurance', desc: 'Covers repairs or rebuilding costs from seismic activity.', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80' },
  { title: 'Commercial Insurance', desc: 'Comprehensive protection for businesses against a wide array of risks.', img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80' },
];

function FeaturedProducts() {
  return (
    <section className="featured-products" id="services">
      <h2>Our Insurance Solutions</h2>
      <div className="featured-products__list">
        {products.map((p, i) => (
          <div className="product-card" key={i}>
            <img src={p.img} alt={p.title} className="product-card__img" />
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
