import React from 'react';
import { AlertTriangle, Shield, Filter, Search, ExternalLink } from 'lucide-react';

interface DataQualityAlertsProps {
  enhancedChecks: any;
  onFixIssues?: () => void;
}

export const DataQualityAlerts: React.FC<DataQualityAlertsProps> = ({ 
  enhancedChecks, 
  onFixIssues 
}) => {
  if (!enhancedChecks || enhancedChecks.criticalIssues === 0) {
    return null;
  }

  const criticalAlerts = [];

  // PII Detection Alert
  if (enhancedChecks.piiAnalysis?.hasPII && enhancedChecks.piiAnalysis.severity === 'critical') {
    criticalAlerts.push({
      id: 'pii-detected',
      icon: Shield,
      title: '🚨 Personal Information Detected in URLs',
      severity: 'critical',
      description: `Found ${enhancedChecks.piiAnalysis.details?.totalAffectedUrls || 0} URLs containing personal information including emails, phone numbers, or other sensitive data.`,
      impact: 'GDPR compliance risk - potential privacy violations and legal liability',
      action: 'Configure data redaction immediately',
      adminPath: 'Admin > Data Settings > Data Collection > Data redaction',
      details: enhancedChecks.piiAnalysis.details
    });
  }

  // Payment Processor Referrals Alert
  if (enhancedChecks.trafficAnalysis?.unwantedReferrals?.detected) {
    criticalAlerts.push({
      id: 'payment-referrals',
      icon: Filter,
      title: '💳 Payment Processors Appearing as Referrals',
      severity: 'critical',
      description: `Found ${enhancedChecks.trafficAnalysis.unwantedReferrals.count} payment processors (PayPal, Stripe, etc.) showing as referral traffic.`,
      impact: 'Attribution accuracy compromised - inflates direct traffic and skews conversion paths',
      action: 'Add payment processors to referral exclusion list',
      adminPath: 'Admin > Data Settings > Data Collection > Unwanted referrals',
      details: {
        sources: enhancedChecks.trafficAnalysis.unwantedReferrals.sources,
        totalSessions: enhancedChecks.trafficAnalysis.unwantedReferrals.totalSessions
      }
    });
  }

  // Search Tracking Issues Alert
  if (enhancedChecks.searchAnalysis?.status === 'missed_opportunity') {
    criticalAlerts.push({
      id: 'missed-search',
      icon: Search,
      title: '🔍 Search Activity Not Being Tracked',
      severity: 'warning',
      description: `Found ${enhancedChecks.searchAnalysis.customSearchParams?.length || 0} custom search parameters that aren't being tracked by GA4.`,
      impact: 'Missing valuable search behavior data and user intent insights',
      action: 'Configure Enhanced Measurement or custom event tracking',
      adminPath: 'Admin > Data Streams > Enhanced measurement > Site search',
      details: {
        customParams: enhancedChecks.searchAnalysis.customSearchParams,
        totalActivity: enhancedChecks.searchAnalysis.totalCustomSearchActivity
      }
    });
  }

  if (criticalAlerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-red-300 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Critical Data Quality Issues Detected
        </h3>
        <div className="text-sm text-red-400 font-medium">
          {enhancedChecks.criticalIssues} Critical • {enhancedChecks.warnings} Warnings
        </div>
      </div>
      
      <div className="space-y-4">
        {criticalAlerts.map((alert) => {
          const IconComponent = alert.icon;
          
          return (
            <div key={alert.id} className="bg-red-800/30 rounded-lg p-4 border border-red-600/50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-red-300" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-200 mb-2 flex items-center">
                    {alert.title}
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      alert.severity === 'critical' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    {alert.description}
                  </p>
                  <div className="bg-red-900/50 rounded p-3 mb-3">
                    <h5 className="text-xs font-medium text-red-400 mb-1">Business Impact:</h5>
                    <p className="text-xs text-gray-300">{alert.impact}</p>
                  </div>
                  
                  {/* Action items */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">Action Required:</span>
                      <span className="text-sm font-medium text-red-300">{alert.action}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      📍 {alert.adminPath}
                    </div>
                  </div>

                  {/* Details for PII */}
                  {alert.id === 'pii-detected' && alert.details && (
                    <div className="mt-3 p-3 bg-black/30 rounded border border-gray-600">
                      <h6 className="text-xs font-medium text-gray-400 mb-2">Sample Issues Found:</h6>
                      <div className="space-y-1">
                        {Object.entries(alert.details.sampleUrls).slice(0, 3).map(([piiType, urls]: [string, any]) => (
                          <div key={piiType} className="text-xs text-gray-300">
                            <span className="font-medium text-orange-400">{piiType}:</span> {urls.length} instance(s)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details for payment referrals */}
                  {alert.id === 'payment-referrals' && alert.details && (
                    <div className="mt-3 p-3 bg-black/30 rounded border border-gray-600">
                      <h6 className="text-xs font-medium text-gray-400 mb-2">Payment Processors Found:</h6>
                      <div className="flex flex-wrap gap-2">
                        {alert.details.sources.slice(0, 5).map((source: any, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                            {source.source} ({source.sessions} sessions)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details for search tracking */}
                  {alert.id === 'missed-search' && alert.details && (
                    <div className="mt-3 p-3 bg-black/30 rounded border border-gray-600">
                      <h6 className="text-xs font-medium text-gray-400 mb-2">Custom Search Parameters Found:</h6>
                      <div className="flex flex-wrap gap-2">
                        {alert.details.customParams?.slice(0, 5).map((param: any, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                            {param.parameter} ({param.totalViews} views)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-red-600/30">
        <div className="text-sm text-gray-400">
          These issues require immediate attention to ensure data quality and compliance.
        </div>
        <div className="flex space-x-3">
          <a
            href="https://support.google.com/analytics/answer/13544947"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            Documentation
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          {onFixIssues && (
            <button
              onClick={onFixIssues}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Fix These Issues →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
