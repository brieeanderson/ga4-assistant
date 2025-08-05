// netlify/functions/ga4-audit.ts
// Complete GA4 Audit Function with Enhanced Data Quality Checks

import { Handler } from '@netlify/functions';
import { runEnhancedDataQualityChecks } from './enhanced-data-quality-checks';

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

    console.log('=== COMPREHENSIVE GA4 AUDIT v6.0 - 2025 EDITION ===');
    console.log('PropertyId provided:', !propertyId);

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
          const accountsToProcess = accountsData.accounts;
          
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
    
    // All the parallel API calls for basic audit data
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
      
      // Custom dimensions (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/customDimensions`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      
      // Custom metrics (v1alpha)
      fetch(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/customMetrics`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
    ];

    console.log('Making parallel API calls...');
    const results = await Promise.allSettled(apiCalls);
    
    // Process results with proper error handling
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
      customDimensionsResult,
      customMetricsResult
    ] = results;

    // Extract data with fallbacks
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

    // Get event edit rules for all data streams
    const eventEditRules = await getEventEditRulesForStreams(
      accessToken, 
      propertyId, 
      dataStreams.dataStreams || []
    );

    // Get property access information
    const propertyAccess = await getPropertyAccess(accessToken, propertyId);

    // Use Data API for Search Console detection
    const searchConsoleDataStatus = await checkSearchConsoleDataAvailability(
      accessToken,
      propertyId
    );

    // 🚀 NEW: Run enhanced data quality checks
    console.log('🚀 Running enhanced data quality checks...');
    let enhancedChecksResult;
    try {
      enhancedChecksResult = await runEnhancedDataQualityChecks(accessToken, propertyId);
      console.log('✅ Enhanced data quality checks completed');
    } catch (error) {
      console.error('⚠️ Enhanced data quality checks failed:', error);
      // Create fallback object so audit still works
      enhancedChecksResult = {
        dataQualityScore: 100,
        criticalIssues: 0,
        warnings: 0,
        piiAnalysis: { hasPII: null, severity: 'unknown', recommendation: 'Enhanced PII check unavailable' },
        searchAnalysis: { status: 'unknown', recommendation: 'Enhanced search analysis unavailable' },
        trafficAnalysis: { 
          unwantedReferrals: { detected: null, recommendation: 'Enhanced referral analysis unavailable' },
          crossDomainIssues: { detected: null, recommendation: 'Enhanced cross-domain analysis unavailable' }
        },
        summary: { status: 'unknown', message: 'Enhanced checks failed - basic audit available' }
      };
    }



    // Fetch crossDomainSettings for each data stream
    async function getDataStreamsWithCrossDomain(accessToken: string, propertyId: string, streams: any[]) {
      return await Promise.all(
        streams.map(async (stream) => {
          let crossDomainSettings = undefined;
          try {
            const response = await fetch(
              `https://analyticsadmin.googleapis.com/v1alpha/${stream.name}`,
              { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            if (response.ok) {
              const details = await response.json();
              if (details.crossDomainSettings && details.crossDomainSettings.domains) {
                crossDomainSettings = { domains: details.crossDomainSettings.domains };
              }
            }
          } catch (error) {
            console.error(`Error fetching crossDomainSettings for stream ${stream.name}:`, error);
          }
          return { ...stream, crossDomainSettings };
        })
      );
    }

    // Fetch hostnames from the Data API
    async function getHostnames(accessToken: string, propertyId: string) {
      try {
        const response = await fetchWithTimeout(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              dimensions: [{ name: 'hostName' }],
              metrics: [{ name: 'sessions' }],
              dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
              limit: 100
            })
          },
          8000
        );
        if (response.ok) {
          const data = await response.json();
          if (data.rows && data.rows.length > 0) {
            return data.rows.map((row: any) => row.dimensionValues[0].value).filter(Boolean);
          }
        }
      } catch (error) {
        console.error('Error fetching hostnames from Data API:', error);
      }
      return [];
    }

    // After fetching dataStreams
    const rawStreams = dataStreams.dataStreams || [];
    const dataStreamsWithCrossDomain = await getDataStreamsWithCrossDomain(accessToken, propertyId, rawStreams);
    const hostnames = await getHostnames(accessToken, propertyId);

    // Build comprehensive audit with enhanced data
    const audit = {
      property: propertyData,
      dataStreams: dataStreamsWithCrossDomain,
      keyEvents: keyEvents.keyEvents || [],
      dataRetention,
      attribution,
      googleSignals,
      googleAdsLinks: googleAdsLinks.googleAdsLinks || [],
      bigQueryLinks: bigQueryLinks.bigQueryLinks || [],
      connectedSiteTags: connectedSiteTags.connectedSiteTags || [],
      searchConsoleLinks: [], // Empty since we're using Data API only
      customDimensions: customDimensions.customDimensions || [],
      customMetrics: customMetrics.customMetrics || [],
      enhancedMeasurement: enhancedMeasurementDetails,
      measurementProtocolSecrets,
      eventCreateRules,
      eventEditRules,
      propertyAccess,
      searchConsoleDataStatus,
      hostnames,
      
      // 🚀 NEW: Add enhanced data quality results
      dataQuality: {
        score: enhancedChecksResult.dataQualityScore,
        piiAnalysis: enhancedChecksResult.piiAnalysis,
        searchImplementation: enhancedChecksResult.searchAnalysis,
        trafficSources: enhancedChecksResult.trafficAnalysis,
        criticalIssues: enhancedChecksResult.criticalIssues,
        warnings: enhancedChecksResult.warnings
      },
      configScore: enhancedChecksResult.dataQualityScore,
    };

    // Define a type for enhanced measurement settings
    interface EnhancedMeasurementSettings {
      formInteractionsEnabled?: boolean;
      videoEngagementEnabled?: boolean;
      [key: string]: any;
    }

    // Determine if form or video interactions are enabled in any enhanced measurement stream
    const formInteractionsEnabled = audit.enhancedMeasurement.some(
      s => s.settings && (s.settings as EnhancedMeasurementSettings).formInteractionsEnabled
    );
    const videoInteractionsEnabled = audit.enhancedMeasurement.some(
      s => s.settings && (s.settings as EnhancedMeasurementSettings).videoEngagementEnabled
    );

    // Custom dimension/metric recommendations logic
    let customDimensionsRecommendation = '';
    let customMetricsRecommendation = '';

    // Form interactions: recommend if enabled but form_id or form_name not registered
    if (formInteractionsEnabled &&
      (!isParamRegistered('form_id', audit.customDimensions, audit.customMetrics) ||
       !isParamRegistered('form_name', audit.customDimensions, audit.customMetrics))) {
      customDimensionsRecommendation =
        'Form interactions are enabled in Enhanced Measurement, but form_id or form_name is not registered as a custom dimension. Register these to analyze form performance.';
    }

    // Video interactions: recommend if enabled but video_percent not registered AND (video_duration or video_time not registered)
    if (videoInteractionsEnabled &&
      (!isParamRegistered('video_percent', audit.customDimensions, audit.customMetrics)) &&
      (!isParamRegistered('video_duration', audit.customDimensions, audit.customMetrics) &&
       !isParamRegistered('video_time', audit.customDimensions, audit.customMetrics))) {
      customMetricsRecommendation =
        'Video interactions are enabled in Enhanced Measurement, but video_percent is not registered as a custom dimension or metric, and video_duration or video_time is not registered. Register these to analyze video engagement.';
    }

    console.log('FINAL AUDIT DATA BEING SENT TO FRONTEND - EVENT CREATE RULES:', JSON.stringify(audit.eventCreateRules, null, 2));
    console.log('FINAL AUDIT DATA BEING SENT TO FRONTEND - KEY EVENTS:', JSON.stringify(audit.keyEvents, null, 2));
    console.log('FINAL AUDIT DATA BEING SENT TO FRONTEND - PROPERTY ACCESS:', JSON.stringify(audit.propertyAccess, null, 2));
    
    // Add token scope info to the response for frontend debugging
    const responseWithTokenInfo = {
      ...audit,
      _tokenDebug: {
        propertyAccessLength: audit.propertyAccess?.length || 0,
        propertyAccessIsEmpty: !audit.propertyAccess || audit.propertyAccess.length === 0
      }
    };
    

    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseWithTokenInfo),
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

