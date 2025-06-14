import React from 'react';
import { Clock, Calendar, TrendingUp, Link, Database, Search } from 'lucide-react';
import { GA4Audit, PriorityRecommendation } from '@/types/ga4';

interface ComplianceProgressProps {
  score: number;
  audit: GA4Audit;
}

export const ComplianceProgress: React.FC<ComplianceProgressProps> = ({ score, audit }) => {
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

  const getPriorityRecommendations = (): PriorityRecommendation[] => {
    const recommendations: PriorityRecommendation[] = [];
    
    // Critical issues first
    if (audit.dataRetention.eventDataRetention !== 'FOURTEEN_MONTHS') {
      recommendations.push({
        priority: 'critical',
        text: 'Change data retention from 2 months to 14 months immediately',
        icon: Clock
      });
    }
    
    if (!audit.property.timeZone) {
      recommendations.push({
        priority: 'critical', 
        text: 'Set property timezone for accurate daily reporting',
        icon: Calendar
      });
    }
    
    if (audit.keyEvents.length === 0) {
      recommendations.push({
        priority: 'critical',
        text: 'Configure key events for conversion tracking',
        icon: TrendingUp
      });
    }
    
    // Important improvements
    if (audit.googleAdsLinks.length === 0) {
      recommendations.push({
        priority: 'important',
        text: 'Link Google Ads for conversion import and Smart Bidding',
        icon: Link
      });
    }
    
    if (audit.customDimensions.length < 3) {
      recommendations.push({
        priority: 'important',
        text: 'Add custom dimensions for business-specific tracking',
        icon: Database
      });
    }
    
    if (!audit.searchConsoleDataStatus.isLinked) {
      recommendations.push({
        priority: 'important',
        text: 'Connect Search Console for organic search insights',
        icon: Search
      });
    }

    return recommendations.slice(0, 4);
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
