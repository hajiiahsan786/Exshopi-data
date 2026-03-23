import { create } from 'zustand';
import { FirebaseUser } from '../firebase';

interface AuthState {
  user: FirebaseUser | null;
  role: 'customer' | 'vendor' | 'admin' | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setRole: (role: 'customer' | 'vendor' | 'admin' | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
}));
