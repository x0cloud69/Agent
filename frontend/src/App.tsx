import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Hero from './components/common/home/Hero';
import Service from './components/common/home/Service';
import Product from './components/common/home/Product';
import Testimonials from './components/common/home/Testimonials';
import Pricing from './components/common/home/Pricing';
import Footer from './components/common/home/Footer';
import Login from './components/auth/Login';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import Chatbot from './pages/Chatbot/Chatbot';
import MCPSettings from './pages/dashboard/MCPSettings';

const HomePage: React.FC = () => {
  return (
    <div>
      <div id="Hero">
        <Hero />
      </div>
      <div id="Service">
        <Service />
      </div>
      <div id="Product">
        <Product />
      </div>
      <div id="Testimonials">
        <Testimonials />
      </div>
      <div id="Pricing">
        <Pricing />
      </div>
      <div id="Footer">
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AgentDashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/mcp-settings" element={<MCPSettings />} />
      </Routes>
    </Router>
  );
};

export default App;
