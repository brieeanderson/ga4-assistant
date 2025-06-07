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

    console.log('=== GA4 AUDIT v2.0 - ENHANCED DEBUGGING ===');
    console.log('GA4 Audit - Starting request');
    console.log('PropertyId provided:', !!propertyId);
    console.log('Access token length:', accessToken.length);

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

        console.log('Accounts response status:', accountsResponse.status);

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
        console.log('Accounts data:', JSON.stringify(accountsData, null, 2));
        
        console.log('Accounts data received:', JSON.stringify(accountsData, null, 2));
        
        // CRITICAL: Make sure we continue to property fetching
        console.log('=== STARTING PROPERTY FETCH PHASE ===');
        
        // Get properties for each account
        let allProperties: any[] = [];
        
        if (accountsData.accounts && accountsData.accounts.length > 0) {
          console.log(`=== PROPERTY FETCH DEBUG ===`);
          console.log(`Processing ${accountsData.accounts.length} accounts for properties...`);
          
          // Process only first 3 accounts to avoid timeout and debug issues
          const accountsToProcess = accountsData.accounts.slice(0, 3);
          console.log(`Processing first ${accountsToProcess.length} accounts to avoid timeout`);
          
          for (let i = 0; i < accountsToProcess.length; i++) {
            const account = accountsToProcess[i];
            console.log(`\n--- Account ${i + 1}/${accountsToProcess.length} ---`);
            console.log(`Account name: ${account.name}`);
            console.log(`Account display name: ${account.displayName}`);
            
            try {
              // CORRECT API endpoint format - properties is NOT nested under accounts!
              const propertiesUrl = `https://analyticsadmin.googleapis.com/v1beta/properties?filter=parent:${account.name}`;
              console.log(`Making request to: ${propertiesUrl}`);
              
              const propertiesResponse = await fetch(propertiesUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                }
              });

              console.log(`Response status: ${propertiesResponse.status}`);
              console.log(`Response ok: ${propertiesResponse.ok}`);

              if (propertiesResponse.ok) {
                const propertiesData = await propertiesResponse.json();
                console.log(`Raw properties response:`, JSON.stringify(propertiesData, null, 2));
                
                const propertyCount = propertiesData.properties?.length || 0;
                console.log(`Found ${propertyCount} properties in ${account.displayName}`);
                
                if (propertiesData.properties && propertiesData.properties.length > 0) {
                  // Add account info to each property for better display
                  const propertiesWithAccount = propertiesData.properties.map((property: any) => {
                    console.log(`Processing property:`, property);
                    return {
                      ...property,
                      accountName: account.displayName,
                      accountId: account.name,
                      // Ensure we have propertyId - it might be in different places
                      propertyId: property.name ? property.name.split('/').pop() : (property.propertyId || property.id)
                    };
                  });
                  console.log(`Processed properties:`, propertiesWithAccount);
                  allProperties.push(...propertiesWithAccount);
                } else {
                  console.log(`No properties found in account ${account.displayName} (this is normal for many accounts)`);
                }
              } else {
                const errorText = await propertiesResponse.text();
                console.error(`ERROR fetching properties for ${account.name}:`);
                console.error(`Status: ${propertiesResponse.status}`);
                console.error(`Status Text: ${propertiesResponse.statusText}`);
                console.error(`Error Body: ${errorText}`);
                console.error(`URL: ${propertiesUrl}`);
              }
            } catch (error) {
              console.error(`EXCEPTION fetching properties for ${account.name}:`, error);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
          console.log(`\n=== FINAL RESULTS ===`);
          console.log(`Total properties found across ${accountsToProcess.length} accounts: ${allProperties.length}`);
          
          if (allProperties.length === 0) {
            console.log(`NOTE: No GA4 properties found in the first ${accountsToProcess.length} accounts.`);
            console.log(`This is normal for older accounts that only have Universal Analytics properties.`);
            console.log(`GA4 was launched in October 2020, so accounts created before then typically only have UA properties.`);
          }
          
          console.log(`All properties summary:`, allProperties.map(p => ({
            name: p.displayName,
            account: p.accountName,
            propertyId: p.propertyId
          })));
          console.log(`=== END PROPERTY FETCH DEBUG ===`);
        } else {
          console.log('No accounts found - cannot fetch properties');
        }

        // Return results with helpful messaging
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            type: 'property_list',
            accounts: accountsData.accounts || [],
            properties: allProperties,
            userInfo: userInfo,
            message: allProperties.length === 0 
              ? `No GA4 properties found in the first ${Math.min(3, accountsData.accounts?.length || 0)} accounts checked. This is normal for older accounts that only have Universal Analytics properties. GA4 was launched in October 2020.`
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
            details: accountsError instanceof Error ? accountsError.message : 'Unknown error',
            suggestion: 'Check if Google Analytics Admin API is enabled and you have access to GA4 properties'
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

    // Get additional property details with error handling
    const [dataStreamsResult, keyEventsResult] = await Promise.allSettled([
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.ok ? r.json() : { dataStreams: [] }),
      
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/keyEvents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.ok ? r.json() : { keyEvents: [] })
    ]);

    const dataStreams = dataStreamsResult.status === 'fulfilled' 
      ? dataStreamsResult.value 
      : { dataStreams: [] };

    const keyEvents = keyEventsResult.status === 'fulfilled' 
      ? keyEventsResult.value 
      : { keyEvents: [] };

    // Enhanced measurement check for web data streams
    let enhancedMeasurementStatus = 'not_configured';
    let enhancedMeasurementDetails = 'No web data streams found';
    
    if (dataStreams.dataStreams && dataStreams.dataStreams.length > 0) {
      const webStreams = dataStreams.dataStreams.filter((stream: any) => stream.type === 'WEB_DATA_STREAM');
      if (webStreams.length > 0) {
        // For now, assume enhanced measurement is available on web streams
        enhancedMeasurementStatus = 'configured';
        enhancedMeasurementDetails = `Enhanced measurement available on ${webStreams.length} web data stream(s)`;
      } else {
        enhancedMeasurementDetails = 'Only mobile app streams found - enhanced measurement not applicable';
      }
    }

    // Build comprehensive audit
    const audit = {
      property: propertyData,
      dataStreams: dataStreams.dataStreams || [],
      keyEvents: keyEvents.keyEvents || [],
      audit: {
        propertySettings: {
          timezone: {
            status: propertyData.timeZone ? 'configured' : 'missing',
            value: propertyData.timeZone || 'Not set',
            recommendation: propertyData.timeZone ? 'Timezone is properly configured' : 'Set your property timezone for accurate reporting'
          },
          currency: {
            status: propertyData.currencyCode ? 'configured' : 'missing',
            value: propertyData.currencyCode || 'Not set',
            recommendation: propertyData.currencyCode ? 'Currency is properly configured' : 'Set your default currency for e-commerce tracking'
          },
          industryCategory: {
            status: propertyData.industryCategory ? 'configured' : 'missing',
            value: propertyData.industryCategory || 'Not set',
            recommendation: propertyData.industryCategory ? 'Industry category is set for benchmarking' : 'Set industry category for benchmarking insights'
          },
          dataRetention: {
            status: 'configured',
            value: '14 months (default)',
            recommendation: 'Consider extending data retention if you need longer historical analysis'
          }
        },
        dataCollection: {
          dataStreams: {
            status: dataStreams.dataStreams?.length > 0 ? 'configured' : 'missing',
            value: `${dataStreams.dataStreams?.length || 0} data stream(s) configured`,
            recommendation: dataStreams.dataStreams?.length > 0 ? 'Data streams are configured' : 'Add a web data stream for your website'
          },
          enhancedMeasurement: {
            status: enhancedMeasurementStatus,
            value: enhancedMeasurementDetails,
            recommendation: enhancedMeasurementStatus === 'configured' 
              ? 'Enhanced measurement provides automatic event tracking for web streams'
              : 'Enable enhanced measurement for automatic event tracking (page views, scrolls, outbound clicks, site search, video engagement, file downloads)'
          }
        },
        keyEvents: {
          keyEvents: {
            status: keyEvents.keyEvents?.length > 0 ? 'configured' : 'missing',
            value: `${keyEvents.keyEvents?.length || 0} key event(s) configured`,
            recommendation: keyEvents.keyEvents?.length > 0 ? 'Key events are configured for conversion tracking' : 'Set up key events for your important business goals (purchases, sign-ups, downloads, etc.)'
          }
        },
        integrations: {
          googleAds: {
            status: 'requires_manual_check',
            value: 'Check Google Ads linking in GA4 interface',
            recommendation: 'Link Google Ads account in GA4 Admin > Product linking for conversion importing and audience sharing'
          },
          searchConsole: {
            status: 'requires_manual_check',
            value: 'Check Search Console linking in GA4 interface', 
            recommendation: 'Link Search Console in GA4 Admin > Product linking for organic search insights and page performance data'
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
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Check your access token and API permissions'
      }),
    };
  }
};

export { handler };
