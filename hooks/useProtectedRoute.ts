import { useEffect, useRef } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useAuthStore();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (segments.length === 0 || hasNavigated.current) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      hasNavigated.current = true;
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      hasNavigated.current = true;
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, router]);
}
