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
  LineChart
} from 'lucide-react';
import { GA4Audit, DataStream, CustomDimension, CustomMetric, KeyEvent } from '@/types/ga4';

// Add prop types
interface GA4DashboardProps {
  auditData: GA4Audit;
  property: any;
  onChangeProperty: () => void;
}

const generateRecommendations = (auditData: GA4Audit) => {
  const recs = [];
  // 1. Timezone
  if (!auditData?.property?.timeZone) {
    recs.push({
      title: 'Set timezone',
      description: 'Timezone is not set. Keep timezones consistent across marketing platforms for accurate attribution.',
      severity: 'critical',
      docsUrl: 'https://support.google.com/analytics/answer/9304153?hl=en'
    });
  }
  // 2. Currency
  if (!auditData?.property?.currencyCode) {
    recs.push({
      title: 'Set currency',
      description: 'Currency is not set. GA4 defaults to USD and converts all transactions based on daily rates.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/9796179?hl=en'
    });
  }
  // 3. Industry category
  if (!auditData?.property?.industryCategory) {
    recs.push({
      title: 'Set industry category',
      description: 'Industry category is not set. Used for benchmarking and improves machine learning predictions.',
      severity: 'important',
      deduction: -5,
      docsUrl: 'https://support.google.com/analytics/answer/13771577?hl=en'
    });
  }
  // 4. Data retention
  if (auditData?.dataRetention?.eventDataRetention !== 'FOURTEEN_MONTHS') {
    recs.push({
      title: 'Set data retention period',
      description: 'Set to 14 months (max available). Default is only 2 months!',
      severity: 'critical',
      deduction: -20,
      docsUrl: 'https://support.google.com/analytics/answer/7667196?hl=en'
    });
  }
  // 5. PII redaction
  if (auditData?.audit?.dataCollection?.piiRedaction?.status !== 'good') {
    recs.push({
      title: 'Redact PII from URLs',
      description: 'Remove email addresses, phone numbers from URL parameters for GDPR compliance.',
      severity: 'critical',
      docsUrl: 'https://support.google.com/analytics/answer/13544947?sjid=1431056984149397764-NC'
    });
  }
  // 6. Cross-domain tracking
  if (!auditData?.dataStreams?.some((s: DataStream) => s.crossDomainSettings && s.crossDomainSettings.domains && s.crossDomainSettings.domains.length > 0)) {
    recs.push({
      title: 'Complete cross domain tracking',
      description: 'Essential for multi-domain businesses.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/10071811?hl=en'
    });
  }
  // 7. Unwanted referrals
  if (!auditData?.dataQuality?.trafficSources?.unwantedReferrals || !auditData.dataQuality.trafficSources.unwantedReferrals.detected) {
    recs.push({
      title: 'Define unwanted referrals',
      description: 'Exclude payment processors (PayPal, Stripe) from referrals.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/10327750?hl=en'
    });
  }
  // 8. IP filters
  if (!auditData?.dataFilters || auditData.dataFilters.length === 0) {
    recs.push({
      title: 'Create Data Filters',
      description: 'Filter out office/employee traffic and unwanted referrals for accurate data.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/13296761?hl=en'
    });
  }
  // 9. Session timeout
  if (auditData?.dataStreams && auditData.dataStreams.some((s: DataStream) => s.sessionTimeout && s.sessionTimeout !== 1800)) {
    recs.push({
      title: 'Adjust session timeout',
      description: 'Default is 30 minutes. Lower values can cause a lot of (not set) data.',
      severity: 'info',
      docsUrl: 'https://support.google.com/analytics/answer/12131703?hl=en'
    });
  }
  // 10. Google Signals
  if (!auditData?.googleSignals || auditData.googleSignals.state !== 'GOOGLE_SIGNALS_ENABLED') {
    recs.push({
      title: 'Configure Google Signals',
      description: 'Enables demographics but may cause data thresholding and require extra privacy policies.',
      severity: 'info',
      docsUrl: 'https://support.google.com/analytics/answer/9445345?hl=en'
    });
  }
  // 11. Enhanced measurement
  if (!auditData?.enhancedMeasurement || auditData.enhancedMeasurement.length === 0) {
    recs.push({
      title: 'Enable enhanced measurement',
      description: 'Select events to track automatically: Page views, scrolls, outbound clicks, site search, video, file downloads, form interactions, history changes.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/9216061?hl=en'
    });
  }
  // 12. Site search
  if (auditData?.enhancedMeasurement && auditData.enhancedMeasurement[0] && auditData.enhancedMeasurement[0].settings && !auditData.enhancedMeasurement[0].settings.siteSearchEnabled) {
    recs.push({
      title: 'Double check site search parameters',
      description: 'Default parameters: q, s, search, query, keyword.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/9216061?hl=en'
    });
  }
  // 13. Key events
  if (!auditData?.keyEvents || auditData.keyEvents.length === 0) {
    recs.push({
      title: 'Set key events',
      description: 'You must have at least one key event (conversion) to access attribution data.',
      severity: 'critical',
      deduction: -20
    });
  } else if (auditData.keyEvents.length > 2) {
    recs.push({
      title: 'Reduce key events',
      description: 'Too many key events (more than 2) can reduce clarity in reporting.',
      severity: 'info',
      deduction: -10
    });
  }
  // 14. Custom dimensions
  if (!auditData?.customDimensions || auditData.customDimensions.length === 0) {
    recs.push({
      title: 'Define custom dimensions',
      description: 'Register event parameters as custom dimensions to use in reports.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/14240153?hl=en'
    });
  }
  // 15. Custom metrics
  if (!auditData?.customMetrics || auditData.customMetrics.length === 0) {
    recs.push({
      title: 'Create custom metrics',
      description: 'Define calculated metrics important to your business.',
      severity: 'info',
      docsUrl: 'https://support.google.com/analytics/answer/14239619?sjid=1431056984149397764-NC#zippy=%2Canalyze-the-metric-in-a-report%2Canalyze-the-metric-in-an-exploration'
    });
  }
  // 16. Google Ads link
  if (!auditData?.googleAdsLinks || auditData.googleAdsLinks.length === 0) {
    recs.push({
      title: 'Connect Google Ads',
      description: 'Import key events as Google Ads conversions for bidding.',
      severity: 'critical',
      deduction: -20,
      docsUrl: 'https://support.google.com/analytics/answer/9379420?hl=en'
    });
  }
  // 17. Search Console link
  if (!auditData?.searchConsoleDataStatus || !auditData.searchConsoleDataStatus.isLinked) {
    recs.push({
      title: 'Connect Search Console',
      description: 'Enable Search Console collection in Reports > Library after linking.',
      severity: 'important',
      deduction: -5,
      docsUrl: 'https://support.google.com/analytics/answer/10737381?hl=en'
    });
  }
  // 18. BigQuery link
  if (!auditData?.bigQueryLinks || auditData.bigQueryLinks.length === 0) {
    recs.push({
      title: 'Connect BigQuery',
      description: 'Enables advanced analysis and custom reporting needs.',
      severity: 'info',
      deduction: -5,
      docsUrl: 'https://support.google.com/analytics/answer/9358801?hl=en'
    });
  }
  // 19. Attribution channel (if available)
  if (auditData?.attribution && (auditData.attribution as any).channelsThatCanReceiveCredit !== 'PAID_AND_ORGANIC') {
    recs.push({
      title: 'Set channel credit to Paid and Organic',
      description: 'Affects web conversions shared with Google Ads.',
      severity: 'important',
      deduction: -10,
      docsUrl: 'https://support.google.com/analytics/answer/10597962?hl=en'
    });
  }
  // 20. Enhanced measurement parameters (form/video)
  if (auditData?.enhancedMeasurement && auditData.enhancedMeasurement[0]) {
    const settings = auditData.enhancedMeasurement[0].settings;
    if (settings.formInteractionsEnabled && !auditData.customDimensions?.some((d: CustomDimension) => d.parameterName === 'form_id' || d.parameterName === 'form_name')) {
      recs.push({
        title: 'Register form parameters',
        description: 'Register form_id and form_name as custom dimensions.',
        severity: 'important',
        deduction: -10,
        docsUrl: 'https://support.google.com/analytics/answer/9216061?hl=en'
      });
    }
    if (settings.videoEngagementEnabled && !auditData.customDimensions?.some((d: CustomDimension) => d.parameterName === 'video_percent' || d.parameterName === 'video_duration')) {
      recs.push({
        title: 'Register video parameters',
        description: 'Register video_percent and video_duration as custom dimensions.',
        severity: 'info',
        deduction: -5,
        docsUrl: 'https://support.google.com/analytics/answer/9216061?hl=en'
      });
    }
  }
  return recs;
};

