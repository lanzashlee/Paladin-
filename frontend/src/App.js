import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import QuoteRequest from './pages/QuoteRequest';
import PolicyManagement from './pages/PolicyManagement';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Service from './pages/Service';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Testimonials from './pages/Testimonials';
import VoiceChatWidget from './components/VoiceChatWidget';
import Toast from './components/Toast';
import PageLoader from './components/PageLoader';
import { ToastProvider } from './context/ToastContext';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return;
    }

    const targetId = hash.replace('#', '');
    const scrollToTarget = () => {
      const section = document.getElementById(targetId);
      if (!section) {
        return false;
      }

      const headerOffset = 110;
      const sectionY = section.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: sectionY - headerOffset,
        behavior: 'smooth',
      });

      return true;
    };

    if (scrollToTarget()) {
      return;
    }

    const retryTimers = [80, 200, 400].map((delay) => setTimeout(scrollToTarget, delay));
    return () => retryTimers.forEach((timer) => clearTimeout(timer));
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <PageLoader />
      <Router>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<QuoteRequest />} />
          <Route path="/policies" element={<PolicyManagement />} />
          <Route path="/service" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add more routes here */}
        </Routes>
        <VoiceChatWidget />
        <Toast />
      </Router>
    </ToastProvider>
  );
}

export default App;
