import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Database, BarChart3, Tag } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface CustomDefinitionsDetailProps {
  audit: GA4Audit;
}

export const CustomDefinitionsDetail: React.FC<CustomDefinitionsDetailProps> = ({ audit }) => {
  const [expandedDimensions, setExpandedDimensions] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState(false);

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Database className="w-7 h-7 mr-3 text-orange-400" />
        Complete Custom Definitions
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Custom Dimensions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-400" />
              Custom Dimensions ({audit.customDimensions.length}/50)
            </h4>
            <button
              onClick={() => setExpandedDimensions(!expandedDimensions)}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>{expandedDimensions ? 'Collapse' : 'View All'}</span>
              {expandedDimensions ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          </div>

          <div className="space-y-3">
            {audit.customDimensions.length > 0 ? (
              <>
                {(expandedDimensions ? audit.customDimensions : audit.customDimensions.slice(0, 3)).map((dim, index) => (
                  <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white">{dim.displayName}</h5>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {dim.scope}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">
                        <span className="text-gray-500">Parameter:</span>{' '}
                        <code className="bg-gray-800 px-2 py-1 rounded text-orange-300 text-xs">
                          {dim.parameterName}
                        </code>
                      </div>
                      {dim.description && (
                        <div className="text-xs text-gray-500">{dim.description}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {!expandedDimensions && audit.customDimensions.length > 3 && (
                  <button
                    onClick={() => setExpandedDimensions(true)}
                    className="w-full text-center py-3 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    Show {audit.customDimensions.length - 3} more dimensions
                  </button>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400 bg-black/30 rounded-lg p-4 border border-gray-700/50 text-center">
                <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                No custom dimensions configured yet
              </div>
            )}
          </div>
        </div>

        {/* Custom Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
              Custom Metrics ({audit.customMetrics.length}/50)
            </h4>
            <button
              onClick={() => setExpandedMetrics(!expandedMetrics)}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>{expandedMetrics ? 'Collapse' : 'View All'}</span>
              {expandedMetrics ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          </div>

          <div className="space-y-3">
            {audit.customMetrics.length > 0 ? (
              <>
                {(expandedMetrics ? audit.customMetrics : audit.customMetrics.slice(0, 3)).map((metric, index) => (
                  <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white">{metric.displayName}</h5>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        {metric.scope}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-400">
                        <span className="text-gray-500">Parameter:</span>{' '}
                        <code className="bg-gray-800 px-2 py-1 rounded text-orange-300 text-xs">
                          {metric.parameterName}
                        </code>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="text-gray-500">Unit:</span> {metric.unitOfMeasurement}
                      </div>
                      {metric.description && (
                        <div className="text-xs text-gray-500">{metric.description}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {!expandedMetrics && audit.customMetrics.length > 3 && (
                  <button
                    onClick={() => setExpandedMetrics(true)}
                    className="w-full text-center py-3 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                  >
                    Show {audit.customMetrics.length - 3} more metrics
                  </button>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400 bg-black/30 rounded-lg p-4 border border-gray-700/50 text-center">
                <BarChart3 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                No custom metrics configured yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Events Section */}
      <div className="mt-8 pt-8 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-green-400" />
          All Key Events ({audit.keyEvents.length})
        </h4>
        
        {audit.keyEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audit.keyEvents.map((event, index) => (
              <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                <div className="font-medium text-white mb-1">{event.eventName}</div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(event.createTime).toLocaleDateString()}
                </div>
                {event.countingMethod && (
                  <div className="text-xs text-gray-500 mt-1">
                    Counting: {event.countingMethod}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-4 border border-red-500/30 text-center">
            <Tag className="w-8 h-8 text-red-600 mx-auto mb-2" />
            ⚠️ No key events configured - critical for conversion tracking
          </div>
        )}
      </div>
    </div>
  );
};
