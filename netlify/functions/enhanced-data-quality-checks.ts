interface UrlData {
  url: string;
  views: number;
}

interface SearchPatternConfig {
  param: string;
  pattern: RegExp;
  category: string;
}

interface TrafficSourceData {
  source: string;
  medium: string;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface MissedSearchPattern {
  parameter: string;
  value: string;
  url: string;
  views: number;
  category: string;
  source: string;
}

async function detectPIIInPagePaths(accessToken: string, propertyId: string) {
  try {
    console.log('🔍 Checking for PII in page paths and query strings...');
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [
            { name: 'pagePathPlusQueryString' } // This gives us full page path + query string reliably for web
          ],
          metrics: [{ name: 'screenPageViews' }],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          limit: 1000, // Check more URLs for comprehensive analysis
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`PII check failed: ${response.status}`);
    }

    const data = await response.json();
    const urls = data.rows?.map((row: any) => row.dimensionValues[0].value) || [];
    
    console.log(`📊 Analyzing ${urls.length} URLs for PII patterns...`);

    // Enhanced PII detection patterns
    const piiPatterns = {
      email: {
        pattern: /(?:[?&]|^)([^=]*(?:email|e-?mail|user-?email)[^=]*)=([^&]*@[^&]*)/gi,
        severity: 'critical',
        description: 'Email addresses in URL parameters'
      },
      phone: {
        pattern: /(?:[?&]|^)([^=]*(?:phone|tel|mobile|cell)[^=]*)=([^&]*(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}[^&]*)/gi,
        severity: 'critical',
        description: 'Phone numbers in URL parameters'
      },
      ssn: {
        pattern: /(?:[?&]|^)([^=]*(?:ssn|social|security)[^=]*)=([^&]*\d{3}-?\d{2}-?\d{4}[^&]*)/gi,
        severity: 'critical',
        description: 'Social Security Numbers in URL parameters'
      },
      creditCard: {
        pattern: /(?:[?&]|^)([^=]*(?:card|cc|credit)[^=]*)=([^&]*(?:4\d{3}|5[1-5]\d{2}|3[47]\d{2}|6011)[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}[^&]*)/gi,
        severity: 'critical',
        description: 'Credit card numbers in URL parameters'
      },
      userId: {
        pattern: /(?:[?&]|^)([^=]*(?:user[-_]?id|customer[-_]?id|member[-_]?id|uid)[^=]*)=([^&]*\d+[^&]*)/gi,
        severity: 'high',
        description: 'User/Customer IDs in URL parameters'
      },
      names: {
        pattern: /(?:[?&]|^)([^=]*(?:name|first[-_]?name|last[-_]?name|full[-_]?name|fname|lname)[^=]*)=([^&]{2,})/gi,
        severity: 'high',
        description: 'Personal names in URL parameters'
      },
      addresses: {
        pattern: /(?:[?&]|^)([^=]*(?:address|street|zip|postal|city)[^=]*)=([^&]*[^&]{5,}[^&]*)/gi,
        severity: 'medium',
        description: 'Address information in URL parameters'
      }
    };

    const detectedPII: any = {
      critical: [],
      high: [],
      medium: [],
      totalAffectedUrls: 0,
      totalPageViews: 0,
      sampleUrls: {}
    };

    urls.forEach((url: string, index: number) => {
      const pageViews = parseInt(data.rows[index].metricValues[0].value);
      let urlHasPII = false;

      Object.entries(piiPatterns).forEach(([piiType, config]) => {
        const matches = [...url.matchAll(config.pattern)];
        
        if (matches.length > 0) {
          urlHasPII = true;
          const severity = config.severity as 'critical' | 'high' | 'medium';
          
          matches.forEach(match => {
            detectedPII[severity].push({
              type: piiType,
              parameter: match[1],
              value: match[2],
              url: url,
              pageViews: pageViews,
              description: config.description
            });
          });

          // Store sample URLs for each PII type
          if (!detectedPII.sampleUrls[piiType]) {
            detectedPII.sampleUrls[piiType] = [];
          }
          if (detectedPII.sampleUrls[piiType].length < 3) {
            detectedPII.sampleUrls[piiType].push({
              url: url.length > 100 ? url.substring(0, 100) + '...' : url,
              pageViews: pageViews
            });
          }
        }
      });

      if (urlHasPII) {
        detectedPII.totalAffectedUrls++;
        detectedPII.totalPageViews += pageViews;
      }
    });

