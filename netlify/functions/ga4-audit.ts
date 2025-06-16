import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { accessToken, propertyId } = JSON.parse(event.body || '{}');
    
    if (!accessToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Access token required' }),
      };
    }

    console.log('=== COMPREHENSIVE GA4 AUDIT v5.1 - 2025 EDITION ===');
    console.log('PropertyId provided:', !!propertyId);

    // Test the access token first
    const testResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!testResponse.ok) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid or expired access token'
        }),
      };
    }

    const userInfo = await testResponse.json();

    // If no propertyId provided, get the user's accounts and properties
    if (!propertyId) {
      try {
        const accountsResponse = await fetch(
          'https://analyticsadmin.googleapis.com/v1beta/accounts',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!accountsResponse.ok) {
          const errorText = await accountsResponse.text();
          return {
            statusCode: accountsResponse.status,
            headers,
            body: JSON.stringify({ 
              error: `Failed to fetch accounts: ${accountsResponse.status}`,
              details: errorText
            }),
          };
        }

        const accountsData = await accountsResponse.json();
        
        // Get properties for each account
        let allProperties: any[] = [];
        
        if (accountsData.accounts && accountsData.accounts.length > 0) {
          const accountsToProcess = accountsData.accounts.slice(0, 3);
          
          for (const account of accountsToProcess) {
            try {
              const propertiesUrl = `https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:${account.name}`;
              
              const propertiesResponse = await fetch(propertiesUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                }
              });

              if (propertiesResponse.ok) {
                const propertiesData = await propertiesResponse.json();
                
                if (propertiesData.properties && propertiesData.properties.length > 0) {
                  const propertiesWithAccount = propertiesData.properties.map((property: any) => ({
                    ...property,
                    accountName: account.displayName,
                    accountId: account.name,
                    propertyId: property.name ? property.name.split('/').pop() : property.id
                  }));
                  allProperties.push(...propertiesWithAccount);
                }
              }
            } catch (error) {
              console.error(`Error fetching properties for ${account.name}:`, error);
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            type: 'property_list',
            accounts: accountsData.accounts || [],
            properties: allProperties,
            userInfo: userInfo
          }),
        };

      } catch (accountsError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'Failed to fetch GA4 accounts',
            details: accountsError instanceof Error ? accountsError.message : 'Unknown error'
          }),
        };
      }
    }

    // COMPREHENSIVE PROPERTY AUDIT WITH REAL API CALLS
    console.log(`Starting comprehensive audit for property: ${propertyId}`);
    
    // Build all API calls for parallel execution
    const apiCalls = [
      // Basic property info (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Data streams (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Key events (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/keyEvents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Data retention settings (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataRetentionSettings`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Attribution settings (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/attributionSettings`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Google Signals settings (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/googleSignalsSettings`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Google Ads links (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/googleAdsLinks`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // BigQuery links (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/bigQueryLinks`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Connected site tags (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/connectedSiteTags`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Search Console links (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/searchConsoleLinks`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Custom dimensions (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/customDimensions`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Custom metrics (v1beta)
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/customMetrics`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
    ];

    // Execute all API calls in parallel
    const results = await Promise.allSettled(apiCalls);
    
    // Parse results
    const [
      propertyResult,
      dataStreamsResult,
      keyEventsResult,
      dataRetentionResult,
      attributionResult,
      googleSignalsResult,
      googleAdsLinksResult,
      bigQueryLinksResult,
      connectedSiteTagsResult,
      searchConsoleLinksResult,
      customDimensionsResult,
      customMetricsResult
    ] = results;

    // Extract data from successful calls
    const propertyData = propertyResult.status === 'fulfilled' && propertyResult.value.ok 
      ? await propertyResult.value.json() : {};
    
    const dataStreams = dataStreamsResult.status === 'fulfilled' && dataStreamsResult.value.ok 
      ? await dataStreamsResult.value.json() : { dataStreams: [] };
    
    const keyEvents = keyEventsResult.status === 'fulfilled' && keyEventsResult.value.ok 
      ? await keyEventsResult.value.json() : { keyEvents: [] };
    
    const dataRetention = dataRetentionResult.status === 'fulfilled' && dataRetentionResult.value.ok 
      ? await dataRetentionResult.value.json() : {};
    
    const attribution = attributionResult.status === 'fulfilled' && attributionResult.value.ok 
      ? await attributionResult.value.json() : {};
    
    const googleSignals = googleSignalsResult.status === 'fulfilled' && googleSignalsResult.value.ok 
      ? await googleSignalsResult.value.json() : {};
    
    const googleAdsLinks = googleAdsLinksResult.status === 'fulfilled' && googleAdsLinksResult.value.ok 
      ? await googleAdsLinksResult.value.json() : { googleAdsLinks: [] };
    
    const bigQueryLinks = bigQueryLinksResult.status === 'fulfilled' && bigQueryLinksResult.value.ok 
      ? await bigQueryLinksResult.value.json() : { bigQueryLinks: [] };
    
    const connectedSiteTags = connectedSiteTagsResult.status === 'fulfilled' && connectedSiteTagsResult.value.ok 
      ? await connectedSiteTagsResult.value.json() : { connectedSiteTags: [] };
    
    const searchConsoleLinks = searchConsoleLinksResult.status === 'fulfilled' && searchConsoleLinksResult.value.ok 
      ? await searchConsoleLinksResult.value.json() : { searchConsoleLinks: [] };
    
    const customDimensions = customDimensionsResult.status === 'fulfilled' && customDimensionsResult.value.ok 
      ? await customDimensionsResult.value.json() : { customDimensions: [] };
    
    const customMetrics = customMetricsResult.status === 'fulfilled' && customMetricsResult.value.ok 
      ? await customMetricsResult.value.json() : { customMetrics: [] };

    // Get enhanced measurement settings for web streams
    const enhancedMeasurementDetails = await getEnhancedMeasurementForStreams(
      accessToken, 
      propertyId, 
      dataStreams.dataStreams || []
    );

    // Get measurement protocol secrets for web streams
    const measurementProtocolSecrets = await getMeasurementProtocolSecrets(
      accessToken, 
      propertyId, 
      dataStreams.dataStreams || []
    );

    // Get event create rules for all data streams
    const eventCreateRules = await getEventCreateRulesForStreams(
      accessToken, 
      propertyId, 
      dataStreams.dataStreams || []
    );

    // UPDATED: Check for Search Console data availability with proper dimensions
    const searchConsoleDataStatus = await checkSearchConsoleDataAvailability(
      accessToken,
      propertyId,
      searchConsoleLinks.searchConsoleLinks || []
    );

    // Build comprehensive audit
    const audit = {
      property: propertyData,
      dataStreams: dataStreams.dataStreams || [],
      keyEvents: keyEvents.keyEvents || [],
      dataRetention,
      attribution,
      googleSignals,
      googleAdsLinks: googleAdsLinks.googleAdsLinks || [],
      bigQueryLinks: bigQueryLinks.bigQueryLinks || [],
      connectedSiteTags: connectedSiteTags.connectedSiteTags || [],
      searchConsoleLinks: searchConsoleLinks.searchConsoleLinks || [],
      customDimensions: customDimensions.customDimensions || [],
      customMetrics: customMetrics.customMetrics || [],
      enhancedMeasurement: enhancedMeasurementDetails,
      measurementProtocolSecrets,
      eventCreateRules,
      searchConsoleDataStatus,
      audit: buildComprehensiveAudit({
        propertyData,
        dataStreams: dataStreams.dataStreams || [],
        keyEvents: keyEvents.keyEvents || [],
        dataRetention,
        attribution,
        googleSignals,
        googleAdsLinks: googleAdsLinks.googleAdsLinks || [],
        bigQueryLinks: bigQueryLinks.bigQueryLinks || [],
        connectedSiteTags: connectedSiteTags.connectedSiteTags || [],
        searchConsoleLinks: searchConsoleLinks.searchConsoleLinks || [],
        customDimensions: customDimensions.customDimensions || [],
        customMetrics: customMetrics.customMetrics || [],
        enhancedMeasurement: enhancedMeasurementDetails,
        measurementProtocolSecrets,
        eventCreateRules,
        searchConsoleDataStatus
      }),
      userInfo
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(audit),
    };

  } catch (error) {
    console.error('GA4 audit error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'GA4 audit failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

// Helper function to get enhanced measurement settings for all web streams
async function getEnhancedMeasurementForStreams(accessToken: string, propertyId: string, streams: Array<Record<string, unknown>>) {
  const webStreams = streams.filter(stream => stream.type === 'WEB_DATA_STREAM');
  const enhancedMeasurementData: Array<Record<string, unknown>> = [];
  
  for (const stream of webStreams) {
    try {
      const streamId = (stream.name as string)?.split('/').pop();
      const response = await fetch(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/dataStreams/${streamId}/enhancedMeasurementSettings`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (response.ok) {
        const settings = await response.json();
        enhancedMeasurementData.push({
          streamId,
          streamName: stream.displayName,
          settings
        });
      }
    } catch (error) {
      console.error(`Error fetching enhanced measurement for stream ${stream.name}:`, error);
    }
  }
  
  return enhancedMeasurementData;
}

