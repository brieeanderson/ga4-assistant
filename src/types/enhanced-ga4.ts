export interface PIIAnalysis {
  hasPII: boolean | null;
  severity: 'critical' | 'high' | 'medium' | 'none' | 'unknown';
  severityScore: number;
  details?: {
    critical: PIIInstance[];
    high: PIIInstance[];
    medium: PIIInstance[];
    totalAffectedUrls: number;
    totalPageViews: number;
    sampleUrls: Record<string, Array<{ url: string; pageViews: number }>>;
  };
  totalUrlsChecked: number;
  recommendation: string;
  adminPath: string;
  error?: string;
}

export interface PIIInstance {
  type: string;
  parameter: string;
  value: string;
  url: string;
  pageViews: number;
  description: string;
}

export interface SearchAnalysis {
  hasSearchEvents: boolean;
  searchEventCount: number;
  hasSearchTerms: boolean;
  searchTermsCount: number;
  topSearchTerms: Array<{
    term: string;
    users: number;
  }>;
  customSearchParams: Array<{
    parameter: string;
    totalViews: number;
    category: string;
    occurrences: number;
  }>;
  missedSearchPatterns: Array<{
    parameter: string;
    value: string;
    url: string;
    views: number;
    category: string;
    source: string;
  }>;
  totalCustomSearchActivity: number;
  status: 'optimal' | 'partial' | 'needs_config' | 'missed_opportunity' | 'none' | 'unknown';
  recommendation: string;
  adminPath: string;
  configurationSuggestions: string[];
  error?: string;
}

export interface TrafficAnalysis {
  unwantedReferrals: {
    detected: boolean | null;
    count: number;
    sources: Array<{
      source: string;
      medium: string;
      sessions: number;
      bounceRate: number;
      avgSessionDuration: number;
    }>;
    totalSessions: number;
    recommendation: string;
    error?: string;
  };
  crossDomainIssues: {
    detected: boolean | null;
    count: number;
    sources: Array<{
      source: string;
      medium: string;
      sessions: number;
      bounceRate: number;
      avgSessionDuration: number;
    }>;
    totalSessions: number;
    recommendation: string;
    error?: string;
  };
  referralAnalysis: {
    totalReferralSources: number;
    totalReferralSessions: number;
    topReferrals: Array<{
      source: string;
      medium: string;
      sessions: number;
      bounceRate: number;
      avgSessionDuration: number;
    }>;
  };
  adminPaths: {
    referralExclusions: string;
    crossDomainSetup: string;
  };
}

export interface EnhancedDataQuality {
  dataQualityScore: number;
  criticalIssues: number;
  warnings: number;
  piiAnalysis: PIIAnalysis;
  searchAnalysis: SearchAnalysis;
  trafficAnalysis: TrafficAnalysis;
  summary: {
    status: 'critical' | 'warning' | 'good';
    message: string;
  };
}

// Update your existing GA4Audit interface to include enhanced data
export interface EnhancedGA4Audit {
  // Your existing GA4Audit properties...
  property: {
    name: string;
    displayName: string;
    timeZone: string;
    currencyCode: string;
    industryCategory?: string;
    createTime: string;
    updateTime: string;
  };
  dataStreams: Array<{
    name: string;
    displayName: string;
    type: string;
    webStreamData?: {
      measurementId: string;
      defaultUri: string;
    };
    createTime: string;
    updateTime: string;
  }>;
  keyEvents: Array<{
    name: string;
    eventName: string;
    createTime: string;
    deletable: boolean;
    custom: boolean;
  }>;
  customDimensions: Array<{
    name: string;
    parameterName: string;
    displayName: string;
    description?: string;
    scope: string;
  }>;
  customMetrics: Array<{
    name: string;
    parameterName: string;
    displayName: string;
    description?: string;
    measurementUnit: string;
    scope: string;
  }>;
  enhancedMeasurement: Array<{
    streamId: string;
    streamName: string;
    settings: {
      streamEnabled: boolean;
      pageChangesEnabled: boolean;
      scrollsEnabled: boolean;
      outboundClicksEnabled: boolean;
      siteSearchEnabled: boolean;
      videoEngagementEnabled: boolean;
      fileDownloadsEnabled: boolean;
      formInteractionsEnabled: boolean;
    };
  }>;
  dataRetention: {
    eventDataRetention: string;
    resetUserDataOnNewActivity: boolean;
  };
  googleAdsLinks: Array<{
    name: string;
    customerId: string;
    createTime: string;
    updateTime: string;
    creatorEmailAddress: string;
    adPersonalizationEnabled: boolean;
    campaignDataSharingEnabled: boolean;
  }>;
  bigQueryLinks: Array<{
    name: string;
    project: string;
    createTime: string;
    dailyExportEnabled: boolean;
    streamingExportEnabled: boolean;
  }>;
  attribution: {
    reportingAttributionModel: string;
    acquisitionConversionEventLookbackWindow: string;
    otherConversionEventLookbackWindow: string;
    channelsThatCanReceiveCredit?: string;
  };
  
