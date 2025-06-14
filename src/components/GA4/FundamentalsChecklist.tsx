import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Settings,
  Shield,
  TrendingUp,
  Database,
  Link,
  BarChart3
} from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface FundamentalsChecklistProps {
  audit: GA4Audit;
}

interface ChecklistItem {
  id: string;
  name: string;
  status: 'complete' | 'warning' | 'critical' | 'missing' | 'optional';
  value: string;
  description: string;
  recommendation: string;
  priority: 'critical' | 'important' | 'optional';
  adminPath?: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  items: ChecklistItem[];
}

export const FundamentalsChecklist: React.FC<FundamentalsChecklistProps> = ({ audit }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['property-config', 'key-events'])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

const getStatusIcon = (status: ChecklistItem['status']) => {
  switch (status) {
    case 'complete':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    case 'critical':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'missing':
      return <XCircle className="w-5 h-5 text-gray-500" />;
    case 'optional':
      return <AlertTriangle className="w-5 h-5 text-blue-500" />;
  }
};

const getStatusColor = (status: ChecklistItem['status']) => {
  switch (status) {
    case 'complete':
      return 'border-green-500/30 bg-green-500/10';
    case 'warning':
      return 'border-yellow-500/30 bg-yellow-500/10';
    case 'critical':
      return 'border-red-500/30 bg-red-500/10';
    case 'missing':
      return 'border-gray-500/30 bg-gray-500/10';
    case 'optional':
      return 'border-blue-500/30 bg-blue-500/10';
  }
};

  // Build the checklist sections based on audit data
  const sections: ChecklistSection[] = [
    {
      id: 'property-config',
      title: 'Property Configuration',
      icon: Settings,
      description: 'Core property settings that affect all your data',
      items: [
        {
          id: 'timezone',
          name: 'Set Timezone',
          status: audit.property.timeZone ? 'complete' : 'critical',
          value: audit.property.timeZone || 'Not Set (defaults to Pacific Time)',
          description: 'Keep timezones consistent across marketing platforms for accurate attribution',
          recommendation: audit.property.timeZone 
            ? 'Timezone is properly configured' 
            : 'CRITICAL: Set timezone in Admin > Property > Property Details',
          priority: 'critical',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'currency',
          name: 'Set Currency',
          status: audit.property.currencyCode ? 'complete' : 'warning',
          value: audit.property.currencyCode || 'USD (default)',
          description: 'GA4 defaults to USD and converts all transactions based on daily rates',
          recommendation: audit.property.currencyCode
            ? 'Currency is configured'
            : 'Consider setting your primary business currency',
          priority: 'important',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'industry',
          name: 'Set Industry Category',
          status: audit.property.industryCategory ? 'complete' : 'warning',
          value: audit.property.industryCategory || 'Not Set',
          description: 'Improves machine learning predictions and benchmarking data',
          recommendation: audit.property.industryCategory
            ? 'Industry category set for better insights'
            : 'Set industry category for improved benchmarking',
          priority: 'important',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'data-retention',
          name: 'Set Data Retention Period',
          status: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 'complete' : 'critical',
          value: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' 
            ? '14 months (optimal)' 
            : audit.dataRetention.eventDataRetention || '2 months (default - CRITICAL)',
          description: 'Default is only 2 months! Set to 14 months maximum for historical analysis',
          recommendation: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS'
            ? 'Data retention optimized'
            : 'URGENT: Change to 14 months to prevent permanent data loss',
          priority: 'critical',
          adminPath: 'Admin > Data Settings > Data retention'
        }
      ]
    },
    {
      id: 'data-collection',
      title: 'Data Collection & Privacy',
      icon: Shield,
      description: 'Privacy settings and data collection configuration',
      items: [
        {
          id: 'google-signals',
          name: 'Configure Google Signals',
          status: audit.googleSignals.state === 'GOOGLE_SIGNALS_ENABLED' ? 'warning' : 'missing',
          value: audit.googleSignals.state === 'GOOGLE_SIGNALS_ENABLED' 
            ? 'Enabled (check privacy policy)' 
            : 'Not enabled',
          description: 'Enables demographics but may cause data thresholding and requires privacy updates',
          recommendation: audit.googleSignals.state === 'GOOGLE_SIGNALS_ENABLED'
            ? 'PRIVACY: Ensure privacy policy mentions demographics collection'
            : 'Consider enabling for cross-device insights (requires privacy review)',
          priority: 'optional',
          adminPath: 'Admin > Data collection > Data collection'
        },
        {
          id: 'data-streams',
          name: 'Configure Data Streams',
          status: audit.dataStreams.length > 0 ? 'complete' : 'critical',
          value: `${audit.dataStreams.length} stream(s) configured`,
          description: 'Each platform (web, iOS, Android) should have its own stream',
          recommendation: audit.dataStreams.length > 0
            ? 'Data streams are properly configured'
            : 'CRITICAL: Add data streams for your platforms',
          priority: 'critical',
          adminPath: 'Admin > Data Streams'
        },
        {
          id: 'enhanced-measurement',
          name: 'Enable Enhanced Measurement',
          status: audit.enhancedMeasurement.length > 0 ? 'complete' : 'warning',
          value: audit.enhancedMeasurement.length > 0 
            ? `Active on ${audit.enhancedMeasurement.length} stream(s)`
            : 'Not configured',
          description: 'Automatically tracks page views, scrolls, outbound clicks, site search, video, file downloads',
          recommendation: audit.enhancedMeasurement.length > 0
            ? 'Enhanced measurement is active'
            : 'Enable for automatic event tracking without code changes',
          priority: 'important',
          adminPath: 'Admin > Data Streams > [Stream] > Enhanced measurement'
        }
      ]
    },
    {
      id: 'key-events',
      title: 'Key Events (Conversions)',
      icon: TrendingUp,
      description: 'Business goals and conversion tracking',
      items: [
        {
          id: 'key-events-setup',
          name: 'Set Key Events',
          status: audit.keyEvents.length > 0 ? 'complete' : 'critical',
          value: `${audit.keyEvents.length} key event(s) configured`,
          description: '"Conversions" are now "Key Events" - these can be imported to Google Ads as conversions',
          recommendation: audit.keyEvents.length > 0
            ? `Active events: ${audit.keyEvents.map(e => e.eventName).slice(0, 3).join(', ')}`
            : 'CRITICAL: Set up key events for purchases, sign-ups, downloads',
          priority: 'critical',
          adminPath: 'Admin > Events > Mark events as key events'
        }
      ]
    },
    {
      id: 'custom-definitions',
      title: 'Custom Definitions',
      icon: Database,
      description: 'Business-specific tracking parameters',
      items: [
        {
          id: 'custom-dimensions',
          name: 'Define Custom Dimensions',
          status: audit.customDimensions.length > 0 ? 'complete' : 'warning',
          value: `${audit.customDimensions.length}/50 configured`,
          description: 'Register event parameters as custom dimensions to use in reports',
          recommendation: audit.customDimensions.length > 0
            ? `${audit.customDimensions.length} dimensions for detailed analysis`
            : 'Add custom dimensions for user types, content categories, etc.',
          priority: 'important',
          adminPath: 'Admin > Custom definitions > Custom dimensions'
        },
        {
          id: 'custom-metrics',
          name: 'Create Custom Metrics',
          status: audit.customMetrics.length > 0 ? 'complete' : 'optional',
          value: `${audit.customMetrics.length}/50 configured`,
          description: 'Track numerical business KPIs beyond standard GA4 metrics',
          recommendation: audit.customMetrics.length > 0
            ? `${audit.customMetrics.length} custom metrics for business KPIs`
            : 'Consider adding for engagement scores, business-specific metrics',
          priority: 'optional',
          adminPath: 'Admin > Custom definitions > Custom metrics'
        },
        {
          id: 'enhanced-measurement-params',
          name: 'Register Enhanced Measurement Parameters',
          status: (() => {
            const videoParams = ['video_current_time', 'video_duration', 'video_percent'];
            const formParams = ['form_id', 'form_name'];
            const existingParams = audit.customDimensions.map(d => d.parameterName.toLowerCase());
            const hasVideoParams = videoParams.some(p => existingParams.includes(p));
            const hasFormParams = formParams.some(p => existingParams.includes(p));
            
            if (hasVideoParams && hasFormParams) return 'complete';
            if (hasVideoParams || hasFormParams) return 'warning';
            return 'missing';
          })(),
          value: (() => {
            const videoParams = ['video_current_time', 'video_duration', 'video_percent'];
            const formParams = ['form_id', 'form_name', 'file_name'];
            const existingParams = audit.customDimensions.map(d => d.parameterName.toLowerCase());
            const foundParams = [...videoParams, ...formParams].filter(p => existingParams.includes(p));
            return foundParams.length > 0 ? `${foundParams.length} parameters registered` : 'No EM parameters found';
          })(),
          description: 'Register video_current_time, form_id, form_name, file_name for enhanced measurement',
          recommendation: 'Register enhanced measurement parameters as dimensions for detailed insights',
          priority: 'optional',
          adminPath: 'Admin > Custom definitions > Custom dimensions'
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Platform Integrations',
      icon: Link,
      description: 'Connections with other Google marketing tools',
      items: [
        {
          id: 'google-ads',
          name: 'Connect Google Ads',
          status: audit.googleAdsLinks.length > 0 ? 'complete' : 'warning',
          value: audit.googleAdsLinks.length > 0 ? 'Connected & Active' : 'Not Connected',
          description: 'Import key events as Google Ads conversions for bidding optimization',
          recommendation: audit.googleAdsLinks.length > 0
            ? 'Google Ads linked for conversion tracking'
            : 'Link Google Ads for Smart Bidding and audience sharing',
          priority: 'important',
          adminPath: 'Admin > Product linking > Google Ads'
        },
        {
          id: 'search-console',
          name: 'Connect Search Console',
          status: audit.searchConsoleDataStatus.isLinked ? 'complete' : 'warning',
          value: audit.searchConsoleDataStatus.isLinked 
            ? `Linked (${audit.searchConsoleDataStatus.totalClicks} clicks)` 
            : 'Not Connected',
          description: 'Shows which Google search queries bring visitors to your site',
          recommendation: audit.searchConsoleDataStatus.isLinked
            ? 'Search Console providing organic search insights'
            : 'Link Search Console for organic search query data',
          priority: 'important',
          adminPath: 'Admin > Product linking > Search Console'
        },
        {
          id: 'bigquery',
          name: 'Connect BigQuery',
          status: audit.bigQueryLinks.length > 0 ? 'complete' : 'optional',
          value: audit.bigQueryLinks.length > 0 ? 'Export Configured' : 'Not Configured',
          description: 'Free tier available for GA4 - enables advanced analysis with SQL',
          recommendation: audit.bigQueryLinks.length > 0
            ? 'BigQuery export configured for advanced analysis'
            : 'Consider BigQuery for raw data export and custom analysis',
          priority: 'optional',
          adminPath: 'Admin > Product linking > BigQuery'
        }
      ]
    },
    {
      id: 'attribution',
      title: 'Attribution & Reporting',
      icon: BarChart3,
      description: 'How conversion credit is assigned across touchpoints',
      items: [
        {
          id: 'attribution-model',
          name: 'Configure Attribution Settings',
          status: audit.attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN' 
            ? 'complete' : audit.attribution.reportingAttributionModel ? 'warning' : 'missing',
          value: (() => {
            const model = audit.attribution.reportingAttributionModel;
            if (!model) return 'Not accessible via API';
            
            const modelNames: Record<string, string> = {
              'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN': 'Data-driven (recommended)',
              'PAID_AND_ORGANIC_CHANNELS_LAST_CLICK': 'Last click',
              'PAID_AND_ORGANIC_CHANNELS_FIRST_CLICK': 'First click',
              'PAID_AND_ORGANIC_CHANNELS_LINEAR': 'Linear',
              'PAID_AND_ORGANIC_CHANNELS_TIME_DECAY': 'Time decay',
              'PAID_AND_ORGANIC_CHANNELS_POSITION_BASED': 'Position-based'
            };
            
            return modelNames[model] || model;
          })(),
          description: 'Data-driven attribution with 30-day acquisition, 90-day other events is recommended',
          recommendation: audit.attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN'
            ? 'Using optimal data-driven attribution model'
            : 'Consider switching to data-driven attribution for better accuracy',
          priority: 'important',
          adminPath: 'Admin > Attribution settings'
        }
      ]
    }
  ];

  const getOverallScore = () => {
    const allItems = sections.flatMap(s => s.items);
    const criticalItems = allItems.filter(i => i.priority === 'critical');
    const completedCritical = criticalItems.filter(i => i.status === 'complete').length;
    const totalCritical = criticalItems.length;
    
    const importantItems = allItems.filter(i => i.priority === 'important');
    const completedImportant = importantItems.filter(i => i.status === 'complete').length;
    const totalImportant = importantItems.length;
    
    // Weight critical items more heavily
    const criticalScore = totalCritical > 0 ? (completedCritical / totalCritical) * 0.7 : 0;
    const importantScore = totalImportant > 0 ? (completedImportant / totalImportant) * 0.3 : 0;
    
    return Math.round((criticalScore + importantScore) * 100);
  };

  const score = getOverallScore();

  return (
    <div className="space-y-6">
      {/* Overall Score Header */}
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-white">GA4 Fundamentals Checklist</h3>
            <p className="text-gray-400">2025 Edition - Essential configuration items</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {score}%
            </div>
            <p className="text-sm text-gray-400">Fundamentals Complete</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-red-400 font-bold text-lg">
              {sections.flatMap(s => s.items).filter(i => i.priority === 'critical' && i.status !== 'complete').length}
            </div>
            <div className="text-xs text-red-300">Critical Issues</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-yellow-400 font-bold text-lg">
              {sections.flatMap(s => s.items).filter(i => i.priority === 'important' && i.status !== 'complete').length}
            </div>
            <div className="text-xs text-yellow-300">Important Items</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="text-green-400 font-bold text-lg">
              {sections.flatMap(s => s.items).filter(i => i.status === 'complete').length}
            </div>
            <div className="text-xs text-green-300">Completed</div>
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      {sections.map((section) => {
        const criticalIssues = section.items.filter(i => i.priority === 'critical' && i.status !== 'complete').length;
        
        return (
          <div key={section.id} className="bg-black/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-6 text-left hover:bg-black/70 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <section.icon className="w-6 h-6 text-orange-400" />
                    {criticalIssues > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{criticalIssues}</span>
                      </div>
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
                      <div key={index} className="w-2 h-2 rounded-full">
                        {item.status === 'complete' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        {item.status === 'warning' && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                        {(item.status === 'critical' || item.status === 'missing') && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                      </div>
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
                {section.items.map((item) => (
                  <div key={item.id} className={`rounded-lg p-4 border ${getStatusColor(item.status)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <h5 className="font-semibold text-white">{item.name}</h5>
                          {item.priority === 'critical' && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">
                              CRITICAL
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-300">{item.value}</div>
                        {item.adminPath && (
                          <div className="text-xs text-gray-500 mt-1">{item.adminPath}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 ml-8">
                      <p className="text-sm text-gray-300">{item.description}</p>
                      <p className={`text-sm font-medium ${
                        item.status === 'complete' ? 'text-green-300' : 
                        item.status === 'warning' ? 'text-yellow-300' : 'text-red-300'
                      }`}>
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
