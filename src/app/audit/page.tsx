'use client';

import React, { useState, useEffect } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import GA4Dashboard from '../../components/GA4/GA4Dashboard';

const AuditPage = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { isAuthenticated, accessToken } = useOAuth();
  const {
    ga4Properties,
    ga4Audit,
    isAnalyzing,
    error,
    fetchGA4Properties,
    runGA4Audit,
    clearError
  } = useGA4Audit();

  useEffect(() => {
    if (isAuthenticated && accessToken && ga4Properties.length === 0) {
      fetchGA4Properties(accessToken);
    }
  }, [isAuthenticated, accessToken, ga4Properties.length, fetchGA4Properties]);

  useEffect(() => {
    if (selectedProperty && accessToken) {
      runGA4Audit(accessToken, selectedProperty.propertyId);
    }
  }, [selectedProperty, accessToken, runGA4Audit]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>Please log in to access the GA4 Audit Dashboard.</div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>Loading audit data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-red-900 text-red-200 p-6 rounded-xl">
          <div>Error: {error}</div>
          <button className="mt-4 px-4 py-2 bg-red-700 rounded" onClick={clearError}>Dismiss</button>
        </div>
      </div>
    );
  }

  if (isAuthenticated && ga4Properties.length > 0 && !selectedProperty) {
    const propertiesByAccount = ga4Properties.reduce((acc: any, prop: any) => {
      const account = prop.accountName || 'Unknown Account';
      if (!acc[account]) acc[account] = [];
      acc[account].push(prop);
      return acc;
    }, {});
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-2xl w-full">
          <h3 className="text-xl font-bold text-white mb-6">Select a GA4 Property to Audit</h3>
          {(Object.entries(propertiesByAccount) as [string, any[]][]).map(([accountName, properties]) => (
            <div key={accountName} className="mb-8">
              <div className="text-lg font-semibold text-orange-400 mb-2">{accountName}</div>
              <ul className="space-y-3">
                {properties.map((property) => (
                  <li key={property.propertyId} className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                    <div>
                      <div className="font-medium text-white">{property.displayName || property.propertyId}</div>
                      <div className="text-xs text-slate-400">
                        {property.measurementId ? `Measurement ID: ${property.measurementId}` : `Property ID: ${property.propertyId}`}
                      </div>
                    </div>
                    <button
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded hover:from-orange-600 hover:to-red-600 font-semibold"
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

  if (isAuthenticated && selectedProperty && ga4Audit) {
    return (
      <GA4Dashboard
        auditData={ga4Audit}
        property={selectedProperty}
        onChangeProperty={() => setSelectedProperty(null)}
      />
    );
  }

  return null;
};

export default AuditPage; 