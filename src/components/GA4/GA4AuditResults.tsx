import React, { useState } from 'react';
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
import { GA4Audit } from '@/types/ga4';

interface GA4AuditResultsProps {
  audit: GA4Audit;
}

const GA4AuditResults: React.FC<GA4AuditResultsProps> = ({ audit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate config score (reuse your scoring logic if available, else fallback to 100)
  // For now, just show 100 as a placeholder; you can wire in your real scoring logic here
  const configScore = 100;

  // Metrics
  const metrics = {
    dataStreams: audit.dataStreams.length,
    keyEvents: audit.keyEvents.length,
    customDimensions: audit.customDimensions.length,
    customMetrics: audit.customMetrics.length
  };

  // Property info
  const property = audit.property;

  // MetricCard component
  const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue" }: any) => {
    const colors: any = {
      blue: "border-blue-200 bg-blue-50",
      green: "border-green-200 bg-green-50",
      purple: "border-purple-200 bg-purple-50",
      orange: "border-orange-200 bg-orange-50"
    };
    const iconColors: any = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600"
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

  // StatusCard component (stub for now)
  const StatusCard = ({ title, status, description }: any) => {
    const getStatusConfig = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GA4 Configuration Audit</h1>
              <div className="flex items-center space-x-3 mt-1">
                <p className="text-gray-600">{property.displayName}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Real Data
                </span>
              </div>
              <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                <span>Property ID: {property.name}</span>
                <span>•</span>
                <span>{property.timeZone}</span>
                <span>•</span>
                <span>{property.currencyCode}</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{configScore}</div>
                <div className="text-sm text-gray-600">Configuration Score</div>
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
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray={`${configScore}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{configScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'configuration', label: 'Configuration', icon: Settings },
                { id: 'events', label: 'Key Events', icon: Target },
                { id: 'integrations', label: 'Integrations', icon: Link }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
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

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
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
                  value={metrics.dataStreams}
                  subtitle="Web & Mobile streams"
                  icon={Globe}
                  color="blue"
                />
                <MetricCard
                  title="Key Events"
                  value={metrics.keyEvents}
                  subtitle="Conversion tracking events"
                  icon={Target}
                  color="green"
                />
                <MetricCard
                  title="Custom Dimensions"
                  value={`${metrics.customDimensions}/50`}
                  subtitle={`${50 - metrics.customDimensions} remaining`}
                  icon={Database}
                  color="purple"
                />
                <MetricCard
                  title="Custom Metrics"
                  value={`${metrics.customMetrics}/50`}
                  subtitle={`${50 - metrics.customMetrics} remaining`}
                  icon={BarChart3}
                  color="orange"
                />
              </div>
            </section>
            {/* Configuration Status (stubbed for now, can be wired to real logic later) */}
            <section>
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Configuration Status</h2>
                </div>
                <p className="text-gray-600">Critical settings that affect your data quality</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example: You can map your real audit status here */}
                <StatusCard
                  title="Property Settings"
                  status="good"
                  description="Timezone and currency are properly configured for accurate reporting."
                />
                <StatusCard
                  title="Enhanced Measurement"
                  status="good"
                  description="Page views, scrolls, outbound clicks, and file downloads are enabled."
                />
                <StatusCard
                  title="Search Console Integration"
                  status="good"
                  description="{audit.searchConsoleDataStatus.totalClicks} clicks and {audit.searchConsoleDataStatus.totalImpressions} impressions tracked from organic search."
                />
                <StatusCard
                  title="Consent Mode"
                  status="warning"
                  description="Consider implementing Consent Mode v2 for GDPR compliance."
                />
                <StatusCard
                  title="BigQuery Export"
                  status={audit.bigQueryLinks && audit.bigQueryLinks.length > 0 ? 'good' : 'warning'}
                  description={audit.bigQueryLinks && audit.bigQueryLinks.length > 0 ? 'BigQuery export is enabled.' : 'Not enabled - consider for advanced analysis and data exports.'}
                />
                <StatusCard
                  title="Data Retention"
                  status={audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? 'good' : 'warning'}
                  description={`Event data retention set to ${audit.dataRetention.eventDataRetention === 'FOURTEEN_MONTHS' ? '14 months' : '2 months'} for business needs.`}
                />
              </div>
            </section>
          </div>
        )}
        {/* Other tabs stubbed for now */}
        {activeTab !== 'overview' && (
          <div className="text-gray-500 text-center py-16">This section coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default GA4AuditResults; 