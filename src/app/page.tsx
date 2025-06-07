'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, User, LogOut, ArrowRight } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';

interface GA4Property {
  name: string;
  propertyId: string;
  displayName: string;
  timeZone?: string;
  currencyCode?: string;
  accountName?: string;
}

interface GA4Audit {
  property: {
    displayName: string;
    name: string;
    timeZone?: string;
    currencyCode?: string;
    industryCategory?: string;
  };
  dataStreams: Array<{
    displayName: string;
    type: string;
    name: string;
  }>;
  keyEvents: Array<{
    eventName: string;
    createTime: string;
  }>;
  audit: {
    propertySettings: { [key: string]: { status: string; value: string; recommendation: string; } };
    dataCollection: { [key: string]: { status: string; value: string; recommendation: string; } };
    keyEvents: { [key: string]: { status: string; value: string; recommendation: string; } };
    integrations: { [key: string]: { status: string; value: string; recommendation: string; } };
  };
  userInfo?: {
    email: string;
    name: string;
  };
}

interface WebsiteAnalysis {
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
  };
  configurationAudit: Record<string, unknown>;
  recommendations: string[];
  analysisMethod: string;
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
  pageDetails: Record<string, unknown>[];
  errorPages: Record<string, unknown>[];
  untaggedPages: Record<string, unknown>[];
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
  const [analysisType, setAnalysisType] = useState<'single' | 'sitewide' | 'ga4account'>('sitewide');
  const [ga4Properties, setGA4Properties] = useState<GA4Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [ga4Audit, setGA4Audit] = useState<GA4Audit | null>(null);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [crawlResults, setCrawlResults] = useState<CrawlResults | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your GA4 & GTM specialist. I can help you with implementation, troubleshooting, and tracking setup. How can I assist you today?",
      timestamp: new Date()
    }
  ]);

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
    
    setTimeout(() => {
      const aiResponse: Message = {
        type: 'assistant',
        content: "For GA4 Key Events tracking, you'll need to implement the new event structure...",
        timestamp: new Date(),
        code: `gtag('event', 'purchase', {
  transaction_id: '12345',
  value: 25.42,
  currency: 'USD'
});`
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const analyzeWebsite = async () => {
    if (!website.trim()) return;
    
    setIsAnalyzing(true);
    setWebsiteAnalysis(null);
    setCrawlResults(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      
      // Check if it's crawl results or single page analysis
      if (result.crawlSummary) {
        setCrawlResults(result);
      } else {
        setWebsiteAnalysis(result);
      }
      
    } catch (error: unknown) {
      console.error('Error analyzing website:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTrackingCode = () => {
    if (!action.trim()) return;
    
    const eventName = action.toLowerCase().replace(/\s+/g, '_');
    const trackingCode = `gtag('event', '${eventName}', {
  'event_category': 'engagement',
  'custom_parameter_1': '${action}'
});`;

    const newMessage: Message = {
      type: 'assistant',
      content: `Here's the GA4 tracking code for "${action}":`,
      code: trackingCode,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const GA4Connection = () => {
    if (oauthLoading) {
      return (
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">GA4 Account Connected</h3>
                <p className="text-sm text-gray-400">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-white mb-2">Connected Services:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✅ Google Analytics 4 (Read Access)</li>
              <li>✅ Google Tag Manager (Read Access)</li>
              <li>✅ User Profile Information</li>
            </ul>
          </div>

          {ga4Properties.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select GA4 Property:
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {isAnalyzing ? 'Loading Properties...' : 'Load GA4 Properties'}
              </button>
            ) : (
              <button
                onClick={runGA4Audit}
                disabled={!selectedProperty || isAnalyzing}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {isAnalyzing ? 'Running Audit...' : 'Run Complete GA4 Audit'}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your GA4 Account</h3>
          <p className="text-gray-300 mb-6">
            Get a complete 25-point audit of your GA4 property including configuration, 
            key events, data streams, and integration status.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
            <div className="space-y-3">
              <h4 className="font-medium text-white">Property Analysis:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Timezone & Currency Settings</li>
                <li>• Data Retention Configuration</li>
                <li>• Enhanced Measurement Status</li>
                <li>• Industry Category Setup</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Advanced Features:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Key Events Configuration</li>
                <li>• Data Streams Setup</li>
                <li>• Custom Dimensions/Metrics</li>
                <li>• Integration Status</li>
              </ul>
            </div>
          </div>

          <button
            onClick={login}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
          >
            Connect GA4 Account
          </button>
          
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>Secure OAuth connection - we never store your passwords</span>
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'configured': return 'bg-green-900 text-green-300 border-green-700';
        case 'missing': return 'bg-red-900 text-red-300 border-red-700';
        case 'detected': return 'bg-green-900 text-green-300 border-green-700';
        case 'not-detected': return 'bg-red-900 text-red-300 border-red-700';
        case 'unknown': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
        case 'requires_manual_check': return 'bg-blue-900 text-blue-300 border-blue-700';
        default: return 'bg-gray-800 text-gray-300 border-gray-600';
      }
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(status)}`}>
        {status.replace('_', ' ').replace('-', ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">GA4 & GTM Assistant</h1>
            </div>
            <div className="text-sm text-gray-400">
              Complete Website Analytics Audit
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800">
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
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
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
            <div className="text-center bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-8 border border-red-800">
              <h2 className="text-3xl font-bold text-white mb-4">Complete GA4 & GTM Website Audit</h2>
              <p className="text-lg text-gray-300 mb-6">
                Choose between frontend analysis, site-wide crawling, or complete GA4 account audit with direct API access.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-green-400 mr-1" />
                  <span>Real-time Analysis</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-green-400 mr-1" />
                  <span>Coverage Reports</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  <span>Expert Recommendations</span>
                </div>
              </div>
            </div>

            {/* Analysis Type Selection */}
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Choose Analysis Type</h3>
              
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setAnalysisType('single')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    analysisType === 'single'
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-red-400" />
                    <h4 className="font-semibold text-white">Single Page Analysis</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Deep dive into one page with detailed GA4 configuration audit
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setAnalysisType('sitewide')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    analysisType === 'sitewide'
                      ? 'border-orange-500 bg-orange-900/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <Search className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                    <h4 className="font-semibold text-white">Site-Wide Crawl</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Analyze entire website for tag coverage and missing pages
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setAnalysisType('ga4account')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    analysisType === 'ga4account'
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <h4 className="font-semibold text-white">GA4 Account Audit</h4>
                    <p className="text-sm text-gray-400 mt-1">
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
                      className="flex-1 border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      onClick={analyzeWebsite}
                      disabled={isAnalyzing}
                      className={`px-8 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 ${
                        analysisType === 'single' 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-orange-600 hover:bg-orange-700'
                      }`}
                    >
                      {isAnalyzing ? 'Analyzing...' : `Start ${analysisType === 'single' ? 'Analysis' : 'Crawl'}`}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    {analysisType === 'single' 
                      ? 'Deep analysis of GA4 configuration, events, and integrations for one page'
                      : 'Comprehensive crawl of your entire website to check tracking coverage'
                    }
                  </p>
                </>
              )}
            </div>

            {/* Website Analysis Results */}
            {websiteAnalysis && (
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Website Analysis Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{websiteAnalysis.gtmContainers.length}</div>
                    <div className="text-sm text-gray-400">GTM Containers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{websiteAnalysis.ga4Properties.length}</div>
                    <div className="text-sm text-gray-400">GA4 Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{websiteAnalysis.recommendations.length}</div>
                    <div className="text-sm text-gray-400">Recommendations</div>
                  </div>
                </div>
                
                {websiteAnalysis.recommendations.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Key Recommendations:</h4>
                    <ul className="space-y-1">
                      {websiteAnalysis.recommendations.slice(0, 5).map((rec, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <ArrowRight className="w-3 h-3 mr-2 mt-0.5 text-red-400 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Crawl Results */}
            {crawlResults && (
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Site-Wide Crawl Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{crawlResults.crawlSummary.pagesAnalyzed}</div>
                    <div className="text-sm text-gray-400">Pages Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{crawlResults.crawlSummary.pagesWithGA4}</div>
                    <div className="text-sm text-gray-400">With GA4</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{crawlResults.crawlSummary.pagesWithGTM}</div>
                    <div className="text-sm text-gray-400">With GTM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{crawlResults.crawlSummary.tagCoverage}%</div>
                    <div className="text-sm text-gray-400">Tag Coverage</div>
                  </div>
                </div>
                
                {crawlResults.insights.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Key Insights:</h4>
                    <ul className="space-y-1">
                      {crawlResults.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <ArrowRight className="w-3 h-3 mr-2 mt-0.5 text-orange-400 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* GA4 Audit Results */}
            {ga4Audit && (
              <div className="space-y-6">
                {/* Property Overview */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">GA4 Property Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{ga4Audit.property.displayName}</div>
                      <div className="text-sm text-gray-400">Property Name</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{ga4Audit.dataStreams.length}</div>
                      <div className="text-sm text-gray-400">Data Streams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{ga4Audit.keyEvents.length}</div>
                      <div className="text-sm text-gray-400">Key Events</div>
                    </div>
                  </div>
                </div>

                {/* Property Settings Audit */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Property Settings Audit</h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.propertySettings).map(([key, setting]) => (
                      <div key={key} className="flex items-start justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{setting.value}</p>
                          <p className="text-xs text-gray-500">{setting.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Collection Audit */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Data Collection Settings</h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.dataCollection).map(([key, setting]) => (
                      <div key={key} className="flex items-start justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{setting.value}</p>
                          <p className="text-xs text-gray-500">{setting.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Events Audit */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Events Configuration</h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.keyEvents).map(([key, setting]) => (
                      <div key={key} className="flex items-start justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{setting.value}</p>
                          <p className="text-xs text-gray-500">{setting.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrations Audit */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Integrations & Product Links</h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.integrations).map(([key, setting]) => (
                      <div key={key} className="flex items-start justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{setting.value}</p>
                          <p className="text-xs text-gray-500">{setting.recommendation}</p>
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
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">GA4 & GTM AI Assistant</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex-1 max-h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs ${
                      msg.type === 'user' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.code && (
                        <div className="mt-2 p-2 bg-gray-950 rounded text-green-400 text-xs font-mono overflow-x-auto">
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
                  className="flex-1 border border-gray-600 bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
            <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">GA4 Event Code Generator</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., Download PDF pricing guide"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={generateTrackingCode}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Generate GA4 Code
                </button>
              </div>
            </div>

            {messages.filter(msg => msg.code).length > 0 && (
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Generated Code</h3>
                {messages.filter(msg => msg.code).slice(-1).map((msg, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-300 mb-3">{msg.content}</p>
                    <div className="p-4 bg-gray-950 rounded-lg text-green-400 text-sm font-mono overflow-x-auto">
                      <pre>{msg.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">GA4 & GTM Documentation</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Getting Started</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <h4 className="font-medium text-white">1. Set Up Google Analytics 4</h4>
                    <p className="text-sm text-gray-400">Create a new GA4 property in your Google Analytics account</p>
                  </div>
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <h4 className="font-medium text-white">2. Install Google Tag Manager</h4>
                    <p className="text-sm text-gray-400">GTM makes it easier to manage all your tracking codes</p>
                  </div>
                  <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                    <h4 className="font-medium text-white">3. Connect GA4 to GTM</h4>
                    <p className="text-sm text-gray-400">Create a GA4 Configuration tag in GTM</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Events (Formerly Conversions)</h3>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 mb-2">
                    As of 2025, GA4 has renamed "conversions" to "key events" for better clarity with Google Ads integration.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Key Events: Important actions tracked in GA4 (all traffic sources)</li>
                    <li>• Conversions: Key Events specifically used for Google Ads bidding</li>
                    <li>• Same functionality, clearer terminology</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Enhanced Measurement</h3>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 mb-2">
                    Enhanced Measurement automatically tracks many interactions without additional code:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Page views and scroll tracking</li>
                    <li>• Outbound link clicks</li>
                    <li>• Site search queries</li>
                    <li>• Video engagement (YouTube embedded videos)</li>
                    <li>• File downloads (PDF, DOC, etc.)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">2025 Best Practices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Property Setup</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Set data retention to 14 months</li>
                      <li>• Configure timezone and currency</li>
                      <li>• Set industry category for benchmarking</li>
                      <li>• Enable Google Signals (with privacy considerations)</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Data Quality</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Filter internal traffic by IP</li>
                      <li>• Set up cross-domain tracking</li>
                      <li>• Define unwanted referrals</li>
                      <li>• Redact PII from URLs</li>
                    </ul>
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