    // Calculate severity score
    const severityScore = 
      (detectedPII.critical.length * 10) + 
      (detectedPII.high.length * 5) + 
      (detectedPII.medium.length * 2);

    return {
      hasPII: detectedPII.critical.length > 0 || detectedPII.high.length > 0 || detectedPII.medium.length > 0,
      severity: detectedPII.critical.length > 0 ? 'critical' : 
                detectedPII.high.length > 0 ? 'high' : 
                detectedPII.medium.length > 0 ? 'medium' : 'none',
      severityScore,
      details: detectedPII,
      totalUrlsChecked: urls.length,
      recommendation: severityScore > 0 
        ? `URGENT: Configure data redaction in Admin > Data Settings > Data Collection. Found ${detectedPII.critical.length + detectedPII.high.length + detectedPII.medium.length} PII instances across ${detectedPII.totalAffectedUrls} URLs.`
        : 'No PII detected in URL parameters - good data privacy posture.',
      adminPath: 'Admin > Data Settings > Data Collection > Data redaction'
    };

  } catch (error) {
    console.error('Error detecting PII:', error);
    return {
      hasPII: null,
      severity: 'unknown',
      error: 'Could not analyze URLs for PII',
      recommendation: 'Unable to check for PII - verify GA4 API access'
    };
  }
}

