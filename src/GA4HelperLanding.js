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

const GA4HelperLanding = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'ga4-helper-newsletter',
          'email': email
        })
      });
      
      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting form:', error);
      // You could add error handling here
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
    "Custom dimensions and metrics optimization",
    "Enhanced measurement parameter registration",
    "Google Ads and Search Console integration audit",
    "Data privacy and GDPR compliance check",
    "Real-time configuration recommendations",
    "GTM container analysis and optimization",
    "Attribution model recommendations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">GA4 Helper</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold border border-orange-500/30 backdrop-blur-sm">
                🚀 Coming Soon
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Stop Losing Money on
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Broken GA4 Setup
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Most GA4 setups are <strong className="text-orange-400">fundamentally broken</strong>. 
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
                      className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg shadow-orange-600/25 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
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
              <h2 className="text-4xl font-bold text-white mb-6">
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
              <h2 className="text-4xl font-bold text-white mb-6">
                The <span className="text-orange-400">Complete Solution</span> You've Been Waiting For
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
                  <div key={index} className="bg-black/60 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/25">
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
              <h3 className="text-2xl font-bold text-white mb-6 text-center">What You'll Get:</h3>
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
        <section className="px-6 py-20 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
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
                      className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg shadow-orange-600/25 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
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
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">GA4 Helper</span>
              </div>
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <span>© 2025 GA4 Helper</span>
                <span>•</span>
                <span>Built for marketers, by marketers</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Hidden form for Netlify Forms detection */}
        <div style={{ display: 'none' }}>
          <form name="ga4-helper-newsletter" data-netlify="true">
            <input type="email" name="email" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default GA4HelperLanding;
