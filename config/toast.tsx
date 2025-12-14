import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { theme } from '../constants/theme';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: theme.colors.success }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: theme.colors.textSecondary,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: theme.colors.error }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: theme.colors.textSecondary,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: theme.colors.primary }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: theme.colors.textSecondary,
      }}
    />
  ),
};
