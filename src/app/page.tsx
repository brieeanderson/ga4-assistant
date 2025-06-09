'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, User, LogOut, ArrowRight, AlertTriangle, Info, TrendingUp, Shield, Database, Link2, Calendar, Settings, Target } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';

interface GA4Property {
  name: string;
  propertyId: string;
  displayName: string;
  timeZone?: string;
  currencyCode?: string;
  accountName?: string;
  accountId?: string;
}

interface CustomDimension {
  displayName: string;
  parameterName: string;
  scope: string;
  description?: string;
}

interface CustomMetric {
  displayName: string;
  parameterName: string;
  scope: string;
  unitOfMeasurement: string;
  description?: string;
}

interface EnhancedMeasurementData {
  streamId: string;
  streamName: string;
  settings: {
    streamEnabled: boolean;
    scrollsEnabled?: boolean;
    outboundClicksEnabled?: boolean;
    siteSearchEnabled?: boolean;
    videoEngagementEnabled?: boolean;
    fileDownloadsEnabled?: boolean;
    formInteractionsEnabled?: boolean;
    pageChangesEnabled?: boolean;
  };
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
    webStreamData?: {
      defaultUri: string;
    };
  }>;
  keyEvents: Array<{
    eventName: string;
    createTime: string;
  }>;
  customDimensions: CustomDimension[];
  customMetrics: CustomMetric[];
  enhancedMeasurement: EnhancedMeasurementData[];
  measurementProtocolSecrets: Array<{
    streamName: string;
    secrets: Array<{ displayName: string }>;
  }>;
  eventCreateRules: Array<{
    streamName: string;
    rules: Array<{ displayName: string }>;
  }>;
  searchConsoleDataStatus: {
    isLinked: boolean;
    hasData: boolean;
    lastDataDate?: string;
    totalClicks: number;
    totalImpressions: number;
    linkDetails: Array<any>;
  };
  googleAdsLinks: Array<any>;
  bigQueryLinks: Array<any>;
  googleSignals: { state?: string };
  dataRetention: { eventDataRetention?: string; userDataRetention?: string };
  attribution: { reportingAttributionModel?: string };
  audit: {
    propertySettings: { [key: string]: AuditItem };
    dataCollection: { [key: string]: AuditItem };
    customDefinitions: { [key: string]: AuditItem };
    keyEvents: { [key: string]: AuditItem };
    integrations: { [key: string]: AuditItem };
  };
  userInfo?: {
    email: string;
    name: string;
  };
}

