import React from 'react';
import { BarChart3, Calendar, DollarSign, Shield, Database } from 'lucide-react';
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
    </div>
  );
};
