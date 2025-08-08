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

  const painPoints = [
    {
      icon: AlertTriangle,
      title: "Data Retention Set to 2 Months",
      description: "Losing valuable historical data because default settings weren't changed"
    },
    {
      icon: Target,
      title: "Missing Key Events Setup",
      description: "Can't track conversions properly without proper event configuration"
    },
    {
      icon: Shield,
      title: "PII Data Exposure",
      description: "Accidentally collecting personal information in URLs and parameters"
    },
    {
      icon: BarChart3,
      title: "Inaccurate Attribution",
      description: "Wrong attribution model causing poor ad spend decisions"
    }
  ];

  const solutions = [
    {
      icon: Zap,
      title: "Instant GA4 Audit",
      description: "Get a comprehensive analysis of your setup in seconds"
    },
    {
      icon: CheckCircle,
      title: "Priority Fix List",
      description: "Know exactly what to fix first for maximum impact"
    },
    {
      icon: TrendingUp,
      title: "2025 Best Practices",
      description: "Stay ahead with the latest GA4 optimization techniques"
    },
    {
      icon: Users,
      title: "No-Code Setup",
      description: "Perfect for marketers and business owners, no dev required"
    }
  ];

  const features = [
    "Complete GA4 fundamentals checklist (30+ critical settings)",
    "Prioritized list of fixes",
    "Clear instructions on how to make necessary fixes"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black-soft via-black to-brand-black-soft">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-blue-light/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Logo size="medium" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-brand-blue/20 text-brand-blue rounded-full text-sm font-semibold border border-brand-blue/30 backdrop-blur-sm">
                🚀 Coming Soon
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl social-gothic text-white mb-6 leading-tight">
              Stop Losing Money on
              <span className="block gradient-text">
                Broken GA4 Setup
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Most GA4 setups are <strong className="text-brand-blue">fundamentally broken</strong>. 
              Get an instant audit of your Google Analytics 4 configuration and fix critical issues 
              that are costing you <strong className="text-red-400">real money</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-5 h-5" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <span>Read-only access</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Star className="w-5 h-5" />
                <span>No coding required</span>
              </div>
            </div>

            {/* Email Signup */}
            <div className="max-w-md mx-auto">
              {isSubmitted ? (
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">You're on the list!</p>
                  <p className="text-gray-300 text-sm mt-2">We'll notify you when GA4 Helper launches.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Enter your email for early access"
                      className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-blue focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      required
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      title="Please enter a valid email address"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email}
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-light text-white py-4 rounded-2xl font-bold text-lg hover:from-brand-blue-dark hover:to-brand-blue transition-all duration-200 shadow-lg shadow-brand-blue/25 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Joining...' : 'Get Early Access'}</span>
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="px-6 py-20 bg-black/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl social-gothic text-white mb-6">
                Is Your GA4 Setup <span className="text-red-400">Costing You Money?</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                These critical misconfigurations are more common than you think, and they're 
                silently destroying your data quality and marketing performance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {painPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                        <p className="text-gray-300">{point.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl social-gothic text-white mb-6">
                The <span className="text-brand-blue">Complete Solution</span> You've Been Waiting For
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                GA4 Helper automatically audits your entire setup and gives you a prioritized 
                action plan to fix everything that's wrong.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {solutions.map((solution, index) => {
                const Icon = solution.icon;
                return (
                  <div key={index} className="bg-black/60 border border-brand-blue/30 rounded-2xl p-6 backdrop-blur-sm hover:border-brand-blue/50 transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-brand-blue to-brand-blue-light rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-blue/25">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{solution.title}</h3>
                        <p className="text-gray-300">{solution.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature List */}
            <div className="bg-black/60 border border-gray-600 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl social-gothic text-white mb-6 text-center">What You'll Get:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-brand-blue/20 to-brand-blue-light/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl social-gothic text-white mb-6">
              Don't Let Another Day of Bad Data Cost You Money
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of marketers who will get instant access to the most comprehensive 
              GA4 audit tool when we launch.
            </p>
            
            {!isSubmitted && (
              <div className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="Your email address"
                      className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-blue focus:border-transparent backdrop-blur-sm transition-all duration-200"
                      required
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      title="Please enter a valid email address"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email}
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-light text-white py-4 rounded-2xl font-bold text-lg hover:from-brand-blue-dark hover:to-brand-blue transition-all duration-200 shadow-lg shadow-brand-blue/25 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {isSubmitting ? 'Joining...' : 'Get Notified When We Launch'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Logo size="small" />
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <span>© 2025 GA4 Helper</span>
                <span>•</span>
                <span>Built for marketers, by marketers</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GA4HelperLanding;
