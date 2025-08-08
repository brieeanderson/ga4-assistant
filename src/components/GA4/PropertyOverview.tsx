import React from 'react';
import { BarChart3, Calendar, DollarSign, Shield, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface PropertyOverviewProps {
  audit: GA4Audit;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({ audit }) => {
  return (
    <div className="bg-brand-gray-dark/80 backdrop-blur-xl rounded-2xl p-8 border border-brand-blue/30 shadow-2xl">
      <h4 className="text-xl social-gothic text-white mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-3 text-brand-blue" />
        Property Overview: {audit.property.displayName}
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-brand-black/50 rounded-xl p-4 border border-brand-gray-light/50 text-center">
          <Calendar className="w-6 h-6 text-brand-blue mx-auto mb-2" />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{audit.property.timeZone || 'Not Set'}</div>
          <div className="text-xs text-gray-400 mt-1">Timezone</div>
        </div>
        
        <div className="bg-brand-black/50 rounded-xl p-4 border border-brand-gray-light/50 text-center">
          <DollarSign className="w-6 h-6 text-brand-blue-light mx-auto mb-2" />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{audit.property.currencyCode || 'USD'}</div>
          <div className="text-xs text-gray-400 mt-1">Currency</div>
        </div>
        
        <div className="bg-brand-black/50 rounded-xl p-4 border border-brand-gray-light/50 text-center">
          <Shield className="w-6 h-6 text-brand-blue mx-auto mb-2" />
          <div className="text-xs sm:text-sm font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{(audit.property.industryCategory || 'Not Set').replace(/_/g, ' ')}</div>
          <div className="text-xs text-gray-400 mt-1">Industry</div>
        </div>
        
        <div className="bg-brand-black/50 rounded-xl p-4 border border-brand-gray-light/50 text-center">
          <Database className="w-6 h-6 text-brand-blue mx-auto mb-2" />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{audit.dataStreams.length}</div>
          <div className="text-xs text-gray-400 mt-1">Data Streams</div>
        </div>

        {/* Key Events Card with Warning Logic */}
        <div className={`bg-brand-black/50 rounded-xl p-4 border text-center ${
          audit.keyEvents.length === 0 ? 'border-red-500/50' : 
          audit.keyEvents.length > 2 ? 'border-brand-blue/50' : 
          'border-brand-gray-light/50'
        }`}>
          <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
            audit.keyEvents.length === 0 ? 'text-red-400' : 
            audit.keyEvents.length > 2 ? 'text-brand-blue' : 
            'text-brand-blue-light'
          }`} />
          <div className={`text-sm sm:text-base font-bold break-words leading-snug min-h-[2.5rem] flex items-center justify-center ${
            audit.keyEvents.length === 0 ? 'text-red-300' : 
            audit.keyEvents.length > 2 ? 'text-yellow-300' : 
            'text-white'
          }`}>
            {audit.keyEvents.length}
          </div>
          <div className="text-xs text-gray-400 mt-1">Key Events</div>
          
          {/* Warning indicator */}
          {(audit.keyEvents.length === 0 || audit.keyEvents.length > 2) && (
            <div className="mt-2">
              <AlertTriangle className={`w-3 h-3 mx-auto ${
                audit.keyEvents.length === 0 ? 'text-red-400' : 'text-yellow-400'
              }`} />
            </div>
          )}
        </div>
      </div>

      {/* Data Streams Detail */}
      {audit.dataStreams.length > 0 && (
        <div className="mt-6">
          <h5 className="text-lg social-gothic text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-brand-blue" />
            Data Streams
          </h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {audit.dataStreams.map((stream, _index) => (
              <div key={stream.name} className="bg-brand-black/50 rounded-xl p-4 border border-brand-gray-light/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h6 className="font-semibold text-white text-sm">{stream.displayName}</h6>
                    <p className="text-xs text-gray-400 mt-1">Stream {_index + 1}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    stream.type === 'WEB_DATA_STREAM' ? 'bg-blue-500/20 text-blue-300' :
                    stream.type === 'ANDROID_APP_DATA_STREAM' ? 'bg-green-500/20 text-green-300' :
                    stream.type === 'IOS_APP_DATA_STREAM' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {stream.type?.replace('_DATA_STREAM', '').replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
                
                {stream.webStreamData && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-300">
                      <span className="text-gray-500">Default URI:</span> {stream.webStreamData.defaultUri || 'Not set'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Events Detail */}
      {audit.keyEvents.length > 0 && (
        <div className="mt-6">
          <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
            Key Events ({audit.keyEvents.length})
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {audit.keyEvents.map((event, _index) => (
              <div key={event.eventName} className="bg-black/50 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{event.eventName}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    event.countingMethod === 'ONCE_PER_EVENT' ? 'bg-green-400' : 'bg-blue-400'
                  }`} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {event.countingMethod === 'ONCE_PER_EVENT' ? 'Once per event' : 'Once per session'}
                </p>
              </div>
            ))}
          </div>
          
          {/* Key Events Recommendations */}
          {audit.keyEvents.length === 0 && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h6 className="text-sm font-semibold text-red-300">No Key Events Configured</h6>
                  <p className="text-xs text-gray-300 mt-1">
                    Key events help you measure what matters most to your business. Set up at least one key event for proper conversion tracking.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {audit.keyEvents.length > 2 && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h6 className="text-sm font-semibold text-yellow-300">Consider Optimizing Key Events</h6>
                  <p className="text-xs text-gray-300 mt-1">
                    You have {audit.keyEvents.length} key events. Consider focusing on 1-2 primary key events for clearer performance insights.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
