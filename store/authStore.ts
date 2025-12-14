import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      set({ user: session?.user ?? null, isAuthenticated: !!session?.user });
    } else if (event === 'SIGNED_OUT') {
      set({ user: null, isAuthenticated: false });
    }
  });

  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    signup: async (email, password) => {
      set({ isLoading: true });
      try {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } catch (error) {
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    login: async (email, password) => {
      set({ isLoading: true });
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } catch (error) {
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    logout: async () => {
      set({ isLoading: true });
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  };
});