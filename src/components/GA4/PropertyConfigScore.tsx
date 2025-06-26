import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface Suggestion {
  label: string;
  suggestion: string;
  importance: 'critical' | 'very-important' | 'important' | 'moderate' | 'optional';
  points: number;
}

// Configuration scoring logic
const GA4_SCORING_CONFIG = [
  {
    id: 'timezone',
    label: 'Timezone configuration',
    type: 'property-required',
    deduction: (audit: GA4Audit) => !audit.property.timeZone ? -15 : 0,
    suggestion: 'Set the correct timezone in Admin > Property Settings for accurate timing.',
    importance: 'critical' as const,
  },
  {
    id: 'currency',
    label: 'Currency configuration',
    type: 'property-required',
    deduction: (audit: GA4Audit) => !audit.property.currencyCode ? -10 : 0,
    suggestion: 'Set the correct currency in Admin > Property Settings for accurate revenue tracking.',
    importance: 'very-important' as const,
  },
  {
    id: 'dataRetention',
    label: 'Data retention settings',
    type: 'data-management',
    deduction: (audit: GA4Audit) => audit.dataRetention.eventDataRetention !== 'FOURTEEN_MONTHS' ? -8 : 0,
    suggestion: 'Set data retention to 14 months for maximum data availability.',
    importance: 'important' as const,
  },
  {
    id: 'keyEvents',
    label: 'Key events configuration',
    type: 'conversion-tracking',
    deduction: (audit: GA4Audit) => audit.keyEvents.length === 0 ? -20 : audit.keyEvents.length > 2 ? -5 : 0,
    suggestion: (audit: GA4Audit) => audit.keyEvents.length === 0 ? 'Configure 1-2 key events for conversion tracking.' : 'Consider optimizing to 1-2 primary key events.',
    importance: 'critical' as const,
  },
  {
    id: 'dataStreams',
    label: 'Data streams setup',
    type: 'data-collection',
    deduction: (audit: GA4Audit) => audit.dataStreams.length === 0 ? -25 : 0,
    suggestion: 'Configure at least one data stream to collect data.',
    importance: 'critical' as const,
  },
  {
    id: 'enhancedMeasurement',
    label: 'Enhanced measurement',
    type: 'data-collection',
    deduction: (audit: GA4Audit) => audit.enhancedMeasurement.length === 0 ? -10 : 0,
    suggestion: 'Enable enhanced measurement for automatic event tracking.',
    importance: 'important' as const,
  },
  {
    id: 'customDimensions',
    label: 'Custom dimensions',
    type: 'advanced-tracking',
    deduction: (audit: GA4Audit) => audit.customDimensions.length === 0 ? -5 : 0,
    suggestion: 'Add custom dimensions to track business-specific data.',
    importance: 'moderate' as const,
  },
  {
    id: 'customMetrics',
    label: 'Custom metrics',
    type: 'advanced-tracking',
    deduction: (audit: GA4Audit) => audit.customMetrics.length === 0 ? -5 : 0,
    suggestion: 'Add custom metrics to measure business-specific values.',
    importance: 'moderate' as const,
  },
  {
    id: 'googleAds',
    label: 'Google Ads integration',
    type: 'platform-integration',
    deduction: (audit: GA4Audit) => audit.googleAdsLinks.length === 0 ? -8 : 0,
    suggestion: 'Link Google Ads for conversion tracking and audience insights.',
    importance: 'important' as const,
  },
  {
    id: 'searchConsole',
    label: 'Search Console integration',
    type: 'platform-integration',
    deduction: (audit: GA4Audit) => !audit.searchConsoleDataStatus.isLinked ? -5 : 0,
    suggestion: 'Connect Search Console for organic search performance insights.',
    importance: 'moderate' as const,
  },
  {
    id: 'bigQuery',
    label: 'BigQuery integration',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.bigQueryLinks?.length === 0 ? -5 : 0,
    suggestion: 'Connect BigQuery for advanced analysis and data exports (free tier available).',
    importance: 'optional' as const,
  },
];

