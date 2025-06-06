// Add this debug function to your page.tsx to test GA4 API access directly

const testGA4ApiAccess = async () => {
  if (!accessToken) {
    console.log('No access token available');
    return;
  }

  console.log('=== GA4 API DEBUG TEST ===');
  console.log('Access token (first 20 chars):', accessToken.substring(0, 20) + '...');

  // Test 1: Validate token
  try {
    console.log('Test 1: Validating token...');
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (userResponse.ok) {
      const userInfo = await userResponse.json();
      console.log('✅ Token valid for user:', userInfo.email);
    } else {
      console.error('❌ Token validation failed:', userResponse.status);
      return;
    }
  } catch (error) {
    console.error('❌ Token validation error:', error);
    return;
  }

  // Test 2: Test Analytics Admin API access
  try {
    console.log('Test 2: Testing Analytics Admin API...');
    const accountsResponse = await fetch(
      'https://analyticsadmin.googleapis.com/v1beta/accounts',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Analytics Admin API response status:', accountsResponse.status);
    
    if (accountsResponse.ok) {
      const accountsData = await accountsResponse.json();
      console.log('✅ Analytics Admin API working');
      console.log('Accounts found:', accountsData.accounts?.length || 0);
      console.log('Accounts data:', accountsData);
    } else {
      const errorText = await accountsResponse.text();
      console.error('❌ Analytics Admin API failed');
      console.error('Status:', accountsResponse.status);
      console.error('Error:', errorText);
      
      // Common error interpretations
      if (accountsResponse.status === 403) {
        console.log('💡 This usually means:');
        console.log('   - API not enabled properly');
        console.log('   - Insufficient permissions');
        console.log('   - User has no GA4 properties');
      } else if (accountsResponse.status === 401) {
        console.log('💡 This usually means:');
        console.log('   - Invalid or expired token');
        console.log('   - OAuth scopes issue');
      }
    }
  } catch (error) {
    console.error('❌ Analytics Admin API error:', error);
  }

  // Test 3: Check token scopes
  try {
    console.log('Test 3: Checking token scopes...');
    const tokenInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    
    if (tokenInfoResponse.ok) {
      const tokenInfo = await tokenInfoResponse.json();
      console.log('Token scopes:', tokenInfo.scope);
      console.log('Token expires in:', tokenInfo.expires_in, 'seconds');
      
      const requiredScopes = [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
      ];
      
      const hasRequiredScopes = requiredScopes.every(scope => 
        tokenInfo.scope?.includes(scope)
      );
      
      if (hasRequiredScopes) {
        console.log('✅ All required scopes present');
      } else {
        console.log('❌ Missing required scopes');
        console.log('Required:', requiredScopes);
        console.log('Actual:', tokenInfo.scope);
      }
    }
  } catch (error) {
    console.error('Token info check failed:', error);
  }

  console.log('=== DEBUG TEST COMPLETE ===');
};

// Add this button to your GA4Connection component for testing
const DebugButton = () => (
  <button
    onClick={testGA4ApiAccess}
    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
    title="Run debug test to check API access"
  >
    🔍 Debug API
  </button>
);
