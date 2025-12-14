import 'react-native-url-polyfill/auto';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/toast';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

export default function RootLayout() {
  useProtectedRoute();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

