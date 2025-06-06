import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');
    
    if (!url) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Use fetch instead of Puppeteer for now
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();

    // Basic analysis using string matching (not as good as Puppeteer but works)
    const analysis = {
      gtmContainers: [] as string[],
      ga4Properties: [] as string[],
      gtmSnippetFound: false,
      crossDomainTracking: { enabled: false, domains: [] as string[] },
      enhancedEcommerce: false,
      consentMode: false,
      debugMode: false
    };

    // Look for GTM containers
    const gtmMatches = html.match(/googletagmanager\.com\/gtm\.js\?id=([^"&']+)/g);
    if (gtmMatches) {
      gtmMatches.forEach(match => {
        const idMatch = match.match(/id=([^"&']+)/);
        if (idMatch && idMatch[1]) {
          analysis.gtmContainers.push(idMatch[1]);
          analysis.gtmSnippetFound = true;
        }
      });
    }

    // Look for GA4 measurement IDs
    const ga4Matches = html.match(/G-[A-Z0-9]{10}/g);
    if (ga4Matches) {
      analysis.ga4Properties = [...new Set(ga4Matches)]; // Remove duplicates
    }

    // Check for cross-domain tracking
    if (html.includes('linker') || html.includes('cross_domain')) {
      analysis.crossDomainTracking.enabled = true;
    }

    // Check for consent mode
    if (html.includes('consent_mode') || html.includes('ad_storage')) {
      analysis.consentMode = true;
    }

    // Check for debug mode
    if (html.includes('debug_mode')) {
      analysis.debugMode = true;
    }

    // Check for ecommerce events
    if (html.includes('purchase') || html.includes('add_to_cart') || html.includes('view_item')) {
      analysis.enhancedEcommerce = true;
    }

    // Generate recommendations based on analysis
    const recommendations = [];
    
    if (analysis.gtmContainers.length === 0) {
      recommendations.push('Install Google Tag Manager container');
    }
    
    if (analysis.ga4Properties.length === 0) {
      recommendations.push('Configure Google Analytics 4 property');
    }
    
    if (!analysis.crossDomainTracking.enabled) {
      recommendations.push('Set up cross-domain tracking if needed');
    }
    
    if (!analysis.consentMode) {
      recommendations.push('Implement Consent Mode v2 for privacy compliance');
    }
    
    if (analysis.debugMode) {
      recommendations.push('Disable debug mode in production');
    }
    
    if (!analysis.enhancedEcommerce) {
      recommendations.push('Enable Enhanced Ecommerce tracking');
    }

    // Build configuration audit
    const configurationAudit = {
      propertySettings: {
        timezone: { status: 'incomplete', value: 'UTC (default)', recommendation: 'Set to business timezone' },
        currency: { status: 'incomplete', value: 'USD (default)', recommendation: 'Set to business currency' }
      },
      dataCollection: {
        siteSearchParams: { status: 'incomplete', value: 'Default (q,s,search,query,keyword)', recommendation: 'Configure custom search parameters' },
        piiRedaction: { status: 'incomplete', value: 'Not configured', recommendation: 'Redact PII from URL parameters' },
        crossDomain: { 
          status: analysis.crossDomainTracking.enabled ? 'complete' : 'incomplete', 
          value: analysis.crossDomainTracking.enabled ? 'Configured' : 'Not configured', 
          recommendation: 'Configure cross-domain tracking' 
        },
        unwantedReferrals: { status: 'incomplete', value: 'Not configured', recommendation: 'Define payment processor referrals' },
        ipFilters: { status: 'incomplete', value: 'Not configured', recommendation: 'Filter internal traffic' },
        sessionTimeout: { status: 'complete', value: '30 minutes (default)', recommendation: 'Default is usually fine' },
        googleSignals: { status: 'incomplete', value: 'Disabled', recommendation: 'Enable after privacy review' },
        dataRetention: { status: 'incomplete', value: '2 months (default)', recommendation: 'Consider 14 months after privacy review' }
      },
      events: {
        customEvents: { status: 'incomplete', value: 'Basic detection only', recommendation: 'Review event structure' },
        keyEvents: { status: 'incomplete', value: '0 configured', recommendation: 'Set 1-2 primary key events' },
        keyEventCounting: { status: 'incomplete', value: 'Not configured', recommendation: 'Choose once per session or per event' },
        keyEventValue: { status: 'incomplete', value: 'Not configured', recommendation: 'Set default values if needed' }
      },
      integrations: {
        googleAds: { status: 'incomplete', value: 'Not linked', recommendation: 'Link for conversion tracking' },
        searchConsole: { status: 'incomplete', value: 'Not linked', recommendation: 'Link for organic search data' },
        bigQuery: { status: 'incomplete', value: 'Not linked', recommendation: 'Consider for advanced analysis' },
        merchantCenter: { status: 'incomplete', value: 'Not linked', recommendation: 'Link for ecommerce insights' }
      }
    };

    const result = {
      domain: url,
      gtmContainers: analysis.gtmContainers,
      ga4Properties: analysis.ga4Properties,
      currentSetup: {
        gtmInstalled: analysis.gtmSnippetFound,
        ga4Connected: analysis.ga4Properties.length > 0,
        enhancedEcommerce: analysis.enhancedEcommerce,
        serverSideTracking: false,
        crossDomainTracking: analysis.crossDomainTracking,
        consentMode: analysis.consentMode,
        debugMode: analysis.debugMode
      },
      configurationAudit,
      recommendations
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to analyze website',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
