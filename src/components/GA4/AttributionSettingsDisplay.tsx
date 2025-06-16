import React from 'react';
import { TrendingUp, Clock, Target, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';
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
    }> = {
      'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN': {
        name: 'Data-Driven Attribution',
        description: 'Machine learning assigns conversion credit across all touchpoints based on actual user behavior patterns',
        status: 'optimal',
        icon: Zap,
        color: 'text-green-400',
        recommendation: '✅ OPTIMAL: This is the most accurate attribution model available'
      },
      'PAID_AND_ORGANIC_CHANNELS_LAST_CLICK': {
        name: 'Last Click Attribution',
        description: 'All conversion credit goes to the final touchpoint before conversion',
        status: 'legacy',
        icon: Target,
        color: 'text-yellow-400',
        recommendation: '⚠️ LEGACY: Consider upgrading to data-driven for better insights'
      },
      'PAID_AND_ORGANIC_CHANNELS_FIRST_CLICK': {
        name: 'First Click Attribution',
        description: 'All conversion credit goes to the first touchpoint in the customer journey',
        status: 'legacy',
        icon: Target,
        color: 'text-yellow-400',
        recommendation: '⚠️ LEGACY: Misses the impact of nurturing touchpoints'
      },
      'PAID_AND_ORGANIC_CHANNELS_LINEAR': {
        name: 'Linear Attribution',
        description: 'Conversion credit is distributed equally across all touchpoints',
        status: 'basic',
        icon: TrendingUp,
        color: 'text-orange-400',
        recommendation: '⚠️ BASIC: Treats all touchpoints equally, which may not reflect reality'
      },
      'PAID_AND_ORGANIC_CHANNELS_TIME_DECAY': {
        name: 'Time Decay Attribution',
        description: 'More credit to touchpoints closer to the conversion time',
        status: 'basic',
        icon: Clock,
        color: 'text-orange-400',
        recommendation: '⚠️ BASIC: Simple time-based model, upgrade to data-driven recommended'
      },
      'PAID_AND_ORGANIC_CHANNELS_POSITION_BASED': {
        name: 'Position-Based Attribution',
        description: '40% credit each to first and last touchpoints, 20% distributed among middle touchpoints',
        status: 'basic',
        icon: Target,
        color: 'text-orange-400',
        recommendation: '⚠️ BASIC: Arbitrary weighting, data-driven attribution is more accurate'
      }
    };

    return modelMap[model || ''] || {
      name: 'Unknown Model',
      description: 'Attribution model not recognized',
      status: 'basic' as const,
      icon: AlertTriangle,
      color: 'text-red-400',
      recommendation: '❌ UNKNOWN: Check your attribution settings'
    };
  };

  const getLookbackWindowDisplay = (window: string | undefined) => {
    if (!window) return { display: 'Default', description: 'Default setting' };
    
    // Extract number of days from various formats
    const windowStr = window.toString().toUpperCase();
    
    // Handle direct formats
    if (windowStr === 'THIRTY_DAYS') return { display: '30 days', description: 'Standard for most businesses' };
    if (windowStr === 'NINETY_DAYS') return { display: '90 days', description: 'Extended window for longer sales cycles' };
    if (windowStr === 'SEVEN_DAYS') return { display: '7 days', description: 'Short window for quick conversions' };
    if (windowStr === 'ONE_DAY') return { display: '1 day', description: 'Same-day conversions only' };
    
    // Handle API format strings - extract the number
    if (windowStr.includes('90')) return { display: '90 days', description: 'Extended window for longer sales cycles' };
    if (windowStr.includes('30')) return { display: '30 days', description: 'Standard for most businesses' };
    if (windowStr.includes('7')) return { display: '7 days', description: 'Short window for quick conversions' };
    if (windowStr.includes('1')) return { display: '1 day', description: 'Same-day conversions only' };
    
    // Fallback
    return { display: window, description: 'Custom setting' };
  };

  const model = audit.attribution.reportingAttributionModel;
  const modelInfo = model ? getAttributionModelInfo(model) : null;
  
  // Clean up the lookback window values and get display info
  const acquisitionWindowRaw = audit.attribution.acquisitionConversionEventLookbackWindow;
  const otherWindowRaw = audit.attribution.otherConversionEventLookbackWindow;
  
  const acquisitionWindow = getLookbackWindowDisplay(acquisitionWindowRaw || 'THIRTY_DAYS');
  const otherWindow = getLookbackWindowDisplay(otherWindowRaw || 'NINETY_DAYS');
  
  // Determine if this affects paid channels only
  const isPaidChannelsOnly = model?.includes('PAID_AND_ORGANIC_CHANNELS');

  if (!model) {
    return (
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-orange-400" />
          Attribution Model Configuration
        </h3>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-yellow-300 mb-2">Attribution Settings Not Accessible</h4>
          <p className="text-gray-300">
            Attribution model settings require additional API permissions or may not be available via the current API version.
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Check your attribution settings manually in GA4: Admin &gt; Attribution settings
          </p>
        </div>
      </div>
    );
  }

  const ModelIcon = modelInfo!.icon;

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
        <TrendingUp className="w-7 h-7 mr-3 text-orange-400" />
        Attribution Model Configuration
      </h3>
      
      {/* Main Attribution Model */}
      <div className="mb-8">
        <div className={`bg-black/50 rounded-xl p-6 border-2 ${
          modelInfo!.status === 'optimal' ? 'border-green-500/50' : 
          modelInfo!.status === 'legacy' ? 'border-yellow-500/50' : 'border-orange-500/50'
        }`}>
          <div className="flex items-start space-x-4 mb-4">
            <div className={`p-3 rounded-full ${
              modelInfo!.status === 'optimal' ? 'bg-green-500/20' : 
              modelInfo!.status === 'legacy' ? 'bg-yellow-500/20' : 'bg-orange-500/20'
            }`}>
              <ModelIcon className={`w-8 h-8 ${modelInfo!.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white mb-2">{modelInfo!.name}</h4>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">{modelInfo!.description}</p>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                modelInfo!.status === 'optimal' ? 'bg-green-500/20 text-green-300' :
                modelInfo!.status === 'legacy' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-orange-500/20 text-orange-300'
              }`}>
                {modelInfo!.recommendation}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Scope */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-400" />
          Conversion Credit Scope
        </h5>
        <div className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center justify-between">
            <div>
              <h6 className="font-medium text-white mb-1">
                {isPaidChannelsOnly ? 'Paid + Organic Channels Only' : 'All Channels'}
              </h6>
              <p className="text-sm text-gray-300">
                {isPaidChannelsOnly 
                  ? 'Attribution applies to Google Ads paid channels and organic channels. Direct traffic and other paid channels use last-click attribution.'
                  : 'Attribution applies to all traffic sources and marketing channels.'
                }
              </p>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-medium ${
              isPaidChannelsOnly ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
            }`}>
              {isPaidChannelsOnly ? 'Limited Scope' : 'All Channels'}
            </div>
          </div>
          {isPaidChannelsOnly && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
              <p className="text-xs text-yellow-300">
                <strong>Note:</strong> Other traffic sources (social media, email, direct, etc.) still use last-click attribution.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lookback Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/50 rounded-lg p-6 border border-gray-600/50">
          <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-400" />
            Acquisition Lookback
          </h5>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-300 mb-2">{acquisitionWindow.display}</div>
            <p className="text-sm text-gray-300 mb-3">{acquisitionWindow.description}</p>
            <div className="text-xs text-gray-400 bg-black/50 rounded p-2">
              How far back to look for the <strong>first</strong> touchpoint that led to a conversion
            </div>
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-6 border border-gray-600/50">
          <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-green-400" />
            Other Events Lookback
          </h5>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-300 mb-2">{otherWindow.display}</div>
            <p className="text-sm text-gray-300 mb-3">{otherWindow.description}</p>
            <div className="text-xs text-gray-400 bg-black/50 rounded p-2">
              How far back to look for touchpoints that influenced <strong>existing</strong> users to convert
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 bg-black/30 rounded-lg p-6 border border-gray-700/50">
        <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-orange-400" />
          What This Means for Your Business
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h6 className="font-medium text-white mb-2">Google Ads Optimization</h6>
            <p className="text-sm text-gray-300">
              {modelInfo!.status === 'optimal' 
                ? 'Smart Bidding algorithms receive the most accurate conversion data for optimization.'
                : 'Your bidding optimization may be limited by simplified attribution. Consider upgrading to data-driven attribution.'
              }
            </p>
          </div>
          <div>
            <h6 className="font-medium text-white mb-2">Reporting Accuracy</h6>
            <p className="text-sm text-gray-300">
              {modelInfo!.status === 'optimal'
                ? 'Conversion reports reflect the true impact of each marketing touchpoint.'
                : 'Your conversion reports may over-credit or under-credit certain marketing channels.'
              }
            </p>
          </div>
        </div>
        
        {modelInfo!.status !== 'optimal' && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h6 className="font-medium text-yellow-300 mb-1">Upgrade Recommendation</h6>
                <p className="text-sm text-yellow-200">
                  Switch to data-driven attribution in Admin &gt; Attribution settings for more accurate conversion credit 
                  and better Google Ads performance. Data-driven attribution uses machine learning to analyze your specific 
                  customer journey patterns.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
