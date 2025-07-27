import { useState, useCallback, useMemo } from 'react';
import { GA4Property, GA4Audit, WebsiteAnalysis } from '@/types/ga4';

export const useGA4Audit = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ga4Properties, setGA4Properties] = useState<GA4Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [ga4Audit, setGA4Audit] = useState<GA4Audit | null>(null);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Memoize expensive calculations
  const complianceScore = useMemo(() => {
    if (!ga4Audit) return 0;
    
    let score = 0;
    const total = 8;
    
    // Property Configuration
    if (ga4Audit.property.timeZone && ga4Audit.property.currencyCode) score += 1;
    
    // Data Retention  
    if (ga4Audit.dataRetention.eventDataRetention === "FOURTEEN_MONTHS") score += 1;
    
    // Enhanced Measurement
    if (ga4Audit.enhancedMeasurement.length > 0) score += 1;
    
    // Key Events
    if (ga4Audit.keyEvents.length >= 1) score += 1;
    
    // Custom Definitions
    if (ga4Audit.customDimensions.length > 0) score += 1;
    
    // Google Ads Integration
    if (ga4Audit.googleAdsLinks.length > 0) score += 1;
    
    // Search Console
    if (ga4Audit.searchConsoleDataStatus.isLinked) score += 1;
    
    // Attribution Model
    if (ga4Audit.attribution.reportingAttributionModel) score += 1;
    
    return Math.round((score / total) * 100);
  }, [ga4Audit]);

  const fetchGA4Properties = useCallback(async (accessToken: string) => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.type === 'property_list') {
        setGA4Properties(result.properties || []);
        if (result.properties?.length === 0) {
          setError('No GA4 properties found. Make sure you have access to GA4 properties with this Google account.');
        }
      } else {
        throw new Error('Unexpected response format from GA4 audit function');
      }
    } catch (error) {
      console.error('Error fetching GA4 properties:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch GA4 properties';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const runGA4Audit = useCallback(async (accessToken: string, propertyId: string) => {
    if (!propertyId || !accessToken) {
      setError('Please select a property and ensure you are authenticated');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/ga4-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, propertyId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Setting GA4 audit result:', {
        hasResult: !!result,
        resultKeys: Object.keys(result || {}),
        propertyName: result?.property?.displayName
      });
      setGA4Audit(result);
      
      console.log('GA4 Audit completed successfully:', {
        propertyName: result.property?.displayName,
        dataStreams: result.dataStreams?.length,
        customDimensions: result.customDimensions?.length,
        keyEvents: result.keyEvents?.length
      });
      
      // Audit completed - let the component handle navigation
      
    } catch (error) {
      console.error('Error running GA4 audit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to run GA4 audit';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeWebsite = useCallback(async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a website URL to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8888' : '';
      const response = await fetch(`${baseUrl}/.netlify/functions/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: url.trim(),
          crawlMode: 'single'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setWebsiteAnalysis(result);
      
      console.log('Website analysis completed:', {
        domain: result.domain,
        gtmFound: result.currentSetup?.gtmInstalled,
        ga4Found: result.currentSetup?.ga4Connected
      });
      
    } catch (error) {
      console.error('Error analyzing website:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze website';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAuditState = useCallback(() => {
    console.log('Clearing audit state');
    setSelectedProperty('');
    setGA4Audit(null);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  const clearAuditStateExceptSelected = useCallback(() => {
    console.log('Clearing audit state except selected property');
    setGA4Audit(null);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  return {
    // State
    isAnalyzing,
    ga4Properties,
    selectedProperty,
    ga4Audit,
    websiteAnalysis,
    websiteUrl,
    error,
    complianceScore,
    
    // Actions
    setSelectedProperty,
    setWebsiteUrl,
    fetchGA4Properties,
    runGA4Audit,
    analyzeWebsite,
    clearError,
    clearAuditState,
    clearAuditStateExceptSelected,
    setError
  };
};
