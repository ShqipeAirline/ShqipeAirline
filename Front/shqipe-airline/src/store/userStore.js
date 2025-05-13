import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setTokens, removeTokens } from '../utils/auth';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (userData) => set({ 
        user: { ...userData, user_id: userData.user_id },
        isAuthenticated: true 
      }),
      
      login: (userData, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({ 
          user: { ...userData, user_id: userData.user_id },
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        removeTokens();
        set({ 
          user: null,
          isAuthenticated: false 
        });
      },
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'user-storage', // unique name for localStorage key
    }
  )
);

export default useUserStore; 