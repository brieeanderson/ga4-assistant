export const GOOGLE_OAUTH_CONFIG = {
  clientId: '389847521507-2c9v2cljanqclifk4a8ob4u4f8uh2v26.apps.googleusercontent.com',
  redirectUri: typeof window !== 'undefined' 
    ? `${window.location.origin}/oauth/callback`
    : 'https://ga4wise.netlify.app/oauth/callback',
  scopes: [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/tagmanager.readonly'
  ].join(' ')
};

export function generateOAuthUrl(): string {
  const state = Math.random().toString(36).substring(2, 15);
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('oauth_state', state);
  }
  
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    response_type: 'token',
    scope: GOOGLE_OAUTH_CONFIG.scopes,
    state: state,
    prompt: 'consent'
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function parseOAuthCallback(hash: string): { accessToken?: string; error?: string; state?: string } {
  const params: Record<string, string> = {};
  
  hash.replace(/^#/, '').split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  });
  
  return {
    accessToken: params.access_token,
    error: params.error,
    state: params.state
  };
}
