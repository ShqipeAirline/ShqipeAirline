import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't attempt refresh on login endpoint or if already retrying
    if (
      originalRequest.url === '/login' ||
      originalRequest.url === '/refresh' ||
      originalRequest._retry ||
      !error.response ||
      error.response.status !== 401
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('No refresh token found');
        throw new Error('No refresh token');
      }

      console.log('Attempting to refresh token...');
      
      // Use axios directly for refresh to avoid interceptors
      const res = await axios.post(
        'http://localhost:5001/refresh',
        {},
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.data || !res.data.access_token) {
        throw new Error('Invalid refresh response');
      }

      console.log('Token refresh successful');
      
      // Store the new access token
      localStorage.setItem('accessToken', res.data.access_token);
      
      // Update the header and retry the original request
      originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      
      // Clear tokens and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    }
  }
);

export default api; 