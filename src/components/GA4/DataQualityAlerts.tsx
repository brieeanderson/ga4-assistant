import React from 'react';
import { AlertTriangle, Shield, Filter, Search, ExternalLink } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface DataQualityAlertsProps {
  audit: GA4Audit;
  onFixIssues?: () => void;
}

export const DataQualityAlerts: React.FC<DataQualityAlertsProps> = ({ 
  audit, 
  onFixIssues 
}) => {
  // For now, since enhancedChecks might not be available, let's create alerts based on the basic audit data
  const criticalAlerts = [];

  // Check for critical configuration issues from basic audit data
  if (!audit.property?.timeZone) {
    criticalAlerts.push({
      id: 'missing-timezone',
      icon: AlertTriangle,
      title: '🚨 Missing Timezone Configuration',
      severity: 'critical',
      description: 'Your GA4 property does not have a timezone set, which affects all time-based reporting.',
      impact: 'All reports will show incorrect times and date ranges may be misaligned',
      action: 'Set timezone in Property Settings immediately',
      adminPath: 'Admin > Property Settings > Property details'
    });
  }

  if (!audit.keyEvents || audit.keyEvents.length === 0) {
    criticalAlerts.push({
      id: 'no-key-events',
      icon: AlertTriangle,
      title: '🎯 No Key Events Configured',
      severity: 'critical',
      description: 'No key events (conversions) are configured for your property.',
      impact: 'Cannot measure business goals or optimize for conversions',
      action: 'Configure at least one key event for your primary business goal',
      adminPath: 'Admin > Events > Key Events'
    });
  }

  if (!audit.dataStreams || audit.dataStreams.length === 0) {
    criticalAlerts.push({
      id: 'no-data-streams',
      icon: AlertTriangle,
      title: '📊 No Data Streams Active',
      severity: 'critical',
      description: 'No data streams are configured to collect data.',
      impact: 'No data collection - your GA4 property is not receiving any data',
      action: 'Configure at least one data stream',
      adminPath: 'Admin > Data Streams'
    });
  }

  if (audit.dataRetention?.eventDataRetention === 'TWO_MONTHS') {
    criticalAlerts.push({
      id: 'short-retention',
      icon: Shield,
      title: '📅 Short Data Retention Period',
      severity: 'warning',
      description: 'Event data retention is set to only 2 months instead of the maximum 14 months.',
      impact: 'Limited historical data available for analysis and year-over-year comparisons',
      action: 'Increase retention to 14 months for maximum data availability',
      adminPath: 'Admin > Data Settings > Data Retention'
    });
  }

  // Enhanced measurement issues
  const enhancedMeasurementEnabled = audit.enhancedMeasurement?.some(stream => 
    stream.settings?.streamEnabled
  );
  
  if (!enhancedMeasurementEnabled) {
    criticalAlerts.push({
      id: 'no-enhanced-measurement',
      icon: AlertTriangle,
      title: '⚡ Enhanced Measurement Disabled',
      severity: 'warning',
      description: 'Enhanced Measurement is disabled, missing automatic tracking of common website interactions.',
      impact: 'Missing data on scrolls, outbound clicks, site search, video engagement, and file downloads',
      action: 'Enable Enhanced Measurement for automatic event tracking',
      adminPath: 'Admin > Data Streams > [Stream] > Enhanced Measurement'
    });
  }

  // Event create rules complexity warning
  const totalEventCreateRules = audit.eventCreateRules?.reduce((total, stream) => total + stream.rules.length, 0) || 0;
  
  if (totalEventCreateRules > 5) {
    criticalAlerts.push({
      id: 'complex-event-rules',
      icon: Filter,
      title: '⚙️ Complex Event Create Rules Setup',
      severity: 'warning',
      description: `${totalEventCreateRules} event create rules detected - complex rule sets often contain configuration errors.`,
      impact: 'High risk of data quality issues, event conflicts, and processing delays',
      action: 'Have an expert review rule configuration for errors',
      adminPath: 'Admin > Events > Create events'
    });
  }

  // No custom definitions warning
  if ((!audit.customDimensions || audit.customDimensions.length === 0) && 
      (!audit.customMetrics || audit.customMetrics.length === 0)) {
    criticalAlerts.push({
      id: 'no-custom-definitions',
      icon: Search,
      title: '📐 No Custom Definitions',
      severity: 'info',
      description: 'No custom dimensions or metrics are configured to capture business-specific data.',
      impact: 'Missing opportunities to track business-specific metrics and user attributes',
      action: 'Consider adding custom dimensions/metrics for business-specific tracking',
      adminPath: 'Admin > Custom Definitions'
    });
  }

  // If no critical alerts, don't render the component
  if (criticalAlerts.length === 0) {
    return null;
  }

  // Count severity levels
  const criticalCount = criticalAlerts.filter(alert => alert.severity === 'critical').length;
  const warningCount = criticalAlerts.filter(alert => alert.severity === 'warning').length;
  const infoCount = criticalAlerts.filter(alert => alert.severity === 'info').length;

  return (
    <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-red-300 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Configuration Issues Detected
        </h3>
        <div className="text-sm text-red-400 font-medium">
          {criticalCount > 0 && `${criticalCount} Critical`}
          {criticalCount > 0 && warningCount > 0 && ' • '}
          {warningCount > 0 && `${warningCount} Warnings`}
          {(criticalCount > 0 || warningCount > 0) && infoCount > 0 && ' • '}
          {infoCount > 0 && `${infoCount} Info`}
        </div>
      </div>
      
      <div className="space-y-4">
        {criticalAlerts.map((alert) => {
          const IconComponent = alert.icon;
          
          return (
            <div key={alert.id} className={`rounded-lg p-4 border ${
              alert.severity === 'critical' ? 'bg-red-800/30 border-red-600/50' :
              alert.severity === 'warning' ? 'bg-yellow-800/30 border-yellow-600/50' :
              'bg-blue-800/30 border-blue-600/50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <IconComponent className={`w-6 h-6 ${
                    alert.severity === 'critical' ? 'text-red-300' :
                    alert.severity === 'warning' ? 'text-yellow-300' :
                    'text-blue-300'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 flex items-center ${
                    alert.severity === 'critical' ? 'text-red-200' :
                    alert.severity === 'warning' ? 'text-yellow-200' :
                    'text-blue-200'
                  }`}>
                    {alert.title}
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      alert.severity === 'critical' 
                        ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                        : 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    }`}>
                      {alert.severity}
                    </span>
                  </h4>
                  
                  <p className="text-sm text-gray-300 mb-3">{alert.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-xs font-semibold text-gray-400 mb-1">IMPACT:</h5>
                      <p className="text-xs text-gray-300">{alert.impact}</p>
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-gray-400 mb-1">ACTION NEEDED:</h5>
                      <p className="text-xs text-gray-300">{alert.action}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <strong>Location:</strong> {alert.adminPath}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {onFixIssues && (criticalCount > 0 || warningCount > 0) && (
        <div className="mt-6 pt-4 border-t border-gray-600/30">
          <button
            onClick={onFixIssues}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold text-sm shadow-lg"
          >
            View Manual Configuration Checklist →
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            <div className="text-xs text-gray-400">Critical Issues</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
            <div className="text-xs text-gray-400">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{infoCount}</div>
            <div className="text-xs text-gray-400">Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
};
