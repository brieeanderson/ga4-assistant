import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Filter, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';

interface ManualCheckItem {
  id: string;
  title: string;
  description: string;
  importance: 'critical' | 'important' | 'optional';
  category: 'privacy' | 'data-quality' | 'attribution' | 'tracking';
  scoreImpact: number;
  adminPath: string;
  steps: string[];
  docs: { title: string; url: string; }[];
  warningText?: string;
  successText?: string;
  detectionHint?: string;
}

// Based on your knowledge base items that can't be auto-detected
const MANUAL_CHECKS: ManualCheckItem[] = [
  {
    id: 'data-redaction',
    title: 'Configure Data Redaction',
    description: 'Automatically remove email addresses, phone numbers, and other PII from URL parameters',
    importance: 'critical',
    category: 'privacy',
    scoreImpact: -25,
    adminPath: 'Admin > Data Settings > Data Collection > Configure tag settings',
    steps: [
      'Navigate to Admin > Data Settings > Data Collection',
      'Click "Configure tag settings"',
      'Scroll to "Data redaction" section',
      'Enable "Remove email addresses in URLs"',
      'Enable "Remove phone numbers in URLs"', 
      'Consider enabling "Remove payment info" if applicable',
      'Save the configuration',
      'Test with a URL containing email/phone to verify redaction'
    ],
    docs: [
      {
        title: 'Data redaction settings',
        url: 'https://support.google.com/analytics/answer/13544947'
      }
    ],
    warningText: 'GDPR CRITICAL: PII in URLs can lead to compliance violations and data privacy issues.',
    successText: 'Data redaction configured - PII will be automatically removed from URL parameters.',
    detectionHint: 'We detected potential PII in your URL parameters. This setting will automatically clean it.'
  },
  {
    id: 'referral-exclusions',
    title: 'Configure Unwanted Referral Exclusions',
    description: 'Exclude payment processors and checkout services from referral traffic',
    importance: 'critical',
    category: 'data-quality',
    scoreImpact: -20,
    adminPath: 'Admin > Data Settings > Data Collection > Configure tag settings',
    steps: [
      'Go to Admin > Data Settings > Data Collection',
      'Click "Configure tag settings"',
      'Scroll to "Unwanted referrals" section',
      'Add payment processor domains:',
      '  • paypal.com',
      '  • stripe.com', 
      '  • checkout.com',
      '  • square.com',
      '  • authorize.net',
      'Add any other payment/checkout domains you use',
      'Save configuration'
    ],
    docs: [
      {
        title: 'Referral exclusions',
        url: 'https://support.google.com/analytics/answer/10327750'
      }
    ],
    warningText: 'Payment processors appearing as referrals inflate direct traffic and skew attribution.',
    successText: 'Referral exclusions configured - payment processors will not interrupt user sessions.',
    detectionHint: 'We detected payment processors in your referral traffic. Add them to exclusion list.'
  },
  {
    id: 'ip-filters',
    title: 'Create Internal Traffic Filters',
    description: 'Filter out office/employee traffic for accurate visitor data',
    importance: 'important',
    category: 'data-quality',
    scoreImpact: -15,
    adminPath: 'Admin > Data Settings > Data Filters',
    steps: [
      'Go to Admin > Data Settings > Data Filters',
      'Click "Create filter"',
      'Choose "Internal traffic" as filter type',
      'Enter your office IP addresses or IP ranges',
      'Name the filter (e.g., "Office Traffic")',
      'Set filter state to "Testing" initially',
      'Save and monitor for 24-48 hours',
      'Once confirmed working, change to "Active"',
      'Verify internal traffic is properly tagged in reports'
    ],
    docs: [
      {
        title: 'Create data filters',
        url: 'https://support.google.com/analytics/answer/13296761'
      }
    ],
    warningText: 'Internal traffic can skew conversion rates and user behavior metrics.',
    successText: 'IP filters configured - internal traffic will be properly identified and can be excluded.',
    detectionHint: 'Consider filtering internal traffic if you have office locations or remote employees.'
  },
  {
    id: 'session-timeout',
    title: 'Adjust Session Timeout Settings',
    description: 'Configure session timeout based on your typical user behavior patterns',
    importance: 'optional',
    category: 'tracking',
    scoreImpact: -5,
    adminPath: 'Admin > Data Settings > Data Collection > Configure tag settings',
    steps: [
      'Navigate to Admin > Data Settings > Data Collection',
      'Click "Configure tag settings"',
      'Find "Session timeout" section',
      'Review current setting (default: 30 minutes)',
      'Consider your site\'s user behavior:',
      '  • E-commerce/short visits: 15-30 minutes',
      '  • Content/long reads: 30-60 minutes',
      '  • SaaS/app usage: 60+ minutes',
      'Adjust timeout accordingly',
      'Note: Shorter timeouts create more sessions but may fragment user journeys'
    ],
    docs: [
      {
        title: 'Session timeout settings',
        url: 'https://support.google.com/analytics/answer/12131703'
      }
    ],
    warningText: 'Too short timeout creates fragmented sessions; too long may miss return visits.',
    successText: 'Session timeout configured appropriately for your user behavior patterns.'
  },
  {
    id: 'google-signals',
    title: 'Configure Google Signals Settings',
    description: 'Enable demographics and interests data (with privacy considerations)',
    importance: 'optional',
    category: 'attribution',
    scoreImpact: -5,
    adminPath: 'Admin > Data Settings > Data collection',
    steps: [
      'Go to Admin > Data Settings > Data collection',
      'Find "Google Signals data collection" section',
      'Review privacy implications:',
      '  • Enables demographics and interests reporting',
      '  • May cause data thresholding in some reports',
      '  • Requires disclosure in privacy policy',
      'Enable if benefits outweigh privacy concerns',
      'Update privacy policy to mention demographics collection',
      'Monitor for data thresholding issues in reports'
    ],
    docs: [
      {
        title: 'Google Signals',
        url: 'https://support.google.com/analytics/answer/9445345'
      }
    ],
    warningText: 'Google Signals enables demographics but may cause data thresholding and requires privacy policy updates.',
    successText: 'Google Signals configured - demographics and interests data will be available.'
  },
  {
    id: 'attribution-channels',
    title: 'Configure Attribution Channel Settings',
    description: 'Set which channels can receive conversion credit for Google Ads optimization',
    importance: 'important',
    category: 'attribution',
    scoreImpact: -10,
    adminPath: 'Admin > Attribution settings',
    steps: [
      'Navigate to Admin > Attribution settings',
      'Find "Channels that can receive credit" section',
      'Review current setting (recommended: "Paid and organic channels")',
      'Understand the options:',
      '  • Paid and organic channels: Full attribution (recommended)',
      '  • Paid channels only: Only paid traffic gets credit',
      '  • Last click: Simple last-touch attribution',
      'Select "Paid and organic channels" for most businesses',
      'Save configuration',
      'This affects conversion data shared with Google Ads'
    ],
    docs: [
      {
        title: 'Attribution settings',
        url: 'https://support.google.com/analytics/answer/10597962'
      }
    ],
    warningText: 'Wrong channel attribution settings can impact Google Ads bidding optimization.',
    successText: 'Attribution channels configured to optimize Google Ads performance.'
  }
];

