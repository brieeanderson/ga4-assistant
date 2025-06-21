import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database, BarChart3, Tag, Eye, EyeOff } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface CustomDefinitionsDisplayProps {
  audit: GA4Audit;
  keyEventsDetailRef?: React.RefObject<HTMLDivElement | null>;
  customMetricsRef?: React.RefObject<HTMLDivElement | null>;
}

export const CustomDefinitionsDisplay: React.FC<CustomDefinitionsDisplayProps> = ({ audit, keyEventsDetailRef, customMetricsRef }) => {
  const [showAllDimensions, setShowAllDimensions] = useState(false);
  const [showAllMetrics, setShowAllMetrics] = useState(false);

  const getScopeColor = (scope: string) => {
    switch (scope.toLowerCase()) {
      case 'event': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'user': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'session': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'item': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const displayedDimensions = showAllDimensions ? audit.customDimensions : audit.customDimensions.slice(0, 5);
  const displayedMetrics = showAllMetrics ? audit.customMetrics : audit.customMetrics.slice(0, 5);

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Database className="w-7 h-7 mr-3 text-orange-400" />
        Complete Custom Definitions Configuration
      </h3>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Custom Dimensions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-white flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-400" />
              Custom Dimensions
            </h4>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-400">
                {audit.customDimensions.length}/50 used
              </div>
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(audit.customDimensions.length / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {audit.customDimensions.length > 0 ? (
            <div className="space-y-3">
              {displayedDimensions.map((dimension, index) => (
                <div key={dimension.parameterName} className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-white text-sm mb-1">{dimension.displayName}</h5>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-xs bg-gray-800/80 px-2 py-1 rounded text-gray-300 font-mono">
                          {dimension.parameterName}
                        </code>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getScopeColor(dimension.scope)}`}>
                          {dimension.scope}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Index</div>
                      <div className="text-sm font-bold text-white">#{index + 1}</div>
                    </div>
                  </div>
                  
                  {dimension.description && (
                    <p className="text-xs text-gray-400 mb-2">{dimension.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Archive: {dimension.disallowAdsPersonalization ? 
                        <span className="text-green-400">Disabled</span> : 
                        <span className="text-yellow-400">Enabled</span>
                      }
                    </span>
                  </div>
                </div>
              ))}
              
              {audit.customDimensions.length > 5 && (
                <button
                  onClick={() => setShowAllDimensions(!showAllDimensions)}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-600/50 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  {showAllDimensions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>
                    {showAllDimensions 
                      ? 'Show Less' 
                      : `Show All ${audit.customDimensions.length} Dimensions`
                    }
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <Database className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300 font-medium mb-1">No Custom Dimensions</p>
              <p className="text-xs text-gray-400">
                Custom dimensions help you collect business-specific data that standard GA4 doesn't track.
              </p>
            </div>
          )}
        </div>

        {/* Custom Metrics */}
        <div className="space-y-4" ref={customMetricsRef}>
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
              Custom Metrics
            </h4>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-400">
                {audit.customMetrics.length}/50 used
              </div>
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(audit.customMetrics.length / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {audit.customMetrics.length > 0 ? (
            <div className="space-y-3">
              {displayedMetrics.map((metric, index) => (
                <div key={metric.parameterName} className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-white text-sm mb-1">{metric.displayName}</h5>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-xs bg-gray-800/80 px-2 py-1 rounded text-gray-300 font-mono">
                          {metric.parameterName}
                        </code>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getScopeColor(metric.scope)}`}>
                          {metric.scope}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Index</div>
                      <div className="text-sm font-bold text-white">#{index + 1}</div>
                    </div>
                  </div>
                  
                  {metric.description && (
                    <p className="text-xs text-gray-400 mb-2">{metric.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Unit: {metric.unit || 'Standard'}
                    </span>
                    <span className="text-gray-500">
                      Type: {metric.measurementUnit || 'Numeric'}
                    </span>
                  </div>
                </div>
              ))}
              
              {audit.customMetrics.length > 5 && (
                <button
                  onClick={() => setShowAllMetrics(!showAllMetrics)}
                  className="w-full p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-600/50 text-sm text-gray-300 hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  {showAllMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>
                    {showAllMetrics 
                      ? 'Show Less' 
                      : `Show All ${audit.customMetrics.length} Metrics`
                    }
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <BarChart3 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300 font-medium mb-1">No Custom Metrics</p>
              <p className="text-xs text-gray-400">
                Custom metrics let you track numeric values that are important to your business goals.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key Events Details Section */}
      <div className="mt-8" ref={keyEventsDetailRef}>
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Tag className="w-6 h-6 mr-2 text-orange-400" />
          Key Events Configuration Details
        </h4>
        
        {audit.keyEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {audit.keyEvents.map((event, index) => (
              <div key={event.eventName} className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold text-white">{event.eventName}</h5>
                    <p className="text-xs text-gray-400 mt-1">Key Event #{index + 1}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.countingMethod === 'ONCE_PER_EVENT' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {event.countingMethod === 'ONCE_PER_EVENT' ? 'Per Event' : 'Per Session'}
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Counting Method:</span>
                    <span className="text-gray-300">
                      {event.countingMethod === 'ONCE_PER_EVENT' ? 'Once per event' : 'Once per session'}
                    </span>
                  </div>
                  
                  {event.custom !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-300">
                        {event.custom ? 'Custom Event' : 'Standard Event'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <Tag className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-300 font-medium mb-1">No Key Events Configured</p>
            <p className="text-xs text-gray-400">
              Key events are essential for measuring business-critical actions. Configure at least one key event.
            </p>
          </div>
        )}
      </div>

      {/* Summary and Recommendations */}
      <div className="mt-8 p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
        <h4 className="font-semibold text-orange-300 mb-2">📊 Custom Definitions Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Custom Dimensions:</span>
            <div className="text-white font-medium">{audit.customDimensions.length}/50 used ({Math.round((audit.customDimensions.length / 50) * 100)}%)</div>
          </div>
          <div>
            <span className="text-gray-400">Custom Metrics:</span>
            <div className="text-white font-medium">{audit.customMetrics.length}/50 used ({Math.round((audit.customMetrics.length / 50) * 100)}%)</div>
          </div>
          <div>
            <span className="text-gray-400">Key Events:</span>
            <div className="text-white font-medium">{audit.keyEvents.length} configured</div>
          </div>
        </div>
        
        {(audit.customDimensions.length === 0 || audit.customMetrics.length === 0 || audit.keyEvents.length === 0) && (
          <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded">
            <p className="text-xs text-yellow-200">
              💡 <strong>Recommendation:</strong> Consider setting up custom dimensions and metrics to track business-specific data that standard GA4 doesn't capture.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
