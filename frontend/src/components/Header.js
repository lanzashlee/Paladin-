import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/paladin.png';

function Header() {
  const location = useLocation();
  const { pathname } = location;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(null);

  const linkBaseClasses = 'transition-colors relative';

  const navItems = [
    {
      label: 'Home',
      to: '/',
      sections: [
        { label: 'Hero', anchor: '#hero' },
        { label: 'Who We Are', anchor: '#who-we-are' },
        { label: 'Insurance Lines', anchor: '#insurance-lines' },
        { label: 'Why Choose Paladin', anchor: '#why-choose-paladin' },
        { label: 'Partners & Carriers', anchor: '#partners-carriers' },
        { label: 'What Our Clients Say', anchor: '#what-our-clients-say' },
        { label: 'Meet The Team', anchor: '#team-preview' },
        { label: 'Office Hours', anchor: '#office-hours' },
        { label: 'Contact & Location', anchor: '#contact-location' },
        { label: 'Find Us', anchor: '#find-us' },
      ],
    },
    {
      label: 'Our Services',
      to: '/service',
      sections: [
        { label: 'Insurance Lines', anchor: '#insurance-lines' },
        { label: 'What Our Clients Say', anchor: '#what-our-clients-say' },
      ],
    },
    {
      label: 'FAQ',
      to: '/faq',
      sections: [
        { label: 'About Paladin', anchor: '#about-paladin' },
        { label: 'Consultations & Requests', anchor: '#consultations-requests' },
        { label: 'Working With Us', anchor: '#working-with-us' },
        { label: 'Contact & Office', anchor: '#contact-office' },
      ],
    },
    {
      label: 'Blog',
      to: '/blog',
      sections: [
        { label: 'Blogs & Articles', anchor: '#blogs-articles' },
        { label: 'What Our Clients Say', anchor: '#what-our-clients-say' },
      ],
    },
    { label: 'Testimonials', to: '/testimonials' },
    {
      label: 'About Us',
      to: '/about',
      sections: [
        { label: 'Company Overview', anchor: '#company-overview' },
        { label: 'Our Mission & Our Promise', anchor: '#mission-promise' },
        { label: 'Why Choose Paladin?', anchor: '#why-choose-paladin' },
        { label: 'Meet The Team', anchor: '#meet-the-team' },
        { label: 'Partners & Carriers', anchor: '#partners-carriers' },
        { label: 'Find Us', anchor: '#find-us' },
      ],
    },
    {
      label: 'Contact Us',
      to: '/contact',
      sections: [
        { label: 'Get In Touch', anchor: '#get-in-touch' },
        { label: 'Service Requests', anchor: '#quick-actions' },
        { label: 'Contact & Location', anchor: '#contact-location' },
        { label: 'Find Us', anchor: '#find-us' },
      ],
    },
  ];

  const getNavLinkClasses = (to) => {
    const isActive = to === '/'
      ? pathname === '/'
      : pathname.startsWith(to);

    return [
      linkBaseClasses,
      isActive ? 'text-[#002DB5]' : 'text-[#010407]/75 hover:text-[#002DB5]'
    ].join(' ');
  };

  const handlePrimaryNavClick = (to) => {
    setMobileMenuOpen(false);
    setOpenMobileSection(null);

    if (pathname === to) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleSectionNavClick = (routePath, anchor) => {
    setMobileMenuOpen(false);
    setOpenMobileSection(null);

    if (pathname !== routePath || window.location.hash !== anchor) {
      return;
    }

    const sectionId = anchor.replace('#', '');
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const headerOffset = 110;
    const sectionY = section.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: sectionY - headerOffset, behavior: 'smooth' });
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleViewportChange = (event) => {
      if (event.matches) {
        setMobileMenuOpen(false);
        setOpenMobileSection(null);
      }
    };

    if (mediaQuery.matches) {
      setMobileMenuOpen(false);
      setOpenMobileSection(null);
    }

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#e7dccb]">
      <div className="flex items-center justify-between py-4 md:py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex min-w-0 items-center gap-3">
          <img src={logo} alt="Paladin Logo" className="h-14 md:h-16 w-auto object-contain" />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="text-2xl font-black tracking-tight text-[#012E72] truncate">
              PALADIN
            </span>
            <span className="text-sm font-semibold text-[#010407]/85 hidden sm:block truncate">
              Professional Insurance Solutions
            </span>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const hasDropdown = Array.isArray(item.sections) && item.sections.length > 0;

            return (
              <div key={item.to} className="relative group">
                <Link
                  to={item.to}
                  onClick={() => handlePrimaryNavClick(item.to)}
                  className={getNavLinkClasses(item.to)}
                >
                  {item.label}
                </Link>

                {hasDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 translate-y-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                    <div className="relative w-[420px] max-w-[78vw] rounded-2xl border border-[#e7dccb] bg-white p-2.5 shadow-2xl shadow-[#012E72]/15">
                      <span
                        aria-hidden="true"
                        className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-[#e7dccb] bg-white"
                      />
                      <div className={`grid gap-1.5 ${item.sections.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {item.sections.map((section) => (
                          <Link
                            key={section.anchor}
                            to={`${item.to}${section.anchor}`}
                            onClick={() => handleSectionNavClick(item.to, section.anchor)}
                            className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#010407]/80 hover:bg-[#F7F4EF] hover:text-[#002DB5] transition-colors"
                          >
                            {section.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-6 text-sm font-medium">
          <Link to="/quote" className="bg-[#012E72] text-white px-6 py-2.5 rounded-full shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5">
            Request a Quote
          </Link>
        </div>

        <button
          type="button"
          className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d5c8b4] bg-white text-[#012E72] shadow-sm"
          aria-label="Open navigation menu"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>
      </div>

      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] xl:hidden">
          <button
            type="button"
            aria-label="Close navigation menu overlay"
            className="absolute inset-0 bg-[#010407]/30"
            onClick={() => {
              setMobileMenuOpen(false);
              setOpenMobileSection(null);
            }}
          />
          <div className="relative ml-auto flex h-full w-1/2 min-w-[320px] max-w-[520px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e7dccb] px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <img src={logo} alt="Paladin Logo" className="h-14 w-auto object-contain" />
                <span className="text-xl font-black tracking-tight text-[#012E72] truncate">PALADIN</span>
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d5c8b4] bg-white text-[#012E72]"
                aria-label="Close navigation menu"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setOpenMobileSection(null);
                }}
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
              <nav aria-label="Mobile navigation" className="space-y-2">
                {navItems.map((item) => {
                  const hasDropdown = Array.isArray(item.sections) && item.sections.length > 0;
                  const isOpen = openMobileSection === item.to;
                  const isActive = item.to === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.to);

                  return (
                    <div key={item.to} className="rounded-2xl border border-[#e7dccb] bg-[#f8f5ef] overflow-hidden">
                      <div className="flex items-center">
                        <Link
                          to={item.to}
                          onClick={() => handlePrimaryNavClick(item.to)}
                          className={[
                            'flex-1 px-4 py-3 text-sm font-semibold transition-colors',
                            isActive ? 'text-[#002DB5]' : 'text-[#010407]/85 hover:text-[#002DB5]'
                          ].join(' ')}
                        >
                          {item.label}
                        </Link>

                        {hasDropdown && (
                          <button
                            type="button"
                            className="px-4 py-3 text-[#012E72]"
                            onClick={() => setOpenMobileSection(isOpen ? null : item.to)}
                            aria-expanded={isOpen}
                            aria-label={`Toggle ${item.label} submenu`}
                          >
                            <ChevronDown size={18} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                          </button>
                        )}
                      </div>

                      {hasDropdown && isOpen && (
                        <div className="border-t border-[#e7dccb] bg-white px-3 py-3">
                          <div className={`grid gap-2 ${item.sections.length <= 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {item.sections.map((section) => (
                              <Link
                                key={section.anchor}
                                to={`${item.to}${section.anchor}`}
                                onClick={() => handleSectionNavClick(item.to, section.anchor)}
                                className="rounded-xl border border-[#efe4d4] px-3 py-2 text-[13px] font-medium text-[#010407]/80 hover:border-[#012E72] hover:bg-[#F7F4EF] hover:text-[#002DB5] transition-colors"
                              >
                                {section.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <Link
                  to="/quote"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setOpenMobileSection(null);
                  }}
                  className="mt-3 flex items-center justify-center rounded-2xl bg-[#012E72] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#012E72]/20"
                >
                  Request a Quote
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
