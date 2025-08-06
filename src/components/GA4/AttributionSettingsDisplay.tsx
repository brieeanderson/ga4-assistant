import React from 'react';
import { Target, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface AttributionSettingsDisplayProps {
  audit: GA4Audit;
}

export const AttributionSettingsDisplay: React.FC<AttributionSettingsDisplayProps> = ({ audit }) => {
  const getModelInfo = (model: string) => {
    switch (model) {
      case 'CROSS_CHANNEL_DATA_DRIVEN':
        return {
          name: 'Data-driven',
          description: 'Uses machine learning to analyze all touchpoints and assign credit based on actual conversion contribution',
          status: 'optimal',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30'
        };
      case 'CROSS_CHANNEL_LAST_CLICK':
        return {
          name: 'Last click',
          description: 'Gives 100% credit to the last touchpoint before conversion',
          status: 'suboptimal',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        };
      case 'CROSS_CHANNEL_FIRST_CLICK':
        return {
          name: 'First click',
          description: 'Gives 100% credit to the first touchpoint in the conversion path',
          status: 'suboptimal',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        };
      case 'CROSS_CHANNEL_LINEAR':
        return {
          name: 'Linear',
          description: 'Distributes credit equally across all touchpoints in the conversion path',
          status: 'fair',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      case 'CROSS_CHANNEL_POSITION_BASED':
        return {
          name: 'Position-based',
          description: 'Gives 40% credit each to first and last touchpoints, 20% to middle interactions',
          status: 'fair',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      case 'CROSS_CHANNEL_TIME_DECAY':
        return {
          name: 'Time decay',
          description: 'Gives more credit to touchpoints closer to the conversion time',
          status: 'fair',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      default:
        // Convert all-caps/underscores to Title Case with spaces
        const readable = (model || 'Unknown')
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        return {
          name: readable,
          description: 'Attribution model not recognized',
          status: 'unknown',
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const formatLookbackWindow = (window: string) => {
    switch (window) {
      case 'CONVERSION_EVENT_LOOKBACK_WINDOW_1_DAY':
        return '1 day';
      case 'CONVERSION_EVENT_LOOKBACK_WINDOW_7_DAYS':
        return '7 days';
      case 'CONVERSION_EVENT_LOOKBACK_WINDOW_30_DAYS':
        return '30 days';
      case 'CONVERSION_EVENT_LOOKBACK_WINDOW_90_DAYS':
        return '90 days';
      default:
        // Convert all-caps/underscores to Title Case with spaces
        return (window || 'Not set')
          .toLowerCase()
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
    }
  };

  const currentModel = getModelInfo(audit.attribution.reportingAttributionModel ?? "");
  const acquisitionWindow = formatLookbackWindow(audit.attribution.acquisitionConversionEventLookbackWindow ?? "");
  const otherWindow = formatLookbackWindow(audit.attribution.otherConversionEventLookbackWindow ?? "");

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Target className="w-7 h-7 mr-3 text-orange-400" />
        Attribution Model & Conversion Windows
      </h3>
      
      <p className="text-gray-300 mb-8">
        Attribution settings determine how conversion credit is distributed across touchpoints in the customer journey.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attribution Model */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
            Attribution Model
          </h4>
          
          <div className={`p-6 rounded-xl border ${currentModel.borderColor} ${currentModel.bgColor}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className="text-lg font-semibold text-white mb-2">{currentModel.name}</h5>
                <p className="text-sm text-gray-300">{currentModel.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {currentModel.status === 'optimal' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {currentModel.status === 'suboptimal' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  currentModel.status === 'optimal' ? 'bg-green-500/20 text-green-300' :
                  currentModel.status === 'suboptimal' ? 'bg-yellow-500/20 text-yellow-300' :
                  currentModel.status === 'fair' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {currentModel.status}
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-black/30 rounded border border-gray-600/50">
              <p className="text-xs text-gray-500 mb-1">Admin Location:</p>
              <p className="text-xs text-gray-300">Admin &gt; Events &gt; Attribution settings</p>
            </div>
          </div>

          {/* Attribution Recommendations */}
          <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
            <h6 className="font-semibold text-orange-300 mb-2">💡 Attribution Recommendations</h6>
            {currentModel.status === 'optimal' ? (
              <p className="text-sm text-gray-300">
                Data-driven attribution is the most accurate model for understanding true conversion contribution.
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                Consider switching to <strong>Data-driven attribution</strong> for more accurate conversion credit assignment based on your actual customer behavior patterns.
              </p>
            )}
          </div>
        </div>

        {/* Conversion Windows */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-green-400" />
            Conversion Windows
          </h4>
          
          <div className="space-y-4">
            {/* Acquisition Window */}
            <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-white">Acquisition Events</h5>
                <span className="text-lg font-bold text-green-400">{acquisitionWindow}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Time window for first-time conversion attribution (new customers)
              </p>
              <div className="p-2 bg-green-900/20 border border-green-600/30 rounded text-xs text-green-300">
                <strong>What this means:</strong> GA4 will look back {acquisitionWindow} from a conversion to find the first interaction that led to this new customer.
              </div>
            </div>

            {/* Other Conversions Window */}
            <div className="bg-black/50 rounded-xl p-4 border border-gray-600/50">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-white">Other Conversions</h5>
                <span className="text-lg font-bold text-blue-400">{otherWindow}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Time window for repeat conversion attribution (existing customers)
              </p>
              <div className="p-2 bg-blue-900/20 border border-blue-600/30 rounded text-xs text-blue-300">
                <strong>What this means:</strong> GA4 will look back {otherWindow} from a conversion to attribute credit to touchpoints for returning customers.
              </div>
            </div>
          </div>

          {/* Window Recommendations */}
          <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
            <h6 className="font-semibold text-orange-300 mb-2">⏰ Window Recommendations</h6>
            <div className="space-y-2 text-sm text-gray-300">
              <div>
                <strong>Acquisition:</strong> {acquisitionWindow === '30 days' ? 
                  '✅ Good default for most businesses' : 
                  '30 days recommended for most businesses (current: ' + acquisitionWindow + ')'
                }
              </div>
              <div>
                <strong>Other:</strong> {otherWindow === '7 days' ? 
                  '✅ Good for frequent purchase cycles' : 
                  'Consider 7-30 days based on your purchase cycle (current: ' + otherWindow + ')'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attribution Impact Explanation */}
      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-600/30 rounded-lg">
        <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          How Attribution Settings Affect Your Reports
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-blue-200 mb-2">Attribution Model Impact:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• Changes conversion credit distribution</li>
              <li>• Affects channel performance reporting</li>
              <li>• Influences Google Ads bid optimization</li>
              <li>• Impacts audience building for remarketing</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-200 mb-2">Conversion Windows Impact:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• Determines attribution lookback period</li>
              <li>• Affects conversion reporting accuracy</li>
              <li>• Influences customer journey analysis</li>
              <li>• Impacts cross-channel attribution</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Path Reference */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded border border-gray-600/50">
        <p className="text-xs text-gray-400 mb-1">
          <strong>Admin Location:</strong> Admin &gt; Attribution Settings
        </p>
        <p className="text-xs text-gray-300">
          Changes to attribution settings affect only future data, not historical reports.
        </p>
      </div>
    </div>
  );
};
