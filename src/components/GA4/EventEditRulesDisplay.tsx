import React, { useState } from 'react';
import { GA4Audit, EventEditRuleStream, EventEditRule } from '@/types/ga4';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Settings } from 'lucide-react';

interface EventEditRulesDisplayProps {
  audit: GA4Audit;
}

export const EventEditRulesDisplay: React.FC<EventEditRulesDisplayProps> = ({ audit }) => {
  const [expandedStreams, setExpandedStreams] = useState<Set<string>>(new Set());
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const toggleStream = (streamId: string) => {
    const newExpanded = new Set(expandedStreams);
    if (newExpanded.has(streamId)) {
      newExpanded.delete(streamId);
    } else {
      newExpanded.add(streamId);
    }
    setExpandedStreams(newExpanded);
  };

  const toggleRule = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  // Get total count of event edit rules
  const totalEventEditRules = audit.eventEditRules?.reduce((total, stream) => total + stream.rules.length, 0) || 0;

  // Determine status and description based on rules count
  const getStatusInfo = () => {
    if (totalEventEditRules === 0) {
      return {
        status: 'complete',
        description: 'No event edit rules detected - this reduces complexity and potential data quality issues',
        icon: CheckCircle,
        color: 'text-green-400'
      };
    } else {
      return {
        status: 'warning',
        description: 'Event edit rules detected - these can modify existing events and may contain configuration errors',
        icon: AlertTriangle,
        color: 'text-orange-400'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getEventEditRulesWarnings = () => {
    const warnings = [];
    
    if (totalEventEditRules > 5) {
      warnings.push({
        severity: 'high',
        message: 'Complex event edit rules setup detected - multiple rules can create complex rule chains that are difficult to debug.'
      });
    }
    
    if (totalEventEditRules > 0) {
      warnings.push({
        severity: 'medium',
        message: 'Event edit rules often contain configuration errors that cause data quality issues. Most implementations have configuration errors.'
      });
    }

    return warnings;
  };

  const warnings = getEventEditRulesWarnings();

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
          <h3 className="text-xl font-bold text-white">Event Edit Rules</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{totalEventEditRules}</div>
          <div className="text-sm text-gray-400">Total Rules</div>
        </div>
      </div>

      <p className="text-gray-300 mb-6">{statusInfo.description}</p>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-6 space-y-3">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                warning.severity === 'high' 
                  ? 'bg-red-500/10 border-red-500/20 text-red-300' 
                  : 'bg-orange-500/10 border-orange-500/20 text-orange-300'
              }`}
            >
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{warning.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Information */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-white mb-2">ℹ️ About Event Edit Rules</h4>
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            Event edit rules modify existing events by changing parameters or conditions. 
            They can create complex rule chains that affect data quality.
          </p>
          <p>
            <strong>Important:</strong> Event edit rules are processed in order and can modify events 
            that were created by event create rules, creating complex dependencies.
          </p>
        </div>
      </div>

      {/* Event Edit Rules Details */}
      {audit.eventEditRules && audit.eventEditRules.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-lg">📋 Event Edit Rules Details</h4>
          
          {audit.eventEditRules.map((stream: EventEditRuleStream, streamIndex: number) => {
            const streamId = stream.streamId || `stream-${streamIndex}`;
            const isStreamExpanded = expandedStreams.has(streamId);
            
            return (
              <div key={streamId} className="bg-slate-800/30 rounded-lg border border-slate-700">
                <button
                  onClick={() => toggleStream(streamId)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-semibold text-white">{stream.streamName}</div>
                      <div className="text-sm text-gray-400">{stream.rules.length} rule(s)</div>
                    </div>
                  </div>
                  {isStreamExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isStreamExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {stream.rules.map((rule: EventEditRule, ruleIndex: number) => {
                      const ruleId = `${streamId}-rule-${ruleIndex}`;
                      const isRuleExpanded = expandedRules.has(ruleId);
                      
                      return (
                        <div key={ruleId} className="bg-slate-700/50 rounded-lg border border-slate-600">
                          <button
                            onClick={() => toggleRule(ruleId)}
                            className="w-full p-3 text-left flex items-center justify-between hover:bg-slate-600/30 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              <span className="font-medium text-white">{rule.displayName}</span>
                            </div>
                            {isRuleExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          
                          {isRuleExpanded && (
                            <div className="px-3 pb-3 space-y-3">
                              {/* Event Conditions */}
                              {rule.eventConditions && rule.eventConditions.length > 0 && (
                                <div>
                                  <div className="text-sm font-semibold text-gray-300 mb-2">Event Conditions:</div>
                                  <div className="space-y-1">
                                    {rule.eventConditions.map((condition, condIndex) => (
                                      <div key={condIndex} className="text-xs text-gray-400 bg-slate-800/50 p-2 rounded">
                                        {condition.field} {condition.comparisonType} "{condition.value}"
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Parameter Mutations */}
                              {rule.parameterMutations && rule.parameterMutations.length > 0 && (
                                <div>
                                  <div className="text-sm font-semibold text-gray-300 mb-2">Parameter Changes:</div>
                                  <div className="space-y-1">
                                    {rule.parameterMutations.map((mutation, mutIndex) => (
                                      <div key={mutIndex} className="text-xs text-gray-400 bg-slate-800/50 p-2 rounded">
                                        {mutation.parameter} = "{mutation.parameterValue}"
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Additional Info */}
                              <div className="text-xs text-gray-500 space-y-1">
                                {rule.sourceCopyParameters && (
                                  <div>• Source parameters copied</div>
                                )}
                                {rule.createTime && (
                                  <div>• Created: {new Date(rule.createTime).toLocaleDateString()}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="text-sm text-gray-500 mt-2">Across {audit.eventEditRules?.length || 0} data stream(s)</div>
        </div>
      )}

      {/* No Rules State */}
      {(!audit.eventEditRules || audit.eventEditRules.length === 0) && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-green-300 font-medium">No Event Edit Rules</p>
          <p className="text-gray-400 text-sm mt-2">Your GA4 property has no event edit rules configured.</p>
        </div>
      )}

      {/* Recommendations */}
      <div className="mt-8 bg-slate-800/30 rounded-lg p-6 border border-slate-700">
        <h4 className="font-semibold text-orange-300 mb-3 text-lg">🎯 Event Edit Rules Recommendations</h4>
        
        {totalEventEditRules === 0 ? (
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Excellent:</strong> No event edit rules means no risk of rule-based data quality issues.</p>
            <p>• Your data collection is simpler and more predictable</p>
            <p>• No complex rule chains to debug</p>
            <p>• Reduced risk of configuration errors</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Review Required:</strong> Event edit rules detected that should be reviewed by a GA4 expert.</p>
            <p>• Event edit rules can modify existing events and create complex dependencies</p>
            <p>• Rule order matters - later rules can override earlier ones</p>
            <p>• Consider if all rules are necessary for your business needs</p>
            <p>• Test rule logic thoroughly to ensure data quality</p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-sm text-blue-300 font-medium mb-1">💡 Pro Tip:</div>
          <div className="text-xs text-gray-300">
            Changes to event edit rules affect future data collection only. 
            Historical data is not retroactively modified by rule changes.
          </div>
        </div>
      </div>
    </div>
  );
}; 