export const theme = {
  colors: {
    // Brand (AUTH BACKGROUND BLUE)
    primary: '#122350',            // ⬅️ USE YOUR AUTH BG BLUE HERE
    primaryDark: '#172554',
    primaryMuted: '#DBEAFE',

    // Backgrounds
    background: '#F5F7FB',
    surface: '#FFFFFF',

    // Text
    text: '#0F172A',
    textSecondary: '#64748B',
    textOnPrimary: '#FFFFFF',

    // UI
    border: '#E2E8F0',
    disabled: '#CBD5E1',

    // Feedback
    error: '#dc0e0e',
    success: '#22C55E',
    warning: '#F59E0B',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
  },

  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },
};
