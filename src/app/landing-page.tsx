'use client';
import React from 'react';
import { Shield, CheckCircle, AlertTriangle, BarChart3, Users, Zap, ArrowRight, Database, Mail, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import Logo from '../components/common/Logo';

const LandingPage = () => {
  const upcomingFeatures = [
    {
      icon: Shield,
      title: "Configuration Score",
      description: "Get an instant score based on 50+ critical GA4 settings, weighted by importance to your data quality.",
      status: "Available Now"
    },
    {
      icon: BarChart3,
      title: "Priority Recommendations",
      description: "Receive actionable recommendations ranked by impact, with direct links to fix issues in GA4.",
      status: "Available Now"
    },
    {
      icon: Users,
      title: "Deep Configuration Audit",
      description: "Comprehensive analysis of property settings, data streams, events, and attribution configuration.",
      status: "Available Now"
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "API-Powered Accuracy",
      description: "Uses Google Analytics Admin API for real-time, precise configuration assessment."
    },
    {
      icon: AlertTriangle,
      title: "Critical Issue Detection",
      description: "Identify configuration gaps before they impact your business decisions."
    },
    {
      icon: Database,
      title: "Attribution Analysis",
      description: "Review your attribution model and conversion windows to ensure accurate conversion tracking."
    },
    {
      icon: Zap,
      title: "Integration Check",
      description: "Verify Google Ads linking, BigQuery exports, and other critical integrations."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-black-soft">
      {/* Header */}
      <header className="bg-gradient-to-b from-black to-brand-black-soft border-b border-brand-blue/20 px-4 py-4 sticky top-0 z-50 backdrop-blur-md bg-black/90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="medium" />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-400 hover:text-brand-blue transition-colors">Features</a>
            <a href="#dashboard" className="text-gray-400 hover:text-brand-blue transition-colors">Dashboard</a>
            <a href="#" className="text-gray-400 hover:text-brand-blue transition-colors">Documentation</a>
            <Link
              href="/audit"
              className="btn-primary"
            >
              Sign In with Google
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 to-brand-blue-light/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-brand-blue/10 border border-brand-blue/30 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-brand-blue" />
              <span className="text-brand-blue text-sm font-medium">Professional GA4 Audit Tool</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl social-gothic text-white mb-6">
              <span className="brand-blue">GA4 HELPER</span>
              <span className="block gradient-text">Professional Configuration Audit</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive Google Analytics 4 audit tool that ensures optimal setup, 
              reliable data collection, and actionable insights. Identify critical 
              configuration gaps before they impact your business decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/audit"
                className="btn-primary"
              >
                <Zap className="h-5 w-5" />
                <span>Start Free Audit</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <button className="btn-secondary">
                View Sample Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gradient-to-b from-brand-black-soft to-brand-gray-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl social-gothic text-white mb-4">
              <span className="brand-blue">POWERFUL</span> FEATURES
            </h2>
            <p className="text-gray-300 text-lg">Everything you need to ensure your GA4 setup is optimized</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="brand-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs bg-brand-blue/20 text-brand-blue px-2 py-1 rounded-full">
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-xl social-gothic text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20 bg-brand-black-soft">
        <div className="max-w-7xl mx-auto px-4">
          <div className="brand-card">
            <h2 className="text-3xl social-gothic text-white mb-4">
              <span className="brand-blue">GA4</span> Dashboard Preview
            </h2>
            <p className="text-gray-300 mb-8">
              See your GA4 configuration health at a glance
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl social-gothic brand-blue mb-2">85%</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Config Score</div>
              </div>
              <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl social-gothic brand-blue mb-2">12</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Issues Found</div>
              </div>
              <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl social-gothic brand-blue mb-2">4</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Critical Items</div>
              </div>
              <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl social-gothic brand-blue mb-2">8</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Optimizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-brand-gray-dark to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl social-gothic text-white mb-4">Why Choose GA4 Helper?</h2>
            <p className="text-gray-300 text-lg">Professional-grade tools built by analytics experts</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-blue/20 bg-black py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>GA4 Helper by <a href="#" className="text-brand-blue hover:text-brand-blue-light transition-colors">BEAST Analytics</a> | © 2024 All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 