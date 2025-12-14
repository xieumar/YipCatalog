import { Stack } from 'expo-router';
import { theme } from '../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: {
          backgroundColor: theme.colors.primary, 
        },
      }}
    />
  );
}
