const API_URL = 'http://127.0.0.1:5000';

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setTokens(data.access_token, null); // No new refresh token is provided
    return data.access_token;
  } catch (error) {
    removeTokens();
    throw error;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = getAccessToken();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Token expired, try to refresh
    const newAccessToken = await refreshAccessToken();
    headers.Authorization = `Bearer ${newAccessToken}`;
    
    // Retry the request with new token
    return fetch(url, { ...options, headers });
  }
  
  return response;
}; 