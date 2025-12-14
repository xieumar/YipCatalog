import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import { AuthForm } from '../../components/auth/AuthForm';
import AnimatedAuthForm from '../../components/auth/AnimatedAuthForm';
import { AuthButton } from '../../components/auth/AuthButton';
import { theme } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Welcome back',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const goToSignup = () => {
    Keyboard.dismiss();
    router.replace('/(auth)/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>YipCatalog</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <AnimatedAuthForm>
             <AuthForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            error={error}
          />
          </AnimatedAuthForm>
         

          <AuthButton
            title="Log in"
            onPress={handleLogin}
            loading={isLoading}
            disabled={!email || !password}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={goToSignup}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F172A', 
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    gap: 6,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  footer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    color: theme.colors.textSecondary,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
