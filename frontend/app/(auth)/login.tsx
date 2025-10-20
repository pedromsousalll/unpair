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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
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
              Find your missing pair
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

              {error ? (
                <Text color="$error500" size="sm">
                  {error}
                </Text>
              ) : null}

              <Button
                size="lg"
                onPress={handleLogin}
                isDisabled={loading || !email || !password}
                marginTop="$4"
              >
                <ButtonText>{loading ? 'Logging in...' : 'Login'}</ButtonText>
              </Button>

              <HStack space="sm" alignItems="center" marginVertical="$4">
                <Box flex={1} height={1} backgroundColor="$borderLight300" />
                <Text size="sm" color="$textLight500">
                  ou
                </Text>
                <Box flex={1} height={1} backgroundColor="$borderLight300" />
              </HStack>

              <Button
                size="lg"
                onPress={handleGoogleSignIn}
                isDisabled={loading}
                variant="outline"
                borderColor="$borderLight300"
              >
                <HStack space="sm" alignItems="center">
                  <Text fontSize="$lg">🔵</Text>
                  <ButtonText>Continuar com Google</ButtonText>
                </HStack>
              </Button>

              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text textAlign="center" color="$primary500" marginTop="$4">
                  Don't have an account? Register
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