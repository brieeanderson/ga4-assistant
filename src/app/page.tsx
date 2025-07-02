'use client';

import React, { useState, useEffect } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import {
  XCircle,
  TrendingUp,
  Settings,
  Target,
  Shield,
  Link
} from 'lucide-react';
import { formatLabel } from '../lib/formatLabel';
import { PropertyConfigScore } from '../components/GA4/PropertyConfigScore';
import LoginModal from '../components/common/LoginModal';

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showPIIDetails, setShowPIIDetails] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // OAuth state
  const { 
    isAuthenticated, 
    accessToken, 
    login 
  } = useOAuth();
  
  // GA4 audit state and functions
  const {
    ga4Properties,
    ga4Audit,
    error,
    fetchGA4Properties,
    runGA4Audit,
    clearError
  } = useGA4Audit();

  // Auto-fetch properties when connected
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true' && isAuthenticated && accessToken && ga4Properties.length === 0) {
      fetchGA4Properties(accessToken);
    }
  }, [isAuthenticated, accessToken, ga4Properties.length, fetchGA4Properties]);

  // When a property is selected, fetch its audit
  useEffect(() => {
    if (selectedProperty && accessToken) {
      runGA4Audit(accessToken, selectedProperty.propertyId);
    }
  }, [selectedProperty, accessToken, runGA4Audit]);

  // Show login modal automatically if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    }
  }, [isAuthenticated]);

  // Helper for PII details type guard
  const piiDetails = ga4Audit?.audit?.dataCollection?.piiRedaction?.details;
  const hasSampleUrls = piiDetails && typeof piiDetails === 'object' && 'sampleUrls' in piiDetails;
  if (typeof window !== 'undefined') {
    // Debugging: log PII details and sampleUrls
    console.log('PII details:', piiDetails);
    console.log('hasSampleUrls:', hasSampleUrls);
    if (hasSampleUrls) {
      console.log('sampleUrls:', (piiDetails as any).sampleUrls);
    }
  }

  // Property Picker UI (grouped by account)
  if (isAuthenticated && ga4Properties.length > 0 && !selectedProperty) {
    // Group properties by accountName
    const propertiesByAccount = ga4Properties.reduce((acc: any, prop: any) => {
      const account = prop.accountName || 'Unknown Account';
      if (!acc[account]) acc[account] = [];
      acc[account].push(prop);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-2xl w-full">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Select a GA4 Property to Audit</h3>
          {(Object.entries(propertiesByAccount) as [string, any[]][]).map(([accountName, properties]) => (
            <div key={accountName} className="mb-8">
              <div className="text-lg font-semibold text-blue-800 mb-2">{accountName}</div>
              <ul className="space-y-3">
                {properties.map((property) => (
                  <li key={property.propertyId} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{property.displayName || property.propertyId}</div>
                      <div className="text-xs text-gray-500">
                        {/* Show Measurement ID if available, else propertyId */}
                        {property.measurementId ? `Measurement ID: ${property.measurementId}` : `Property ID: ${property.propertyId}`}
                      </div>
                    </div>
                    <button
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                      onClick={() => setSelectedProperty(property)}
                    >
                      Audit
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show login modal for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LoginModal
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          login={login}
        />
        {!loginModalOpen && (
          <button
            className="mt-8 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
            onClick={() => setLoginModalOpen(true)}
          >
            Sign in with Google
          </button>
        )}
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              {/* Account Name Badge */}
              {selectedProperty?.displayName && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {selectedProperty.displayName}
                </span>
              )}
              <div className="flex flex-col items-end">
                <span className="text-3xl font-bold text-yellow-700">{ga4Audit?.configScore ?? '--'}</span>
                <span className="text-sm text-gray-500 font-medium">Configuration Score</span>
                <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${ga4Audit?.configScore || 0}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{ga4Audit?.configScore ? `${ga4Audit.configScore}%` : '--'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Change Property Button */}
        {selectedProperty && (
          <div className="mb-6 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium shadow"
              onClick={() => setSelectedProperty(null)}
            >
              Change Property
            </button>
          </div>
        )}
        
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
                <span>{
                  typeof error === 'object' && error !== null && 'message' in error
                    ? (error as { message: string }).message
                    : error?.toString()
                }</span>
                {(
                  (typeof error === 'string' && error.includes('Invalid or expired access token')) ||
                  (typeof error === 'object' && error !== null && 'message' in error && (error as { message: string }).message.includes('Invalid or expired access token'))
                ) && (
                  <button
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                    onClick={login}
                  >
                    Reconnect to Google
                  </button>
                )}
                <button className="ml-auto text-xs underline" onClick={clearError}>Dismiss</button>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && ga4Audit && (
          <PropertyConfigScore audit={ga4Audit} />
        )}

        {/* Configuration Tab */}
        {activeTab === 'configuration' && ga4Audit && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Property Configuration */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Configuration</h3>
              <div className="divide-y divide-gray-100">
                {/* Property Name */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Property Name</div>
                  <div className="text-right text-gray-900">{ga4Audit.property?.displayName}</div>
                </div>
                {/* Property ID */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Property ID</div>
                  <div className="text-right text-gray-900">{ga4Audit.property?.name}</div>
                </div>
                {/* Time Zone (always yellow) */}
                <div className="flex justify-between items-center py-4 px-2 bg-yellow-50">
                  <div className="font-medium text-gray-900">Time Zone</div>
                  <div className="text-right">
                    <div className="text-gray-900">{ga4Audit.property?.timeZone}</div>
                    <div className="text-xs text-yellow-700 mt-1">Ensure your time zone is consistent across all platforms to avoid reporting discrepancies.</div>
                  </div>
                </div>
                {/* Currency */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Currency</div>
                  <div className="text-right">
                    <div className="text-gray-900">{ga4Audit.property?.currencyCode}</div>
                    <div className="text-xs text-gray-500 mt-1">Sets the default currency for all revenue reporting. Transactions in other currencies are converted using the daily exchange rate.</div>
                  </div>
                </div>
                {/* Industry Category */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Industry Category</div>
                  <div className="text-right">
                    <div className="text-gray-900">{ga4Audit.property?.industryCategory ? formatLabel(ga4Audit.property.industryCategory) : 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">Used by GA4 to provide relevant industry benchmarks and insights.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Streams */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Streams</h3>
              <div className="divide-y divide-gray-100">
                {/* Number of Data Streams */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Number of Data Streams</div>
                  <div className="text-right text-gray-900">{ga4Audit.dataStreams?.length || 0}</div>
                </div>
                {/* Cross-domain Tracking (always yellow) */}
                <div className="flex justify-between items-center py-4 px-2 bg-yellow-50">
                  <div className="font-medium text-gray-900">Cross-domain Tracking</div>
                  <div className="text-right">
                    <div className="text-gray-900">
                      {ga4Audit.dataStreams?.some((s: any) => s.crossDomainSettings && s.crossDomainSettings.domains && s.crossDomainSettings.domains.length > 0)
                        ? ga4Audit.dataStreams.filter((s: any) => s.crossDomainSettings && s.crossDomainSettings.domains && s.crossDomainSettings.domains.length > 0).map((s: any) => s.crossDomainSettings.domains.join(', ')).join('; ')
                        : 'Not enabled'}
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">Double check that all relevant domains are listed for cross-domain tracking.</div>
                  </div>
                </div>
                {/* Session Timeout */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Session Timeout</div>
                  <div className="text-right text-gray-900">
                    {ga4Audit.dataStreams && ga4Audit.dataStreams.length > 0
                      ? ga4Audit.dataStreams.map((s: any) => `${s.displayName || s.name}: ${s.sessionTimeout ? Math.round(s.sessionTimeout / 60) + ' min' : '30 min'}`).join('; ')
                      : 'N/A'}
                  </div>
                </div>
                {/* Measurement Protocol Setup (yellow if keys found) */}
                <div className={`flex justify-between items-center py-4 px-2 ${ga4Audit.measurementProtocolSecrets && ga4Audit.measurementProtocolSecrets.some((s: any) => s.secrets.length > 0) ? 'bg-yellow-50' : ''}`}>
                  <div className="font-medium text-gray-900">Measurement Protocol Setup</div>
                  <div className="text-right">
                    <div className="text-gray-900">
                      {ga4Audit.measurementProtocolSecrets && ga4Audit.measurementProtocolSecrets.length > 0
                        ? (() => {
                            const totalSecrets = ga4Audit.measurementProtocolSecrets.reduce((sum: number, s: any) => sum + (s.secrets?.length || 0), 0);
                            return totalSecrets > 0 ? `${totalSecrets} secret(s)` : 'None';
                          })()
                        : 'Not set up'}
                    </div>
                    {ga4Audit.measurementProtocolSecrets && ga4Audit.measurementProtocolSecrets.some((s: any) => s.secrets.length > 0) && (
                      <div className="text-xs text-yellow-700 mt-1">Double check your Measurement Protocol setup. Incorrect configuration can lead to (not set) data.</div>
                    )}
                  </div>
                </div>
              </div>
                </div>

            {/* Privacy & Identity */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy & Identity</h3>
              <div className="divide-y divide-gray-100">
                {/* PII Check (red if found, yellow otherwise) */}
                <div className={`flex justify-between items-center py-4 px-2 ${ga4Audit.audit.dataCollection?.piiRedaction?.status === 'good' ? 'bg-yellow-50' : 'bg-red-50'}`}
                  style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div className="flex justify-between items-center w-full">
                    <div className="font-medium text-gray-900">PII Check</div>
                    <div className="text-right">
                      <div className="text-gray-900">{ga4Audit.audit.dataCollection?.piiRedaction?.value}</div>
                      <div className={`text-xs mt-1 ${ga4Audit.audit.dataCollection?.piiRedaction?.status === 'good' ? 'text-yellow-700' : 'text-red-700'}`}>{ga4Audit.audit.dataCollection?.piiRedaction?.status === 'good' ? 'Always monitor URLs for PII to ensure compliance.' : 'PII detected! Remove PII from URLs immediately.'}</div>
                      {/* Show View Details button if sampleUrls exist */}
                      {typeof ga4Audit.audit.dataCollection?.piiRedaction?.details === 'object' &&
                        ga4Audit.audit.dataCollection.piiRedaction.details !== null &&
                        'sampleUrls' in ga4Audit.audit.dataCollection.piiRedaction.details &&
                        Object.keys((ga4Audit.audit.dataCollection.piiRedaction.details as { sampleUrls: any }).sampleUrls).length > 0 && (
                          <button
                            className="text-xs text-blue-700 underline mt-2 focus:outline-none"
                            onClick={() => setShowPIIDetails(v => !v)}
                          >
                            {showPIIDetails ? 'Hide details' : 'View details'}
                          </button>
                        )}
                    </div>
                  </div>
                  {/* Expandable PII URLs list */}
                  {showPIIDetails &&
                    typeof ga4Audit.audit.dataCollection?.piiRedaction?.details === 'object' &&
                    ga4Audit.audit.dataCollection.piiRedaction.details !== null &&
                    'sampleUrls' in ga4Audit.audit.dataCollection.piiRedaction.details &&
                    Object.keys((ga4Audit.audit.dataCollection.piiRedaction.details as { sampleUrls: any }).sampleUrls).length > 0 && (
                      <div className="mt-4 bg-white border border-gray-200 rounded p-3 max-h-48 overflow-y-auto">
                        {Object.entries((ga4Audit.audit.dataCollection.piiRedaction.details as { sampleUrls: any }).sampleUrls).map(([piiType, urls]) => (
                          <div key={piiType} className="mb-3">
                            <div className="font-semibold text-xs text-gray-700 mb-1">{piiType.replace(/_/g, ' ')} examples:</div>
                            <ul className="list-disc pl-5">
                              {Array.isArray(urls) && urls.map((item: any, idx: number) => (
                                <li key={idx} className="text-xs text-gray-800 break-all">
                                  <span className="font-mono">{item.url}</span>
                                  {typeof item.pageViews === 'number' && (
                                    <span className="ml-2 text-gray-400">({item.pageViews} views)</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                {/* Google Signals (yellow if on) */}
                <div className={`flex justify-between items-center py-4 px-2 ${ga4Audit.googleSignals?.state === 'GOOGLE_SIGNALS_ENABLED' ? 'bg-yellow-50' : ''}`}>
                  <div className="font-medium text-gray-900">Google Signals</div>
                  <div className="text-right">
                    <div className="text-gray-900">{ga4Audit.googleSignals?.state ? formatLabel(ga4Audit.googleSignals.state) : 'N/A'}</div>
                    {ga4Audit.googleSignals?.state === 'GOOGLE_SIGNALS_ENABLED' && (
                      <div className="text-xs text-yellow-700 mt-1">If enabled, ensure your privacy policy is updated to reflect Google Signals usage.</div>
                    )}
                    {ga4Audit.googleSignals?.state !== 'GOOGLE_SIGNALS_ENABLED' && (
                      <div className="text-xs text-yellow-700 mt-1">You will not see demographic data in your reports unless Google Signals is enabled.</div>
                    )}
                  </div>
                </div>
              </div>
                </div>

            {/* Data Retention & Filters */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention & Filters</h3>
              <div className="divide-y divide-gray-100">
                {/* Event Data Retention (red if less than 14 months) */}
                <div className={`flex justify-between items-center py-4 px-2 ${ga4Audit.dataRetention?.eventDataRetention === 'TWO_MONTHS' ? 'bg-red-50' : ''}`}>
                  <div className="font-medium text-gray-900">Event Data Retention</div>
                  <div className="text-right">
                    <div className="text-gray-900">
                      {ga4Audit.dataRetention?.eventDataRetention === 'FOURTEEN_MONTHS'
                        ? '14 months'
                        : ga4Audit.dataRetention?.eventDataRetention === 'TWO_MONTHS'
                        ? '2 months'
                        : 'N/A'}
                    </div>
                    {ga4Audit.dataRetention?.eventDataRetention === 'TWO_MONTHS' && (
                      <div className="text-xs text-red-700 mt-1">
                        Set retention to 14 months or higher to avoid data loss.
                      </div>
                    )}
                  </div>
                </div>
                {/* User Data Retention (red if less than 14 months) */}
                <div className={`flex justify-between items-center py-4 px-2 ${ga4Audit.dataRetention?.userDataRetention === 'TWO_MONTHS' ? 'bg-red-50' : ''}`}>
                  <div className="font-medium text-gray-900">User Data Retention</div>
                  <div className="text-right">
                    <div className="text-gray-900">
                      {ga4Audit.dataRetention?.userDataRetention === 'FOURTEEN_MONTHS'
                        ? '14 months'
                        : ga4Audit.dataRetention?.userDataRetention === 'TWO_MONTHS'
                        ? '2 months'
                        : 'N/A'}
                    </div>
                    {ga4Audit.dataRetention?.userDataRetention === 'TWO_MONTHS' && (
                      <div className="text-xs text-red-700 mt-1">
                        Set retention to 14 months or higher to avoid data loss.
                      </div>
                    )}
                  </div>
                </div>
                {/* Filters */}
                <div className="flex justify-between items-center py-4 px-2">
                  <div className="font-medium text-gray-900">Filters</div>
                  <div className="text-right text-gray-900">
                    {ga4Audit.dataFilters && ga4Audit.dataFilters.length > 0
                      ? ga4Audit.dataFilters.map((f: any) => `${f.name} (${f.type})`).join('; ')
                      : 'No filters set'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && ga4Audit && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8">
            {/* Key Events */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Events ({ga4Audit.keyEvents?.length || 0})</h3>
              <div className="space-y-3">
                {ga4Audit.keyEvents?.map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900">{event.eventName}</div>
                      <div className="text-sm text-gray-500">Conversion event</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Measurement Events */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Measurement Events</h3>
              {ga4Audit.enhancedMeasurement && ga4Audit.enhancedMeasurement.length > 0 ? (
                ga4Audit.enhancedMeasurement.map((stream, idx) => (
                  <div key={stream.streamId || idx} className="mb-4 p-4 border rounded-lg">
                    <div className="font-semibold text-gray-800 mb-2">{stream.streamName}</div>
                    <ul className="space-y-1">
                      {Object.entries(stream.settings).map(([setting, enabled]) => {
                        // Enhanced Measurement event definitions
                        const definitions: Record<string, { label: string; description: string; events: string[]; dimensions: string[]; metrics?: string[] }> = {
                          streamEnabled: {
                            label: 'History Change',
                            description: 'Tracks each time a page loads or the URL changes (history events). This is essential for single-page applications and ensures every page view is counted, even when the URL changes without a full reload.',
                            events: ['page_view'],
                            dimensions: ['page_location', 'page_referrer', 'page_title'],
                          },
                          scrollsEnabled: {
                            label: 'Scrolls',
                            description: 'Tracks when a user reaches the bottom of a page (90% vertical depth).',
                            events: ['scroll'],
                            dimensions: ['percent_scrolled'],
                          },
                          outboundClicksEnabled: {
                            label: 'Outbound Clicks',
                            description: 'Tracks clicks on links that lead users away from your domain (external links).',
                            events: ['click'],
                            dimensions: ['link_url', 'link_domain'],
                          },
                          siteSearchEnabled: {
                            label: 'Site Search',
                            description: 'Tracks when a user performs a search on your website by detecting common search query parameters in the URL (such as s, q, search, query, keyword, k). Additional setup is required if your site uses a different query parameter.',
                            events: ['view_search_results'],
                            dimensions: ['search_term'],
                          },
                          videoEngagementEnabled: {
                            label: 'Video Engagement',
                            description: 'Tracks interactions with embedded YouTube videos (requires JS API enabled). Events include video start, progress (at 10, 25, 50, 75%), and completion. Some dimensions and metrics require additional setup. See "Customizations" for more information.',
                            events: ['video_start', 'video_progress', 'video_complete'],
                            dimensions: ['video_title', 'video_url', 'video_provider'],
                            metrics: ['video_percent', 'video_current_time', 'video_duration'],
                          },
                          fileDownloadsEnabled: {
                            label: 'File Downloads',
                            description: 'Tracks when a user clicks a link that ends with common file extensions (such as PDF, DOCX, XLSX, ZIP, MP4, MP3, etc).',
                            events: ['file_download'],
                            dimensions: ['file_name', 'file_extension'],
                          },
                          formInteractionsEnabled: {
                            label: 'Form Interactions',
                            description: 'Tracks when users start filling out a form and when they submit it. Will fire for all form elements -- always debug. All related dimensions require additional setup. See "Customizations" for more information.',
                            events: ['form_start', 'form_submit'],
                            dimensions: ['form_id', 'form_name', 'form_destination', 'form_submit_text'],
                          },
                        };
                        // Map legacy/variant keys to new ones if needed
                        const keyMap: Record<string, string> = {
                          searchQueryParameterEnabled: 'siteSearchEnabled',
                          formInteractionsEnabled: 'formInteractionsEnabled',
                          fileDownloadEnabled: 'fileDownloadsEnabled',
                        };
                        // Always use the mapped key if present
                        const mappedKey = keyMap[setting] || setting;
                        const def = definitions[mappedKey];
                        if (!def) return null; // Only render known, mapped options
                        return (
                          <li key={setting} className="flex flex-col py-2 border-b last:border-b-0">
                            <div className="flex items-center justify-between">
                              <span className="capitalize font-medium text-gray-900">{def.label}</span>
                              <span className={enabled ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                                {enabled ? 'On' : 'Off'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
                              <div>{def.description}</div>
                              <div className="mt-1">
                                <span className="font-semibold">Events:</span> {def.events.join(', ')}
                              </div>
                              <div>
                                <span className="font-semibold">Dimensions:</span> {def.dimensions.join(', ')}
                              </div>
                              {def.metrics && (
                                <div><span className="font-semibold">Metrics:</span> {def.metrics.join(', ')}</div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No enhanced measurement streams found.</div>
              )}
            </div>

            {/* Created Events & Rules */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Created Events & Rules</h3>
              {ga4Audit.eventCreateRules && ga4Audit.eventCreateRules.length > 0 ? (
                ga4Audit.eventCreateRules.map((stream, idx) => {
                  const hasCreatedEvents = stream.rules && stream.rules.length > 0;
                  return (
                    <div
                      key={stream.streamId || idx}
                      className={`mb-4 p-4 border rounded-lg ${hasCreatedEvents ? 'bg-red-50 border-red-300' : ''}`}
                    >
                      <div className="font-semibold text-gray-800 mb-2">{stream.streamName}</div>
                      {hasCreatedEvents && (
                        <div className="text-sm text-red-700 font-semibold mb-2">
                          GA4 created events are often incorrectly set up and should be reviewed by a GA4 expert.
                        </div>
                      )}
                      {hasCreatedEvents ? (
                        <ul className="space-y-2">
                          {stream.rules.map((rule, ridx) => (
                            <li key={rule.name || rule.displayName || ridx} className="border-b pb-2 mb-2">
                              <div className="font-medium text-gray-900">{rule.displayName}</div>
                              {rule.eventConditions && rule.eventConditions.length > 0 && (
                                <div className="text-xs text-gray-600">Conditions: {rule.eventConditions.map(c => `${c.field} ${c.comparisonType} ${c.value}`).join(', ')}</div>
                              )}
                              {rule.destinationEvent && (
                                <div className="text-xs text-gray-600">Destination Event: {rule.destinationEvent}</div>
                              )}
                              {rule.parameterMutations && rule.parameterMutations.length > 0 && (
                                <div className="text-xs text-gray-600">Parameter Mutations: {rule.parameterMutations.map(m => `${m.parameter} → ${m.parameterValue}`).join(', ')}</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500">No created events for this stream.</div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">No created event rules found.</div>
              )}
            </div>

            {/* All Other Events (Placeholder) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Other Events</h3>
              {ga4Audit.otherEvents && ga4Audit.otherEvents.length > 0 ? (
                <ul className="list-disc pl-6 text-gray-900">
                  {ga4Audit.otherEvents
                    .filter(e => e.count && e.count > 1)
                    .map((e, idx) => (
                      <li key={e.name || idx}>{e.name}</li>
                    ))}
                </ul>
              ) : (
                <div className="text-gray-500">To display all other events in the account, backend support is needed.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'integrations' && ga4Audit && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Console</h3>
              <div className="text-gray-900">{ga4Audit.searchConsoleDataStatus ? `${ga4Audit.searchConsoleDataStatus.totalClicks} clicks and ${ga4Audit.searchConsoleDataStatus.totalImpressions} impressions tracked from organic search.` : 'Not linked'}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Ads</h3>
              <div className="text-gray-900">{ga4Audit.googleAdsLinks && ga4Audit.googleAdsLinks.length > 0 ? `${ga4Audit.googleAdsLinks.length} Google Ads accounts linked for conversion tracking and optimization.` : 'No Google Ads accounts linked.'}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">BigQuery</h3>
              <div className="text-gray-900">{ga4Audit.bigQueryLinks && ga4Audit.bigQueryLinks.length > 0 ? 'BigQuery export is enabled.' : 'Not enabled - consider for advanced analysis and custom reporting needs.'}</div>
            </div>
          </div>
        )}

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
