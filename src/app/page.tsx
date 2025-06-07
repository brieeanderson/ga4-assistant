'use client';

import React, { useState } from 'react';
import { Send, Globe, Code, CheckCircle, BookOpen, BarChart3, Search, User, Activity, Terminal, Cpu } from 'lucide-react';

const HandDrawnGA4Assistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [analysisType, setAnalysisType] = useState('sitewide');

  // Simplified hand-drawn SVG elements
  const HandDrawnCircle = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path d="M20 50C20 35 25 20 40 15C55 10 70 15 80 25C90 35 85 50 80 65C75 80 60 85 45 80C30 75 20 65 20 50Z" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
    </svg>
  );

  const HandDrawnArrow = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 40" fill="none">
      <path d="M10 20L80 18M80 18L72 12M80 18L74 26" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const HandDrawnStar = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path d="M50 15L58 38L82 40L65 58L70 82L50 70L30 82L35 58L18 40L42 38L50 15Z" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-xl relative">
        <HandDrawnCircle className="absolute top-4 right-20 w-8 h-8 text-red-500/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  GA4 ANALYTICS
                  <span className="text-red-400 ml-2">AUDIT</span>
                </h1>
                <p className="text-sm text-red-300 font-medium">
                  by BEAST Analytics
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
                <span className="text-sm text-gray-300">Professional Analytics Assessment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900/80 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1">
            {[
              { id: 'audit', label: 'Website Audit', icon: Search },
              { id: 'chat', label: 'AI Assistant', icon: Send },
              { id: 'implement', label: 'Code Generator', icon: Code },
              { id: 'docs', label: 'Documentation', icon: BookOpen }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center space-x-2 py-4 px-6 font-semibold text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="tracking-wide">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'audit' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative">
              <HandDrawnStar className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400/30" />
              <HandDrawnArrow className="absolute bottom-4 left-16 w-16 h-8 text-yellow-400/25 rotate-12" />
              
              <div className="relative bg-gray-900 rounded-2xl p-12 border border-gray-700 shadow-2xl">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
                    <Terminal className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 text-sm font-medium">Advanced Analytics Auditing</span>
                  </div>
                  
                  <h2 className="text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                    COMPLETE GA4 & GTM
                    <br />
                    <span className="text-red-400">WEBSITE AUDIT</span>
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Deep analytics assessment with real-time tracking detection, 
                    configuration analysis, and actionable optimization recommendations
                  </p>
                  
                  <div className="flex items-center justify-center space-x-8 text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Real-time Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Complete Coverage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Expert Insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Type Selection */}
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 shadow-xl">
              <div className="flex items-center space-x-3 mb-8">
                <Cpu className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-bold text-white">
                  CHOOSE YOUR ANALYSIS METHOD
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    id: 'single',
                    title: 'SINGLE PAGE',
                    subtitle: 'Precision Analysis',
                    icon: Globe,
                    description: 'Detailed GA4 configuration audit for a specific page'
                  },
                  {
                    id: 'sitewide',
                    title: 'SITE-WIDE',
                    subtitle: 'Complete Coverage',
                    icon: Search,
                    description: 'Comprehensive website crawl analyzing tracking coverage'
                  },
                  {
                    id: 'ga4account',
                    title: 'GA4 ACCOUNT',
                    subtitle: 'Property Deep Dive',
                    icon: BarChart3,
                    description: 'Complete 25-point property assessment with API access'
                  }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAnalysisType(option.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                      analysisType === option.id
                        ? 'border-red-500 bg-red-500/10 shadow-xl shadow-red-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">
                          {option.title}
                        </h4>
                        <p className={`text-sm font-medium mb-3 ${
                          analysisType === option.id ? 'text-red-300' : 'text-gray-400'
                        }`}>
                          {option.subtitle}
                        </p>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Input Section */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Enter your website URL (e.g., https://example.com)"
                    className="flex-1 bg-gray-900/50 border border-gray-600 text-white px-4 py-4 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 font-medium"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                    START ANALYSIS
                  </button>
                </div>
              </div>
            </div>

            {/* Results Preview */}
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-red-400" />
                  <h3 className="text-2xl font-bold text-white">
                    ANALYSIS RESULTS PREVIEW
                  </h3>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                  <span className="text-green-400 text-sm font-medium">Live Demo</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: 'GTM-XXXXX', subtitle: 'Google Tag Manager', status: 'Detected', color: 'green', icon: Code },
                  { title: 'G-XXXXXX', subtitle: 'GA4 Property', status: 'Active', color: 'green', icon: BarChart3 },
                  { title: '95%', subtitle: 'Coverage Score', status: 'Excellent', color: 'yellow', icon: CheckCircle }
                ].map((item) => (
                  <div key={item.title} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
                    <div className="flex items-center space-x-3 mb-4">
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.subtitle}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {item.title}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.color === 'green' ? 'bg-green-500' : 
                        item.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        item.color === 'green' ? 'text-green-400' : 
                        item.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">
                      CONNECT YOUR GA4 ACCOUNT FOR COMPLETE AUDIT
                    </h4>
                    <p className="text-gray-300">Get detailed configuration analysis, property insights, and actionable recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-8">
              <Send className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">
                GA4 & GTM AI ASSISTANT
              </h2>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium mb-2">Hi! I'm your GA4 & GTM specialist.</p>
                  <p className="text-gray-300">I can help you with implementation, troubleshooting, and tracking setup.</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about GA4 setup, tracking issues..."
                className="flex-1 bg-gray-800/50 border border-gray-600 text-white px-4 py-4 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Code Generator Tab */}
        {activeTab === 'implement' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">GA4 Event Code Generator</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Describe your tracking event..."
                className="w-full bg-gray-800/50 border border-gray-600 text-white px-4 py-4 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg">
                Generate Code
              </button>
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-700 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">GA4 & GTM Documentation</h2>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">1. Set Up Google Analytics 4</h3>
                <p className="text-gray-400 text-sm">Create a new GA4 property in your Google Analytics account</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">2. Install Google Tag Manager</h3>
                <p className="text-gray-400 text-sm">GTM makes it easier to manage all your tracking codes</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">3. Connect GA4 to GTM</h3>
                <p className="text-gray-400 text-sm">Create a GA4 Configuration tag in GTM</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-300">
                Powered by <span className="text-red-400 font-bold">BEAST ANALYTICS</span>
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              Professional analytics auditing since 2011
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandDrawnGA4Assistant;