// Helper function to get measurement protocol secrets
async function getMeasurementProtocolSecrets(accessToken: string, propertyId: string, streams: Array<Record<string, unknown>>) {
  const secretsData: Array<Record<string, unknown>> = [];
  
  for (const stream of streams) {
    try {
      const streamId = (stream.name as string)?.split('/').pop();
      const response = await fetch(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/dataStreams/${streamId}/measurementProtocolSecrets`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (response.ok) {
        const secrets = await response.json();
        if (secrets.measurementProtocolSecrets && secrets.measurementProtocolSecrets.length > 0) {
          secretsData.push({
            streamId,
            streamName: stream.displayName,
            secrets: secrets.measurementProtocolSecrets.map((secret: Record<string, unknown>) => ({
              displayName: secret.displayName,
              // Don't include the actual secret value for security
            }))
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching measurement protocol secrets for stream ${stream.name}:`, error);
    }
  }
  
  return secretsData;
}

// Helper function to get event create rules for all streams
async function getEventCreateRulesForStreams(accessToken: string, propertyId: string, streams: Array<Record<string, unknown>>) {
  const eventCreateRulesData: Array<Record<string, unknown>> = [];
  
  for (const stream of streams) {
    try {
      const streamId = (stream.name as string)?.split('/').pop();
      const response = await fetch(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/dataStreams/${streamId}/eventCreateRules`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (response.ok) {
        const rules = await response.json();
        if (rules.eventCreateRules && rules.eventCreateRules.length > 0) {
          eventCreateRulesData.push({
            streamId,
            streamName: stream.displayName,
            rules: rules.eventCreateRules
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching event create rules for stream ${stream.name}:`, error);
    }
  }
  
  return eventCreateRulesData;
}

