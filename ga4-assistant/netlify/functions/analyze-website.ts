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

    // Import puppeteer dynamically to avoid issues
    const puppeteer = await import('puppeteer');

    // Use Puppeteer to analyze the website
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    // Track network requests
    const gtmRequests: string[] = [];
    const ga4Requests: string[] = [];
    
    page.on('request', (request) => {
      const requestUrl = request.url();
      if (requestUrl.includes('googletagmanager.com/gtm.js')) {
        gtmRequests.push(requestUrl);
      }
      if (requestUrl.includes('google-analytics.com/g/collect')) {
        ga4Requests.push(requestUrl);
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract GA4/GTM data from the page
    const analysis = await page.evaluate(() => {
      const results = {
        gtmContainers: [] as string[],
        ga4Properties: [] as string[],
        dataLayerEvents: [] as any[],
        gtmSnippetFound: false,
        crossDomainTracking: {
          enabled: false,
          domains: [] as string[]
        },
        enhancedEcommerce: false,
        consentMode: false,
        debugMode: false
      };

      // Check for GTM snippet
      const scripts = Array.from(document.scripts);
      
      // Find GTM containers
      scripts.forEach(script => {
        if (script.src && script.src.includes('googletagmanager.com/gtm.js')) {
          const match = script.src.match(/id=([^&]+)/);
          if (match && match[1]) {
            results.gtmContainers.push(match[1]);
            results.gtmSnippetFound = true;
          }
        }
        
        // Check script content for gtag or dataLayer
        if (script.textContent) {
          // Look for GA4 measurement IDs
          const ga4Matches = script.textContent.match(/G-[A-Z0-9]{10}/g);
          if (ga4Matches) {
            results.ga4Properties.push(...ga4Matches);
          }
          
          // Check for cross-domain tracking
          if (script.textContent.includes('linker') || script.textContent.includes('cross_domain')) {
            results.crossDomainTracking.enabled = true;
          }
          
          // Check for consent mode
          if (script.textContent.includes('consent_mode') || script.textContent.includes('ad_storage')) {
            results.consentMode = true;
          }
          
          // Check for debug mode
          if (script.textContent.includes('debug_mode')) {
            results.debugMode = true;
          }
        }
      });

      // Check dataLayer if available
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        results.dataLayerEvents = (window as any).dataLayer.slice(0, 10); // First 10 events
        
        // Check for ecommerce events
        const hasEcommerce = (window as any).dataLayer.some((event: any) => 
          event.event && ['purchase', 'add_to_cart', 'view_item'].includes(event.event)
        );
        results.enhancedEcommerce = hasEcommerce;
      }

      return results;
    });

    await browser.close();

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
        customEvents: { status: 'incomplete', value: `${analysis.dataLayerEvents.length} detected`, recommendation: 'Review event structure' },
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
        serverSideTracking: false, // Would need more complex detection
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
