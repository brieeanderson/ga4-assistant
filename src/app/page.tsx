'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Send, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, LogOut, AlertTriangle, Info, TrendingUp, Shield, Database, Settings, Sparkles, Star, ArrowUp } from 'lucide-react';
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
      content: "hey there! 👋 I'm your ga4 & gtm specialist. ready to make your analytics WORK? let's dive in!",
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
        content: "for ga4 key events tracking, you'll need this setup...",
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
      content: `here's your ga4 tracking code for "${action}":`,
      code: trackingCode,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'configured': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25';
        case 'missing': return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/25';
        case 'detected': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25';
        case 'not-detected': return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/25';
        case 'not_configured': return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-600/25';
        case 'linked_no_data': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25';
        case 'none': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25';
        case 'unknown': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25';
        case 'requires_manual_check': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25';
        case 'requires_check': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25';
        case 'critical': return 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-600/25 animate-pulse';
        default: return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25';
      }
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(status)} transform transition-all duration-200 hover:scale-105`}>
        {status.replace('_', ' ').replace('-', ' ')}
      </span>
    );
  };

  const WarningAlert = ({ warnings }: { warnings: string[] }) => {
    if (!warnings || warnings.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
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
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded-xl w-1/4 mb-6"></div>
            <div className="h-8 bg-gray-700 rounded-xl w-1/2"></div>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center lowercase">
                  ga4 account connected 💪
                </h3>
                <p className="text-gray-400">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 text-sm group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 mb-6 backdrop-blur-sm">
            <h4 className="font-bold text-white mb-3 flex items-center lowercase">
              <Star className="w-5 h-5 mr-2 text-orange-400" />
              beast-level api access
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'google analytics 4 (full read access)',
                'custom dimensions & metrics api',
                'enhanced measurement settings',
                'event create rules detection',
                'search console integration check'
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {ga4Properties.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-3 lowercase">
                select ga4 property:
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              >
                <option value="">choose a property...</option>
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
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-orange-600/25 transform hover:scale-105"
              >
                {isAnalyzing ? 'loading properties...' : 'load ga4 properties'}
              </button>
            ) : (
              <button
                onClick={runGA4Audit}
                disabled={!selectedProperty || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-orange-600/25 transform hover:scale-105"
              >
                {isAnalyzing ? 'running configuration audit...' : 'run ga4 configuration audit'}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 lowercase">connect your ga4 account</h3>
          <p className="text-gray-300 mb-8 text-lg">
            get a complete 30-point ga4 configuration audit that reveals data retention disasters, 
            attribution model problems, and integration failures you didn't know existed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="space-y-4">
              <h4 className="font-bold text-white flex items-center lowercase">
                <Sparkles className="w-5 h-5 mr-2 text-orange-400" />
                advanced analysis
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  dimensions & metrics setup
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  uncover custom events
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  enhanced measurement configuration
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  measurement protocol secrets
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white flex items-center lowercase">
                <Star className="w-5 h-5 mr-2 text-orange-400" />
                beast insights
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  missing dimension warnings
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  configuration quality alerts
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  data retention optimization
                </li>
                <li className="flex items-center">
                  <ArrowUp className="w-4 h-4 mr-2 text-orange-400" />
                  integration status verification
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={login}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide text-lg shadow-lg shadow-orange-600/25 transform hover:scale-105"
          >
            audit my ga4 setup
          </button>
          
          <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>secure oauth - read-only access - we never store passwords</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-orange-500/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wide">GA4 BEAST</h1>
            </div>
            <div className="text-sm text-gray-400 flex items-center lowercase">
              <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
              make your analytics WORK 💪
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'audit', label: 'analytics audit', icon: Search },
              { id: 'chat', label: 'beast assistant', icon: Send },
              { id: 'implement', label: 'code generator', icon: Code },
              { id: 'docs', label: 'the playbook', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-bold text-sm transition-all duration-200 lowercase ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'audit' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center bg-black/80 backdrop-blur-xl rounded-3xl p-12 border border-orange-500/30 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 lowercase leading-tight">
                discover the hidden ga4 settings<br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  sabotaging your data quality!
                </span><br />
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                your free audit will reveal if you're accidentally deleting data after 2 months, what your ✨ actual ✨ attribution window and model are, and where that video_progress event is coming from.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                <strong className="text-orange-400">no more guessing what's broken</strong> - get a detailed roadmap for better data.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
                {[
                  { icon: Database, label: 'data retention check' },
                  { icon: TrendingUp, label: 'attribution audit' },
                  { icon: Settings, label: 'configuration warnings' },
                  { icon: CheckCircle, label: 'integration verification' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center group">
                    <item.icon className="w-5 h-5 text-orange-400 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="lowercase">{item.label}</span>
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
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8 hover:shadow-3xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center lowercase">
                    <BarChart3 className="w-7 h-7 mr-3 text-orange-400" />
                    ga4 property overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                    {[
                      { label: 'property name', value: ga4Audit.property.displayName, color: 'orange' },
                      { label: 'timezone', value: ga4Audit.property.timeZone || 'not set', color: 'blue' },
                      { label: 'currency', value: ga4Audit.property.currencyCode || 'usd', color: 'green' },
                      { label: 'key events', value: ga4Audit.keyEvents.length.toString(), color: 'purple' },
                      { label: 'data streams', value: ga4Audit.dataStreams.length.toString(), color: 'red' }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-4 bg-black/50 rounded-xl backdrop-blur-sm hover:bg-black/70 transition-all duration-200">
                        <div className={`text-2xl font-bold text-${item.color}-400 truncate uppercase`}>{item.value}</div>
                        <div className="text-xs text-gray-400 mt-1 lowercase">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-sm text-orange-300 flex items-start">
                      <Info className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>BEAST-level 30-point audit:</strong> this analysis goes way beyond basic ga4 audits. 
                        we're talking custom dimensions, metrics, event create rules, enhanced measurement settings, 
                        and search console integration status - the works! 💪
                      </span>
                    </p>
                  </div>
                </div>

                {/* Custom Definitions Analysis */}
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8 hover:shadow-3xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center lowercase">
                    <Database className="w-7 h-7 mr-3 text-yellow-400" />
                    custom definitions analysis
                  </h3>
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'custom dimensions', value: ga4Audit.customDimensions.length, quota: '50', color: 'yellow' },
                      { label: 'custom metrics', value: ga4Audit.customMetrics.length, quota: '50', color: 'green' },
                      { label: 'event create rules', value: ga4Audit.eventCreateRules?.reduce((total: number, stream: any) => total + (stream.rules?.length || 0), 0) || 0, quota: 'complex', color: 'orange' },
                      { label: 'enhanced streams', value: ga4Audit.enhancedMeasurement?.length || 0, quota: 'auto-tracking', color: 'cyan' }
                    ].map((item, index) => (
                      <div key={index} className="bg-black/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200">
                        <div className="text-center">
                          <div className={`text-3xl font-bold text-${item.color}-400 mb-2`}>{item.value}</div>
                          <div className="text-sm text-gray-400 mb-1 lowercase">{item.label}</div>
                          <div className="text-xs text-gray-500 lowercase">
                            {typeof item.quota === 'string' ? item.quota : `quota: ${item.value}/${item.quota}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Audit Details */}
                  <div className="space-y-6">
                    {Object.entries(ga4Audit.audit.customDefinitions || {}).map(([key, setting]) => (
                      <div key={key} className="p-6 bg-black/50 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-bold text-white text-lg lowercase">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            <StatusBadge status={setting.status} />
                          </div>
                          {setting.quota && (
                            <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full lowercase">
                              {setting.quota}
                            </span>
                          )}
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-300 font-medium">{setting.value}</p>
                          <p className="text-sm text-gray-400">{setting.recommendation}</p>
                          {setting.details && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400 transition-colors duration-200 lowercase">more details</summary>
                              <p className="mt-3 pl-4 border-l-2 border-gray-600">{setting.details}</p>
                            </details>
                          )}
                          <WarningAlert warnings={setting.warnings || []} />
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
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center lowercase">
              <Send className="w-7 h-7 mr-3 text-orange-400" />
              beast analytics assistant
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex-1 max-h-96 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/25' 
                        : 'bg-black/70 text-gray-300 border border-gray-700/50 backdrop-blur-sm'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.code && (
                        <div className="mt-3 p-3 bg-black rounded-xl text-orange-400 text-xs font-mono overflow-x-auto border border-gray-700">
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
                  placeholder="ask about ga4 or gtm..."
                  className="flex-1 border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 lowercase"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg shadow-orange-600/25 transform hover:scale-105"
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
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center lowercase">
                <Code className="w-7 h-7 mr-3 text-orange-400" />
                ga4 event code generator
              </h2>
              <div className="space-y-6">
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., download pdf pricing guide"
                  className="w-full border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 lowercase"
                />
                <button
                  onClick={generateTrackingCode}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide shadow-lg shadow-orange-600/25 transform hover:scale-105"
                >
                  generate beast code
                </button>
              </div>
            </div>

            {messages.filter(msg => msg.code).length > 0 && (
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
                <h3 className="text-xl font-bold text-white mb-6 lowercase">generated code</h3>
                {messages.filter(msg => msg.code).slice(-1).map((msg, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-300 mb-4">{msg.content}</p>
                    <div className="p-6 bg-black rounded-xl text-orange-400 text-sm font-mono overflow-x-auto border border-gray-700">
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
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center lowercase">
              <BookOpen className="w-7 h-7 mr-3 text-orange-400" />
              the beast playbook
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 lowercase">let's get to work</h3>
                <div className="space-y-4">
                  {[
                    { title: '1. set up google analytics 4', desc: 'create a new ga4 property in your google analytics account' },
                    { title: '2. install google tag manager', desc: 'gtm makes it easier to manage all your tracking codes' },
                    { title: '3. connect ga4 to gtm', desc: 'create a ga4 configuration tag in gtm' }
                  ].map((step, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl backdrop-blur-sm">
                      <h4 className="font-bold text-white lowercase">{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 lowercase">making custom dimensions WORK</h3>
                <div className="p-6 bg-black/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <p className="text-gray-300 mb-4">
                    custom dimensions in ga4 capture business-specific data for deeper analysis. here's how to make them work:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span><strong>event-scoped:</strong> for data specific to individual events (e.g., button_type, content_category)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span><strong>user-scoped:</strong> for data that applies to all user sessions (e.g., user_type, subscription_level)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span><strong>item-scoped:</strong> for e-commerce item details (e.g., product_color, size)</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowUp className="w-4 h-4 mr-2 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>standard properties: 50 custom dimensions limit</span>
                    </li>
                  </ul>
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
