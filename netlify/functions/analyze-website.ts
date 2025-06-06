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
    const { url, crawlMode = 'single', maxPages = 1000 } = JSON.parse(event.body || '{}');
    
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
    
    // Enhanced detection patterns - GTM-focused approach
    const gtmContainerPattern = /GTM-[A-Z0-9]+/g;
    const ga4DirectPattern = /gtag\('config',\s*['"]?(G-[A-Z0-9]+)['"]?\)/g;
    const gtagPattern = /gtag\(/g;
    const dataLayerPattern = /dataLayer/g;
    
    // Debug logging
    console.log('=== DETECTION DEBUG ===');
    console.log('URL:', url);
    console.log('HTML length:', html.length);
    
    const gtmContainers = Array.from(html.matchAll(gtmContainerPattern)).map(match => match[0]);
    const ga4DirectMatches = Array.from(html.matchAll(ga4DirectPattern)).map(match => match[1]);
    
    // Smart GA4 detection logic
    const hasDirectGA4 = ga4DirectMatches.length > 0;
    const hasGTM = gtmContainers.length > 0;
    const hasDataLayer = dataLayerPattern.test(html);
    const hasGtag = gtagPattern.test(html);
    
    // If GTM is present, assume GA4 is likely configured within it
    const likelyHasGA4ViaGTM = hasGTM && hasDataLayer;
    
    console.log('GTM containers found:', gtmContainers);
    console.log('Direct GA4 found:', ga4DirectMatches);
    console.log('Has GTM:', hasGTM);
    console.log('Has dataLayer:', hasDataLayer);
    console.log('Has gtag calls:', hasGtag);
    console.log('Likely has GA4 via GTM:', likelyHasGA4ViaGTM);
    
    // For reporting purposes - if no direct GA4 but GTM exists, indicate potential GA4
    const ga4Properties = hasDirectGA4 ? ga4DirectMatches : (likelyHasGA4ViaGTM ? ['G-XXXXXX (configured in GTM)'] : []);
    
    const hasGtagFinal = gtagPattern.test(html);

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
          status: hasGTM || ga4Properties.length > 0 ? 'detected' : 'not-detected',
          value: hasGTM ? 'GTM detected (GA4 likely configured)' : ga4Properties.length > 0 ? 'GA4 detected' : 'No GA4 found',
          recommendation: hasGTM ? 'Verify GA4 configuration within GTM container' : 'Set up Google Analytics 4 tracking'
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
          status: hasGtagFinal || hasGTM ? 'detected' : 'not-detected',
          value: hasGTM ? 'GTM container active' : hasGtagFinal ? 'Basic tracking active' : 'No tracking detected',
          recommendation: hasGTM ? 'Verify page_view events in GTM' : 'Ensure page_view events are firing correctly'
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
      ...(gtmContainers.length > 0 && !hasDirectGA4 ? ['Verify GA4 configuration in your GTM container'] : []),
      ...(gtmContainers.length === 0 && ga4Properties.length === 0 ? ['Set up Google Analytics 4 property'] : []),
      ...(hasGTM ? ['Check GTM container for proper GA4 tag configuration'] : []),
      ...(!html.includes('consent') ? ['Implement Google Consent Mode for privacy compliance'] : []),
      ...(!html.includes('enhanced_ecommerce') && !html.includes('purchase') ? ['Set up e-commerce tracking if you sell products'] : []),
      'Connect your GA4 account for complete property configuration audit',
      hasGTM ? 'Verify GA4 tag configuration in GTM interface' : 'Set up enhanced measurement settings in GA4',
      'Set up custom events for key business actions',
      'Configure conversion goals in GA4',
      'Link Google Ads account for conversion tracking'
    ];

    console.log('=== FINAL RESULTS ===');
    console.log('GTM containers (unique):', [...new Set(gtmContainers)]);
    console.log('GA4 properties (unique):', [...new Set(ga4Properties)]);
    console.log('Enhanced measurement detected:', html.includes('enhanced_ecommerce') || html.includes('purchase') || html.includes('add_to_cart'));
    console.log('=== END DEBUG ===');

    return {
      domain: url,
      gtmContainers: [...new Set(gtmContainers)],
      ga4Properties: [...new Set(ga4Properties)],
      currentSetup: {
        gtmInstalled: gtmContainers.length > 0,
        ga4Connected: ga4Properties.length > 0 || (hasGTM && hasDataLayer), // Assume GA4 if GTM + dataLayer
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

  // Add some common pages to discover if starting with just homepage
  if (startUrl.endsWith('/') || startUrl.split('/').pop()?.includes('.') === false) {
    const commonPaths = [
      '/about', '/services', '/contact', '/blog', '/products', 
      '/team', '/pricing', '/features', '/support'
    ];
    
    commonPaths.forEach(path => {
      const commonUrl = new URL(path, startUrl).toString();
      if (!urlsToVisit.includes(commonUrl)) {
        urlsToVisit.push(commonUrl);
        totalDiscovered++;
      }
    });
    
    console.log(`Added ${commonPaths.length} common pages to initial crawl queue`);
  }

  console.log(`Starting site crawl for: ${startUrl}`);
  console.log(`Max pages to analyze: ${maxPages} (effectively unlimited)`);

  while (urlsToVisit.length > 0 && analyzed < maxPages) {
    const currentUrl = urlsToVisit.shift()!;
    const normalizedUrl = normalizeUrl(currentUrl);
    
    if (visitedUrls.has(normalizedUrl)) {
      console.log(`Skipping already visited: ${normalizedUrl}`);
      continue;
    }
    visitedUrls.add(normalizedUrl);

    try {
      console.log(`Analyzing page ${analyzed + 1}: ${currentUrl}`);
      console.log(`Queue remaining: ${urlsToVisit.length} URLs`);
      
      const scrapingbeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(currentUrl)}&render_js=true&wait=1000&timeout=8000`;
      
      const response = await fetch(scrapingbeeUrl, { 
        timeout: 8000 // 8 second timeout for each request
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      
      // Check for tracking - GTM-focused approach with better dataLayer detection
      const gtmFound = /GTM-[A-Z0-9]+/.test(html);
      const ga4DirectFound = /gtag\('config',\s*['"]?(G-[A-Z0-9]+)['"]?\)/.test(html);
      const hasDataLayerOnPage = /dataLayer/.test(html) || /window\.dataLayer/.test(html);
      const hasGoogleAnalytics = /google-analytics\.com|googletagmanager\.com/.test(html);
      
      // If GTM is present, very likely GA4 is configured (most modern GTM setups have GA4)
      const ga4Found = ga4DirectFound || (gtmFound && hasGoogleAnalytics);
      
      console.log(`Page ${analyzed + 1} - GTM: ${gtmFound}, GA4: ${ga4Found} (direct: ${ga4DirectFound}, dataLayer: ${hasDataLayerOnPage}, googleAnalytics: ${hasGoogleAnalytics})`);
      
      const gtmContainers = Array.from(html.matchAll(/GTM-[A-Z0-9]+/g)).map(m => m[0]);
      const ga4DirectMatches = Array.from(html.matchAll(/gtag\('config',\s*['"]?(G-[A-Z0-9]+)['"]?\)/g)).map(m => m[1]);
      
      // For GTM setups, show placeholder since actual ID is in GTM
      const allGA4Properties = ga4DirectMatches.length > 0 ? ga4DirectMatches : (gtmFound ? ['GA4 configured via GTM'] : []);

      const pageAnalysis = {
        url: currentUrl,
        status: 'success' as const,
        gtmFound,
        ga4Found,
        gtmContainers: gtmContainers,
        ga4Properties: allGA4Properties
      };
      
      pageDetails.push(pageAnalysis);
      analyzed++;
      
      if (gtmFound) withGTM++;
      if (ga4Found) withGA4++;
      if (!gtmFound && !ga4Found) {
        untaggedPages.push(pageAnalysis);
      }
      
      // Enhanced link discovery - no page limit restrictions
      if (urlsToVisit.length < 200) { // Only stop discovery if queue gets too large
        // Multiple link extraction patterns
        const linkPatterns = [
          /href="([^"]*?)"/g,           // Standard href attributes
          /href='([^']*?)'/g,           // Single quote hrefs
          /<a[^>]+href=["']([^"']+)["']/g, // More specific anchor tags
        ];
        
        let allLinks: string[] = [];
        linkPatterns.forEach(pattern => {
          const matches = Array.from(html.matchAll(pattern));
          allLinks.push(...matches.map(match => match[1]));
        });
        
        // Also look for sitemap links and navigation
        const sitemapMatches = html.match(/(?:sitemap|navigation|menu|nav)[\s\S]*?href=["']([^"']+)["']/gi) || [];
        allLinks.push(...sitemapMatches.map(match => match.match(/href=["']([^"']+)["']/)?.[1]).filter(Boolean) as string[]);
        
        console.log(`Found ${allLinks.length} total links on ${currentUrl}`);
        
        const newUrls = allLinks
          .filter(Boolean)
          .map(href => {
            try {
              // Handle relative URLs
              if (href.startsWith('/')) {
                return new URL(href, currentUrl).toString();
              } else if (href.startsWith('http')) {
                const urlObj = new URL(href);
                // Only include if same domain
                return urlObj.hostname === domain ? href : null;
              } else if (!href.includes('://') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                return new URL(href, currentUrl).toString();
              }
              return null;
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .filter(url => {
            if (!url) return false;
            try {
              const urlObj = new URL(url);
              const normalizedNew = normalizeUrl(url);
              return urlObj.hostname === domain && 
                     !url.includes('#') && 
                     !url.includes('?') &&
                     !url.includes('.pdf') &&
                     !url.includes('.jpg') &&
                     !url.includes('.png') &&
                     !url.includes('.gif') &&
                     !url.includes('.css') &&
                     !url.includes('.js') &&
                     !url.includes('.xml') &&
                     !visitedUrls.has(normalizedNew) &&
                     !urlsToVisit.includes(url) &&
                     normalizedNew !== normalizeUrl(currentUrl); // Don't add self
            } catch {
              return false;
            }
          })
          .slice(0, 25); // Allow more URLs per page since no strict limit
        
        console.log(`Valid URLs after filtering: ${newUrls.length}`);
        console.log(`Sample URLs: ${newUrls.slice(0, 5).join(', ')}`);
        urlsToVisit.push(...newUrls as string[]);
        totalDiscovered = Math.max(totalDiscovered, visitedUrls.size + urlsToVisit.length);
        
        // If we didn't find many links, try common page patterns
        if (newUrls.length < 5 && analyzed <= 3) {
          const commonPages = [
            '/about', '/about-us', '/services', '/products', '/contact', 
            '/blog', '/news', '/pricing', '/features', '/team',
            '/privacy', '/terms', '/support', '/help', '/faq'
          ].map(path => new URL(path, startUrl).toString());
          
          const validCommonPages = commonPages.filter(url => 
            !visitedUrls.has(normalizeUrl(url)) && !urlsToVisit.includes(url)
          );
          
          console.log(`Adding ${validCommonPages.length} common pages to crawl queue`);
          urlsToVisit.push(...validCommonPages);
          totalDiscovered += validCommonPages.length;
        }
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
      isComplete: urlsToVisit.length === 0,
      estimatedPagesRemaining: urlsToVisit.length
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
