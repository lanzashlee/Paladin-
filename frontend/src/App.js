import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuoteRequest from './pages/QuoteRequest';
import PolicyManagement from './pages/PolicyManagement';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Service from './pages/Service';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<Service />} />
        <Route path="/quote" element={<QuoteRequest />} />
        <Route path="/policies" element={<PolicyManagement />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App; 
