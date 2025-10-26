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
import { LinearGradient } from 'expo-linear-gradient';
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
      setError('Fill in all fields, yo!');
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
    <LinearGradient
      colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Brick Wall Pattern (subtle) */}
            <View style={styles.brickPattern}>
              {[...Array(20)].map((_, i) => (
                <View key={i} style={styles.brick} />
              ))}
            </View>

            {/* Back Button */}
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={28} color="#FF10F0" />
            </Pressable>

            {/* Header with Graffiti Style */}
            <View style={styles.header}>
              <GraffitiHeader color="#FF10F0">
                WELCOME BACK
              </GraffitiHeader>
              <Text style={styles.subtitle}>
                Drop your kicks on the market 🛹
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
                borderColor="#FF10F0"
              />

              <GraffitiInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                secureTextEntry
                borderColor="#00FF41"
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
                {loading ? 'LOGGING IN...' : 'LET\'S GO'}
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
                <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                <Text style={styles.googleButtonText}>
                  SIGN IN WITH GOOGLE
                </Text>
              </Pressable>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>New here? </Text>
                <Pressable onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.signupLink}>CREATE ACCOUNT</Text>
                </Pressable>
              </View>
            </View>

            {/* Spray Paint Splatters */}
            <View style={[styles.splatter, styles.splatter1]} />
            <View style={[styles.splatter, styles.splatter2]} />
            <View style={[styles.splatter, styles.splatter3]} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  brickPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.05,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  brick: {
    width: 60,
    height: 30,
    backgroundColor: '#666',
    margin: 2,
    borderRadius: 2,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 16, 240, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'left',
    marginTop: 8,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  loginButton: {
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
    height: 2,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '700',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#00D9FF',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    color: '#999',
    fontSize: 15,
    fontWeight: '500',
  },
  signupLink: {
    color: '#00FF41',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 255, 65, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 7, 58, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF073A',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF073A',
    fontSize: 14,
    fontWeight: '600',
  },
  splatter: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.15,
  },
  splatter1: {
    width: 80,
    height: 80,
    backgroundColor: '#FF10F0',
    top: 100,
    right: 20,
  },
  splatter2: {
    width: 60,
    height: 60,
    backgroundColor: '#00FF41',
    bottom: 150,
    left: 30,
  },
  splatter3: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFF00',
    top: '50%',
    right: 40,
  },
});
