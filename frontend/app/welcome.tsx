import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { GraffitiButton } from './components/graffiti';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
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

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* GIF Animation - BIGGER */}
        <View style={styles.gifContainer}>
          <Image
            source={{ uri: 'https://customer-assets.emergentagent.com/job_unpair-sneakers/artifacts/e7ivh5w1_original-7de2936008ce6ba338855d4338f71959-5.gif' }}
            style={styles.gif}
            resizeMode="contain"
          />
        </View>

        {/* Quote */}
        <Text style={styles.quote}>
          "One man's trash is another man's treasure."
        </Text>

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
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
    zIndex: 1,
    justifyContent: 'center',
  },
  gifContainer: {
    width: 400,
    height: 400,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  quote: {
    fontSize: 20,
    fontWeight: '300',
    color: '#f1b311',
    textAlign: 'center',
    marginBottom: 50,
    fontStyle: 'italic',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
});