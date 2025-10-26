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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Fill in all fields!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Try again!');
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
      {/* Concrete Texture Pattern */}
      <View style={styles.texturePattern}>
        {[...Array(100)].map((_, i) => (
          <View key={i} style={[styles.textureSpot, { 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
          }]} />
        ))}
      </View>
      
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
                Welcome Back
              </GraffitiHeader>
              <Text style={styles.subtitle}>
                Sign in to continue
              </Text>
            </View>

            {/* Login Form */}
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

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <GraffitiButton
                onPress={handleLogin}
                variant="primary"
                style={styles.loginButton}
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
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

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Pressable onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.signupLink}>SIGN UP</Text>
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
  texturePattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  textureSpot: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 1.5,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(241, 179, 17, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '300',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 24,
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
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
    textAlign: 'center',
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
    width: '100%',
  },
  googleButtonText: {
    color: '#f1b311',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  signupText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
  },
  signupLink: {
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
    width: '100%',
  },
  errorText: {
    color: '#FF073A',
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
  },
});