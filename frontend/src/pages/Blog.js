import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Blog() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0077b6]">Blog</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight">
            We are crafting helpful articles for you
          </h1>
          <div className="glass-panel mx-auto max-w-2xl rounded-3xl p-10 shadow-xl shadow-blue-500/10 bg-white">
            <p className="text-lg md:text-xl font-semibold text-[#0077b6] mb-2">Coming soon</p>
            <p className="text-gray-700 leading-relaxed">
              Our blog will be available here soon. Check back for insights, tips, and updates tailored for Paladin clients.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Blog;
