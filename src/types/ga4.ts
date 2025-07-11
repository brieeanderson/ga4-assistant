export interface GA4Property {
  name: string;
  propertyId: string;
  displayName: string;
  timeZone?: string;
  currencyCode?: string;
  accountName?: string;
  accountId?: string;
}

export interface CustomDimension {
  displayName: string;
  parameterName: string;
  scope: string;
  description?: string;
}

export interface CustomMetric {
  displayName: string;
  parameterName: string;
  scope: string;
  unitOfMeasurement: string;
  description?: string;
}

export interface EnhancedMeasurementData {
  streamId: string;
  streamName: string;
  settings: {
    streamEnabled: boolean;
    scrollsEnabled?: boolean;
    outboundClicksEnabled?: boolean;
    siteSearchEnabled?: boolean;
    videoEngagementEnabled?: boolean;
    fileDownloadsEnabled?: boolean;
    formInteractionsEnabled?: boolean;
    pageChangesEnabled?: boolean;
  };
}

export interface DataStream {
  displayName: string;
  type: string;
  name: string;
  webStreamData?: {
    defaultUri: string;
  };
  crossDomainSettings?: {
    domains: string[];
  };
  sessionTimeout?: number;
}

export interface KeyEvent {
  eventName: string;
  createTime: string;
  countingMethod?: string;
}

export interface SearchConsoleDataStatus {
  isLinked: boolean;
  hasData: boolean;
  lastDataDate?: string;
  totalClicks: number;
  totalImpressions: number;
  organicImpressions: number;
  linkDetails: Array<any>;
}

// Enhanced Event Create Rule interface
export interface EventCreateRule {
  name?: string;
  displayName: string;
  eventConditions?: Array<{
    field: string;
    comparisonType: string;
    value: string;
  }>;
  destinationEvent?: string;
  parameterMutations?: Array<{
    parameter: string;
    parameterValue: string;
  }>;
  // Additional fields that might be available from the API
  sourceCopyParameters?: boolean;
  createTime?: string;
  etag?: string;
}

export interface EventCreateRuleStream {
  streamId?: string;
  streamName: string;
  rules: EventCreateRule[];
}

export interface GA4Audit {
  property: {
    displayName: string;
    name: string;
    timeZone?: string;
    currencyCode?: string;
    industryCategory?: string;
  };
  dataStreams: DataStream[];
  keyEvents: KeyEvent[];
  customDimensions: CustomDimension[];
  customMetrics: CustomMetric[];
  enhancedMeasurement: EnhancedMeasurementData[];
  measurementProtocolSecrets: Array<{
    streamName: string;
    secrets: Array<{ displayName: string }>;
  }>;
  eventCreateRules: EventCreateRuleStream[];
  searchConsoleDataStatus: SearchConsoleDataStatus;
  googleAdsLinks: Array<any>;
  bigQueryLinks: Array<any>;
  googleSignals: { state?: string };
  dataRetention: { 
    eventDataRetention?: string; 
    userDataRetention?: string; 
  };
  attribution: { 
    reportingAttributionModel?: string;
    acquisitionConversionEventLookbackWindow?: string;
    otherConversionEventLookbackWindow?: string;
  };
  dataFilters?: Array<{
    id: string;
    name: string;
    type: string;
    expression: string;
  }>;
  hostnames?: string[];
  dataQuality?: {
    piiAnalysis?: any;
    [key: string]: any;
  };
  audit: {
    propertySettings: { [key: string]: AuditItem };
    dataCollection: { [key: string]: AuditItem };
    customDefinitions: { [key: string]: AuditItem };
    keyEvents: { [key: string]: AuditItem };
    integrations: { [key: string]: AuditItem };
  };
  userInfo?: {
    email: string;
    name: string;
  };
  configScore: number;
  otherEvents?: Array<{ name: string; count: number }>;
}

export interface AuditItem {
  status: string;
  value: string;
  recommendation: string;
  details?: string;
  quota?: string;
  warnings?: string[];
}

export interface WebsiteAnalysis {
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
