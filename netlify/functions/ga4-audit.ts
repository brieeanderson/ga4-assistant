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
        
        // Get properties for each account
        let allProperties: any[] = [];
        
        if (accountsData.accounts && accountsData.accounts.length > 0) {
          console.log(`Processing ${accountsData.accounts.length} accounts for properties...`);
          
          // Process first few accounts to avoid timeout
          const accountsToProcess = accountsData.accounts.slice(0, 5); // Limit to 5 accounts initially
          console.log(`Processing first ${accountsToProcess.length} accounts to avoid timeout`);
          
          for (const account of accountsToProcess) {
            console.log(`Fetching properties for account: ${account.name} (${account.displayName})`);
            
            try {
              const propertiesUrl = `https://analyticsadmin.googleapis.com/v1beta/${account.name}/properties`;
              console.log(`Making request to: ${propertiesUrl}`);
              
              const propertiesResponse = await fetch(propertiesUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                }
              });

              console.log(`Properties response for ${account.name}:`, propertiesResponse.status);

              if (propertiesResponse.ok) {
                const propertiesData = await propertiesResponse.json();
                console.log(`Raw properties data for ${account.name}:`, JSON.stringify(propertiesData, null, 2));
                console.log(`Found ${propertiesData.properties?.length || 0} properties in ${account.displayName}`);
                
                if (propertiesData.properties && propertiesData.properties.length > 0) {
                  // Add account info to each property for better display
                  const propertiesWithAccount = propertiesData.properties.map((property: any) => ({
                    ...property,
                    accountName: account.displayName,
                    accountId: account.name,
                    // Ensure we have both propertyId and name for compatibility
                    propertyId: property.name ? property.name.split('/').pop() : property.propertyId
                  }));
                  console.log(`Processed properties for ${account.name}:`, propertiesWithAccount);
                  allProperties.push(...propertiesWithAccount);
                } else {
                  console.log(`No properties found in account ${account.displayName}`);
                }
              } else {
                const errorText = await propertiesResponse.text();
                console.error(`Failed to fetch properties for ${account.name}:`, {
                  status: propertiesResponse.status,
                  statusText: propertiesResponse.statusText,
                  error: errorText,
                  url: propertiesUrl
                });
              }
            } catch (error) {
              console.error(`Error fetching properties for ${account.name}:`, error);
            }
            
            // Small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          console.log(`Total properties found across ${accountsToProcess.length} accounts: ${allProperties.length}`);
          console.log(`All properties:`, allProperties);
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
    const [dataStreamsResult, conversionsResult] = await Promise.allSettled([
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.ok ? r.json() : { dataStreams: [] }),
      
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/conversionEvents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }).then(r => r.ok ? r.json() : { conversionEvents: [] })
    ]);

    const dataStreams = dataStreamsResult.status === 'fulfilled' 
      ? dataStreamsResult.value 
      : { dataStreams: [] };

    const conversions = conversionsResult.status === 'fulfilled' 
      ? conversionsResult.value 
      : { conversionEvents: [] };

    // Build comprehensive audit
    const audit = {
      property: propertyData,
      dataStreams: dataStreams.dataStreams || [],
      conversions: conversions.conversionEvents || [],
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
            recommendation: 'Set industry category for benchmarking insights'
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
            status: 'requires_stream_check',
            value: 'Check individual data streams for enhanced measurement settings',
            recommendation: 'Enable enhanced measurement for automatic event tracking'
          }
        },
        conversions: {
          conversionEvents: {
            status: conversions.conversionEvents?.length > 0 ? 'configured' : 'missing',
            value: `${conversions.conversionEvents?.length || 0} conversion event(s)`,
            recommendation: conversions.conversionEvents?.length > 0 ? 'Conversion events are configured' : 'Set up conversion events for your key business goals'
          }
        },
        integrations: {
          googleAds: {
            status: 'unknown',
            value: 'Requires additional API access',
            recommendation: 'Link Google Ads for conversion tracking'
          },
          searchConsole: {
            status: 'unknown',
            value: 'Requires additional API access', 
            recommendation: 'Link Search Console for organic search insights'
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
