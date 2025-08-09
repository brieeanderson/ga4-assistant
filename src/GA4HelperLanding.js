'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './components/common/Logo';
import ImageModal from './components/ImageModal';

const GA4HelperLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: "📊",
      title: "Data Collection Health",
      items: [
        "Custom dimension and metric validation",
        "Event parameter configuration audit", 
        "Data stream health analysis"
      ]
    },
    {
      icon: "🔗",
      title: "Advanced Tracking",
      items: [
        "Cross-domain tracking configuration",
        "Attribution model optimization",
        "Conversion window assessment",
        "Audience and goal setup review"
      ]
    },
    {
      icon: "⚙️",
      title: "Integration Audit",
      items: [
        "Google Ads linking verification",
        "BigQuery export configuration",
        "Search Console connection status"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-black-soft">
      {/* Header */}
      <header className="bg-gradient-to-b from-black to-brand-black-soft border-b border-brand-blue/15 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-black/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="medium" variant="white" />
                          <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/blog" className="text-gray-400 hover:text-brand-blue transition-colors text-sm font-medium">Blog</Link>
                  <a href="#beta-signup" className="btn-primary text-sm px-4 py-2">
                    <span>Free Audit</span>
                  </a>
                </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 text-center bg-radial-gradient">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/8 to-brand-blue-light/8"></div>
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 px-4 py-2 rounded-full text-sm font-medium text-brand-blue-light mb-8">
            <span>⚡</span>
            <span>Built off of experience and logic. Not recommendations from AI.</span>
          </div>
          
          <h1 className="logo-font text-4xl md:text-6xl text-white mb-6 leading-tight">
            <span className="brand-blue">discover hidden GA4 settings</span> <br />
            sabotaging your data
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Get a comprehensive audit of your Google Analytics 4 settings in under 5 minutes. 
            Identify the critical setup errors that are silently destroying your data quality—before 
            they cost you thousands in bad business decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#audit-cta" className="btn-primary">
              <span>🔍</span>
              <span>Start Your Free GA4 Audit</span>
            </a>
            <a href="#screenshot" className="btn-secondary">View Sample Report</a>
          </div>
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="py-24 bg-gradient-to-b from-brand-black-soft to-brand-gray-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="logo-font text-3xl md:text-5xl text-white mb-8">
              The Hidden <span className="text-red-400">GA4 Disasters</span> <br />
              Happening Right Now
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              85% of GA4 setups have critical flaws that business owners never discover until it's too late.
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">PII leakage that could trigger GDPR fines up to $10M</h3>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Missing cross-domain tracking causing your funnel to look broken</h3>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Incorrect attribution windows showing inconclusive conversion data</h3>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Unwanted referral traffic from payment processors inflating your traffic</h3>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-2xl flex-shrink-0">❌</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Loss of 85% of event data due to data retention settings</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-gradient-to-b from-brand-gray-dark to-brand-black-soft">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="logo-font text-3xl md:text-5xl text-white mb-8">
              The Only <span className="brand-blue">GA4 Settings Audit</span> <br />
              That Actually Matters
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Unlike generic "GA4 checkers," this audit was built by someone who's been teaching GA4 at the university level and training Fortune 500 teams since GA4 launched.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="flex items-start gap-4 p-6 bg-green-500/5 border border-green-500/20 rounded-xl">
              <span className="text-green-400 text-2xl flex-shrink-0">✅</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Real-Time API Analysis</h3>
                <p className="text-gray-300">Uses Google's actual Admin and Data API (not just your website code) to audit your live GA4 configuration</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-green-500/5 border border-green-500/20 rounded-xl">
              <span className="text-green-400 text-2xl flex-shrink-0">✅</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">30+ Critical Checkpoints</h3>
                <p className="text-gray-300">Every setting that impacts data quality, comprehensive reporting, and business insights</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-green-500/5 border border-green-500/20 rounded-xl">
              <span className="text-green-400 text-2xl flex-shrink-0">✅</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Priority-Weighted Scoring</h3>
                <p className="text-gray-300">Focus on what matters most—not every issue is created equal</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-green-500/5 border border-green-500/20 rounded-xl">
              <span className="text-green-400 text-2xl flex-shrink-0">✅</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Actionable Fix Instructions</h3>
                <p className="text-gray-300">Direct links and step-by-step instructions to resolve every issue found</p>
              </div>
            </div>
          </div>
          
          {/* Dashboard Screenshot integrated into solution */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
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
              
              <div className="mt-4 text-center">
                <p className="text-gray-600 leading-relaxed">
                  See exactly how the audit dashboard presents your GA4 configuration health with detailed scores and actionable recommendations.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-light font-medium transition-colors text-sm"
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


      {/* Authority/About Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="logo-font text-3xl md:text-5xl text-gray-900 mb-8">
              Built by the <span className="text-brand-blue">GA4 Expert</span> <br />
              Companies Actually Hire
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Brie E Anderson has spent the last 4 years specializing exclusively in Google Analytics 4:</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <span className="text-brand-blue text-2xl flex-shrink-0">🎓</span>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">University Instructor</h4>
                  <p className="text-gray-700">Teaching GA4 implementation at the academic level</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-brand-blue text-2xl flex-shrink-0">🏢</span>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Fortune 500 Trainer</h4>
                  <p className="text-gray-700">In-house GA4 training for major corporations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-brand-blue text-2xl flex-shrink-0">🔧</span>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Implementation Specialist</h4>
                  <p className="text-gray-700">Has personally audited and fixed dozens of GA4 setups</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-brand-blue text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">Data Quality Expert</h4>
                  <p className="text-gray-700">Knows what to look for when data doesn't seem "right"</p>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-brand-blue pl-6 py-4 bg-brand-blue/5 rounded-r-lg mb-6">
              <blockquote className="text-lg text-gray-700 italic mb-4">
                "I've seen businesses make million-dollar decisions based on GA4 data that was fundamentally broken from day one. The scary part? They had no idea."
              </blockquote>
              <blockquote className="text-lg text-gray-700 italic mb-4">
                "After 4 years of fixing other people's GA4 disasters, I built this tool to catch the problems before they happen."
              </blockquote>
              <cite className="text-brand-blue font-semibold">- Brie E Anderson</cite>
            </div>
            
            <div className="text-center">
              <a 
                href="https://www.linkedin.com/in/brieeanderson/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-light font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-brand-gray-dark to-brand-black-soft" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="logo-font text-3xl md:text-5xl text-white mb-6">
              Every Critical <span className="brand-blue">GA4 Setting</span>, Audited
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">Comprehensive analysis of every setting that impacts your data quality and business insights.</p>
          </div>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-brand-gray-medium border border-brand-blue/20 rounded-2xl p-8 hover:border-brand-blue hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="logo-font text-xl text-white mb-6 group-hover:text-brand-blue transition-colors">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="text-brand-blue text-sm mt-1">•</span>
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Lead Magnet CTA Section */}
      <section className="py-24 bg-gradient-to-r from-brand-blue/20 to-brand-blue-light/20" id="audit-cta">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="logo-font text-3xl md:text-5xl text-white mb-8">
            Get Your Free <span className="brand-blue">GA4 Health Score</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            See exactly what's broken (or working perfectly) in your GA4 setup.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white">Instant audit results in under 5 minutes</span>
            </div>
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white">Priority-ranked issues with impact ratings</span>
            </div>
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white">Step-by-step fix instructions for every problem found</span>
            </div>
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <span className="text-green-400 text-xl">✅</span>
              <span className="text-white">Professional-grade scoring system used by enterprise teams</span>
            </div>
          </div>
          
          <div className="mb-8">
            <a href="#beta-signup" className="btn-primary text-lg px-8 py-4">
              <span>🚀</span>
              <span>Start Your Free GA4 Audit</span>
            </a>
          </div>
          
          <p className="text-gray-400 text-sm">
            No credit card required • Results delivered instantly
          </p>
        </div>
      </section>

      {/* Beta Signup Section */}
      <section className="py-24 bg-gradient-to-b from-brand-black-soft to-brand-gray-dark" id="beta-signup">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="logo-font text-3xl text-white mb-6">
            Ready to Get Started?
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
