import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { url, crawlMode = 'single', maxPages = 100 } = JSON.parse(event.body || '{}');
    
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Normalize URL
    const normalizeUrl = (inputUrl: string): string => {
      try {
        const urlObj = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
        urlObj.search = '';
        urlObj.hash = '';
        return urlObj.toString().replace(/\/$/, '');
      } catch {
        throw new Error('Invalid URL format');
      }
    };

    const baseUrl = normalizeUrl(url);
    console.log('Analyzing:', baseUrl);

    if (crawlMode === 'single') {
      // Single page analysis
      const analysis = await analyzeSinglePage(baseUrl);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(analysis),
      };
    } else {
      // Site-wide crawl
      const crawlResults = await crawlWebsite(baseUrl, maxPages);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(crawlResults),
      };
    }

  } catch (error: unknown) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      }),
    };
  }
};

// Single page analysis function
async function analyzeSinglePage(url: string) {
  const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
  
  if (!SCRAPINGBEE_API_KEY) {
    throw new Error('ScrapingBee API key not configured');
  }

  try {
    const scrapingbeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(url)}&render_js=true&wait=3000`;
    
    const response = await fetch(scrapingbeeUrl);
    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Enhanced detection patterns
    const gtmPattern = /gtag\('config',\s*'GA_MEASUREMENT_ID',\s*'(G-[A-Z0-9]+)'/g;
    const ga4Pattern = /gtag\('config',\s*'(G-[A-Z0-9]+)'/g;
    const gtmContainerPattern = /GTM-[A-Z0-9]+/g;
    const gtagPattern = /gtag\(/g;
    
    const gtmContainers = Array.from(html.matchAll(gtmContainerPattern)).map(match => match[0]);
    const ga4Properties = Array.from(html.matchAll(ga4Pattern)).map(match => match[1]);
    const hasGtag = gtagPattern.test(html);

    // Detailed configuration audit
    const configurationAudit = {
      propertySettings: {
        timezone: {
          status: 'unknown',
          value: 'Requires GA4 API access',
          recommendation: 'Connect your GA4 account to check timezone settings'
        },
        currency: {
          status: 'unknown', 
          value: 'Requires GA4 API access',
          recommendation: 'Connect your GA4 account to verify currency configuration'
        },
        industryCategory: {
          status: 'unknown',
          value: 'Requires GA4 API access', 
          recommendation: 'Set appropriate industry category for better insights'
        }
      },
      dataCollection: {
        enhancedMeasurement: {
          status: ga4Properties.length > 0 ? 'detected' : 'not-detected',
          value: ga4Properties.length > 0 ? 'GA4 detected' : 'No GA4 found',
          recommendation: 'Enable Enhanced Measurement for automatic event tracking'
        },
        crossDomainTracking: {
          status: html.includes('linker') ? 'detected' : 'not-detected',
          value: html.includes('linker') ? 'Cross-domain setup found' : 'No cross-domain tracking',
          recommendation: 'Configure cross-domain tracking if you have multiple domains'
        },
        consentMode: {
          status: html.includes('consent') ? 'detected' : 'not-detected',
          value: html.includes('consent') ? 'Consent implementation found' : 'No consent mode detected',
          recommendation: 'Implement Consent Mode for GDPR compliance'
        }
      },
      events: {
        pageView: {
          status: hasGtag ? 'detected' : 'not-detected',
          value: hasGtag ? 'Basic tracking active' : 'No tracking detected',
          recommendation: 'Ensure page_view events are firing correctly'
        },
        ecommerce: {
          status: html.includes('purchase') || html.includes('add_to_cart') ? 'detected' : 'not-detected',
          value: html.includes('purchase') ? 'E-commerce events found' : 'No e-commerce tracking',
          recommendation: 'Implement e-commerce tracking for revenue insights'
        }
      },
      integrations: {
        googleAds: {
          status: html.includes('AW-') ? 'detected' : 'not-detected',
          value: html.includes('AW-') ? 'Google Ads integration found' : 'No Google Ads integration',
          recommendation: 'Link Google Ads for conversion tracking'
        },
        searchConsole: {
          status: 'unknown',
          value: 'Requires GA4 account access',
          recommendation: 'Link Search Console for organic search insights'
        }
      }
    };

    const recommendations = [
      ...(gtmContainers.length === 0 ? ['Install Google Tag Manager for easier tag management'] : []),
      ...(ga4Properties.length === 0 ? ['Set up Google Analytics 4 property'] : []),
      ...(gtmContainers.length > 0 && ga4Properties.length === 0 ? ['Connect GA4 property to your GTM container'] : []),
      ...(!html.includes('consent') ? ['Implement Google Consent Mode for privacy compliance'] : []),
      ...(!html.includes('enhanced_ecommerce') && !html.includes('purchase') ? ['Set up e-commerce tracking if you sell products'] : []),
      'Connect your GA4 account for complete property configuration audit',
      'Verify enhanced measurement settings in GA4 interface',
      'Set up custom events for key business actions',
      'Configure conversion goals in GA4',
      'Link Google Ads account for conversion tracking'
    ];

    return {
      domain: url,
      gtmContainers: [...new Set(gtmContainers)],
      ga4Properties: [...new Set(ga4Properties)],
      currentSetup: {
        gtmInstalled: gtmContainers.length > 0,
        ga4Connected: ga4Properties.length > 0,
        enhancedEcommerce: html.includes('purchase') || html.includes('add_to_cart'),
        serverSideTracking: false,
        crossDomainTracking: {
          enabled: html.includes('linker'),
          domains: []
        },
        consentMode: html.includes('consent'),
        debugMode: html.includes('debug_mode')
      },
      configurationAudit,
      recommendations,
      analysisMethod: 'ScrapingBee + Enhanced Detection'
    };

  } catch (error) {
    throw new Error(`Failed to analyze ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Site-wide crawl function
async function crawlWebsite(startUrl: string, maxPages: number) {
  const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
  
  if (!SCRAPINGBEE_API_KEY) {
    throw new Error('ScrapingBee API key not configured');
  }

  const domain = new URL(startUrl).hostname;
  const visitedUrls = new Set<string>();
  const urlsToVisit = [startUrl];
  const pageDetails: any[] = [];
  const errorPages: any[] = [];
  const untaggedPages: any[] = [];
  
  let totalDiscovered = 1;
  let analyzed = 0;
  let withGTM = 0;
  let withGA4 = 0;
  let errors = 0;

  const normalizeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      urlObj.search = '';
      urlObj.hash = '';
      return urlObj.toString().replace(/\/$/, '');
    } catch {
      return '';
    }
  };

  while (urlsToVisit.length > 0 && analyzed < maxPages) {
    const currentUrl = urlsToVisit.shift()!;
    const normalizedUrl = normalizeUrl(currentUrl);
    
    if (visitedUrls.has(normalizedUrl)) continue;
    visitedUrls.add(normalizedUrl);

    try {
      console.log(`Analyzing page ${analyzed + 1}: ${currentUrl}`);
      
      const scrapingbeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(currentUrl)}&render_js=true&wait=2000`;
      
      const response = await fetch(scrapingbeeUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Check for tracking
      const gtmFound = /GTM-[A-Z0-9]+/.test(html);
      const ga4Found = /gtag\('config',\s*'(G-[A-Z0-9]+)'/.test(html);
      
      const pageAnalysis = {
        url: currentUrl,
        status: 'success' as const,
        gtmFound,
        ga4Found,
        gtmContainers: Array.from(html.matchAll(/GTM-[A-Z0-9]+/g)).map(m => m[0]),
        ga4Properties: Array.from(html.matchAll(/gtag\('config',\s*'(G-[A-Z0-9]+)'/g)).map(m => m[1])
      };
      
      pageDetails.push(pageAnalysis);
      analyzed++;
      
      if (gtmFound) withGTM++;
      if (ga4Found) withGA4++;
      if (!gtmFound && !ga4Found) {
        untaggedPages.push(pageAnalysis);
      }
      
      // Extract more URLs (limit discovery)
      if (analyzed < maxPages * 0.8) { // Stop discovering new URLs when we're 80% through
        const linkMatches = html.match(/href="([^"]*?)"/g) || [];
        const newUrls = linkMatches
          .map(link => link.match(/href="([^"]*?)"/)?.[1])
          .filter(Boolean)
          .map(href => {
            try {
              return new URL(href!, currentUrl).toString();
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .filter(url => {
            const urlObj = new URL(url!);
            return urlObj.hostname === domain && 
                   !url!.includes('#') && 
                   !url!.includes('?') &&
                   !visitedUrls.has(normalizeUrl(url!)) &&
                   !urlsToVisit.includes(url!);
          })
          .slice(0, 10); // Limit new URLs per page
        
        urlsToVisit.push(...newUrls as string[]);
        totalDiscovered = Math.max(totalDiscovered, visitedUrls.size + urlsToVisit.length);
      }
      
    } catch (error) {
      console.error(`Error analyzing ${currentUrl}:`, error);
      const errorPage = {
        url: currentUrl,
        status: 'error' as const,
        gtmFound: false,
        ga4Found: false,
        gtmContainers: [],
        ga4Properties: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      errorPages.push(errorPage);
      errors++;
      analyzed++;
    }
  }

  const successful = analyzed - errors;
  const taggedPages = Math.max(withGTM, withGA4);
  const coverage = successful > 0 ? Math.round((taggedPages / successful) * 100) : 0;

  const insights = [
    `Analyzed ${analyzed} pages across your website`,
    `Found ${withGTM} pages with GTM and ${withGA4} pages with GA4`,
    `${coverage}% of your pages have analytics tracking`,
    ...(untaggedPages.length > 0 ? [`${untaggedPages.length} pages are missing tracking completely`] : []),
    ...(errors > 0 ? [`${errors} pages had analysis errors`] : [])
  ];

  const recommendations = [
    ...(coverage < 95 ? [`Improve tracking coverage - currently at ${coverage}%`] : []),
    ...(withGTM === 0 ? ['Consider implementing Google Tag Manager'] : []),
    ...(withGA4 === 0 ? ['Set up Google Analytics 4'] : []),
    ...(untaggedPages.length > 0 ? ['Add tracking to untagged pages'] : []),
    'Connect GA4 account for detailed property configuration audit'
  ];

  return {
    crawlSummary: {
      totalPagesDiscovered: totalDiscovered,
      pagesAnalyzed: analyzed,
      successfulAnalysis: successful,
      pagesWithErrors: errors,
      pagesWithGTM: withGTM,
      pagesWithGA4: withGA4,
      tagCoverage: coverage,
      isComplete: urlsToVisit.length === 0 || analyzed >= maxPages,
      estimatedPagesRemaining: Math.max(0, urlsToVisit.length)
    },
    pageDetails: pageDetails.slice(0, 20),
    errorPages: errorPages.slice(0, 10),
    untaggedPages: untaggedPages.slice(0, 20),
    insights,
    recommendations,
    nextSteps: [
      'Connect your GA4 account for complete audit',
      'Review untagged pages and add tracking',
      'Fix any implementation errors found',
      'Set up conversion tracking for key actions'
    ]
  };
}

export { handler };
