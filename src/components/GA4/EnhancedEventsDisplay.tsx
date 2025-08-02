import React, { useState } from 'react';
import { Target, ChevronDown, ChevronRight, Settings, Zap } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface EnhancedEventsDisplayProps {
  audit: GA4Audit;
}

export const EnhancedEventsDisplay: React.FC<EnhancedEventsDisplayProps> = ({ audit }) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleEvent = (eventName: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventName)) {
      newExpanded.delete(eventName);
    } else {
      newExpanded.add(eventName);
    }
    setExpandedEvents(newExpanded);
  };

  // Create a map of events to their creation rules
  const eventToRuleMap = new Map<string, any>();
  
  if (audit.eventCreateRules) {
    audit.eventCreateRules.forEach(stream => {
      stream.rules.forEach(rule => {
        if (rule.destinationEvent) {
          eventToRuleMap.set(rule.destinationEvent, {
            rule,
            streamName: stream.streamName,
            streamId: stream.streamId
          });
        }
      });
    });
  }

  // Get all events and merge with key events
  const allEvents = new Set<string>();
  
  // Add all events from the API
  if (audit.allEvents) {
    audit.allEvents.forEach(event => {
      if (event.eventName) {
        allEvents.add(event.eventName);
      }
    });
  }
  
  // Add key events
  if (audit.keyEvents) {
    audit.keyEvents.forEach(event => {
      if (event.eventName) {
        allEvents.add(event.eventName);
      }
    });
  }

  const sortedEvents = Array.from(allEvents).sort();

  const isKeyEvent = (eventName: string) => {
    return audit.keyEvents?.some(keyEvent => keyEvent.eventName === eventName) || false;
  };

  const getEventSource = (eventName: string) => {
    if (eventToRuleMap.has(eventName)) {
      return 'rule-created';
    } else if (isKeyEvent(eventName)) {
      return 'key-event';
    } else {
      return 'standard';
    }
  };

  const getEventSourceColor = (source: string) => {
    switch (source) {
      case 'rule-created':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'key-event':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getEventSourceLabel = (source: string) => {
    switch (source) {
      case 'rule-created':
        return 'Rule Created';
      case 'key-event':
        return 'Key Event';
      default:
        return 'Standard';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Target className="w-7 h-7 mr-3 text-green-400" />
        All Events ({sortedEvents.length})
      </h3>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-4">
          Complete list of all events in your GA4 property with their creation sources and rule details.
        </p>
        <div className="text-sm text-gray-400">
          <strong>Note:</strong> Events can be created by rules, manually implemented, or automatically tracked by GA4.
        </div>
      </div>

      <div className="space-y-3">
        {sortedEvents.map((eventName, index) => {
          const isExpanded = expandedEvents.has(eventName);
          const source = getEventSource(eventName);
          const ruleInfo = eventToRuleMap.get(eventName);
          const keyEventInfo = audit.keyEvents?.find(keyEvent => keyEvent.eventName === eventName);

          return (
            <div key={index} className="border border-gray-600/50 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleEvent(eventName)}
                className="w-full p-4 text-left hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isKeyEvent(eventName) && (
                        <Target className="w-4 h-4 text-green-400" />
                      )}
                      {ruleInfo && (
                        <Settings className="w-4 h-4 text-orange-400" />
                      )}
                      {!isKeyEvent(eventName) && !ruleInfo && (
                        <Zap className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{eventName}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getEventSourceColor(source)}`}>
                          {getEventSourceLabel(source)}
                        </span>
                        {isKeyEvent(eventName) && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                            Key Event
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isExpanded ? 
                      <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 bg-gray-800/30">
                  {/* Rule Information */}
                  {ruleInfo && (
                    <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
                      <h5 className="font-semibold text-white mb-3 flex items-center">
                        <Settings className="w-4 h-4 mr-2 text-orange-400" />
                        Created by Rule
                      </h5>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-400">
                          <strong>Rule ID:</strong> {ruleInfo.rule.name?.split('/').pop() || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400">
                          <strong>Data Stream:</strong> {ruleInfo.streamName}
                        </div>
                        
                        {ruleInfo.rule.eventConditions && ruleInfo.rule.eventConditions.length > 0 && (
                          <div>
                            <h6 className="text-sm font-medium text-gray-300 mb-2">Conditions:</h6>
                            <div className="space-y-1">
                              {ruleInfo.rule.eventConditions.map((condition: any, condIndex: number) => (
                                <div key={condIndex} className="text-xs bg-gray-800/80 px-2 py-1 rounded">
                                  <code className="text-gray-300">
                                    {condition.field} {condition.comparisonType} {condition.value}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {ruleInfo.rule.parameterMutations && ruleInfo.rule.parameterMutations.length > 0 && (
                          <div>
                            <h6 className="text-sm font-medium text-gray-300 mb-2">Parameter Mutations:</h6>
                            <div className="space-y-1">
                              {ruleInfo.rule.parameterMutations.map((mod: any, modIndex: number) => (
                                <div key={modIndex} className="text-xs bg-blue-800/30 px-2 py-1 rounded">
                                  <code className="text-blue-300">
                                    {mod.parameter}: {mod.parameterValue}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Key Event Information */}
                  {keyEventInfo && (
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                      <h5 className="font-semibold text-green-300 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Key Event Details
                      </h5>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div><strong>Event Name:</strong> {keyEventInfo.eventName}</div>
                        {keyEventInfo.createTime && (
                          <div><strong>Created:</strong> {new Date(keyEventInfo.createTime).toLocaleDateString()}</div>
                        )}
                        <div><strong>Status:</strong> Active conversion event</div>
                      </div>
                    </div>
                  )}

                  {/* Standard Event Information */}
                  {!ruleInfo && !keyEventInfo && (
                    <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                      <h5 className="font-semibold text-blue-300 mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Standard Event
                      </h5>
                      <div className="text-sm text-gray-300">
                        This event is either automatically tracked by GA4 or manually implemented via gtag/GTM.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <h4 className="font-semibold text-white mb-3">Event Source Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Rule Created
            </span>
            <span className="text-gray-300">Created by event create rules</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
              Key Event
            </span>
            <span className="text-gray-300">Marked as conversion event</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Standard
            </span>
            <span className="text-gray-300">Auto-tracked or manual implementation</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h4 className="font-semibold text-yellow-300 mb-2">🔍 Event Analysis Recommendations</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div>• Review rule-created events for configuration errors and business necessity</div>
          <div>• Ensure key events align with your conversion goals</div>
          <div>• Document the purpose of each custom event for team reference</div>
          <div>• Consider removing unused events to reduce complexity</div>
        </div>
      </div>
    </div>
  );
}; 