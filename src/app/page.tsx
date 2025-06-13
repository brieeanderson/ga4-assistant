'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Send, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, LogOut, 
  AlertTriangle, Info, TrendingUp, Shield, Database, Settings, Sparkles, 
  ArrowUp, Calendar, DollarSign, Clock, ChevronRight, ChevronDown, Link
} from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth'; // Import the REAL OAuth hook

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
    countingMethod?: string;
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
  attribution: { 
    reportingAttributionModel?: string;
    acquisitionConversionEventLookbackWindow?: string;
    otherConversionEventLookbackWindow?: string;
  };
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
  configurationAudit: any;
  recommendations: string[];
  analysisMethod: string;
}

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['property-config']));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ga4Properties, setGA4Properties] = useState<GA4Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [ga4Audit, setGA4Audit] = useState<GA4Audit | null>(null);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'assistant',
      content: "Hey there! 👋 I'm your GA4 & GTM specialist. Ready to make your analytics WORK? Let's dive in!",
      timestamp: new Date()
    }
  ]);
  const [error, setError] = useState<string | null>(null);

  // Use the REAL OAuth hook
  const { isAuthenticated, userEmail, login, logout, isLoading: oauthLoading, accessToken, setError: setOAuthError } = useOAuth();

  // Real function to fetch GA4 properties
  const fetchGA4Properties = useCallback(async () => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.type === 'property_list') {
        setGA4Properties(result.properties || []);
        if (result.properties?.length === 0) {
          setError('No GA4 properties found. Make sure you have access to GA4 properties with this Google account.');
        }
      } else {
        throw new Error('Unexpected response format from GA4 audit function');
      }
    } catch (error) {
      console.error('Error fetching GA4 properties:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch GA4 properties';
      setError(errorMessage);
      setOAuthError('Failed to fetch GA4 properties. Please try reconnecting your account.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [accessToken, setOAuthError]);

  // Real function to run GA4 audit
  const runGA4Audit = async () => {
    if (!selectedProperty || !accessToken) {
      setError('Please select a property and ensure you are authenticated');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, propertyId: selectedProperty })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setGA4Audit(result);
      
      // Log success for debugging
      console.log('GA4 Audit completed successfully:', {
        propertyName: result.property?.displayName,
        dataStreams: result.dataStreams?.length,
        customDimensions: result.customDimensions?.length,
        keyEvents: result.keyEvents?.length
      });
      
    } catch (error) {
      console.error('Error running GA4 audit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to run GA4 audit';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Real function to analyze website
  const analyzeWebsite = async () => {
    if (!websiteUrl.trim()) {
      setError('Please enter a website URL to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: websiteUrl.trim(),
          crawlMode: 'single'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setWebsiteAnalysis(result);
      
      // Log success for debugging
      console.log('Website analysis completed:', {
        domain: result.domain,
        gtmFound: result.currentSetup?.gtmInstalled,
        ga4Found: result.currentSetup?.ga4Connected
      });
      
    } catch (error) {
      console.error('Error analyzing website:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze website';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Effect to automatically fetch properties when authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true' && isAuthenticated && accessToken) {
      fetchGA4Properties();
    }
  }, [isAuthenticated, accessToken, fetchGA4Properties]);

  // Real message handling for chat
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate AI response - in a real implementation, this would call an AI service
    setTimeout(() => {
      const aiResponse: Message = {
        type: 'assistant',
        content: `Based on your GA4 setup, here's what I recommend for "${message}"...`,
        timestamp: new Date(),
        code: message.toLowerCase().includes('tracking') ? `gtag('event', 'custom_event', {
  'event_category': 'engagement',
  'event_label': '${message}',
  'value': 1
});` : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Real tracking code generation
  const generateTrackingCode = () => {
    if (!action.trim()) return;
    
    const eventName = action.toLowerCase().replace(/\s+/g, '_');
    const trackingCode = `// GA4 Event Tracking Code
gtag('event', '${eventName}', {
  'event_category': 'user_engagement',
  'event_label': '${action}',
  'custom_parameter_1': '${action}',
  'value': 1
});

// Optional: Send to dataLayer for GTM
dataLayer.push({
  'event': '${eventName}',
  'event_category': 'user_engagement',
  'event_label': '${action}'
});`;

    const newMessage: Message = {
      type: 'assistant',
      content: `Here's your GA4 tracking code for "${action}":`,
      code: trackingCode,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Section toggle functionality
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Real compliance score calculation
  const getComplianceScore = () => {
    if (!ga4Audit) return 0;
    
    let score = 0;
    const total = 8;
    
    // Property Configuration (2 points)
    if (ga4Audit.property.timeZone) score += 1;
    if (ga4Audit.property.currencyCode) score += 1;
    
    // Data Retention (1 point)
    if (ga4Audit.dataRetention.eventDataRetention === "FOURTEEN_MONTHS") score += 1;
    
    // Enhanced Measurement (1 point)
    if (ga4Audit.enhancedMeasurement.length > 0) score += 1;
    
    // Key Events (1 point)
    if (ga4Audit.keyEvents.length >= 1) score += 1;
    
    // Custom Definitions (1 point)
    if (ga4Audit.customDimensions.length > 0) score += 1;
    
    // Google Ads Integration (1 point)
    if (ga4Audit.googleAdsLinks.length > 0) score += 1;
    
    // Search Console (1 point)
    if (ga4Audit.searchConsoleDataStatus.isLinked) score += 1;
    
    return Math.round((score / total) * 100);
  };

  // Real priority recommendations
  const getPriorityRecommendations = () => {
    if (!ga4Audit) return [];
    
    const recommendations = [];
    
    // Critical issues first
    if (ga4Audit.dataRetention.eventDataRetention !== 'FOURTEEN_MONTHS') {
      recommendations.push({
        priority: 'critical',
        text: 'Change data retention from 2 months to 14 months immediately',
        icon: Clock
      });
    }
    
    if (!ga4Audit.property.timeZone) {
      recommendations.push({
        priority: 'critical', 
        text: 'Set property timezone for accurate daily reporting',
        icon: Calendar
      });
    }
    
    if (ga4Audit.keyEvents.length === 0) {
      recommendations.push({
        priority: 'critical',
        text: 'Configure key events for conversion tracking',
        icon: TrendingUp
      });
    }
    
    // Important improvements
    if (ga4Audit.googleAdsLinks.length === 0) {
      recommendations.push({
        priority: 'important',
        text: 'Link Google Ads for conversion import and Smart Bidding',
        icon: Link
      });
    }
    
    if (ga4Audit.customDimensions.length < 3) {
      recommendations.push({
        priority: 'important',
        text: 'Add custom dimensions for business-specific tracking',
        icon: Database
      });
    }
    
    if (!ga4Audit.searchConsoleDataStatus.isLinked) {
      recommendations.push({
        priority: 'important',
        text: 'Connect Search Console for organic search insights',
        icon: Search
      });
    }

    return recommendations.slice(0, 4);
  };

  // Status icon component
  const StatusIcon = ({ status }: { status: 'good' | 'warning' | 'critical' | 'missing' }) => {
    const icons = {
      good: <CheckCircle className="w-5 h-5 text-green-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      critical: <AlertTriangle className="w-5 h-5 text-red-500" />,
      missing: <AlertTriangle className="w-5 h-5 text-gray-500" />
    };
    return icons[status];
  };

  // Compliance progress component
  const ComplianceProgress = ({ score }: { score: number }) => {
    const getScoreColor = (score: number) => {
      if (score >= 90) return 'from-green-500 to-emerald-500';
      if (score >= 70) return 'from-yellow-500 to-orange-500'; 
      return 'from-red-500 to-pink-500';
    };

    const getScoreLabel = (score: number) => {
      if (score >= 90) return 'Excellent Setup';
      if (score >= 70) return 'Good Foundation'; 
      return 'Needs Critical Fixes';
    };

    const recommendations = getPriorityRecommendations();

    return (
      <div className="bg-black/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">GA4 Fundamentals Compliance</h3>
            <p className="text-sm text-gray-400">Based on 2025 GA4 Best Practices</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
              {score}%
            </div>
            <div className="text-sm text-gray-400">{getScoreLabel(score)}</div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Priority Fixes:</h4>
            {recommendations.map((rec, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                rec.priority === 'critical' 
                  ? 'bg-red-500/10 border border-red-500/30' 
                  : 'bg-yellow-500/10 border border-yellow-500/30'
              }`}>
                <rec.icon className={`w-4 h-4 ${
                  rec.priority === 'critical' ? 'text-red-400' : 'text-yellow-400'
                }`} />
                <span className={`text-sm ${
                  rec.priority === 'critical' ? 'text-red-200' : 'text-yellow-200'
                }`}>
                  {rec.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Build fundamental sections with real data
  const fundamentalSections = [
    {
      id: 'property-config',
      title: 'Property Configuration',
      icon: Settings,
      description: 'Core property settings that affect all your data',
      criticalIssues: ga4Audit ? (!ga4Audit.property.timeZone || ga4Audit.dataRetention.eventDataRetention !== 'FOURTEEN_MONTHS') : false,
      items: ga4Audit ? [
        {
          name: 'Timezone Configuration',
          status: ga4Audit.property.timeZone ? 'good' : 'critical',
          value: ga4Audit.property.timeZone || 'Not Set (defaults to Pacific Time)',
          impact: ga4Audit.property.timeZone ? 
            `Reports show data in ${ga4Audit.property.timeZone} timezone - aligned with your business hours` : 
            'CRITICAL: Data shows in Pacific Time by default, making daily/hourly analysis inaccurate for your business',
          recommendation: ga4Audit.property.timeZone ? 
            'Timezone is properly configured for accurate reporting' : 
            'Set timezone in Admin > Property > Property Details immediately to fix reporting accuracy',
          details: 'Timezone affects when "days" start/end in reports. Misaligned timezones make it impossible to correlate GA4 data with business operations, sales, or marketing campaigns.'
        },
        {
          name: 'Currency Settings', 
          status: ga4Audit.property.currencyCode ? 'good' : 'warning',
          value: ga4Audit.property.currencyCode || 'USD (Default)',
          impact: 'All e-commerce revenue data converts to this currency using Google\'s daily exchange rates',
          recommendation: 'Currency setting affects revenue reporting accuracy - ensure it matches your primary business currency',
          details: 'If you accept multiple currencies, GA4 converts them to your reporting currency. The conversion affects revenue totals, LTV calculations, and ROAS reporting.'
        },
        {
          name: 'Data Retention Period',
          status: ga4Audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 'good' : 'critical',
          value: ga4Audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? '14 Months (Optimal)' : '2 Months (Default - CRITICAL ISSUE)',
          impact: ga4Audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 
            'You have 14 months of historical data available for analysis, comparisons, and trend identification' :
            'CRITICAL DATA LOSS: You\'re automatically deleting historical data after 2 months! This prevents year-over-year analysis, seasonal trend identification, and long-term business insights.',
          recommendation: ga4Audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 
            'Data retention is optimized for maximum historical analysis' : 
            'URGENT: Change to 14 months in Admin > Data Settings > Data Retention immediately to stop data loss',
          details: 'Data retention affects Explorations, custom reports, and historical analysis. The 2-month default is inadequate for most businesses and causes permanent data loss.'
        }
      ] : []
    },
    {
      id: 'custom-definitions',
      title: 'Custom Definitions',
      icon: Database,
      description: 'Your business-specific tracking setup',
      criticalIssues: false,
      items: ga4Audit ? [
        {
          name: 'Custom Dimensions Setup',
          status: ga4Audit.customDimensions.length > 0 ? 'good' : 'missing', 
          value: `${ga4Audit.customDimensions.length}/50 configured`,
          impact: `You can track ${ga4Audit.customDimensions.length} business-specific data points beyond standard GA4 dimensions`,
          recommendation: ga4Audit.customDimensions.length > 0 ? 
            'Good variety of custom dimensions for detailed business analysis' :
            'Set up custom dimensions for user types, content categories, product attributes, etc.',
          details: `Current dimensions: ${ga4Audit.customDimensions.map(d => d.displayName).slice(0, 3).join(', ')}${ga4Audit.customDimensions.length > 3 ? '...' : ''}`
        },
        {
          name: 'Custom Metrics',
          status: ga4Audit.customMetrics.length > 0 ? 'good' : 'missing',
          value: `${ga4Audit.customMetrics.length}/50 configured`, 
          impact: 'Track numerical business KPIs beyond standard GA4 metrics',
          recommendation: ga4Audit.customMetrics.length > 0 ? 
            'Custom metrics enable advanced business performance tracking' :
            'Consider adding custom metrics for engagement scores, content value, etc.',
          details: ga4Audit.customMetrics.length > 0 ? 
            `Current metrics: ${ga4Audit.customMetrics.map(m => m.displayName).join(', ')}` :
            'Custom metrics help measure business-specific performance indicators'
        }
      ] : []
    },
    {
      id: 'key-events',
      title: 'Key Events (Conversions)',
      icon: TrendingUp,
      description: 'Your business goals and conversion tracking',
      criticalIssues: ga4Audit ? ga4Audit.keyEvents.length === 0 : false,
      items: ga4Audit ? [
        {
          name: 'Key Events Configuration',
          status: ga4Audit.keyEvents.length > 0 ? 'good' : 'critical',
          value: `${ga4Audit.keyEvents.length} key events active`,
          impact: ga4Audit.keyEvents.length > 0 ? 
            'You\'re tracking important business goals that can be used for optimization and reporting' :
            'No conversion tracking means you can\'t measure business success or optimize marketing campaigns',
          recommendation: ga4Audit.keyEvents.length > 0 ?
            'Key events can be imported to Google Ads for Smart Bidding optimization' :
            'URGENT: Set up key events for purchases, sign-ups, downloads, and other important actions',
          details: ga4Audit.keyEvents.length > 0 ? 
            `Current key events: ${ga4Audit.keyEvents.map(e => e.eventName).join(', ')}` :
            'Key events are essential for measuring ROI and optimizing marketing spend'
        }
      ] : []
    },
    {
      id: 'integrations',
      title: 'Platform Integrations', 
      icon: Link,
      description: 'Connections with other Google marketing tools',
      criticalIssues: false,
      items: ga4Audit ? [
        {
          name: 'Google Ads Connection',
          status: ga4Audit.googleAdsLinks.length > 0 ? 'good' : 'warning',
          value: ga4Audit.googleAdsLinks.length > 0 ? 'Connected & Active' : 'Not Connected',
          impact: ga4Audit.googleAdsLinks.length > 0 ?
            'Conversion data flows to Google Ads for Smart Bidding, and audiences can be shared for remarketing' :
            'Missing conversion tracking and audience sharing opportunities with Google Ads',
          recommendation: ga4Audit.googleAdsLinks.length > 0 ?
            'Optimal setup for conversion-based bidding and audience targeting' :
            'Link Google Ads to import key events as conversions and enable audience sharing',
          details: 'Google Ads integration enables conversion import for automated bidding and audience sharing for remarketing campaigns'
        },
        {
          name: 'Search Console Integration',
          status: ga4Audit.searchConsoleDataStatus.isLinked ? 'good' : 'warning',
          value: ga4Audit.searchConsoleDataStatus.isLinked ? 
            `Active (${ga4Audit.searchConsoleDataStatus.totalClicks?.toLocaleString()} clicks, ${ga4Audit.searchConsoleDataStatus.totalImpressions?.toLocaleString()} impressions)` : 
            'Not Connected',
          impact: ga4Audit.searchConsoleDataStatus.isLinked ?
            'You can see exactly which Google searches bring visitors, including impressions and click-through rates' :
            'Missing valuable organic search query data that shows what people search for to find you',
          recommendation: ga4Audit.searchConsoleDataStatus.isLinked ?
            'Excellent organic search visibility with detailed query performance data' :
            'Connect Search Console to understand organic search performance and optimize content',
          details: 'Search Console integration shows search queries, positions, clicks, and impressions for organic traffic'
        }
      ] : []
    }
  ];

  const score = getComplianceScore();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mx-4 mt-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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
            <div className="text-sm text-gray-400 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
              Make Your Analytics Work 💪
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'audit', label: 'Analytics Audit', icon: Search },
              { id: 'website', label: 'Website Analysis', icon: BarChart3 },
              { id: 'chat', label: 'Beast Assistant', icon: Send },
              { id: 'implement', label: 'Code Generator', icon: Code },
              { id: 'docs', label: 'The Playbook', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-bold text-sm transition-all duration-200 ${
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
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Discover the Hidden GA4 Settings<br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Sabotaging Your Data Quality!
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Your free GA4 setup audit reveals if you're accidentally deleting data after 2 months, 
                what your ✨ actual ✨ attribution model is, and where that video_progress event is coming from.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                <strong className="text-orange-400">No More Guessing What's Broken</strong> - Get a detailed roadmap for better data.
              </p>
            </div>

            {/* OAuth Connection Component */}
            {!isAuthenticated && (
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>

                {/* Enhanced Measurement Analysis */}
                {ga4Audit && ga4Audit.enhancedMeasurement.length > 0 && (
                  <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                    <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Zap className="w-6 h-6 mr-3 text-orange-400" />
                      Enhanced Measurement Configuration
                    </h4>
                    
                    {ga4Audit.enhancedMeasurement.map((stream, streamIndex) => (
                      <div key={streamIndex} className="mb-6 last:mb-0">
                        <h5 className="text-lg font-semibold text-white mb-4">
                          {stream.streamName} - Enhanced Events Status
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {/* Page Views */}
                          <div className={`p-4 rounded-lg border ${stream.settings.streamEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.streamEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                              }
                              <span className="font-medium text-white">Page Views</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.streamEnabled ? 'Active - Tracking page_view events' : 'Disabled - No page tracking'}
                            </p>
                          </div>

                          {/* Scrolls */}
                          <div className={`p-4 rounded-lg border ${stream.settings.scrollsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.scrollsEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">Scroll Tracking</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.scrollsEnabled ? 'Active - 90% page scroll events' : 'Disabled'}
                            </p>
                          </div>

                          {/* Outbound Clicks */}
                          <div className={`p-4 rounded-lg border ${stream.settings.outboundClicksEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.outboundClicksEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">Outbound Clicks</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.outboundClicksEnabled ? 'Active - External link tracking' : 'Disabled'}
                            </p>
                          </div>

                          {/* Site Search */}
                          <div className={`p-4 rounded-lg border ${stream.settings.siteSearchEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.siteSearchEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">Site Search</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.siteSearchEnabled ? 'Active - view_search_results events' : 'Disabled'}
                            </p>
                            {stream.settings.siteSearchEnabled && (
                              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                                <p className="text-xs text-yellow-300">
                                  ⚠️ Verify search terms are captured. Check GA4 reports for search_term data.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Video Engagement */}
                          <div className={`p-4 rounded-lg border ${stream.settings.videoEngagementEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.videoEngagementEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">Video Engagement</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.videoEngagementEnabled ? 'Active - YouTube video tracking' : 'Disabled'}
                            </p>
                            {stream.settings.videoEngagementEnabled && (() => {
                              const videoParams = ['video_current_time', 'video_duration', 'video_percent', 'video_title', 'video_url'];
                              const existingDimensions = ga4Audit.customDimensions.map(cd => cd.parameterName.toLowerCase());
                              const missingVideoParams = videoParams.filter(param => !existingDimensions.includes(param));
                              
                              return missingVideoParams.length > 0 ? (
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                                  <p className="text-xs text-red-300">
                                    ⚠️ Missing dimensions: {missingVideoParams.join(', ')}
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                                  <p className="text-xs text-green-300">
                                    ✅ All video dimensions configured
                                  </p>
                                </div>
                              );
                            })()}
                          </div>

                          {/* File Downloads */}
                          <div className={`p-4 rounded-lg border ${stream.settings.fileDownloadsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.fileDownloadsEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">File Downloads</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.fileDownloadsEnabled ? 'Active - PDF, DOC, ZIP tracking' : 'Disabled'}
                            </p>
                          </div>

                          {/* Form Interactions */}
                          <div className={`p-4 rounded-lg border ${stream.settings.formInteractionsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.formInteractionsEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">Form Interactions</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.formInteractionsEnabled ? 'Active - form_start/submit events' : 'Disabled'}
                            </p>
                            {stream.settings.formInteractionsEnabled && (() => {
                              const formParams = ['form_id', 'form_name', 'form_destination', 'form_submit_text'];
                              const existingDimensions = ga4Audit.customDimensions.map(cd => cd.parameterName.toLowerCase());
                              const missingFormParams = formParams.filter(param => !existingDimensions.includes(param));
                              
                              return missingFormParams.length > 0 ? (
                                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                                  <p className="text-xs text-red-300">
                                    ⚠️ Missing dimensions: {missingFormParams.join(', ')}
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                                  <p className="text-xs text-green-300">
                                    ✅ All form dimensions configured
                                  </p>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Page Changes (SPA) */}
                          <div className={`p-4 rounded-lg border ${stream.settings.pageChangesEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {stream.settings.pageChangesEnabled ? 
                                <CheckCircle className="w-5 h-5 text-green-400" /> : 
                                <AlertTriangle className="w-5 h-5 text-gray-400" />
                              }
                              <span className="font-medium text-white">Page Changes</span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {stream.settings.pageChangesEnabled ? 'Active - SPA page change detection' : 'Disabled'}
                            </p>
                          </div>
                        </div>

                        {/* Recommendations for this stream */}
                        <div className="bg-black/50 rounded-lg p-4 border border-gray-700/50">
                          <h6 className="font-semibold text-white mb-3 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-orange-400" />
                            Configuration Recommendations
                          </h6>
                          <div className="space-y-2">
                            {!stream.settings.scrollsEnabled && (
                              <p className="text-sm text-gray-300">
                                💡 Enable scroll tracking to measure content engagement depth
                              </p>
                            )}
                            {!stream.settings.outboundClicksEnabled && (
                              <p className="text-sm text-gray-300">
                                💡 Enable outbound clicks to track referral traffic and partnerships
                              </p>
                            )}
                            {!stream.settings.fileDownloadsEnabled && (
                              <p className="text-sm text-gray-300">
                                💡 Enable file downloads to track resource engagement (PDFs, docs, etc.)
                              </p>
                            )}
                            {stream.settings.siteSearchEnabled && (
                              <p className="text-sm text-yellow-300">
                                🔍 Site search is enabled. Verify in GA4 Reports that search_term values appear in your data. If not, configure search parameters: q, search, query, keyword, s
                              </p>
                            )}
                            {(() => {
                              const enabledCount = [
                                stream.settings.scrollsEnabled,
                                stream.settings.outboundClicksEnabled,
                                stream.settings.siteSearchEnabled,
                                stream.settings.videoEngagementEnabled,
                                stream.settings.fileDownloadsEnabled,
                                stream.settings.formInteractionsEnabled,
                                stream.settings.pageChangesEnabled
                              ].filter(Boolean).length;
                              
                              if (enabledCount >= 5) {
                                return (
                                  <p className="text-sm text-green-300">
                                    ✅ Excellent! You have {enabledCount}/7 enhanced measurement events enabled
                                  </p>
                                );
                              } else {
                                return (
                                  <p className="text-sm text-orange-300">
                                    📈 Consider enabling more events ({enabledCount}/7 currently active) for richer data insights
                                  </p>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                  <h3 className="text-2xl font-bold text-white mb-3">Connect Your GA4 Account</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Get a complete 30-point GA4 configuration audit that reveals data retention disasters, 
                    attribution model problems, and integration failures you didn't know existed.
                  </p>
                  
                  <button
                    onClick={login}
                    disabled={oauthLoading}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide text-lg shadow-lg shadow-orange-600/25 transform hover:scale-105 disabled:opacity-50"
                  >
                    {oauthLoading ? 'Connecting...' : 'Audit My GA4 Setup'}
                  </button>
                  
                  <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Secure OAuth - read-only access - we never store passwords</span>
                  </div>
                </div>
              </div>
            )}

            {/* Connected Account Status */}
            {isAuthenticated && (
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">GA4 Account Connected 💪</h3>
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

                {ga4Properties.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-300 mb-3">
                      Select GA4 Property:
                    </label>
                    <select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
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
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-orange-600/25 transform hover:scale-105"
                    >
                      {isAnalyzing ? 'Loading Properties...' : 'Load GA4 Properties'}
                    </button>
                  ) : (
                    <button
                      onClick={runGA4Audit}
                      disabled={!selectedProperty || isAnalyzing}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-orange-600/25 transform hover:scale-105"
                    >
                      {isAnalyzing ? 'Running Configuration Audit...' : 'Run GA4 Configuration Audit'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* GA4 Analysis Results */}
            {ga4Audit && (
              <>
                {/* Property Overview Header */}
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-orange-400" />
                    Property Overview: {ga4Audit.property.displayName}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
                      <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{ga4Audit.property.timeZone || 'Not Set'}</div>
                      <div className="text-xs text-gray-400">Timezone</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
                      <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{ga4Audit.property.currencyCode || 'USD'}</div>
                      <div className="text-xs text-gray-400">Currency</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
                      <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{ga4Audit.property.industryCategory || 'Not Set'}</div>
                      <div className="text-xs text-gray-400">Industry</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
                      <Database className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{ga4Audit.dataStreams.length}</div>
                      <div className="text-xs text-gray-400">Data Streams</div>
                    </div>
                  </div>
                  
                  {/* Data Streams List */}
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-gray-300 mb-3">Active Data Streams:</h5>
                    <div className="space-y-2">
                      {ga4Audit.dataStreams.map((stream, index) => (
                        <div key={index} className="bg-black/30 rounded-lg p-3 border border-gray-700/50 flex items-center justify-between">
                          <div>
                            <span className="text-white font-medium">{stream.displayName}</span>
                            {stream.webStreamData && (
                              <span className="text-gray-400 text-sm ml-2">({stream.webStreamData.defaultUri})</span>
                            )}
                          </div>
                          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                            {stream.type.replace('_DATA_STREAM', '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fundamentals Compliance Overview */}
                <ComplianceProgress score={score} />

                {/* Critical Issues Alert */}
                {score < 70 && (
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-xl p-8">
                    <div className="flex items-start space-x-4">
                      <AlertTriangle className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-2xl font-bold text-red-400 mb-4">Critical GA4 Setup Issues Detected</h3>
                        <p className="text-gray-300 mb-6 text-lg">
                          Your GA4 setup has fundamental configuration problems that are affecting data quality and business insights. 
                          These priority fixes will immediately improve your analytics reliability.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fundamentals Sections */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Settings className="w-7 h-7 mr-3 text-orange-400" />
                    GA4 Fundamentals Analysis
                  </h3>
                  
                  {fundamentalSections.map((section) => (
                    <div key={section.id} className="bg-black/50 rounded-xl border border-gray-700/50 overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-6 text-left hover:bg-black/70 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <section.icon className="w-6 h-6 text-orange-400" />
                              {section.criticalIssues && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white">{section.title}</h4>
                              <p className="text-sm text-gray-400">{section.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              {section.items.map((item, index) => (
                                <StatusIcon key={index} status={item.status as 'good' | 'warning' | 'critical' | 'missing'} />
                              ))}
                            </div>
                            {expandedSections.has(section.id) ? 
                              <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            }
                          </div>
                        </div>
                      </button>
                      
                      {expandedSections.has(section.id) && (
                        <div className="px-6 pb-6 space-y-4">
                          {section.items.map((item, index) => (
                            <div key={index} className="bg-black/30 rounded-lg p-6 border border-gray-600/50">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <StatusIcon status={item.status as 'good' | 'warning' | 'critical' | 'missing'} />
                                  <h5 className="font-semibold text-white text-lg">{item.name}</h5>
                                </div>
                                <span className="text-sm font-medium text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                                  {item.value}
                                </span>
                              </div>
                              <div className="space-y-4 ml-8">
                                <div className="flex items-start space-x-3">
                                  <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-blue-300 mb-1">Data Quality Impact:</p>
                                    <p className="text-sm text-gray-300">{item.impact}</p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-green-300 mb-1">Recommendation:</p>
                                    <p className="text-sm text-gray-400">{item.recommendation}</p>
                                  </div>
                                </div>
                                {item.details && (
                                  <div className="bg-black/50 rounded-lg p-4 border border-gray-700/30">
                                    <p className="text-xs text-gray-500 leading-relaxed">{item.details}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Current Setup Details */}
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Database className="w-7 h-7 mr-3 text-orange-400" />
                    Your Current Custom Definitions
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Custom Dimensions */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <Database className="w-5 h-5 mr-2 text-blue-400" />
                        Custom Dimensions ({ga4Audit.customDimensions.length}/50)
                      </h4>
                      <div className="space-y-3">
                        {ga4Audit.customDimensions.slice(0, 5).map((dim, index) => (
                          <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-white">{dim.displayName}</h5>
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                {dim.scope}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              Parameter: <code className="bg-gray-800 px-1 rounded text-orange-300">{dim.parameterName}</code>
                            </div>
                            {dim.description && (
                              <div className="text-xs text-gray-500">{dim.description}</div>
                            )}
                          </div>
                        ))}
                        {ga4Audit.customDimensions.length > 5 && (
                          <div className="text-sm text-gray-400 text-center py-2">
                            + {ga4Audit.customDimensions.length - 5} more dimensions configured
                          </div>
                        )}
                        {ga4Audit.customDimensions.length === 0 && (
                          <div className="text-sm text-gray-400 text-center py-8 bg-black/30 rounded-lg border border-gray-700/50">
                            No custom dimensions configured yet. Consider adding dimensions for user types, content categories, or campaign data.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custom Metrics */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white flex items-center mb-4">
                          <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                          Custom Metrics ({ga4Audit.customMetrics.length}/50)
                        </h4>
                        <div className="space-y-3">
                          {ga4Audit.customMetrics.map((metric, index) => (
                            <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white">{metric.displayName}</h5>
                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                  {metric.scope}
                                </span>
                              </div>
                              <div className="text-sm text-gray-400 mb-1">
                                Parameter: <code className="bg-gray-800 px-1 rounded text-orange-300">{metric.parameterName}</code>
                              </div>
                              {metric.description && (
                                <div className="text-xs text-gray-500">{metric.description}</div>
                              )}
                            </div>
                          ))}
                          {ga4Audit.customMetrics.length === 0 && (
                            <div className="text-sm text-gray-400 text-center py-8 bg-black/30 rounded-lg border border-gray-700/50">
                              No custom metrics configured yet. Consider adding metrics for engagement scores, completion rates, or business KPIs.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Website Analysis Tab */}
        {activeTab === 'website' && (
          <div className="space-y-12">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-7 h-7 mr-3 text-orange-400" />
                Website Analytics Analysis
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">
                  Enter Website URL:
                </label>
                <div className="flex space-x-4">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                  <button
                    onClick={analyzeWebsite}
                    disabled={!websiteUrl.trim() || isAnalyzing}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                  </button>
                </div>
              </div>

              {websiteAnalysis && (
                <div className="space-y-6">
                  <div className="bg-black/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-bold text-white mb-4">Analysis Results for {websiteAnalysis.domain}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">GTM Setup</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {websiteAnalysis.currentSetup.gtmInstalled ? 
                              <CheckCircle className="w-5 h-5 text-green-500" /> : 
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            }
                            <span className="text-gray-300">
                              GTM: {websiteAnalysis.currentSetup.gtmInstalled ? 'Detected' : 'Not Found'}
                            </span>
                          </div>
                          {websiteAnalysis.gtmContainers.length > 0 && (
                            <div className="ml-7 text-sm text-gray-400">
                              Containers: {websiteAnalysis.gtmContainers.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">GA4 Setup</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {websiteAnalysis.currentSetup.ga4Connected ? 
                              <CheckCircle className="w-5 h-5 text-green-500" /> : 
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            }
                            <span className="text-gray-300">
                              GA4: {websiteAnalysis.currentSetup.ga4Connected ? 'Detected' : 'Not Found'}
                            </span>
                          </div>
                          {websiteAnalysis.ga4Properties.length > 0 && (
                            <div className="ml-7 text-sm text-gray-400">
                              Properties: {websiteAnalysis.ga4Properties.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {websiteAnalysis.recommendations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                          {websiteAnalysis.recommendations.slice(0, 5).map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <ArrowUp className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-8">
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Send className="w-7 h-7 mr-3 text-orange-400" />
                Beast Analytics Assistant
              </h2>
              
              <div className="space-y-6">
                <div className="h-96 bg-black/50 rounded-xl p-4 border border-gray-700/50 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        {msg.code && (
                          <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-x-auto">
                            <code>{msg.code}</code>
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about GA4 setup, tracking, or custom events..."
                    className="flex-1 border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Generator Tab */}
        {activeTab === 'implement' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Code className="w-7 h-7 mr-3 text-orange-400" />
              GA4 Code Generator
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3">
                  Describe the action you want to track:
                </label>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  placeholder="e.g., button click, form submission, video play"
                  className="w-full border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={generateTrackingCode}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold"
              >
                Generate Tracking Code
              </button>
              
              <div className="h-64 bg-black/50 rounded-xl p-4 border border-gray-700/50 overflow-y-auto">
                {messages.filter(m => m.code).map((msg, index) => (
                  <div key={index} className="mb-4">
                    <p className="text-gray-300 mb-2">{msg.content}</p>
                    <pre className="p-4 bg-black/70 rounded-lg text-sm overflow-x-auto">
                      <code className="text-green-400">{msg.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-7 h-7 mr-3 text-orange-400" />
              The Beast Playbook
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Quick Start Guide</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Connect your GA4 account for a complete audit</li>
                  <li>• Review compliance score and priority fixes</li>
                  <li>• Configure custom dimensions and metrics</li>
                  <li>• Set up key events for conversion tracking</li>
                  <li>• Link Google Ads and Search Console</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Best Practices</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Set data retention to 14 months</li>
                  <li>• Use data-driven attribution model</li>
                  <li>• Enable enhanced measurement</li>
                  <li>• Register custom parameters as dimensions</li>
                  <li>• Implement proper event naming conventions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