// 2. Enhanced Search Terms Analysis - Focus on non-standard parameters GA4 might miss
async function analyzeSearchImplementation(accessToken: string, propertyId: string) {
  try {
    console.log('🔍 Analyzing search implementation...');
    
    // First check for view_search_results events (GA4's standard tracking)
    const searchEventsResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { value: 'view_search_results', matchType: 'EXACT' }
            }
          }
        })
      }
    );

    let hasSearchEvents = false;
    let searchEventCount = 0;

    if (searchEventsResponse.ok) {
      const searchData = await searchEventsResponse.json();
      hasSearchEvents = searchData.rows && searchData.rows.length > 0;
      if (hasSearchEvents) {
        searchEventCount = parseInt(searchData.rows[0].metricValues[0].value);
      }
    }

    // Check for actual search terms captured by GA4
    const searchTermsResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [{ name: 'searchTerm' }],
          metrics: [{ name: 'totalUsers' }],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          limit: 100
        })
      }
    );

    let searchTerms: any[] = [];
    let hasSearchTerms = false;

    if (searchTermsResponse.ok) {
      const termsData = await searchTermsResponse.json();
      if (termsData.rows && termsData.rows.length > 0) {
        searchTerms = termsData.rows
          .filter((row: any) => row.dimensionValues[0].value !== '(not set)')
          .map((row: any) => ({
            term: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value)
          }))
          .sort((a: any, b: any) => b.users - a.users);
        hasSearchTerms = searchTerms.length > 0;
      }
    }

    // Check URLs for NON-STANDARD search parameters that GA4 might miss
    // GA4 already handles: q, search, query, s, keyword
    let missedSearchPatterns: MissedSearchPattern[] = [];
    let customSearchParams: any[] = [];
    
    const urlResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [{ name: 'unifiedPageScreen' }],
          metrics: [{ name: 'screenPageViews' }],
          dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
          limit: 1000
        })
      }
    );

    if (urlResponse.ok) {
      const urlData = await urlResponse.json();
      const urls: UrlData[] = urlData.rows?.map((row: any) => ({
        url: row.dimensionValues[0].value,
        views: parseInt(row.metricValues[0].value)
      })) || [];

      // Non-standard search parameters that GA4 Enhanced Measurement might miss
      const customSearchPatterns: SearchPatternConfig[] = [
        // Common custom search parameters
        { param: 'search_term', pattern: /[?&](search_term)=([^&]+)/gi, category: 'custom' },
        { param: 'searchterm', pattern: /[?&](searchterm)=([^&]+)/gi, category: 'custom' },
        { param: 'SearchTerm', pattern: /[?&](SearchTerm)=([^&]+)/gi, category: 'camelCase' },
        { param: 'search-term', pattern: /[?&](search-term)=([^&]+)/gi, category: 'hyphenated' },
        { param: 'kw', pattern: /[?&](kw)=([^&]+)/gi, category: 'abbreviated' },
        { param: 'k', pattern: /[?&](k)=([^&]+)/gi, category: 'abbreviated' },
        { param: 'word', pattern: /[?&](word)=([^&]+)/gi, category: 'alternative' },
        { param: 'find', pattern: /[?&](find)=([^&]+)/gi, category: 'alternative' },
        { param: 'lookup', pattern: /[?&](lookup)=([^&]+)/gi, category: 'alternative' },
        { param: 'filter', pattern: /[?&](filter)=([^&]+)/gi, category: 'filtering' },
        { param: 'criteria', pattern: /[?&](criteria)=([^&]+)/gi, category: 'advanced' },
        
        // E-commerce specific
        { param: 'product_search', pattern: /[?&](product_search)=([^&]+)/gi, category: 'ecommerce' },
        { param: 'item_search', pattern: /[?&](item_search)=([^&]+)/gi, category: 'ecommerce' },
        { param: 'catalog_search', pattern: /[?&](catalog_search)=([^&]+)/gi, category: 'ecommerce' },
        
        // Platform specific
        { param: 'wp_search', pattern: /[?&](wp_search)=([^&]+)/gi, category: 'wordpress' },
        { param: 'drupal_search', pattern: /[?&](drupal_search)=([^&]+)/gi, category: 'drupal' },
        { param: 'shopify_search', pattern: /[?&](shopify_search)=([^&]+)/gi, category: 'shopify' },
        
        // URL path-based search (common patterns)
        { param: 'path_search', pattern: /\/search\/([^\/\?&]+)/gi, category: 'path_based' },
        { param: 'search_path', pattern: /\/find\/([^\/\?&]+)/gi, category: 'path_based' },
        { param: 'lookup_path', pattern: /\/lookup\/([^\/\?&]+)/gi, category: 'path_based' }
      ];

      // Track which custom parameters are found
      const foundCustomParams = new Set<string>();
      
      urls.forEach(({ url, views }: UrlData) => {
        customSearchPatterns.forEach(({ param, pattern, category }: SearchPatternConfig) => {
          const matches = [...url.matchAll(pattern)];
          matches.forEach(match => {
            const searchValue = decodeURIComponent(match[2] || match[1] || '');
            if (searchValue && searchValue.length > 0 && searchValue !== '(not set)') {
              foundCustomParams.add(param);
              
              missedSearchPatterns.push({
                parameter: param,
                value: searchValue,
                url: url.length > 100 ? url.substring(0, 100) + '...' : url,
                views: views,
                category: category,
                source: 'Custom parameter analysis'
              });
            }
          });
        });
      });

      // Deduplicate and categorize found parameters
      const paramCounts = new Map();
      const paramCategories = new Map();
      
      missedSearchPatterns.forEach(item => {
        const count = paramCounts.get(item.parameter) || 0;
        paramCounts.set(item.parameter, count + item.views);
        paramCategories.set(item.parameter, item.category);
      });

      customSearchParams = Array.from(paramCounts.entries())
        .map(([param, totalViews]) => ({
          parameter: param,
          totalViews,
          category: paramCategories.get(param),
          occurrences: missedSearchPatterns.filter(p => p.parameter === param).length
        }))
        .sort((a, b) => b.totalViews - a.totalViews);
    }

    // Determine overall search implementation status
    let status: string;
    let recommendation: string;
    
    if (hasSearchTerms && customSearchParams.length === 0) {
      status = 'optimal';
      recommendation = `✅ Search tracking is working correctly with ${searchTerms.length} unique search terms captured. No custom parameters detected.`;
    } else if (hasSearchTerms && customSearchParams.length > 0) {
      status = 'partial';
      recommendation = `⚠️ GA4 is capturing search terms, but ${customSearchParams.length} custom search parameter(s) detected that may not be tracked: ${customSearchParams.slice(0, 3).map(p => p.parameter).join(', ')}`;
    } else if (hasSearchEvents && customSearchParams.length > 0) {
      status = 'needs_config';
      recommendation = `🔧 Search events detected but no search terms captured. Found ${customSearchParams.length} custom parameter(s): ${customSearchParams.slice(0, 3).map(p => p.parameter).join(', ')}. Configure Enhanced Measurement or add custom tracking.`;
    } else if (customSearchParams.length > 0) {
      status = 'missed_opportunity';
      recommendation = `💡 Found ${customSearchParams.length} search parameter(s) that aren't being tracked: ${customSearchParams.slice(0, 3).map(p => p.parameter).join(', ')}. Set up Enhanced Measurement or custom event tracking.`;
    } else if (hasSearchEvents) {
      status = 'partial';
      recommendation = `⚠️ Search events detected but no search terms captured - check Enhanced Measurement search parameters configuration.`;
    } else {
      status = 'none';
      recommendation = `ℹ️ No search activity detected - this may be normal if your site doesn't have search functionality.`;
    }

    return {
      hasSearchEvents,
      searchEventCount,
      hasSearchTerms,
      searchTermsCount: searchTerms.length,
      topSearchTerms: searchTerms.slice(0, 10),
      customSearchParams,
      missedSearchPatterns: missedSearchPatterns.slice(0, 20),
      totalCustomSearchActivity: missedSearchPatterns.reduce((sum: number, item) => sum + item.views, 0),
      status,
      recommendation,
      adminPath: 'Admin > Data Streams > [Stream] > Enhanced measurement > Site search',
      configurationSuggestions: customSearchParams.length > 0 ? [
        `Add custom parameters to Enhanced Measurement: ${customSearchParams.slice(0, 5).map(p => p.parameter).join(', ')}`,
        'Or create custom events to track these search parameters',
        'Consider registering search_term as a custom dimension for custom parameters'
      ] : []
    };

  } catch (error) {
    console.error('Error analyzing search implementation:', error);
    return {
      status: 'unknown',
      error: 'Could not analyze search implementation',
      recommendation: 'Unable to check search tracking - verify GA4 API access'
    };
  }
}

