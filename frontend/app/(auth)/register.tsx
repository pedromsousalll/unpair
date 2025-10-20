import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  Pressable,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const handleRegister = async () => {
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      // Navigation will happen automatically via auth state change
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box flex={1} justifyContent="center" padding="$6">
          <VStack space="xl" alignItems="center">
            <Heading size="3xl" textAlign="center" marginBottom="$4">
              UNPAIR
            </Heading>
            <Text size="lg" color="$textLight500" textAlign="center" marginBottom="$8">
              Create your account
            </Text>

            <VStack space="md" width="100%">
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>

              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </Input>

              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </Input>

              {error ? (
                <Text color="$error500" size="sm">
                  {error}
                </Text>
              ) : null}

              <Button
                size="lg"
                onPress={handleRegister}
                isDisabled={loading || !email || !password || !confirmPassword}
                marginTop="$4"
              >
                <ButtonText>{loading ? 'Creating account...' : 'Register'}</ButtonText>
              </Button>

              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text textAlign="center" color="$primary500" marginTop="$4">
                  Already have an account? Login
                </Text>
              </Pressable>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});