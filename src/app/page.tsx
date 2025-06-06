'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, AlertCircle, Clock, BarChart3, Search, User, LogOut } from 'lucide-react';

// Import our OAuth hook
import { useOAuth } from '@/hooks/useOAuth';

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

interface GA4Property {
  name: string;
  propertyId: string;
  displayName: string;
  timeZone?: string;
  currencyCode?: string;
}

interface GA4Audit {
  property: {
    displayName: string;
    name: string;
    timeZone?: string;
    currencyCode?: string;
  };
  dataStreams: Array<{
    displayName: string;
    type: string;
    name: string;
    webStreamData?: {
      defaultUri: string;
      measurementId: string;
    };
  }>;
  conversions: Array<{
    eventName: string;
    createTime: string;
    countingMethod?: string;
  }>;
  audit: {
    propertySettings: { [key: string]: { status: string; value: string; recommendation: string; } };
    dataCollection: { [key: string]: { status: string; value: string; recommendation: string; } };
    conversions: { [key: string]: { status: string; value: string; recommendation: string; } };
    integrations: { [key: string]: { status: string; value: string; recommendation: string; } };
  };
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
  const [analysisType, setAnalysisType] = useState<'single' | 'sitewide' | 'ga4account'>('sitewide');
  const [ga4Properties, setGA4Properties] = useState<GA4Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [ga4Audit, setGA4Audit] = useState<GA4Audit | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your GA4 & GTM specialist. I can help you with implementation, troubleshooting, and tracking setup. How can I assist you today?",
      timestamp: new Date()
    }
  ]);

  // OAuth hook
  const { isAuthenticated, userEmail, login, logout, isLoading: oauthLoading, accessToken } = useOAuth();

  const fetchGA4Properties = useCallback(async () => {
    if (!accessToken) return;
    
    setIsAnalyzing(true);
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      if (!response.ok) throw new Error('Failed to fetch GA4 properties');
      
      const result = await response.json();
      if (result.type === 'property_list') {
        setGA4Properties(result.properties || []);
      }
    } catch (error) {
      console.error('Error fetching GA4 properties:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [accessToken]);

  // Check for connection success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      setAnalysisType('ga4account');
      fetchGA4Properties();
    }
  }, [isAuthenticated, fetchGA4Properties]);

  const runGA4Audit = async () => {
    if (!selectedProperty || !accessToken) return;
    
    setIsAnalyzing(true);
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, propertyId: selectedProperty })
      });

      if (!response.ok) throw new Error('Failed to run GA4 audit');
      
      const result = await response.json();
      setGA4Audit(result);
    } catch (error) {
      console.error('Error running GA4 audit:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const analyzeWebsite = async () => {
    if (!website.trim()) return;
    
    setIsAnalyzing(true);
    
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
          crawlMode: analysisType,
          maxPages: analysisType === 'sitewide' ? 100 : 1
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Analysis result:', result);
      
    } catch (error: unknown) {
      console.error('Error analyzing website:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected':
      case 'complete':
      case 'configured':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not-detected':
      case 'incomplete':
      case 'missing':
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
      case 'configured':
        return 'bg-green-50 border-green-200';
      case 'not-detected':
      case 'incomplete':
      case 'missing':
        return 'bg-red-50 border-red-200';
      case 'unknown':
      case 'info':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // GA4 Connection Component
  const GA4Connection = () => {
    if (oauthLoading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">GA4 Account Connected</h3>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Connected Services:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ Google Analytics 4 (Read Access)</li>
              <li>✅ Google Tag Manager (Read Access)</li>
              <li>✅ User Profile Information</li>
            </ul>
          </div>

          {ga4Properties.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select GA4 Property:
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Choose a property...</option>
                {ga4Properties.map((property) => (
                  <option key={property.propertyId} value={property.propertyId}>
                    {property.displayName} ({property.propertyId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-3">
            {ga4Properties.length === 0 ? (
              <button
                onClick={fetchGA4Properties}
                disabled={isAnalyzing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isAnalyzing ? 'Loading Properties...' : 'Load GA4 Properties'}
              </button>
            ) : (
              <button
                onClick={runGA4Audit}
                disabled={!selectedProperty || isAnalyzing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isAnalyzing ? 'Running Audit...' : 'Run Complete GA4 Audit'}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your GA4 Account</h3>
          <p className="text-gray-700 mb-6">
            Get a complete 25-point audit of your GA4 property including configuration, 
            audiences, conversions, and integration status.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Property Analysis:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Timezone & Currency Settings</li>
                <li>• Data Retention Configuration</li>
                <li>• Enhanced Measurement Status</li>
                <li>• Industry Category Setup</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Advanced Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Audience Configurations</li>
                <li>• Conversion Goals Setup</li>
                <li>• Custom Dimensions/Metrics</li>
                <li>• Integration Status</li>
              </ul>
            </div>
          </div>

          <button
            onClick={login}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Connect GA4 Account
          </button>
          
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>Secure OAuth connection - we never store your passwords</span>
          </div>
        </div>
      </div>
    );
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
              Complete Website Analytics Audit
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'audit', label: 'Website Audit', icon: Search },
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete GA4 & GTM Website Audit</h2>
              <p className="text-lg text-gray-600 mb-6">
                Choose between frontend analysis, site-wide crawling, or complete GA4 account audit with direct API access.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-green-500 mr-1" />
                  <span>Real-time Analysis</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-green-500 mr-1" />
                  <span>Coverage Reports</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span>Expert Recommendations</span>
                </div>
              </div>
            </div>

            {/* Analysis Type Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Analysis Type</h3>
              
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setAnalysisType('single')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    analysisType === 'single'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Single Page Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Deep dive into one page with detailed GA4 configuration audit
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setAnalysisType('sitewide')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    analysisType === 'sitewide'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <Search className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">Site-Wide Crawl</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Analyze entire website for tag coverage and missing pages
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setAnalysisType('ga4account')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    analysisType === 'ga4account'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold text-gray-900">GA4 Account Audit</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete 25-point audit with direct GA4 API access
                    </p>
                  </div>
                </button>
              </div>

              {/* Conditional Content */}
              {analysisType === 'ga4account' ? (
                <GA4Connection />
              ) : (
                <>
                  <div className="flex space-x-4">
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Enter your website URL (e.g., https://example.com)"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                    <button
                      onClick={analyzeWebsite}
                      disabled={isAnalyzing}
                      className={`px-8 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 ${
                        analysisType === 'single' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {isAnalyzing ? 'Analyzing...' : `Start ${analysisType === 'single' ? 'Analysis' : 'Crawl'}`}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {analysisType === 'single' 
                      ? 'Deep analysis of GA4 configuration, events, and integrations for one page'
                      : 'Comprehensive crawl of your entire website to check tracking coverage'
                    }
                  </p>
                </>
              )}
            </div>

            {/* GA4 Audit Results */}
            {ga4Audit && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">GA4 Property Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{ga4Audit.property.displayName}</div>
                      <div className="text-sm text-gray-600">Property Name</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{ga4Audit.dataStreams.length}</div>
                      <div className="text-sm text-gray-600">Data Streams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{ga4Audit.conversions.length}</div>
                      <div className="text-sm text-gray-600">Conversion Events</div>
                    </div>
                  </div>
                </div>

                {/* Property Settings Audit */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Configuration</h3>
                  <div className="space-y-3">
                    {Object.entries(ga4Audit.audit.propertySettings).map(([key, item]) => (
                      <div key={key} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-sm text-gray-600">Current: {item.value}</div>
                            <div className="text-sm text-blue-600">💡 {item.recommendation}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
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

        {/* Implement Tab */}
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

            {/* Implementation Guides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Implementation Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">GTM Installation</h4>
                  <p className="text-sm text-gray-600 mb-3">Install Google Tag Manager on your website</p>
                  <div className="p-3 bg-gray-50 rounded text-xs font-mono">
                    {`<!-- Head -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>

<!-- Body -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`}
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">GA4 Direct Install</h4>
                  <p className="text-sm text-gray-600 mb-3">Install GA4 directly without GTM</p>
                  <div className="p-3 bg-gray-50 rounded text-xs font-mono">
                    {`<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">GA4 & GTM Documentation</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">1. Set Up Google Analytics 4</h4>
                      <p className="text-sm text-gray-600">Create a new GA4 property in your Google Analytics account</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">2. Install Google Tag Manager</h4>
                      <p className="text-sm text-gray-600">GTM makes it easier to manage all your tracking codes</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">3. Connect GA4 to GTM</h4>
                      <p className="text-sm text-gray-600">Create a GA4 Configuration tag in GTM</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Events</h3>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Page View</h4>
                      <p className="text-sm text-gray-600 mb-2">Automatically tracked with GA4 configuration</p>
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        gtag('config', 'G-XXXXXXXXXX');
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Custom Event</h4>
                      <p className="text-sm text-gray-600 mb-2">Track specific user actions</p>
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        gtag('event', 'button_click', {'{'}event_category: 'engagement'{'}'});
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900">E-commerce Purchase</h4>
                      <p className="text-sm text-gray-600 mb-2">Track transactions and revenue</p>
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        gtag('event', 'purchase', {'{'}transaction_id: '12345', value: 25.42, currency: 'USD'{'}'});
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Practices</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Use GTM for tag management</p>
                        <p className="text-sm text-gray-600">Easier to manage and update tracking codes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Implement Enhanced Measurement</p>
                        <p className="text-sm text-gray-600">Automatically track scrolls, outbound clicks, site search</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Set up Consent Mode</p>
                        <p className="text-sm text-gray-600">Comply with GDPR and privacy regulations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Test with GA4 DebugView</p>
                        <p className="text-sm text-gray-600">Verify events are firing correctly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
