'use client';
import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  MapPin,
  Eye,
  Settings,
  Target,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { GA4Audit } from '@/types/ga4';

interface AdminFix {
  id: string;
  title: string;
  category: 'Critical' | 'Important' | 'Improvement';
  impact: string;
  timeEstimate: string;
  currentProblem: string;
  solution: string;
  benefits: string[];
  adminPath: string;
  steps: {
    instruction: string;
    detail: string;
  }[];
  verification: string;
  warningNote?: string;
}

interface AdminFixWizardProps {
  auditData?: GA4Audit;
  property?: any;
}

const AdminFixWizard: React.FC<AdminFixWizardProps> = ({ auditData, property: _property }) => {
  const [currentFix, setCurrentFix] = useState(0);
  const [completedFixes, setCompletedFixes] = useState(new Set<number>());
  const [showingPath, setShowingPath] = useState(false);

  // Generate dynamic admin fixes based on actual score deductions
  const generateAdminFixes = (): AdminFix[] => {
    const fixes: AdminFix[] = [];

    // Calculate deductions to determine what fixes are needed
    const deductions = {
      configuration: [] as any[],
      eventsTracking: [] as any[],
      attribution: [] as any[],
      integrations: [] as any[]
    };

    // Configuration deductions
    if (!auditData?.property?.industryCategory) {
      deductions.configuration.push({ reason: 'Industry category not set', points: 5 });
    }
    if (auditData?.dataRetention?.eventDataRetention !== 'FOURTEEN_MONTHS') {
      deductions.configuration.push({ reason: 'Data retention not set to 14 months', points: 20 });
    }

    // Events & Tracking deductions
    if (!auditData?.enhancedMeasurement || auditData.enhancedMeasurement.length === 0) {
      deductions.eventsTracking.push({ reason: 'Enhanced measurement not enabled', points: 10 });
    }
    if (auditData?.enhancedMeasurement?.some(em => em.settings.formInteractionsEnabled) && 
        !auditData?.otherEvents?.some(e => e.name === 'form_name' || e.name === 'form_id')) {
      deductions.eventsTracking.push({ reason: 'Form interactions enabled but form_name/form_id not registered', points: 10 });
    }
    if (auditData?.enhancedMeasurement?.some(em => em.settings.videoEngagementEnabled) && 
        !auditData?.otherEvents?.some(e => e.name === 'video_percent')) {
      deductions.eventsTracking.push({ reason: 'Video interactions enabled but video_percent not registered', points: 5 });
    }
    if (auditData?.enhancedMeasurement?.some(em => em.settings.videoEngagementEnabled) && 
        !auditData?.otherEvents?.some(e => e.name === 'video_duration' || e.name === 'video_time')) {
      deductions.eventsTracking.push({ reason: 'Video interactions enabled but video_duration/video_time not registered', points: 5 });
    }
    if (!auditData?.keyEvents || auditData.keyEvents.length === 0) {
      deductions.eventsTracking.push({ reason: 'No key events configured', points: 20 });
    }
    if (auditData?.keyEvents && auditData.keyEvents.length > 3) {
      deductions.eventsTracking.push({ reason: 'More than 3 key events configured (over-configuration)', points: 10 });
    }

    // Attribution deductions
    if (auditData?.attribution?.reportingAttributionModel !== 'PAID_AND_ORGANIC') {
      deductions.attribution.push({ reason: 'Attribution model not set to paid and organic', points: 10 });
    }

    // Integrations deductions
    if (!auditData?.googleAdsLinks || auditData.googleAdsLinks.length === 0) {
      deductions.integrations.push({ reason: 'Google Ads not connected', points: 20 });
    }
    if (!auditData?.searchConsoleDataStatus?.isLinked) {
      deductions.integrations.push({ reason: 'Search Console not linked', points: 5 });
    }
    if (!auditData?.bigQueryLinks || auditData.bigQueryLinks.length === 0) {
      deductions.integrations.push({ reason: 'BigQuery not connected', points: 5 });
    }

    // Generate fixes based on actual deductions
    deductions.configuration.forEach(deduction => {
      if (deduction.reason === 'Industry category not set') {
        fixes.push({
          id: 'industry-category',
          title: 'Set Industry Category',
          category: 'Important',
          impact: 'Missing out on industry benchmarks and insights',
          timeEstimate: '1 minute',
          currentProblem: 'Industry category not set in property settings',
          solution: 'Select your business industry in property settings',
          benefits: [
            'Get industry-specific insights',
            'See how you compare to competitors',
            'Access relevant benchmarking data',
            'Better machine learning predictions'
          ],
          adminPath: 'Admin > Property Settings > Property details',
          steps: [
            { instruction: 'Go to Admin > Property Settings', detail: 'This contains basic information about your GA4 property' },
            { instruction: 'Click "Property details"', detail: 'Where you set timezone, currency, and other basics' },
            { instruction: 'Find "Industry category"', detail: 'It\'s in the same section as timezone and currency' },
            { instruction: 'Select your industry from the dropdown', detail: 'Choose the category that best matches your business' },
            { instruction: 'Click "Save"', detail: 'This helps Google provide relevant insights and benchmarks' }
          ],
          verification: 'Your Property details should show the selected industry category',
          warningNote: 'This mainly affects future insights and benchmarking features.'
        });
      }
      
      if (deduction.reason === 'Data retention not set to 14 months') {
        fixes.push({
          id: 'data-retention',
          title: 'Fix Data Retention Period',
          category: 'Critical',
          impact: 'You\'re losing valuable historical data',
          timeEstimate: '2 minutes',
          currentProblem: `Event data retention set to ${auditData?.dataRetention?.eventDataRetention === 'TWO_MONTHS' ? 'only 2 months' : 'less than 14 months'}`,
          solution: 'Change to 14 months (maximum available)',
          benefits: [
            'Keep 14 months of detailed data instead of 2',
            'Enable year-over-year comparisons', 
            'See seasonal trends and patterns',
            'Better attribution analysis'
          ],
          adminPath: 'Admin > Data Settings > Data Retention',
          steps: [
            { instruction: 'Open your GA4 property', detail: 'Make sure you\'re in the correct GA4 property, not Universal Analytics' },
            { instruction: 'Click "Admin" in the bottom left', detail: 'You\'ll see two columns - Property and Account settings' },
            { instruction: 'Under Property, click "Data Settings"', detail: 'This will expand to show Data Retention and other options' },
            { instruction: 'Click "Data Retention"', detail: 'This is where GA4 controls how long to keep your data' },
            { instruction: 'Change "Event data retention" to "14 months"', detail: 'This is the maximum available. The default is only 2 months!' },
            { instruction: 'Click "Save"', detail: 'Changes take effect immediately for new data collection' }
          ],
          verification: 'You should see "Event data retention: 14 months" in the Data Retention settings',
          warningNote: 'This only affects NEW data. Past data beyond 2 months is already gone and can\'t be recovered.'
        });
      }
    });

    deductions.eventsTracking.forEach(deduction => {
      if (deduction.reason === 'Video interactions enabled but video_percent not registered') {
        fixes.push({
          id: 'video-percent',
          title: 'Fix Video Percent Tracking',
          category: 'Important',
          impact: 'Missing video engagement data',
          timeEstimate: '10 minutes',
          currentProblem: 'Video interactions enabled but video_percent parameter not being tracked',
          solution: 'Ensure video_percent parameter is included in video events',
          benefits: [
            'Track video completion percentages',
            'Understand viewer engagement',
            'Identify most engaging video content',
            'Improve video marketing effectiveness'
          ],
          adminPath: 'Admin > Data Streams > Enhanced Measurement > Video Engagement',
          steps: [
            { instruction: 'Go to Admin > Data Streams', detail: 'This is where you configure data collection settings' },
            { instruction: 'Click on your website data stream', detail: 'Select the stream you want to configure' },
            { instruction: 'Click "Configure tag settings"', detail: 'This opens advanced configuration options' },
            { instruction: 'Go to "Enhanced measurement" section', detail: 'Find the video engagement settings' },
            { instruction: 'Ensure "video_percent" is included in parameters', detail: 'This parameter tracks video completion percentage' },
            { instruction: 'Test with a video on your site', detail: 'Check that video_percent events are firing in DebugView' }
          ],
          verification: 'Check DebugView or Real-time reports - you should see video_percent events when users watch videos',
          warningNote: 'This requires proper video implementation on your website.'
        });
      }

      if (deduction.reason === 'Video interactions enabled but video_duration/video_time not registered') {
        fixes.push({
          id: 'video-duration',
          title: 'Fix Video Duration Tracking',
          category: 'Important',
          impact: 'Missing video duration data',
          timeEstimate: '10 minutes',
          currentProblem: 'Video interactions enabled but video_duration/video_time parameters not being tracked',
          solution: 'Ensure video_duration and video_time parameters are included in video events',
          benefits: [
            'Track video watch time',
            'Understand viewer retention',
            'Identify video drop-off points',
            'Optimize video content length'
          ],
          adminPath: 'Admin > Data Streams > Enhanced Measurement > Video Engagement',
          steps: [
            { instruction: 'Go to Admin > Data Streams', detail: 'This is where you configure data collection settings' },
            { instruction: 'Click on your website data stream', detail: 'Select the stream you want to configure' },
            { instruction: 'Click "Configure tag settings"', detail: 'This opens advanced configuration options' },
            { instruction: 'Go to "Enhanced measurement" section', detail: 'Find the video engagement settings' },
            { instruction: 'Ensure "video_duration" and "video_time" are included', detail: 'These parameters track video length and current time' },
            { instruction: 'Test with a video on your site', detail: 'Check that video_duration and video_time events are firing' }
          ],
          verification: 'Check DebugView or Real-time reports - you should see video_duration and video_time events when users watch videos',
          warningNote: 'This requires proper video implementation on your website.'
        });
      }

      if (deduction.reason === 'More than 3 key events configured (over-configuration)') {
        fixes.push({
          id: 'key-events-overconfig',
          title: 'Optimize Key Events Configuration',
          category: 'Important',
          impact: 'Too many key events can dilute conversion tracking',
          timeEstimate: '15 minutes',
          currentProblem: `You have ${auditData?.keyEvents?.length || 0} key events configured (recommended: 3 or fewer)`,
          solution: 'Review and remove unnecessary key events, keeping only the most important conversions',
          benefits: [
            'Focus on your most important conversions',
            'Improve conversion rate accuracy',
            'Better campaign optimization',
            'Cleaner reporting'
          ],
          adminPath: 'Admin > Events > Key Events',
          steps: [
            { instruction: 'Go to Admin > Events', detail: 'This is where you manage your key events' },
            { instruction: 'Click "Key Events"', detail: 'View all currently configured key events' },
            { instruction: 'Review each key event', detail: 'Ask: "Is this truly a conversion for my business?"' },
            { instruction: 'Remove unnecessary events', detail: 'Keep only purchase, lead generation, and other critical conversions' },
            { instruction: 'Prioritize by business impact', detail: 'Focus on events that directly impact revenue or goals' },
            { instruction: 'Save your changes', detail: 'Changes take effect immediately' }
          ],
          verification: 'You should have 3 or fewer key events configured, all representing important business conversions',
          warningNote: 'Only remove events that are not true conversions for your business.'
        });
      }
    });

    deductions.integrations.forEach(deduction => {
      if (deduction.reason === 'BigQuery not connected') {
        fixes.push({
          id: 'bigquery-connection',
          title: 'Connect BigQuery for Advanced Analytics',
          category: 'Important',
          impact: 'Missing advanced data analysis capabilities',
          timeEstimate: '20 minutes',
          currentProblem: 'BigQuery not connected to your GA4 property',
          solution: 'Link BigQuery to enable advanced data analysis and custom reporting',
          benefits: [
            'Advanced data analysis capabilities',
            'Custom reporting and dashboards',
            'Data retention beyond GA4 limits',
            'Integration with other data sources'
          ],
          adminPath: 'Admin > Property > Product Links > BigQuery',
          steps: [
            { instruction: 'Go to Admin > Property', detail: 'This is where you manage property-level settings' },
            { instruction: 'Click "Product Links"', detail: 'This shows all available integrations' },
            { instruction: 'Click "BigQuery"', detail: 'This opens the BigQuery linking interface' },
            { instruction: 'Click "Link" next to BigQuery', detail: 'This starts the linking process' },
            { instruction: 'Select your BigQuery project', detail: 'Choose the project where you want to store GA4 data' },
            { instruction: 'Configure data location and frequency', detail: 'Choose where and how often to export data' },
            { instruction: 'Click "Confirm"', detail: 'This completes the BigQuery connection' }
          ],
          verification: 'You should see "BigQuery" listed as "Linked" in your Product Links section',
          warningNote: 'BigQuery has associated costs for data storage and queries.'
        });
      }
    });

    return fixes;
  };

  const adminFixes = generateAdminFixes();

  // If no fixes are needed, show a success message
  if (adminFixes.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link 
                  href="/audit/properties"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Audit Results</span>
                </Link>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-white">
                  <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">GA4Helper</span>
                  <span className="text-white ml-2">Admin Fix Wizard</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  Step-by-step guide to fix critical GA4 admin settings
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-12 border border-green-500/30 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-green-400 mb-4">🎉 All Admin Settings Are Perfect!</h2>
            <p className="text-green-300 mb-8 text-lg">
              Your GA4 admin configuration is already properly set up. All critical settings are configured correctly!
            </p>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
              <h3 className="text-xl font-semibold text-white mb-4">What we checked:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Data retention period
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Industry category
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Video tracking parameters
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Key events configuration
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  BigQuery integration
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Attribution settings
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link 
                href="/audit/properties"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Audit Results
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentFixData = adminFixes[currentFix];
  
  const markComplete = () => {
    const newCompleted = new Set(completedFixes);
    newCompleted.add(currentFix);
    setCompletedFixes(newCompleted);
  };

  const nextFix = () => {
    if (currentFix < adminFixes.length - 1) {
      setCurrentFix(currentFix + 1);
    }
  };

  const prevFix = () => {
    if (currentFix > 0) {
      setCurrentFix(currentFix - 1);
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('Critical')) return 'bg-red-100 text-red-800';
    if (category.includes('Important')) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getCategoryBgColor = (category: string) => {
    if (category.includes('Critical')) return 'bg-red-500/10 border-red-500/20';
    if (category.includes('Important')) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-blue-500/10 border-blue-500/20';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                href="/audit/properties"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Audit Results</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">GA4Helper</span>
                <span className="text-white ml-2">Admin Fix Wizard</span>
              </h1>
              <p className="text-gray-400 mt-2">
                Step-by-step guide to fix critical GA4 admin settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Fix Critical Admin Settings</h1>
                <p className="text-gray-600 mb-4">
                  Step-by-step guide to fix the hidden GA4 settings that most people miss
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">{adminFixes.length - completedFixes.size}</div>
                <div className="text-sm text-red-600">Issues Remaining</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                Total time: ~{adminFixes.reduce((total, fix) => {
                  const time = parseInt(fix.timeEstimate.split(' ')[0]);
                  return total + time;
                }, 0)} minutes
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1 text-gray-500" />
                {completedFixes.size} of {adminFixes.length} fixed
              </div>
            </div>
          </div>
        </div>

        {/* Fix Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Issues to Fix</h2>
            <div className="text-sm text-gray-500">
              {currentFix + 1} of {adminFixes.length}
            </div>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {adminFixes.map((fix, index) => (
              <button
                key={fix.id}
                onClick={() => setCurrentFix(index)}
                className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all ${
                  index === currentFix 
                    ? 'border-blue-500 bg-blue-50' 
                    : completedFixes.has(index)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {completedFixes.has(index) ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className={`w-4 h-4 ${index === currentFix ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      index === currentFix ? 'text-blue-800' : 
                      completedFixes.has(index) ? 'text-green-800' : 'text-gray-700'
                    }`}>
                      {fix.title}
                    </div>
                    <div className={`text-xs ${getCategoryColor(fix.category)} px-2 py-1 rounded mt-1`}>
                      {fix.category}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Fix Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Fix Header */}
          <div className={`p-6 ${getCategoryBgColor(currentFixData.category)}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{currentFixData.title}</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getCategoryColor(currentFixData.category)}`}>
                    {currentFixData.category}
                  </span>
                  <span className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {currentFixData.timeEstimate}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{currentFixData.impact}</p>
              </div>
              
              <button
                onClick={markComplete}
                disabled={completedFixes.has(currentFix)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  completedFixes.has(currentFix)
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {completedFixes.has(currentFix) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 inline" />
                    Completed
                  </>
                ) : (
                  'Mark Complete'
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">❌ Current Problem</h4>
                <p className="text-red-700">{currentFixData.currentProblem}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✅ Solution</h4>
                <p className="text-green-700">{currentFixData.solution}</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
              What you'll gain by fixing this
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentFixData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Path */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                Where to find this in GA4
              </h4>
              <button
                onClick={() => setShowingPath(!showingPath)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showingPath ? 'Hide' : 'Show'} navigation path
              </button>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 font-mono text-sm">{currentFixData.adminPath}</p>
            </div>
            
            {showingPath && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">🧭 Step-by-step navigation:</p>
                <ol className="text-sm text-gray-700 space-y-1">
                  {currentFixData.adminPath.split(' > ').map((step, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      Click "{step}"
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Detailed Steps */}
          <div className="p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-4 h-4 mr-2 text-green-500" />
              Step-by-step instructions
            </h4>
            
            <div className="space-y-4">
              {currentFixData.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800 mb-1">{step.instruction}</h5>
                    <p className="text-sm text-gray-600">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                How to verify it worked
              </h5>
              <p className="text-green-700">{currentFixData.verification}</p>
            </div>

            {/* Warning */}
            {currentFixData.warningNote && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Important note
                </h5>
                <p className="text-yellow-700">{currentFixData.warningNote}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={prevFix}
                disabled={currentFix === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  currentFix === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Issue
              </button>

              <div className="text-sm text-gray-500">
                Issue {currentFix + 1} of {adminFixes.length}
              </div>

              <button
                onClick={nextFix}
                disabled={currentFix === adminFixes.length - 1}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                  currentFix === adminFixes.length - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {currentFix === adminFixes.length - 1 ? 'All Done!' : 'Next Issue'}
                {currentFix < adminFixes.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </div>
        </div>

        {/* Completion Summary */}
        {completedFixes.size === adminFixes.length && (
          <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">🎉 All Admin Issues Fixed!</h3>
            <p className="text-green-700 mb-4">
              Your GA4 admin configuration is now properly set up. These changes will improve your data quality immediately.
            </p>
            <Link 
              href="/audit/properties"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              View Updated Audit Results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFixWizard; 