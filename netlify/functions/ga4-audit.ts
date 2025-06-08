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

    console.log('=== COMPREHENSIVE GA4 AUDIT v4.0 - 2025 EDITION ===');
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
      connectedSiteTagsResult
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
      enhancedMeasurement: enhancedMeasurementDetails,
      measurementProtocolSecrets,
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
        enhancedMeasurement: enhancedMeasurementDetails,
        measurementProtocolSecrets
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
async function getEnhancedMeasurementForStreams(accessToken: string, propertyId: string, streams: any[]) {
  const webStreams = streams.filter(stream => stream.type === 'WEB_DATA_STREAM');
  const enhancedMeasurementData: any[] = [];
  
  for (const stream of webStreams) {
    try {
      const streamId = stream.name.split('/').pop();
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
async function getMeasurementProtocolSecrets(accessToken: string, propertyId: string, streams: any[]) {
  const secretsData: any[] = [];
  
  for (const stream of streams) {
    try {
      const streamId = stream.name.split('/').pop();
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
            secrets: secrets.measurementProtocolSecrets.map((secret: any) => ({
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

// Helper function to build comprehensive audit
function buildComprehensiveAudit(data: any) {
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
    enhancedMeasurement,
    measurementProtocolSecrets
  } = data;

  return {
    propertySettings: {
      timezone: {
        status: 'configured',
        value: `${propertyData.timeZone || 'Not set'} ${propertyData.timeZone ? '✓' : '⚠️'}`,
        recommendation: propertyData.timeZone 
          ? `Your timezone is set to ${propertyData.timeZone}. Ensure this matches your business location for accurate reporting.`
          : 'Set your property timezone in Admin > Property > Property details.',
        details: propertyData.timeZone 
          ? `Reports will show data in ${propertyData.timeZone} timezone. Keep this consistent across marketing platforms.`
          : 'GA4 defaults to Pacific Time if no timezone is set.'
      },
      currency: {
        status: 'configured',
        value: `${propertyData.currencyCode || 'USD (default)'} ${propertyData.currencyCode ? '✓' : 'ℹ️'}`,
        recommendation: propertyData.currencyCode 
          ? `Your reporting currency is ${propertyData.currencyCode}. All e-commerce data will be converted to this currency.`
          : 'GA4 defaults to USD. If you accept multiple currencies, GA4 will convert them using daily exchange rates.',
        details: 'GA4 currency conversion: Transactions in multiple currencies are automatically converted to your reporting currency using Google\'s daily exchange rates.'
      },
      industryCategory: {
        status: propertyData.industryCategory ? 'configured' : 'missing',
        value: propertyData.industryCategory || 'Not set',
        recommendation: propertyData.industryCategory 
          ? 'Industry category is set for benchmarking and machine learning optimization.' 
          : 'Set industry category in Admin > Property > Property details for better benchmarking insights.',
        details: 'Industry category helps GA4 provide relevant benchmarks and improves automated insights quality.'
      },
      dataRetention: {
        status: dataRetention.eventDataRetention ? 'configured' : 'requires_check',
        value: dataRetention.eventDataRetention 
          ? `Event data: ${dataRetention.eventDataRetention}, User data: ${dataRetention.userDataRetention || 'Not specified'}`
          : '⚠️ CRITICAL: Check your data retention settings!',
        recommendation: dataRetention.eventDataRetention === 'FIFTY_MONTHS'
          ? '✅ Excellent! Data retention is set to maximum (50 months).'
          : '⚠️ CRITICAL: Consider extending data retention to 14 months (or 50 months for GA360). Default is only 2 months!',
        details: `Data retention affects Explorations and custom reports. Current setting: ${dataRetention.eventDataRetention || 'Unknown'}. You can change this in Admin > Data collection > Data retention.`
      },
      attribution: {
        status: attribution.reportingAttributionModel ? 'configured' : 'requires_check',
        value: attribution.reportingAttributionModel 
          ? `Model: ${attribution.reportingAttributionModel}, Acquisition lookback: ${attribution.acquisitionConversionEventLookbackWindow || 'Default'}, Other lookback: ${attribution.otherConversionEventLookbackWindow || 'Default'}`
          : 'Attribution settings not accessible',
        recommendation: attribution.reportingAttributionModel === 'PAID_AND_ORGANIC_CHANNELS_DATA_DRIVEN'
          ? '✅ Using data-driven attribution model (recommended)'
          : 'Consider using data-driven attribution for more accurate conversion credit',
        details: attribution.reportingAttributionModel 
          ? `Attribution model affects how conversion credit is assigned across touchpoints. Current: ${attribution.reportingAttributionModel}`
          : 'Attribution settings control how key events are credited to different channels and campaigns'
      },
      googleSignals: {
        status: googleSignals.state ? 'configured' : 'requires_check',
        value: googleSignals.state 
          ? `Status: ${googleSignals.state}${googleSignals.consentType ? `, Consent: ${googleSignals.consentType}` : ''}`
          : 'Google Signals status not accessible',
        recommendation: googleSignals.state === 'GOOGLE_SIGNALS_ENABLED'
          ? '✅ Google Signals enabled for cross-device insights and demographics'
          : 'Consider enabling Google Signals in Admin > Data collection for cross-device tracking and demographics (requires privacy review)',
        details: 'Google Signals enables cross-device reporting, demographics, and interests data, but may cause data thresholding in some reports'
      }
    },
    dataCollection: {
      dataStreams: {
        status: dataStreams.length > 0 ? 'configured' : 'missing',
        value: `${dataStreams.length} data stream(s) - ${getDataStreamSummary(dataStreams)}`,
        recommendation: dataStreams.length > 0 
          ? 'Data streams are configured. Each platform (web, iOS, Android) should have its own stream.'
          : 'Add data streams for your platforms in Admin > Data collection > Data streams.',
        details: getDataStreamDetails(dataStreams)
      },
      enhancedMeasurement: {
        status: enhancedMeasurement.length > 0 ? 'configured' : 'not_configured',
        value: enhancedMeasurement.length > 0
          ? `Configured on ${enhancedMeasurement.length} web stream(s)`
          : 'Enhanced measurement not detected',
        recommendation: enhancedMeasurement.length > 0
          ? 'Enhanced measurement is active. Review individual event settings below.'
          : 'Enable Enhanced Measurement in your web data stream settings for automatic event tracking.',
        details: getEnhancedMeasurementDetails(enhancedMeasurement)
      },
      measurementProtocol: {
        status: measurementProtocolSecrets.length > 0 ? 'configured' : 'not_configured',
        value: measurementProtocolSecrets.length > 0
          ? `${measurementProtocolSecrets.reduce((total, stream) => total + stream.secrets.length, 0)} secret(s) across ${measurementProtocolSecrets.length} stream(s)`
          : 'No measurement protocol secrets configured',
        recommendation: measurementProtocolSecrets.length > 0
          ? '⚠️ Measurement Protocol is configured. Ensure it\'s properly implemented to avoid data quality issues.'
          : 'Measurement Protocol allows server-side event sending. Only implement if needed and ensure proper data validation.',
        details: measurementProtocolSecrets.length > 0
          ? `Secrets found: ${measurementProtocolSecrets.map(s => `${s.streamName}: ${s.secrets.map(secret => secret.displayName).join(', ')}`).join(' | ')}`
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
    keyEvents: {
      keyEvents: {
        status: keyEvents.length > 0 ? 'configured' : 'missing',
        value: `${keyEvents.length} key event(s) configured`,
        recommendation: keyEvents.length > 0 
          ? `Key events: ${keyEvents.map((ke: any) => ke.eventName).slice(0, 5).join(', ')}${keyEvents.length > 5 ? '...' : ''}. These can be imported to Google Ads as conversions.`
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
      }
    }
  };
}

// Helper functions for data stream analysis
function getDataStreamSummary(streams: any[]): string {
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

function getDataStreamDetails(streams: any[]): string {
  if (streams.length === 0) {
    return 'No data streams found. Create a web data stream for your website in Admin > Data streams.';
  }
  
  const details = streams.map(stream => {
    if (stream.type === 'WEB_DATA_STREAM') {
      return `Web: ${stream.webStreamData?.defaultUri || stream.displayName}`;
    } else {
      return `App: ${stream.displayName}`;
    }
  }).join(', ');
  
  return `Configured streams: ${details}`;
}

function getEnhancedMeasurementDetails(enhancedMeasurement: any[]): string {
  if (enhancedMeasurement.length === 0) {
    return 'Enhanced Measurement provides automatic tracking for common website interactions without additional code.';
  }
  
  const allEvents = enhancedMeasurement.reduce((events, stream) => {
    const settings = stream.settings;
    const activeEvents = [];
    
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

export { handler };