// 3. Cross-Domain and Unwanted Referrals Analysis
async function analyzeTrafficSources(accessToken: string, propertyId: string) {
  try {
    console.log('🔍 Analyzing traffic sources for cross-domain and unwanted referrals...');
    
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dimensions: [
            { name: 'sessionSource' },
            { name: 'sessionMedium' }
          ],
          metrics: [
            { name: 'sessions' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ],
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 100
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Traffic analysis failed: ${response.status}`);
    }

    const data = await response.json();
    const sources = data.rows?.map((row: any) => ({
      source: row.dimensionValues[0].value,
      medium: row.dimensionValues[1].value,
      sessions: parseInt(row.metricValues[0].value),
      bounceRate: parseFloat(row.metricValues[1].value),
      avgSessionDuration: parseFloat(row.metricValues[2].value)
    })) || [];

    // Known payment processors and checkout services
    const paymentProcessors = [
      'paypal.com', 'stripe.com', 'square.com', 'checkout.com',
      'authorize.net', 'braintreepayments.com', 'dwolla.com',
      'affirm.com', 'klarna.com', 'afterpay.com', 'sezzle.com',
      'shop.app', 'shopify.com', 'amazon.com', 'ebay.com'
    ];

    // Detect unwanted referrals (payment processors)
    const unwantedReferrals = sources.filter((source: TrafficSourceData) =>
      source.medium === 'referral' &&
      paymentProcessors.some(processor => source.source.includes(processor))
    );

    // Detect potential cross-domain issues (your own domains as referrals)
    const suspiciousSelfReferrals = sources.filter((source: TrafficSourceData) => {
      if (source.medium !== 'referral') return false;
      
      // Look for common patterns that might indicate self-referrals
      const domain = source.source.toLowerCase();
      return domain.includes('www.') || 
             domain.includes('shop.') || 
             domain.includes('blog.') ||
             domain.includes('app.') ||
             domain.includes('portal.') ||
             // Very low bounce rate might indicate continuation of same session
             (source.bounceRate < 0.1 && source.sessions > 5);
    });

    // Analyze referral patterns for anomalies
    const referralSources = sources.filter((s: TrafficSourceData) => s.medium === 'referral');
    const totalReferralSessions = referralSources.reduce((sum: number, s: TrafficSourceData) => sum + s.sessions, 0);
    
    return {
      unwantedReferrals: {
        detected: unwantedReferrals.length > 0,
        count: unwantedReferrals.length,
        sources: unwantedReferrals,
        totalSessions: unwantedReferrals.reduce((sum: number, s: TrafficSourceData) => sum + s.sessions, 0),
        recommendation: unwantedReferrals.length > 0
          ? `🚨 CRITICAL: ${unwantedReferrals.length} payment processors detected as referrals. Add to referral exclusion list.`
          : '✅ No payment processor referrals detected'
      },
      crossDomainIssues: {
        detected: suspiciousSelfReferrals.length > 0,
        count: suspiciousSelfReferrals.length,
        sources: suspiciousSelfReferrals,
        totalSessions: suspiciousSelfReferrals.reduce((sum: number, s: TrafficSourceData) => sum + s.sessions, 0),
        recommendation: suspiciousSelfReferrals.length > 0
          ? `⚠️ Potential cross-domain tracking issues detected. Check if these are your own domains: ${suspiciousSelfReferrals.map((s: TrafficSourceData) => s.source).join(', ')}`
          : '✅ No obvious cross-domain tracking issues detected'
      },
      referralAnalysis: {
        totalReferralSources: referralSources.length,
        totalReferralSessions,
        topReferrals: referralSources.slice(0, 10)
      },
      adminPaths: {
        referralExclusions: 'Admin > Data Settings > Data Collection > Configure tag settings > Unwanted referrals',
        crossDomainSetup: 'Admin > Data Streams > [Stream] > Configure tag settings > Cross-domain tracking'
      }
    };

  } catch (error) {
    console.error('Error analyzing traffic sources:', error);
    return {
      unwantedReferrals: { detected: null, error: 'Could not analyze referral traffic' },
      crossDomainIssues: { detected: null, error: 'Could not analyze cross-domain setup' },
      recommendation: 'Unable to check traffic sources - verify GA4 API access'
    };
  }
}

// Helper function with timeout to prevent hanging requests
const fetchWithTimeout = async (url: string, options: any, timeoutMs: number = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Main integration function to add to your existing audit
export async function runEnhancedDataQualityChecks(accessToken: string, propertyId: string) {
  console.log('🚀 Running enhanced data quality checks...');
  
  const [piiAnalysis, searchAnalysis, trafficAnalysis] = await Promise.all([
    detectPIIInPagePaths(accessToken, propertyId),
    analyzeSearchImplementation(accessToken, propertyId),
    analyzeTrafficSources(accessToken, propertyId)
  ]);

  // Calculate overall data quality score
  let dataQualityScore = 100;
  let criticalIssues = 0;
  let warnings = 0;

  // PII scoring
  if (piiAnalysis.hasPII) {
    if (piiAnalysis.severity === 'critical') {
      dataQualityScore -= 25;
      criticalIssues++;
    } else if (piiAnalysis.severity === 'high') {
      dataQualityScore -= 15;
      warnings++;
    } else {
      dataQualityScore -= 5;
    }
  }

  // Unwanted referrals scoring
  if (trafficAnalysis.unwantedReferrals?.detected) {
    dataQualityScore -= 20;
    criticalIssues++;
  }

  // Cross-domain issues scoring
  if (trafficAnalysis.crossDomainIssues?.detected) {
    dataQualityScore -= 10;
    warnings++;
  }

  // Search implementation scoring
  if (searchAnalysis.status === 'missed_opportunity') {
    dataQualityScore -= 10;
    warnings++;
  } else if (searchAnalysis.status === 'needs_config') {
    dataQualityScore -= 15;
    warnings++;
  }

  return {
    dataQualityScore: Math.max(0, dataQualityScore),
    criticalIssues,
    warnings,
    piiAnalysis,
    searchAnalysis,
    trafficAnalysis,
    summary: {
      status: criticalIssues > 0 ? 'critical' : warnings > 0 ? 'warning' : 'good',
      message: criticalIssues > 0 
        ? `${criticalIssues} critical data quality issues found`
        : warnings > 0 
        ? `${warnings} data quality warnings found`
        : 'Data quality checks passed'
    }
  };
}