interface AuditItem {
  status: string;
  value: string;
  recommendation: string;
  details?: string;
  quota?: string;
  warnings?: string[];
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

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'configured': return 'bg-green-900 text-green-300 border-green-700';
        case 'missing': return 'bg-red-900 text-red-300 border-red-700';
        case 'detected': return 'bg-green-900 text-green-300 border-green-700';
        case 'not-detected': return 'bg-red-900 text-red-300 border-red-700';
        case 'not_configured': return 'bg-red-900 text-red-300 border-red-700';
        case 'linked_no_data': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
        case 'none': return 'bg-gray-800 text-gray-400 border-gray-600';
        case 'unknown': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
        case 'requires_manual_check': return 'bg-blue-900 text-blue-300 border-blue-700';
        case 'requires_check': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
        case 'critical': return 'bg-red-900 text-red-300 border-red-700 animate-pulse';
        default: return 'bg-gray-800 text-gray-300 border-gray-600';
      }
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(status)}`}>
        {status.replace('_', ' ').replace('-', ' ')}
      </span>
    );
  };

  const WarningAlert = ({ warnings }: { warnings: string[] }) => {
    if (!warnings || warnings.length === 0) return null;

    return (
      <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            {warnings.map((warning, index) => (
              <p key={index} className="text-sm text-yellow-200">{warning}</p>
            ))}
          </div>
        </div>
      </div>
    );
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
            <h4 className="font-medium text-white mb-2">Enhanced API Access:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-400" />Google Analytics 4 (Full Read Access)</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-400" />Custom Dimensions & Metrics API</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-400" />Enhanced Measurement Settings</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-400" />Event Create Rules Detection</li>
              <li className="flex items-center"><CheckCircle className="w-3 h-3 mr-2 text-green-400" />Search Console Integration Check</li>
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
                    {property.displayName} ({property.propertyId}) {property.accountName && `- ${property.accountName}`}
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
                {isAnalyzing ? 'Running Enhanced Audit...' : 'Run Complete 30-Point GA4 Audit'}
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
            Get a complete 30-point audit including custom dimensions, metrics, event create rules, 
            enhanced measurement analysis, and Search Console integration status.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
            <div className="space-y-3">
              <h4 className="font-medium text-white">Advanced Analysis:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Custom Dimensions & Metrics (50 each)</li>
                <li>• Event Create Rules Detection</li>
                <li>• Enhanced Measurement Configuration</li>
                <li>• Measurement Protocol Secrets</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Expert Insights:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Missing Dimension Warnings</li>
                <li>• Configuration Quality Alerts</li>
                <li>• Data Retention Optimization</li>
                <li>• Integration Status Verification</li>
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
            <Shield className="w-4 h-4" />
            <span>Secure OAuth - Read-only access - No passwords stored</span>
          </div>
        </div>
      </div>
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
              Enhanced Analytics Audit with API-Level Analysis
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
              <h2 className="text-3xl font-bold text-white mb-4">Enhanced GA4 & GTM Website Audit</h2>
              <p className="text-lg text-gray-300 mb-6">
                Deep API-level analysis with custom dimensions, metrics, event create rules, enhanced measurement settings, and Search Console integration detection.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-green-400 mr-1" />
                  <span>API-Level Analysis</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span>Custom Definitions Audit</span>
                </div>
                <div className="flex items-center">
                  <Settings className="w-4 h-4 text-green-400 mr-1" />
                  <span>Configuration Warnings</span>
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
                      Complete 30-point audit with API-level custom definitions analysis
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

            {/* Enhanced GA4 Audit Results */}
            {ga4Audit && (
              <div className="space-y-6">
                {/* Property Overview */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-red-400" />
                    GA4 Property Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400 truncate">{ga4Audit.property.displayName}</div>
                      <div className="text-xs text-gray-400">Property Name</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{ga4Audit.property.timeZone || 'Not Set'}</div>
                      <div className="text-xs text-gray-400">Timezone</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{ga4Audit.property.currencyCode || 'USD'}</div>
                      <div className="text-xs text-gray-400">Currency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{ga4Audit.keyEvents.length}</div>
                      <div className="text-xs text-gray-400">Key Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">{ga4Audit.dataStreams.length}</div>
                      <div className="text-xs text-gray-400">Data Streams</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-300 flex items-start">
                      <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Enhanced 30-Point Audit:</strong> This comprehensive analysis includes custom dimensions, metrics, event create rules, 
                        enhanced measurement settings, and Search Console integration status - providing insights far beyond standard GA4 audits.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Custom Definitions Analysis */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-yellow-400" />
                    Custom Definitions Analysis
                  </h3>
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{ga4Audit.customDimensions.length}</div>
                        <div className="text-sm text-gray-400">Custom Dimensions</div>
                        <div className="text-xs text-gray-500 mt-1">Quota: {ga4Audit.customDimensions.length}/50</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{ga4Audit.customMetrics.length}</div>
                        <div className="text-sm text-gray-400">Custom Metrics</div>
                        <div className="text-xs text-gray-500 mt-1">Quota: {ga4Audit.customMetrics.length}/50</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {ga4Audit.eventCreateRules ? 
                            ga4Audit.eventCreateRules.reduce((total: number, stream: any) => total + (stream.rules?.length || 0), 0) : 
                            0
                          }
                        </div>
                        <div className="text-sm text-gray-400">Event Create Rules</div>
                        <div className="text-xs text-gray-500 mt-1">Complex configurations</div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{ga4Audit.enhancedMeasurement?.length || 0}</div>
                        <div className="text-sm text-gray-400">Enhanced Streams</div>
                        <div className="text-xs text-gray-500 mt-1">Auto-tracking enabled</div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Definitions Audit Details */}
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.customDefinitions || {}).map(([key, setting]) => (
                      <div key={key} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          {setting.quota && (
                            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                              {setting.quota}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-gray-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400">More details</summary>
                              <p className="mt-2 pl-4 border-l border-gray-600">{setting.details}</p>
                            </details>
                          )}
                          <WarningAlert warnings={setting.warnings || []} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Measurement Analysis */}
                {ga4Audit.enhancedMeasurement && ga4Audit.enhancedMeasurement.length > 0 && (
                  <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-blue-400" />
                      Enhanced Measurement Configuration
                    </h3>
                    
                    <div className="space-y-4">
                      {ga4Audit.enhancedMeasurement.map((stream, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <h4 className="font-medium text-white mb-3 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-blue-400" />
                            {stream.streamName}
                          </h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(stream.settings).map(([setting, enabled]) => {
                              if (setting === 'streamEnabled') return null;
                              
                              const settingNames: Record<string, string> = {
                                scrollsEnabled: 'Scroll Tracking',
                                outboundClicksEnabled: 'Outbound Clicks',
                                siteSearchEnabled: 'Site Search',
                                videoEngagementEnabled: 'Video Engagement',
                                fileDownloadsEnabled: 'File Downloads',
                                formInteractionsEnabled: 'Form Interactions',
                                pageChangesEnabled: 'Page Changes (SPA)'
                              };
                              
                              return (
                                <div key={setting} className={`p-2 rounded text-center text-xs ${
                                  enabled ? 'bg-green-900/30 text-green-300' : 'bg-gray-700 text-gray-400'
                                }`}>
                                  {settingNames[setting] || setting}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Dimensions & Metrics Details */}
                {(ga4Audit.customDimensions.length > 0 || ga4Audit.customMetrics.length > 0) && (
                  <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Custom Definitions Details
                    </h3>
                    
                    {ga4Audit.customDimensions.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-white mb-3 flex items-center">
                          <Info className="w-4 h-4 mr-2 text-blue-400" />
                          Custom Dimensions ({ga4Audit.customDimensions.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ga4Audit.customDimensions.map((dimension, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-white text-sm">{dimension.displayName}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  dimension.scope === 'EVENT' ? 'bg-green-900 text-green-300' :
                                  dimension.scope === 'USER' ? 'bg-blue-900 text-blue-300' :
                                  'bg-purple-900 text-purple-300'
                                }`}>
                                  {dimension.scope}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">Parameter: {dimension.parameterName}</p>
                              {dimension.description && (
                                <p className="text-xs text-gray-500 mt-1">{dimension.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {ga4Audit.customMetrics.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                          Custom Metrics ({ga4Audit.customMetrics.length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {ga4Audit.customMetrics.map((metric, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-white text-sm">{metric.displayName}</span>
                                <div className="flex space-x-1">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    metric.scope === 'EVENT' ? 'bg-green-900 text-green-300' :
                                    'bg-blue-900 text-blue-300'
                                  }`}>
                                    {metric.scope}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                                    {metric.unitOfMeasurement}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400">Parameter: {metric.parameterName}</p>
                              {metric.description && (
                                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Property Settings Audit */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-400" />
                    Property Settings Audit
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.propertySettings).map(([key, setting]) => (
                      <div key={key} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-gray-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400">More details</summary>
                              <p className="mt-2 pl-4 border-l border-gray-600">{setting.details}</p>
                            </details>
                          )}
                          <WarningAlert warnings={setting.warnings || []} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Collection Settings */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-cyan-400" />
                    Data Collection Settings
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.dataCollection).map(([key, setting]) => (
                      <div key={key} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <StatusBadge status={setting.status} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-gray-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400">Learn more</summary>
                              <p className="mt-2 pl-4 border-l border-gray-600">{setting.details}</p>
                            </details>
                          )}
                          <WarningAlert warnings={setting.warnings || []} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Events Configuration */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-400" />
                    Key Events Configuration
                  </h3>
                  
                  <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 mb-4">
                    <h4 className="text-purple-300 font-medium mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      2025 Update: Key Events vs Conversions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-purple-200">Key Events:</strong>
                        <p className="text-purple-100 mt-1">Important actions tracked in GA4 (all traffic sources)</p>
                      </div>
                      <div>
                        <strong className="text-purple-200">Conversions:</strong>
                        <p className="text-purple-100 mt-1">Key Events used specifically for Google Ads bidding</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.keyEvents).map(([key, setting]) => (
                      <div key={key} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <StatusBadge status={setting.status} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-gray-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400">Key Events explained</summary>
                              <p className="mt-2 pl-4 border-l border-gray-600">{setting.details}</p>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrations & Product Links */}
                <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Link2 className="w-5 h-5 mr-2 text-blue-400" />
                    Integrations & Product Links
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(ga4Audit.audit.integrations).map(([key, setting]) => (
                      <div key={key} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <StatusBadge status={setting.status} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-gray-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400">Integration benefits</summary>
                              <p className="mt-2 pl-4 border-l border-gray-600">{setting.details}</p>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search Console Integration Status */}
                {ga4Audit.searchConsoleDataStatus && (
                  <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-green-400" />
                      Search Console Integration Status
                    </h3>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">Integration Status</h4>
                        <StatusBadge status={ga4Audit.searchConsoleDataStatus.isLinked ? 
                          (ga4Audit.searchConsoleDataStatus.hasData ? 'configured' : 'linked_no_data') : 
                          'not_configured'} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-400">
                            {ga4Audit.searchConsoleDataStatus.isLinked ? 'Yes' : 'No'}
                          </div>
                          <div className="text-sm text-gray-400">Linked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-400">
                            {ga4Audit.searchConsoleDataStatus.totalClicks || 0}
                          </div>
                          <div className="text-sm text-gray-400">Total Clicks (30d)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-400">
                            {ga4Audit.searchConsoleDataStatus.totalImpressions || 0}
                          </div>
                          <div className="text-sm text-gray-400">Total Impressions (30d)</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          <strong>Data Available:</strong> {ga4Audit.searchConsoleDataStatus.hasData ? 'Yes' : 'No'}
                        </p>
                        {ga4Audit.searchConsoleDataStatus.lastDataDate && (
                          <p className="text-sm text-gray-300">
                            <strong>Last Data:</strong> {ga4Audit.searchConsoleDataStatus.lastDataDate}
                          </p>
                        )}
                        <p className="text-sm text-gray-400 mt-3">
                          {ga4Audit.searchConsoleDataStatus.isLinked && ga4Audit.searchConsoleDataStatus.hasData ?
                            '✅ Search Console is properly integrated and providing organic search data.' :
                            ga4Audit.searchConsoleDataStatus.isLinked ?
                            '⚠️ Search Console is linked but no data detected. Wait 48 hours or check configuration.' :
                            'Link Search Console in Admin > Product linking for organic search insights.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Priority Action Items */}
                <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    Priority Action Items
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-red-300">Critical (Do Now)</h4>
                      <ul className="space-y-2 text-sm">
                        {ga4Audit.audit.propertySettings.dataRetention?.status === 'critical' && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span className="text-gray-300">Extend data retention period (currently only 2 months!)</span>
                          </li>
                        )}
                        <li className="flex items-start space-x-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span className="text-gray-300">Verify timezone matches your business location</span>
                        </li>
                        {ga4Audit.eventCreateRules && ga4Audit.eventCreateRules.length > 0 && (
                          <li className="flex items-start space-x-2">
                            <span className="text-red-400 mt-0.5">•</span>
                            <span className="text-gray-300">Review event create rules configuration (expert review needed)</span>
                          </li>
                        )}
                        <li className="flex items-start space-x-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span className="text-gray-300">Review custom dimensions implementation for missing parameters</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-yellow-300">Important (This Week)</h4>
                      <ul className="space-y-2 text-sm">
                        {ga4Audit.audit.integrations.googleAds?.status === 'not_configured' && (
                          <li className="flex items-start space-x-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span className="text-gray-300">Link Google Ads for conversion tracking</span>
                          </li>
                        )}
                        {ga4Audit.audit.integrations.searchConsole?.status !== 'configured' && (
                          <li className="flex items-start space-x-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span className="text-gray-300">Connect Search Console for SEO insights</span>
                          </li>
                        )}
                        {ga4Audit.audit.propertySettings.googleSignals?.warnings && (
                          <li className="flex items-start space-x-2">
                            <span className="text-yellow-400 mt-0.5">•</span>
                            <span className="text-gray-300">Update privacy policy for Google Signals</span>
                          </li>
                        )}
                        <li className="flex items-start space-x-2">
                          <span className="text-yellow-400 mt-0.5">•</span>
                          <span className="text-gray-300">Set up key events for business goals</span>
                        </li>
                      </ul>
                    </div>
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
                <h3 className="text-lg font-semibold text-white mb-3">Custom Dimensions Best Practices</h3>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 mb-2">
                    Custom dimensions in GA4 capture business-specific categorical data for deeper analysis.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• <strong>Event-scoped:</strong> For data specific to individual events (e.g., button_type, content_category)</li>
                    <li>• <strong>User-scoped:</strong> For data that applies to all user sessions (e.g., user_type, subscription_level)</li>
                    <li>• <strong>Item-scoped:</strong> For e-commerce item details (e.g., product_color, size)</li>
                    <li>• Standard properties: 50 custom dimensions limit</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Enhanced Measurement Warnings</h3>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300 mb-2">
                    When Enhanced Measurement features are enabled, register these custom dimensions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <strong className="text-white">Video Engagement:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• video_current_time</li>
                        <li>• video_duration</li>
                        <li>• video_percent</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-white">Form Interactions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• form_id</li>
                        <li>• form_name</li>
                        <li>• form_destination</li>
                        <li>• form_submit_text</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Event Create Rules Warning</h3>
                <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-300">Critical: Expert Configuration Required</h4>
                      <p className="text-yellow-100 mt-1 text-sm">
                        Event create rules are extremely complex and rarely configured correctly. They require deep 
                        understanding of GA4's data structure and are often where auto-migrated Universal Analytics 
                        events live, which can cause data quality issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">2025 Best Practices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Property Setup</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Set data retention to 14+ months</li>
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
                      <li>• Link Search Console for organic data</li>
                      <li>• Review custom definitions regularly</li>
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