const GA4Dashboard: React.FC<GA4DashboardProps> = ({ auditData, property, onChangeProperty }) => {
  // Debug: Log the auditData every time the dashboard renders
  console.log('GA4Dashboard auditData:', auditData);

  const [activeTab, setActiveTab] = useState('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'events', label: 'Events & Tracking', icon: Target },
    { id: 'attribution', label: 'Attribution', icon: LineChart },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'customizations', label: 'Customizations', icon: Database },
    { id: 'recommendations', label: 'Recommendations', icon: Shield }
  ];

  const recommendations = generateRecommendations(auditData);
  const topRecommendations = recommendations.filter(r => r.severity === 'critical' || r.severity === 'important').slice(0, 5);

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

        {/* Top Recommendations */}
        {topRecommendations.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-7 h-7 mr-3 text-orange-400" />
              Priority Recommendations
            </h3>
            <div className="space-y-4">
              {topRecommendations.map((rec, idx) => (
                <div key={idx} className={`p-6 rounded-xl border ${rec.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : rec.severity === 'important' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${rec.severity === 'critical' ? 'bg-red-500/20' : rec.severity === 'important' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                      <AlertTriangle className={`w-5 h-5 ${rec.severity === 'critical' ? 'text-red-400' : rec.severity === 'important' ? 'text-yellow-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">{rec.title}</h4>
                        {rec.severity === 'critical' && <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm">Critical</div>}
                        {rec.severity === 'important' && <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">Important</div>}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{rec.description}</p>
                      {rec.docsUrl && <a href={rec.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline">Learn more</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
      {/* Data Retention */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-orange-400" />
          Data Retention
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.dataRetention?.eventDataRetention === 'FOURTEEN_MONTHS' ? '14 months' : auditData?.dataRetention?.eventDataRetention === 'TWO_MONTHS' ? '2 months' : 'Unknown'}</div>
        <div className="text-sm text-slate-400 mt-2">Controls how long event-level data is available for analysis. <span className="font-semibold">Recommended: 14 months</span></div>
      </div>
      {/* Cross-Domain Tracking */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-400" />
          Cross-Domain Tracking
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.dataStreams?.some((s: DataStream) => s.crossDomainSettings && s.crossDomainSettings.domains && s.crossDomainSettings.domains.length > 0) ? 'Configured' : 'Not Configured'}</div>
        <div className="text-sm text-slate-400 mt-2">Essential for multi-domain businesses. <span className="font-semibold">Check detected hostnames and domains.</span></div>
        {auditData?.hostnames && auditData.hostnames.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold mb-1 text-gray-200">Detected hostnames:</div>
            <ul className="ml-4 list-disc">
              {auditData.hostnames.map((host, i) => (
                <li key={host + i} className="break-all text-gray-200">{host}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* PII Checks */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-red-400" />
          PII Checks
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.dataQuality?.piiAnalysis?.severity === 'critical' ? 'PII Detected' : 'No PII Detected'}</div>
        <div className="text-sm text-slate-400 mt-2">Checks for names, email addresses, phone numbers, SSNs, usernames, and other PII in page URLs and query parameters. <span className="font-semibold">PII in URLs is a major privacy and compliance risk.</span></div>
        {auditData?.dataQuality?.piiAnalysis?.severity === 'critical' && auditData.dataQuality.piiAnalysis.details && (
          <div className="mt-2 text-sm text-red-300">
            {auditData.dataQuality.piiAnalysis.details.critical.length} critical, {auditData.dataQuality.piiAnalysis.details.high.length} high, {auditData.dataQuality.piiAnalysis.details.medium.length} medium issues across {auditData.dataQuality.piiAnalysis.details.totalAffectedUrls} URLs.
          </div>
        )}
      </div>
      {/* Unwanted Referrers */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Link className="w-6 h-6 mr-2 text-pink-400" />
          Unwanted Referrers
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.dataQuality?.trafficSources?.unwantedReferrals?.detected ? 'Detected' : 'None Detected'}</div>
        <div className="text-sm text-slate-400 mt-2">Exclude payment processors (PayPal, Stripe) and other unwanted referrers for accurate attribution.</div>
        {auditData?.dataQuality?.trafficSources?.unwantedReferrals?.detected && auditData.dataQuality.trafficSources.unwantedReferrals.sources && (
          <div className="mt-2">
            <div className="font-semibold mb-1 text-gray-200">Detected unwanted referrers:</div>
            <ul className="ml-4 list-disc">
              {auditData.dataQuality.trafficSources.unwantedReferrals.sources.map((ref: any, i: number) => (
                <li key={ref.source + i} className="break-all text-gray-200">{ref.source} ({ref.sessions} sessions)</li>
              ))}
            </ul>
          </div>
        )}
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
          {auditData?.keyEvents?.map((event: KeyEvent, index: number) => (
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
    const attributionModel = formatAttributionModel(auditData?.attribution?.reportingAttributionModel || '');
    const acquisitionWindow = formatLookbackWindow(auditData?.attribution?.acquisitionConversionEventLookbackWindow || '');
    const otherWindow = formatLookbackWindow(auditData?.attribution?.otherConversionEventLookbackWindow || '');
    const channelCredit = formatChannelCredit((auditData?.attribution as any)?.channelsThatCanReceiveCredit);
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

  const renderCustomizationsTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Database className="w-7 h-7 mr-3 text-blue-400" />
          Custom Dimensions
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
              {auditData?.customDimensions?.map((dimension: CustomDimension, index: number) => (
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
              {auditData?.customMetrics?.map((metric: CustomMetric, index: number) => (
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
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Activity className="w-7 h-7 mr-3 text-green-400" />
          Custom Events
        </h3>
        <div className="space-y-3">
          {auditData?.keyEvents?.map((event: KeyEvent, index: number) => (
            <div key={index} className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">{event.eventName}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecommendationsTab = () => {
    // Group by severity
    const grouped = {
      critical: recommendations.filter(r => r.severity === 'critical'),
      important: recommendations.filter(r => r.severity === 'important'),
      info: recommendations.filter(r => r.severity === 'info'),
    };
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-7 h-7 mr-3 text-orange-400" />
            All Recommendations
          </h3>
          {Object.entries(grouped).map(([severity, recs]) => recs.length > 0 && (
            <div key={severity} className="mb-8">
              <h4 className={`text-xl font-bold mb-4 ${severity === 'critical' ? 'text-red-400' : severity === 'important' ? 'text-yellow-400' : 'text-blue-400'}`}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</h4>
              <div className="space-y-4">
                {recs.map((rec, idx) => (
                  <div key={idx} className={`p-6 rounded-xl border ${severity === 'critical' ? 'bg-red-500/10 border-red-500/20' : severity === 'important' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${severity === 'critical' ? 'bg-red-500/20' : severity === 'important' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                        <AlertTriangle className={`w-5 h-5 ${severity === 'critical' ? 'text-red-400' : severity === 'important' ? 'text-yellow-400' : 'text-blue-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white">{rec.title}</h4>
                          {severity === 'critical' && <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm">Critical</div>}
                          {severity === 'important' && <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">Important</div>}
                          {severity === 'info' && <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">Info</div>}
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{rec.description}</p>
                        {rec.docsUrl && <a href={rec.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline">Learn more</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      <div className="flex space-x-2 border-b border-slate-800 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors duration-200 ${activeTab === tab.id ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-900' : 'text-slate-300 hover:text-orange-300'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'configuration' && renderConfigurationTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'attribution' && renderAttributionTab()}
        {activeTab === 'integrations' && renderIntegrationsTab()}
        {activeTab === 'customizations' && renderCustomizationsTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}
      </div>
    </div>
  );
};

export default GA4Dashboard; 