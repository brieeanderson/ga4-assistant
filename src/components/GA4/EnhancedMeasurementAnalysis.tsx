import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Zap, XCircle } from 'lucide-react';
import { GA4Audit } from '@/types/ga4';

interface EnhancedMeasurementAnalysisProps {
  audit: GA4Audit;
}

export const EnhancedMeasurementAnalysis: React.FC<EnhancedMeasurementAnalysisProps> = ({ audit }) => {
  if (!audit.enhancedMeasurement || audit.enhancedMeasurement.length === 0) {
    return (
      <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl">
        <h4 className="text-xl font-bold text-white mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-3 text-orange-400" />
          Enhanced Measurement Configuration
        </h4>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h5 className="text-lg font-semibold text-red-300 mb-2">No Enhanced Measurement Found</h5>
          <p className="text-gray-300">Enable Enhanced Measurement in your data stream settings for automatic event tracking.</p>
        </div>
      </div>
    );
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
            {stream.streamName} - Automatic Event Tracking
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Page Views */}
            <div className={`p-4 rounded-lg border ${stream.settings.streamEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.streamEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <XCircle className="w-5 h-5 text-red-400" />
                }
                <span className="font-medium text-white">Page Views</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.streamEnabled ? 'Active - Tracking page_view events' : 'Disabled - No page tracking'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: page_location, page_title, page_referrer
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.scrollsEnabled ? 'Active - 90% page scroll events' : 'Disabled - Enable for engagement insights'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: scroll depth, engagement time
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.outboundClicksEnabled ? 'Active - External link tracking' : 'Disabled - Enable for referral insights'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: link_url, link_text, outbound_click
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.siteSearchEnabled ? 'Active - view_search_results events' : 'Disabled - Enable for search insights'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: search_term (check parameters: q, search, query)
              </p>
              {stream.settings.siteSearchEnabled && (
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <p className="text-xs text-yellow-300">
                    ⚠️ Verify search terms appear in GA4 reports
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.videoEngagementEnabled ? 'Active - YouTube video tracking' : 'Disabled - Enable for video insights'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: video_current_time, video_duration, video_percent, video_title
              </p>
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.fileDownloadsEnabled ? 'Active - PDF, DOC, ZIP tracking' : 'Disabled - Enable for download insights'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: file_name, file_extension, link_text
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.formInteractionsEnabled ? 'Active - form_start/submit events' : 'Disabled - Enable for form insights'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: form_id, form_name, form_destination
              </p>
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
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.pageChangesEnabled ? 'Active - SPA page change detection' : 'Disabled - Enable for SPA tracking'}
              </p>
              <p className="text-xs text-gray-400">
                Captures: page_view for single-page applications
              </p>
            </div>
          </div>

          {/* Summary and Recommendations */}
          <div className="bg-black/50 rounded-lg p-4 border border-gray-700/50">
            <h6 className="font-semibold text-white mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-orange-400" />
              Configuration Summary & Recommendations
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Active Events:</strong> {[
                    stream.settings.streamEnabled && 'page_view',
                    stream.settings.scrollsEnabled && 'scroll', 
                    stream.settings.outboundClicksEnabled && 'click',
                    stream.settings.siteSearchEnabled && 'view_search_results',
                    stream.settings.videoEngagementEnabled && 'video_*',
                    stream.settings.fileDownloadsEnabled && 'file_download',
                    stream.settings.formInteractionsEnabled && 'form_*',
                    stream.settings.pageChangesEnabled && 'page_view (SPA)'
                  ].filter(Boolean).join(', ') || 'None'}
                </p>
                
                <p className="text-sm text-gray-300">
                  <strong>Coverage:</strong> {[
                    stream.settings.streamEnabled,
                    stream.settings.scrollsEnabled,
                    stream.settings.outboundClicksEnabled,
                    stream.settings.siteSearchEnabled,
                    stream.settings.videoEngagementEnabled,
                    stream.settings.fileDownloadsEnabled,
                    stream.settings.formInteractionsEnabled,
                    stream.settings.pageChangesEnabled
                  ].filter(Boolean).length}/8 events enabled
                </p>
              </div>
              
              <div>
                <p className="text-sm text-orange-300 font-medium mb-2">Next Steps:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  {!stream.settings.scrollsEnabled && <li>• Enable scroll tracking for engagement insights</li>}
                  {!stream.settings.outboundClicksEnabled && <li>• Enable outbound clicks for referral tracking</li>}
                  {!stream.settings.fileDownloadsEnabled && <li>• Enable file downloads for resource engagement</li>}
                  {stream.settings.siteSearchEnabled && <li>• Verify search terms appear in GA4 reports</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
