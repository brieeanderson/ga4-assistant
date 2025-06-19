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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{audit.property.timeZone || 'Not Set'}</div>
          <div className="text-xs text-gray-400 mt-1">Timezone</div>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{audit.property.currencyCode || 'USD'}</div>
          <div className="text-xs text-gray-400 mt-1">Currency</div>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-xs sm:text-sm font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{(audit.property.industryCategory || 'Not Set').replace(/_/g, ' ')}</div>
          <div className="text-xs text-gray-400 mt-1">Industry</div>
        </div>
        
        <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50 text-center">
          <Database className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">{audit.dataStreams.length}</div>
          <div className="text-xs text-gray-400 mt-1">Data Streams</div>
        </div>

        {/* Key Events Card with Warning Logic */}
        <div className={`bg-black/50 rounded-xl p-4 border text-center ${
          audit.keyEvents.length === 0 ? 'border-red-500/50' : 
          audit.keyEvents.length > 2 ? 'border-yellow-500/50' : 
          'border-gray-600/50'
        }`}>
          <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
            audit.keyEvents.length === 0 ? 'text-red-400' : 
            audit.keyEvents.length > 2 ? 'text-yellow-400' : 
            'text-green-400'
          }`} />
          <div className="text-sm sm:text-base font-bold text-white break-words leading-snug min-h-[2.5rem] flex items-center justify-center">
            {audit.keyEvents.length}
            {audit.keyEvents.length === 0 && <AlertTriangle className="w-4 h-4 ml-1 text-red-400" />}
            {audit.keyEvents.length > 2 && <AlertTriangle className="w-4 h-4 ml-1 text-yellow-400" />}
          </div>
          <div className="text-xs text-gray-400 mt-1">Key Events</div>
        </div>
      </div>
    </div>
  );
};
