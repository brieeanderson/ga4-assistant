import React, { useState, useCallback } from 'react';
import {
  TrendingUp,
  Settings,
  Target,
  Link,
  Shield,
  Database,
  CheckCircle,
  AlertTriangle,
  Zap,
  Globe,
  Search,
  Activity,
  Clock,
  DollarSign,
  RefreshCw,
  LineChart,
  ArrowLeft,

  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { GA4Audit, DataStream, CustomDimension, CustomMetric, KeyEvent } from '@/types/ga4';
// Score progress functionality disabled for future paid feature
// import { useScoreHistory, ScoreComparison } from '@/hooks/useScoreHistory';

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
  // 6. Cross-domain tracking - removed API-based detection since it's not available
  // Cross-domain tracking requires manual verification in GA4 interface
  // 7. Data Filters - Check for IP filters specifically
  if (!auditData?.dataFilters || auditData.dataFilters.length === 0) {
    recs.push({
      title: 'Create IP Address Data Filters',
      description: 'Filter out office/employee traffic by IP address for accurate data.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/13296761?hl=en'
    });
  }
  // 8. Unwanted referrals - Check if they're properly configured
  if (!auditData?.dataQuality?.trafficSources?.unwantedReferrals || !auditData.dataQuality.trafficSources.unwantedReferrals.detected) {
    recs.push({
      title: 'Configure Unwanted Referrals',
      description: 'Exclude payment processors (PayPal, Stripe) and other unwanted referral sources.',
      severity: 'important',
      docsUrl: 'https://support.google.com/analytics/answer/10327750?hl=en'
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
  // 19. Attribution channel (if available and not set correctly)
  if (auditData?.attribution && 
      auditData.attribution.channelsThatCanReceiveCredit && 
      auditData.attribution.channelsThatCanReceiveCredit !== 'PAID_AND_ORGANIC') {
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
  const [expandedPiiSections, setExpandedPiiSections] = useState<{critical: boolean, high: boolean, medium: boolean}>({
    critical: false,
    high: false,
    medium: false
  });
  // Score progress functionality disabled for future paid feature
  // const { saveScore, getScoreComparison } = useScoreHistory();
  // const [scoreComparison, setScoreComparison] = useState<ScoreComparison | null>(null);

  // Save score and get comparison when audit data changes
  // useEffect(() => {
  //   if (auditData && property?.propertyId) {
  //     const { scores } = calculateCategoryScores();
  //     const overallScore = Math.round(
  //       (scores.configuration + scores.eventsTracking + scores.attribution + scores.integrations) / 4
  //     );
      
  //     // Save the current score
  //     saveScore(property.propertyId, property.displayName, overallScore);
      
  //     // Get score comparison
  //     const comparison = getScoreComparison(property.propertyId, overallScore);
  //     setScoreComparison(comparison);
      
  //     console.log('📊 Score comparison:', comparison);
  //   }
  // }, [auditData, property, saveScore, getScoreComparison]);

  // Calculate individual category scores based on audit data using point-based system
  const calculateCategoryScores = useCallback(() => {
    if (!auditData) return { 
      scores: { configuration: 0, eventsTracking: 0, attribution: 0, integrations: 0 },
      deductions: { configuration: [], eventsTracking: [], attribution: [], integrations: [] },
      points: {
        configuration: { earned: 0, total: 25 },
        eventsTracking: { earned: 0, total: 50 },
        attribution: { earned: 0, total: 10 },
        integrations: { earned: 0, total: 30 }
      }
    };

    // Helper function to check if a parameter is registered as a custom dimension or metric
    const isParamRegistered = (param: string) => {
      const dim = auditData.customDimensions?.find((d: any) => d.parameterName === param);
      const met = auditData.customMetrics?.find((m: any) => m.parameterName === param);
      return !!(dim || met);
    };

    const deductions = {
      configuration: [] as Array<{ reason: string; points: number }>,
      eventsTracking: [] as Array<{ reason: string; points: number }>,
      attribution: [] as Array<{ reason: string; points: number }>,
      integrations: [] as Array<{ reason: string; points: number }>
    };

    // Define total possible points for each category
    const totalPoints = {
      configuration: 25, // Industry category (5) + Data retention (20)
      eventsTracking: 50, // Enhanced measurement (10) + Form interactions (10) + Video interactions (10) + Key events (20)
      attribution: 10,    // Channel credit setting (10)
      integrations: 30    // Google Ads (20) + Search Console (5) + BigQuery (5)
    };

    // Configuration Score - Calculate earned points
    let configurationEarned = totalPoints.configuration;
    if (!auditData.property?.industryCategory) {
      configurationEarned -= 5;
      deductions.configuration.push({ reason: 'Industry category not set', points: 5 });
    }
    if (auditData.dataRetention?.eventDataRetention !== 'FOURTEEN_MONTHS') {
      configurationEarned -= 20;
      deductions.configuration.push({ reason: 'Data retention not set to 14 months', points: 20 });
    }

    // Events & Tracking Score - Calculate earned points
    let eventsTrackingEarned = totalPoints.eventsTracking;
    
    // Check enhanced measurement
    if (!auditData.enhancedMeasurement || auditData.enhancedMeasurement.length === 0) {
      eventsTrackingEarned -= 10;
      deductions.eventsTracking.push({ reason: 'Enhanced measurement not enabled', points: 10 });
    }
    
    // Check form interactions
    const formInteractionsEnabled = auditData.enhancedMeasurement?.some(
      (s: any) => s.settings?.formInteractionsEnabled
    );
    if (formInteractionsEnabled && (!isParamRegistered('form_name') && !isParamRegistered('form_id'))) {
      eventsTrackingEarned -= 10;
      deductions.eventsTracking.push({ reason: 'Form interactions enabled but form_name/form_id not registered', points: 10 });
    }

    // Check video interactions
    const videoInteractionsEnabled = auditData.enhancedMeasurement?.some(
      (s: any) => s.settings?.videoEngagementEnabled
    );
    if (videoInteractionsEnabled && !isParamRegistered('video_percent')) {
      eventsTrackingEarned -= 5;
      deductions.eventsTracking.push({ reason: 'Video interactions enabled but video_percent not registered', points: 5 });
    }
    if (videoInteractionsEnabled && (!isParamRegistered('video_duration') && !isParamRegistered('video_time'))) {
      eventsTrackingEarned -= 5;
      deductions.eventsTracking.push({ reason: 'Video interactions enabled but video_duration/video_time not registered', points: 5 });
    }

    // Check key events
    if (!auditData.keyEvents || auditData.keyEvents.length === 0) {
      eventsTrackingEarned -= 20;
      deductions.eventsTracking.push({ reason: 'No key events configured', points: 20 });
    } else if (auditData.keyEvents.length > 3) {
      eventsTrackingEarned -= 10;
      deductions.eventsTracking.push({ reason: 'More than 3 key events configured (over-configuration)', points: 10 });
    }

    // Attribution Score - Calculate earned points
    let attributionEarned = totalPoints.attribution;
    if (auditData.attribution?.channelsThatCanReceiveCredit && 
        auditData.attribution.channelsThatCanReceiveCredit !== 'PAID_AND_ORGANIC') {
      attributionEarned -= 10;
      deductions.attribution.push({ reason: 'Attribution model not set to paid and organic', points: 10 });
    }

    // Integrations Score - Calculate earned points
    let integrationsEarned = totalPoints.integrations;
    if (!auditData.googleAdsLinks || auditData.googleAdsLinks.length === 0) {
      integrationsEarned -= 20;
      deductions.integrations.push({ reason: 'Google Ads not connected', points: 20 });
    }
    if (!auditData.searchConsoleDataStatus?.isLinked) {
      integrationsEarned -= 5;
      deductions.integrations.push({ reason: 'Search Console not linked', points: 5 });
    }
    if (!auditData.bigQueryLinks || auditData.bigQueryLinks.length === 0) {
      integrationsEarned -= 5;
      deductions.integrations.push({ reason: 'BigQuery not connected', points: 5 });
    }

    // Calculate percentages based on earned/total points
    const calculatePercentage = (earned: number, total: number) => {
      return Math.max(0, Math.round((earned / total) * 100));
    };

    return {
      scores: {
        configuration: calculatePercentage(configurationEarned, totalPoints.configuration),
        eventsTracking: calculatePercentage(eventsTrackingEarned, totalPoints.eventsTracking),
        attribution: calculatePercentage(attributionEarned, totalPoints.attribution),
        integrations: calculatePercentage(integrationsEarned, totalPoints.integrations)
      },
      deductions,
      points: {
        configuration: { earned: configurationEarned, total: totalPoints.configuration },
        eventsTracking: { earned: eventsTrackingEarned, total: totalPoints.eventsTracking },
        attribution: { earned: attributionEarned, total: totalPoints.attribution },
        integrations: { earned: integrationsEarned, total: totalPoints.integrations }
      }
    };
  }, [auditData]);

  const { scores: categoryScores, deductions, points } = calculateCategoryScores();
  
  // Calculate overall score as average of category scores
  const overallScore = Math.round(
    (categoryScores.configuration + categoryScores.eventsTracking + categoryScores.attribution + categoryScores.integrations) / 4
  );

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
    <div className="space-y-16">
                      {/* Configuration Score Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 border border-slate-700">
          <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-4 border-slate-700 mb-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {overallScore}%
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Configuration Score</h2>
          <p className="text-lg text-slate-400 mb-8">Your GA4 setup is <span className={getScoreColor(overallScore)}>
            {overallScore >= 80 ? 'well configured' : 
             overallScore >= 60 ? 'needs improvement' : 'needs attention'}
          </span></p>
        </div>

        {/* Score Breakdown - Calculated from audit data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className={`text-center p-6 rounded-xl border ${categoryScores.configuration >= 80 ? 'bg-green-500/10 border-green-500/20' : categoryScores.configuration >= 60 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className={`text-2xl font-bold mb-2 ${getScoreColor(categoryScores.configuration)}`}>{categoryScores.configuration}%</div>
            <div className="text-sm text-slate-400 mb-1">Configuration</div>
            <div className="text-xs text-slate-500">{points?.configuration?.earned || 0}/{points?.configuration?.total || 25} pts</div>
          </div>
          <div className={`text-center p-6 rounded-xl border ${categoryScores.eventsTracking >= 80 ? 'bg-green-500/10 border-green-500/20' : categoryScores.eventsTracking >= 60 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className={`text-2xl font-bold mb-2 ${getScoreColor(categoryScores.eventsTracking)}`}>{categoryScores.eventsTracking}%</div>
            <div className="text-sm text-slate-400 mb-1">Events & Tracking</div>
            <div className="text-xs text-slate-500">{points?.eventsTracking?.earned || 0}/{points?.eventsTracking?.total || 50} pts</div>
          </div>
          <div className={`text-center p-6 rounded-xl border ${categoryScores.attribution >= 80 ? 'bg-green-500/10 border-green-500/20' : categoryScores.attribution >= 60 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className={`text-2xl font-bold mb-2 ${getScoreColor(categoryScores.attribution)}`}>{categoryScores.attribution}%</div>
            <div className="text-sm text-slate-400 mb-1">Attribution</div>
            <div className="text-xs text-slate-500">{points?.attribution?.earned || 0}/{points?.attribution?.total || 10} pts</div>
          </div>
          <div className={`text-center p-6 rounded-xl border ${categoryScores.integrations >= 80 ? 'bg-green-500/10 border-green-500/20' : categoryScores.integrations >= 60 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className={`text-2xl font-bold mb-2 ${getScoreColor(categoryScores.integrations)}`}>{categoryScores.integrations}%</div>
            <div className="text-sm text-slate-400 mb-1">Integrations</div>
            <div className="text-xs text-slate-500">{points?.integrations?.earned || 0}/{points?.integrations?.total || 30} pts</div>
          </div>
        </div>

        {/* Score Deductions */}
        {(deductions.configuration.length > 0 || deductions.eventsTracking.length > 0 || deductions.attribution.length > 0 || deductions.integrations.length > 0) && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <AlertTriangle className="w-7 h-7 mr-3 text-red-400" />
              Score Deductions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {deductions.configuration.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Configuration</h4>
                  {deductions.configuration.map((deduction, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg ${
                      deduction.points >= 10 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <span className="text-sm text-slate-300">{deduction.reason}</span>
                      <span className={`text-sm font-semibold ${
                        deduction.points >= 10 ? 'text-red-400' : 'text-yellow-400'
                      }`}>-{deduction.points}pts</span>
                    </div>
                  ))}
                </div>
              )}
              
              {deductions.eventsTracking.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Events & Tracking</h4>
                  {deductions.eventsTracking.map((deduction, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg ${
                      deduction.points >= 10 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <span className="text-sm text-slate-300">{deduction.reason}</span>
                      <span className={`text-sm font-semibold ${
                        deduction.points >= 10 ? 'text-red-400' : 'text-yellow-400'
                      }`}>-{deduction.points}pts</span>
                    </div>
                  ))}
                </div>
              )}
              
              {deductions.attribution.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Attribution</h4>
                  {deductions.attribution.map((deduction, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg ${
                      deduction.points >= 10 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <span className="text-sm text-slate-300">{deduction.reason}</span>
                      <span className={`text-sm font-semibold ${
                        deduction.points >= 10 ? 'text-red-400' : 'text-yellow-400'
                      }`}>-{deduction.points}pts</span>
                    </div>
                  ))}
                </div>
              )}
              
              {deductions.integrations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Integrations</h4>
                  {deductions.integrations.map((deduction, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-lg ${
                      deduction.points >= 10 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-yellow-500/10 border border-yellow-500/20'
                    }`}>
                      <span className="text-sm text-slate-300">{deduction.reason}</span>
                      <span className={`text-sm font-semibold ${
                        deduction.points >= 10 ? 'text-red-400' : 'text-yellow-400'
                      }`}>-{deduction.points}pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Fix Wizard Button - Moved right after Score Deductions */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-orange-400" />
                Need Help Fixing These Issues?
              </h3>
              <p className="text-gray-400">
                Get step-by-step guidance to fix critical GA4 admin settings that most people miss
              </p>
            </div>
            <a 
              href={`/audit/admin-fixes?propertyId=${property?.propertyId}`}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 font-medium transition-all flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Launch Fix Wizard
            </a>
          </div>
        </div>

        {/* Score History - Disabled for future paid feature */}
        {/* {scoreComparison && scoreComparison.previousScore !== null && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUpIcon className="w-7 h-7 mr-3 text-blue-400" />
              Score Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-800 rounded-xl border border-slate-600">
                <div className="text-sm text-gray-400 mb-1">Previous Score</div>
                <div className="text-2xl font-bold text-white">{scoreComparison.previousScore}%</div>
                <div className="text-xs text-gray-500 mt-1">{scoreComparison.lastAuditDate}</div>
              </div>
              <div className="text-center p-4 bg-slate-800 rounded-xl border border-slate-600">
                <div className="text-sm text-gray-400 mb-1">Current Score</div>
                <div className="text-2xl font-bold text-white">{scoreComparison.currentScore}%</div>
                <div className="text-xs text-gray-500 mt-1">Today</div>
              </div>
              <div className="text-center p-4 bg-slate-800 rounded-xl border border-slate-600">
                <div className="text-sm text-gray-400 mb-1">Change</div>
                <div className={`text-2xl font-bold flex items-center justify-center ${
                  scoreComparison.improvement ? 'text-green-400' : scoreComparison.scoreChange !== 0 ? 'text-red-400' : 'text-white'
                }`}>
                  {scoreComparison.improvement ? (
                    <TrendingUpIcon className="w-5 h-5 mr-1" />
                  ) : scoreComparison.scoreChange !== 0 ? (
                    <TrendingDown className="w-5 h-5 mr-1" />
                  ) : null}
                  {scoreComparison.scoreChange && scoreComparison.scoreChange > 0 ? '+' : ''}{scoreComparison.scoreChange || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {scoreComparison.daysSinceLastAudit} days ago
                </div>
              </div>
            </div>
            {scoreComparison.improvement && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Great progress! Your GA4 configuration has improved.</span>
                </div>
              </div>
            )}
            {!scoreComparison.improvement && scoreComparison.scoreChange !== 0 && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center text-red-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Score has decreased. Review the recommendations above to improve your configuration.</span>
                </div>
              </div>
            )}
          </div>
        )} */}

        {/* Top Recommendations */}
        {topRecommendations.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 border border-slate-700">
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
    <div className="space-y-16">
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
        <div className="text-white text-lg font-semibold">Requires Manual Verification</div>
        <div className="text-sm text-slate-400 mt-2">Essential for multi-domain businesses. <span className="font-semibold">Cross-domain tracking cannot be detected via API and requires manual verification.</span></div>
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-sm text-blue-300 font-medium mb-2">How to check cross-domain tracking:</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>1. Go to <span className="font-semibold">Admin → Data Streams</span></div>
            <div>2. Click on your web data stream</div>
            <div>3. Go to <span className="font-semibold">Configure tag settings → Configure your domains</span></div>
            <div>4. Check if cross-domain tracking is enabled and domains are listed</div>
          </div>
        </div>
        {auditData?.hostnames && auditData.hostnames.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold mb-1 text-gray-200">Detected hostnames (for reference):</div>
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
          <>
            <div className="mt-2 text-sm text-red-300">
              {auditData.dataQuality.piiAnalysis.details.critical.length} critical, {auditData.dataQuality.piiAnalysis.details.high.length} high, {auditData.dataQuality.piiAnalysis.details.medium.length} medium issues across {auditData.dataQuality.piiAnalysis.details.totalAffectedUrls} URLs.
            </div>
            
            {/* Show sample flagged URLs */}
            <div className="mt-4 space-y-3">
              {/* Critical Issues */}
              {auditData.dataQuality.piiAnalysis.details.critical.length > 0 && (
                <div>
                  <button 
                    onClick={() => setExpandedPiiSections(prev => ({ ...prev, critical: !prev.critical }))}
                    className="flex items-center justify-between w-full text-sm font-semibold text-red-400 mb-2 hover:text-red-300 transition-colors"
                  >
                    <span>Critical Issues ({auditData.dataQuality.piiAnalysis.details.critical.length})</span>
                    {expandedPiiSections.critical ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {expandedPiiSections.critical && (
                    <div className="space-y-2">
                                             {auditData.dataQuality.piiAnalysis.details.critical.slice(0, 5).map((issue: any, index: number) => (
                         <div key={index} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                           <div className="text-xs text-red-300 mb-1">
                             <span className="font-semibold">{issue.type}</span> in {issue.parameter}
                           </div>
                           <div className="text-xs text-gray-300 url-wrap" title={issue.url}>
                             {issue.url}
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             {issue.pageViews} page views • Value: {issue.value}
                           </div>
                         </div>
                       ))}
                      {auditData.dataQuality.piiAnalysis.details.critical.length > 5 && (
                        <div className="text-xs text-gray-400 italic">
                          ... and {auditData.dataQuality.piiAnalysis.details.critical.length - 5} more critical issues
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* High Issues */}
              {auditData.dataQuality.piiAnalysis.details.high.length > 0 && (
                <div>
                  <button 
                    onClick={() => setExpandedPiiSections(prev => ({ ...prev, high: !prev.high }))}
                    className="flex items-center justify-between w-full text-sm font-semibold text-orange-400 mb-2 hover:text-orange-300 transition-colors"
                  >
                    <span>High Issues ({auditData.dataQuality.piiAnalysis.details.high.length})</span>
                    {expandedPiiSections.high ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {expandedPiiSections.high && (
                    <div className="space-y-2">
                                             {auditData.dataQuality.piiAnalysis.details.high.slice(0, 3).map((issue: any, index: number) => (
                         <div key={index} className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                           <div className="text-xs text-orange-300 mb-1">
                             <span className="font-semibold">{issue.type}</span> in {issue.parameter}
                           </div>
                           <div className="text-xs text-gray-300 url-wrap" title={issue.url}>
                             {issue.url}
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             {issue.pageViews} page views • Value: {issue.value}
                           </div>
                         </div>
                       ))}
                      {auditData.dataQuality.piiAnalysis.details.high.length > 3 && (
                        <div className="text-xs text-gray-400 italic">
                          ... and {auditData.dataQuality.piiAnalysis.details.high.length - 3} more high issues
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Medium Issues */}
              {auditData.dataQuality.piiAnalysis.details.medium.length > 0 && (
                <div>
                  <button 
                    onClick={() => setExpandedPiiSections(prev => ({ ...prev, medium: !prev.medium }))}
                    className="flex items-center justify-between w-full text-sm font-semibold text-yellow-400 mb-2 hover:text-yellow-300 transition-colors"
                  >
                    <span>Medium Issues ({auditData.dataQuality.piiAnalysis.details.medium.length})</span>
                    {expandedPiiSections.medium ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {expandedPiiSections.medium && (
                    <div className="space-y-2">
                                             {auditData.dataQuality.piiAnalysis.details.medium.slice(0, 3).map((issue: any, index: number) => (
                         <div key={index} className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                           <div className="text-xs text-yellow-300 mb-1">
                             <span className="font-semibold">{issue.type}</span> in {issue.parameter}
                           </div>
                           <div className="text-xs text-gray-300 url-wrap" title={issue.url}>
                             {issue.url}
                           </div>
                           <div className="text-xs text-gray-400 mt-1">
                             {issue.pageViews} page views • Value: {issue.value}
                           </div>
                         </div>
                       ))}
                      {auditData.dataQuality.piiAnalysis.details.medium.length > 3 && (
                        <div className="text-xs text-gray-400 italic">
                          ... and {auditData.dataQuality.piiAnalysis.details.medium.length - 3} more medium issues
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
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

    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-16">
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
      {/* Enhanced Measurement Settings */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-7 h-7 mr-3 text-yellow-400" />
          Enhanced Measurement Settings
        </h3>
        <div className="space-y-4">
          {/* Page Views */}
          <div className="p-4 rounded-xl border bg-green-500/10 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">Page Views</div>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                Always Enabled
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Automatically fires on page load and history changes
            </div>
          </div>

          {/* Scrolls */}
          <div className={`p-4 rounded-xl border ${
            auditData?.enhancedMeasurement?.[0]?.settings?.scrollsEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">Scrolls</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                auditData?.enhancedMeasurement?.[0]?.settings?.scrollsEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {auditData?.enhancedMeasurement?.[0]?.settings?.scrollsEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Fires when user scrolls 90% of page depth
            </div>
          </div>

          {/* Outbound Clicks */}
          <div className={`p-4 rounded-xl border ${
            auditData?.enhancedMeasurement?.[0]?.settings?.outboundClicksEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">Outbound Clicks</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                auditData?.enhancedMeasurement?.[0]?.settings?.outboundClicksEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {auditData?.enhancedMeasurement?.[0]?.settings?.outboundClicksEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Automatically captures clicks to external domains
            </div>
          </div>

          {/* Video Engagement */}
          <div className={`p-4 rounded-xl border ${
            auditData?.enhancedMeasurement?.[0]?.settings?.videoEngagementEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">Video Engagement</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                auditData?.enhancedMeasurement?.[0]?.settings?.videoEngagementEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {auditData?.enhancedMeasurement?.[0]?.settings?.videoEngagementEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Tracks YouTube video engagement (start, progress, completion)
            </div>
          </div>

          {/* File Downloads */}
          <div className={`p-4 rounded-xl border ${
            auditData?.enhancedMeasurement?.[0]?.settings?.fileDownloadsEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">File Downloads</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                auditData?.enhancedMeasurement?.[0]?.settings?.fileDownloadsEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {auditData?.enhancedMeasurement?.[0]?.settings?.fileDownloadsEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Automatically tracks clicks that end with popular file extensions such as .pdf, .csv, .mp3, etc.
            </div>
          </div>

          {/* Form Interactions */}
          <div className={`p-4 rounded-xl border ${
            auditData?.enhancedMeasurement?.[0]?.settings?.formInteractionsEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">Form Interactions</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                auditData?.enhancedMeasurement?.[0]?.settings?.formInteractionsEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {auditData?.enhancedMeasurement?.[0]?.settings?.formInteractionsEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Tracks form interactions and submissions
            </div>
          </div>

          {/* Site Search */}
          <div className={`p-4 rounded-xl border ${
            auditData?.enhancedMeasurement?.[0]?.settings?.siteSearchEnabled ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-semibold text-white">Site Search</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                auditData?.enhancedMeasurement?.[0]?.settings?.siteSearchEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {auditData?.enhancedMeasurement?.[0]?.settings?.siteSearchEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Tracks searches that happen on your site using query parameters
            </div>
            {auditData?.enhancedMeasurement?.[0]?.settings?.siteSearchEnabled && (
              <div className="mt-2 text-xs text-slate-400">
                Query parameters: {auditData?.dataQuality?.searchImplementation?.searchParameters?.join(', ') || 'q'} {auditData?.dataQuality?.searchImplementation?.hasSiteSearchConfig ? '(configured)' : '(needs configuration)'}
              </div>
            )}
          </div>
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
    const channelCredit = formatChannelCredit(auditData?.attribution?.channelsThatCanReceiveCredit || '');
    return (
      <div className="space-y-16">
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
    <div className="space-y-16">
      {/* Search Console */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Search className="w-6 h-6 mr-2 text-green-400" />
          Search Console
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.searchConsoleDataStatus?.isLinked ? 'Connected' : 'Not Connected'}</div>
        <div className="text-sm text-slate-400 mt-2">Organic search data integration for SEO insights and keyword performance.</div>
        {auditData?.searchConsoleDataStatus?.isLinked ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Clicks</div>
              <div className="text-white font-semibold">{auditData?.searchConsoleDataStatus?.totalClicks?.toLocaleString() || 0}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Impressions</div>
              <div className="text-white font-semibold">{auditData?.searchConsoleDataStatus?.totalImpressions?.toLocaleString() || 0}</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-red-400 font-semibold">Search Console not connected. Link your Search Console property for organic search insights.</div>
          </div>
        )}
      </div>

      {/* Google Ads */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-blue-400" />
          Google Ads
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.googleAdsLinks?.length > 0 ? 'Connected' : 'Not Connected'}</div>
        <div className="text-sm text-slate-400 mt-2">Conversion tracking and audience sharing between Google Ads and GA4.</div>
        {auditData?.googleAdsLinks?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Accounts</div>
              <div className="text-white font-semibold">{auditData?.googleAdsLinks?.length}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Status</div>
              <div className="text-white font-semibold">Importing</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-red-400 font-semibold">Google Ads not connected. Link your Google Ads accounts for conversion tracking and audience insights.</div>
          </div>
        )}
      </div>

      {/* BigQuery */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2 text-purple-400" />
          BigQuery
        </h3>
        <div className="text-white text-lg font-semibold">{auditData?.bigQueryLinks?.length > 0 ? 'Connected' : 'Not Connected'}</div>
        <div className="text-sm text-slate-400 mt-2">Raw data export for advanced analysis and custom reporting.</div>
        {auditData?.bigQueryLinks?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Exports</div>
              <div className="text-white font-semibold">{auditData?.bigQueryLinks?.length}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-sm text-slate-400 mb-2">Status</div>
              <div className="text-white font-semibold">Active</div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-red-400 font-semibold">BigQuery not connected. Enable BigQuery export for advanced data analysis and custom reporting capabilities.</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomizationsTab = () => (
    <div className="space-y-16">
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
        <div className="space-y-16">
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
                <div className="flex items-center space-x-2">
                  <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </div>
                  {/* Score comparison disabled for future paid feature */}
                  {/* {scoreComparison && scoreComparison.previousScore !== null && (
                    <div className="flex items-center space-x-1">
                      {scoreComparison.improvement ? (
                        <TrendingUpIcon className="w-4 h-4 text-green-400" />
                      ) : scoreComparison.scoreChange !== 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : null}
                      {scoreComparison.scoreChange !== 0 && (
                        <span className={`text-sm font-semibold ${
                          scoreComparison.improvement ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {scoreComparison.scoreChange && scoreComparison.scoreChange > 0 ? '+' : ''}{scoreComparison.scoreChange || 0}
                        </span>
                      )}
                    </div>
                  )} */}
                </div>
                <div className="text-sm text-gray-400">Config Score</div>
                {/* Score comparison disabled for future paid feature */}
                {/* {scoreComparison && scoreComparison.lastAuditDate && (
                  <div className="text-xs text-gray-500">
                    Last: {scoreComparison.lastAuditDate}
                  </div>
                )} */}
              </div>
              <button 
                onClick={onChangeProperty}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
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