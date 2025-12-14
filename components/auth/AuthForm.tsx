import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface AuthFormProps {
  email: string;
  password: string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  error?: string;
}

export function AuthForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  error,
}: AuthFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onEmailChange}
          placeholder="your@email.com"
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={onPasswordChange}
            placeholder="Enter password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
          >
            <Feather
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  inputContainer: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  eyeIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    height: '100%',
    justifyContent: 'center',
  },
  error: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: -theme.spacing.sm,
  },
});