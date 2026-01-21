import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      
      setAuth: (user, accessToken) => set({ user, accessToken }),
      
      logout: () => set({ user: null, accessToken: null }),
      
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user }), // Persist both
    }
  )
);
