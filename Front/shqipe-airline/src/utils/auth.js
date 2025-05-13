// JWT token storage and management utilities

// Store tokens in localStorage
export const setTokens = (accessToken, refreshToken = null) => {
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// Get tokens from localStorage
export const getTokens = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
};

// Remove tokens from localStorage
export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Get user role from JWT token
export const getUserRole = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Get authorization header for API requests
export const getAuthHeader = () => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// Get user information from JWT token
export const getUserInfo = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    return {
      firstName: payload.first_name,
      lastName: payload.last_name,
      role: payload.role
    };
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}; 