  // Enhanced data quality properties
  dataQuality?: EnhancedDataQuality;
  
  // Audit results with enhanced items
  audit: {
    propertySettings: { [key: string]: AuditItem };
    dataCollection: { 
      [key: string]: AuditItem;
    } & {
      piiRedaction?: AuditItem;
      siteSearch?: AuditItem;
      unwantedReferrals?: AuditItem;
      crossDomainTracking?: AuditItem;
    };
    customDefinitions: { [key: string]: AuditItem };
    keyEvents: { [key: string]: AuditItem };
    integrations: { [key: string]: AuditItem };
  };
  
  userInfo?: {
    email: string;
    name: string;
  };
}

export interface AuditItem {
  status: 'good' | 'warning' | 'critical' | 'missing' | 'unknown';
  value: string;
  recommendation: string;
  details?: string;
  quota?: string;
  warnings?: string[];
  adminPath?: string;
}

// Manual checklist types
export interface ManualCheckItem {
  id: string;
  title: string;
  description: string;
  importance: 'critical' | 'important' | 'optional';
  category: 'privacy' | 'data-quality' | 'attribution' | 'tracking';
  scoreImpact: number;
  adminPath: string;
  steps: string[];
  docs: Array<{ title: string; url: string }>;
  warningText?: string;
  successText?: string;
  detectionHint?: string;
}

// Enhanced scoring configuration
export interface ScoringRule {
  id: string;
  label: string;
  type: 'user-collected' | 'automatic' | 'enhanced';
  deduction: (audit: EnhancedGA4Audit) => number;
  suggestion: string;
  importance: 'critical' | 'very-important' | 'important' | 'info';
}

// Website analysis with enhanced checks
export interface EnhancedWebsiteAnalysis {
  domain: string;
  gtmContainers: string[];
  ga4Properties: string[];
  currentSetup: {
    gtmInstalled: boolean;
    ga4Connected: boolean;
    enhancedEcommerce: boolean;
    serverSideTracking: boolean;
    crossDomainTracking: {
      enabled: boolean;
      domains: string[];
    };
    consentMode: boolean;
    debugMode: boolean;
  };
  configurationAudit: any;
  enhancedImplementationAnalysis?: {
    crossDomainSetup: {
      hasLinkerSetup: boolean;
      detectedDomains: string[];
      status: 'good' | 'warning' | 'critical';
      recommendation: string;
    };
    sessionTimeout: {
      hasCustomTimeout: boolean;
      timeoutValue: number | null;
      status: 'good' | 'warning' | 'critical';
      recommendation: string;
    };
    enhancedMeasurementConfig: {
      hasSiteSearchConfig: boolean;
      searchParameters: string[];
      hasFormIdConfig: boolean;
      status: 'good' | 'warning' | 'critical';
      recommendation: string;
    };
    piiInCode: {
      hasPIIInCode: boolean;
      piiTypes: string[];
      status: 'good' | 'critical';
      recommendation: string;
    };
    implementationScore: number;
  };
  recommendations: string[];
  analysisMethod: string;
}

export interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
}

export type StatusType = 'good' | 'warning' | 'critical' | 'missing';

export interface PriorityRecommendation {
  priority: 'critical' | 'important';
  text: string;
  icon: any;
}
