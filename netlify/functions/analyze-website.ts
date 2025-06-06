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

    // Try to fetch the website
    let response;
    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (fetchError) {
      // If HTTPS fails, try HTTP
      if (url.startsWith('https://')) {
        const httpUrl = url.replace('https://', 'http://');
        try {
          response = await fetch(httpUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
          });
          if (response.ok) {
            url = httpUrl; // Update URL to the working one
          } else {
            throw fetchError; // Throw original HTTPS error
          }
        } catch {
          throw fetchError; // Throw original HTTPS error
        }
      } else {
        throw fetchError;
      }
    }

    const html = await response.text();

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

    // Look for GTM containers (multiple patterns)
    const gtmPatterns = [
      /googletagmanager\.com\/gtm\.js\?id=([^"&'>\s]+)/gi,
      /GTM-[A-Z0-9]{6,}/gi,
      /'gtm\.start'[^}]+container['"]\s*:\s*['"]([^'"]+)['"]/gi
    ];

    gtmPatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches) {
        matches.forEach(match => {
          let containerId = '';
          if (match.includes('id=')) {
            const idMatch = match.match(/id=([^"&'>\s]+)/);
            containerId = idMatch ? idMatch[1] : '';
          } else if (match.startsWith('GTM-')) {
            containerId = match;
          } else {
            const containerMatch = match.match(/['"]([^'"]+)['"]$/);
            containerId = containerMatch ? containerMatch[1] : '';
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
      /ga\(['"]create['"],\s*['"]([^'"]+)['"]/gi
    ];

    ga4Patterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches) {
        matches.forEach(match => {
          let propertyId = '';
          if (match.startsWith('G-')) {
            propertyId = match;
          } else {
            const idMatch = match.match(/['"]([^'"]+)['"]$/);
            if (idMatch && (idMatch[1].startsWith('G-') || idMatch[1].startsWith('UA-'))) {
              propertyId = idMatch[1];
            }
          }
          
          if (propertyId && !analysis.ga4Properties.includes(propertyId)) {
            analysis.ga4Properties.push(propertyId);
          }
        });
      }
    });

    // Check for various tracking features
    const checks = [
      { property: 'crossDomainTracking.enabled', patterns: [/linker/i, /cross[_-]?domain/i, /allowLinker/i] },
      { property: 'consentMode', patterns: [/consent[_-]?mode/i, /ad_storage/i, /analytics_storage/i] },
      { property: 'debugMode', patterns: [/debug[_-]?mode/i, /gtag_enable_tcf_support/i] },
      { property: 'enhancedEcommerce', patterns: [/purchase/i, /add_to_cart/i, /view_item/i, /ecommerce/i] }
    ];

    checks.forEach(check => {
      const found = check.patterns.some(pattern => pattern.test(html));
      if (found) {
        if (check.property === 'crossDomainTracking.enabled') {
          analysis.crossDomainTracking.enabled = true;
        } else {
          analysis[check.property as keyof typeof analysis] = true;
        }
      }
    });

    // Generate recommendations
    const recommendations = [];
    
    if (analysis.gtmContainers.length === 0) {
      recommendations.push('No Google Tag Manager container detected - consider implementing GTM for easier tag management');
    }
    
    if (analysis.ga4Properties.length === 0) {
      recommendations.push('No Google Analytics 4 property detected - implement GA4 for comprehensive analytics');
    }
    
    if (!analysis.crossDomainTracking.enabled && (url.includes('www.') || html.includes('domain'))) {
      recommendations.push('Consider setting up cross-domain tracking if you have multiple domains');
    }
    
    if (!analysis.consentMode) {
      recommendations.push('Implement Google Consent Mode v2 for privacy compliance (GDPR/CCPA)');
    }
    
    if (analysis.debugMode) {
      recommendations.push('Debug mode detected - ensure this is disabled in production');
    }
    
    if (!analysis.enhancedEcommerce && html.toLowerCase().includes('shop')) {
      recommendations.push('Consider implementing Enhanced Ecommerce tracking for better conversion insights');
    }

    // Add note about limitations
    if (html.includes('javascript') || html.includes('JS') || html.includes('script')) {
      recommendations.push('⚠️ This site uses JavaScript - some tracking codes may not be detected in this basic scan');
    }

    // Build configuration audit
    const configurationAudit = {
      propertySettings: {
        timezone: { status: 'unknown', value: 'Not detectable via HTML scan', recommendation: 'Check GA4 admin settings' },
        currency: { status: 'unknown', value: 'Not detectable via HTML scan', recommendation: 'Check GA4 admin settings' }
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
      analysisMethod: 'HTML parsing (JavaScript-heavy sites may have limited detection)',
      analysisDate: new Date().toISOString()
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
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Make sure the URL is accessible and try including https://'
      }),
    };
  }
};
