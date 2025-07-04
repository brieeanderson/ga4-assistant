import React, { useState } from 'react';
import {
  TrendingUp,
  Settings,
  Target,
  Link,
  Shield,
  Database,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Zap,
  Globe,
  Search,
  Activity,
  Clock,
  DollarSign,
  RefreshCw,
  Sparkles,
  LineChart
} from 'lucide-react';

// Add prop types
interface GA4DashboardProps {
  auditData: any; // Replace 'any' with your GA4Audit type if available
  property: any;
  onChangeProperty: () => void;
}

const GA4Dashboard: React.FC<GA4DashboardProps> = ({ auditData, property, onChangeProperty }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, color: 'orange' },
    { id: 'configuration', label: 'Configuration', icon: Settings, color: 'orange' },
    { id: 'events', label: 'Events & Tracking', icon: Target, color: 'orange' },
    { id: 'attribution', label: 'Attribution', icon: LineChart, color: 'orange' },
    { id: 'integrations', label: 'Integrations', icon: Link, color: 'orange' },
    { id: 'recommendations', label: 'Recommendations', icon: Shield, color: 'orange' }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Configuration Score Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-4 border-slate-700 mb-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {auditData?.configScore}%
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Configuration Score</h2>
          <p className="text-lg text-slate-400">Your GA4 setup is <span className={getScoreColor(auditData?.configScore)}>
            {auditData?.configScore >= 80 ? 'well configured' : 
             auditData?.configScore >= 60 ? 'needs improvement' : 'needs attention'}
          </span></p>
        </div>

        {/* Score Breakdown - You may want to calculate these from auditData if available */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="text-2xl font-bold text-green-400 mb-1">90%</div>
            <div className="text-sm text-slate-400">Property Settings</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400 mb-1">75%</div>
            <div className="text-sm text-slate-400">Data Collection</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="text-2xl font-bold text-green-400 mb-1">85%</div>
            <div className="text-sm text-slate-400">Key Events</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="text-2xl font-bold text-red-400 mb-1">50%</div>
            <div className="text-sm text-slate-400">Integrations</div>
          </div>
        </div>
      </div>

      {/* Critical Issues - Score Killers */}
      {/* You may want to generate these from auditData if available */}
      {/* ... keep the rest of the code, just replace mockAuditData with auditData ... */}
    </div>
  );

  const renderConfigurationTab = () => (
    <div className="space-y-8">
      {/* Property Info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Settings className="w-7 h-7 mr-3 text-purple-400" />
          Property Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">Property Name</div>
            <div className="text-white font-semibold">{auditData?.property?.displayName}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">Time Zone</div>
            <div className="text-white font-semibold">{auditData?.property?.timeZone}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">Currency</div>
            <div className="text-white font-semibold">{auditData?.property?.currencyCode}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-sm text-slate-400 mb-2">Industry</div>
            <div className="text-white font-semibold">{auditData?.property?.industryCategory}</div>
          </div>
        </div>
      </div>
      {/* Enhanced Measurement */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-7 h-7 mr-3 text-yellow-400" />
          Enhanced Measurement Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {auditData?.enhancedMeasurement && auditData.enhancedMeasurement[0] && Object.entries(auditData.enhancedMeasurement[0].settings).map(([key, value]) => {
            if (key === 'streamEnabled') return null;
            return (
              <div key={key} className={`p-4 rounded-xl border transition-all duration-200 ${
                value ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Enabled', '')}
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    value ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {value ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Custom Definitions */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Database className="w-7 h-7 mr-3 text-blue-400" />
          Custom Definitions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Custom Dimensions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Custom Dimensions</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">{auditData?.customDimensions?.length || 0}/50</span>
                <div className="w-16 bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${((auditData?.customDimensions?.length || 0) / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {auditData?.customDimensions?.map((dimension: any, index: number) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">{dimension.displayName}</div>
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                      {dimension.scope}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Parameter: <code className="bg-slate-700 px-2 py-1 rounded text-orange-300">{dimension.parameterName}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Custom Metrics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Custom Metrics</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">{auditData?.customMetrics?.length || 0}/50</span>
                <div className="w-16 bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${((auditData?.customMetrics?.length || 0) / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {auditData?.customMetrics?.map((metric: any, index: number) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white">{metric.displayName}</div>
                    <div className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {metric.scope}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">
                    Parameter: <code className="bg-slate-700 px-2 py-1 rounded text-orange-300">{metric.parameterName}</code>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Unit: {metric.unitOfMeasurement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-8">
      {/* Key Events */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="w-7 h-7 mr-3 text-green-400" />
          Key Events (Conversions)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auditData?.keyEvents?.map((event: any, index: number) => (
            <div key={index} className="p-6 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-xs text-green-300">
                  {event.createTime ? new Date(event.createTime).toLocaleDateString() : ''}
                </div>
              </div>
              <div className="text-lg font-semibold text-white mb-2">{event.eventName}</div>
              <div className="text-sm text-slate-400">Conversion event configured</div>
            </div>
          ))}
        </div>
      </div>
      {/* Enhanced Measurement Breakdown */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Activity className="w-7 h-7 mr-3 text-blue-400" />
          Enhanced Measurement Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auditData?.enhancedMeasurement && auditData.enhancedMeasurement[0] && Object.entries(auditData.enhancedMeasurement[0].settings).map(([key, value]) => {
            if (key === 'streamEnabled') return null;
            const icons: any = {
              scrollsEnabled: Activity,
              outboundClicksEnabled: ExternalLink,
              siteSearchEnabled: Search,
              videoEngagementEnabled: Target,
              fileDownloadsEnabled: Database,
              formInteractionsEnabled: Settings,
              pageChangesEnabled: Globe
            };
            const IconComponent = icons[key] || Activity;
            return (
              <div key={key} className={`p-6 rounded-xl border transition-all duration-200 ${
                value ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${value ? 'bg-green-500/20' : 'bg-red-500/20'}`}> <IconComponent className={`w-5 h-5 ${value ? 'text-green-400' : 'text-red-400'}`} /> </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{value ? 'Enabled' : 'Disabled'}</div>
                </div>
                <div className="text-lg font-semibold text-white mb-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Enabled', '')}</div>
                <div className="text-sm text-slate-400">{value ? 'Automatically tracking this event type' : 'Not configured - missing valuable data'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAttributionTab = () => {
    const formatAttributionModel = (model: string) => {
      const models: any = {
        'DATA_DRIVEN': {
          name: 'Data-Driven Attribution',
          description: 'Uses machine learning to analyze all interactions and assign credit based on actual conversion patterns',
          status: 'optimal',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        },
        'LAST_CLICK': {
          name: 'Last Click Attribution',
          description: 'Gives all credit to the last interaction before conversion',
          status: 'suboptimal',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        },
        'FIRST_CLICK': {
          name: 'First Click Attribution',
          description: 'Gives all credit to the first interaction in the customer journey',
          status: 'suboptimal',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        },
        'LINEAR': {
          name: 'Linear Attribution',
          description: 'Distributes credit equally across all touchpoints',
          status: 'fair',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        }
      };
      return models[model] || models['DATA_DRIVEN'];
    };
    const formatLookbackWindow = (window: string) => {
      const windows: any = {
        'ACQUISITION_CONVERSION_EVENT_LOOKBACK_WINDOW_1_DAY': '1 day',
        'ACQUISITION_CONVERSION_EVENT_LOOKBACK_WINDOW_7_DAYS': '7 days',
        'ACQUISITION_CONVERSION_EVENT_LOOKBACK_WINDOW_30_DAYS': '30 days',
        'ACQUISITION_CONVERSION_EVENT_LOOKBACK_WINDOW_90_DAYS': '90 days',
        'OTHER_CONVERSION_EVENT_LOOKBACK_WINDOW_1_DAY': '1 day',
        'OTHER_CONVERSION_EVENT_LOOKBACK_WINDOW_7_DAYS': '7 days',
        'OTHER_CONVERSION_EVENT_LOOKBACK_WINDOW_30_DAYS': '30 days',
        'OTHER_CONVERSION_EVENT_LOOKBACK_WINDOW_90_DAYS': '90 days',
        'CONVERSION_EVENT_LOOKBACK_WINDOW_1_DAY': '1 day',
        'CONVERSION_EVENT_LOOKBACK_WINDOW_7_DAYS': '7 days',
        'CONVERSION_EVENT_LOOKBACK_WINDOW_30_DAYS': '30 days',
        'CONVERSION_EVENT_LOOKBACK_WINDOW_90_DAYS': '90 days'
      };
      return windows[window] || window;
    };
    const formatChannelCredit = (channelCredit: string) => {
      const channels: any = {
        'PAID_AND_ORGANIC': {
          name: 'Paid and Organic',
          description: 'Both paid and organic channels can receive conversion credit',
          status: 'optimal',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        },
        'PAID_ONLY': {
          name: 'Paid Only',
          description: 'Only paid channels can receive conversion credit',
          status: 'warning',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        },
        'ORGANIC_ONLY': {
          name: 'Organic Only',
          description: 'Only organic channels can receive conversion credit',
          status: 'warning',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        }
      };
      return channels[channelCredit] || channels['PAID_AND_ORGANIC'];
    };
    const attributionModel = formatAttributionModel(auditData?.attribution?.reportingAttributionModel);
    const acquisitionWindow = formatLookbackWindow(auditData?.attribution?.acquisitionConversionEventLookbackWindow);
    const otherWindow = formatLookbackWindow(auditData?.attribution?.otherConversionEventLookbackWindow);
    const channelCredit = formatChannelCredit(auditData?.attribution?.channelsThatCanReceiveCredit);
    return (
      <div className="space-y-8">
        {/* Attribution Model & Settings */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <LineChart className="w-7 h-7 mr-3 text-teal-400" />
            Attribution Configuration
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Attribution Model */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Attribution Model
                </h4>
                <div className={`p-6 rounded-xl border ${attributionModel.borderColor} ${attributionModel.bgColor}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-2">{attributionModel.name}</h5>
                      <p className="text-sm text-slate-300">{attributionModel.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {attributionModel.status === 'optimal' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {attributionModel.status === 'suboptimal' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                      {attributionModel.status === 'fair' && <Activity className="w-5 h-5 text-blue-400" />}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded border border-slate-600/50">
                    <p className="text-xs text-slate-400 mb-1">Admin Location:</p>
                    <p className="text-xs text-slate-300">Admin → Attribution Settings → Attribution models</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Conversion Windows */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-400" />
                  Conversion Windows
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Acquisition Events</span>
                      <span className="text-lg font-bold text-green-400">{acquisitionWindow}</span>
                    </div>
                    <p className="text-xs text-slate-400">Attribution window for first-time conversions</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Other Conversions</span>
                      <span className="text-lg font-bold text-blue-400">{otherWindow}</span>
                    </div>
                    <p className="text-xs text-slate-400">Attribution window for repeat conversions</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-600/50">
                  <p className="text-xs text-slate-400 mb-1">Admin Location:</p>
                  <p className="text-xs text-slate-300">Admin → Attribution Settings → Conversion windows</p>
                </div>
              </div>
            </div>
            {/* Channel Credit Settings */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-400" />
                  Channel Credit
                </h4>
                <div className={`p-6 rounded-xl border ${channelCredit.borderColor} ${channelCredit.bgColor}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-2">{channelCredit.name}</h5>
                      <p className="text-sm text-slate-300">{channelCredit.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {channelCredit.status === 'optimal' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {channelCredit.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                    </div>
                  </div>
                  <div className="p-3 bg-orange-900/20 border border-orange-600/30 rounded">
                    <p className="text-xs text-orange-300 mb-1">Impact:</p>
                    <p className="text-xs text-slate-300">Affects web conversions shared with Google Ads</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-600/50">
                  <p className="text-xs text-slate-400 mb-1">Admin Location:</p>
                  <p className="text-xs text-slate-300">Admin → Attribution Settings → Channels that can receive credit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Attribution Insights (optional) */}
        {auditData?.attributionInsights && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="w-7 h-7 mr-3 text-yellow-400" />
              Attribution Insights
            </h3>
            {/* Top Converting Paths */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Top Converting Paths</h4>
              <div className="space-y-3">
                {auditData.attributionInsights.topConvertingPaths?.map((path: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{path.path}</div>
                      <div className="text-xs text-slate-400">Conversions: {path.conversions} | Value: ${path.conversionValue} | {path.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Channel Contribution */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Channel Contribution</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-slate-300">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left">Channel</th>
                      <th className="px-2 py-1">First Click</th>
                      <th className="px-2 py-1">Last Click</th>
                      <th className="px-2 py-1">Data Driven</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditData.attributionInsights.channelContribution?.map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-700">
                        <td className="px-2 py-1 font-medium text-white">{row.channel}</td>
                        <td className="px-2 py-1">{row.firstClick}%</td>
                        <td className="px-2 py-1">{row.lastClick}%</td>
                        <td className="px-2 py-1">{row.datadriven}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderIntegrationsTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Search className="w-6 h-6 text-green-400" />
            </div>
            <div className="px-3 py-1 bg-green-500 rounded-full text-white text-sm font-medium">
              {auditData?.searchConsoleDataStatus?.isLinked ? 'Connected' : 'Not Linked'}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Search Console</h3>
          <p className="text-sm text-green-200 mb-4">{auditData?.searchConsoleDataStatus?.hasData ? 'Organic search data flowing' : 'No data yet'}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-300">Clicks</span>
              <span className="text-white font-medium">{auditData?.searchConsoleDataStatus?.totalClicks?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-300">Impressions</span>
              <span className="text-white font-medium">{auditData?.searchConsoleDataStatus?.totalImpressions?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm font-medium">
              {auditData?.googleAdsLinks?.length > 0 ? 'Connected' : 'Not Linked'}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Google Ads</h3>
          <p className="text-sm text-blue-200 mb-4">{auditData?.googleAdsLinks?.length > 0 ? 'Conversion tracking active' : 'No Google Ads accounts linked.'}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Accounts</span>
              <span className="text-white font-medium">{auditData?.googleAdsLinks?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">Conversions</span>
              <span className="text-white font-medium">{auditData?.googleAdsLinks?.length > 0 ? 'Importing' : 'Not importing'}</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div className="px-3 py-1 bg-purple-500 rounded-full text-white text-sm font-medium">
              {auditData?.bigQueryLinks?.length > 0 ? 'Connected' : 'Not Linked'}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">BigQuery</h3>
          <p className="text-sm text-purple-200 mb-4">{auditData?.bigQueryLinks?.length > 0 ? 'Raw data export enabled' : 'Not enabled - consider for advanced analysis and custom reporting needs.'}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Exports</span>
              <span className="text-white font-medium">{auditData?.bigQueryLinks?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Status</span>
              <span className="text-white font-medium">{auditData?.bigQueryLinks?.length > 0 ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-8">
      {/* Priority Recommendations */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Shield className="w-7 h-7 mr-3 text-orange-400" />
          Priority Recommendations
        </h3>
        <div className="space-y-4">
          {/* Example: You may want to generate these from auditData if available */}
          <div className="p-6 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-white">Enable Site Search Tracking</h4>
                  <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm">Critical</div>
                </div>
                <p className="text-sm text-slate-400 mb-3">Site search tracking is disabled, missing valuable user intent data</p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">Learn More</button>
                  <span className="text-xs text-slate-500">Admin → Data Settings → Enhanced Measurement</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-white">Configure Form Interactions</h4>
                  <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">Important</div>
                </div>
                <p className="text-sm text-slate-400 mb-3">Form interaction tracking is disabled, limiting conversion funnel insights</p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors">Learn More</button>
                  <span className="text-xs text-slate-500">Admin → Data Settings → Enhanced Measurement</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-white">Add Custom Event Parameters</h4>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">Enhancement</div>
                </div>
                <p className="text-sm text-slate-400 mb-3">Consider adding custom parameters to track specific business metrics</p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">Learn More</button>
                  <span className="text-xs text-slate-500">Admin → Custom Definitions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">GA4Helper</span>
                <span className="text-white ml-2">Dashboard</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {property?.displayName} • {property?.timeZone || auditData?.property?.timeZone}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(auditData?.configScore)}`}>
                  {auditData?.configScore}%
                </div>
                <div className="text-sm text-gray-400">Config Score</div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200" onClick={onChangeProperty}>
                Change Property
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'configuration' && renderConfigurationTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'attribution' && renderAttributionTab()}
        {activeTab === 'integrations' && renderIntegrationsTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}
      </div>
    </div>
  );
};

export default GA4Dashboard; 