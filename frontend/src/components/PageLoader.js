import React, { useEffect, useState } from 'react';

function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show loader for minimum 500ms, then wait for DOM to be ready
    const timer = setTimeout(() => {
      // Check if document is interactive
      if (document.readyState === 'loading') {
        const onReady = () => {
          setIsVisible(false);
          document.removeEventListener('DOMContentLoaded', onReady);
        };
        document.addEventListener('DOMContentLoaded', onReady);
      } else {
        setIsVisible(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo/text */}
        <div className="text-center">
          <h1 className="font-cinzel text-3xl font-bold uppercase tracking-widest text-[#012E72]">
            Paladin
          </h1>
          <p className="mt-2 font-constantia text-sm text-[#8b98b0]">Loading...</p>
        </div>

        {/* Loading spinner */}
        <div className="mt-4 flex gap-1">
          <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-[#0a4ab3]"></span>
          <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-[#0a4ab3]/70 [animation-delay:120ms]"></span>
          <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-[#0a4ab3]/40 [animation-delay:220ms]"></span>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
