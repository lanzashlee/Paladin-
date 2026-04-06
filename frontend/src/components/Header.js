import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/paladin-logo.webp';

function Header() {
  return (
    <header className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Paladin Logo" className="h-10 w-auto object-contain" />
        <span className="text-xl font-bold tracking-tight" style={{ color: '#0077b6' }}>
          Paladin<span style={{ color: '#000000ff' }}>Insurance Solutions</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
        <Link to="/service" className="hover:text-amber-500 transition-colors">Our service</Link>
        <Link to="/faq" className="hover:text-amber-500 transition-colors">FAQ</Link>
        <Link to="/blog" className="hover:text-amber-500 transition-colors">Blog</Link>
        <Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link>
      </nav>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/login" className="text-gray-700 hover:text-gray-900 transition-colors">Login</Link>
        <Link to="/quote" className="bg-[#0077b6] text-white px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5">
          Instant quote
        </Link>
      </div>
    </header>
  );
}

export default Header;
