import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      set({ user: session.user, isAuthenticated: true });
    }
  },
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
}));

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    useAuthStore.setState({ user: session?.user ?? null, isAuthenticated: !!session?.user });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});