import React from 'react';
import { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';
import { theme } from '../constants/theme';

export const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme.colors.success,
        backgroundColor: theme.colors.successLight,
        height: 60,
        borderLeftWidth: 5,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: theme.colors.textSecondary,
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: theme.colors.error,
        backgroundColor: theme.colors.errorLight,
        height: 60,
        borderLeftWidth: 5,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: theme.colors.textSecondary,
      }}
    />
  ),
  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: theme.colors.primary,
        backgroundColor: theme.colors.primaryLight,
        height: 60,
        borderLeftWidth: 5,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
      }}
      text2Style={{
        fontSize: 14,
        color: theme.colors.textSecondary,
      }}
    />
  ),
};