// ENHANCED: Search Console data availability check with multiple fallback methods
async function checkSearchConsoleDataAvailability(accessToken: string, propertyId: string, searchConsoleLinks: Array<Record<string, unknown>>) {
  const searchConsoleStatus = {
    isLinked: searchConsoleLinks.length > 0,
    hasData: false,
    lastDataDate: null as string | null,
    linkDetails: searchConsoleLinks,
    totalClicks: 0,
    totalImpressions: 0,
    organicImpressions: 0,
    dataMethod: 'none' as 'api' | 'api_simplified' | 'admin_link_only' | 'none',
    debugInfo: [] as string[]
  };

  if (searchConsoleLinks.length === 0) {
    searchConsoleStatus.debugInfo.push('No Search Console links found in Admin API');
    return searchConsoleStatus;
  }

  searchConsoleStatus.debugInfo.push(`Found ${searchConsoleLinks.length} Search Console link(s)`);

  // Method 1: Try the dimension combination that works in Looker
  try {
    searchConsoleStatus.debugInfo.push('Attempting Method 1: googleSearchConsoleQuery + landingPagePlusQueryString');
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [
            { name: 'googleSearchConsoleQuery' },
            { name: 'landingPagePlusQueryString' }
          ],
          metrics: [
            { name: 'googleSearchConsoleClicks' },
            { name: 'googleSearchConsoleImpressions' }
          ],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
          limit: 10,
          metricFilter: {
            filter: {
              fieldName: 'googleSearchConsoleImpressions',
              operation: 'GREATER_THAN',
              value: { int64Value: '0' }
            }
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      searchConsoleStatus.debugInfo.push(`Method 1 success: ${data.rows?.length || 0} rows returned`);
      
      if (data.rows && data.rows.length > 0) {
        let totalClicks = 0;
        let totalImpressions = 0;
        
        data.rows.forEach((row: any) => {
          if (row.metricValues && row.metricValues.length >= 2) {
            totalClicks += parseInt(row.metricValues[0].value) || 0;
            totalImpressions += parseInt(row.metricValues[1].value) || 0;
          }
        });
        
        searchConsoleStatus.totalClicks = totalClicks;
        searchConsoleStatus.totalImpressions = totalImpressions;
        searchConsoleStatus.organicImpressions = totalImpressions;
        searchConsoleStatus.hasData = totalImpressions > 0;
        searchConsoleStatus.dataMethod = 'api';
        
        if (searchConsoleStatus.hasData) {
          searchConsoleStatus.lastDataDate = `✅ Active: ${totalImpressions.toLocaleString()} impressions, ${totalClicks.toLocaleString()} clicks in last 30 days`;
        }
        
        return searchConsoleStatus;
      }
    } else {
      const errorText = await response.text();
      searchConsoleStatus.debugInfo.push(`Method 1 failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    searchConsoleStatus.debugInfo.push(`Method 1 error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Method 2: Try simplified approach with just googleSearchConsoleQuery
  try {
    searchConsoleStatus.debugInfo.push('Attempting Method 2: googleSearchConsoleQuery only');
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [{ name: 'googleSearchConsoleQuery' }],
          metrics: [
            { name: 'googleSearchConsoleClicks' },
            { name: 'googleSearchConsoleImpressions' }
          ],
          dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
          limit: 5
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      searchConsoleStatus.debugInfo.push(`Method 2 success: ${data.rows?.length || 0} rows returned`);
      
      if (data.rows && data.rows.length > 0) {
        let totalClicks = 0;
        let totalImpressions = 0;
        
        data.rows.forEach((row: any) => {
          if (row.metricValues && row.metricValues.length >= 2) {
            totalClicks += parseInt(row.metricValues[0].value) || 0;
            totalImpressions += parseInt(row.metricValues[1].value) || 0;
          }
        });
        
        searchConsoleStatus.totalClicks = totalClicks;
        searchConsoleStatus.totalImpressions = totalImpressions;
        searchConsoleStatus.organicImpressions = totalImpressions;
        searchConsoleStatus.hasData = totalImpressions > 0;
        searchConsoleStatus.dataMethod = 'api_simplified';
        
        if (searchConsoleStatus.hasData) {
          searchConsoleStatus.lastDataDate = `✅ Active: ${totalImpressions.toLocaleString()} impressions, ${totalClicks.toLocaleString()} clicks in last 7 days`;
        }
        
        return searchConsoleStatus;
      }
    } else {
      const errorText = await response.text();
      searchConsoleStatus.debugInfo.push(`Method 2 failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    searchConsoleStatus.debugInfo.push(`Method 2 error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Method 3: Try with different date range (longer lookback)
  try {
    searchConsoleStatus.debugInfo.push('Attempting Method 3: Extended date range');
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [
            { name: 'googleSearchConsoleQuery' },
            { name: 'landingPage' } // Try landingPage instead of landingPagePlusQueryString
          ],
          metrics: [{ name: 'googleSearchConsoleImpressions' }],
          dateRanges: [{ startDate: '90daysAgo', endDate: 'yesterday' }],
          limit: 5
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      searchConsoleStatus.debugInfo.push(`Method 3 success: ${data.rows?.length || 0} rows returned`);
      
      if (data.rows && data.rows.length > 0) {
        searchConsoleStatus.dataMethod = 'api_simplified';
        searchConsoleStatus.hasData = true;
        searchConsoleStatus.lastDataDate = `✅ Historical data found (last 90 days) - ${data.rows.length} queries`;
        return searchConsoleStatus;
      }
    } else {
      const errorText = await response.text();
      searchConsoleStatus.debugInfo.push(`Method 3 failed: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    searchConsoleStatus.debugInfo.push(`Method 3 error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Fallback: Admin link exists but no data detected via API
  searchConsoleStatus.dataMethod = 'admin_link_only';
  searchConsoleStatus.lastDataDate = `⚠️ Search Console linked via Admin API but data flow not verified via Reporting API. Check Reports > Library > Search Console in GA4 manually.`;
  
  // Add helpful debugging info
  searchConsoleStatus.debugInfo.push('All API methods failed - Search Console may need time to populate or additional permissions');
  searchConsoleStatus.debugInfo.push('Recommendation: Check GA4 Reports > Library > Search Console collections manually');
  
  return searchConsoleStatus;
}

// UTILITY: Check if Search Console collections are published in GA4
async function checkSearchConsoleCollections(accessToken: string, propertyId: string) {
  try {
    // This would need to be implemented using the GA4 Admin API
    // to check if Search Console collections are published
    // For now, return a helpful message
    return {
      collectionsPublished: 'unknown',
      message: 'Check GA4 Reports > Library > Search Console collections and publish if needed'
    };
  } catch (error) {
    return {
      collectionsPublished: 'error',
      message: 'Unable to check Search Console collections status'
    };
  }
}

// Helper function to build comprehensive audit with enhanced logic
function buildComprehensiveAudit(data: Record<string, unknown>) {
  const {
    propertyData,
    dataStreams,
    keyEvents,
    dataRetention,
    attribution,
    googleSignals,
    googleAdsLinks,
    bigQueryLinks,
    connectedSiteTags,
    searchConsoleLinks,
    customDimensions,
    customMetrics,
    enhancedMeasurement,
    measurementProtocolSecrets,
    eventCreateRules,
    searchConsoleDataStatus
  } = data as {
    propertyData: Record<string, unknown>;
    dataStreams: Array<Record<string, unknown>>;
    keyEvents: Array<Record<string, unknown>>;
    dataRetention: Record<string, unknown>;
    attribution: Record<string, unknown>;
    googleSignals: Record<string, unknown>;
    googleAdsLinks: Array<Record<string, unknown>>;
    bigQueryLinks: Array<Record<string, unknown>>;
    connectedSiteTags: Array<Record<string, unknown>>;
    searchConsoleLinks: Array<Record<string, unknown>>;
    customDimensions: Array<Record<string, unknown>>;
    customMetrics: Array<Record<string, unknown>>;
    enhancedMeasurement: Array<Record<string, unknown>>;
    measurementProtocolSecrets: Array<Record<string, unknown>>;
    eventCreateRules: Array<Record<string, unknown>>;
    searchConsoleDataStatus: Record<string, unknown>;
  };

  // Analyze enhanced measurement for missing dimensions
  const enhancedMeasurementWarnings = analyzeEnhancedMeasurementDimensions(
    enhancedMeasurement as Array<Record<string, unknown>>, 
    customDimensions as Array<Record<string, unknown>>
  );
  
  // Analyze event create rules
  const eventCreateRulesWarnings = analyzeEventCreateRules(eventCreateRules as Array<Record<string, unknown>>);

  // Helper function to get readable data retention status
  const getDataRetentionStatus = (eventDataRetention: string) => {
    switch (eventDataRetention) {
      case 'FOURTEEN_MONTHS':
        return {
          status: 'configured',
          warning: false,
          message: '✅ Excellent! Data retention is set to 14 months.'
        };
      case 'FIFTY_MONTHS':
        return {
          status: 'configured',
          warning: false,
          message: '✅ Perfect! Data retention is set to maximum (50 months).'
        };
      case 'TWO_MONTHS':
        return {
          status: 'critical',
          warning: true,
          message: '⚠️ CRITICAL: Data retention is only 2 months! Extend to 14 months for better analysis.'
        };
      default:
        return {
          status: 'requires_check',
          warning: true,
          message: '⚠️ Check your data retention settings!'
        };
    }
  };

  // Helper function for attribution model readability
  const getAttributionModelDisplay = (attribution: Record<string, unknown>) => {
    const model = attribution.reportingAttributionModel as string;
    
    if (!model) {
      return 'Attribution settings not accessible via API';
    }
    
    const modelNames: Record<string, string> = {
      'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN': 'Data-driven (recommended)',
      'PAID_AND_ORGANIC_CHANNELS_LAST_CLICK': 'Last click',
      'PAID_AND_ORGANIC_CHANNELS_FIRST_CLICK': 'First click',
      'PAID_AND_ORGANIC_CHANNELS_LINEAR': 'Linear',
      'PAID_AND_ORGANIC_CHANNELS_TIME_DECAY': 'Time decay',
      'PAID_AND_ORGANIC_CHANNELS_POSITION_BASED': 'Position-based'
    };
    
    return modelNames[model] || model;
  };

  // Helper function for Google Signals status
  const getGoogleSignalsStatus = (googleSignals: Record<string, unknown>) => {
    const state = googleSignals.state as string;
    
    if (!state) {
      return {
        value: 'Google Signals status not accessible via API',
        status: 'requires_check',
        warning: false
      };
    }
    
    const isEnabled = state === 'GOOGLE_SIGNALS_ENABLED';
    
    return {
      value: isEnabled ? 'Enabled for cross-device insights and demographics' : `Status: ${state}`,
      status: isEnabled ? 'configured' : 'not_configured',
      warning: isEnabled // Show privacy warning if enabled
    };
  };

  const dataRetentionStatus = getDataRetentionStatus(dataRetention.eventDataRetention as string);
  const attributionDisplay = getAttributionModelDisplay(attribution);
  const googleSignalsStatus = getGoogleSignalsStatus(googleSignals);

  return {
    propertySettings: {
      timezone: {
        status: propertyData.timeZone ? 'configured' : 'missing',
        value: `${propertyData.timeZone || 'Not set'} ${propertyData.timeZone ? '✓' : '⚠️'}`,
        recommendation: propertyData.timeZone 
          ? `Your timezone is set to ${propertyData.timeZone}. Ensure this matches your business location for accurate reporting.`
          : 'Set your property timezone in Admin > Property > Property details.',
        details: propertyData.timeZone 
          ? `Reports will show data in ${propertyData.timeZone} timezone. Keep this consistent across marketing platforms.`
          : 'GA4 defaults to Pacific Time if no timezone is set.'
      },
      currency: {
        status: propertyData.currencyCode ? 'configured' : 'default',
        value: `${propertyData.currencyCode || 'USD (default)'} ${propertyData.currencyCode ? '✓' : 'ℹ️'}`,
        recommendation: propertyData.currencyCode 
          ? `Your reporting currency is ${propertyData.currencyCode}. All e-commerce data will be converted to this currency.`
          : 'GA4 defaults to USD. If you accept multiple currencies, GA4 will convert them using daily exchange rates.',
        details: 'GA4 currency conversion: Transactions in multiple currencies are automatically converted to your reporting currency using Google\'s daily exchange rates.'
      },
      industryCategory: {
        status: propertyData.industryCategory ? 'configured' : 'missing',
        value: propertyData.industryCategory as string || 'Not set',
        recommendation: propertyData.industryCategory 
          ? 'Industry category is set for benchmarking and machine learning optimization.' 
          : 'Set industry category in Admin > Property > Property details for better benchmarking insights.',
        details: 'Industry category helps GA4 provide relevant benchmarks and improves automated insights quality.'
      },
      dataRetention: {
        status: dataRetentionStatus.status,
        value: dataRetention.eventDataRetention 
          ? `Event data: ${dataRetention.eventDataRetention}, User data: ${dataRetention.userDataRetention || 'Not specified'}`
          : '⚠️ CRITICAL: Check your data retention settings!',
        recommendation: dataRetentionStatus.message,
        details: `Data retention affects Explorations and custom reports. Current setting: ${dataRetention.eventDataRetention || 'Unknown'}. You can change this in Admin > Data collection > Data retention.`
      },
      attribution: {
        status: attribution.reportingAttributionModel ? 'configured' : 'requires_check',
        value: attribution.reportingAttributionModel 
          ? `${attributionDisplay} | Acquisition lookback: ${attribution.acquisitionConversionEventLookbackWindow || 'Default'} | Other lookback: ${attribution.otherConversionEventLookbackWindow || 'Default'}`
          : 'Attribution settings not accessible via API',
        recommendation: attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN'
          ? '✅ Using data-driven attribution model (recommended)'
          : 'Consider using data-driven attribution for more accurate conversion credit',
        details: attribution.reportingAttributionModel 
          ? `Attribution model affects how conversion credit is assigned across touchpoints. Current: ${attributionDisplay}`
          : 'Attribution settings control how key events are credited to different channels and campaigns'
      },
      googleSignals: {
        status: googleSignalsStatus.status,
        value: googleSignalsStatus.value,
        recommendation: googleSignalsStatus.status === 'configured'
          ? '✅ Google Signals enabled for cross-device insights and demographics'
          : 'Consider enabling Google Signals in Admin > Data collection for cross-device tracking and demographics (requires privacy review)',
        details: 'Google Signals enables cross-device reporting, demographics, and interests data, but may cause data thresholding in some reports',
        warnings: googleSignalsStatus.warning ? [
          '⚠️ PRIVACY NOTICE: Google Signals is enabled. Ensure your privacy policy clearly states that you collect demographics and interests data via Google Signals for advertising purposes.'
        ] : []
      }
    },
    dataCollection: {
      dataStreams: {
        status: dataStreams.length > 0 ? 'configured' : 'missing',
        value: `${dataStreams.length} data stream(s) - ${getDataStreamSummary(dataStreams as Array<Record<string, unknown>>)}`,
        recommendation: dataStreams.length > 0 
          ? 'Data streams are configured. Each platform (web, iOS, Android) should have its own stream.'
          : 'Add data streams for your platforms in Admin > Data collection > Data streams.',
        details: getDataStreamDetails(dataStreams as Array<Record<string, unknown>>)
      },
      enhancedMeasurement: {
        status: enhancedMeasurement.length > 0 ? 'configured' : 'not_configured',
        value: enhancedMeasurement.length > 0
          ? `Configured on ${enhancedMeasurement.length} web stream(s)`
          : 'Enhanced measurement not detected',
        recommendation: enhancedMeasurement.length > 0
          ? 'Enhanced measurement is active. Review individual event settings below.'
          : 'Enable Enhanced Measurement in your web data stream settings for automatic event tracking.',
        details: getEnhancedMeasurementDetails(enhancedMeasurement as Array<Record<string, unknown>>),
        warnings: enhancedMeasurementWarnings
      },
      measurementProtocol: {
        status: measurementProtocolSecrets.length > 0 ? 'configured' : 'not_configured',
        value: measurementProtocolSecrets.length > 0
          ? `${(measurementProtocolSecrets as Array<Record<string, unknown>>).reduce((total, stream) => total + ((stream.secrets as Array<unknown>)?.length || 0), 0)} secret(s) across ${measurementProtocolSecrets.length} stream(s)`
          : 'No measurement protocol secrets configured',
        recommendation: measurementProtocolSecrets.length > 0
          ? '⚠️ Measurement Protocol is configured. Ensure it\'s properly implemented to avoid data quality issues.'
          : 'Measurement Protocol allows server-side event sending. Only implement if needed and ensure proper data validation.',
        details: measurementProtocolSecrets.length > 0
          ? `Secrets found: ${(measurementProtocolSecrets as Array<Record<string, unknown>>).map(s => `${s.streamName}: ${((s.secrets as Array<Record<string, unknown>>)?.map(secret => secret.displayName) || []).join(', ')}`).join(' | ')}`
          : 'Measurement Protocol enables sending events from your server directly to GA4'
      },
      connectedSiteTags: {
        status: connectedSiteTags.length > 0 ? 'configured' : 'not_configured',
        value: connectedSiteTags.length > 0
          ? `${connectedSiteTags.length} connected site tag(s)`
          : 'No connected site tags',
        recommendation: connectedSiteTags.length > 0
          ? 'Connected site tags are forwarding traffic from other properties'
          : 'Connected site tags forward traffic from Universal Analytics to GA4 during migration',
        details: 'Connected site tags help with UA to GA4 migration by forwarding traffic between properties'
      }
    },
    customDefinitions: {
      customDimensions: {
        status: customDimensions.length > 0 ? 'configured' : 'none',
        value: `${customDimensions.length} custom dimension(s) configured`,
        recommendation: customDimensions.length > 0
          ? `Custom dimensions: ${(customDimensions as Array<Record<string, unknown>>).map((cd: Record<string, unknown>) => `${cd.displayName} (${cd.scope})`).slice(0, 5).join(', ')}${customDimensions.length > 5 ? '...' : ''}. Review implementation carefully.`
          : 'No custom dimensions configured. Create them in Admin > Custom definitions for business-specific tracking.',
        details: getCustomDimensionsDetails(customDimensions as Array<Record<string, unknown>>),
        quota: `Using ${customDimensions.length}/50 custom dimensions (standard property)`
      },
      customMetrics: {
        status: customMetrics.length > 0 ? 'configured' : 'none',
        value: `${customMetrics.length} custom metric(s) configured`,
        recommendation: customMetrics.length > 0
          ? `Custom metrics: ${(customMetrics as Array<Record<string, unknown>>).map((cm: Record<string, unknown>) => `${cm.displayName} (${cm.scope})`).slice(0, 5).join(', ')}${customMetrics.length > 5 ? '...' : ''}. Verify data accuracy.`
          : 'No custom metrics configured. Create them for tracking business-specific numerical data.',
        details: getCustomMetricsDetails(customMetrics as Array<Record<string, unknown>>),
        quota: `Using ${customMetrics.length}/50 custom metrics (standard property)`
      },
      eventCreateRules: {
        status: eventCreateRules.length > 0 ? 'configured' : 'none',
        value: eventCreateRules.length > 0
          ? `${(eventCreateRules as Array<Record<string, unknown>>).reduce((total, stream) => total + ((stream.rules as Array<unknown>)?.length || 0), 0)} event create rule(s)`
          : 'No event create rules configured',
        recommendation: eventCreateRules.length > 0
          ? '⚠️ WARNING: Event create rules detected. These are complex and often misconfigured - review carefully!'
          : 'Event create rules allow creating new events based on existing ones. Only use if you understand the data structure.',
        details: getEventCreateRulesDetails(eventCreateRules as Array<Record<string, unknown>>),
        warnings: eventCreateRulesWarnings
      }
    },
    keyEvents: {
      keyEvents: {
        status: keyEvents.length > 0 ? 'configured' : 'missing',
        value: `${keyEvents.length} key event(s) configured`,
        recommendation: keyEvents.length > 0 
          ? `Key events: ${(keyEvents as Array<Record<string, unknown>>).map((ke: Record<string, unknown>) => ke.eventName).slice(0, 5).join(', ')}${keyEvents.length > 5 ? '...' : ''}. These can be imported to Google Ads as conversions.`
          : 'Set up key events for your important business goals in Admin > Events > Mark events as key events.',
        details: '2025 Update: "Conversions" are now called "Key Events" in GA4. Key Events can be imported to Google Ads as conversions for bidding optimization.'
      }
    },
    integrations: {
      googleAds: {
        status: googleAdsLinks.length > 0 ? 'configured' : 'not_configured',
        value: googleAdsLinks.length > 0
          ? `${googleAdsLinks.length} Google Ads link(s) configured`
          : 'No Google Ads links configured',
        recommendation: googleAdsLinks.length > 0
          ? '✅ Google Ads is linked for conversion tracking and audience sharing'
          : 'Link Google Ads in Admin > Product linking > Google Ads to import key events as conversions and share audiences.',
        details: 'Google Ads linking enables conversion import for Smart Bidding and audience sharing for remarketing campaigns'
      },
      bigQuery: {
        status: bigQueryLinks.length > 0 ? 'configured' : 'not_configured',
        value: bigQueryLinks.length > 0
          ? `${bigQueryLinks.length} BigQuery link(s) configured`
          : 'BigQuery export not configured',
        recommendation: bigQueryLinks.length > 0
          ? '✅ BigQuery export is configured for advanced analysis'
          : 'Consider linking BigQuery for raw data export and advanced analysis. Free tier available for GA4!',
        details: 'BigQuery export includes all raw event data, bypasses sampling, and enables custom analysis with SQL'
      },
      searchConsole: {
        status: (searchConsoleDataStatus as Record<string, unknown>).isLinked ? 
          ((searchConsoleDataStatus as Record<string, unknown>).hasData ? 'configured' : 'linked_no_data') : 
          'not_configured',
        value: (searchConsoleDataStatus as Record<string, unknown>).isLinked 
          ? `Linked | ${(searchConsoleDataStatus as Record<string, unknown>).lastDataDate || 'Checking data...'}`
          : 'Search Console not linked',
        recommendation: (searchConsoleDataStatus as Record<string, unknown>).isLinked && (searchConsoleDataStatus as Record<string, unknown>).hasData
          ? '✅ Search Console is linked and providing organic search data'
          : (searchConsoleDataStatus as Record<string, unknown>).isLinked 
            ? '⚠️ Search Console is linked but verify data is flowing. Check in Reports > Library > Search Console collections.'
            : 'Link Search Console in Admin > Product linking > Search Console for organic search insights.',
        details: (searchConsoleDataStatus as Record<string, unknown>).isLinked 
          ? `Search Console integration provides organic search queries, clicks, impressions, and CTR data. ${(searchConsoleDataStatus as Record<string, unknown>).lastDataDate || 'Status unknown'}`
          : 'Search Console integration shows which Google search queries bring visitors to your site'
      }
    }
  };
}

// Helper function to analyze enhanced measurement dimensions
function analyzeEnhancedMeasurementDimensions(enhancedMeasurement: Array<Record<string, unknown>>, customDimensions: Array<Record<string, unknown>>) {
  const warnings: string[] = [];
  const requiredDimensions = {
    video: ['video_current_time', 'video_duration', 'video_percent'],
    form: ['form_id', 'form_name', 'form_destination', 'form_submit_text']
  };

  const existingDimensionParams = customDimensions.map(cd => (cd.parameterName as string)?.toLowerCase()).filter(Boolean);

  enhancedMeasurement.forEach(stream => {
    const settings = stream.settings as Record<string, unknown>;
    
    if (settings.videoEngagementEnabled) {
      const missingVideoDimensions = requiredDimensions.video.filter(
        param => !existingDimensionParams.includes(param)
      );
      
      if (missingVideoDimensions.length > 0) {
        warnings.push(
          `⚠️ Video engagement is enabled on "${stream.streamName}" but missing recommended custom dimensions: ${missingVideoDimensions.join(', ')}. Register these in Admin > Custom definitions for better video analytics.`
        );
      }
    }

    if (settings.formInteractionsEnabled) {
      const missingFormDimensions = requiredDimensions.form.filter(
        param => !existingDimensionParams.includes(param)
      );
      
      if (missingFormDimensions.length > 0) {
        warnings.push(
          `⚠️ Form interactions are enabled on "${stream.streamName}" but missing recommended custom dimensions: ${missingFormDimensions.join(', ')}. Register these for detailed form analytics.`
        );
      }
    }
  });

  return warnings;
}

// Helper function to analyze event create rules
function analyzeEventCreateRules(eventCreateRules: Array<Record<string, unknown>>) {
  const warnings: string[] = [];

  eventCreateRules.forEach(stream => {
    (stream.rules as Array<Record<string, unknown>>).forEach((rule: Record<string, unknown>) => {
      warnings.push(
        `⚠️ CRITICAL: Event create rule "${rule.displayName}" on ${stream.streamName}. Very few people configure these correctly - they require deep understanding of GA4 data structure. Review implementation carefully!`
      );
    });
  });

  if (eventCreateRules.length > 0) {
    warnings.push(
      '💡 Event create rules are where auto-migrated events from Universal Analytics often live. These can cause data quality issues if not properly configured.'
    );
  }

  return warnings;
}

// Helper functions for data stream analysis
function getDataStreamSummary(streams: Array<Record<string, unknown>>): string {
  const webStreams = streams.filter(s => s.type === 'WEB_DATA_STREAM').length;
  const appStreams = streams.filter(s => s.type !== 'WEB_DATA_STREAM').length;
  
  if (webStreams > 0 && appStreams > 0) {
    return `${webStreams} web, ${appStreams} app`;
  } else if (webStreams > 0) {
    return `${webStreams} web stream(s)`;
  } else if (appStreams > 0) {
    return `${appStreams} app stream(s)`;
  }
  return 'No streams configured';
}

function getDataStreamDetails(streams: Array<Record<string, unknown>>): string {
  if (streams.length === 0) {
    return 'No data streams found. Create a web data stream for your website in Admin > Data streams.';
  }
  
  const details = streams.map(stream => {
    if (stream.type === 'WEB_DATA_STREAM') {
      return `Web: ${(stream.webStreamData as Record<string, unknown>)?.defaultUri || stream.displayName}`;
    } else {
      return `App: ${stream.displayName}`;
    }
  }).join(', ');
  
  return `Configured streams: ${details}`;
}

function getEnhancedMeasurementDetails(enhancedMeasurement: Array<Record<string, unknown>>): string {
  if (enhancedMeasurement.length === 0) {
    return 'Enhanced Measurement provides automatic tracking for common website interactions without additional code.';
  }
  
  const allEvents = enhancedMeasurement.reduce((events: string[], stream) => {
    const settings = stream.settings as Record<string, unknown>;
    const activeEvents: string[] = [];
    
    if (settings.streamEnabled) {
      if (settings.scrollsEnabled) activeEvents.push('scroll (90% page scroll)');
      if (settings.outboundClicksEnabled) activeEvents.push('click (outbound links)');
      if (settings.siteSearchEnabled) activeEvents.push('view_search_results (site search)');
      if (settings.videoEngagementEnabled) activeEvents.push('video_start/progress/complete (YouTube)');
      if (settings.fileDownloadsEnabled) activeEvents.push('file_download (PDF, DOC, etc.)');
      if (settings.formInteractionsEnabled) activeEvents.push('form_start/submit (form interactions)');
      if (settings.pageChangesEnabled) activeEvents.push('page_view (SPA page changes)');
    }
    
    return events.concat(activeEvents);
  }, []);
  
  return `Active events: ${[...new Set(allEvents)].join(', ')}. These provide valuable insights without any development work!`;
}

// Helper functions for custom definitions
function getCustomDimensionsDetails(customDimensions: Array<Record<string, unknown>>): string {
  if (customDimensions.length === 0) {
    return 'Custom dimensions allow tracking business-specific categorical data like user types, content categories, or campaign details.';
  }

  const byScope = customDimensions.reduce((acc: Record<string, number>, cd) => {
    const scope = cd.scope as string;
    acc[scope] = (acc[scope] || 0) + 1;
    return acc;
  }, {});

  const scopeBreakdown = Object.entries(byScope)
    .map(([scope, count]) => `${count} ${scope.toLowerCase()}`)
    .join(', ');

  return `Breakdown by scope: ${scopeBreakdown}. Custom dimensions capture business-specific data for detailed analysis.`;
}

function getCustomMetricsDetails(customMetrics: Array<Record<string, unknown>>): string {
  if (customMetrics.length === 0) {
    return 'Custom metrics allow tracking business-specific numerical data like engagement scores, revenue per user, or completion rates.';
  }

  const byScope = customMetrics.reduce((acc: Record<string, number>, cm) => {
    const scope = cm.scope as string;
    acc[scope] = (acc[scope] || 0) + 1;
    return acc;
  }, {});

  const scopeBreakdown = Object.entries(byScope)
    .map(([scope, count]) => `${count} ${scope.toLowerCase()}`)
    .join(', ');

  return `Breakdown by scope: ${scopeBreakdown}. Custom metrics track numerical values for business-specific KPIs.`;
}

function getEventCreateRulesDetails(eventCreateRules: Array<Record<string, unknown>>): string {
  if (eventCreateRules.length === 0) {
    return 'Event create rules allow creating new events based on existing event data. Rarely needed and complex to configure correctly.';
  }

  const totalRules = eventCreateRules.reduce((total, stream) => total + (stream.rules as Array<unknown>).length, 0);
  const streamDetails = eventCreateRules.map(stream => 
    `${stream.streamName}: ${(stream.rules as Array<unknown>).length} rule(s)`
  ).join(', ');

  return `${totalRules} total rules across streams (${streamDetails}). These modify or create events and require expert-level GA4 knowledge.`;
}

export { handler };
