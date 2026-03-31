import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-8 w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Paladin Professional Insurance Solutions. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-[#0077b6] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#0077b6] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