function calculateScoreAndSuggestions(audit: GA4Audit) {
  let score = 100;
  const suggestions: Suggestion[] = [];

  for (const item of GA4_SCORING_CONFIG) {
    const deduction = item.deduction(audit);
    if (deduction < 0) {
      score += deduction;
      suggestions.push({
        label: item.label,
        suggestion: typeof item.suggestion === 'function' ? item.suggestion(audit) : item.suggestion,
        importance: item.importance,
        points: deduction,
      });
    }
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Sort suggestions by points (most negative first)
  suggestions.sort((a, b) => a.points - b.points);

  return { score, suggestions };
}

export const PropertyConfigScore: React.FC<{ audit: GA4Audit }> = ({ audit }) => {
  const { score, suggestions } = calculateScoreAndSuggestions(audit);

  // Score status logic
  const getScoreStatus = () => {
    if (score >= 90) return {
      status: 'OPTIMAL',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      icon: CheckCircle,
      badge: 'bg-green-500/30 text-green-300 border-green-500/50',
      title: 'Excellent Configuration',
      description: 'Your GA4 setup follows best practices for accurate data collection and business insights'
    };
    if (score >= 75) return {
      status: 'GOOD',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      icon: TrendingUp,
      badge: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
      title: 'Good Configuration',
      description: 'Strong setup with room for optimization to maximize data quality and attribution accuracy'
    };
    if (score >= 60) return {
      status: 'NEEDS ATTENTION',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      icon: Target,
      badge: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50',
      title: 'Configuration Needs Attention',
      description: 'Several important settings need adjustment to improve data quality and reporting accuracy'
    };
    return {
      status: 'CRITICAL ISSUES',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      icon: AlertTriangle,
      badge: 'bg-red-500/30 text-red-300 border-red-500/50',
      title: 'Critical Configuration Issues',
      description: 'Major setup problems are affecting data quality and limiting your ability to make data-driven decisions'
    };
  };

  const scoreStatus = getScoreStatus();
  const IconComponent = scoreStatus.icon;

  // Group suggestions by importance
  const criticalSuggestions = suggestions.filter(s => s.importance === 'critical');
  const importantSuggestions = suggestions.filter(s => s.importance === 'very-important' || s.importance === 'important' || s.importance === 'moderate');
  const otherSuggestions = suggestions.filter(s => !['critical', 'very-important', 'important', 'moderate'].includes(s.importance));

  return (
    <div className="space-y-8">
      {/* Main Title Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 mr-3 text-orange-400" />
          <h2 className="text-3xl font-bold text-black">GA4 CONFIGURATION AUDIT</h2>
        </div>
        <p className="text-lg text-gray-900 max-w-3xl mx-auto">
          Comprehensive analysis of your Google Analytics 4 setup for optimal data collection and business insights
        </p>
      </div>

      {/* Main Score Card */}
      <div className={`${scoreStatus.bgColor} backdrop-blur-xl rounded-2xl p-8 border ${scoreStatus.borderColor} shadow-2xl`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${scoreStatus.bgColor} border ${scoreStatus.borderColor}`}>
              <IconComponent className={`w-8 h-8 ${scoreStatus.color}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-2">{scoreStatus.title}</h3>
              <p className="text-gray-900 text-lg max-w-2xl">{scoreStatus.description}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border text-sm font-semibold ${scoreStatus.badge}`}>
            {scoreStatus.status}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <div className={`text-6xl font-bold text-black mb-2`}>{score}</div>
            <div className="text-2xl text-gray-700">/100</div>
            <div className="text-sm text-gray-700 mt-2">Configuration Score</div>
          </div>
        </div>
      </div>

      {/* Improvement Recommendations */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Issues */}
          {criticalSuggestions.length > 0 && (
            <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
                <h4 className="text-xl font-bold text-red-400">Critical Issues</h4>
                <div className="ml-auto text-sm text-red-300">{criticalSuggestions.length} issues</div>
              </div>
              <p className="text-sm text-gray-900 mb-4">These issues significantly impact data quality and must be addressed immediately</p>
              <div className="space-y-3">
                {criticalSuggestions.map((s, i) => (
                  <div key={i} className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-black">{s.label}</span>
                      <span className="text-xs text-black font-bold">{s.points} pts</span>
                    </div>
                    <p className="text-sm text-gray-900">{s.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Improvements */}
          {importantSuggestions.length > 0 && (
            <div className="bg-yellow-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 mr-3 text-yellow-400" />
                <h4 className="text-xl font-bold text-yellow-400">Important Improvements</h4>
                <div className="ml-auto text-sm text-yellow-300">{importantSuggestions.length} items</div>
              </div>
              <p className="text-sm text-gray-900 mb-4">These improvements will enhance your data quality and reporting capabilities</p>
              <div className="space-y-3">
                {importantSuggestions.map((s, i) => (
                  <div key={i} className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-black">{s.label}</span>
                      <span className="text-xs text-black font-bold">{s.points} pts</span>
                    </div>
                    <p className="text-sm text-gray-900">{s.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Enhancements */}
          {otherSuggestions.length > 0 && (
            <div className="lg:col-span-2">
              <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 mr-3 text-blue-400" />
                  <h4 className="text-xl font-bold text-blue-400">Optional Enhancements</h4>
                  <div className="ml-auto text-sm text-blue-300">{otherSuggestions.length} items</div>
                </div>
                <p className="text-sm text-gray-900 mb-4">These optional features can provide additional insights and capabilities</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {otherSuggestions.map((s, i) => (
                    <div key={i} className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-black">{s.label}</span>
                        <span className="text-xs text-black font-bold">{s.points} pts</span>
                      </div>
                      <p className="text-sm text-gray-900">{s.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Perfect Score Message */}
      {suggestions.length === 0 && (
        <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-green-400 mb-2">Perfect Configuration!</h4>
          <p className="text-gray-900">
            Your GA4 setup follows all best practices. Your data collection is optimized for accurate reporting and business insights.
          </p>
        </div>
      )}

      {/* Implementation Priority */}
      {suggestions.length > 0 && (
        <div className="bg-orange-900/20 border border-orange-600/30 rounded-2xl p-6">
          <h4 className="font-semibold text-orange-300 mb-3 text-lg">🎯 Implementation Priority</h4>
          <p className="text-sm text-gray-900 mb-4">
            Focus on implementing improvements in this order for maximum impact:
          </p>
          <ol className="text-sm text-gray-900 list-decimal list-inside space-y-2">
            <li><strong className="text-red-300">Critical Issues</strong> - Fix immediately to prevent data loss</li>
            <li><strong className="text-yellow-300">Important Improvements</strong> - Enhance data quality and accuracy</li>
            <li><strong className="text-blue-300">Optional Enhancements</strong> - Add advanced features as needed</li>
          </ol>
        </div>
      )}
    </div>
  );
};
