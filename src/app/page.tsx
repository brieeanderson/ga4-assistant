'use client';

import React, { useState, useEffect } from 'react';
import { Send, Code, Zap, BookOpen, Search, Sparkles } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { PropertyOverview } from '@/components/GA4/PropertyOverview';
import { ConnectionStatus } from '@/components/GA4/ConnectionStatus';
import { FundamentalsChecklist } from '@/components/GA4/FundamentalsChecklist';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

const GA4GTMAssistant = () => {
  const [activeTab, setActiveTab] = useState('audit');
  
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
    isAnalyzing,
    ga4Properties,
    selectedProperty,
    ga4Audit,
    error,
    setSelectedProperty,
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

  // Wrapper functions for connection status component
  const handleFetchGA4Properties = () => {
    if (accessToken) {
      fetchGA4Properties(accessToken);
    }
  };

  const handleRunGA4Audit = () => {
    if (accessToken && selectedProperty) {
      runGA4Audit(accessToken, selectedProperty);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Error Display */}
      {error && (
        <ErrorDisplay error={error} onDismiss={clearError} />
      )}

      {/* Header */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-orange-500/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wide">GA4 BEAST</h1>
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
              Make Your Analytics Work 💪
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-800">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'audit', label: 'Analytics Audit', icon: Search },
              { id: 'chat', label: 'Beast Assistant', icon: Send },
              { id: 'implement', label: 'Code Generator', icon: Code },
              { id: 'docs', label: 'The Playbook', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-6 px-1 border-b-2 font-bold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'audit' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center bg-black/80 backdrop-blur-xl rounded-3xl p-12 border border-orange-500/30 shadow-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Discover the Hidden GA4 Settings<br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Sabotaging Your Data Quality!
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Your free GA4 setup audit reveals if you're accidentally deleting data after 2 months, 
                what your ✨ actual ✨ attribution model is, and where that video_progress event is coming from.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                <strong className="text-orange-400">No More Guessing What's Broken</strong> - Get a detailed roadmap for better data.
              </p>
            </div>

            {/* Connection Status */}
            <ConnectionStatus
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              login={login}
              logout={logout}
              ga4Properties={ga4Properties}
              selectedProperty={selectedProperty}
              setSelectedProperty={setSelectedProperty}
              isAnalyzing={isAnalyzing}
              fetchGA4Properties={handleFetchGA4Properties}
              runGA4Audit={handleRunGA4Audit}
              oauthLoading={oauthLoading}
            />

            {/* GA4 Analysis Results */}
            {ga4Audit && (
              <>
                {/* Property Overview */}
                <PropertyOverview audit={ga4Audit} />
                
                {/* Complete Fundamentals Checklist */}
                <FundamentalsChecklist audit={ga4Audit} />

                {/* Additional Details Section */}
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-6">Additional Configuration Details</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Enhanced Measurement Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Enhanced Measurement Events</h4>
                      {ga4Audit.enhancedMeasurement.length > 0 ? (
                        <div className="space-y-3">
                          {ga4Audit.enhancedMeasurement.map((stream, index) => {
                            const enabledEvents = [];
                            const settings = stream.settings;
                            
                            if (settings.scrollsEnabled) enabledEvents.push('scroll');
                            if (settings.outboundClicksEnabled) enabledEvents.push('outbound_clicks');
                            if (settings.siteSearchEnabled) enabledEvents.push('site_search');
                            if (settings.videoEngagementEnabled) enabledEvents.push('video_engagement');
                            if (settings.fileDownloadsEnabled) enabledEvents.push('file_downloads');
                            if (settings.formInteractionsEnabled) enabledEvents.push('form_interactions');
                            if (settings.pageChangesEnabled) enabledEvents.push('page_changes');
                            
                            return (
                              <div key={index} className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                                <div className="font-medium text-white mb-2">{stream.streamName}</div>
                                <div className="text-sm text-gray-300">
                                  Active: {enabledEvents.length > 0 ? enabledEvents.join(', ') : 'None'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {enabledEvents.length}/7 possible events enabled
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 bg-black/30 rounded-lg p-4 border border-gray-700/50">
                          No enhanced measurement configuration found. Enable in your data stream settings.
                        </div>
                      )}
                    </div>

                    {/* Custom Definitions Summary */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Custom Definitions Summary</h4>
                      
                      <div className="space-y-3">
                        <div className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">Custom Dimensions</span>
                            <span className="text-sm text-gray-400">{ga4Audit.customDimensions.length}/50</span>
                          </div>
                          {ga4Audit.customDimensions.length > 0 ? (
                            <div className="text-sm text-gray-300">
                              Recent: {ga4Audit.customDimensions.slice(0, 3).map(d => d.displayName).join(', ')}
                              {ga4Audit.customDimensions.length > 3 && ` +${ga4Audit.customDimensions.length - 3} more`}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">No custom dimensions configured</div>
                          )}
                        </div>

                        <div className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">Custom Metrics</span>
                            <span className="text-sm text-gray-400">{ga4Audit.customMetrics.length}/50</span>
                          </div>
                          {ga4Audit.customMetrics.length > 0 ? (
                            <div className="text-sm text-gray-300">
                              Recent: {ga4Audit.customMetrics.slice(0, 3).map(m => m.displayName).join(', ')}
                              {ga4Audit.customMetrics.length > 3 && ` +${ga4Audit.customMetrics.length - 3} more`}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">No custom metrics configured</div>
                          )}
                        </div>

                        <div className="bg-black/50 rounded-lg p-4 border border-gray-600/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">Key Events</span>
                            <span className="text-sm text-gray-400">{ga4Audit.keyEvents.length} configured</span>
                          </div>
                          {ga4Audit.keyEvents.length > 0 ? (
                            <div className="text-sm text-gray-300">
                              {ga4Audit.keyEvents.map(e => e.eventName).slice(0, 3).join(', ')}
                              {ga4Audit.keyEvents.length > 3 && ` +${ga4Audit.keyEvents.length - 3} more`}
                            </div>
                          ) : (
                            <div className="text-sm text-red-400">⚠️ No key events configured - critical for conversion tracking</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Other tabs with simplified content */}
        {activeTab === 'chat' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Send className="w-7 h-7 mr-3 text-orange-400" />
              Beast Analytics Assistant
            </h2>
            <p className="text-gray-400">Chat functionality coming soon...</p>
          </div>
        )}

        {activeTab === 'implement' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Code className="w-7 h-7 mr-3 text-orange-400" />
              GA4 Code Generator
            </h2>
            <p className="text-gray-400">Code generation tools coming soon...</p>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-7 h-7 mr-3 text-orange-400" />
              The Beast Playbook
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Quick Start Guide</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Connect your GA4 account for a complete audit</li>
                  <li>• Review fundamentals checklist and priority fixes</li>
                  <li>• Configure custom dimensions and metrics</li>
                  <li>• Set up key events for conversion tracking</li>
                  <li>• Link Google Ads and Search Console</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">2025 Best Practices</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Set data retention to 14 months immediately</li>
                  <li>• Use data-driven attribution model</li>
                  <li>• Enable enhanced measurement events</li>
                  <li>• Register custom parameters as dimensions</li>
                  <li>• Configure proper timezone for your business</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
