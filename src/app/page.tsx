'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Database,
  Settings,
  BarChart3,
  Target,
  Globe,
  Shield,
  Link
} from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50"
  };
  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600"
  };
  return (
    <div className={`border ${colors[color]} rounded-xl p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors[color]} border`}>
          <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
};

const StatusCard = ({ title, status, description, severity }) => {
  const getStatusConfig = () => {
    if (severity === 'critical') {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200'
      };
    }
    switch (status) {
      case 'good':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50 border-green-200'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50 border-yellow-200'
        };
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50 border-red-200'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-50 border-gray-200'
        };
    }
  };
  const config = getStatusConfig();
  const Icon = config.icon;
  return (
    <div className={`border ${config.bg} rounded-xl p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <Icon className={`w-5 h-5 ${config.color} mt-1`} />
      </div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // OAuth state
  const { 
    isAuthenticated, 
    userEmail, 
    login, 
    logout, 
    isLoading: oauthLoading, 
    accessToken 
  } = useOAuth();
  
  // GA4 audit state and functions
  const {
    ga4Properties,
    ga4Audit,
    error,
    fetchGA4Properties,
    clearError
  } = useGA4Audit();

  // Auto-fetch properties when connected
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true' && isAuthenticated && accessToken && ga4Properties.length === 0) {
      fetchGA4Properties(accessToken);
    }
  }, [isAuthenticated, accessToken, ga4Properties.length, fetchGA4Properties]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GA4 Configuration Audit</h1>
              <div className="flex items-center space-x-3 mt-1">
                <p className="text-gray-600 font-medium">GA4WISE</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  by BEAST Analytics
                </span>
              </div>
            </div>
            {ga4Audit && (
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className={`text-3xl font-bold ${ga4Audit.configScore < 50 ? 'text-red-600' : ga4Audit.configScore < 80 ? 'text-yellow-600' : 'text-green-600'}`}>{ga4Audit.configScore}</div>
                  <div className="text-sm text-gray-600">Configuration Score</div>
                  {ga4Audit.criticalIssues && ga4Audit.criticalIssues.length > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {ga4Audit.criticalIssues.length} Critical Issues
                    </div>
                  )}
                </div>
                <div className="w-20 h-20 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={ga4Audit.configScore < 50 ? "#DC2626" : ga4Audit.configScore < 80 ? "#D97706" : "#10B981"}
                      strokeWidth="2"
                      strokeDasharray={`${ga4Audit.configScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{ga4Audit.configScore}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-xl">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'configuration', label: 'Configuration', icon: Settings },
                { id: 'events', label: 'Events', icon: Target },
                { id: 'integrations', label: 'Integrations', icon: Link },
                { id: 'manual', label: 'Manual', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                <span>{error.message || error.toString()}</span>
                <button className="ml-auto text-xs underline" onClick={clearError}>Dismiss</button>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Connection Status */}
            <div className="mb-6">
              {/* You can keep your ConnectionStatus component here if needed */}
              {/* <ConnectionStatus ... /> */}
              {/* For demo, just show login state */}
              {!isAuthenticated ? (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold" onClick={login} disabled={oauthLoading}>
                  {oauthLoading ? 'Connecting...' : 'Sign in with Google'}
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-green-700 font-medium">Connected as {userEmail}</span>
                  <button className="text-blue-600 underline text-sm" onClick={logout}>Logout</button>
                </div>
              )}
            </div>

            {/* Critical Issues Alert */}
            {ga4Audit && ga4Audit.criticalIssues && ga4Audit.criticalIssues.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-bold text-red-900">Critical Issues Detected</h3>
                </div>
                <p className="text-red-800 mb-4">
                  Your GA4 setup has {ga4Audit.criticalIssues.length} critical issues that need immediate attention.
                </p>
                <div className="space-y-2">
                  {ga4Audit.criticalIssues.map((issue, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-red-100 p-3 rounded-lg">
                      <span className="text-red-900 font-medium">{issue.title}</span>
                      <span className="text-red-700">{issue.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics */}
            {ga4Audit && (
              <section>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Property Overview</h2>
                  </div>
                  <p className="text-gray-600">Key configuration metrics for your GA4 property</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                    title="Data Streams"
                    value={ga4Audit.dataStreams?.length || 0}
                    subtitle="Web & Mobile streams"
                    icon={Globe}
                    color="blue"
                  />
                  <MetricCard
                    title="Key Events"
                    value={ga4Audit.keyEvents?.length || 0}
                    subtitle="Conversion tracking events"
                    icon={Target}
                    color="green"
                  />
                  <MetricCard
                    title="Custom Dimensions"
                    value={`${ga4Audit.customDimensions?.length || 0}/50`}
                    subtitle={`${50 - (ga4Audit.customDimensions?.length || 0)} remaining`}
                    icon={Database}
                    color="purple"
                  />
                  <MetricCard
                    title="Custom Metrics"
                    value={`${ga4Audit.customMetrics?.length || 0}/50`}
                    subtitle={`${50 - (ga4Audit.customMetrics?.length || 0)} remaining`}
                    icon={BarChart3}
                    color="orange"
                  />
                </div>
              </section>
            )}

            {/* Configuration Status */}
            {ga4Audit && (
              <section>
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Configuration Status</h2>
                  </div>
                  <p className="text-gray-600">Critical settings that affect your data quality</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatusCard
                    title="Property Settings"
                    status="good"
                    description={`Timezone (${ga4Audit.property?.timeZone}) and currency (${ga4Audit.property?.currencyCode}) properly configured.`}
                  />
                  <StatusCard
                    title="Enhanced Measurement"
                    status="good"
                    description="Page views, scrolls, outbound clicks, and file downloads are enabled."
                  />
                  <StatusCard
                    title="Search Console Integration"
                    status="good"
                    description={ga4Audit.searchConsoleDataStatus ? `${ga4Audit.searchConsoleDataStatus.totalClicks} clicks and ${ga4Audit.searchConsoleDataStatus.totalImpressions} impressions tracked from organic search.` : 'Not linked'}
                  />
                  {/* Add more status cards as needed, e.g. Data Privacy, Traffic Attribution, BigQuery Export, etc. */}
                  <StatusCard
                    title="BigQuery Export"
                    status={ga4Audit.bigQueryLinks && ga4Audit.bigQueryLinks.length > 0 ? 'good' : 'warning'}
                    description={ga4Audit.bigQueryLinks && ga4Audit.bigQueryLinks.length > 0 ? 'BigQuery export is enabled.' : 'Not enabled - consider for advanced analysis and data exports.'}
                  />
                </div>
              </section>
            )}
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'configuration' && ga4Audit && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Configuration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Property Name</div>
                  <div className="text-sm text-gray-600">{ga4Audit.property?.displayName}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Time Zone</div>
                  <div className="text-sm text-gray-600">{ga4Audit.property?.timeZone}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-900">Currency</div>
                  <div className="text-sm text-gray-600">{ga4Audit.property?.currencyCode}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-gray-900">Industry Category</div>
                  <div className="text-sm text-gray-600">{ga4Audit.property?.industryCategory}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && ga4Audit && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Events ({ga4Audit.keyEvents?.length || 0})</h3>
            <div className="space-y-3">
              {ga4Audit.keyEvents?.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">{event.name}</div>
                    <div className="text-sm text-gray-500">{event.description || 'Conversion event'}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && ga4Audit && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatusCard
              title="Search Console"
              status={ga4Audit.searchConsoleDataStatus ? 'good' : 'warning'}
              description={ga4Audit.searchConsoleDataStatus ? `${ga4Audit.searchConsoleDataStatus.totalClicks} clicks and ${ga4Audit.searchConsoleDataStatus.totalImpressions} impressions tracked from organic search.` : 'Not linked'}
            />
            <StatusCard
              title="Google Ads"
              status={ga4Audit.googleAdsAccounts && ga4Audit.googleAdsAccounts.length > 0 ? 'good' : 'warning'}
              description={ga4Audit.googleAdsAccounts && ga4Audit.googleAdsAccounts.length > 0 ? `${ga4Audit.googleAdsAccounts.length} Google Ads accounts linked for conversion tracking and optimization.` : 'No Google Ads accounts linked.'}
            />
            <StatusCard
              title="BigQuery"
              status={ga4Audit.bigQueryLinks && ga4Audit.bigQueryLinks.length > 0 ? 'good' : 'warning'}
              description={ga4Audit.bigQueryLinks && ga4Audit.bigQueryLinks.length > 0 ? 'BigQuery export is enabled.' : 'Not enabled - consider for advanced analysis and custom reporting needs.'}
            />
          </div>
        )}

        {/* Manual Tab */}
        {activeTab === 'manual' && ga4Audit && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Review</h3>
            <div className="text-gray-700">Some configuration items require manual review. Please check your GA4 property settings for advanced or custom configurations.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
