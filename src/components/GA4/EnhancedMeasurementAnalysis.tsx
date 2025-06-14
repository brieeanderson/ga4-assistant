import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface EnhancedMeasurementAnalysisProps {
  audit: GA4Audit;
}

export const EnhancedMeasurementAnalysis: React.FC<EnhancedMeasurementAnalysisProps> = ({ audit }) => {
  if (!audit.enhancedMeasurement || audit.enhancedMeasurement.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
      <h4 className="text-xl font-bold text-white mb-6 flex items-center">
        <Zap className="w-6 h-6 mr-3 text-orange-400" />
        Enhanced Measurement Configuration
      </h4>
      
      {audit.enhancedMeasurement.map((stream, streamIndex) => (
        <div key={streamIndex} className="mb-6 last:mb-0">
          <h5 className="text-lg font-semibold text-white mb-4">
            {stream.streamName} - Enhanced Events Status
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Page Views */}
            <div className={`p-4 rounded-lg border ${stream.settings.streamEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.streamEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                }
                <span className="font-medium text-white">Page Views</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.streamEnabled ? 'Active - Tracking page_view events' : 'Disabled - No page tracking'}
              </p>
            </div>

            {/* Scrolls */}
            <div className={`p-4 rounded-lg border ${stream.settings.scrollsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.scrollsEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">Scroll Tracking</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.scrollsEnabled ? 'Active - 90% page scroll events' : 'Disabled'}
              </p>
            </div>

            {/* Outbound Clicks */}
            <div className={`p-4 rounded-lg border ${stream.settings.outboundClicksEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.outboundClicksEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">Outbound Clicks</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.outboundClicksEnabled ? 'Active - External link tracking' : 'Disabled'}
              </p>
            </div>

            {/* Site Search */}
            <div className={`p-4 rounded-lg border ${stream.settings.siteSearchEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.siteSearchEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">Site Search</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.siteSearchEnabled ? 'Active - view_search_results events' : 'Disabled'}
              </p>
              {stream.settings.siteSearchEnabled && (
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <p className="text-xs text-yellow-300">
                    ⚠️ Verify search terms are captured. Check GA4 reports for search_term data.
                  </p>
                </div>
              )}
            </div>

            {/* Video Engagement */}
            <div className={`p-4 rounded-lg border ${stream.settings.videoEngagementEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.videoEngagementEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">Video Engagement</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.videoEngagementEnabled ? 'Active - YouTube video tracking' : 'Disabled'}
              </p>
              {stream.settings.videoEngagementEnabled && (() => {
                const videoParams = ['video_current_time', 'video_duration', 'video_percent', 'video_title', 'video_url'];
                const existingDimensions = audit.customDimensions.map(cd => cd.parameterName.toLowerCase());
                const missingVideoParams = videoParams.filter(param => !existingDimensions.includes(param));
                
                return missingVideoParams.length > 0 ? (
                  <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-xs text-red-300">
                      ⚠️ Missing dimensions: {missingVideoParams.join(', ')}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-xs text-green-300">
                      ✅ All video dimensions configured
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* File Downloads */}
            <div className={`p-4 rounded-lg border ${stream.settings.fileDownloadsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.fileDownloadsEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">File Downloads</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.fileDownloadsEnabled ? 'Active - PDF, DOC, ZIP tracking' : 'Disabled'}
              </p>
            </div>

            {/* Form Interactions */}
            <div className={`p-4 rounded-lg border ${stream.settings.formInteractionsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.formInteractionsEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">Form Interactions</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.formInteractionsEnabled ? 'Active - form_start/submit events' : 'Disabled'}
              </p>
              {stream.settings.formInteractionsEnabled && (() => {
                const formParams = ['form_id', 'form_name', 'form_destination', 'form_submit_text'];
                const existingDimensions = audit.customDimensions.map(cd => cd.parameterName.toLowerCase());
                const missingFormParams = formParams.filter(param => !existingDimensions.includes(param));
                
                return missingFormParams.length > 0 ? (
                  <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-xs text-red-300">
                      ⚠️ Missing dimensions: {missingFormParams.join(', ')}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-xs text-green-300">
                      ✅ All form dimensions configured
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Page Changes (SPA) */}
            <div className={`p-4 rounded-lg border ${stream.settings.pageChangesEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.pageChangesEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                }
                <span className="font-medium text-white">Page Changes</span>
              </div>
              <p className="text-sm text-gray-300">
                {stream.settings.pageChangesEnabled ? 'Active - SPA page change detection' : 'Disabled'}
              </p>
            </div>
          </div>

          {/* Recommendations for this stream */}
          <div className="bg-black/50 rounded-lg p-4 border border-gray-700/50">
            <h6 className="font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-orange-400" />
              Configuration Recommendations
            </h6>
            <div className="space-y-2">
              {!stream.settings.scrollsEnabled && (
                <p className="text-sm text-gray-300">
                  💡 Enable scroll tracking to measure content engagement depth
                </p>
              )}
              {!stream.settings.outboundClicksEnabled && (
                <p className="text-sm text-gray-300">
                  💡 Enable outbound clicks to track referral traffic and partnerships
                </p>
              )}
              {!stream.settings.fileDownloadsEnabled && (
                <p className="text-sm text-gray-300">
                  💡 Enable file downloads to track resource engagement (PDFs, docs, etc.)
                </p>
              )}
              {stream.settings.siteSearchEnabled && (
                <p className="text-sm text-yellow-300">
                  🔍 Site search is enabled. Verify in GA4 Reports that search_term values appear in your data. If not, configure search parameters: q, search, query, keyword, s
                </p>
              )}
              {(() => {
                const enabledCount = [
                  stream.settings.scrollsEnabled,
                  stream.settings.outboundClicksEnabled,
                  stream.settings.siteSearchEnabled,
                  stream.settings.videoEngagementEnabled,
                  stream.settings.fileDownloadsEnabled,
                  stream.settings.formInteractionsEnabled,
                  stream.settings.pageChangesEnabled
                ].filter(Boolean).length;
                
                if (enabledCount >= 5) {
                  return (
                    <p className="text-sm text-green-300">
                      ✅ Excellent! You have {enabledCount}/7 enhanced measurement events enabled
                    </p>
                  );
                } else {
                  return (
                    <p className="text-sm text-orange-300">
                      📈 Consider enabling more events ({enabledCount}/7 currently active) for richer data insights
                    </p>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
