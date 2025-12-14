import 'react-native-url-polyfill/auto';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/toast';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
       screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.primary, 
        },
        }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="products/[id]" options={{ headerShown: true }} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}


