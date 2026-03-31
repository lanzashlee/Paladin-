import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/paladin-logo.webp';

function Header() {
  const location = useLocation();
  const { pathname } = location;

  const linkBaseClasses = 'transition-colors relative';

  const getNavLinkClasses = (to) => {
    const isActive = to === '/'
      ? pathname === '/'
      : pathname.startsWith(to);

    return [
      linkBaseClasses,
      isActive ? 'text-amber-500' : 'text-gray-700 hover:text-amber-500'
    ].join(' ');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="flex items-center justify-between py-4 md:py-5 px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Paladin Logo" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight" style={{ color: '#0077b6' }}>
            Paladin<span style={{ color: '#000000ff' }}>Insurance Solutions</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className={getNavLinkClasses('/')}>Home</Link>
          <Link to="/service" className={getNavLinkClasses('/service')}>Our service</Link>
          <Link to="/faq" className={getNavLinkClasses('/faq')}>FAQ</Link>
          <Link to="/blog" className={getNavLinkClasses('/blog')}>Blog</Link>
          <Link to="/about" className={getNavLinkClasses('/about')}>About Us</Link>
        </nav>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/quote" className="bg-[#0077b6] text-white px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5">
            Request a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
