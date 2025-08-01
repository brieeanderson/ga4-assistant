'use client';

import React from 'react';
import { ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

const GoogleAccountDisconnect = () => {
  const handleDisconnect = () => {
    // Open Google's account permissions page in a new tab
    window.open('https://myaccount.google.com/permissions', '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Disconnect Google Account
        </h2>
        <p className="text-gray-600">
          To disconnect your Google account, you'll need to revoke access through Google's account settings.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">How to disconnect:</h3>
            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
              <li>Click the button below to open Google Account settings</li>
              <li>Find "GA4 Assistant" or your app in the list of connected apps</li>
              <li>Click "Remove Access" or "Disconnect"</li>
              <li>Confirm the action when prompted</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleDisconnect}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Open Google Account Settings
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            After disconnecting, you can always reconnect by signing in again.
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">What happens when you disconnect:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>We'll lose access to your Google Analytics data</li>
          <li>Any stored audit results will be cleared</li>
          <li>You'll need to sign in again to use the app</li>
          <li>Your Google account and data remain unchanged</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleAccountDisconnect; 