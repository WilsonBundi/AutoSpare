import { create } from 'zustand';
import { User } from '../services/authService';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    const data = await authService.login({ username, password });
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  loadUser: () => {
    const user = authService.getCurrentUser();
    set({ user, isAuthenticated: authService.isAuthenticated() });
  },
}));
