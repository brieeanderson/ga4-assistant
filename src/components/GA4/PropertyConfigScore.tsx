import React from 'react';
import { GA4Audit } from '@/types/ga4';

interface Suggestion {
  label: string;
  suggestion: string;
  importance: 'critical' | 'very-important' | 'important' | 'info';
  points: number;
}

const GA4_SCORING_CONFIG = [
  {
    id: 'industryCategory',
    label: 'Set industry category',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => !audit.property.industryCategory ? -5 : 0,
    suggestion: 'Set your industry category for better ML predictions and benchmarking.',
    importance: 'info' as const,
  },
  {
    id: 'dataRetention',
    label: 'Set data retention period',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.dataRetention.eventDataRetention === 'TWO_MONTHS' ? -20 : 0,
    suggestion: 'Set data retention to 14 months (max) to avoid losing historical data.',
    importance: 'very-important' as const,
  },
  {
    id: 'keyEvents',
    label: 'Set key events',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => {
      if (!audit.keyEvents.length) return -20;
      if (audit.keyEvents.length > 2) return -10;
      return 0;
    },
    suggestion: 'Set 1-2 key events for clear conversion tracking. Too many can dilute your data.',
    importance: 'very-important' as const,
  },
  {
    id: 'connectGoogleAds',
    label: 'Connect Google Ads',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.googleAdsLinks.length === 0 ? -20 : 0,
    suggestion: 'Connect Google Ads to import conversions and optimize bidding.',
    importance: 'very-important' as const,
  },
  {
    id: 'connectSearchConsole',
    label: 'Connect Search Console',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => !audit.searchConsoleDataStatus?.hasData ? -5 : 0,
    suggestion: 'Connect Search Console for organic search insights.',
    importance: 'important' as const,
  },
  {
    id: 'connectBigQuery',
    label: 'Connect BigQuery',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.bigQueryLinks.length === 0 ? -5 : 0,
    suggestion: 'Connect BigQuery for advanced, unsampled analysis (free tier available).',
    importance: 'info' as const,
  },
  {
    id: 'enhancedMeasurement',
    label: 'Enable enhanced measurement',
    type: 'user-collected',
    deduction: (audit: GA4Audit) => audit.enhancedMeasurement.length === 0 ? -10 : 0,
    suggestion: 'Enable Enhanced Measurement for automatic event tracking.',
    importance: 'important' as const,
  },
  // Add more config items as needed...
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

  // Score color logic
  let scoreColor = 'text-green-400';
  if (score < 90) scoreColor = 'text-yellow-400';
  if (score < 70) scoreColor = 'text-orange-400';
  if (score < 50) scoreColor = 'text-red-400';

  return (
    <div className="bg-black/80 rounded-2xl p-6 border border-orange-500/30 shadow-xl mt-8">
      <div className="flex items-center mb-4">
        <span className={`text-3xl font-bold mr-4 ${scoreColor}`}>{score}/100</span>
        <span className="text-lg font-semibold text-white">Property Configuration Score</span>
      </div>
      <div className="mb-2 text-sm text-gray-400">
        This score reflects the most important GA4 property settings for data quality and business insights.
      </div>
      {suggestions.length > 0 ? (
        <div className="mt-4">
          <h4 className="text-md font-bold text-orange-400 mb-2">Suggestions to Improve Your Score:</h4>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="bg-black/60 border-l-4 pl-3 py-2 rounded border-orange-400 text-white">
                <span className="font-semibold">{s.label}:</span> {s.suggestion}
                <span className="ml-2 text-xs text-orange-300">({s.points})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 text-green-400 font-semibold">No major issues detected. Great job!</div>
      )}
    </div>
  );
}; 