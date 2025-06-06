import { useState, useEffect } from 'react';
import { generateOAuthUrl } from '@/lib/oauth';

interface OAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useOAuth() {
  const [state, setState] = useState<OAuthState>({
    isAuthenticated: false,
    accessToken: null,
    userEmail: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem('ga4_access_token');
    const email = localStorage.getItem('ga4_user_email');
    
    if (token) {
      setState({
        isAuthenticated: true,
        accessToken: token,
        userEmail: email,
        isLoading: false,
        error: null
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = () => {
    const authUrl = generateOAuthUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('ga4_access_token');
    localStorage.removeItem('ga4_user_email');
    setState({
      isAuthenticated: false,
      accessToken: null,
      userEmail: null,
      isLoading: false,
      error: null
    });
  };

  const setTokens = (accessToken: string, userEmail?: string) => {
    localStorage.setItem('ga4_access_token', accessToken);
    if (userEmail) {
      localStorage.setItem('ga4_user_email', userEmail);
    }
    
    setState({
      isAuthenticated: true,
      accessToken,
      userEmail: userEmail || null,
      isLoading: false,
      error: null
    });
  };

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  return {
    ...state,
    login,
    logout,
    setTokens,
    setError
  };
}
