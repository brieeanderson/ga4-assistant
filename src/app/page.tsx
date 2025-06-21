'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Code, Zap, BookOpen, Search, Sparkles, Download } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { PropertyOverview } from '@/components/GA4/PropertyOverview';
import { ConnectionStatus } from '@/components/GA4/ConnectionStatus';
import { FundamentalsChecklist } from '@/components/GA4/FundamentalsChecklist';
import { CustomDefinitionsDisplay } from '@/components/GA4/CustomDefinitionsDisplay';
import { AttributionSettingsDisplay } from '@/components/GA4/AttributionSettingsDisplay';
import { EnhancedMeasurementAnalysis } from '@/components/GA4/EnhancedMeasurementAnalysis';
import { EventCreateRulesDisplay } from '@/components/GA4/EventCreateRulesDisplay';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { PropertyConfigScore } from '@/components/GA4/PropertyConfigScore';
import { ManualConfigChecklist } from '@/components/GA4/ManualConfigChecklist';
import { DataQualityAlerts } from '@/components/GA4/DataQualityAlerts';

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

  // Section refs (must be inside the component)
  const propertyOverviewRef = useRef<HTMLDivElement>(null);
  const fundamentalsChecklistRef = useRef<HTMLDivElement>(null);
  const attributionSettingsRef = useRef<HTMLDivElement>(null);
  const enhancedMeasurementRef = useRef<HTMLDivElement>(null);
  const customDefinitionsRef = useRef<HTMLDivElement>(null);
  const eventCreateRulesRef = useRef<HTMLDivElement>(null);
  const keyEventsDetailRef = useRef<HTMLDivElement>(null);
  const customMetricsRef = useRef<HTMLDivElement>(null);
  const dataQualityAlertsRef = useRef<HTMLDivElement>(null);
  const manualChecklistRef = useRef<HTMLDivElement>(null);

  // Helper function to scroll to a section
  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      propertyOverview: propertyOverviewRef,
      fundamentalsChecklist: fundamentalsChecklistRef,
      attributionSettings: attributionSettingsRef,
      enhancedMeasurement: enhancedMeasurementRef,
      customDefinitions: customDefinitionsRef,
      keyEventsDetail: keyEventsDetailRef,
      customMetrics: customMetricsRef,
      // NEW: Add the new component refs
      dataQualityAlerts: dataQualityAlertsRef,
      manualChecklist: manualChecklistRef,
    };
    const ref = refs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    {/* NEW: Data Quality Alerts - Show critical issues first */}
    <div ref={dataQualityAlertsRef}>
      <DataQualityAlerts 
        enhancedChecks={ga4Audit.enhancedChecks}
        onFixIssues={() => scrollToSection('manualChecklist')}
      />
    </div>

    {/* Property Overview */}
    <div ref={propertyOverviewRef}>
      <PropertyOverview audit={ga4Audit} />
    </div>

    {/* Property Configuration Score and Suggestions */}
    <PropertyConfigScore audit={ga4Audit} />
    
    {/* Complete Fundamentals Checklist */}
    <div ref={fundamentalsChecklistRef}>
      <FundamentalsChecklist audit={ga4Audit} scrollToSection={scrollToSection} />
    </div>

    {/* Attribution Settings */}
    <div ref={attributionSettingsRef}>
      <AttributionSettingsDisplay audit={ga4Audit} />
    </div>

    {/* Enhanced Measurement Analysis */}
    <div ref={enhancedMeasurementRef}>
      <EnhancedMeasurementAnalysis 
        enhancedMeasurement={ga4Audit.enhancedMeasurement}
        customDimensions={ga4Audit.customDimensions}
      />
    </div>

    {/* Custom Definitions Display */}
    <div ref={customDefinitionsRef}>
      <CustomDefinitionsDisplay 
        customDimensions={ga4Audit.customDimensions}
        customMetrics={ga4Audit.customMetrics}
      />
    </div>

    {/* NEW: Manual Configuration Checklist */}
    <div ref={manualChecklistRef}>
      <ManualConfigChecklist 
        enhancedChecks={ga4Audit.enhancedChecks}
        onScoreUpdate={(score) => {
          console.log('Manual checklist score updated:', score);
          // You can add logic here to update overall audit score
        }}
      />
    </div>

    {/* Data Export Section */}
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6">Export Audit Results</h3>
      <p className="text-gray-300 mb-6">
        Save your complete GA4 audit results for future reference or sharing with your team.
      </p>
      <button
        onClick={() => {
          const dataStr = JSON.stringify(ga4Audit, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ga4-audit-${ga4Audit.property.displayName}-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Audit Results
      </button>
    </div>
  </>
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
              The GA4 Playbook
            </h2>
            <p className="text-gray-400">Comprehensive guides coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
