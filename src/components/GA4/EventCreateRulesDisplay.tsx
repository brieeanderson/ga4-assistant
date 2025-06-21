import React, { useState } from 'react';
import { Settings, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight, Eye, EyeOff, Zap, Target } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface EventCreateRulesDisplayProps {
  audit: GA4Audit;
}

export const EventCreateRulesDisplay: React.FC<EventCreateRulesDisplayProps> = ({ audit }) => {
  const [expandedStreams, setExpandedStreams] = useState<Set<number>>(new Set([0]));
  const [showAllRules, setShowAllRules] = useState(false);

  const toggleStream = (streamIndex: number) => {
    const newExpanded = new Set(expandedStreams);
    if (newExpanded.has(streamIndex)) {
      newExpanded.delete(streamIndex);
    } else {
      newExpanded.add(streamIndex);
    }
    setExpandedStreams(newExpanded);
  };

  const totalRules = audit.eventCreateRules.reduce((total, stream) => total + stream.rules.length, 0);

  const getAuditStatus = () => {
    if (totalRules === 0) {
      return {
        status: 'clean',
        title: 'Clean Configuration',
        description: 'No event create rules detected - this reduces complexity and potential data quality issues',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        icon: CheckCircle
      };
    } else if (totalRules <= 3) {
      return {
        status: 'review-needed',
        title: 'Rules Require Expert Review',
        description: 'Event create rules detected - these commonly contain configuration errors that affect data quality',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        icon: AlertTriangle
      };
    } else {
      return {
        status: 'high-risk',
        title: 'High-Risk Configuration',
        description: 'Complex rule setup with high potential for data quality issues and event conflicts',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        icon: XCircle
      };
    }
  };

  const auditStatus = getAuditStatus();
  const IconComponent = auditStatus.icon;

  const getEventCreateRulesWarnings = () => {
    const warnings = [];

    if (totalRules > 0) {
      warnings.push({
        type: 'warning',
        title: 'Configuration Complexity',
        message: 'Event create rules often contain configuration errors that cause data quality issues. Most implementations have configuration errors.'
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
                <CheckCircle className={`w-8 h-8 ${auditStatus.color}`} /> :
                auditStatus.status === 'review-needed' ?
                <AlertTriangle className={`w-8 h-8 ${auditStatus.color}`} /> :
                <XCircle className={`w-8 h-8 ${auditStatus.color}`} />
              }
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{auditStatus.title}</h3>
              <p className="text-gray-300 text-lg max-w-2xl">{auditStatus.description}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
            auditStatus.status === 'clean' ? 'bg-green-500/30 text-green-300 border-green-500/50' :
            auditStatus.status === 'review-needed' ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50' :
            'bg-red-500/30 text-red-300 border-red-500/50'
          }`}>
            {totalRules} rules
          </div>
        </div>

        {/* Rules Summary */}
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${auditStatus.color} mb-2`}>{totalRules}</div>
            <div className="text-2xl text-gray-400">Event Create Rules</div>
            <div className="text-sm text-gray-500 mt-2">Across {audit.eventCreateRules.length} data stream(s)</div>
          </div>
        </div>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="bg-yellow-500/10 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
            <h4 className="text-xl font-bold text-yellow-400">Configuration Warnings</h4>
          </div>
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div key={index} className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
                <h5 className="font-semibold text-yellow-300 mb-1">{warning.title}</h5>
                <p className="text-sm text-gray-300">{warning.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Create Rules Details */}
      {audit.eventCreateRules.length > 0 && (
        <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Target className="w-7 h-7 mr-3 text-orange-400" />
            Event Create Rules Configuration
          </h3>
          
          <div className="space-y-6">
            {audit.eventCreateRules.map((stream, streamIndex) => {
              const isExpanded = expandedStreams.has(streamIndex);
              const displayedRules = showAllRules ? stream.rules : stream.rules.slice(0, 3);
              
              return (
                <div key={streamIndex} className="border border-gray-600/50 rounded-xl">
                  <button
                    onClick={() => toggleStream(streamIndex)}
                    className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-6 h-6 text-blue-400" />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{stream.streamName}</h4>
                          <p className="text-sm text-gray-400">
                            {stream.rules.length} rule(s) configured
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          stream.rules.length === 0 ? 'bg-green-500/20 text-green-300' :
                          stream.rules.length <= 3 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {stream.rules.length === 0 ? 'Clean' :
                           stream.rules.length <= 3 ? 'Review Needed' :
                           'High Risk'}
                        </span>
                        {isExpanded ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </button>

                  {isExpanded && stream.rules.length > 0 && (
                    <div className="px-6 pb-6 space-y-4">
                      {displayedRules.map((rule, ruleIndex) => (
                        <div key={ruleIndex} className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="font-semibold text-white mb-1">{rule.destinationEvent}</h5>
                              <p className="text-xs text-gray-400">Created from: {rule.sourceEvent || 'Not specified'}</p>
                            </div>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300">
                              Rule #{ruleIndex + 1}
                            </span>
                          </div>

                          {rule.conditions && rule.conditions.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-sm font-medium text-gray-300 mb-2">Conditions:</h6>
                              <div className="space-y-1">
                                {rule.conditions.map((condition, condIndex) => (
                                  <div key={condIndex} className="text-xs bg-gray-800/80 px-2 py-1 rounded">
                                    <code className="text-gray-300">
                                      {condition.parameter} {condition.operator} {condition.value}
                                    </code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {rule.parameterModifications && rule.parameterModifications.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-sm font-medium text-gray-300 mb-2">Parameter Modifications:</h6>
                              <div className="space-y-1">
                                {rule.parameterModifications.map((mod, modIndex) => (
                                  <div key={modIndex} className="text-xs bg-blue-800/30 px-2 py-1 rounded">
                                    <code className="text-blue-300">
                                      {mod.parameter}: {mod.operation} → {mod.value}
                                    </code>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            <strong>Status:</strong> {rule.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      ))}

                      {stream.rules.length > 3 && (
                        <button
                          onClick={() => setShowAllRules(!showAllRules)}
                          className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-600/50 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
                        >
                          {showAllRules ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span>
                            {showAllRules 
                              ? 'Show Less' 
                              : `Show All ${stream.rules.length} Rules`
                            }
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {isExpanded && stream.rules.length === 0 && (
                    <div className="px-6 pb-6">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p className="text-green-300 font-medium">No Event Create Rules</p>
                        <p className="text-xs text-gray-400 mt-1">Clean configuration - no risk of rule-based data quality issues</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-orange-900/20 border border-orange-600/30 rounded-2xl p-6">
        <h4 className="font-semibold text-orange-300 mb-3 text-lg">🎯 Event Create Rules Recommendations</h4>
        {totalRules === 0 ? (
          <p className="text-sm text-gray-300">
            <strong>Excellent:</strong> No event create rules means no risk of rule-based data quality issues. 
            This is often the cleanest and most reliable configuration.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-gray-300">
            <p><strong>High Priority:</strong> Have a GA4 expert review each rule for configuration errors.</p>
            <p><strong>Documentation:</strong> Document the business purpose of each rule and validate it's still needed.</p>
            <p><strong>Testing:</strong> Test rule behavior in debug mode to ensure expected event creation.</p>
            <p><strong>Simplification:</strong> Consider removing unnecessary rules to reduce complexity.</p>
          </div>
        )}
      </div>

      {/* Admin Path Reference */}
      <div className="bg-gray-800/50 rounded border border-gray-600/50 p-4">
        <p className="text-xs text-gray-400 mb-1">
          <strong>Admin Location:</strong> Admin &gt; Events &gt; Create events
        </p>
        <p className="text-xs text-gray-300">
          Changes to event create rules affect future data collection only.
        </p>
      </div>
    </div>
  );
};
