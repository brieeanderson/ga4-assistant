import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Zap, XCircle, Search, Video, Download, FileText, MousePointer } from 'lucide-react';
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
          <p className="text-gray-300 mb-4">Enable Enhanced Measurement in your data stream settings for automatic event tracking.</p>
          <div className="text-xs text-gray-400">
            Admin &gt; Data Streams &gt; [Select Stream] &gt; Enhanced Measurement
          </div>
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
      
      <p className="text-gray-300 mb-8">
        Enhanced Measurement automatically tracks common website interactions without requiring additional code.
      </p>
      
      {audit.enhancedMeasurement.map((stream, streamIndex) => (
        <div key={streamIndex} className="mb-8 last:mb-0">
          <h5 className="text-lg font-semibold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            {stream.streamName} - Automatic Event Tracking
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Page Views */}
            <div className={`p-4 rounded-lg border ${stream.settings.streamEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.streamEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <XCircle className="w-5 h-5 text-red-400" />
                }
                <FileText className="w-4 h-4 text-gray-400" />
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
            <div className={`p-4 rounded-lg border ${stream.settings.scrollsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.scrollsEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                }
                <MousePointer className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-white">Scrolls</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.scrollsEnabled ? 'Active - Tracking scroll events' : 'Disabled - Missing engagement data'}
              </p>
              <p className="text-xs text-gray-400">
                Tracks 90% page scroll depth
              </p>
            </div>

            {/* Outbound Clicks */}
            <div className={`p-4 rounded-lg border ${stream.settings.outboundClicksEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.outboundClicksEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                }
                <MousePointer className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-white">Outbound Clicks</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.outboundClicksEnabled ? 'Active - Tracking external link clicks' : 'Disabled - Missing referral traffic insights'}
              </p>
              <p className="text-xs text-gray-400">
                Tracks clicks to external domains
              </p>
            </div>

            {/* Site Search */}
            <div className={`p-4 rounded-lg border ${stream.settings.siteSearchEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.siteSearchEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                }
                <Search className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-white">Site Search</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.siteSearchEnabled ? 'Active - Tracking site search events' : 'Disabled - Missing search insights'}
              </p>
              <p className="text-xs text-gray-400">
                {/* Site Search parameter not available in type */}
                No search parameter configured
              </p>
            </div>

            {/* Video Engagement */}
            <div className={`p-4 rounded-lg border ${stream.settings.videoEngagementEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.videoEngagementEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                }
                <Video className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-white">Video Engagement</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.videoEngagementEnabled ? 'Active - Tracking YouTube video events' : 'Disabled - Missing video analytics'}
              </p>
              <p className="text-xs text-gray-400">
                Tracks video_start, video_progress, video_complete
              </p>
            </div>

            {/* File Downloads */}
            <div className={`p-4 rounded-lg border ${stream.settings.fileDownloadsEnabled ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {stream.settings.fileDownloadsEnabled ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> : 
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                }
                <Download className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-white">File Downloads</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {stream.settings.fileDownloadsEnabled ? 'Active - Tracking file download events' : 'Disabled - Missing download insights'}
              </p>
              <p className="text-xs text-gray-400">
                Tracks PDF, DOC, XLS, ZIP downloads
              </p>
            </div>
          </div>

          {/* Site Search Configuration Details */}
          {stream.settings.siteSearchEnabled && (
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
              <h6 className="font-semibold text-blue-300 mb-3 flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Site Search Configuration
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Query Parameter:</span>
                  <div className="text-white font-medium">Not available</div>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <div className="font-medium text-yellow-400">
                    Not configurable
                  </div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-600/30 rounded">
                <p className="text-xs text-yellow-200">
                  <strong>Note:</strong> Site search parameter configuration is not available in this audit.
                </p>
              </div>
            </div>
          )}

          {/* Stream Summary */}
          <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
            <h6 className="font-semibold text-orange-300 mb-2">📊 Stream Summary</h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Active Features:</span>
                <div className="text-white font-medium">
                  {[
                    stream.settings.streamEnabled && 'Page Views',
                    stream.settings.scrollsEnabled && 'Scrolls',
                    stream.settings.outboundClicksEnabled && 'Outbound Clicks',
                    stream.settings.siteSearchEnabled && 'Site Search',
                    stream.settings.videoEngagementEnabled && 'Video',
                    stream.settings.fileDownloadsEnabled && 'Downloads'
                  ].filter(Boolean).length}/6 enabled
                </div>
              </div>
              <div>
                <span className="text-gray-400">Critical Missing:</span>
                <div className="text-red-400 font-medium">
                  {!stream.settings.streamEnabled ? 'Page Views' :
                   !stream.settings.scrollsEnabled ? 'Scroll Tracking' :
                   !stream.settings.siteSearchEnabled ? 'Site Search' : 'None'}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Configuration Status:</span>
                <div className={`font-medium ${
                  stream.settings.streamEnabled && stream.settings.scrollsEnabled ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {stream.settings.streamEnabled && stream.settings.scrollsEnabled ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Enhanced Measurement Recommendations */}
      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-600/30 rounded-lg">
        <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Enhanced Measurement Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-blue-200 mb-2">Essential Settings:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• <strong>Page Views:</strong> Always enable (required for basic tracking)</li>
              <li>• <strong>Scrolls:</strong> Enable for engagement measurement</li>
              <li>• <strong>Outbound Clicks:</strong> Track external referrals</li>
              <li>• <strong>Site Search:</strong> Configure with proper parameter</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-200 mb-2">Optional but Valuable:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• <strong>Video Engagement:</strong> If you embed YouTube videos</li>
              <li>• <strong>File Downloads:</strong> Track resource downloads</li>
              <li>• <strong>Form Interactions:</strong> Monitor form engagement</li>
              <li>• <strong>History Changes:</strong> Track SPA navigation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Path Reference */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded border border-gray-600/50">
        <p className="text-xs text-gray-400 mb-1">
          <strong>Admin Location:</strong> Admin &gt; Data Streams &gt; [Select Stream] &gt; Enhanced Measurement
        </p>
        <p className="text-xs text-gray-300">
          Changes take effect immediately but may take 24-48 hours to appear in reports.
        </p>
      </div>
    </div>
  );
};
