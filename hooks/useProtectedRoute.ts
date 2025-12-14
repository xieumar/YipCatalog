import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, router]);
}
