import React, { useState, useEffect, useCallback } from 'react';
import { 
  Send, Code, Zap, CheckCircle, BookOpen, BarChart3, Search, LogOut, 
  AlertTriangle, Info, TrendingUp, Shield, Database, Settings, Sparkles, 
  Star, ArrowUp, Calendar, DollarSign, Clock, Users, ChevronRight, ChevronDown, Link
} from 'lucide-react';

// Mock GA4 audit data for demonstration
const mockGA4Audit = {
  property: {
    displayName: "Example E-commerce Store",
    timeZone: "America/New_York", 
    currencyCode: "USD",
    industryCategory: "RETAIL"
  },
  dataRetention: {
    eventDataRetention: "TWO_MONTHS", // This will trigger critical warning
    userDataRetention: "TWO_MONTHS"
  },
  customDimensions: [
    { displayName: "User Type", parameterName: "user_type", scope: "USER", description: "Distinguishes between new and returning customers" },
    { displayName: "Content Category", parameterName: "content_category", scope: "EVENT", description: "Tracks blog post and product categories" },
    { displayName: "Video Current Time", parameterName: "video_current_time", scope: "EVENT", description: "Tracks video engagement timing" },
    { displayName: "Product Color", parameterName: "product_color", scope: "ITEM", description: "E-commerce item attribute" },
    { displayName: "Subscription Tier", parameterName: "subscription_tier", scope: "USER", description: "User subscription level" }
  ],
  customMetrics: [
    { displayName: "Engagement Score", parameterName: "engagement_score", scope: "EVENT", unitOfMeasurement: "STANDARD", description: "Custom engagement calculation" },
    { displayName: "Content Value", parameterName: "content_value", scope: "EVENT", unitOfMeasurement: "CURRENCY", description: "Estimated content monetary value" }
  ],
  keyEvents: [
    { eventName: "purchase", createTime: "2024-01-15", countingMethod: "ONCE_PER_SESSION" },
    { eventName: "sign_up", createTime: "2024-01-10", countingMethod: "ONCE_PER_EVENT" },
    { eventName: "download_guide", createTime: "2024-02-01", countingMethod: "ONCE_PER_EVENT" }
  ],
  enhancedMeasurement: [{
    streamName: "Web Data Stream",
    settings: {
      streamEnabled: true,
      scrollsEnabled: true,
      outboundClicksEnabled: true,
      siteSearchEnabled: false,
      videoEngagementEnabled: true,
      fileDownloadsEnabled: true,
      formInteractionsEnabled: false
    }
  }],
  googleAdsLinks: [{ name: "Main Ads Account", createTime: "2024-01-01" }],
  searchConsoleDataStatus: { 
    isLinked: true, 
    hasData: true, 
    totalClicks: 1250, 
    totalImpressions: 25000 
  },
  bigQueryLinks: [],
  attribution: { 
    reportingAttributionModel: "PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN",
    acquisitionConversionEventLookbackWindow: "30_DAYS",
    otherConversionEventLookbackWindow: "90_DAYS"
  },
  googleSignals: { state: "GOOGLE_SIGNALS_ENABLED" },
  dataStreams: [
    { displayName: "Web Data Stream", type: "WEB_DATA_STREAM", webStreamData: { defaultUri: "https://example.com" } }
  ]
};

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['fundamentals-overview']));
  const [isAuthenticated] = useState(true); // Mock authenticated state
  const [userEmail] = useState('user@example.com');
  const [ga4Audit] = useState(mockGA4Audit);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getComplianceScore = () => {
    let score = 0;
    let total = 8;
    
    // Property Configuration
    if (ga4Audit.property.timeZone && ga4Audit.property.currencyCode) score += 1;
    
    // Data Retention  
    if (ga4Audit.dataRetention.eventDataRetention === "FOURTEEN_MONTHS") score += 1;
    
    // Enhanced Measurement
    if (ga4Audit.enhancedMeasurement.length > 0) score += 1;
    
    // Key Events
    if (ga4Audit.keyEvents.length >= 1) score += 1;
    
    // Custom Definitions
    if (ga4Audit.customDimensions.length > 0) score += 1;
    
    // Google Ads Integration
    if (ga4Audit.googleAdsLinks.length > 0) score += 1;
    
    // Search Console
    if (ga4Audit.searchConsoleDataStatus.isLinked) score += 1;
    
    // Attribution Model
    if (ga4Audit.attribution.reportingAttributionModel) score += 1;
    
    return Math.round((score / total) * 100);
  };

  const getEnhancedMeasurementDetails = () => {
    if (ga4Audit.enhancedMeasurement.length === 0) return '';
    
    const stream = ga4Audit.enhancedMeasurement[0];
    const settings = stream.settings;
    const existingDimensions = ga4Audit.customDimensions.map(cd => cd.parameterName.toLowerCase());
    
    let details = `📊 **Enhanced Measurement Events on ${stream.streamName}:**\n\n`;
    
    // Track enabled events and missing dimensions
    const enabledEvents = [];
    const missingDimensions = [];
    const warnings = [];
    
    if (settings.scrollsEnabled) {
      enabledEvents.push('✅ scroll - Tracks 90% page scroll events');
    }
    
    if (settings.outboundClicksEnabled) {
      enabledEvents.push('✅ click - Tracks outbound link clicks');
      if (!existingDimensions.includes('link_url') && !existingDimensions.includes('outbound_link')) {
        missingDimensions.push('link_url or outbound_link (for click destinations)');
      }
    }
    
    if (settings.siteSearchEnabled) {
      enabledEvents.push('✅ view_search_results - Tracks internal site searches');
      warnings.push('⚠️ **Site Search Check Required**: Verify search query parameters are configured and search terms are being captured. Common parameters: q, search, query, keyword, s. If no search terms appear in reports, you may need to add custom query parameters.');
      if (!existingDimensions.includes('search_term')) {
        missingDimensions.push('search_term (for search query analysis)');
      }
    } else {
      enabledEvents.push('❌ view_search_results - Site search tracking disabled');
    }
    
    if (settings.videoEngagementEnabled) {
      enabledEvents.push('✅ video_start/progress/complete - Tracks YouTube embedded video engagement');
      const videoParams = ['video_current_time', 'video_duration', 'video_percent', 'video_title', 'video_url'];
      const missingVideoParams = videoParams.filter(param => !existingDimensions.includes(param));
      if (missingVideoParams.length > 0) {
        missingDimensions.push(...missingVideoParams.map(param => `${param} (for video analytics)`));
      }
    }
    
    if (settings.fileDownloadsEnabled) {
      enabledEvents.push('✅ file_download - Tracks PDF, DOC, ZIP, etc. downloads');
      const fileParams = ['file_name', 'file_extension', 'link_text'];
      const missingFileParams = fileParams.filter(param => !existingDimensions.includes(param));
      if (missingFileParams.length > 0) {
        missingDimensions.push(...missingFileParams.map(param => `${param} (for download analysis)`));
      }
    }
    
    if (settings.formInteractionsEnabled) {
      enabledEvents.push('✅ form_start/submit - Tracks form interactions');
      const formParams = ['form_id', 'form_name', 'form_destination', 'form_submit_text'];
      const missingFormParams = formParams.filter(param => !existingDimensions.includes(param));
      if (missingFormParams.length > 0) {
        missingDimensions.push(...missingFormParams.map(param => `${param} (for form analytics)`));
      }
    } else {
      enabledEvents.push('❌ form_start/submit - Form tracking disabled');
    }
    
    if (settings.pageChangesEnabled) {
      enabledEvents.push('✅ page_view - Tracks single-page app page changes');
    }
    
    details += enabledEvents.join('\n') + '\n\n';
    
    if (missingDimensions.length > 0) {
      details += `🔍 **Missing Custom Dimensions for Enhanced Analytics:**\n`;
      details += missingDimensions.map(dim => `• ${dim}`).join('\n') + '\n\n';
      details += 'Register these in Admin > Custom definitions > Custom dimensions to get detailed insights from your enhanced measurement events.\n\n';
    }
    
    if (warnings.length > 0) {
      details += warnings.join('\n\n');
    }
    
    return details;
  };

  const StatusIcon = ({ status }: { status: 'good' | 'warning' | 'critical' | 'missing' }) => {
    const icons = {
      good: <CheckCircle className="w-5 h-5 text-green-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      critical: <AlertTriangle className="w-5 h-5 text-red-500" />,
      missing: <AlertTriangle className="w-5 h-5 text-gray-500" />
    };
    return icons[status];
  };

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

    const getPriorityRecommendations = () => {
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

      return recommendations.slice(0, 4); // Show max 4 recommendations
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
        
        {/* Priority Recommendations */}
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

  const fundamentalSections = [
    {
      id: 'property-config',
      title: 'Property Configuration',
      icon: Settings,
      description: 'Core property settings that affect all your data',
      criticalIssues: !ga4Audit.property.timeZone || ga4Audit.dataRetention.eventDataRetention !== 'FOURTEEN_MONTHS',
      items: [
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
      ]
    },
    {
      id: 'custom-definitions',
      title: 'Custom Definitions',
      icon: Database,
      description: 'Your business-specific tracking setup',
      criticalIssues: false,
      items: [
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
      ]
    },
    {
      id: 'key-events',
      title: 'Key Events (Conversions)',
      icon: TrendingUp,
      description: 'Your business goals and conversion tracking',
      criticalIssues: ga4Audit.keyEvents.length === 0,
      items: [
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
      ]
    },
    {
      id: 'integrations',
      title: 'Platform Integrations', 
      icon: Link,
      description: 'Connections with other Google marketing tools',
      criticalIssues: false,
      items: [
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
      ]
    }
  ];

  const score = getComplianceScore();

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
                  <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 text-sm group">
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            )}

            {/* GA4 Fundamentals Analysis - NOW FIRST */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Settings className="w-8 h-8 mr-3 text-orange-400" />
                GA4 Fundamentals Analysis
              </h3>

              {/* Property Overview Header */}
              <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-orange-400" />
                  Property Overview
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

              {/* Fundamentals Compliance Overview - MOVED HERE */}
              <div className="mt-8">
                <ComplianceProgress score={score} />
              </div>
              
              {/* Fundamentals Sections */}
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
                            <StatusIcon key={index} status={item.status} />
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
                              <StatusIcon status={item.status} />
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

            {/* Current Setup Details - REMOVED KEY EVENTS FROM HERE */}
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
                  </div>
                </div>

                {/* Custom Metrics ONLY */}
                <div className="space-y-6">
                  {/* Custom Metrics */}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ga4Audit.dataRetention.eventDataRetention !== 'FOURTEEN_MONTHS' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Clock className="w-5 h-5 text-red-400 mr-2" />
                            <h4 className="font-bold text-red-300">Data Retention Crisis</h4>
                          </div>
                          <p className="text-sm text-red-200">
                            You're deleting historical data after 2 months! Change to 14 months immediately to preserve business insights.
                          </p>
                        </div>
                      )}
                      {!ga4Audit.property.timeZone && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Calendar className="w-5 h-5 text-red-400 mr-2" />
                            <h4 className="font-bold text-red-300">Timezone Mismatch</h4>
                          </div>
                          <p className="text-sm text-red-200">
                            Reports show Pacific Time instead of your business timezone, making daily analysis inaccurate.
                          </p>
                        </div>
                      )}
                      {ga4Audit.keyEvents.length === 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-red-400 mr-2" />
                            <h4 className="font-bold text-red-300">No Conversion Tracking</h4>
                          </div>
                          <p className="text-sm text-red-200">
                            Without key events, you can't measure business success or optimize marketing campaigns.
                          </p>
                        </div>
                      )}
                    </div>
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
                            <StatusIcon key={index} status={item.status} />
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
                              <StatusIcon status={item.status} />
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
          </div>
        )}

        {/* Other tabs remain the same but with proper capitalization */}
        {activeTab === 'chat' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Send className="w-7 h-7 mr-3 text-orange-400" />
              Beast Analytics Assistant
            </h2>
            <p className="text-gray-400">Chat functionality coming soon...</p>
          </div>
        )}

        {activeTab === 'implement' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Code className="w-7 h-7 mr-3 text-orange-400" />
              GA4 Code Generator
            </h2>
            <p className="text-gray-400">Code generation tools coming soon...</p>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-7 h-7 mr-3 text-orange-400" />
              The Beast Playbook
            </h2>
            <p className="text-gray-400">Documentation coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
