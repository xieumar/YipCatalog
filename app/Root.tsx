import React from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Root() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
      </Stack>
    );
  } else {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }
}
