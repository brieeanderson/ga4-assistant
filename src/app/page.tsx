'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, LogOut, AlertTriangle, Info, TrendingUp, Shield, Database, Settings, Sparkles, Star, ArrowUp } from 'lucide-react';
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

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
}

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
        case 'configured': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25';
        case 'missing': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25';
        case 'detected': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25';
        case 'not-detected': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25';
        case 'not_configured': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25';
        case 'linked_no_data': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25';
        case 'none': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25';
        case 'unknown': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25';
        case 'requires_manual_check': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25';
        case 'requires_check': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25';
        case 'critical': return 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-600/25 animate-pulse';
        default: return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25';
      }
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)} transform transition-all duration-200 hover:scale-105`}>
        {status.replace('_', ' ').replace('-', ' ')}
      </span>
    );
  };

  const WarningAlert = ({ warnings }: { warnings: string[] }) => {
    if (!warnings || warnings.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <p key={index} className="text-sm text-amber-200">{warning}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const GA4Connection = () => {
    if (oauthLoading) {
      return (
        <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded-xl w-1/4 mb-6"></div>
            <div className="h-8 bg-slate-700 rounded-xl w-1/2"></div>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  GA4 Account Connected
                  <Sparkles className="w-5 h-5 ml-2 text-emerald-400" />
                </h3>
                <p className="text-slate-400">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-500 transition-all duration-200 text-sm group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <h4 className="font-semibold text-white mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-emerald-400" />
              Enhanced API Access
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Google Analytics 4 (Full Read Access)',
                'Custom Dimensions & Metrics API',
                'Enhanced Measurement Settings',
                'Event Create Rules Detection',
                'Search Console Integration Check'
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {ga4Properties.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Select GA4 Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full border border-slate-600 bg-slate-800/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
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

          <div className="flex space-x-4">
            {ga4Properties.length === 0 ? (
              <button
                onClick={fetchGA4Properties}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 shadow-lg shadow-emerald-600/25 transform hover:scale-105"
              >
                {isAnalyzing ? 'Loading Properties...' : 'Load GA4 Properties'}
              </button>
            ) : (
              <button
                onClick={runGA4Audit}
                disabled={!selectedProperty || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-semibold disabled:opacity-50 shadow-lg shadow-emerald-600/25 transform hover:scale-105"
              >
                {isAnalyzing ? 'Running Enhanced Audit...' : 'Run Complete 30-Point GA4 Audit'}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-emerald-900/20 via-slate-900/40 to-blue-900/20 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/30 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Connect Your GA4 Account</h3>
          <p className="text-slate-300 mb-8 text-lg">
            Get a complete 30-point audit including custom dimensions, metrics, event create rules, 
            enhanced measurement analysis, and Search Console integration status.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-emerald-400" />
                Advanced Analysis
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Custom Dimensions & Metrics (50 each)
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Event Create Rules Detection
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Enhanced Measurement Configuration
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Measurement Protocol Secrets
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-emerald-400" />
                Expert Insights
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Missing Dimension Warnings
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Configuration Quality Alerts
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Data Retention Optimization
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-emerald-400" />
                  Integration Status Verification
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={login}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-10 py-4 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-semibold text-lg shadow-lg shadow-emerald-600/25 transform hover:scale-105"
          >
            Connect GA4 Account
          </button>
          
          <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-slate-400">
            <Shield className="w-4 h-4" />
            <span>Secure OAuth - Read-only access - No passwords stored</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">GA4 & GTM Assistant</h1>
            </div>
            <div className="text-sm text-slate-400 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
              Enhanced Analytics Audit with API-Level Analysis
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-700/50">
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
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'audit' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center bg-gradient-to-br from-emerald-900/20 via-slate-900/40 to-blue-900/20 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/30 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Unlock Your GA4 Superpowers
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto">
                Deep API-level analysis with custom dimensions, metrics, event create rules, enhanced measurement settings, and Search Console integration detection.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
                {[
                  { icon: Database, label: 'API-Level Analysis' },
                  { icon: TrendingUp, label: 'Custom Definitions Audit' },
                  { icon: Settings, label: 'Configuration Warnings' },
                  { icon: CheckCircle, label: 'Expert Recommendations' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center group">
                    <item.icon className="w-5 h-5 text-emerald-400 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GA4 Account Connection */}
            <GA4Connection />

            {/* Enhanced GA4 Audit Results */}
            {ga4Audit && (
              <div className="space-y-8">
                {/* Property Overview */}
                <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <BarChart3 className="w-7 h-7 mr-3 text-emerald-400" />
                    GA4 Property Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                    {[
                      { label: 'Property Name', value: ga4Audit.property.displayName, color: 'emerald' },
                      { label: 'Timezone', value: ga4Audit.property.timeZone || 'Not Set', color: 'blue' },
                      { label: 'Currency', value: ga4Audit.property.currencyCode || 'USD', color: 'green' },
                      { label: 'Key Events', value: ga4Audit.keyEvents.length.toString(), color: 'purple' },
                      { label: 'Data Streams', value: ga4Audit.dataStreams.length.toString(), color: 'orange' }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
                        <div className={`text-2xl font-bold text-${item.color}-400 truncate`}>{item.value}</div>
                        <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-sm text-blue-300 flex items-start">
                      <Info className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Enhanced 30-Point Audit:</strong> This comprehensive analysis includes custom dimensions, metrics, event create rules, 
                        enhanced measurement settings, and Search Console integration status - providing insights far beyond standard GA4 audits.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Custom Definitions Analysis */}
                <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Database className="w-7 h-7 mr-3 text-yellow-400" />
                    Custom Definitions Analysis
                  </h3>
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Custom Dimensions', value: ga4Audit.customDimensions.length, quota: '50', color: 'yellow' },
                      { label: 'Custom Metrics', value: ga4Audit.customMetrics.length, quota: '50', color: 'green' },
                      { label: 'Event Create Rules', value: ga4Audit.eventCreateRules?.reduce((total: number, stream: any) => total + (stream.rules?.length || 0), 0) || 0, quota: 'Complex', color: 'orange' },
                      { label: 'Enhanced Streams', value: ga4Audit.enhancedMeasurement?.length || 0, quota: 'Auto-tracking', color: 'cyan' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
                        <div className="text-center">
                          <div className={`text-3xl font-bold text-${item.color}-400 mb-2`}>{item.value}</div>
                          <div className="text-sm text-slate-400 mb-1">{item.label}</div>
                          <div className="text-xs text-slate-500">
                            {typeof item.quota === 'string' ? item.quota : `Quota: ${item.value}/${item.quota}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Audit Details */}
                  <div className="space-y-6">
                    {Object.entries(ga4Audit.audit.customDefinitions || {}).map(([key, setting]) => (
                      <div key={key} className="p-6 bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold text-white text-lg capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          {setting.quota && (
                            <span className="text-xs text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                              {setting.quota}
                            </span>
                          )}
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-slate-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-slate-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-slate-500">
                              <summary className="cursor-pointer hover:text-slate-400 transition-colors duration-200">More details</summary>
                              <p className="mt-3 pl-4 border-l-2 border-slate-600">{setting.details}</p>
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
                  <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 hover:shadow-3xl transition-all duration-300">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Settings className="w-7 h-7 mr-3 text-blue-400" />
                      Enhanced Measurement Configuration
                    </h3>
                    
                    <div className="space-y-6">
                      {ga4Audit.enhancedMeasurement.map((stream, index) => (
                        <div key={index} className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
                          <h4 className="font-semibold text-white mb-4 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-blue-400" />
                            {stream.streamName}
                          </h4>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                <div key={setting} className={`p-3 rounded-xl text-center text-xs font-medium transition-all duration-200 ${
                                  enabled 
                                    ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30' 
                                    : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
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

              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Send className="w-7 h-7 mr-3 text-emerald-400" />
              GA4 & GTM AI Assistant
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex-1 max-h-96 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-600/25' 
                        : 'bg-slate-800/70 text-slate-300 border border-slate-700/50 backdrop-blur-sm'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.code && (
                        <div className="mt-3 p-3 bg-slate-950 rounded-xl text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-700">
                          <pre>{msg.code}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about GA4 or GTM..."
                  className="flex-1 border border-slate-600 bg-slate-800/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg shadow-emerald-600/25 transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Implement Tab */}
        {activeTab === 'implement' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Code className="w-7 h-7 mr-3 text-orange-400" />
                GA4 Event Code Generator
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., Download PDF pricing guide"
                  className="w-full border border-slate-600 bg-slate-800/50 text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                />
                <button
                  onClick={generateTrackingCode}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-200 font-semibold shadow-lg shadow-orange-600/25 transform hover:scale-105"
                >
                  Generate GA4 Code
                </button>
              </div>
            </div>

            {messages.filter(msg => msg.code).length > 0 && (
              <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                <h3 className="text-xl font-bold text-white mb-6">Generated Code</h3>
                {messages.filter(msg => msg.code).slice(-1).map((msg, index) => (
                  <div key={index}>
                    <p className="text-sm text-slate-300 mb-4">{msg.content}</p>
                    <div className="p-6 bg-slate-950 rounded-xl text-emerald-400 text-sm font-mono overflow-x-auto border border-slate-700">
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
          <div className="bg-gradient-to-br from-slate-900/90 to-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <BookOpen className="w-7 h-7 mr-3 text-blue-400" />
              GA4 & GTM Documentation
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
                <div className="space-y-4">
                  {[
                    { title: '1. Set Up Google Analytics 4', desc: 'Create a new GA4 property in your Google Analytics account' },
                    { title: '2. Install Google Tag Manager', desc: 'GTM makes it easier to manage all your tracking codes' },
                    { title: '3. Connect GA4 to GTM', desc: 'Create a GA4 Configuration tag in GTM' }
                  ].map((step, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-sm text-slate-400">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Custom Dimensions Best Practices</h3>
                <div className="p-6 bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <p className="text-slate-300 mb-4">
                    Custom dimensions in GA4 capture business-specific categorical data for deeper analysis.
                  </p>
                  <ul className="text-sm text-slate-400 space-y-2">
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Event-scoped:</strong> For data specific to individual events (e.g., button_type, content_category)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>User-scoped:</strong> For data that applies to all user sessions (e.g., user_type, subscription_level)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Item-scoped:</strong> For e-commerce item details (e.g., product_color, size)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Standard properties: 50 custom dimensions limit</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Enhanced Measurement Warnings</h3>
                <div className="p-6 bg-gradient-to-r from-slate-800/50 to-gray-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <p className="text-slate-300 mb-4">
                    When Enhanced Measurement features are enabled, register these custom dimensions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
                    <div>
                      <strong className="text-white">Video Engagement:</strong>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          video_current_time
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          video_duration
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          video_percent
                        </li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-white">Form Interactions:</strong>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          form_id
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          form_name
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          form_destination
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-2 text-emerald-400" />
                          form_submit_text
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Event Create Rules Warning</h3>
                <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-300 mb-2">Critical: Expert Configuration Required</h4>
                      <p className="text-amber-100 text-sm">
                        Event create rules are extremely complex and rarely configured correctly. They require deep 
                        understanding of GA4's data structure and are often where auto-migrated Universal Analytics 
                        events live, which can cause data quality issues.
                      </p>
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
