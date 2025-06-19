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

interface FundamentalsChecklistProps {
  audit: GA4Audit;
  scrollToSection?: (section: string) => void;
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

export const FundamentalsChecklist: React.FC<FundamentalsChecklistProps> = ({ audit, scrollToSection }) => {
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

  // Get total count of event create rules
  const totalEventCreateRules = audit.eventCreateRules.reduce((total, stream) => total + stream.rules.length, 0);

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
            ? `Timezone set to ${audit.property.timeZone}. Ensure this matches your business location.`
            : 'CRITICAL: Set your timezone in Admin > Property > Property details.',
          priority: 'critical',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'currency',
          name: 'Set Currency',
          status: audit.property.currencyCode ? 'complete' : 'warning',
          value: audit.property.currencyCode || 'USD (default)',
          description: 'All e-commerce data will be converted to this reporting currency',
          recommendation: audit.property.currencyCode 
            ? `Currency set to ${audit.property.currencyCode}. E-commerce data will be converted to this currency.`
            : 'Consider setting your reporting currency if you accept multiple currencies.',
          priority: 'important',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'industry-category',
          name: 'Set Industry Category',
          status: audit.property.industryCategory ? 'complete' : 'opportunity',
          value: audit.property.industryCategory || 'Not Set',
          description: 'Helps GA4 provide relevant benchmarks and improved automated insights',
          recommendation: audit.property.industryCategory 
            ? `Industry category: ${audit.property.industryCategory.replace(/_/g, ' ')}`
            : 'Optional: Set industry category for better benchmarking insights.',
          priority: 'optional',
          adminPath: 'Admin > Property > Property details'
        },
        {
          id: 'data-retention',
          name: 'Data Retention Settings',
          status: audit.dataRetention.eventDataRetention === 'TWO_MONTHS' ? 'critical' : 'complete',
          value: audit.dataRetention.eventDataRetention === 'TWO_MONTHS' 
            ? '⚠️ CRITICAL: 2 months (losing data!)' 
            : audit.dataRetention.eventDataRetention || 'Check settings',
          description: 'Controls how long GA4 keeps your event data for analysis',
          recommendation: audit.dataRetention.eventDataRetention === 'TWO_MONTHS'
            ? '🚨 URGENT: You\'re losing data after 2 months! Extend to 14 months immediately.'
            : 'Data retention properly configured for historical analysis.',
          priority: 'critical',
          adminPath: 'Admin > Data settings > Data retention'
        },
        {
          id: 'data-streams',
          name: 'Configure Data Streams',
          status: audit.dataStreams.length > 0 ? 'complete' : 'critical',
          value: `${audit.dataStreams.length} data stream(s)`,
          description: 'Data streams collect data from your websites and apps',
          recommendation: audit.dataStreams.length > 0 
            ? `${audit.dataStreams.length} data streams configured`
            : 'CRITICAL: No data streams found. Create a web data stream for your website.',
          priority: 'critical',
          adminPath: 'Admin > Data streams'
        }
      ]
    },
    {
      id: 'key-events',
      title: 'Key Events Setup',
      icon: TrendingUp,
      description: 'Define your most important business outcomes for conversion tracking',
      items: [
        {
          id: 'key-events-setup',
          name: 'Define Key Events',
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
      title: 'Custom Definitions & Advanced Configuration',
      icon: Database,
      description: 'Business-specific tracking parameters and advanced settings',
      items: [
        {
          id: 'custom-dimensions',
          name: 'Define Custom Dimensions',
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
          id: 'event-create-rules',
          name: 'Event Create Rules',
          status: totalEventCreateRules === 0 ? 'complete' : 
                 totalEventCreateRules <= 5 ? 'warning' : 'critical',
          value: totalEventCreateRules === 0 
            ? 'No rules (clean setup)' 
            : `${totalEventCreateRules} rule(s) configured`,
          description: 'Advanced rules that modify or create events - often misconfigured',
          recommendation: totalEventCreateRules === 0
            ? '✅ Clean setup with no event modification rules'
            : totalEventCreateRules <= 5
            ? '⚠️ Event create rules detected - requires expert review for proper configuration'
            : '🚨 CRITICAL: Complex rule configuration detected - high risk of data quality issues',
          priority: totalEventCreateRules > 0 ? 'critical' : 'optional',
          adminPath: 'Admin > Events > Event create rules'
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
          value: audit.googleAdsLinks.length > 0 
            ? `${audit.googleAdsLinks.length} account(s) linked` 
            : 'Not connected',
          description: 'Import key events as Google Ads conversions for bidding optimization',
          recommendation: audit.googleAdsLinks.length > 0
            ? `Google Ads connected for conversion optimization`
            : 'Connect Google Ads to import conversions and access attribution data.',
          priority: 'important',
          adminPath: 'Admin > Product linking > Google Ads'
        },
        {
          id: 'search-console',
          name: 'Connect Search Console',
          status: audit.searchConsoleDataStatus.hasData ? 'complete' : 'warning',
          value: audit.searchConsoleDataStatus.hasData 
            ? 'Connected with data' 
            : audit.searchConsoleDataStatus.isLinked 
            ? 'Linked (verify data)' 
            : 'Not connected',
          description: 'View organic search queries and performance in GA4 reports',
          recommendation: audit.searchConsoleDataStatus.hasData
            ? 'Search Console providing organic search insights'
            : audit.searchConsoleDataStatus.isLinked 
            ? 'Search Console linked - verify data is flowing'
            : 'Connect Search Console for organic search insights.',
          priority: 'important',
          adminPath: 'Admin > Product linking > Search Console'
        },
        {
          id: 'bigquery',
          name: 'Connect BigQuery',
          status: audit.bigQueryLinks.length > 0 ? 'complete' : 'opportunity',
          value: audit.bigQueryLinks.length > 0 
            ? 'Connected for advanced analysis' 
            : 'Not connected',
          description: 'Export GA4 data for advanced analysis and machine learning',
          recommendation: audit.bigQueryLinks.length > 0
            ? 'BigQuery connected for advanced analysis'
            : 'Optional: Connect BigQuery for raw data access (free tier available).',
          priority: 'optional',
          adminPath: 'Admin > Product linking > BigQuery'
        }
      ]
    },
    {
      id: 'data-quality',
      title: 'Data Quality & Attribution',
      icon: BarChart3,
      description: 'Settings that affect data accuracy and attribution',
      items: [
        {
          id: 'enhanced-measurement',
          name: 'Enable Enhanced Measurement',
          status: audit.enhancedMeasurement.length > 0 ? 'complete' : 'warning',
          value: audit.enhancedMeasurement.length > 0 
            ? `Active on ${audit.enhancedMeasurement.length} stream(s)` 
            : 'Not configured',
          description: 'Automatic tracking for common website interactions without code',
          recommendation: audit.enhancedMeasurement.length > 0
            ? 'Enhanced Measurement providing automatic event tracking'
            : 'Enable Enhanced Measurement for automatic tracking of scrolls, clicks, downloads.',
          priority: 'important',
          adminPath: 'Admin > Data streams > Enhanced measurement'
        },
        {
          id: 'attribution-model',
          name: 'Attribution Model',
          status: audit.attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN' 
            ? 'complete' : 'warning',
          value: audit.attribution.reportingAttributionModel 
            ? audit.attribution.reportingAttributionModel.replace(/_/g, ' ').toLowerCase() 
            : 'Check settings',
          description: 'How GA4 assigns conversion credit across marketing touchpoints',
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
                          {item.id === 'data-streams' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('propertyOverview'); }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Details
                            </button>
                          )}
                          {item.id === 'key-events-setup' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('keyEventsDetail'); }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Details
                            </button>
                          )}
                          {item.id === 'custom-dimensions' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('customDefinitions'); }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Details
                            </button>
                          )}
                          {item.id === 'event-create-rules' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('eventCreateRules'); }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Detailed Analysis
                            </button>
                          )}
                          {item.id === 'attribution-model' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('attributionSettings'); }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Details
                            </button>
                          )}
                          {item.id === 'custom-metrics' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('customMetrics'); }}
                              className="mt-2 text-xs text-orange-400 hover:underline focus:outline-none"
                            >
                              View Details
                            </button>
                          )}
                          {item.id === 'enhanced-measurement' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('enhancedMeasurement'); }}
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
