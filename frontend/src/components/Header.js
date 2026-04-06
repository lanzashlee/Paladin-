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
      isActive ? 'text-[#002DB5]' : 'text-[#010407]/75 hover:text-[#002DB5]'
    ].join(' ');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#e7dccb]">
      <div className="flex items-center justify-between py-4 md:py-5 px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Paladin Logo" className="h-10 w-auto object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-black tracking-tight text-[#012E72]">
              PALADIN
            </span>
            <span className="text-sm font-semibold text-[#010407]/85">
              Professional Insurance Solutions
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className={getNavLinkClasses('/')}>Home</Link>
          <Link to="/service" className={getNavLinkClasses('/service')}>Our service</Link>
          <Link to="/faq" className={getNavLinkClasses('/faq')}>FAQ</Link>
          <Link to="/blog" className={getNavLinkClasses('/blog')}>Blog</Link>
          <Link to="/about" className={getNavLinkClasses('/about')}>About Us</Link>
          <Link to="/contact" className={getNavLinkClasses('/contact')}>Contact Us</Link>
        </nav>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/quote" className="bg-[#012E72] text-white px-6 py-2.5 rounded-full shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5">
            Request a Quote
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
