import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AppLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="products/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Toast />
    </View>
  );
}