interface ManualConfigChecklistProps {
  enhancedChecks?: any; // Results from your enhanced data quality checks
  onScoreUpdate?: (score: number) => void;
}

export const ManualConfigChecklist: React.FC<ManualConfigChecklistProps> = ({ 
  enhancedChecks, 
  onScoreUpdate 
}) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['privacy', 'data-quality']) // Auto-expand critical categories
  );

  // Auto-detect which items are likely needed based on enhanced checks
  const getDetectedIssues = () => {
    const detectedIssues = new Set<string>();
    
    if (enhancedChecks?.piiAnalysis?.hasPII) {
      detectedIssues.add('data-redaction');
    }
    
    if (enhancedChecks?.trafficAnalysis?.unwantedReferrals?.detected) {
      detectedIssues.add('referral-exclusions');
    }
    
    return detectedIssues;
  };

  const detectedIssues = getDetectedIssues();

  const toggleCompleted = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
    
    // Calculate and report score update
    const score = calculateScore(newCompleted);
    onScoreUpdate?.(score);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const calculateScore = (completed: Set<string> = completedItems) => {
    const totalPossibleDeduction = MANUAL_CHECKS.reduce((sum, item) => sum + Math.abs(item.scoreImpact), 0);
    const actualDeduction = MANUAL_CHECKS
      .filter(item => !completed.has(item.id))
      .reduce((sum, item) => sum + Math.abs(item.scoreImpact), 0);
    
    return Math.round(100 - ((actualDeduction / totalPossibleDeduction) * 100));
  };

  const getStatusIcon = (item: ManualCheckItem) => {
    const isCompleted = completedItems.has(item.id);
    const isDetected = detectedIssues.has(item.id);
    
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (isDetected && item.importance === 'critical') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    
    if (item.importance === 'critical') {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    
    if (item.importance === 'important') {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getStatusColor = (item: ManualCheckItem) => {
    const isCompleted = completedItems.has(item.id);
    const isDetected = detectedIssues.has(item.id);
    
    if (isCompleted) {
      return 'border-green-500/30 bg-green-500/10';
    }
    
    if (isDetected && item.importance === 'critical') {
      return 'border-red-500/50 bg-red-500/20 animate-pulse';
    }
    
    if (item.importance === 'critical') {
      return 'border-red-500/30 bg-red-500/10';
    }
    
    if (item.importance === 'important') {
      return 'border-yellow-500/30 bg-yellow-500/10';
    }
    
    return 'border-blue-500/30 bg-blue-500/10';
  };

  // Group items by category
  const categorizedItems = MANUAL_CHECKS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ManualCheckItem[]>);

  const categoryIcons = {
    privacy: Shield,
    'data-quality': Filter,
    attribution: Settings,
    tracking: Clock
  };

  const categoryLabels = {
    privacy: 'Privacy & Compliance',
    'data-quality': 'Data Quality',
    attribution: 'Attribution & Channels',
    tracking: 'Tracking Configuration'
  };

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Manual Configuration Checklist
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-400">Configuration Score</div>
          <div className="text-2xl font-bold text-orange-400">
            {calculateScore()}/100
          </div>
        </div>
      </div>

      <p className="text-gray-300 mb-6">
        These critical GA4 settings require manual configuration in the GA4 interface. 
        We've highlighted items where our analysis detected potential issues.
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
                <div className="p-4 pt-0 space-y-4">
                  {items.map((item) => {
                    const isCompleted = completedItems.has(item.id);
                    const isExpanded = expandedItems.has(item.id);
                    const isDetected = detectedIssues.has(item.id);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`border rounded-lg transition-all ${getStatusColor(item)}`}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(item)}
                              <div className="flex-1">
                                <h5 className="font-semibold text-white flex items-center">
                                  {item.title}
                                  {item.importance === 'critical' && (
                                    <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded">
                                      CRITICAL
                                    </span>
                                  )}
                                  {isDetected && (
                                    <span className="ml-2 px-2 py-1 text-xs bg-orange-500 text-white rounded animate-pulse">
                                      DETECTED
                                    </span>
                                  )}
                                </h5>
                                <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                                <p className="text-xs text-orange-300 mt-1">
                                  Score Impact: {item.scoreImpact} points
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleCompleted(item.id)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                  isCompleted 
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                              >
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                              </button>
                              <button
                                onClick={() => toggleExpanded(item.id)}
                                className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                              >
                                {isExpanded ? 'Hide' : 'Show'} Steps
                              </button>
                            </div>
                          </div>

                          {/* Detection hint */}
                          {isDetected && item.detectionHint && (
                            <div className="mt-3 p-3 bg-orange-900/30 border border-orange-600/50 rounded">
                              <p className="text-sm text-orange-300">
                                🔍 <strong>Detected:</strong> {item.detectionHint}
                              </p>
                            </div>
                          )}

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-gray-600">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h6 className="font-semibold text-orange-400 mb-3">Step-by-Step Instructions</h6>
                                  <ol className="space-y-2">
                                    {item.steps.map((step, index) => (
                                      <li key={index} className="flex items-start text-sm text-gray-300">
                                        <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                          {index + 1}
                                        </span>
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                  
                                  <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-600/50">
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
                          )}
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
