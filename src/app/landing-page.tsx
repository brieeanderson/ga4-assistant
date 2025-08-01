'use client';
import React from 'react';
import { Shield, CheckCircle, AlertTriangle, BarChart3, Users, Zap, ArrowRight, Database, Mail, Star, Clock } from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const upcomingFeatures = [
    {
      icon: Shield,
      title: "GA4 Audit Tool",
      description: "Comprehensive audit of your Google Analytics 4 setup to ensure reliable data collection and GDPR compliance.",
      status: "Coming Soon"
    },
    {
      icon: BarChart3,
      title: "Data Quality Monitor",
      description: "Real-time monitoring of your GA4 data quality with automated alerts and recommendations.",
      status: "In Development"
    },
    {
      icon: Users,
      title: "GA4 Courses",
      description: "Step-by-step courses to master Google Analytics 4 implementation and optimization.",
      status: "Planned"
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Expert Insights",
      description: "Built by analytics professionals with years of GA4 experience."
    },
    {
      icon: AlertTriangle,
      title: "Proactive Monitoring",
      description: "Identify issues before they impact your data and business decisions."
    },
    {
      icon: Database,
      title: "API-Powered Accuracy",
      description: "Uses official Google APIs for precise, real-time analysis."
    },
    {
      icon: Zap,
      title: "Actionable Recommendations",
      description: "Get specific, actionable steps to improve your GA4 setup."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Star className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Early Access Available</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Master Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                GA4 Analytics
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Professional tools and courses to help you implement, audit, and optimize Google Analytics 4. 
              Get early access to our comprehensive GA4 audit tool and educational resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/audit"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Shield className="h-5 w-5" />
                <span>Try GA4 Audit Tool</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <div className="text-gray-400 text-sm">
                <Clock className="h-4 w-4 inline mr-1" />
                Free during beta
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup Section */}
      <div className="relative max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Get Early Access</h2>
            <p className="text-gray-300 text-lg">
              Be the first to know when new tools and courses are available. 
              Get exclusive early access and special pricing.
            </p>
          </div>
          
          <div className="flex justify-center">
            <iframe 
              src="https://ga4fun.substack.com/embed" 
              width="480" 
              height="320" 
              style={{
                border: '1px solid #EEE', 
                background: 'white',
                borderRadius: '8px',
                maxWidth: '100%'
              }} 
              frameBorder="0" 
              scrolling="no"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What's Coming</h2>
          <p className="text-gray-300 text-lg">Our roadmap of tools and resources to help you master GA4</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {upcomingFeatures.map((feature, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <feature.icon className="h-8 w-8 text-blue-400" />
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                  {feature.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose GA4Helper?</h2>
          <p className="text-gray-300 text-lg">Professional-grade tools built by analytics experts</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <benefit.icon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
              <p className="text-gray-300 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 GA4Helper. Professional Google Analytics 4 tools and resources.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 