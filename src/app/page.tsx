'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { ConnectionStatus } from '@/components/GA4/ConnectionStatus';
import GA4AuditResults from '@/components/GA4/GA4AuditResults';
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
                {/* New unified audit results UI */}
                <GA4AuditResults audit={ga4Audit} />
                {/*
                  In the future, add sections for:
                  - Data Quality Alerts
                  - Property Configuration Score
                  - Property Overview
                  - Fundamentals Checklist
                  - Attribution Settings
                  - Enhanced Measurement Analysis
                  - Custom Definitions Display
                  - Event Create Rules
                  - Manual Configuration Checklist
                */}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GA4GTMAssistant;
