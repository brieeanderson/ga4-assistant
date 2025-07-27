'use client';
import React, { useState, useEffect } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Globe, Search } from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const PropertiesPage = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, accessToken, logout, isLoading } = useOAuth();
  const router = useRouter();
  const {
    ga4Properties,
    isAnalyzing,
    error,
    ga4Audit,
    fetchGA4Properties,
    runGA4Audit,
    clearError,
    clearAuditStateExceptSelected
  } = useGA4Audit();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/audit');
      return;
    }

    if (isAuthenticated && accessToken && ga4Properties.length === 0) {
      fetchGA4Properties(accessToken);
    }
  }, [isAuthenticated, isLoading, accessToken, ga4Properties.length, fetchGA4Properties, router]);

  // Prevent clearing state if we're about to navigate
  const shouldClearState = !selectedProperty || !ga4Audit;

  // Clear any previously selected property and audit state when this page loads
  useEffect(() => {
    console.log('Properties page loaded - clearing state');
    if (shouldClearState) {
      setSelectedProperty(null);
      clearAuditStateExceptSelected();
    }
  }, [shouldClearState, clearAuditStateExceptSelected]); // Only run when shouldClearState changes

  useEffect(() => {
    if (selectedProperty && accessToken) {
      runGA4Audit(accessToken, selectedProperty.propertyId);
    }
  }, [selectedProperty, accessToken, runGA4Audit]);

  // Navigate to results page when audit is complete
  useEffect(() => {
    console.log('Navigation effect triggered:', {
      selectedProperty: selectedProperty?.propertyId,
      isAnalyzing,
      hasGA4Audit: !!ga4Audit,
      ga4AuditKeys: ga4Audit ? Object.keys(ga4Audit) : null
    });
    
    if (selectedProperty && !isAnalyzing && ga4Audit) {
      console.log('Navigating to results page:', `/audit/properties/${selectedProperty.propertyId}`);
      // Use replace instead of push to avoid back button issues
      router.replace(`/audit/properties/${selectedProperty.propertyId}`);
    }
  }, [selectedProperty, isAnalyzing, ga4Audit, router]);

  useEffect(() => {
    if (error && typeof error === 'string' && error.toLowerCase().includes('invalid or expired access token')) {
      logout();
    }
  }, [error, logout]);

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
  };

  const filteredProperties = ga4Properties.filter((property: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      property.displayName?.toLowerCase().includes(searchLower) ||
      property.propertyId?.toLowerCase().includes(searchLower) ||
      property.measurementId?.toLowerCase().includes(searchLower) ||
      property.accountName?.toLowerCase().includes(searchLower)
    );
  });

  const propertiesByAccount: Record<string, any[]> = filteredProperties.reduce((acc: Record<string, any[]>, prop: any) => {
    const account = prop.accountName || 'Unknown Account';
    if (!acc[account]) acc[account] = [];
    acc[account].push(prop);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Running audit on {selectedProperty?.displayName || 'your property'}...</p>
          <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-red-900 text-red-200 p-6 rounded-xl max-w-md">
          <div className="font-semibold mb-2">Error</div>
          <div className="mb-4">{error}</div>
          <button className="px-4 py-2 bg-red-700 rounded hover:bg-red-600" onClick={clearError}>
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/audit"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Audit</span>
              </Link>
            </div>
            <div className="text-white font-semibold">Select Property to Audit</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Audit', href: '/audit' },
              { label: 'Select Property' }
            ]}
          />
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Choose a GA4 Property</h1>
          <p className="text-gray-400">
            Select the Google Analytics 4 property you'd like to audit. We'll analyze your configuration 
            and provide detailed recommendations.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties, accounts, or measurement IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-6">
          {Object.entries(propertiesByAccount).length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No properties found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Loading your GA4 properties...'}
              </p>
            </div>
          ) : (
            Object.entries(propertiesByAccount).map(([accountName, properties]) => (
              <div key={accountName} className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-orange-400">{accountName}</h3>
                  <span className="text-sm text-gray-500">({properties.length} properties)</span>
                </div>
                
                <div className="space-y-3">
                  {properties.map((property: any) => (
                    <div
                      key={property.propertyId}
                      className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-4 py-4 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-blue-400" />
                          <div>
                            <div className="font-medium text-white">
                              {property.displayName || property.propertyId}
                            </div>
                            <div className="text-sm text-gray-400">
                              {property.measurementId ? (
                                <>Measurement ID: {property.measurementId}</>
                              ) : (
                                <>Property ID: {property.propertyId}</>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="ml-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold transition-all duration-200"
                        onClick={() => handlePropertySelect(property)}
                      >
                        Audit Property
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="text-blue-400 font-semibold mb-1">About the Audit</h4>
              <p className="text-gray-300 text-sm">
                Our audit will analyze your GA4 configuration across privacy, data quality, integrations, and tracking. 
                The process takes about 30-60 seconds and provides actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage; 