import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Settings,
  TrendingUp,
  Database,
  Link,
  BarChart3
} from 'lucide-react';
import { GA4Audit } from '@/types/ga4';
import { scrollToSection } from '@/app/page';

interface FundamentalsChecklistProps {
  audit: GA4Audit;
}

interface ChecklistItem {
  id: string;
  name: string;
  status: 'complete' | 'warning' | 'critical' | 'missing' | 'opportunity';
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
      case 'opportunity':
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
      case 'opportunity':
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
            ? `Timezone set to ${audit.property.timeZone}` 
            : 'CRITICAL: Set timezone to match your business location',
          priority: 'critical',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'currency',
          name: 'Set Currency',
          status: audit.property.currencyCode ? 'complete' : 'warning',
          value: audit.property.currencyCode || 'USD (default)',
          description: 'Used for e-commerce tracking and revenue reporting',
          recommendation: audit.property.currencyCode
            ? `Currency set to ${audit.property.currencyCode}`
            : 'Set currency for accurate revenue reporting',
          priority: 'important',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'data-retention',
          name: 'Data Retention',
          status: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 'complete' : 'warning',
          value: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' 
            ? '14 months (maximum)' 
            : `${audit.dataRetention.eventDataRetention || '2 months (default)'}`,
          description: 'Standard properties max out at 14 months',
          recommendation: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS'
            ? 'Data retention set to maximum (14 months)'
            : 'Consider increasing retention to 14 months for longer analysis windows',
          priority: 'important',
          adminPath: 'Admin > Data settings > Data retention'
        },
        {
          id: 'google-signals',
          name: 'Google Signals',
          status: audit.googleSignals.state === 'GOOGLE_SIGNALS_ENABLED' ? 
            'warning' : 'missing',
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
          // FIX 1: Show warning for too many key events
          status: audit.keyEvents.length === 0 ? 'critical' : 
                 audit.keyEvents.length > 2 ? 'warning' : 'complete',
          value: `${audit.keyEvents.length} key event(s) configured`,
          description: '"Conversions" are now "Key Events" - these can be imported to Google Ads as conversions',
          recommendation: audit.keyEvents.length === 0
            ? 'CRITICAL: Set up key events for purchases, sign-ups, downloads'
            : audit.keyEvents.length > 2
            ? `⚠️ TOO MANY: ${audit.keyEvents.length} key events may skew data. Consider focusing on 1-2 primary goals.`
            : `Active events: ${audit.keyEvents.map(e => e.eventName).join(', ')}`,
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
          // FIX 2: Make custom dimensions optional/opportunity rather than warning when missing
          status: audit.customDimensions.length > 0 ? 'complete' : 'opportunity',
          value: `${audit.customDimensions.length}/50 configured`,
          description: 'Register event parameters as custom dimensions to use in reports',
          recommendation: audit.customDimensions.length > 0
            ? `${audit.customDimensions.length} dimensions for detailed analysis`
            : 'Optional: Add custom dimensions for user types, content categories, etc.',
          priority: 'optional',
          adminPath: 'Admin > Custom definitions > Custom dimensions'
        },
        {
          id: 'custom-metrics',
          name: 'Create Custom Metrics',
          // FIX 2: Make custom metrics optional/opportunity rather than missing when none
          status: audit.customMetrics.length > 0 ? 'complete' : 'opportunity',
          value: `${audit.customMetrics.length}/50 configured`,
          description: 'Track numerical business KPIs beyond standard GA4 metrics',
          recommendation: audit.customMetrics.length > 0
            ? `${audit.customMetrics.length} custom metrics for business KPIs`
            : 'Optional: Consider adding for engagement scores, business-specific metrics',
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
            return 'opportunity';
          })(),
          value: (() => {
            const videoParams = ['video_current_time', 'video_duration', 'video_percent'];
            const formParams = ['form_id', 'form_name', 'file_name'];
            const existingParams = audit.customDimensions.map(d => d.parameterName.toLowerCase());
            const foundParams = [...videoParams, ...formParams].filter(p => existingParams.includes(p));
            return foundParams.length > 0 ? `${foundParams.length} parameters registered` : 'Recommend: video_current_time, form_id, form_name, file_name';
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
          status: audit.searchConsoleDataStatus.isLinked 
            ? (audit.searchConsoleDataStatus.hasData ? 'complete' : 'warning')
            : 'missing',
          value: audit.searchConsoleDataStatus.isLinked 
            ? `${audit.searchConsoleDataStatus.hasData ? 'Active' : 'Linked, no data'} (${audit.searchConsoleDataStatus.organicImpressions?.toLocaleString() || 0} impressions)` 
            : 'Not Connected',
          description: 'Shows which Google search queries bring visitors to your site',
          recommendation: audit.searchConsoleDataStatus.isLinked && audit.searchConsoleDataStatus.hasData
            ? 'Search Console providing organic search insights'
            : audit.searchConsoleDataStatus.isLinked
              ? 'Linked but verify data flow - check Reports > Library > Search Console'
              : 'Link Search Console for organic search query data',
          priority: 'important',
          adminPath: 'Admin > Product linking > Search Console'
        },
        {
          id: 'bigquery',
          name: 'Connect BigQuery',
          // FIX 3: Make BigQuery an opportunity rather than missing
          status: audit.bigQueryLinks.length > 0 ? 'complete' : 'opportunity',
          value: audit.bigQueryLinks.length > 0 ? 'Export Configured' : 'Not Configured',
          description: 'Free tier available for GA4 - enables advanced analysis with SQL',
          recommendation: audit.bigQueryLinks.length > 0
            ? 'BigQuery export configured for advanced analysis'
            : 'OPPORTUNITY: Consider BigQuery for raw data export and custom analysis (free tier available!)',
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
          name: 'Attribution Model Configuration',
          status: audit.attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN' 
            ? 'complete' : audit.attribution.reportingAttributionModel ?
            'warning' : 'missing',
          value: (() => {
            // FIX 4: Make attribution more legible
            const model = audit.attribution.reportingAttributionModel;
            if (!model) return 'Not configured';
            
            const modelNames: Record<string, string> = {
              'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN': 'Data-driven (optimal)',
              'PAID_AND_ORGANIC_CHANNELS_LAST_CLICK': 'Last click (legacy)',
              'PAID_AND_ORGANIC_CHANNELS_FIRST_CLICK': 'First click (legacy)',
              'PAID_AND_ORGANIC_CHANNELS_LINEAR': 'Linear (basic)',
              'PAID_AND_ORGANIC_CHANNELS_TIME_DECAY': 'Time decay (basic)',
              'PAID_AND_ORGANIC_CHANNELS_POSITION_BASED': 'Position-based (basic)'
            };
            
            return modelNames[model] || 'Unknown model';
          })(),
          description: 'Data-driven attribution provides the most accurate conversion credit using machine learning',
          recommendation: audit.attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN'
            ? '✅ Optimal setup: Data-driven attribution provides the most accurate conversion credit'
            : audit.attribution.reportingAttributionModel
            ? '⚠️ Consider upgrading to data-driven attribution for better insights and Google Ads performance'
            : 'Configure attribution model in Admin > Attribution settings',
          priority: audit.attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN' 
            ? 'optional' : 'important',
          adminPath: 'Admin > Attribution settings'
        }
      ]
    }
  ];

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
        <CheckCircle className="w-7 h-7 mr-3 text-orange-400" />
        GA4 Fundamentals Checklist
      </h3>

      <div className="space-y-6">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const IconComponent = section.icon;
          
          return (
            <div key={section.id} className="bg-black/50 rounded-xl border border-gray-600/50">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-gray-800/30 transition-colors rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                    <div>
                      <h4 className="text-xl font-semibold text-white">{section.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">
                      {section.items.filter(item => item.status === 'complete').length}/{section.items.length} complete
                    </div>
                    {isExpanded ? 
                      <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4">
                  {section.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-white">{item.name}</h5>
                            <span className="text-sm font-medium text-gray-300">{item.value}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                          <p className="text-sm text-gray-400 mb-2">{item.recommendation}</p>
                          {item.adminPath && (
                            <p className="text-xs text-gray-500">
                              <strong>Location:</strong> {item.adminPath}
                            </p>
                          )}
                          {item.id === 'enhanced-measurement' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                scrollToSection('enhancedMeasurement');
                              }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
