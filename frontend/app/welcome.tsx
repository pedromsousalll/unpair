import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GraffitiButton, GraffitiHeader } from './components/graffiti';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: useNative,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Texture */}
      <View style={styles.texturePattern}>
        {[...Array(100)].map((_, i) => (
          <View key={i} style={[styles.textureSpot, { 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
          }]} />
        ))}
      </View>

      {/* Language Selector */}
      <Pressable style={styles.languageSelector}>
        <Ionicons name="globe-outline" size={20} color="#f1b311" />
        <Text style={styles.languageText}>EN</Text>
      </Pressable>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>KICKS</Text>
          <View style={styles.underline} />
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Find Your Perfect Match</Text>
        <Text style={styles.subtitle}>Buy, sell, and trade sneakers</Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <GraffitiButton
            onPress={() => router.push('/(auth)/login')}
            variant="primary"
          >
            I ALREADY HAVE AN ACCOUNT
          </GraffitiButton>

          <GraffitiButton
            onPress={() => router.push('/(auth)/register')}
            variant="secondary"
          >
            CREATE ACCOUNT
          </GraffitiButton>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#373734',
    justifyContent: 'center',
    alignItems: 'center',
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
  languageSelector: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 179, 17, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    zIndex: 2,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1b311',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#f1b311',
    letterSpacing: 4,
    textAlign: 'center',
  },
  underline: {
    width: 200,
    height: 4,
    backgroundColor: '#f1b311',
    borderRadius: 2,
    marginTop: 8,
  },
  tagline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '300',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
});