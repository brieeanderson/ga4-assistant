'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminFixWizard from '@/components/GA4/AdminFixWizard';

const AdminFixesPageContent = () => {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
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

  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
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

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAnalyzing || isLoading) {
        setLoadingTimeout(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isAnalyzing, isLoading]);

  useEffect(() => {
    if (!propertyId || !accessToken) {
      return;
    }

    // If we already have the audit data for this property, use it immediately
    if (ga4Audit && ga4Audit.property && ga4Audit.property.name === propertyId) {
      setSelectedProperty(ga4Audit.property);
      return;
    }

    // If we have properties list, find the property
    if (ga4Properties.length > 0) {
      const property = ga4Properties.find(p => p.propertyId === propertyId);
      if (property) {
        setSelectedProperty(property);
        // Only run audit if we don't have audit data for this specific property
        if (!ga4Audit || (ga4Audit.property && ga4Audit.property.name !== propertyId)) {
          runGA4Audit(accessToken, propertyId);
        }
      } else {
        router.push('/audit/properties');
      }
    } else {
      // Fetch properties if we don't have them yet
      fetchGA4Properties(accessToken);
    }
  }, [propertyId, accessToken, ga4Properties, ga4Audit, runGA4Audit, router, fetchGA4Properties]);

  useEffect(() => {
    if (error && typeof error === 'string' && error.toLowerCase().includes('invalid or expired access token')) {
      logout();
    }
  }, [error, logout]);

  if (isLoading || isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>{isAnalyzing ? 'Preparing fix wizard...' : 'Loading...'}</p>
          {loadingTimeout && (
            <div className="mt-4 text-yellow-400">
              <p>Taking longer than expected...</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Reload Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>Please log in to access the Admin Fix Wizard.</div>
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

  // If we have audit data, render the wizard even without selected property
  if (ga4Audit) {
    return <AdminFixWizard auditData={ga4Audit} property={selectedProperty} />;
  }

  // If we have a selected property but no audit data, show a message
  if (selectedProperty && !ga4Audit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading audit data for {selectedProperty.displayName}...</p>
        </div>
      </div>
    );
  }

  // Fallback - render with whatever data we have
  return <AdminFixWizard auditData={ga4Audit || undefined} property={selectedProperty} />;
};

const AdminFixesPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <AdminFixesPageContent />
    </Suspense>
  );
};

export default AdminFixesPage; 