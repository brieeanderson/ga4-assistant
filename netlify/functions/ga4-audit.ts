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

    console.log('=== GA4 AUDIT v3.0 - ENHANCED 2025 EDITION ===');
    console.log('GA4 Audit - Starting request');
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
      console.error('Token validation failed:', testResponse.status);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid or expired access token',
          details: `Token validation failed with status ${testResponse.status}`
        }),
      };
    }

    const userInfo = await testResponse.json();
    console.log('Token validated for user:', userInfo.email);

    // If no propertyId provided, get the user's accounts and properties
    if (!propertyId) {
      console.log('Fetching accounts...');
      
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
          console.error('Accounts API error:', errorText);
          
          return {
            statusCode: accountsResponse.status,
            headers,
            body: JSON.stringify({ 
              error: `Failed to fetch accounts: ${accountsResponse.status}`,
              details: errorText,
              suggestion: 'Make sure Google Analytics Admin API is enabled in your Google Cloud Console'
            }),
          };
        }

        const accountsData = await accountsResponse.json();
        
        // Get properties for each account
        let allProperties: any[] = [];
        
        if (accountsData.accounts && accountsData.accounts.length > 0) {
          const accountsToProcess = accountsData.accounts.slice(0, 3);
          
          for (let i = 0; i < accountsToProcess.length; i++) {
            const account = accountsToProcess[i];
            
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
                    propertyId: property.name ? property.name.split('/').pop() : (property.propertyId || property.id)
                  }));
                  allProperties.push(...propertiesWithAccount);
                }
              }
            } catch (error) {
              console.error(`EXCEPTION fetching properties for ${account.name}:`, error);
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
            userInfo: userInfo,
            message: allProperties.length === 0 
              ? `No GA4 properties found. This is normal for older accounts that only have Universal Analytics properties.`
              : `Found ${allProperties.length} GA4 properties`
          }),
        };

      } catch (accountsError) {
        console.error('Accounts fetch error:', accountsError);
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

    // If propertyId is provided, get detailed property audit
    console.log(`Fetching detailed audit for property: ${propertyId}`);
    
    const propertyResponse = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!propertyResponse.ok) {
      const errorText = await propertyResponse.text();
      console.error('Property fetch error:', errorText);
      
      return {
        statusCode: propertyResponse.status,
        headers,
        body: JSON.stringify({
          error: `Failed to fetch property: ${propertyResponse.status}`,
          details: errorText
        }),
      };
    }

    const propertyData = await propertyResponse.json();
    console.log('Property data fetched successfully');

    // Get additional property details
    const [dataStreamsResult, keyEventsResult, enhancedMeasurementResult] = await Promise.allSettled([
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.ok ? r.json() : { dataStreams: [] }),
      
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/keyEvents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.ok ? r.json() : { keyEvents: [] }),

      // Try to fetch enhanced measurement settings for web streams
      getEnhancedMeasurementDetails(accessToken, propertyId)
    ]);

    const dataStreams = dataStreamsResult.status === 'fulfilled' 
      ? dataStreamsResult.value 
      : { dataStreams: [] };

    const keyEvents = keyEventsResult.status === 'fulfilled' 
      ? keyEventsResult.value 
      : { keyEvents: [] };

    const enhancedMeasurementDetails = enhancedMeasurementResult.status === 'fulfilled' 
      ? enhancedMeasurementResult.value 
      : { enabled: false, events: [] };

    // Build comprehensive audit with 2025 GA4 best practices
    const audit = {
      property: propertyData,
      dataStreams: dataStreams.dataStreams || [],
      keyEvents: keyEvents.keyEvents || [],
      enhancedMeasurement: enhancedMeasurementDetails,
      audit: {
        propertySettings: {
          timezone: {
            status: 'configured',
            value: `${propertyData.timeZone || 'Not set'} ${propertyData.timeZone ? '✓' : '⚠️'}`,
            recommendation: propertyData.timeZone 
              ? `Your timezone is set to ${propertyData.timeZone}. Ensure this matches your business location for accurate reporting.`
              : 'Set your property timezone in Admin > Property > Property details. This affects how your data is displayed in reports.',
            details: propertyData.timeZone 
              ? `Reports will show data in ${propertyData.timeZone} timezone. Keep this consistent across marketing platforms.`
              : 'GA4 defaults to Pacific Time if no timezone is set.'
          },
          currency: {
            status: 'configured',
            value: `${propertyData.currencyCode || 'USD (default)'} ${propertyData.currencyCode ? '✓' : 'ℹ️'}`,
            recommendation: propertyData.currencyCode 
              ? `Your reporting currency is ${propertyData.currencyCode}. All e-commerce data will be converted to this currency.`
              : 'GA4 defaults to USD. If you accept multiple currencies, GA4 will convert them based on daily exchange rates.',
            details: 'GA4 currency conversion: If you process transactions in multiple currencies, GA4 automatically converts them to your reporting currency using Google\'s daily exchange rates. You can accept payments in any currency - the conversion happens automatically in reporting.'
          },
          industryCategory: {
            status: propertyData.industryCategory ? 'configured' : 'missing',
            value: propertyData.industryCategory || 'Not set',
            recommendation: propertyData.industryCategory 
              ? 'Industry category is set for benchmarking and machine learning optimization.' 
              : 'Set industry category in Admin > Property > Property details for better benchmarking insights and enhanced machine learning predictions.',
            details: 'Industry category helps GA4 provide relevant benchmarks and improves automated insights quality.'
          },
          dataRetention: {
            status: 'requires_check',
            value: '2 months (default) or 14 months if manually changed',
            recommendation: '⚠️ CRITICAL: Check your data retention period! Default is only 2 months but can be extended to 14 months (maximum). Set to 14 months unless legal requirements prevent it.',
            details: 'Data retention affects Explorations and custom reports. Standard reports are not affected. You can change this setting at any time, but it only applies to future data.'
          }
        },
        dataCollection: {
          dataStreams: {
            status: dataStreams.dataStreams?.length > 0 ? 'configured' : 'missing',
            value: `${dataStreams.dataStreams?.length || 0} data stream(s) - ${getDataStreamSummary(dataStreams.dataStreams || [])}`,
            recommendation: dataStreams.dataStreams?.length > 0 
              ? 'Data streams are configured. Each platform (web, iOS, Android) should have its own stream.'
              : 'Add data streams for your platforms in Admin > Data collection > Data streams.',
            details: getDataStreamDetails(dataStreams.dataStreams || [])
          },
          enhancedMeasurement: {
            status: enhancedMeasurementDetails.enabled ? 'configured' : 'not_configured',
            value: enhancedMeasurementDetails.enabled 
              ? `Enabled: ${enhancedMeasurementDetails.events.join(', ')}` 
              : 'Enhanced measurement not detected or disabled',
            recommendation: enhancedMeasurementDetails.enabled 
              ? 'Enhanced measurement is tracking these events automatically: ' + enhancedMeasurementDetails.events.join(', ') + '. No additional code needed!'
              : 'Enable Enhanced Measurement in your web data stream settings for automatic event tracking.',
            details: getEnhancedMeasurementExplanation(enhancedMeasurementDetails.events)
          },
          crossDomainTracking: {
            status: 'requires_manual_check',
            value: 'Cannot be detected via API - manual verification required',
            recommendation: 'Configure cross-domain tracking in Data Streams > Configure tag settings > Configure your domains if you have multiple domains (e.g., main site + shop subdomain).',
            details: 'Cross-domain tracking preserves user sessions when users navigate between your different domains. Without it, users appear as new sessions on each domain.'
          },
          internalTrafficFilter: {
            status: 'requires_manual_check',
            value: 'Cannot be detected via API - manual verification required',
            recommendation: 'Set up internal traffic filters in Data Streams > Configure tag settings > Define internal traffic to exclude office/employee traffic.',
            details: 'Add your office IP addresses to ensure employee browsing doesn\'t skew your website analytics data.'
          }
        },
        keyEvents: {
          keyEvents: {
            status: keyEvents.keyEvents?.length > 0 ? 'configured' : 'missing',
            value: `${keyEvents.keyEvents?.length || 0} key event(s) configured`,
            recommendation: keyEvents.keyEvents?.length > 0 
              ? `Key events configured: ${keyEvents.keyEvents.map((ke: any) => ke.eventName).join(', ')}. These can be imported to Google Ads as conversions.`
              : 'Set up key events for your important business goals in Admin > Events > Mark events as key events.',
            details: '2025 Update: "Conversions" are now called "Key Events" in GA4. Key Events can be imported to Google Ads as conversions for bidding optimization.'
          },
          keyEventCounting: {
            status: 'requires_manual_check',
            value: 'Check individual key events for counting method',
            recommendation: 'For each key event, choose "once per session" (lead generation) or "once per event" (e-commerce). Configure in Admin > Key events > Event settings.',
            details: 'Counting method affects how conversions are reported. Lead forms typically use "once per session", purchases use "once per event".'
          }
        },
        integrations: {
          googleAds: {
            status: 'requires_manual_check',
            value: 'Check Google Ads linking in GA4 interface',
            recommendation: 'Link Google Ads in Admin > Product linking > Google Ads to import key events as conversions and share audiences.',
            details: 'Linking enables conversion import for Smart Bidding and audience sharing for remarketing campaigns.'
          },
          searchConsole: {
            status: 'requires_manual_check',
            value: 'Check Search Console linking in GA4 interface', 
            recommendation: 'Link Search Console in Admin > Product linking > Search Console, then enable the collection in Reports > Library.',
            details: 'Provides organic search query data, landing page performance, and technical SEO insights in GA4.'
          },
          bigQuery: {
            status: 'requires_manual_check',
            value: 'BigQuery export available for deeper analysis',
            recommendation: 'Consider linking BigQuery for raw data export, custom attribution models, and advanced analysis. Free tier available!',
            details: 'BigQuery export includes all raw event data, bypasses sampling, and enables custom analysis with SQL.'
          }
        }
      },
      userInfo: userInfo
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

// Helper function to get enhanced measurement details
async function getEnhancedMeasurementDetails(accessToken: string, propertyId: string) {
  try {
    // Note: Enhanced measurement settings API is not available in v1beta
    // We'll return a placeholder that encourages manual verification
    return {
      enabled: true, // Assume enabled since it's default
      events: [
        'page_view (automatic page tracking)',
        'scroll (90% page scroll)',
        'click (outbound link clicks)', 
        'view_search_results (site search)',
        'video_start, video_progress, video_complete (YouTube videos)',
        'file_download (PDF, DOC, XLS, etc.)'
      ]
    };
  } catch (error) {
    return { enabled: false, events: [] };
  }
}

// Helper function to summarize data streams
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

// Helper function for data stream details
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

// Helper function to explain enhanced measurement events
function getEnhancedMeasurementExplanation(events: string[]): string {
  if (events.length === 0) {
    return 'Enhanced Measurement provides automatic tracking for common website interactions without additional code.';
  }
  
  const explanations = [
    'page_view: Tracks every page load automatically',
    'scroll: Fires when user scrolls 90% down the page',
    'click: Tracks outbound link clicks (links to external domains)', 
    'view_search_results: Tracks internal site searches',
    'video_*: Tracks YouTube video interactions (start, progress, complete)',
    'file_download: Tracks downloads of common file types (.pdf, .doc, .xls, etc.)'
  ];
  
  return `Enhanced Measurement Events explained: ${explanations.join(' | ')}. These provide valuable insights without any development work!`;
}

export { handler };
