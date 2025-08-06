'use client';
import React, { useEffect, useState } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { useRouter, useParams } from 'next/navigation';
import { Clock } from 'lucide-react';

import GA4Dashboard from '@/components/GA4/GA4Dashboard';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const AuditResultsPage = () => {
  const { propertyId } = useParams();
  const { isAuthenticated, accessToken, logout, isLoading } = useOAuth();
  const router = useRouter();
  
  const {
    ga4Properties,
    ga4Audit,
    isAnalyzing,
    error,
    fetchGA4Properties,
    runGA4Audit,
    clearError
  } = useGA4Audit();

  console.log('AuditResultsPage rendered:', {
    propertyId,
    isLoading,
    isAuthenticated,
    hasAccessToken: !!accessToken,
    ga4PropertiesLength: ga4Properties.length,
    hasGA4Audit: !!ga4Audit,
    ga4AuditPropertyName: ga4Audit?.property?.name
  });

  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  useEffect(() => {
    // Wait for authentication to load before making any decisions
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/audit');
      return;
    }

    if (isAuthenticated && accessToken && ga4Properties.length === 0) {
      fetchGA4Properties(accessToken);
    }
  }, [isLoading, isAuthenticated, accessToken, ga4Properties.length, fetchGA4Properties, router]);

  useEffect(() => {
    if (propertyId) {
      // If we already have the audit data, we can use it
      if (ga4Audit) {
        console.log('Using existing audit data for property:', propertyId);
        // Try to find the property in the list, or create a basic one from audit data
        const property = ga4Properties.find(p => p.propertyId === propertyId);
        if (property) {
          setSelectedProperty(property);
        } else if (ga4Audit.property) {
          setSelectedProperty(ga4Audit.property);
        }
        return;
      }

      // If we have properties list, find the property
      if (ga4Properties.length > 0) {
        const property = ga4Properties.find(p => p.propertyId === propertyId);
        if (property) {
          setSelectedProperty(property);
          if (!ga4Audit) {
            runGA4Audit(accessToken!, propertyId as string);
          }
        } else {
          console.log('Property not found in list, redirecting to properties page');
          router.push('/audit/properties');
        }
      } else if (accessToken) {
        // If we don't have properties list yet, fetch them
        console.log('Fetching properties list for property:', propertyId);
        fetchGA4Properties(accessToken);
      }
    }
  }, [ga4Properties, propertyId, ga4Audit, accessToken, runGA4Audit, router, fetchGA4Properties]);

  useEffect(() => {
    if (error && typeof error === 'string' && error.toLowerCase().includes('invalid or expired access token')) {
      logout();
    }
  }, [error, logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading authentication...</p>
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
          <p>{selectedProperty ? `Running audit on ${selectedProperty.displayName}...` : 'Loading your accounts...'}</p>
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

  if (!selectedProperty || !ga4Audit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p>Loading audit results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Audit', href: '/audit' },
              { label: 'Properties', href: '/audit/properties' },
              { label: selectedProperty?.displayName || 'Results' }
            ]}
          />
        </div>
        
        <GA4Dashboard
          auditData={ga4Audit}
          property={selectedProperty}
          onChangeProperty={() => router.push('/audit/properties')}
          onRefresh={() => {
            if (accessToken && propertyId) {
              runGA4Audit(accessToken, propertyId as string);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AuditResultsPage; 