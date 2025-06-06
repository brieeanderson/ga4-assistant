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

    // If no propertyId provided, first get the user's properties
    if (!propertyId) {
      const propertiesResponse = await fetch(
        'https://analyticsadmin.googleapis.com/v1beta/accounts',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!propertiesResponse.ok) {
        throw new Error(`Failed to fetch accounts: ${propertiesResponse.status}`);
      }

      const accountsData = await propertiesResponse.json();
      
      // Get properties for the first account
      if (accountsData.accounts && accountsData.accounts.length > 0) {
        const accountName = accountsData.accounts[0].name;
        
        const propertiesListResponse = await fetch(
          `https://analyticsadmin.googleapis.com/v1beta/${accountName}/properties`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (propertiesListResponse.ok) {
          const propertiesData = await propertiesListResponse.json();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              type: 'property_list',
              accounts: accountsData.accounts,
              properties: propertiesData.properties || []
            }),
          };
        }
      }
    }

    // If propertyId is provided, get detailed property audit
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
      throw new Error(`Failed to fetch property: ${propertyResponse.status}`);
    }

    const propertyData = await propertyResponse.json();

    // Get additional property details
    const [dataStreamsResponse, conversionsResponse] = await Promise.allSettled([
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/dataStreams`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }),
      fetch(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/conversionEvents`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
    ]);

    const dataStreams = dataStreamsResponse.status === 'fulfilled' && dataStreamsResponse.value.ok
      ? await dataStreamsResponse.value.json()
      : { dataStreams: [] };

    const conversions = conversionsResponse.status === 'fulfilled' && conversionsResponse.value.ok
      ? await conversionsResponse.value.json()
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
            status: 'unknown',
            value: 'Check individual data streams',
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
      }
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
        error: error instanceof Error ? error.message : 'GA4 audit failed' 
      }),
    };
  }
};

export { handler };
