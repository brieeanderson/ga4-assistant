'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, User, LogOut } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';

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
  };
  dataStreams: Array<{
    displayName: string;
    type: string;
  }>;
  conversions: Array<{
    eventName: string;
    createTime: string;
  }>;
  audit: {
    propertySettings: { [key: string]: { status: string; value: string; recommendation: string; } };
  };
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
}

interface DebugInfo {
  status: 'testing' | 'success' | 'error';
  step: string;
  userInfo?: {
    email: string;
  };
  accountCount?: number;
  propertyCount?: number;
  accounts?: Array<{
    name: string;
    displayName: string;
  }>;
  error?: string;
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
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [ga4Error, setGA4Error] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your GA4 & GTM specialist. I can help you with implementation, troubleshooting, and tracking setup. How can I assist you today?",
      timestamp: new Date()
    }
  ]);

  const { isAuthenticated, userEmail, login, logout, isLoading: oauthLoading, accessToken } = useOAuth();

  // Debug function to test GA4 API access directly
  const testGA4ApiAccess = async () => {
    if (!accessToken) {
      console.log('No access token available');
      return;
    }

    console.log('=== GA4 API DEBUG TEST ===');
    setDebugInfo({ status: 'testing', step: 'Starting tests...' });

    // Test 1: Validate token
    try {
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (userResponse.ok) {
        const userInfo = await userResponse.json();
        console.log('✅ Token valid for user:', userInfo.email);
        setDebugInfo({ status: 'testing', step: `Token valid for ${userInfo.email}` });
      } else {
        console.error('❌ Token validation failed:', userResponse.status);
        setDebugInfo({ status: 'error', step: `Token validation failed: ${userResponse.status}` });
        return;
      }
    } catch (error) {
      console.error('❌ Token validation error:', error);
      setDebugInfo({ status: 'error', step: `Token validation error: ${error}` });
      return;
    }

    // Test 2: Test Analytics Admin API access
    try {
      const accountsResponse = await fetch(
        'https://analyticsadmin.googleapis.com/v1beta/accounts',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Analytics Admin API response status:', accountsResponse.status);
      
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        console.log('✅ Analytics Admin API working');
        console.log('Accounts found:', accountsData.accounts?.length || 0);
        
        setDebugInfo({ 
          status: 'success', 
          step: `Found ${accountsData.accounts?.length || 0} GA4 accounts`,
          accounts: accountsData.accounts
        });
      } else {
        const errorText = await accountsResponse.text();
        console.error('❌ Analytics Admin API failed');
        
        let suggestion = '';
        if (accountsResponse.status === 403) {
          suggestion = 'API not enabled or insufficient permissions';
        } else if (accountsResponse.status === 401) {
          suggestion = 'Invalid token or OAuth scopes issue';
        }
        
        setDebugInfo({ 
          status: 'error', 
          step: `API failed with ${accountsResponse.status}: ${suggestion}`,
          error: errorText
        });
      }
    } catch (error) {
      console.error('❌ Analytics Admin API error:', error);
      setDebugInfo({ status: 'error', step: `API error: ${error}` });
    }
  };

  // Enhanced fetchGA4Properties function with better error handling
  const fetchGA4Properties = useCallback(async () => {
    if (!accessToken) return;
    
    setIsAnalyzing(true);
    setGA4Error(null);
    setDebugInfo(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      console.log('Fetching GA4 properties...');
      
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      console.log('GA4 audit response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        console.error('API Error:', errorData);
        setGA4Error(errorData.error || `HTTP ${response.status}`);
        return;
      }
      
      const result = await response.json();
      console.log('GA4 audit result:', result);
      
      if (result.type === 'property_list') {
        setGA4Properties(result.properties || []);
        setDebugInfo({
          status: 'success',
          userInfo: result.userInfo,
          accountCount: result.accounts?.length || 0,
          propertyCount: result.properties?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching GA4 properties:', error);
      setGA4Error(error instanceof Error ? error.message : 'Failed to fetch GA4 properties');
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
    setGA4Error(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, propertyId: selectedProperty })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        setGA4Error(errorData.error || `HTTP ${response.status}`);
        return;
      }
      
      const result = await response.json();
      setGA4Audit(result);
    } catch (error) {
      console.error('Error running GA4 audit:', error);
      setGA4Error(error instanceof Error ? error.message : 'Failed to run GA4 audit');
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
        content: "For GA4 Enhanced Ecommerce tracking, you'll need to implement the new event structure...",
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
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
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

          {/* Error Display */}
          {ga4Error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-red-800 mb-2">Configuration Issue</h4>
              <p className="text-sm text-red-700 mb-3">{ga4Error}</p>
              <div className="text-xs text-red-600">
                <p className="font-medium mb-1">Common solutions:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Enable Google Analytics Admin API in Google Cloud Console</li>
                  <li>Add redirect URI: https://ga4wise.netlify.app/oauth/callback</li>
                  <li>Ensure you have access to GA4 properties in your account</li>
                </ul>
              </div>
            </div>
          )}

          {ga4Properties.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select GA4 Property ({ga4Properties.length} found):
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
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading Properties...</span>
                  </div>
                ) : (
                  'Load GA4 Properties'
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={fetchGA4Properties}
                  disabled={isAnalyzing}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Refresh Properties
                </button>
                <button
                  onClick={runGA4Audit}
                  disabled={!selectedProperty || isAnalyzing}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Running Audit...</span>
                    </div>
                  ) : (
                    'Run Complete GA4 Audit'
                  )}
                </button>
              </>
            )}
          </div>

          {/* Debug Information Panel */}
          {(debugInfo || ga4Error) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">Debug Information</h4>
                <button
                  onClick={testGA4ApiAccess}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  🔍 Run Test
                </button>
              </div>
              
              {debugInfo && (
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Status:</strong> {debugInfo.status}</div>
                  <div><strong>Step:</strong> {debugInfo.step}</div>
                  {debugInfo.userInfo && (
                    <div><strong>User:</strong> {debugInfo.userInfo.email}</div>
                  )}
                  {debugInfo.accountCount !== undefined && (
                    <div><strong>Accounts:</strong> {debugInfo.accountCount}</div>
                  )}
                  {debugInfo.propertyCount !== undefined && (
                    <div><strong>Properties:</strong> {debugInfo.propertyCount}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Setup Guide */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-2">Quick Setup Checklist:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>□ Google Analytics Admin API enabled</div>
              <div>□ OAuth redirect URI configured</div>
              <div>□ GA4 property access granted</div>
            </div>
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
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
