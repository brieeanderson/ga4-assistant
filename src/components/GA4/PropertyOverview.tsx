import React from 'react';
import { BarChart3, Calendar, DollarSign, Shield, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface PropertyOverviewProps {
  audit: GA4Audit;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({ audit }) => {
  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h4 className="text-xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-3 text-orange-400" />
        Property Overview: {audit.property.displayName}
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{audit.property.timeZone || 'Not Set'}</div>
          <div className="text-xs text-gray-400">Timezone</div>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{audit.property.currencyCode || 'USD'}</div>
          <div className="text-xs text-gray-400">Currency</div>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{audit.property.industryCategory || 'Not Set'}</div>
          <div className="text-xs text-gray-400">Industry</div>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <Database className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{audit.dataStreams.length}</div>
          <div className="text-xs text-gray-400">Data Streams</div>
        </div>

        {/* Key Events Card with Warning Logic */}
        <div className={`bg-black/50 rounded-xl p-4 border text-center ${
          audit.keyEvents.length === 0 ? 'border-red-500/50' : 
          audit.keyEvents.length > 2 ? 'border-yellow-500/50' : 'border-gray-600/50'
        }`}>
          <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
            audit.keyEvents.length === 0 ? 'text-red-400' : 
            audit.keyEvents.length > 2 ? 'text-yellow-400' : 'text-green-400'
          }`} />
          <div className={`text-lg font-bold ${
            audit.keyEvents.length === 0 ? 'text-red-400' : 
            audit.keyEvents.length > 2 ? 'text-yellow-400' : 'text-white'
          }`}>
            {audit.keyEvents.length}
          </div>
          <div className="text-xs text-gray-400">Key Events</div>
          {audit.keyEvents.length > 2 && (
            <div className="text-xs text-yellow-300 mt-1">⚠️ Too Many</div>
          )}
        </div>
      </div>
      
      {/* Data Streams List */}
      <div className="mt-6">
        <h5 className="text-sm font-semibold text-gray-300 mb-3">Active Data Streams:</h5>
        <div className="space-y-2">
          {audit.dataStreams.map((stream, index) => (
            <div key={index} className="bg-black/30 rounded-lg p-3 border border-gray-700/50 flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{stream.displayName}</span>
                {stream.webStreamData && (
                  <span className="text-gray-400 text-sm ml-2">({stream.webStreamData.defaultUri})</span>
                )}
              </div>
              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                {stream.type.replace('_DATA_STREAM', '')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Events Warning */}
      {audit.keyEvents.length > 2 && (
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h6 className="font-semibold text-yellow-300 mb-1">Too Many Key Events Warning</h6>
              <p className="text-sm text-yellow-200">
                You have {audit.keyEvents.length} key events configured. Having more than 2 key events can skew your data 
                because GA4 lumps them together in reports. Consider focusing on your most important 1-2 business goals.
              </p>
              <p className="text-xs text-yellow-300 mt-2">
                <strong>Current Key Events:</strong> {audit.keyEvents.map(e => e.eventName).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Key Events Warning */}
      {audit.keyEvents.length === 0 && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h6 className="font-semibold text-red-300 mb-1">No Key Events Configured - Critical Issue</h6>
              <p className="text-sm text-red-200">
                You have no key events (conversions) set up, which means you can't measure business success or optimize marketing campaigns. 
                Set up key events for purchases, sign-ups, downloads, and other important actions.
              </p>
              <p className="text-xs text-red-300 mt-2">
                <strong>Action Required:</strong> Go to Admin > Events > Mark events as key events
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
