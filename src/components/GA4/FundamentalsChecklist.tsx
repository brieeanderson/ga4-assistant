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
import { formatLabel } from '../../lib/formatLabel';

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
  const [showAllHostnames, setShowAllHostnames] = useState(false);

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
  const totalEventCreateRules = audit.eventCreateRules?.reduce((total, stream) => total + stream.rules.length, 0) || 0;
  
  // Get total count of event edit rules
  const totalEventEditRules = audit.eventEditRules?.reduce((total, stream) => total + stream.rules.length, 0) || 0;

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
          value: audit.property.timeZone || 'Not Set',
          description: 'Ensures accurate timing for all events and reporting',
          recommendation: audit.property.timeZone ? 'Timezone is properly configured' : 'Set the correct timezone in Admin > Property Settings',
          priority: 'critical',
          adminPath: 'Admin > Property Settings > Property details'
        },
        {
          id: 'currency',
          name: 'Set Currency',
          status: audit.property.currencyCode ? 'complete' : 'warning',
          value: audit.property.currencyCode || 'Not Set',
          description: 'Critical for accurate revenue tracking and e-commerce reporting',
          recommendation: audit.property.currencyCode ? 'Currency is properly configured' : 'Set the correct currency code in Admin > Property Settings',
          priority: 'important',
          adminPath: 'Admin > Property Settings > Property details'
        },
        {
          id: 'industry',
          name: 'Set Industry Category',
          status: audit.property.industryCategory ? 'complete' : 'opportunity',
          value: audit.property.industryCategory ? audit.property.industryCategory.replace(/_/g, ' ') : 'Not Set',
          description: 'Helps Google provide relevant benchmarks and insights',
          recommendation: audit.property.industryCategory ? 'Industry category is set' : 'Set your industry category for better benchmarking',
          priority: 'optional',
          adminPath: 'Admin > Property Settings > Property details'
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention & Privacy',
      icon: Database,
      description: 'Controls how long your data is stored',
      items: [
        {
          id: 'event-retention',
          name: 'Event Data Retention',
          status: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 'complete' : 
                  audit.dataRetention.eventDataRetention === 'TWO_MONTHS' ? 'warning' : 'critical',
          value: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? '14 months' :
                 audit.dataRetention.eventDataRetention === 'TWO_MONTHS' ? '2 months' : 'Unknown',
          description: 'Determines how long event-level data is available for analysis',
          recommendation: audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 
            'Maximum retention period is set' : 
            'Consider setting to 14 months for maximum data retention',
          priority: 'important',
          adminPath: 'Admin > Data Settings > Data Retention'
        },
        {
          id: 'reset-user-data',
          name: 'Reset User Data on New Activity',
          status: audit.dataRetention.resetUserDataOnNewActivity === true ? 'complete' : 
                  audit.dataRetention.resetUserDataOnNewActivity === false ? 'warning' : 'opportunity',
          value: audit.dataRetention.resetUserDataOnNewActivity === true ? 'Enabled' :
                 audit.dataRetention.resetUserDataOnNewActivity === false ? 'Disabled' : 'Unknown',
          description: 'Automatically reset user data when a user starts a new session after 14 months of inactivity',
          recommendation: audit.dataRetention.resetUserDataOnNewActivity === true ? 
            'User data reset is enabled for better privacy compliance' : 
            'Consider enabling user data reset for better privacy compliance and data freshness',
          priority: 'important',
          adminPath: 'Admin > Data Settings > Data Retention'
        },


        {
          id: 'pii-redaction',
          name: 'PII in URLs',
          status: (() => {
            const pii = audit.dataQuality?.piiAnalysis;
            if (!pii) return 'warning';
            if (pii.severity === 'critical') return 'critical';
            return 'warning';
          })(),
          value: (() => {
            const pii = audit.dataQuality?.piiAnalysis;
            if (!pii) return 'Not checked';
            if (pii.severity === 'critical') {
              const details = pii.details;
              const types = [];
              if (details.critical.length > 0) types.push('Critical');
              if (details.high.length > 0) types.push('High');
              if (details.medium.length > 0) types.push('Medium');
              return `PII detected (${types.join(', ')}): ${details.totalAffectedUrls} URLs`;
            }
            return 'No PII detected in URLs';
          })(),
          description: 'Checks for names, email addresses, phone numbers, SSNs, usernames, and other PII in page URLs and query parameters. PII in URLs is a major privacy and compliance risk.',
          recommendation: (() => {
            const pii = audit.dataQuality?.piiAnalysis;
            if (!pii) return 'Review your site for PII in URLs. This check is based on the last 30 days of data.';
            if (pii.severity === 'critical') return pii.recommendation || 'URGENT: Remove PII from URLs and configure data redaction.';
            return 'No PII detected, but always review your site for privacy risks.';
          })(),
          priority: 'critical',
          adminPath: 'Admin > Data Settings > Data Collection > Data redaction'
        }
      ]
    },
    {
      id: 'key-events',
      title: 'Key Events (Conversions)',
      icon: TrendingUp,
      description: 'Events that represent valuable actions on your site',
      items: [
        {
          id: 'key-events-count',
          name: 'Key Events Configured',
          status: audit.keyEvents.length === 0 ? 'critical' :
                  audit.keyEvents.length > 2 ? 'warning' : 'complete',
          value: `${audit.keyEvents.length} events`,
          description: 'Key events help measure what matters most to your business',
          recommendation: audit.keyEvents.length === 0 ? 
            'Set up at least 1-2 key events for proper conversion tracking' :
            audit.keyEvents.length > 2 ?
            'Consider focusing on 1-2 primary key events for clearer insights' :
            'Good balance of key events configured',
          priority: 'critical',
          adminPath: 'Admin > Events > Key Events'
        }
      ]
    },
    {
      id: 'data-streams',
      title: 'Data Streams',
      icon: BarChart3,
      description: 'Sources of data flowing into your property',
      items: [
        {
          id: 'data-streams-count',
          name: 'Data Streams Active',
          status: audit.dataStreams.length > 0 ? 'complete' : 'critical',
          value: `${audit.dataStreams.length} streams`,
          description: 'Data streams connect your websites and apps to GA4',
          recommendation: audit.dataStreams.length > 0 ? 
            'Data streams are properly configured' : 
            'Configure at least one data stream to collect data',
          priority: 'critical',
          adminPath: 'Admin > Data Streams'
        },
        {
          id: 'cross-domain-tracking',
          name: 'Cross-Domain Tracking',
          status: 'warning',
          value: audit.hostnames && audit.hostnames.length > 0
            ? `Detected ${audit.hostnames.length} hostnames`
            : 'No hostnames detected',
          description: 'Cross-domain tracking cannot be fully detected via the API. Review the list of detected hostnames and ensure all your domains/subdomains are tracked and properly configured for cross-domain tracking.',
          recommendation: 'Double check that all of your domains/subdomains are tracked and cross-domain tracking is set up if needed. Use the list above to verify.',
          priority: 'important',
          adminPath: 'Admin > Data Streams > [Stream] > Configure tag settings > Configure your domains'
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Platform Integrations',
      icon: Link,
      description: 'Connections to other Google services',
      items: [
        {
          id: 'google-ads',
          name: 'Google Ads Integration',
          status: audit.googleAdsLinks?.length > 0 ? 'complete' : 'opportunity',
          value: audit.googleAdsLinks?.length > 0 ? `${audit.googleAdsLinks.length} links` : 'Not linked',
          description: 'Enables conversion import and audience sharing',
          recommendation: audit.googleAdsLinks?.length > 0 ? 
            'Google Ads is properly linked' : 
            'Link Google Ads for conversion tracking and audience insights',
          priority: 'important',
          adminPath: 'Admin > Product Links > Google Ads Links'
        },
        {
          id: 'search-console',
          name: 'Search Console Integration',
          status: audit.searchConsoleDataStatus?.isLinked ? 'complete' : 'opportunity',
          value: audit.searchConsoleDataStatus?.isLinked ? 'Linked' : 'Not linked',
          description: 'Provides organic search performance data in GA4',
          recommendation: audit.searchConsoleDataStatus?.isLinked ? 
            'Search Console is properly linked' : 
            'Link Search Console for organic search insights',
          priority: 'important',
          adminPath: 'Admin > Product Links > Search Console Links'
        },
        {
          id: 'bigquery',
          name: 'BigQuery Integration',
          status: audit.bigQueryLinks?.length > 0 ? 'complete' : 'opportunity',
          value: audit.bigQueryLinks?.length > 0 ? `${audit.bigQueryLinks.length} links` : 'Not linked',
          description: 'Connect GA4 to BigQuery for advanced analysis and data exports (free tier available)',
          recommendation: audit.bigQueryLinks?.length > 0 ?
            'BigQuery is properly linked' :
            'Enable BigQuery export for advanced analysis',
          priority: 'optional',
          adminPath: 'Admin > Product Links > BigQuery Links'
        },
        {
          id: 'measurement-protocol-secrets',
          name: 'Measurement Protocol Secrets',
          status: audit.measurementProtocolSecrets && audit.measurementProtocolSecrets.some(s => s.secrets.length > 0) ? 'warning' : 'complete',
          value: audit.measurementProtocolSecrets && audit.measurementProtocolSecrets.some(s => s.secrets.length > 0) ? 'Present' : 'None',
          description: 'Checks if any Measurement Protocol secrets are created for your data streams.',
          recommendation: audit.measurementProtocolSecrets && audit.measurementProtocolSecrets.some(s => s.secrets.length > 0) ? 'Review and secure any Measurement Protocol secrets.' : 'No Measurement Protocol secrets found.',
          priority: 'important',
          adminPath: 'Admin > Data Streams > [Stream] > Measurement Protocol API secrets'
        },
        {
          id: 'google-signals',
          name: 'Google Signals',
          status: audit.googleSignals?.state ? 'complete' : 'warning',
          value: audit.googleSignals?.state ? formatLabel(audit.googleSignals.state) : 'N/A',
          description: audit.googleSignals?.state !== 'GOOGLE_SIGNALS_ENABLED'
            ? 'You will not see demographic data in your reports unless Google Signals is enabled.'
            : 'If enabled, ensure your privacy policy is updated to reflect Google Signals usage.',
          recommendation: audit.googleSignals?.state ? 'Google Signals is enabled' : 'Enable Google Signals for demographic data',
          priority: 'important',
          adminPath: 'Admin > Data Streams > [Stream] > Google Signals'
        }
      ]
    },
    {
      id: 'enhanced-features',
      title: 'Enhanced Features',
      icon: Database,
      description: 'Advanced tracking and measurement features',
      items: [
        {
          id: 'custom-definitions',
          name: 'Custom Definitions',
          status: (audit.customDimensions?.length + audit.customMetrics?.length) > 0 ? 'complete' : 'opportunity',
          value: `${audit.customDimensions?.length || 0} dimensions, ${audit.customMetrics?.length || 0} metrics`,
          description: 'Custom dimensions and metrics for business-specific tracking',
          recommendation: (audit.customDimensions?.length + audit.customMetrics?.length) > 0 ? 
            'Custom definitions are configured' : 
            'Consider adding custom dimensions/metrics for business-specific data',
          priority: 'optional',
          adminPath: 'Admin > Custom Definitions'
        },
        {
          id: 'custom-ga4-created-events',
          name: 'Custom GA4 Created Events',
          status: totalEventCreateRules > 3 ? 'critical' : totalEventCreateRules > 0 ? 'warning' : 'complete',
          value: `${totalEventCreateRules} rules`,
          description: 'Rules to automatically create events from existing data',
          recommendation: totalEventCreateRules > 0 ? 
            'Custom GA4 created events are configured' : 
            'Consider creating custom events to automatically track important interactions',
          priority: 'optional',
          adminPath: 'Admin > Events > Event Create Rules'
        },
        {
          id: 'custom-ga4-edit-events',
          name: 'Custom GA4 Edit Events',
          status: totalEventEditRules > 3 ? 'critical' : totalEventEditRules > 0 ? 'warning' : 'complete',
          value: `${totalEventEditRules} rules`,
          description: 'Rules to modify existing events and parameters',
          recommendation: totalEventEditRules > 0 ? 
            'Custom GA4 edit events are configured' : 
            'Consider using event edit rules to modify existing events for better data quality',
          priority: 'optional',
          adminPath: 'Admin > Events > Event Edit Rules'
        },
        {
          id: 'site-search-parameters',
          name: 'Site Search Parameters',
          status: audit.enhancedMeasurement && audit.enhancedMeasurement.some(s => s.settings.siteSearchEnabled) ? 'complete' : 'opportunity',
          value: audit.enhancedMeasurement && audit.enhancedMeasurement.some(s => s.settings.siteSearchEnabled) ? 'Configured' : 'Not configured',
          description: 'Checks if site search parameters are enabled in enhanced measurement.',
          recommendation: audit.enhancedMeasurement && audit.enhancedMeasurement.some(s => s.settings.siteSearchEnabled) ? 'Site search is enabled in enhanced measurement.' : 'Enable site search in enhanced measurement for better search insights.',
          priority: 'important',
          adminPath: 'Admin > Data Streams > [Stream] > Enhanced Measurement'
        },
        {
          id: 'attribution-settings',
          name: 'Attribution Settings',
          status: audit.attribution && audit.attribution.reportingAttributionModel ? 'complete' : 'opportunity',
          value: audit.attribution && audit.attribution.reportingAttributionModel ? audit.attribution.reportingAttributionModel : 'Not set',
          description: 'Checks the attribution model and conversion windows for your property.',
          recommendation: audit.attribution && audit.attribution.reportingAttributionModel ? 'Attribution model is set.' : 'Review and set the attribution model for your business.',
          priority: 'important',
          adminPath: 'Admin > Attribution Settings'
        },
        {
          id: 'property-access',
          name: 'Property Access Review',
          status: audit.propertyAccess && audit.propertyAccess.length > 0 ? 'complete' : 'opportunity',
          value: audit.propertyAccess && audit.propertyAccess.length > 0 ? `${audit.propertyAccess.length} user(s)` : 'No direct access found',
          description: 'Review users with direct and inherited access to this GA4 property and their permission levels.',
          recommendation: audit.propertyAccess && audit.propertyAccess.length > 0 ? 
            'Property access is configured. Review permissions regularly for security.' : 
            'Consider reviewing account-level permissions for broader access control.',
          priority: 'important',
          adminPath: 'Admin > Property Access Management'
        }
      ]
    }
  ];

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <CheckCircle className="w-7 h-7 mr-3 text-orange-400" />
        GA4 Fundamentals Checklist
      </h3>
      
      <p className="text-gray-300 mb-8">
        Essential configuration items for reliable GA4 data collection and accurate reporting.
      </p>

      <div className="space-y-6">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const IconComponent = section.icon;
          
          // Calculate section completion
          const totalItems = section.items.length;
          const completedItems = section.items.filter(item => item.status === 'complete').length;
          const criticalIssues = section.items.filter(item => item.status === 'critical').length;
          
          return (
            <div key={section.id} className="border border-gray-600/50 rounded-xl">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                      <p className="text-sm text-gray-400">
                        {completedItems}/{totalItems} completed
                        {criticalIssues > 0 && (
                          <span className="ml-2 text-red-400">• {criticalIssues} critical issue(s)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-400">
                      {Math.round((completedItems / totalItems) * 100)}%
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
                          <div className="text-gray-300 mb-2">{item.description}</div>
                          <div className="text-gray-400 text-sm mb-2">{item.recommendation}</div>
                          {item.id === 'cross-domain-tracking' && audit.hostnames && audit.hostnames.length > 0 && (
                            <div className="mt-2">
                              <div className="font-semibold mb-1 text-gray-200">Detected hostnames:</div>
                              <ul className="ml-4 list-disc">
                                {(showAllHostnames ? audit.hostnames : audit.hostnames.slice(0, 3)).map((host, i) => (
                                  <li key={host + i} className="break-all text-gray-200">{host}</li>
                                ))}
                              </ul>
                              {audit.hostnames.length > 3 && (
                                <button
                                  className="mt-2 text-xs text-blue-400 underline hover:text-blue-300"
                                  onClick={e => { e.stopPropagation(); setShowAllHostnames(v => !v); }}
                                >
                                  {showAllHostnames ? 'Show less' : `Show all (${audit.hostnames.length})`}
                                </button>
                              )}
                            </div>
                          )}
                          {item.adminPath && (
                            <p className="text-xs text-gray-500">
                              <strong>Location:</strong> {item.adminPath}
                            </p>
                          )}
                          {item.id === 'data-streams-count' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('propertyOverview'); }}
                              className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                            >
                              View data streams details
                            </button>
                          )}
                          {item.id === 'key-events-count' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('keyEventsDetail'); }}
                              className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                            >
                              View key events details
                            </button>
                          )}
                          {item.id === 'custom-definitions' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('customDefinitions'); }}
                              className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                            >
                              View custom definitions
                            </button>
                          )}
                          {item.id === 'custom-ga4-created-events' && scrollToSection && (
                            <button
                              onClick={e => { e.stopPropagation(); scrollToSection('eventCreateRules'); }}
                              className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline"
                            >
                              View event create rules
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

      {/* Summary */}
      <div className="mt-8 p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
        <h4 className="font-semibold text-orange-300 mb-2">🎯 Configuration Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Items:</span>
            <div className="text-white font-medium">{sections.reduce((total, section) => total + section.items.length, 0)}</div>
          </div>
          <div>
            <span className="text-gray-400">Completed:</span>
            <div className="text-green-400 font-medium">
              {sections.reduce((total, section) => 
                total + section.items.filter(item => item.status === 'complete').length, 0
              )}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Critical Issues:</span>
            <div className="text-red-400 font-medium">
              {sections.reduce((total, section) => 
                total + section.items.filter(item => item.status === 'critical').length, 0
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
