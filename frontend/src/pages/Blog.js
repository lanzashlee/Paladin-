import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Blog() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="max-w-5xl mx-auto px-6 md:px-10 py-20 text-center space-y-6">
          <p className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F7F4EF] text-[#002DB5] text-xs font-semibold tracking-[0.2em] uppercase border border-[#d8cbb8] shadow-sm">
            Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#012E72] tracking-tight">
            We are crafting helpful articles for you
          </h1>
          <div className="mx-auto max-w-2xl rounded-3xl p-10 shadow-xl shadow-[#012E72]/8 bg-[#F7F4EF] border border-[#e7dccb]">
            <p className="text-lg md:text-xl font-semibold text-[#012E72] mb-2">Coming soon</p>
            <p className="text-[#010407]/80 leading-relaxed">
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
