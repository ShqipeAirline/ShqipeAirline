import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  
  setUser: (userData) => set({
    user: userData,
    isAuthenticated: true,
  }),

  setTokens: (tokens) => {
    const { access_token, refresh_token } = tokens;
    
    localStorage.setItem('accessToken', access_token);
    if (refresh_token) {
      localStorage.setItem('refreshToken', refresh_token);
    }

    set({
      accessToken: access_token,
      refreshToken: refresh_token
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null
    });
  },

  hasRole: (role) => {
    const state = get();
    return state.user?.role === role;
  },

  getAccessToken: () => {
    const state = get();
    return state.accessToken;
  },

  hasValidToken: () => {
    const state = get();
    return !!state.accessToken;
  },
  refreshAccessToken: async () => {
    const state = get();
    const refreshToken = state.refreshToken;
    const currentUser = state.user;

    if (!refreshToken || currentUser?.role !== 'user') {
      state.logout();
      return null;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        state.logout();
        return null;
      }

      const data = await response.json();
      state.setTokens({
        access_token: data.access_token,
        refresh_token: refreshToken
      });

      if (currentUser) {
        state.setUser({
          ...currentUser,
          role: 'user'
        });
      }

      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      state.logout();
      return null;
    }
  }
  
}));

export default useAuthStore; 