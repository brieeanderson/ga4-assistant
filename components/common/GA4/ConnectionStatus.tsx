import React from 'react';
import { CheckCircle, LogOut, BarChart3, Shield } from 'lucide-react';
import { GA4Property } from '@/types/ga4';

interface ConnectionStatusProps {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: () => void;
  logout: () => void;
  ga4Properties: GA4Property[];
  selectedProperty: string;
  setSelectedProperty: (propertyId: string) => void;
  isAnalyzing: boolean;
  fetchGA4Properties: () => void;
  runGA4Audit: () => void;
  oauthLoading: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isAuthenticated,
  userEmail,
  login,
  logout,
  ga4Properties,
  selectedProperty,
  setSelectedProperty,
  isAnalyzing,
  fetchGA4Properties,
  runGA4Audit,
  oauthLoading
}) => {
  if (!isAuthenticated) {
    return (
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Connect Your GA4 Account</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Get a complete 30-point GA4 configuration audit that reveals data retention disasters, 
            attribution model problems, and integration failures you didn't know existed.
          </p>
          
          <button
            onClick={login}
            disabled={oauthLoading}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide text-lg shadow-lg shadow-orange-600/25 transform hover:scale-105 disabled:opacity-50"
          >
            {oauthLoading ? 'Connecting...' : 'Audit My GA4 Setup'}
          </button>
          
          <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-gray-400">
            <Shield className="w-4 h-4" />
            <span>Secure OAuth - read-only access - we never store passwords</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">GA4 Account Connected 💪</h3>
            <p className="text-gray-400">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 text-sm group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
        </button>
      </div>

      {ga4Properties.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-300 mb-3">
            Select GA4 Property:
          </label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full border border-gray-600 bg-black/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
          >
            <option value="">Choose a property...</option>
            {ga4Properties.map((property) => (
              <option key={property.propertyId} value={property.propertyId}>
                {property.displayName} ({property.propertyId}) {property.accountName && `- ${property.accountName}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex space-x-4">
        {ga4Properties.length === 0 ? (
          <button
            onClick={fetchGA4Properties}
            disabled={isAnalyzing}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-orange-600/25 transform hover:scale-105"
          >
            {isAnalyzing ? 'Loading Properties...' : 'Load GA4 Properties'}
          </button>
        ) : (
          <button
            onClick={runGA4Audit}
            disabled={!selectedProperty || isAnalyzing}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-bold uppercase tracking-wide disabled:opacity-50 shadow-lg shadow-orange-600/25 transform hover:scale-105"
          >
            {isAnalyzing ? 'Running Configuration Audit...' : 'Run GA4 Configuration Audit'}
          </button>
        )}
      </div>
    </div>
  );
};
