import 'react-native-url-polyfill/auto';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/toast';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

export default function RootLayout() {
  useProtectedRoute();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

