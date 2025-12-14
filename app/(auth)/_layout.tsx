import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../../constants/theme';

export default function RootLayout() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initialize();
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: theme.colors.primary } }}>
      {isAuthenticated ? <Stack.Screen name="(tabs)/home" /> : <Stack.Screen name="(auth)/login" />}
    </Stack>
  );
}
