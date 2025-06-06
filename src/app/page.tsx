'use client';

import React, { useState } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, AlertCircle, Clock, BarChart3, Settings, Link2 } from 'lucide-react';

interface SiteAnalysis {
  domain: string;
  gtmContainers: string[];
  ga4Properties: string[];
  currentSetup: {
    gtmInstalled: boolean;
    ga4Connected: boolean;
    enhancedEcommerce: boolean;
    serverSideTracking: boolean;
    crossDomainTracking: {
      enabled: boolean;
      domains: string[];
    };
    consentMode: boolean;
    debugMode: boolean;
  } | null;
  configurationAudit: {
    propertySettings: {
      [key: string]: {
        status: string;
        value: string;
        recommendation: string;
      };
    };
    dataCollection: {
      [key: string]: {
        status: string;
        value: string;
        recommendation: string;
      };
    };
    events: {
      [key: string]: {
        status: string;
        value: string;
        recommendation: string;
      };
    };
    integrations: {
      [key: string]: {
        status: string;
        value: string;
        recommendation: string;
      };
    };
  } | null;
  recommendations: string[];
  analysisMethod?: string;
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
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your GA4 & GTM specialist. I can help you with implementation, troubleshooting, and tracking setup. How can I assist you today?",
      timestamp: new Date()
    }
  ]);

  const [siteAnalysis, setSiteAnalysis] = useState<SiteAnalysis>({
    domain: '',
    gtmContainers: [],
    ga4Properties: [],
    currentSetup: null,
    configurationAudit: null,
    recommendations: []
  });

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
        "For GA4 Enhanced Ecommerce tracking, you'll need to implement the new event structure. Here's how to set up purchase events...",
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

  const analyzeSite = async () => {
    if (!website.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // For development, use localhost. For production, this will be your Netlify domain
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8888' 
        : '';
        
      const response = await fetch(`${baseUrl}/.netlify/functions/analyze-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: website }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setSiteAnalysis(result);
    } catch (error: unknown) {
      console.error('Error analyzing site:', error);
      // Fallback to mock data if analysis fails
      setSiteAnalysis({
        domain: website,
        gtmContainers: ['Analysis failed - check console'],
        ga4Properties: ['Please try again'],
        currentSetup: {
          gtmInstalled: false,
          ga4Connected: false,
          enhancedEcommerce: false,
          serverSideTracking: false,
          crossDomainTracking: { enabled: false, domains: [] },
          consentMode: false,
          debugMode: false
        },
        configurationAudit: {
          propertySettings: {
            timezone: { status: 'incomplete', value: 'Analysis failed', recommendation: 'Try again' },
            currency: { status: 'incomplete', value: 'Analysis failed', recommendation: 'Try again' }
          },
          dataCollection: {},
          events: {},
          integrations: {}
        },
        recommendations: [`Website analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTrackingCode = () => {
    if (!action.trim()) return;
    
    // Generate proper GA4 event structure based on action
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected':
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not-detected':
      case 'incomplete':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'unknown':
      case 'info':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected':
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'not-detected':
      case 'incomplete':
        return 'bg-red-50 border-red-200';
      case 'unknown':
      case 'info':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
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
              Real Website Analysis & GA4 Expert AI
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'audit', label: 'GA4 Website Audit', icon: CheckCircle },
              { id: 'chat', label: 'AI Assistant', icon: Send },
              { id: 'analyze', label: 'Advanced Analysis', icon: Globe },
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete GA4 & GTM Audit</h2>
              <p className="text-lg text-gray-600 mb-6">
                Get a comprehensive 25+ point analysis of your Google Analytics 4 and GTM implementation. Powered by real website crawling.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Real GTM Detection</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Live GA4 Analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Expert Recommendations</span>
                </div>
              </div>
            </div>

            {/* Site Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyze Your Website</h3>
              <div className="flex space-x-4">
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button
                  onClick={analyzeSite}
                  disabled={isAnalyzing}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This will crawl your website and detect actual GTM containers, GA4 properties, and configuration issues.
              </p>
            </div>

            {/* Analysis Results */}
            {siteAnalysis.domain && (
              <div className="space-y-6">
                {/* Detection Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Detection Summary</h3>
                    {siteAnalysis.analysisMethod && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {siteAnalysis.analysisMethod}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{siteAnalysis.gtmContainers.length}</div>
                      <div className="text-sm text-gray-600">GTM Containers</div>
                      {siteAnalysis.gtmContainers.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {siteAnalysis.gtmContainers.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{siteAnalysis.ga4Properties.length}</div>
                      <div className="text-sm text-gray-600">GA4 Properties</div>
                      {siteAnalysis.ga4Properties.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {siteAnalysis.ga4Properties.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{siteAnalysis.recommendations.length}</div>
                      <div className="text-sm text-gray-600">Recommendations</div>
                    </div>
                  </div>
                </div>

                {/* Comprehensive Configuration Audit */}
                {siteAnalysis.configurationAudit && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Complete GA4 Configuration Audit</h3>
                    
                    {/* Property Settings */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Settings className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Property Settings</h4>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(siteAnalysis.configurationAudit.propertySettings).map(([key, item]) => (
                          <div key={key} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    Current: {item.value}
                                  </div>
                                  <div className="text-sm text-blue-600 mt-1">
                                    💡 {item.recommendation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Data Collection */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Data Collection & Tracking</h4>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(siteAnalysis.configurationAudit.dataCollection).map(([key, item]) => (
                          <div key={key} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    Status: {item.value}
                                  </div>
                                  <div className="text-sm text-blue-600 mt-1">
                                    💡 {item.recommendation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Events */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Zap className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Event Configuration</h4>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(siteAnalysis.configurationAudit.events).map(([key, item]) => (
                          <div key={key} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    Status: {item.value}
                                  </div>
                                  <div className="text-sm text-blue-600 mt-1">
                                    💡 {item.recommendation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Integrations */}
                    <div>
                      <div className="flex items-center mb-4">
                        <Link2 className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Integrations</h4>
                      </div>
                      <div className="space-y-3">
                        {Object.entries(siteAnalysis.configurationAudit.integrations).map(([key, item]) => (
                          <div key={key} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                {getStatusIcon(item.status)}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {item.value}
                                  </div>
                                  <div className="text-sm text-blue-600 mt-1">
                                    💡 {item.recommendation}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Action Items</h3>
                  <div className="space-y-3">
                    {siteAnalysis.recommendations.slice(0, 8).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                      </div>
                    ))}
                  </div>
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
