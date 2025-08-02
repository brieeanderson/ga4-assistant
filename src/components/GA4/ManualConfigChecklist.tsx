import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink,
  Shield,
  Target,
  Database,
  TrendingUp,
  Link,
  Eye
} from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface ManualConfigChecklistProps {
  audit: GA4Audit;
}

interface ManualCheckItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'optional';
  category: 'privacy' | 'tracking' | 'attribution' | 'advanced' | 'integrations';
  adminPath: string;
  docs: Array<{
    title: string;
    url: string;
  }>;
  warningText?: string;
  successText?: string;
}

const categoryIcons = {
  privacy: Shield,
  tracking: Target,
  attribution: TrendingUp,
  advanced: Database,
  integrations: Link
};

const categoryLabels = {
  privacy: 'Privacy & Compliance',
  tracking: 'Tracking Configuration',
  attribution: 'Attribution Settings',
  advanced: 'Advanced Features',
  integrations: 'Platform Integrations'
};

export const ManualConfigChecklist: React.FC<ManualConfigChecklistProps> = ({ audit }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['privacy', 'tracking']));
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleItemCompletion = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  // Manual configuration items
  const manualItems: ManualCheckItem[] = [
    {
      id: 'consent-mode',
      title: 'Implement Consent Mode v2',
      description: 'Configure consent mode for GDPR compliance and privacy-first measurement',
      priority: 'critical',
      category: 'privacy',
      adminPath: 'Implementation required in GTM or website code',
      docs: [
        {
          title: 'Consent Mode Implementation',
          url: 'https://developers.google.com/tag-platform/gtagjs/consent'
        },
        {
          title: 'GTM Consent Mode Setup',
          url: 'https://support.google.com/tagmanager/answer/10718549'
        }
      ],
      warningText: 'Required for EU traffic compliance. Without proper consent mode, you may face legal issues.'
    },
    {
      id: 'attribution-settings',
      title: 'Configure Attribution Settings',
      description: 'Review and optimize attribution model and conversion windows for your business',
      priority: 'important',
      category: 'attribution',
      adminPath: 'Admin > Attribution Settings',
      docs: [
        {
          title: 'Attribution Models Guide',
          url: 'https://support.google.com/analytics/answer/10596866'
        }
      ],
      successText: 'Proper attribution settings help you understand the true customer journey.'
    },

    {
      id: 'audiences',
      title: 'Create Strategic Audiences',
      description: 'Build audiences for remarketing, analysis, and cross-platform insights',
      priority: 'optional',
      category: 'advanced',
      adminPath: 'Admin > Audiences',
      docs: [
        {
          title: 'Audience Builder Guide',
          url: 'https://support.google.com/analytics/answer/9267735'
        }
      ],
      successText: 'Well-defined audiences enable better remarketing and customer analysis.'
    },
    {
      id: 'cross-domain-tracking',
      title: 'Configure Cross-Domain Tracking',
      description: 'Set up cross-domain measurement if you have multiple domains or subdomains',
      priority: 'critical',
      category: 'tracking',
      adminPath: 'Implementation in GTM or site code + Admin > Data Settings > Data Streams',
      docs: [
        {
          title: 'Cross-Domain Tracking',
          url: 'https://support.google.com/analytics/answer/10071811'
        }
      ],
      warningText: 'Without cross-domain tracking, users are counted as new visitors on each domain.'
    },
    {
      id: 'server-side-tracking',
      title: 'Consider Server-Side Tracking',
      description: 'Implement Google Tag Manager Server-Side for improved privacy and data quality',
      priority: 'optional',
      category: 'advanced',
      adminPath: 'Requires separate GTM Server container setup',
      docs: [
        {
          title: 'Server-Side Tagging Guide',
          url: 'https://developers.google.com/tag-platform/tag-manager/server-side'
        }
      ],
      successText: 'Server-side tracking improves data quality and provides better privacy controls.'
    }
  ];

  // Group items by category
  const categorizedItems = manualItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ManualCheckItem[]>);

  // Detect issues from audit data
  const detectedIssues = new Set<string>();
  
  // Check for specific issues we can detect
  if (audit.keyEvents.length === 0) {
    detectedIssues.add('enhanced-measurement-review');
  }
  


  if (audit.dataStreams.length > 1) {
    detectedIssues.add('cross-domain-tracking');
  }

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Eye className="w-7 h-7 mr-3 text-orange-400" />
        Manual Configuration Checklist
      </h3>
      
      <p className="text-gray-300 mb-6">
        Important configurations that require manual setup and cannot be detected automatically. 
        Review each item to ensure your GA4 implementation follows best practices.
      </p>

      {/* Summary of detected issues */}
      {detectedIssues.size > 0 && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
          <h4 className="font-semibold text-red-300 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Issues Detected by Analysis
          </h4>
          <p className="text-sm text-gray-300">
            Our automated analysis found {detectedIssues.size} configuration issue(s) that need your immediate attention.
            These items are highlighted below.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(categorizedItems).map(([category, items]) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          const isExpanded = expandedCategories.has(category);
          const categoryIssues = items.filter(item => detectedIssues.has(item.id)).length;
          const categoryCompleted = items.filter(item => completedItems.has(item.id)).length;
          
          return (
            <div key={category} className="border border-gray-600/50 rounded-xl">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-orange-400" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {categoryCompleted}/{items.length} completed
                        {categoryIssues > 0 && (
                          <span className="ml-2 text-red-400">
                            • {categoryIssues} issue(s) detected
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4">
                  {items.map((item) => {
                    const isCompleted = completedItems.has(item.id);
                    const hasDetectedIssue = detectedIssues.has(item.id);
                    
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          hasDetectedIssue ? 'border-red-500/50 bg-red-500/10' :
                          isCompleted ? 'border-green-500/50 bg-green-500/10' :
                          item.priority === 'critical' ? 'border-red-400/30 bg-red-500/5' :
                          item.priority === 'important' ? 'border-yellow-400/30 bg-yellow-500/5' :
                          'border-gray-600/50 bg-black/30'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleItemCompletion(item.id)}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isCompleted 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-500 hover:border-gray-400'
                            }`}
                          >
                            {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-white mb-1 flex items-center">
                                  {item.title}
                                  {hasDetectedIssue && (
                                    <AlertTriangle className="w-4 h-4 ml-2 text-red-400" />
                                  )}
                                </h5>
                                <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                item.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                                item.priority === 'important' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-blue-500/20 text-blue-300'
                              }`}>
                                {item.priority}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <h6 className="font-semibold text-gray-400 mb-2">Admin Location</h6>
                                <div className="p-3 bg-blue-900/30 rounded border border-blue-600/50">
                                  <p className="text-xs font-medium text-blue-300">
                                    📍 Location: {item.adminPath}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h6 className="font-semibold text-blue-400 mb-3">Documentation & Context</h6>
                                
                                <div className="space-y-3">
                                  {item.docs.map((doc, index) => (
                                    <a
                                      key={index}
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
                                    >
                                      {doc.title}
                                      <ExternalLink className="w-3 h-3 ml-2" />
                                    </a>
                                  ))}
                                </div>

                                {item.warningText && (
                                  <div className="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded">
                                    <h6 className="text-xs font-medium text-red-400 mb-1">⚠️ Why This Matters:</h6>
                                    <p className="text-xs text-gray-300">{item.warningText}</p>
                                  </div>
                                )}

                                {item.successText && (
                                  <div className="mt-4 p-3 bg-green-900/20 border border-green-600/30 rounded">
                                    <h6 className="text-xs font-medium text-green-400 mb-1">✅ Success State:</h6>
                                    <p className="text-xs text-gray-300">{item.successText}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
        <h4 className="font-semibold text-orange-300 mb-2">💡 Implementation Priority</h4>
        <p className="text-sm text-gray-300 mb-2">
          Focus on completing items in this order:
        </p>
        <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
          <li><strong>Critical items with detected issues</strong> (highlighted above)</li>
          <li><strong>Other critical items</strong> (data privacy and compliance)</li>
          <li><strong>Important items</strong> (data quality and attribution)</li>
          <li><strong>Optional items</strong> (advanced tracking features)</li>
        </ol>
      </div>
    </div>
  );
};
