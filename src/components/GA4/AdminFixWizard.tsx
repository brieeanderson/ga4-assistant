import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  Eye,
  Settings,
  Shield,
  Target,
  Lightbulb,
  Copy,
  TrendingUp,
  Zap,
  Globe,
  Building2
} from 'lucide-react';
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

const AdminFixWizard: React.FC<AdminFixWizardProps> = ({ auditData, property }) => {
  const [currentFix, setCurrentFix] = useState(0);
  const [completedFixes, setCompletedFixes] = useState(new Set<number>());
  const [showingPath, setShowingPath] = useState(false);

  // Generate dynamic admin fixes based on audit data
  const generateAdminFixes = (): AdminFix[] => {
    const fixes: AdminFix[] = [];

    // 1. Data Retention - Critical
    if (auditData?.dataRetention?.eventDataRetention !== 'FOURTEEN_MONTHS') {
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
          {
            instruction: 'Open your GA4 property',
            detail: 'Make sure you\'re in the correct GA4 property, not Universal Analytics'
          },
          {
            instruction: 'Click "Admin" in the bottom left',
            detail: 'You\'ll see two columns - Property and Account settings'
          },
          {
            instruction: 'Under Property, click "Data Settings"',
            detail: 'This will expand to show Data Retention and other options'
          },
          {
            instruction: 'Click "Data Retention"',
            detail: 'This is where GA4 controls how long to keep your data'
          },
          {
            instruction: 'Change "Event data retention" to "14 months"',
            detail: 'This is the maximum available. The default is only 2 months!'
          },
          {
            instruction: 'Click "Save"',
            detail: 'Changes take effect immediately for new data collection'
          }
        ],
        verification: 'You should see "Event data retention: 14 months" in the Data Retention settings',
        warningNote: 'This only affects NEW data. Past data beyond 2 months is already gone and can\'t be recovered.'
      });
    }

    // 2. PII Redaction - Critical
    if (auditData?.audit?.dataCollection?.piiRedaction?.status !== 'good') {
      fixes.push({
        id: 'pii-urls',
        title: 'Remove Personal Information from URLs',
        category: 'Critical',
        impact: 'Privacy law violation risk (GDPR, CCPA)',
        timeEstimate: '15 minutes',
        currentProblem: 'GA4 is collecting personal information in page URLs',
        solution: 'Set up URL redaction or modify website to remove PII',
        benefits: [
          'Comply with GDPR and privacy laws',
          'Protect customer personal information',
          'Avoid potential legal fines',
          'Build customer trust'
        ],
        adminPath: 'Admin > Data Streams > Enhanced Measurement OR modify your website',
        steps: [
          {
            instruction: 'Identify what personal info is in your URLs',
            detail: 'Common examples: emails, names, phone numbers in query parameters'
          },
          {
            instruction: 'Choose your approach',
            detail: 'Option 1: Remove PII from website URLs. Option 2: Set up GA4 URL redaction'
          },
          {
            instruction: 'For URL redaction: Go to Admin > Data Streams',
            detail: 'Click on your website data stream'
          },
          {
            instruction: 'Click "Configure tag settings"',
            detail: 'This opens advanced configuration options'
          },
          {
            instruction: 'Add custom parameters to redact PII',
            detail: 'Use regex patterns to automatically remove personal information'
          },
          {
            instruction: 'Test the redaction',
            detail: 'Check that personal info is no longer visible in GA4 reports'
          }
        ],
        verification: 'Check your Real-time reports - URLs should no longer contain personal information',
        warningNote: 'This is a compliance issue. If you\'re unsure, consult with your legal team or a privacy expert.'
      });
    }

    // 3. Internal Traffic Filtering - Important
    if (!auditData?.dataFilters || auditData.dataFilters.length === 0) {
      fixes.push({
        id: 'internal-traffic',
        title: 'Filter Out Internal Traffic',
        category: 'Important',
        impact: 'Your team visits are counted as customer traffic',
        timeEstimate: '5 minutes',
        currentProblem: 'No filters set up to exclude your office/team traffic',
        solution: 'Create data filter to exclude internal IP addresses',
        benefits: [
          'Get accurate visitor counts',
          'Improve conversion rate accuracy',
          'Better understand real customer behavior',
          'More reliable marketing performance data'
        ],
        adminPath: 'Admin > Data Settings > Data Filters',
        steps: [
          {
            instruction: 'Find your office IP address',
            detail: 'Google "what is my IP address" from your office network'
          },
          {
            instruction: 'Go to Admin > Data Settings > Data Filters',
            detail: 'This is where you exclude unwanted traffic'
          },
          {
            instruction: 'Click "Create Filter"',
            detail: 'You\'ll create a new filter to exclude internal traffic'
          },
          {
            instruction: 'Name it "Internal Traffic Filter"',
            detail: 'Give it a descriptive name so you remember what it does'
          },
          {
            instruction: 'Select "Internal Traffic"',
            detail: 'GA4 has a predefined filter type for this common need'
          },
          {
            instruction: 'Set "ip_override" equals your IP address',
            detail: 'This tells GA4 to exclude traffic from your office IP'
          },
          {
            instruction: 'Save and activate the filter',
            detail: 'The filter needs to be both created AND activated to work'
          }
        ],
        verification: 'Test by visiting your website from the office - your visits shouldn\'t appear in Real-time reports',
        warningNote: 'If your office IP changes frequently, you may need to update this filter.'
      });
    }

    // 4. Enhanced Measurement - Important
    if (!auditData?.enhancedMeasurement || auditData.enhancedMeasurement.length === 0) {
      fixes.push({
        id: 'enhanced-measurement',
        title: 'Enable Enhanced Measurement',
        category: 'Important',
        impact: 'Missing automatic event tracking',
        timeEstimate: '3 minutes',
        currentProblem: 'Enhanced measurement is not enabled',
        solution: 'Enable automatic tracking of page views, scrolls, clicks, and more',
        benefits: [
          'Automatic tracking without code changes',
          'Better user behavior insights',
          'More complete conversion data',
          'Improved reporting accuracy'
        ],
        adminPath: 'Admin > Data Streams > Enhanced Measurement',
        steps: [
          {
            instruction: 'Go to Admin > Data Streams',
            detail: 'This is where you configure your website tracking'
          },
          {
            instruction: 'Click on your website data stream',
            detail: 'You\'ll see the stream details and configuration options'
          },
          {
            instruction: 'Click "Enhanced Measurement"',
            detail: 'This enables automatic event tracking'
          },
          {
            instruction: 'Enable the events you want to track',
            detail: 'Page views, scrolls, outbound clicks, site search, video engagement, file downloads, form interactions'
          },
          {
            instruction: 'Click "Save"',
            detail: 'Changes take effect immediately'
          }
        ],
        verification: 'You should see "Enhanced Measurement: On" in your data stream settings',
        warningNote: 'Enhanced measurement only tracks new data going forward.'
      });
    }

    // 5. Industry Category - Improvement
    if (!auditData?.property?.industryCategory) {
      fixes.push({
        id: 'industry-category',
        title: 'Set Industry Category',
        category: 'Improvement',
        impact: 'Missing out on industry benchmarks and insights',
        timeEstimate: '1 minute',
        currentProblem: 'Industry category not set',
        solution: 'Select your business industry in property settings',
        benefits: [
          'Get industry-specific insights',
          'See how you compare to competitors',
          'Access relevant benchmarking data',
          'Better machine learning predictions'
        ],
        adminPath: 'Admin > Property Settings > Property details',
        steps: [
          {
            instruction: 'Go to Admin > Property Settings',
            detail: 'This contains basic information about your GA4 property'
          },
          {
            instruction: 'Click "Property details"',
            detail: 'Where you set timezone, currency, and other basics'
          },
          {
            instruction: 'Find "Industry category"',
            detail: 'It\'s in the same section as timezone and currency'
          },
          {
            instruction: 'Select your industry from the dropdown',
            detail: 'Choose the category that best matches your business'
          },
          {
            instruction: 'Click "Save"',
            detail: 'This helps Google provide relevant insights and benchmarks'
          }
        ],
        verification: 'Your Property details should show the selected industry category',
        warningNote: 'This mainly affects future insights and benchmarking features.'
      });
    }

    // 6. Timezone - Critical
    if (!auditData?.property?.timeZone) {
      fixes.push({
        id: 'timezone',
        title: 'Set Timezone',
        category: 'Critical',
        impact: 'Inconsistent time reporting across platforms',
        timeEstimate: '1 minute',
        currentProblem: 'Timezone is not set',
        solution: 'Set your business timezone in property settings',
        benefits: [
          'Consistent time reporting',
          'Better attribution analysis',
          'Accurate campaign performance data',
          'Proper data alignment with other tools'
        ],
        adminPath: 'Admin > Property Settings > Property details',
        steps: [
          {
            instruction: 'Go to Admin > Property Settings',
            detail: 'This contains basic property configuration'
          },
          {
            instruction: 'Click "Property details"',
            detail: 'Where you set timezone, currency, and other basics'
          },
          {
            instruction: 'Find "Timezone"',
            detail: 'It\'s in the same section as currency and industry'
          },
          {
            instruction: 'Select your business timezone',
            detail: 'Choose the timezone where your business operates'
          },
          {
            instruction: 'Click "Save"',
            detail: 'This ensures consistent time reporting'
          }
        ],
        verification: 'Your Property details should show the selected timezone',
        warningNote: 'This affects how dates and times are displayed in reports.'
      });
    }

    // 7. Currency - Important
    if (!auditData?.property?.currencyCode) {
      fixes.push({
        id: 'currency',
        title: 'Set Currency',
        category: 'Important',
        impact: 'Incorrect revenue and transaction data',
        timeEstimate: '1 minute',
        currentProblem: 'Currency is not set',
        solution: 'Set your business currency in property settings',
        benefits: [
          'Accurate revenue reporting',
          'Proper transaction data',
          'Better e-commerce insights',
          'Consistent financial data'
        ],
        adminPath: 'Admin > Property Settings > Property details',
        steps: [
          {
            instruction: 'Go to Admin > Property Settings',
            detail: 'This contains basic property configuration'
          },
          {
            instruction: 'Click "Property details"',
            detail: 'Where you set timezone, currency, and other basics'
          },
          {
            instruction: 'Find "Currency"',
            detail: 'It\'s in the same section as timezone and industry'
          },
          {
            instruction: 'Select your business currency',
            detail: 'Choose the currency you use for transactions'
          },
          {
            instruction: 'Click "Save"',
            detail: 'This ensures accurate financial reporting'
          }
        ],
        verification: 'Your Property details should show the selected currency',
        warningNote: 'This affects how monetary values are displayed in reports.'
      });
    }

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
                <a 
                  href="/audit/properties"
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Audit Results</span>
                </a>
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
                  PII redaction settings
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Internal traffic filters
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Enhanced measurement
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Industry category
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Timezone settings
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  Currency settings
                </div>
              </div>
            </div>
            <a 
              href="/audit/properties"
              className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-medium transition-all"
            >
              Back to Audit Results
            </a>
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
    if (category.includes('Critical')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (category.includes('Important')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const getCategoryBgColor = (category: string) => {
    if (category.includes('Critical')) return 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20';
    if (category.includes('Important')) return 'bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20';
    return 'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <a 
                href="/audit/properties"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Audit Results</span>
              </a>
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

      <div className="max-w-6xl mx-auto p-6">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Fix Critical Admin Settings</h2>
                <p className="text-gray-400 mb-4">
                  Step-by-step guide to fix the hidden GA4 settings that most people miss
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-400">{adminFixes.length - completedFixes.size}</div>
                <div className="text-sm text-gray-400">Issues Remaining</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                Total time: ~25 minutes
              </div>
              <div className="flex items-center text-gray-400">
                <Target className="w-4 h-4 mr-2" />
                {completedFixes.size} of {adminFixes.length} fixed
              </div>
            </div>
          </div>
        </div>

        {/* Fix Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Issues to Fix</h3>
            <div className="text-sm text-gray-400">
              {currentFix + 1} of {adminFixes.length}
            </div>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {adminFixes.map((fix, index) => (
              <button
                key={fix.id}
                onClick={() => setCurrentFix(index)}
                className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all ${
                  index === currentFix 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : completedFixes.has(index)
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {completedFixes.has(index) ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className={`w-5 h-5 ${index === currentFix ? 'text-orange-400' : 'text-gray-400'}`} />
                  )}
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      index === currentFix ? 'text-orange-400' : 
                      completedFixes.has(index) ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {fix.title}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded mt-1 border ${getCategoryColor(fix.category)}`}>
                      {fix.category}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Fix Content */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Fix Header */}
          <div className={`p-8 ${getCategoryBgColor(currentFixData.category)}`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">{currentFixData.title}</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded border ${getCategoryColor(currentFixData.category)}`}>
                    {currentFixData.category}
                  </span>
                  <span className="text-sm text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {currentFixData.timeEstimate}
                  </span>
                </div>
                <p className="text-gray-300 font-medium">{currentFixData.impact}</p>
              </div>
              
              <button
                onClick={markComplete}
                disabled={completedFixes.has(currentFix)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  completedFixes.has(currentFix)
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                    : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-slate-700 hover:border-slate-500'
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
              <div className="bg-slate-800/50 rounded-xl p-4 border border-red-500/30">
                <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Current Problem
                </h4>
                <p className="text-red-300">{currentFixData.currentProblem}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/30">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Solution
                </h4>
                <p className="text-green-300">{currentFixData.solution}</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-8 border-b border-slate-700">
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-3 text-yellow-400" />
              What you'll gain by fixing this
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentFixData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Path */}
          <div className="p-8 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                Where to find this in GA4
              </h4>
              <button
                onClick={() => setShowingPath(!showingPath)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showingPath ? 'Hide' : 'Show'} navigation path
              </button>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/30">
              <p className="text-blue-300 font-mono text-sm">{currentFixData.adminPath}</p>
            </div>
            
            {showingPath && (
              <div className="mt-4 p-4 bg-slate-800/30 rounded-xl border border-slate-600">
                <p className="text-sm text-gray-400 mb-3">🧭 Step-by-step navigation:</p>
                <ol className="text-sm text-gray-300 space-y-2">
                  {currentFixData.adminPath.split(' > ').map((step, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center justify-center mr-3 border border-blue-500/30">
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
          <div className="p-8">
            <h4 className="font-semibold text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-3 text-green-400" />
              Step-by-step instructions
            </h4>
            
            <div className="space-y-4">
              {currentFixData.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-slate-800/30 rounded-xl border border-slate-600">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-semibold border border-blue-500/30">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-white mb-2">{step.instruction}</h5>
                    <p className="text-sm text-gray-400">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification */}
            <div className="mt-8 p-6 bg-green-500/10 rounded-xl border border-green-500/30">
              <h5 className="font-semibold text-green-400 mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-3" />
                How to verify it worked
              </h5>
              <p className="text-green-300">{currentFixData.verification}</p>
            </div>

            {/* Warning */}
            {currentFixData.warningNote && (
              <div className="mt-6 p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                <h5 className="font-semibold text-yellow-400 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  Important note
                </h5>
                <p className="text-yellow-300">{currentFixData.warningNote}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="border-t border-slate-700 p-8 bg-slate-800/30">
            <div className="flex items-center justify-between">
              <button
                onClick={prevFix}
                disabled={currentFix === 0}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  currentFix === 0
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Issue
              </button>

              <div className="text-sm text-gray-400">
                Issue {currentFix + 1} of {adminFixes.length}
              </div>

              <button
                onClick={nextFix}
                disabled={currentFix === adminFixes.length - 1}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  currentFix === adminFixes.length - 1
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
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
          <div className="mt-8 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-8 border border-green-500/30 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-3">🎉 All Admin Issues Fixed!</h3>
            <p className="text-green-300 mb-6">
              Your GA4 admin configuration is now properly set up. These changes will improve your data quality immediately.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-medium transition-all">
              View Updated Audit Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFixWizard; 