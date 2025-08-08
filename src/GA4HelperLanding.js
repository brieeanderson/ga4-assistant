'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  Mail, 
  AlertTriangle, 
  Zap, 
  Target,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Star,
  ArrowRight
} from 'lucide-react';
import Logo from './components/common/Logo';

const GA4HelperLanding = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || isSubmitting) return;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('form-name', 'ga4-helper-newsletter');
      formData.append('email', email);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your email. Please try again.');
    }
    
    setIsSubmitting(false);
  };

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
          <Logo size="medium" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Features</a>
            <a href="#dashboard" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Documentation</a>
            <button className="bg-brand-blue text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-brand-blue-dark hover:translate-y-[-2px] hover:shadow-lg hover:shadow-brand-blue/25">
              Sign In with Google
            </button>
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
            <span className="brand-blue glow">GA4 HELPER</span>
            <br />
            <span className="text-white text-4xl md:text-6xl">Configuration Audit Tool</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive Google Analytics 4 audit that ensures optimal setup, 
            reliable data collection, and actionable insights. Identify critical 
            configuration gaps before they impact your analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary">
              <span>🚀</span>
              <span>Start Free Audit</span>
            </button>
            <button className="btn-secondary">View Sample Report</button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-brand-black-soft via-brand-gray-dark to-brand-black-soft" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="logo-font text-4xl md:text-5xl text-white mb-6">
              <span className="brand-blue">POWERFUL</span> FEATURES
            </h2>
            <p className="text-gray-300 text-lg">Everything you need to ensure your GA4 setup is optimized</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="brand-card group">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-xl flex items-center justify-center text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="logo-font text-xl text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-brand-black-soft" id="dashboard">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-brand-gray-dark to-black border border-brand-blue/15 rounded-2xl p-10">
            <h2 className="logo-font text-3xl md:text-4xl text-white mb-4">
              <span className="brand-blue">GA4</span> Dashboard Preview
            </h2>
            <p className="text-gray-300 mb-8">
              See your GA4 configuration health at a glance
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="logo-font text-3xl font-bold text-brand-blue mb-2">92%</div>
                <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Config Score</div>
              </div>
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="logo-font text-3xl font-bold text-brand-blue mb-2">8</div>
                <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Issues Found</div>
              </div>
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="logo-font text-3xl font-bold text-brand-blue mb-2">2</div>
                <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Critical Items</div>
              </div>
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/20 rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="logo-font text-3xl font-bold text-brand-blue mb-2">15</div>
                <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Optimizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue/20 to-brand-blue-light/20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="logo-font text-4xl text-white mb-6">
            Ready to Optimize Your GA4 Setup?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of marketers who trust GA4 Helper for their analytics configuration.
          </p>
          
          {!isSubmitted ? (
            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter your email for early access"
                    className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-blue focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    required
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                    title="Please enter a valid email address"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !email}
                  className="w-full btn-primary"
                >
                  <span>{isSubmitting ? 'Joining...' : 'Get Early Access'}</span>
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-white font-semibold">You're on the list!</p>
              <p className="text-gray-300 text-sm mt-2">We'll notify you when GA4 Helper launches.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" />
            <div className="flex items-center space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
              <span>GA4 Helper by <a href="#" className="text-brand-blue hover:text-brand-blue-light transition-colors font-medium">BEAST Analytics</a></span>
              <span>•</span>
              <span>© 2024 All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GA4HelperLanding;
