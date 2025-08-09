'use client';

import React, { useState } from 'react';
import Logo from './components/common/Logo';
import ImageModal from './components/ImageModal';

const GA4HelperLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: "📊",
      title: "Configuration Score",
      description: "Get an instant score based on 50+ critical GA4 settings, weighted by importance to your data quality."
    },
    {
      icon: "🎯",
      title: "Priority Recommendations",
      description: "Receive actionable recommendations ranked by impact, with direct links to fix issues in GA4."
    },
    {
      icon: "🔍",
      title: "Deep Configuration Audit",
      description: "Comprehensive analysis of property settings, data streams, events, and attribution configuration."
    },
    {
      icon: "⚡",
      title: "API-Powered Accuracy",
      description: "Uses Google Analytics Admin API for real-time, precise configuration assessment."
    },
    {
      icon: "📈",
      title: "Attribution Analysis",
      description: "Review your attribution model and conversion windows to ensure accurate conversion tracking."
    },
    {
      icon: "🔗",
      title: "Integration Check",
      description: "Verify Google Ads linking, BigQuery exports, and other critical integrations."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-black-soft">
      {/* Header */}
      <header className="bg-gradient-to-b from-black to-brand-black-soft border-b border-brand-blue/15 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-black/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="medium" variant="white" />
                          <nav className="hidden md:flex items-center space-x-8">
                  <a href="#features" className="text-brand-blue font-medium text-sm">Features</a>
                  <a href="#screenshot" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Sample Report</a>
                  <a href="/blog" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Blog</a>
                </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-center bg-radial-gradient">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/8 to-brand-blue-light/8"></div>
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 px-4 py-2 rounded-full text-sm font-medium text-brand-blue-light mb-8">
            <span>⚡</span>
            <span>Professional GA4 Audit Tool</span>
          </div>
          
          <h1 className="logo-font text-5xl md:text-7xl text-white mb-6 leading-tight">
            <span className="brand-blue">GA4 HELPER</span>
            <br />
            <span className="text-white text-4xl md:text-6xl">Configuration Audit Tool</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive Google Analytics 4 audit that ensures optimal setup, 
            reliable data collection, and actionable insights. Identify critical 
            configuration gaps before they impact your analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#beta-signup" className="btn-primary">
              <span>🚀</span>
              <span>Get Beta Access</span>
            </a>
            <a href="#screenshot" className="btn-secondary">View Sample Report</a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-brand-black-soft via-brand-gray-dark to-brand-black-soft" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="logo-font text-4xl md:text-5xl text-white mb-6">
              <span className="brand-blue">POWERFUL</span> FEATURES
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">Everything you need to ensure your GA4 setup is optimized for reliable data collection and actionable insights.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-brand-blue hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="logo-font text-xl text-gray-900 mb-4 group-hover:text-brand-blue transition-colors">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Slideshow */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50" id="screenshot">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="logo-font text-4xl md:text-5xl text-gray-900 mb-6">
              See <span className="text-brand-blue">GA4 Helper</span> in Action
            </h2>
            <p className="text-gray-700 text-xl max-w-3xl mx-auto leading-relaxed">
              Get a detailed view of how our comprehensive audit identifies and fixes critical GA4 configuration issues
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
              <div 
                className="aspect-video bg-gray-50 rounded-lg overflow-hidden group cursor-pointer relative"
                onClick={() => setIsModalOpen(true)}
              >
                <img 
                  src="/dashboard-example.png" 
                  alt="GA4 Helper Dashboard Example"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Comprehensive GA4 Audit Dashboard
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant visibility into your GA4 configuration health with detailed scores, 
                  priority issues, and actionable recommendations.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-light font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Click to enlarge and explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Signup Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue/20 to-brand-blue-light/20" id="beta-signup">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="logo-font text-4xl text-white mb-6">
            Ready to Optimize Your GA4 Setup?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to be first in line for your FREE configuration audit!
          </p>
          
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-2 shadow-2xl">
            <iframe 
              src="https://ga4helper.substack.com/embed" 
              width="100%" 
              height="320" 
              style={{border: '1px solid #EEE', background: 'white', borderRadius: '12px'}} 
              frameBorder="0" 
              scrolling="no"
              title="GA4 Helper Beta Signup"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" variant="white" />
            <div className="flex items-center space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
              <span>GA4 Helper by <a href="https://beastanalyticsco.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:text-brand-blue-light transition-colors font-medium">BEAST Analytics</a></span>
              <span>•</span>
              <span>© 2025 All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc="/dashboard-example.png"
        imageAlt="GA4 Helper Dashboard Example"
        imageTitle="Comprehensive GA4 Audit Dashboard"
      />
    </div>
  );
};

export default GA4HelperLanding;
