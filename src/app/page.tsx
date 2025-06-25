'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
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

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'events', label: 'Events' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'manual', label: 'Manual Review' },
];

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
      eventCreateRules: eventCreateRulesRef,
      dataQualityAlerts: dataQualityAlertsRef,
      manualChecklist: manualChecklistRef,
    };
    const ref = refs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-2xl bg-black/50 p-2 border border-gray-700">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="font-semibold">GA4 Audit</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorDisplay error={error} onDismiss={clearError} />
        )}

        {/* GA4 Audit Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-8">
            
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

            {/* Show audit results when available */}
            {ga4Audit && (
              <>
                {/* Data Quality Alerts - Show critical issues first */}
                <div ref={dataQualityAlertsRef}>
                  <DataQualityAlerts 
                    audit={ga4Audit}
                    onFixIssues={() => scrollToSection('manualChecklist')}
                  />
                </div>

                {/* Property Configuration Score */}
                <PropertyConfigScore audit={ga4Audit} />

                {/* Property Overview */}
                <div ref={propertyOverviewRef}>
                  <PropertyOverview audit={ga4Audit} />
                </div>

                {/* Fundamentals Checklist */}
                <div ref={fundamentalsChecklistRef}>
                  <FundamentalsChecklist audit={ga4Audit} scrollToSection={scrollToSection} />
                </div>

                {/* Attribution Settings */}
                <div ref={attributionSettingsRef}>
                  <AttributionSettingsDisplay audit={ga4Audit} />
                </div>

                {/* Enhanced Measurement Analysis */}
                <div ref={enhancedMeasurementRef}>
                  <EnhancedMeasurementAnalysis audit={ga4Audit} />
                </div>

                {/* Custom Definitions Display */}
                <div ref={customDefinitionsRef}>
                  <CustomDefinitionsDisplay 
                    audit={ga4Audit} 
                    keyEventsDetailRef={keyEventsDetailRef}
                    customMetricsRef={customMetricsRef}
                  />
                </div>

                {/* Event Create Rules */}
                <div ref={eventCreateRulesRef}>
                  <EventCreateRulesDisplay audit={ga4Audit} />
                </div>

                {/* Manual Configuration Checklist */}
                <div ref={manualChecklistRef}>
                  <ManualConfigChecklist audit={ga4Audit} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
