'use client';

import React, { useState } from 'react';
import { LogOut, User, Settings, AlertTriangle } from 'lucide-react';

const AccountManagement = () => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    
    try {
      // 1. Revoke OAuth tokens with Google
      await revokeGoogleTokens();
      
      // 2. Clear local storage/cookies
      clearLocalAuthData();
      
      // 3. Clear any stored user data
      clearUserData();
      
      // 4. Redirect to home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('There was an error disconnecting your account. Please try again.');
    } finally {
      setIsDisconnecting(false);
      setShowConfirmDialog(false);
    }
  };

  const revokeGoogleTokens = async () => {
    // This would call Google's OAuth revocation endpoint
    // https://developers.google.com/identity/protocols/oauth2/javascript/revoke
    const token = localStorage.getItem('google_access_token');
    if (token) {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
        method: 'POST',
      });
    }
  };

  const clearLocalAuthData = () => {
    // Clear all authentication-related data
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('user_profile');
    sessionStorage.clear();
    
    // Clear cookies if you're using them
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  const clearUserData = () => {
    // Clear any user-specific data you've stored
    localStorage.removeItem('ga4_properties');
    localStorage.removeItem('audit_results');
    localStorage.removeItem('user_preferences');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 mr-3 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm text-blue-800">
              Connected to Google Analytics
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmDialog(true)}
          disabled={isDisconnecting}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isDisconnecting ? 'Disconnecting...' : 'Disconnect Google Account'}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Disconnect Account?
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              This will remove access to your Google Analytics data and sign you out. 
              You can reconnect anytime by signing in again.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement; 