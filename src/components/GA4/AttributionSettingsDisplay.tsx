import React from 'react';
import { TrendingUp, Clock, Target, Zap, AlertTriangle, Info } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface AttributionSettingsDisplayProps {
  audit: GA4Audit;
}

export const AttributionSettingsDisplay: React.FC<AttributionSettingsDisplayProps> = ({ audit }) => {
  const getAttributionModelInfo = (model: string | undefined) => {
    const modelMap: Record<string, {
      name: string;
      description: string;
      status: 'optimal' | 'legacy' | 'basic';
      icon: React.ElementType;
      color: string;
      recommendation: string;
      actionable: string;
    }> = {
      'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN': {
        name: 'Data-Driven Attribution',
        description: 'Uses machine learning to assign credit based on your actual customer behavior patterns.',
        status: 'optimal',
        icon: Zap,
        color: 'text-green-400',
        recommendation: '✅ Optimal Setup',
        actionable: 'Your attribution model is correctly configured for the most accurate conversion tracking and Google Ads optimization.'
      },
      'PAID_AND_ORGANIC_CHANNELS_LAST_CLICK': {
        name: 'Last Click Attribution',
        description: 'Gives all credit to the final touchpoint before conversion.',
        status: 'legacy',
        icon: Target,
        color: 'text-yellow-400',
        recommendation: '⚠️ Legacy Model',
        actionable: 'Consider upgrading to data-driven attribution for more accurate insights and better Google Ads performance.'
      },
      'PAID_AND_ORGANIC_CHANNELS_FIRST_CLICK': {
        name: 'First Click Attribution',
        description: 'Gives all credit to the first touchpoint in the customer journey.',
        status: 'legacy',
        icon: Target,
        color: 'text-yellow-400',
        recommendation: '⚠️ Legacy Model',
        actionable: 'This model misses the impact of nurturing touchpoints. Upgrade to data-driven attribution recommended.'
      },
      'PAID_AND_ORGANIC_CHANNELS_LINEAR': {
        name: 'Linear Attribution',
        description: 'Distributes credit equally across all touchpoints.',
        status: 'basic',
        icon: TrendingUp,
        color: 'text-orange-400',
        recommendation: '⚠️ Basic Model',
        actionable: 'Linear attribution treats all touchpoints equally, which may not reflect reality. Data-driven attribution is recommended.'
      },
      'PAID_AND_ORGANIC_CHANNELS_TIME_DECAY': {
        name: 'Time Decay Attribution',
        description: 'Gives more credit to touchpoints closer to the conversion time.',
        status: 'basic',
        icon: Clock,
        color: 'text-orange-400',
        recommendation: '⚠️ Basic Model',
        actionable: 'While better than linear, data-driven attribution provides more accurate insights than this time-based approach.'
      },
      'PAID_AND_ORGANIC_CHANNELS_POSITION_BASED': {
        name: 'Position-Based Attribution',
        description: '40% credit each to first and last touchpoints, 20% distributed among middle ones.',
        status: 'basic',
        icon: Target,
        color: 'text-orange-400',
        recommendation: '⚠️ Basic Model',
        actionable: 'This arbitrary weighting may not match your actual customer behavior. Data-driven attribution is more accurate.'
      }
    };

    return modelMap[model || ''] || {
      name: 'Unknown Attribution Model',
      description: 'Attribution model not recognized.',
      status: 'basic' as const,
      icon: AlertTriangle,
      color: 'text-red-400',
      recommendation: '❌ Configuration Issue',
      actionable: 'Check your attribution settings manually in GA4: Admin > Attribution settings'
    };
  };

  const getLookbackWindowInfo = (window: string | undefined) => {
    const windowMap: Record<string, { display: string; description: string }> = {
      'THIRTY_DAYS': { display: '30 days', description: 'Standard lookback period' },
      'NINETY_DAYS': { display: '90 days', description: 'Extended lookback period' },
      'SEVEN_DAYS': { display: '7 days', description: 'Short lookback period' },
      'ONE_DAY': { display: '1 day', description: 'Minimal lookback period' }
    };
    
    return windowMap[window] || { display: window || 'Unknown', description: 'Custom setting' };
  };

  const modelInfo = getAttributionModelInfo(audit.attribution.reportingAttributionModel);
  const acquisitionWindow = getLookbackWindowInfo(audit.attribution.acquisitionConversionEventLookbackWindow);
  const otherWindow = getLookbackWindowInfo(audit.attribution.otherConversionEventLookbackWindow);

  if (!audit.attribution.reportingAttributionModel) {
    return (
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-orange-400" />
          Attribution Configuration
        </h3>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-yellow-300 mb-2">Attribution Settings Not Available</h4>
          <p className="text-yellow-200">
            Unable to retrieve attribution settings. This may be due to insufficient permissions or API limitations.
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Check your attribution settings manually in GA4: Admin &gt; Attribution settings
          </p>
        </div>
      </div>
    );
  }

  const ModelIcon = modelInfo.icon;

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
        <TrendingUp className="w-7 h-7 mr-3 text-orange-400" />
        Attribution Configuration
      </h3>
      
      {/* Main Attribution Model - Simplified */}
      <div className="mb-8">
        <div className={`bg-black/50 rounded-xl p-6 border-2 ${
          modelInfo.status === 'optimal' ? 'border-green-500/50' : 
          modelInfo.status === 'legacy' ? 'border-yellow-500/50' : 'border-orange-500/50'
        }`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`p-3 rounded-full ${
              modelInfo.status === 'optimal' ? 'bg-green-500/20' : 
              modelInfo.status === 'legacy' ? 'bg-yellow-500/20' : 'bg-orange-500/20'
            }`}>
              <ModelIcon className={`w-6 h-6 ${modelInfo.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold text-white">{modelInfo.name}</h4>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  modelInfo.status === 'optimal' ? 'bg-green-500/20 text-green-300' :
                  modelInfo.status === 'legacy' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-orange-500/20 text-orange-300'
                }`}>
                  {modelInfo.recommendation}
                </span>
              </div>
              <p className="text-gray-300 mb-3">{modelInfo.description}</p>
              <p className="text-sm text-gray-400">{modelInfo.actionable}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Lookback Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h5 className="font-semibold text-white">First-Time Visitors</h5>
          </div>
          <div className="text-2xl font-bold text-blue-300 mb-1">{acquisitionWindow.display}</div>
          <p className="text-sm text-gray-400">Lookback for new customer conversions</p>
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-5 h-5 text-green-400" />
            <h5 className="font-semibold text-white">Returning Visitors</h5>
          </div>
          <div className="text-2xl font-bold text-green-300 mb-1">{otherWindow.display}</div>
          <p className="text-sm text-gray-400">Lookback for existing customer conversions</p>
        </div>
      </div>

      {/* Actionable Next Steps */}
      {modelInfo.status !== 'optimal' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h6 className="font-semibold text-blue-300 mb-2">How to Upgrade</h6>
              <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
                <li>Go to <strong>Admin &gt; Attribution settings</strong></li>
                <li>Change "Reporting attribution model" to <strong>"Data-driven"</strong></li>
                <li>Keep lookback windows at 30/90 days (recommended defaults)</li>
                <li>Save changes and allow 24-48 hours for the switch to take effect</li>
              </ol>
              <p className="text-xs text-blue-300 mt-3">
                <strong>Impact:</strong> Better conversion tracking accuracy and improved Google Ads Smart Bidding performance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
