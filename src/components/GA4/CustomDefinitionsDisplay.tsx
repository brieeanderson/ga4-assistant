import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database, BarChart3, Tag, Eye, EyeOff } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface CustomDefinitionsDisplayProps {
  audit: GA4Audit;
}

export const CustomDefinitionsDisplay: React.FC<CustomDefinitionsDisplayProps> = ({ audit }) => {
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
                <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-white text-lg mb-1">{dimension.displayName}</h5>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getScopeColor(dimension.scope)}`}>
                          {dimension.scope.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Index: {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400 min-w-[80px]">Parameter:</span>
                      <code className="bg-gray-800 px-3 py-1 rounded text-orange-300 text-sm font-mono">
                        {dimension.parameterName}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
              
              {audit.customDimensions.length > 5 && (
                <button
                  onClick={() => setShowAllDimensions(!showAllDimensions)}
                  className="w-full flex items-center justify-center space-x-2 py-3 text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-all duration-200 bg-blue-500/5 hover:bg-blue-500/10"
                >
                  {showAllDimensions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>
                    {showAllDimensions 
                      ? 'Show Less' 
                      : `Show ${audit.customDimensions.length - 5} More Dimensions`
                    }
                  </span>
                  {showAllDimensions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-black/30 rounded-lg border border-gray-700/50">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h5 className="text-gray-400 font-medium mb-2">No Custom Dimensions</h5>
              <p className="text-sm text-gray-500 mb-4">
                Custom dimensions let you register event parameters as reportable dimensions in GA4.
              </p>
              <p className="text-xs text-gray-600">
                Go to Admin &gt; Custom definitions &gt; Custom dimensions to create them
              </p>
            </div>
          )}
        </div>

        {/* Custom Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
              Custom Metrics
            </h4>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-400">
                {audit.customMetrics.length}/50 used
              </div>
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                  style={{ width: `${(audit.customMetrics.length / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {audit.customMetrics.length > 0 ? (
            <div className="space-y-3">
              {displayedMetrics.map((metric, index) => (
                <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-white text-lg mb-1">{metric.displayName}</h5>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded border ${getScopeColor(metric.scope)}`}>
                          {metric.scope.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                          {metric.unitOfMeasurement}
                        </span>
                        <span className="text-xs text-gray-500">
                          Index: {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400 min-w-[80px]">Parameter:</span>
                      <code className="bg-gray-800 px-3 py-1 rounded text-orange-300 text-sm font-mono">
                        {metric.parameterName}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
              
              {audit.customMetrics.length > 5 && (
                <button
                  onClick={() => setShowAllMetrics(!showAllMetrics)}
                  className="w-full flex items-center justify-center space-x-2 py-3 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-all duration-200 bg-purple-500/5 hover:bg-purple-500/10"
                >
                  {showAllMetrics ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>
                    {showAllMetrics 
                      ? 'Show Less' 
                      : `Show ${audit.customMetrics.length - 5} More Metrics`
                    }
                  </span>
                  {showAllMetrics ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-black/30 rounded-lg border border-gray-700/50">
              <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h5 className="text-gray-400 font-medium mb-2">No Custom Metrics</h5>
              <p className="text-sm text-gray-500 mb-4">
                Custom metrics let you register numerical event parameters as reportable metrics in GA4.
              </p>
              <p className="text-xs text-gray-600">
                Go to Admin &gt; Custom definitions &gt; Custom metrics to create them
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key Events Section */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-semibold text-white flex items-center">
            <Tag className="w-6 h-6 mr-2 text-green-400" />
            Key Events (Conversions)
          </h4>
          <div className="text-sm text-gray-400">
            {audit.keyEvents.length} configured
          </div>
        </div>
        
        {audit.keyEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audit.keyEvents.map((event, index) => (
              <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50 hover:border-green-500/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-white">{event.eventName}</h5>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    KEY EVENT
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400">
                    Created: {new Date(event.createTime).toLocaleDateString()}
                  </div>
                  {event.countingMethod && (
                    <div className="text-xs text-gray-500">
                      Counting: {event.countingMethod}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-red-500/10 rounded-lg border border-red-500/30">
            <Tag className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h5 className="text-red-300 font-medium mb-2">⚠️ No Key Events Configured</h5>
            <p className="text-sm text-red-200 mb-4">
              Key events are critical for conversion tracking and can be imported to Google Ads for Smart Bidding.
            </p>
            <p className="text-xs text-red-300">
              Go to Admin &gt; Events &gt; Mark events as key events
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
