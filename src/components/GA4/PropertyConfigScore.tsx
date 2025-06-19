import React from 'react';
import { TrendingUp, Zap, Target, AlertTriangle, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface Suggestion {
  label: string;
  suggestion: string;
  importance: 'critical' | 'very-important' | 'important' | 'moderate' | 'optional' | 'info';
  points: number;
}

interface ScoringConfig {
  id: string;
  label: string;
  type: 'system' | 'user-collected';
  deduction: (audit: GA4Audit) => number;
  suggestion: string;
  importance: 'critical' | 'very-important' | 'important' | 'moderate' | 'optional' | 'info';
}

const GA4_SCORING_CONFIG: ScoringConfig[] = [
  {
    id: 'keyEvents',
    label: 'Key events configuration',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => {
      if (audit.keyEvents.length === 0) return -20;
      if (audit.keyEvents.length > 2) return -10;
      return 0;
    },
    suggestion: 'Configure 1-2 key events that represent your most important business outcomes.',
    importance: 'critical' as const,
  },
  {
    id: 'dataRetention',
    label: 'Data retention period',
    type: 'system',
    deduction: (audit: GA4Audit) => audit.dataRetention.eventDataRetention === 'TWO_MONTHS' ? -15 : 0,
    suggestion: 'Extend data retention to 14 months to maintain year-over-year reporting capabilities.',
    importance: 'very-important' as const,
  },
  {
    id: 'googleAds',
    label: 'Google Ads integration',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.googleAdsLinks.length === 0 ? -20 : 0,
    suggestion: 'Connect Google Ads to enable advanced attribution and conversion optimization.',
    importance: 'very-important' as const,
  },
  {
    id: 'enhancedMeasurement',
    label: 'Enhanced measurement',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.enhancedMeasurement.length === 0 ? -10 : 0,
    suggestion: 'Enable Enhanced Measurement for automatic event tracking.',
    importance: 'important' as const,
  },
  {
    id: 'attribution',
    label: 'Attribution model',
    type: 'system',
    deduction: (audit: GA4Audit) => 
      audit.attribution.reportingAttributionModel !== 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN' ? -10 : 0,
    suggestion: 'Upgrade to data-driven attribution for the most accurate conversion credit.',
    importance: 'important' as const,
  },
  {
    id: 'searchConsole',
    label: 'Search Console integration',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => !audit.searchConsoleDataStatus?.hasData ? -5 : 0,
    suggestion: 'Connect Search Console for organic search performance insights.',
    importance: 'moderate' as const,
  },
  {
    id: 'bigQuery',
    label: 'BigQuery integration',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.bigQueryLinks.length === 0 ? -5 : 0,
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
        suggestion: item.suggestion,
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
          <h2 className="text-3xl font-bold text-white">GA4 CONFIGURATION AUDIT</h2>
        </div>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
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
              <h3 className="text-2xl font-bold text-white mb-2">{scoreStatus.title}</h3>
              <p className="text-gray-300 text-lg max-w-2xl">{scoreStatus.description}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border text-sm font-semibold ${scoreStatus.badge}`}>
            {scoreStatus.status}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${scoreStatus.color} mb-2`}>{score}</div>
            <div className="text-2xl text-gray-400">/100</div>
            <div className="text-sm text-gray-500 mt-2">Configuration Score</div>
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
              <p className="text-sm text-gray-400 mb-4">These issues significantly impact data quality and must be addressed immediately</p>
              <div className="space-y-3">
                {criticalSuggestions.map((s, i) => (
                  <div key={i} className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-red-300">{s.label}</span>
                      <span className="text-xs text-red-400 font-bold">{s.points} pts</span>
                    </div>
                    <p className="text-sm text-gray-300">{s.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Improvements */}
          {importantSuggestions.length > 0 && (
            <div className="bg-yellow-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                <h4 className="text-xl font-bold text-yellow-400">High Impact Improvements</h4>
                <div className="ml-auto text-sm text-yellow-300">{importantSuggestions.length} items</div>
              </div>
              <p className="text-sm text-gray-400 mb-4">Implementing these will significantly improve your data quality and insights</p>
              <div className="space-y-3">
                {importantSuggestions.map((s, i) => (
                  <div key={i} className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-yellow-300">{s.label}</span>
                      <span className="text-xs text-yellow-400 font-bold">{s.points} pts</span>
                    </div>
                    <p className="text-sm text-gray-300">{s.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Suggestions */}
          {otherSuggestions.length > 0 && (
            <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 lg:col-span-2">
              <div className="flex items-center mb-4">
                <Lightbulb className="w-6 h-6 mr-3 text-blue-400" />
                <h4 className="text-xl font-bold text-blue-400">Additional Optimizations</h4>
                <div className="ml-auto text-sm text-blue-300">{otherSuggestions.length} suggestions</div>
              </div>
              <p className="text-sm text-gray-400 mb-4">Nice-to-have improvements for advanced reporting and analysis</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {otherSuggestions.map((s, i) => (
                  <div key={i} className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-blue-300">{s.label}</span>
                      <span className="text-xs text-blue-400 font-bold">{s.points} pts</span>
                    </div>
                    <p className="text-sm text-gray-300">{s.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* What This Means for Your Business */}
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30">
        <div className="flex items-center mb-6">
          <Target className="w-7 h-7 mr-3 text-orange-400" />
          <h3 className="text-2xl font-bold text-white">What This Means for Your Business</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-3">Data Quality & Insights</h4>
            <p className="text-gray-300 mb-4">
              {score >= 90 
                ? "Excellent setup ensures accurate tracking and reliable reporting for confident decision-making."
                : score >= 75
                ? "Good foundation with opportunities to enhance data accuracy and reporting capabilities."
                : score >= 60
                ? "Current issues may lead to incomplete data and unreliable insights affecting business decisions."
                : "Critical problems are significantly impacting data quality and limiting your analytical capabilities."}
            </p>
            {score < 90 && (
              <div className="flex items-center text-sm text-orange-300">
                <ArrowRight className="w-4 h-4 mr-2" />
                <span>Address top issues to improve data reliability</span>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-3">Marketing Performance</h4>
            <p className="text-gray-300 mb-4">
              {score >= 90 
                ? "Optimal attribution and tracking enable precise marketing ROI measurement and campaign optimization."
                : score >= 75
                ? "Strong setup supports good marketing measurement with room for attribution improvements."
                : score >= 60
                ? "Attribution gaps may lead to suboptimal budget allocation and campaign performance."
                : "Poor tracking setup is likely causing significant marketing budget waste and missed opportunities."}
            </p>
            {audit.googleAdsLinks.length === 0 && (
              <div className="flex items-center text-sm text-orange-300">
                <ArrowRight className="w-4 h-4 mr-2" />
                <span>Connect Google Ads for better conversion tracking</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Perfect Score Message */}
      {suggestions.length === 0 && (
        <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-400 mb-2">Perfect Configuration!</h3>
          <p className="text-gray-300 text-lg">
            Your GA4 setup follows all best practices. Your data quality is excellent and you're getting 
            accurate insights to drive business growth.
          </p>
        </div>
      )}
    </div>
  );
};
