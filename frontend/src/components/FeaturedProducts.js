import React from 'react';

const products = [
  { title: 'General Liability', desc: 'Protects businesses from third-party claims for injury, property damage, and more.', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { title: 'Renters Insurance', desc: 'Covers your belongings and liability as a renter against theft, fire, and more.', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { title: 'Umbrella Insurance', desc: 'Extra liability coverage for your assets and peace of mind.', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
  { title: "Worker's Compensation", desc: 'Financial and medical support for employees injured on the job.', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' },
  { title: 'Flood Insurance', desc: 'Covers damage from natural disasters, burst pipes, and water-related incidents.', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80' },
  { title: 'Commercial Auto', desc: 'Protects business vehicles from accidents, damage, and liability claims.', img: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80' },
];

function FeaturedProducts() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto w-full" id="services">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-[#0a0a0a] tracking-tight mb-4">Our Premium Solutions</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the perfect coverage tailored to secure your professional and personal assets.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <div key={i} className="glass-panel rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
            <div className="h-48 overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#0a0a0a] mb-2 group-hover:text-[#0077b6] transition-colors">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