// Helper function: Fetch with timeout to prevent hanging requests
const fetchWithTimeout = async (url: string, options: any, timeoutMs: number = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
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
  const webStreams = streams.filter(stream => stream.type === 'WEB_DATA_STREAM');
  const secretsData: Array<Record<string, unknown>> = [];
  
  for (const stream of webStreams) {
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
        secretsData.push({
          streamId,
          streamName: stream.displayName,
          secrets: secrets.measurementProtocolSecrets || []
        });
      }
    } catch (error) {
      console.error(`Error fetching measurement protocol secrets for stream ${stream.name}:`, error);
    }
  }
  
  return secretsData;
}

// Helper function to get event create rules for all data streams
async function getEventCreateRulesForStreams(accessToken: string, propertyId: string, streams: Array<Record<string, unknown>>) {
  const eventCreateRulesData: Array<Record<string, unknown>> = [];
  
  console.log(`Fetching event create rules for ${streams.length} data streams`);
  
  for (const stream of streams) {
    try {
      const streamId = (stream.name as string)?.split('/').pop();
      console.log(`Fetching event create rules for stream: ${streamId} (${stream.displayName})`);
      
      const response = await fetch(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/dataStreams/${streamId}/eventCreateRules`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (response.ok) {
        const rules = await response.json();
        console.log(`Stream ${streamId} response:`, JSON.stringify(rules, null, 2));
        
        if (rules.eventCreateRules && rules.eventCreateRules.length > 0) {
          console.log(`Found ${rules.eventCreateRules.length} event create rules for stream ${streamId}`);
          eventCreateRulesData.push({
            streamId,
            streamName: stream.displayName,
            rules: rules.eventCreateRules
          });
        } else {
          console.log(`No event create rules found for stream ${streamId}`);
        }
      } else {
        console.error(`Event create rules API returned status: ${response.status} for stream ${streamId}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error(`Error fetching event create rules for stream ${stream.name}:`, error);
    }
  }
  
  console.log(`Total event create rules found: ${eventCreateRulesData.reduce((total, stream) => total + (stream.rules as any[]).length, 0)}`);
  console.log('FULL EVENT CREATE RULES DATA BEING RETURNED:', JSON.stringify(eventCreateRulesData, null, 2));
  return eventCreateRulesData;
}

// Helper function to get event edit rules for all data streams
async function getEventEditRulesForStreams(accessToken: string, propertyId: string, streams: Array<Record<string, unknown>>) {
  const eventEditRulesData: Array<Record<string, unknown>> = [];
  
  console.log(`Fetching event edit rules for ${streams.length} data streams`);
  
  for (const stream of streams) {
    try {
      const streamId = (stream.name as string)?.split('/').pop();
      console.log(`Fetching event edit rules for stream: ${streamId} (${stream.displayName})`);
      
      const response = await fetch(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/dataStreams/${streamId}/eventEditRules`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (response.ok) {
        const rules = await response.json();
        console.log(`Stream ${streamId} event edit rules response:`, JSON.stringify(rules, null, 2));
        
        if (rules.eventEditRules && rules.eventEditRules.length > 0) {
          console.log(`Found ${rules.eventEditRules.length} event edit rules for stream ${streamId}`);
          eventEditRulesData.push({
            streamId,
            streamName: stream.displayName,
            rules: rules.eventEditRules
          });
        } else {
          console.log(`No event edit rules found for stream ${streamId}`);
        }
      } else {
        console.error(`Event edit rules API returned status: ${response.status} for stream ${streamId}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error(`Error fetching event edit rules for stream ${stream.name}:`, error);
    }
  }
  
  console.log(`Total event edit rules found: ${eventEditRulesData.reduce((total, stream) => total + (stream.rules as any[]).length, 0)}`);
  return eventEditRulesData;
}



// Helper function to get property access information
async function getPropertyAccess(accessToken: string, propertyId: string) {
  try {
    console.log(`🔍 Fetching property access for property: ${propertyId}`);
    
    // First, let's check what scopes we have access to
    try {
      const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
      if (tokenInfoResponse.ok) {
        const tokenInfo = await tokenInfoResponse.json();
        console.log(`🔑 Token scopes:`, tokenInfo.scope);
        console.log(`🔑 Token has analytics.manage.users.readonly:`, tokenInfo.scope?.includes('analytics.manage.users.readonly'));
      }
    } catch (scopeError) {
      console.log(`🔑 Could not check token scopes:`, scopeError);
    }
    
    // First, try to get the account ID for this property
    let accountId = null;
    try {
      const propertyResponse = await fetch(`https://analyticsadmin.googleapis.com/v1alpha/${propertyId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (propertyResponse.ok) {
        const propertyData = await propertyResponse.json();
        accountId = propertyData.account;
        console.log(`🏢 Property belongs to account: ${accountId}`);
      }
    } catch (accountError) {
      console.log(`🏢 Could not get account info:`, accountError);
    }
    
    // Use the correct GA4 Admin API endpoint for property access (v1alpha)
    const url = `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/accessBindings`;
    console.log(`📡 Property API URL: ${url}`);
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API Response Status: ${response.status}`);
      console.log(`📄 Raw API Response:`, JSON.stringify(data, null, 2));
      
      const accessBindings = data.accessBindings || [];
      console.log(`Found ${accessBindings.length} access bindings for property ${propertyId}`);
      
      // Process access bindings to extract user information
      const propertyAccess: Array<{
        email: string;
        roles: string[];
        accessType: 'direct' | 'inherited';
        source?: string;
      }> = [];
      
      for (const binding of accessBindings) {
        console.log('Processing binding:', JSON.stringify(binding, null, 2));
        
        if (binding.user && binding.user.email) {
          const roles = binding.roles || [];
          const roleNames = roles.map((role: any) => role.name || role);
          
          propertyAccess.push({
            email: binding.user.email,
            roles: roleNames,
            accessType: 'direct', // Property-level access is always direct
            source: 'Property Level'
          });
        }
      }
      
      console.log(`Processed ${propertyAccess.length} property access entries`);
      console.log(`Final property access data:`, JSON.stringify(propertyAccess, null, 2));
      
      // If no property-level access, try account-level access
      if (propertyAccess.length === 0 && accountId) {
        console.log(`🔍 No property-level access found, trying account-level access for account: ${accountId}`);
        
        try {
          const accountUrl = `https://analyticsadmin.googleapis.com/v1alpha/accounts/${accountId}/accessBindings`;
          console.log(`📡 Account API URL: ${accountUrl}`);
          
          const accountResponse = await fetch(accountUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          
          if (accountResponse.ok) {
            const accountData = await accountResponse.json();
            const accountAccessBindings = accountData.accessBindings || [];
            console.log(`Found ${accountAccessBindings.length} account-level access bindings`);
            
            // Process account-level access bindings
            for (const binding of accountAccessBindings) {
              console.log('Processing account binding:', JSON.stringify(binding, null, 2));
              
              if (binding.user && binding.user.email) {
                const roles = binding.roles || [];
                const roleNames = roles.map((role: any) => role.name || role);
                
                propertyAccess.push({
                  email: binding.user.email,
                  roles: roleNames,
                  accessType: 'inherited',
                  source: 'Account Level'
                });
              }
            }
            
            console.log(`Final combined access data:`, JSON.stringify(propertyAccess, null, 2));
          } else {
            console.error(`❌ Account access API returned status: ${accountResponse.status}`);
            const errorText = await accountResponse.text();
            console.error('Account error response:', errorText);
          }
        } catch (accountAccessError) {
          console.error('❌ Error fetching account access:', accountAccessError);
        }
      }
      
      return propertyAccess;
    } else {
      console.error(`❌ Property access API returned status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      console.error(`🔍 Full error details for property ${propertyId}`);
      

    }
  } catch (error) {
    console.error('❌ Error fetching property access:', error);
    console.error(`🔍 Error details for property ${propertyId}:`, error);
    

  }
  
  console.log(`⚠️ Returning empty property access array for property ${propertyId}`);
  return [];
}

// Search Console detection using Data API with proper dimensions
async function checkSearchConsoleDataAvailability(accessToken: string, propertyId: string) {
  const searchConsoleStatus = {
    isLinked: false,
    hasData: false,
    lastDataDate: null as string | null,
    linkDetails: [], // Not using Admin API anymore
    totalClicks: 0,
    totalImpressions: 0,
    organicImpressions: 0,
    dataMethod: 'none' as 'data_api' | 'data_api_simplified' | 'none',
    debugInfo: [] as string[]
  };

  searchConsoleStatus.debugInfo.push('Using Data API with landingPagePlusQueryString dimension to detect Search Console integration');

  // Method 1: Test with landingPagePlusQueryString dimension (CORRECT APPROACH)
  try {
    searchConsoleStatus.debugInfo.push('Method 1: Testing organicGoogleSearch metrics with landingPagePlusQueryString dimension');
    
    const response = await fetchWithTimeout(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [{ name: 'landingPagePlusQueryString' }],
          metrics: [
            { name: 'organicGoogleSearchClicks' },
            { name: 'organicGoogleSearchImpressions' }
          ],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          limit: 1
        })
      },
      8000
    );

    if (response.ok) {
      const data = await response.json();
      
      if (data.rows && data.rows.length > 0) {
        const clicks = parseInt(data.rows[0].metricValues[0].value) || 0;
        const impressions = parseInt(data.rows[0].metricValues[1].value) || 0;
        
        if (clicks > 0 || impressions > 0) {
          searchConsoleStatus.isLinked = true;
          searchConsoleStatus.hasData = true;
          searchConsoleStatus.totalClicks = clicks;
          searchConsoleStatus.totalImpressions = impressions;
          searchConsoleStatus.dataMethod = 'data_api';
          searchConsoleStatus.debugInfo.push(`✅ Success: Found ${clicks} clicks and ${impressions} impressions`);
        }
      }
    }
    
  } catch (error) {
    searchConsoleStatus.debugInfo.push(`Method 1 failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return searchConsoleStatus;
}

// Helper to check if a parameter is registered as a custom dimension or metric
function isParamRegistered(param: string, customDimensions: any[], customMetrics: any[]) {
  const dim = customDimensions.find(d => d.parameterName === param);
  const met = customMetrics.find(m => m.parameterName === param);
  return !!(dim || met);
}

export { handler };
