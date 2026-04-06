import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuoteRequest from './pages/QuoteRequest';
import PolicyManagement from './pages/PolicyManagement';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote" element={<QuoteRequest />} />
        <Route path="/policies" element={<PolicyManagement />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
