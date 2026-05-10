import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import PricingSection from './PricingSection';
import AboutSection from './AboutSection';
import Footer from './Footer';

export default function LandingPage({ onStartApp }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar onStartApp={onStartApp} />
      <main>
        <HeroSection onStartApp={onStartApp} />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection onStartApp={onStartApp} />
        <AboutSection onStartApp={onStartApp} />
      </main>
      
      <Footer />
    </div>
  );
}
