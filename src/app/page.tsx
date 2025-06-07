'use client';

import React, { useState } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, User, LogOut, Activity, Terminal, Cpu, Database } from 'lucide-react';

const HandDrawnGA4Assistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [action, setAction] = useState('');
  const [analysisType, setAnalysisType] = useState('sitewide');

  // Hand-drawn SVG elements
  const HandDrawnCircle = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 50C20 35 25 20 40 15C55 10 70 15 80 25C90 35 85 50 80 65C75 80 60 85 45 80C30 75 20 65 20 50Z" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
    </svg>
  );

  const HandDrawnArrow = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20L80 18M80 18L72 12M80 18L74 26" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const HandDrawnBox = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 15L85 18L82 65L18 62Z" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
    </svg>
  );

  const HandDrawnStar = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15L58 38L82 40L65 58L70 82L50 70L30 82L35 58L18 40L42 38L50 15Z" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const HandDrawnSpiral = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10C65 15 80 30 75 50C70 70 45 80 30 65C15 50 25 25 45 20C60 15 70 35 60 50C50 65 35 60 30 45" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
    </svg>
  );

  const HandDrawnZigzag = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30L25 10L40 30L55 10L70 30L85 10" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const HandDrawnScribble = ({ className = "" }) => (
    <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30C15 25 20 35 25 30C30 25 35 35 40 30C45 25 50 35 50 30M20 20C25 15 30 25 35 20M25 40C30 35 35 45 40 40" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Background scattered elements */}
      <HandDrawnCircle className="absolute top-20 right-40 w-16 h-16 text-red-500/8" />
      <HandDrawnStar className="absolute top-60 left-20 w-12 h-12 text-yellow-400/8" />
      <HandDrawnSpiral className="absolute bottom-40 right-60 w-20 h-20 text-red-500/6" />

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        <HandDrawnCircle className="absolute top-4 right-20 w-8 h-8 text-red-500/20" />
        <HandDrawnStar className="absolute bottom-2 left-32 w-6 h-6 text-yellow-400/20" />
        <HandDrawnSpiral className="absolute top-6 left-60 w-10 h-10 text-red-500/15" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg relative">
                  <Activity className="w-6 h-6 text-white" />
                  <HandDrawnCircle className="absolute -inset-2 w-16 h-16 text-yellow-400/40" />
                </div>
              </div>
              <div className="relative">
                <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  GA4 ANALYTICS
                  <span className="text-red-400 ml-2 font-light">AUDIT</span>
                </h1>
                <HandDrawnZigzag className="absolute -bottom-2 left-0 w-20 h-4 text-red-500/30" />
                <p className="text-sm text-red-300 font-medium tracking-wide">
                  by BEAST Analytics
                </p>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                <span className="text-sm text-gray-300">Professional Analytics Assessment</span>
              </div>
              <HandDrawnArrow className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-4 text-red-500/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 relative">
        <HandDrawnScribble className="absolute top-2 right-16 w-6 h-6 text-red-500/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1">
            {[
              { id: 'audit', label: 'Website Audit', icon: Search },
              { id: 'chat', label: 'AI Assistant', icon: Send },
              { id: 'implement', label: 'Code Generator', icon: Code },
              { id: 'docs', label: 'Documentation', icon: BookOpen }
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center space-x-2 py-4 px-6 font-semibold text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                <tab.icon className="w-4 h-4" />
                <span className="tracking-wide">{tab.label}</span>
                {activeTab === tab.id && (
                  <>
                    <svg className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-2" viewBox="0 0 60 8" fill="none">
                      <path d="M5 4C15 2 25 6 35 4C45 2 55 5 55 4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                    <HandDrawnStar className="absolute -top-2 -right-1 w-4 h-4 text-yellow-400/60" />
                  </>
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
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 rounded-2xl blur-3xl"></div>
              
              <HandDrawnStar className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400/30" />
              <HandDrawnCircle className="absolute top-8 right-12 w-12 h-12 text-red-500/20" />
              <HandDrawnArrow className="absolute bottom-4 left-16 w-16 h-8 text-yellow-400/25 rotate-12" />
              <HandDrawnSpiral className="absolute top-16 left-1/3 w-10 h-10 text-red-500/15" />
              
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6 relative">
                    <Terminal className="w-4 h-4 text-red-400" />
                    <span className="text-red-300 text-sm font-medium">Advanced Analytics Auditing</span>
                    <HandDrawnCircle className="absolute -right-3 -top-2 w-6 h-6 text-yellow-400/40" />
                  </div>
                  
                  <h2 className="text-6xl font-black text-white mb-6 tracking-tight leading-tight relative" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    COMPLETE GA4 & GTM
                    <HandDrawnSpiral className="absolute -left-8 top-4 w-12 h-12 text-yellow-400/20" />
                    <br />
                    <span className="text-red-400">WEBSITE AUDIT</span>
                    <HandDrawnBox className="absolute -right-8 top-4 w-20 h-16 text-red-500/15" />
                  </h2>
                  
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed relative">
                    Deep analytics assessment with real-time tracking detection, 
                    configuration analysis, and actionable optimization recommendations
                    <HandDrawnScribble className="absolute -right-8 top-0 w-8 h-8 text-yellow-400/30" />
                  </p>
                  
                  <div className="flex items-center justify-center space-x-8 text-gray-400">
                    {[
                      { text: 'Real-time Analysis' },
                      { text: 'Complete Coverage' },
                      { text: 'Expert Insights' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 relative">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">{item.text}</span>
                        {index === 0 && <HandDrawnCircle className="absolute -top-4 -right-2 w-6 h-6 text-red-500/20" />}
                        {index === 1 && <HandDrawnStar className="absolute -top-4 -right-2 w-6 h-6 text-yellow-400/20" />}
                        {index === 2 && <HandDrawnBox className="absolute -top-4 -right-2 w-6 h-6 text-red-500/20" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Type Selection */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-xl relative">
              <HandDrawnStar className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400/30" />
              <HandDrawnSpiral className="absolute top-4 left-4 w-10 h-10 text-red-500/15" />
              
              <div className="flex items-center space-x-3 mb-8 relative">
                <Cpu className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  CHOOSE YOUR ANALYSIS METHOD
                </h3>
                <HandDrawnArrow className="absolute -bottom-2 left-8 w-12 h-6 text-red-500/30" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    id: 'single',
                    title: 'SINGLE PAGE',
                    subtitle: 'Precision Analysis',
                    icon: Globe,
                    gradient: 'from-blue-500 to-blue-600',
                    description: 'Detailed GA4 configuration audit for a specific page'
                  },
                  {
                    id: 'sitewide',
                    title: 'SITE-WIDE',
                    subtitle: 'Complete Coverage',
                    icon: Search,
                    gradient: 'from-red-500 to-red-600',
                    description: 'Comprehensive website crawl analyzing tracking coverage'
                  },
                  {
                    id: 'ga4account',
                    title: 'GA4 ACCOUNT',
                    subtitle: 'Property Deep Dive',
                    icon: BarChart3,
                    gradient: 'from-purple-500 to-purple-600',
                    description: 'Complete 25-point property assessment with API access'
                  }
                ].map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => setAnalysisType(option.id)}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] hover:-translate-y-1 ${
                      analysisType === option.id
                        ? 'border-red-500 bg-red-500/10 shadow-xl shadow-red-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    {index === 0 && <HandDrawnCircle className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400/30" />}
                    {index === 1 && <HandDrawnStar className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400/30" />}
                    {index === 2 && <HandDrawnBox className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400/30" />}
                    
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center relative`}>
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
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
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 relative">
                <HandDrawnArrow className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 text-red-500/40 rotate-180" />
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Enter your website URL (e.g., https://example.com)"
                      className="w-full bg-gray-900/50 border border-gray-600 text-white px-4 py-4 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 font-medium transition-all"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/25 relative" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    START ANALYSIS
                    <HandDrawnStar className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400/60" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Preview */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-xl relative">
              <HandDrawnCircle className="absolute top-4 right-8 w-10 h-10 text-red-500/20" />
              <HandDrawnBox className="absolute bottom-4 left-4 w-8 h-6 text-yellow-400/20" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3 relative">
                  <BarChart3 className="w-6 h-6 text-red-400" />
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    ANALYSIS RESULTS PREVIEW
                  </h3>
                  <HandDrawnArrow className="absolute -bottom-2 left-4 w-12 h-6 text-red-500/30" />
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 relative">
                  <span className="text-green-400 text-sm font-medium">Live Demo</span>
                  <HandDrawnStar className="absolute -top-1 -right-1 w-4 h-4 text-green-400/40" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: 'GTM-XXXXX', subtitle: 'Google Tag Manager', status: 'Detected', color: 'green', icon: Code },
                  { title: 'G-XXXXXX', subtitle: 'GA4 Property', status: 'Active', color: 'green', icon: BarChart3 },
                  { title: '95%', subtitle: 'Coverage Score', status: 'Excellent', color: 'yellow', icon: CheckCircle }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all relative">
                    {index === 0 && <HandDrawnCircle className="absolute -top-2 -right-2 w-6 h-6 text-red-500/20" />}
                    {index === 1 && <HandDrawnStar className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400/20" />}
                    {index === 2 && <HandDrawnBox className="absolute -top-2 -right-2 w-6 h-6 text-red-500/20" />}
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400">{item.subtitle}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
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

              <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 border border-red-500/20 rounded-xl p-6 relative">
                <HandDrawnArrow className="absolute top-2 right-4 w-8 h-4 text-yellow-400/40" />
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
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
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 shadow-xl relative">
            <HandDrawnStar className="absolute -top-3 -right-3 w-8 h-8 text-yellow-400/30" />
            
            <div className="flex items-center space-x-3 mb-8">
              <Send className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                GA4 & GTM AI ASSISTANT
              </h2>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700 relative">
              <HandDrawnBox className="absolute -top-2 -left-2 w-8 h-6 text-yellow-400/30" />
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
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
                className="flex-1 bg-gray-800/50 border border-gray-600 text-white px-4 py-4 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 font-medium"
              />
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 mt-16 relative">
        <HandDrawnCircle className="absolute top-4 left-8 w-6 h-6 text-red-500/20" />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-300">
                Powered by <span className="text-red-400 font-bold" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BEAST ANALYTICS</span>
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
