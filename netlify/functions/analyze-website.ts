'use client';

import React, { useState } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, AlertCircle, Clock, BarChart3, Settings, Link2, Search, ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';

interface PageAnalysis {
  url: string;
  status: 'success' | 'error' | 'analyzing';
  gtmFound: boolean;
  ga4Found: boolean;
  gtmContainers: string[];
  ga4Properties: string[];
  error?: string;
  responseTime?: number;
}

interface CrawlResults {
  crawlSummary: {
    totalPagesDiscovered: number;
    pagesAnalyzed: number;
    successfulAnalysis: number;
    pagesWithErrors: number;
    pagesWithGTM: number;
    pagesWithGA4: number;
    tagCoverage: number;
    isComplete: boolean;
    estimatedPagesRemaining: number;
  };
  pageDetails: PageAnalysis[];
  errorPages: PageAnalysis[];
  untaggedPages: PageAnalysis[];
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
}

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [action, setAction] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [crawlResults, setCrawlResults] = useState<CrawlResults | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your GA4 & GTM specialist. I can help you with implementation, troubleshooting, and tracking setup. How can I assist you today?",
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "For GA4 ecommerce tracking, you'll need to implement the new event structure. Here's how to set up purchase events...",
        "GTM's dataLayer.push() should include these specific parameters for GA4 compatibility...",
        "The issue you're describing usually happens when the GA4 config tag fires after the event tag. Try adjusting your trigger priorities..."
      ];
      
      const aiResponse: Message = {
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        code: `gtag('event', 'purchase', {
  transaction_id: '12345',
  value: 25.42,
  currency: 'USD',
  items: [{
    item_id: 'SKU123',
    item_name: 'Example Product',
    category: 'Apparel',
    quantity: 1,
    price: 25.42
  }]
});`
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startSiteCrawl = async () => {
    if (!website.trim()) return;
    
    setIsAnalyzing(true);
    setCrawlResults(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8888' 
        : '';
        
      const response = await fetch(`${baseUrl}/.netlify/functions/analyze-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: website,
          crawlMode: 'sitewide',
          maxPages: 100 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setCrawlResults(result);
    } catch (error: unknown) {
      console.error('Error crawling site:', error);
      // Show error state
      setCrawlResults({
        crawlSummary: {
          totalPagesDiscovered: 0,
          pagesAnalyzed: 0,
          successfulAnalysis: 0,
          pagesWithErrors: 1,
          pagesWithGTM: 0,
          pagesWithGA4: 0,
          tagCoverage: 0,
          isComplete: true,
          estimatedPagesRemaining: 0
        },
        pageDetails: [],
        errorPages: [],
        untaggedPages: [],
        insights: [],
        recommendations: [`Crawl failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`],
        nextSteps: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTrackingCode = () => {
    if (!action.trim()) return;
    
    const eventName = action.toLowerCase().replace(/\s+/g, '_');
    const trackingCode = `// Track: ${action}
dataLayer.push({
  'event': '${eventName}',
  'engagement_time_msec': 100,
  'event_category': 'engagement',
  'custom_parameter_1': '${action}',
  'page_location': window.location.href,
  'page_title': document.title
});

// GTM Tag Configuration:
// Tag Type: Google Analytics: GA4 Event
// Configuration Tag: GA4-XXXXXX (your GA4 config tag)
// Event Name: ${eventName}
// Event Parameters:
//   engagement_time_msec: {{DLV - engagement_time_msec}}
//   event_category: {{DLV - event_category}}  
//   custom_parameter_1: {{DLV - custom_parameter_1}}
//   page_location: {{DLV - page_location}}
//   page_title: {{DLV - page_title}}

// Alternative gtag.js implementation:
gtag('event', '${eventName}', {
  'engagement_time_msec': 100,
  'event_category': 'engagement',
  'custom_parameter_1': '${action}'
});`;

    const newMessage: Message = {
      type: 'assistant',
      content: `Here's the GA4-compliant tracking implementation for "${action}":`,
      code: trackingCode,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 95) return 'text-green-600';
    if (coverage >= 80) return 'text-blue-600';
    if (coverage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCoverageStatus = (coverage: number) => {
    if (coverage >= 95) return 'Excellent';
    if (coverage >= 80) return 'Good';
    if (coverage >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">GA4 & GTM Assistant</h1>
            </div>
            <div className="text-sm text-gray-600">
              Complete Site-Wide Analytics Audit
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'audit', label: 'Site-Wide Audit', icon: Search },
              { id: 'chat', label: 'AI Assistant', icon: Send },
              { id: 'implement', label: 'Code Generator', icon: Code },
              { id: 'docs', label: 'Documentation', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'audit' && (
          <div className="space-y-8">
            {/* Lead Magnet Header */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Site-Wide GA4 & GTM Audit</h2>
              <p className="text-lg text-gray-600 mb-6">
                Comprehensive analysis of every page on your website. Find missing tags, implementation errors, and coverage gaps across your entire site.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-green-500 mr-1" />
                  <span>Full Site Crawl</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-green-500 mr-1" />
                  <span>Coverage Analysis</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Error Detection</span>
                </div>
              </div>
            </div>

            {/* Site Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyze Your Entire Website</h3>
              <div className="flex space-x-4">
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button
                  onClick={startSiteCrawl}
                  disabled={isAnalyzing}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isAnalyzing ? 'Crawling Site...' : 'Start Site Crawl'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This will discover and analyze every page on your website to check for GTM and GA4 implementation.
              </p>
            </div>

            {/* Crawl Results */}
            {crawlResults && (
              <div className="space-y-6">
                {/* Crawl Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Site-Wide Analysis Results</h3>
                  
                  {/* Coverage Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{crawlResults.crawlSummary.totalPagesDiscovered}</div>
                      <div className="text-sm text-gray-600">Pages Discovered</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{crawlResults.crawlSummary.pagesAnalyzed}</div>
                      <div className="text-sm text-gray-600">Pages Analyzed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getCoverageColor(crawlResults.crawlSummary.tagCoverage)}`}>
                        {crawlResults.crawlSummary.tagCoverage}%
                      </div>
                      <div className="text-sm text-gray-600">Tag Coverage</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{crawlResults.crawlSummary.pagesWithErrors}</div>
                      <div className="text-sm text-gray-600">Pages with Errors</div>
                    </div>
                  </div>

                  {/* Coverage Status */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tag Coverage Status</span>
                      <span className={`text-sm font-semibold ${getCoverageColor(crawlResults.crawlSummary.tagCoverage)}`}>
                        {getCoverageStatus(crawlResults.crawlSummary.tagCoverage)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          crawlResults.crawlSummary.tagCoverage >= 95 ? 'bg-green-500' :
                          crawlResults.crawlSummary.tagCoverage >= 80 ? 'bg-blue-500' :
                          crawlResults.crawlSummary.tagCoverage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${crawlResults.crawlSummary.tagCoverage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Implementation Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Settings className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-900">GTM Implementation</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{crawlResults.crawlSummary.pagesWithGTM}</div>
                      <div className="text-sm text-gray-600">pages with GTM containers</div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-semibold text-gray-900">GA4 Implementation</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">{crawlResults.crawlSummary.pagesWithGA4}</div>
                      <div className="text-sm text-gray-600">pages with GA4 properties</div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                {crawlResults.insights.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                    <div className="space-y-3">
                      {crawlResults.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Untagged Pages */}
                {crawlResults.untaggedPages.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages Missing Analytics Tracking</h3>
                    <div className="space-y-2">
                      {crawlResults.untaggedPages.map((page, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-700 font-mono">{page.url}</span>
                          </div>
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                    {crawlResults.untaggedPages.length >= 20 && (
                      <p className="text-sm text-gray-500 mt-3">
                        Showing first 20 untagged pages. Total untagged: {crawlResults.crawlSummary.successfulAnalysis - Math.max(crawlResults.crawlSummary.pagesWithGTM, crawlResults.crawlSummary.pagesWithGA4)}
                      </p>
                    )}
                  </div>
                )}

                {/* Error Pages */}
                {crawlResults.errorPages.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pages with Analysis Errors</h3>
                    <div className="space-y-2">
                      {crawlResults.errorPages.map((page, index) => (
                        <div key={index} className="flex items-start justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-700 font-mono">{page.url}</span>
                            </div>
                            {page.error && (
                              <p className="text-xs text-gray-500 mt-1 ml-7">{page.error}</p>
                            )}
                          </div>
                          <a 
                            href={page.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Recommendations</h3>
                  <div className="space-y-3">
                    {crawlResults.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready for the Complete GA4 Audit?</h3>
                  <p className="text-gray-700 mb-4">
                    This site-wide crawl shows your tag implementation coverage. For a complete 25-point GA4 configuration audit including property settings, integrations, and advanced features, connect your GA4 account.
                  </p>
                  <div className="space-y-2 mb-4">
                    {crawlResults.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Connect GA4 for Complete Audit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">GA4 & GTM AI Assistant</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex-1 max-h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.code && (
                        <div className="mt-2 p-2 bg-gray-900 rounded text-green-400 text-xs font-mono overflow-x-auto">
                          <pre>{msg.code}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about GA4 or GTM..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'implement' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">GA4 Event Code Generator</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., Download PDF pricing guide"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button
                  onClick={generateTrackingCode}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Generate GA4 Code
                </button>
              </div>
            </div>

            {messages.filter(msg => msg.code).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Code</h3>
                {messages.filter(msg => msg.code).slice(-1).map((msg, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-700 mb-3">{msg.content}</p>
                    <div className="p-4 bg-gray-900 rounded-lg text-green-400 text-sm font-mono overflow-x-auto">
                      <pre>{msg.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
