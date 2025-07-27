'use client';
import React, { useEffect, useState } from 'react';
import { useOAuth } from '@/hooks/useOAuth';
import { useGA4Audit } from '@/hooks/useGA4Audit';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Shield, BarChart3, Globe, Users, Home, Clock } from 'lucide-react';
import Link from 'next/link';
import GA4Dashboard from '@/components/GA4/GA4Dashboard';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const AuditResultsPage = () => {
  const { propertyId } = useParams();
  const { isAuthenticated, accessToken, logout } = useOAuth();
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/audit');
      return;
    }

    if (isAuthenticated && accessToken && ga4Properties.length === 0) {
      fetchGA4Properties(accessToken);
    }
  }, [isAuthenticated, accessToken, ga4Properties.length, fetchGA4Properties, router]);

  useEffect(() => {
    if (ga4Properties.length > 0 && propertyId) {
      const property = ga4Properties.find(p => p.propertyId === propertyId);
      if (property) {
        setSelectedProperty(property);
        if (!ga4Audit) {
          runGA4Audit(accessToken!, propertyId as string);
        }
      } else {
        router.push('/audit/properties');
      }
    }
  }, [ga4Properties, propertyId, ga4Audit, accessToken, runGA4Audit, router]);

  useEffect(() => {
    if (error && typeof error === 'string' && error.toLowerCase().includes('invalid or expired access token')) {
      logout();
    }
  }, [error, logout]);

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
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/audit/properties"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Properties</span>
              </Link>
            </div>
            <div className="text-white font-semibold">
              Audit Results: {selectedProperty.displayName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <Link
              href={`/audit/properties/${propertyId}`}
              className="flex items-center space-x-2 py-4 px-1 border-b-2 border-blue-500 text-blue-400 font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link
              href={`/audit/properties/${propertyId}/privacy`}
              className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-300 hover:text-white font-medium"
            >
              <Shield className="h-4 w-4" />
              <span>Privacy & Compliance</span>
            </Link>
            <Link
              href={`/audit/properties/${propertyId}/data-quality`}
              className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-300 hover:text-white font-medium"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Data Quality</span>
            </Link>
            <Link
              href={`/audit/properties/${propertyId}/integrations`}
              className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-300 hover:text-white font-medium"
            >
              <Globe className="h-4 w-4" />
              <span>Integrations</span>
            </Link>
            <Link
              href={`/audit/properties/${propertyId}/tracking`}
              className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-300 hover:text-white font-medium"
            >
              <Users className="h-4 w-4" />
              <span>User Tracking</span>
            </Link>
          </nav>
        </div>
      </div>

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
        />
      </div>
    </div>
  );
};

export default AuditResultsPage; 