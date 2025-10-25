import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, Dimensions, View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish?: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  // Use native driver only on native platforms, not on web
  const useNative = Platform.OS !== 'web';
  
  // Simplified animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Simple, smooth fade-in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: useNative,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: useNative,
      }),
    ]).start(() => {
      // Hold for a moment then finish
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, 800);
    });
  }, []);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Skateboard Icon */}
        <View style={styles.skateboardContainer}>
          <View style={styles.skateboard}>
            <View style={styles.deck} />
            <View style={[styles.wheel, styles.wheelLeft]} />
            <View style={[styles.wheel, styles.wheelRight]} />
            <View style={[styles.truck, styles.truckLeft]} />
            <View style={[styles.truck, styles.truckRight]} />
          </View>
        </View>

        {/* UNPAIR Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>UNPAIR</Text>
          <View style={styles.underline} />
          <Text style={styles.subtitle}>Find Your Match</Text>
        </View>

        {/* Bottom text */}
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Sneaker Marketplace</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skateboardContainer: {
    marginBottom: 40,
  },
  skateboard: {
    width: 120,
    height: 40,
    position: 'relative',
  },
  deck: {
    width: 120,
    height: 30,
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    position: 'absolute',
    top: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wheel: {
    width: 20,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    position: 'absolute',
    bottom: -10,
  },
  wheelLeft: {
    left: 15,
  },
  wheelRight: {
    right: 15,
  },
  truck: {
    width: 8,
    height: 15,
    backgroundColor: '#666',
    position: 'absolute',
    bottom: -5,
  },
  truckLeft: {
    left: 20,
  },
  truckRight: {
    right: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  underline: {
    width: 200,
    height: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#CCCCCC',
    letterSpacing: 2,
    marginTop: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
});
