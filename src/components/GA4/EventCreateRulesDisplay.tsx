import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Settings, AlertTriangle, Zap, Eye, EyeOff, HelpCircle, ExternalLink } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface EventCreateRulesDisplayProps {
  audit: GA4Audit;
}

export const EventCreateRulesDisplay: React.FC<EventCreateRulesDisplayProps> = ({ audit }) => {
  const [expandedStreams, setExpandedStreams] = useState<Set<string>>(new Set());
  const [showAllRules, setShowAllRules] = useState(false);

  const toggleStream = (streamName: string) => {
    const newExpanded = new Set(expandedStreams);
    if (newExpanded.has(streamName)) {
      newExpanded.delete(streamName);
    } else {
      newExpanded.add(streamName);
    }
    setExpandedStreams(newExpanded);
  };

  // Get total count of rules across all streams
  const totalRules = audit.eventCreateRules.reduce((total, stream) => total + stream.rules.length, 0);

  // Get common rule patterns and warnings
  const getRuleAuditStatus = () => {
    if (totalRules === 0) {
      return {
        status: 'clean',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        badge: 'bg-green-500/30 text-green-300 border-green-500/50',
        title: 'No Event Create Rules',
        description: 'Clean setup with no event modification rules'
      };
    } else if (totalRules <= 5) {
      return {
        status: 'caution',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        badge: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50',
        title: 'Event Create Rules Detected',
        description: 'Few rules found - requires expert review for proper configuration'
      };
    } else {
      return {
        status: 'critical',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
        badge: 'bg-red-500/30 text-red-300 border-red-500/50',
        title: 'Complex Rule Configuration',
        description: 'Multiple rules detected - high risk of data quality issues'
      };
    }
  };

  const auditStatus = getRuleAuditStatus();

  // Get warnings and recommendations
  const getEventCreateRulesWarnings = () => {
    const warnings = [];
    
    if (totalRules > 0) {
      warnings.push({
        type: 'critical',
        title: 'Expert Review Required',
        message: 'Event create rules require deep understanding of GA4 data structure. Most implementations have configuration errors.'
      });

      warnings.push({
        type: 'info',
        title: 'Universal Analytics Migration',
        message: 'These rules often contain auto-migrated events from Universal Analytics. Verify they still serve a business purpose.'
      });

      if (totalRules > 5) {
        warnings.push({
          type: 'warning',
          title: 'Too Many Rules',
          message: 'Complex rule sets increase the risk of event conflicts, data duplication, and processing delays.'
        });
      }

      warnings.push({
        type: 'info',
        title: 'Data Quality Impact',
        message: 'Incorrectly configured rules can cause duplicate events, missing parameters, or corrupted attribution data.'
      });
    }

    return warnings;
  };

  const warnings = getEventCreateRulesWarnings();

  return (
    <div className="space-y-6">
      {/* Main Title Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Settings className="w-8 h-8 mr-3 text-orange-400" />
          <h2 className="text-3xl font-bold text-white">EVENT CREATE RULES AUDIT</h2>
        </div>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Advanced event modification rules that are often misconfigured and cause data quality issues
        </p>
      </div>

      {/* Status Overview Card */}
      <div className={`${auditStatus.bgColor} backdrop-blur-xl rounded-2xl p-8 border ${auditStatus.borderColor} shadow-2xl`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${auditStatus.bgColor} border ${auditStatus.borderColor}`}>
              {auditStatus.status === 'clean' ? 
                <Zap className={`w-8 h-8 ${auditStatus.color}`} /> :
                <AlertTriangle className={`w-8 h-8 ${auditStatus.color}`} />
              }
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{auditStatus.title}</h3>
              <p className="text-gray-300 text-lg max-w-2xl">{auditStatus.description}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border text-sm font-semibold ${auditStatus.badge}`}>
            {totalRules} RULES
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{totalRules}</div>
            <div className="text-sm text-gray-400">Total Rules</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{audit.eventCreateRules.length}</div>
            <div className="text-sm text-gray-400">Data Streams</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {audit.eventCreateRules.length > 0 ? 
                Math.round(totalRules / audit.eventCreateRules.length * 10) / 10 : 0}
            </div>
            <div className="text-sm text-gray-400">Avg Rules/Stream</div>
          </div>
        </div>
      </div>

      {/* Warnings and Recommendations */}
      {warnings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {warnings.map((warning, index) => (
            <div key={index} className={`
              backdrop-blur-xl rounded-2xl p-6 border shadow-xl
              ${warning.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                warning.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                'bg-blue-500/10 border-blue-500/30'}
            `}>
              <div className="flex items-start space-x-3">
                {warning.type === 'critical' ? 
                  <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" /> :
                  warning.type === 'warning' ?
                  <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" /> :
                  <HelpCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                }
                <div>
                  <h4 className={`font-bold mb-2 ${
                    warning.type === 'critical' ? 'text-red-400' :
                    warning.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {warning.title}
                  </h4>
                  <p className="text-gray-300 text-sm">{warning.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Rules by Stream */}
      {audit.eventCreateRules.length > 0 && (
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Settings className="w-7 h-7 mr-3 text-orange-400" />
              Event Create Rules Configuration
            </h3>
            <a 
              href="https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.dataStreams.eventCreateRules"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              API Documentation
            </a>
          </div>

          <div className="space-y-6">
            {audit.eventCreateRules.map((stream, streamIndex) => (
              <div key={streamIndex} className="bg-black/50 rounded-xl border border-gray-600/50">
                <button
                  onClick={() => toggleStream(stream.streamName)}
                  className="w-full p-6 text-left hover:bg-gray-800/30 transition-colors rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Settings className="w-6 h-6 text-orange-400" />
                      <div>
                        <h4 className="text-xl font-semibold text-white">{stream.streamName}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {stream.rules.length} event create rule{stream.rules.length !== 1 ? 's' : ''} configured
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        stream.rules.length === 0 ? 'bg-green-500/30 text-green-300' :
                        stream.rules.length <= 2 ? 'bg-yellow-500/30 text-yellow-300' :
                        'bg-red-500/30 text-red-300'
                      }`}>
                        {stream.rules.length} Rules
                      </div>
                      {expandedStreams.has(stream.streamName) ?
                        <ChevronDown className="w-5 h-5 text-gray-400" /> :
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </button>

                {expandedStreams.has(stream.streamName) && (
                  <div className="px-6 pb-6">
                    {stream.rules.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-gray-400 text-sm">
                            Rules modify or create events based on existing event data
                          </p>
                          {stream.rules.length > 5 && (
                            <button
                              onClick={() => setShowAllRules(!showAllRules)}
                              className="flex items-center text-sm text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              {showAllRules ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                              {showAllRules ? 'Show Less' : `Show All ${stream.rules.length} Rules`}
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {(showAllRules ? stream.rules : stream.rules.slice(0, 5)).map((rule, ruleIndex) => (
                            <div key={ruleIndex} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                              {/* Rule Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h5 className="font-bold text-lg text-white mb-1">
                                    {rule.destinationEvent || rule.displayName || `Rule ${ruleIndex + 1}`}
                                  </h5>
                                  <div className="text-sm text-gray-400">
                                    {rule.destinationEvent ? 'Creates new event' : 'Modifies existing event'}
                                  </div>
                                </div>
                                <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded border border-yellow-500/30">
                                  REVIEW NEEDED
                                </div>
                              </div>

                              {/* Rule Logic */}
                              <div className="bg-black/30 rounded-lg p-4 mb-4">
                                <div className="text-sm font-semibold text-orange-400 mb-2">Fires when:</div>
                                <div className="space-y-1">
                                  {rule.eventConditions && rule.eventConditions.length > 0 ? (
                                    rule.eventConditions.map((condition, condIndex) => (
                                      <div key={condIndex} className="flex items-center text-sm">
                                        {condIndex > 0 && (
                                          <span className="text-blue-400 font-bold mr-2">AND</span>
                                        )}
                                        <span className="text-gray-300">
                                          <span className="text-blue-300 font-medium">{condition.field}</span>
                                          <span className="text-gray-400 mx-2">{condition.comparisonType.toLowerCase()}</span>
                                          <span className="text-green-300 font-medium">"{condition.value}"</span>
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-gray-400 italic">No conditions specified</div>
                                  )}
                                </div>
                              </div>

                              {/* Parameter Handling */}
                              {rule.sourceCopyParameters && (
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                                  <div className="flex items-center text-blue-300 text-sm">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                    Copies all parameters from source event
                                  </div>
                                </div>
                              )}

                              {rule.parameterMutations && rule.parameterMutations.length > 0 && (
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                                  <div className="text-sm font-semibold text-purple-400 mb-2">Parameter Changes:</div>
                                  <div className="space-y-1">
                                    {rule.parameterMutations.map((mutation, mutIndex) => (
                                      <div key={mutIndex} className="text-sm text-gray-300">
                                        <span className="text-purple-300 font-medium">{mutation.parameter}</span>
                                        <span className="text-gray-400 mx-2">=</span>
                                        <span className="text-green-300">"{mutation.parameterValue}"</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Audit Warnings */}
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center text-orange-300">
                                  <AlertTriangle className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span>Verify this rule doesn't create duplicate events with different names</span>
                                </div>
                                <div className="flex items-center text-orange-300">
                                  <AlertTriangle className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span>Confirm attribution data remains intact after event transformation</span>
                                </div>
                                <div className="flex items-center text-orange-300">
                                  <AlertTriangle className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span>Test that downstream integrations (Google Ads, etc.) still function correctly</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {!showAllRules && stream.rules.length > 5 && (
                          <div className="text-center pt-4">
                            <p className="text-gray-400 text-sm">
                              {stream.rules.length - 5} more rules...
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <div className="flex items-center text-green-400">
                          <Zap className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Clean Configuration</span>
                        </div>
                        <p className="text-green-300 text-sm mt-1">
                          No event create rules configured for this stream
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What This Means for Your Business */}
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30">
        <div className="flex items-center mb-6">
          <HelpCircle className="w-7 h-7 mr-3 text-orange-400" />
          <h3 className="text-2xl font-bold text-white">What This Means for Your Business</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-3">Data Quality & Accuracy</h4>
            <p className="text-gray-300 mb-4">
              {totalRules === 0 
                ? "Clean setup with no event modification rules reduces the risk of data quality issues and ensures accurate reporting."
                : totalRules <= 5
                ? "Few event create rules require careful validation to ensure they're working as intended and not causing data issues."
                : "Complex rule configuration significantly increases the risk of duplicate events, missing parameters, and corrupted attribution data."}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-orange-400 mb-3">Maintenance & Troubleshooting</h4>
            <p className="text-gray-300 mb-4">
              {totalRules === 0 
                ? "No event create rules means simpler troubleshooting and easier data validation for your analytics team."
                : "Event create rules require ongoing monitoring and expert knowledge to maintain. Consider documenting their purpose and testing their impact regularly."}
            </p>
          </div>
        </div>

        {totalRules > 0 && (
          <div className="mt-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <h4 className="text-lg font-semibold text-orange-400 mb-2">🔥 Hot Tip for Agencies</h4>
            <p className="text-gray-300 text-sm">
              In 95% of GA4 audits, event create rules are either unnecessary legacy configurations from Universal Analytics 
              or incorrectly implemented. Always question their necessity and validate their business value before keeping them.
            </p>
          </div>
        )}
      </div>

      {/* No Rules Found - Clean Setup */}
      {totalRules === 0 && (
        <div className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 text-center">
          <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-400 mb-2">Clean Event Configuration!</h3>
          <p className="text-gray-300 text-lg">
            No event create rules detected. This is actually good - it means your events are flowing naturally 
            without modification, reducing the risk of data quality issues.
          </p>
        </div>
      )}
    </div>
  );
};
