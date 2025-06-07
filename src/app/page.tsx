'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseOAuthCallback } from '@/lib/oauth';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash;
        console.log('OAuth callback hash:', hash);

        if (!hash) {
          throw new Error('No authentication data received');
        }

        const { accessToken, error, state } = parseOAuthCallback(hash);

        if (error) {
          throw new Error(`Authentication failed: ${error}`);
        }

        if (!accessToken) {
          throw new Error('No access token received');
        }

        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user information');
        }

        const userInfo = await userResponse.json();
        console.log('User info:', userInfo);

        localStorage.setItem('ga4_access_token', accessToken);
        localStorage.setItem('ga4_user_email', userInfo.email || '');

        setStatus('success');
        setMessage(`Successfully authenticated as ${userInfo.email}`);

        setTimeout(() => {
          router.push('/?connected=true');
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        setTimeout(() => {
          router.push('/?error=auth_failed');
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-red-400 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Connecting Your Account</h2>
              <p className="text-gray-300">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Successfully Connected!</h2>
              <p className="text-gray-300 mb-4">{message}</p>
              <p className="text-sm text-gray-400">Redirecting to your GA4 audit...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Connection Failed</h2>
              <p className="text-gray-300 mb-4">{message}</p>
              <p className="text-sm text-gray-400">Redirecting back to try again...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
