import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { GraffitiButton, GraffitiInput, GraffitiHeader } from '../components/graffiti';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Fill in all fields!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords don\'t match!');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signUp(email, password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Sign up failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Textured Background */}
      <View style={styles.textureOverlay} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#f1b311" />
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
              <GraffitiHeader color="#f1b311" size="large">
                Create Account
              </GraffitiHeader>
              <Text style={styles.subtitle}>
                Join the community
              </Text>
            </View>

            {/* Register Form */}
            <View style={styles.form}>
              <GraffitiInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                borderColor="#f1b311"
              />

              <GraffitiInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
                borderColor="#f1b311"
              />

              <GraffitiInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                borderColor="#f1b311"
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <GraffitiButton
                onPress={handleRegister}
                variant="primary"
                style={styles.registerButton}
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </GraffitiButton>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign In */}
              <Pressable
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Ionicons name="logo-google" size={20} color="#f1b311" />
                <Text style={styles.googleButtonText}>
                  CONTINUE WITH GOOGLE
                </Text>
              </Pressable>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.loginLink}>SIGN IN</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#373734',
  },
  textureOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(241, 179, 17, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  header: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '300',
  },
  form: {
    flex: 1,
  },
  registerButton: {
    marginTop: 10,
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#555',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '300',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#f1b311',
    borderRadius: 30,
    paddingVertical: 14,
    gap: 10,
  },
  googleButtonText: {
    color: '#f1b311',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  loginText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '300',
  },
  loginLink: {
    color: '#f1b311',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 7, 58, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#FF073A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF073A',
    fontSize: 14,
    fontWeight: '300',
  },
});