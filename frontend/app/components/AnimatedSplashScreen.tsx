import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish?: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Rotating loading animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Auto-finish after 2.5 seconds
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Texture Pattern */}
      <View style={styles.texturePattern}>
        {[...Array(100)].map((_, i) => (
          <View key={i} style={[styles.textureSpot, { 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
          }]} />
        ))}
      </View>

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://customer-assets.emergentagent.com/job_unpair-sneakers/artifacts/ajv2mix8_New%20Project.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <View style={styles.loadingRing} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
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
  logoContainer: {
    zIndex: 1,
    marginBottom: 60,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    zIndex: 1,
  },
  loadingRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#f1b311',
    borderRightColor: '#f1b311',
  },
});
