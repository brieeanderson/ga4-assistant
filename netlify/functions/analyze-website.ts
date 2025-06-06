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
    let { url } = JSON.parse(event.body || '{}');
    
    if (!url) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Fix URL if missing protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Use ScrapingBee to get the rendered HTML (with JavaScript execution)
    const scrapingBeeApiKey = process.env.SCRAPINGBEE_API_KEY;
    
    if (!scrapingBeeApiKey) {
      throw new Error('ScrapingBee API key not configured');
    }

    const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${scrapingBeeApiKey}&url=${encodeURIComponent(url)}&render_js=true&wait=3000`;
    
    const response = await fetch(scrapingBeeUrl, {
      headers: {
        'User-Agent': 'GA4-GTM-Assistant/1.0'
      }
    });

    if (!response.ok) {
      // Fallback to basic fetch if ScrapingBee fails
      console.log('ScrapingBee failed, falling back to basic fetch');
      const fallbackResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
      }
      
      const html = await fallbackResponse.text();
      return await analyzeWebsite(url, html, corsHeaders, false);
    }

    const html = await response.text();
    return await analyzeWebsite(url, html, corsHeaders, true);

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Failed to analyze website',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Make sure the URL is accessible and try including https://'
      }),
    };
  }
};

async function analyzeWebsite(url: string, html: string, corsHeaders: any, usedJavaScript: boolean) {
  // Enhanced analysis using better regex patterns
  const analysis = {
    gtmContainers: [] as string[],
    ga4Properties: [] as string[],
    gtmSnippetFound: false,
    crossDomainTracking: { enabled: false, domains: [] as string[] },
    enhancedEcommerce: false,
    consentMode: false,
    debugMode: false
  };

  // Look for GTM containers (multiple patterns) - enhanced for JavaScript-rendered content
  const gtmPatterns = [
    /googletagmanager\.com\/gtm\.js\?id=([^"&'>\s]+)/gi,
    /GTM-[A-Z0-9]{6,}/gi,
    /'gtm\.start'[^}]+container['"]\s*:\s*['"]([^'"]+)['"]/gi,
    /gtm\.js.*id=([^"&'>\s]+)/gi,
    /container.*GTM-[A-Z0-9]{6,}/gi
  ];

  gtmPatterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(match => {
        let containerId = '';
        if (match.includes('id=')) {
          const idMatch = match.match(/id=([^"&'>\s]+)/);
          containerId = idMatch ? idMatch[1] : '';
        } else if (match.match(/GTM-[A-Z0-9]{6,}/)) {
          const gtmMatch = match.match(/GTM-[A-Z0-9]{6,}/);
          containerId = gtmMatch ? gtmMatch[0] : '';
        }
        
        if (containerId && !analysis.gtmContainers.includes(containerId)) {
          analysis.gtmContainers.push(containerId);
          analysis.gtmSnippetFound = true;
        }
      });
    }
  });

  // Look for GA4 measurement IDs (enhanced patterns)
  const ga4Patterns = [
    /G-[A-Z0-9]{10}/gi,
    /gtag\(['"]config['"],\s*['"]([^'"]+)['"]/gi,
    /ga\(['"]create['"],\s*['"]([^'"]+)['"]/gi,
    /measurement_id['"]?\s*:\s*['"]G-[A-Z0-9]{10}['"]/gi
  ];

  ga4Patterns.forEach(pattern => {
    const matches = html.match(pattern);
    if (matches) {
      matches.forEach(match => {
        let propertyId = '';
        if (match.startsWith('G-')) {
          propertyId = match;
        } else {
          const idMatch = match.match(/G-[A-Z0-9]{10}/);
          if (idMatch) {
            propertyId = idMatch[0];
          } else {
            const configMatch = match.match(/['"]([^'"]+)['"]$/);
            if (configMatch && (configMatch[1].startsWith('G-') || configMatch[1].startsWith('UA-'))) {
              propertyId = configMatch[1];
            }
          }
        }
        
        if (propertyId && !analysis.ga4Properties.includes(propertyId)) {
          analysis.ga4Properties.push(propertyId);
        }
      });
    }
  });

  // Check for cross-domain tracking
  if (/linker/i.test(html) || /cross[_-]?domain/i.test(html) || /allowLinker/i.test(html)) {
    analysis.crossDomainTracking.enabled = true;
  }

  // Check for consent mode
  if (/consent[_-]?mode/i.test(html) || /ad_storage/i.test(html) || /analytics_storage/i.test(html)) {
    analysis.consentMode = true;
  }

  // Check for debug mode
  if (/debug[_-]?mode/i.test(html) || /gtag_enable_tcf_support/i.test(html)) {
    analysis.debugMode = true;
  }

  // Check for ecommerce
  if (/purchase/i.test(html) || /add_to_cart/i.test(html) || /view_item/i.test(html) || /ecommerce/i.test(html)) {
    analysis.enhancedEcommerce = true;
  }

  // Generate recommendations
  const recommendations = [];
  
  if (analysis.gtmContainers.length === 0) {
    recommendations.push('No Google Tag Manager container detected - consider implementing GTM for easier tag management');
  } else {
    recommendations.push(`✅ GTM container detected (${analysis.gtmContainers.join(', ')}) - verify it's properly configured`);
  }
  
  if (analysis.ga4Properties.length === 0) {
    recommendations.push('No Google Analytics 4 property detected - implement GA4 for comprehensive analytics');
  } else {
    recommendations.push(`✅ GA4 property detected (${analysis.ga4Properties.join(', ')}) - verify tracking is working correctly`);
  }
  
  if (!analysis.crossDomainTracking.enabled && (url.includes('www.') || html.includes('domain'))) {
    recommendations.push('Consider setting up cross-domain tracking if you have multiple domains');
  }
  
  if (!analysis.consentMode) {
    recommendations.push('Implement Google Consent Mode v2 for privacy compliance (GDPR/CCPA)');
  }
  
  if (analysis.debugMode) {
    recommendations.push('⚠️ Debug mode detected - ensure this is disabled in production');
  }
  
  if (!analysis.enhancedEcommerce && html.toLowerCase().includes('shop')) {
    recommendations.push('Consider implementing Enhanced Ecommerce tracking for better conversion insights');
  }

  // Build configuration audit
  const configurationAudit = {
    propertySettings: {
      timezone: { status: 'unknown', value: 'Check GA4 admin settings', recommendation: 'Set timezone to match business location' },
      currency: { status: 'unknown', value: 'Check GA4 admin settings', recommendation: 'Set currency to match business currency' }
    },
    dataCollection: {
      basicTracking: { 
        status: analysis.ga4Properties.length > 0 ? 'detected' : 'not-detected', 
        value: `${analysis.ga4Properties.length} GA4 properties found`, 
        recommendation: analysis.ga4Properties.length > 0 ? 'Verify tracking is working correctly' : 'Implement GA4 tracking' 
      },
      tagManagement: { 
        status: analysis.gtmContainers.length > 0 ? 'detected' : 'not-detected', 
        value: `${analysis.gtmContainers.length} GTM containers found`, 
        recommendation: analysis.gtmContainers.length > 0 ? 'Verify container is properly configured' : 'Consider implementing Google Tag Manager' 
      },
      crossDomain: { 
        status: analysis.crossDomainTracking.enabled ? 'detected' : 'not-detected', 
        value: analysis.crossDomainTracking.enabled ? 'Cross-domain tracking detected' : 'No cross-domain tracking detected', 
        recommendation: 'Configure cross-domain tracking if you have multiple domains' 
      },
      privacyCompliance: { 
        status: analysis.consentMode ? 'detected' : 'not-detected', 
        value: analysis.consentMode ? 'Consent mode detected' : 'No consent mode detected', 
        recommendation: 'Implement Google Consent Mode v2 for privacy compliance' 
      }
    },
    events: {
      ecommerce: { 
        status: analysis.enhancedEcommerce ? 'detected' : 'not-detected', 
        value: analysis.enhancedEcommerce ? 'Ecommerce events detected' : 'No ecommerce events detected', 
        recommendation: 'Implement Enhanced Ecommerce if you have an online store' 
      }
    },
    integrations: {
      detectionNote: { 
        status: 'info', 
        value: 'Full integration status requires admin access', 
        recommendation: 'Check your GA4 admin panel for complete integration status' 
      }
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
    recommendations,
    analysisMethod: usedJavaScript ? 'JavaScript execution (full analysis)' : 'HTML parsing (basic analysis)',
    analysisDate: new Date().toISOString()
  };

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(result),
  };
}
