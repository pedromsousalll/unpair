import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, Dimensions, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish?: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  // Animation values with better initial states
  const skateboardY = useRef(new Animated.Value(-150)).current;
  const skateboardRotate = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation after a tiny delay to ensure component is mounted
    const timer = setTimeout(() => {
      Animated.sequence([
        // Skateboard drops in with rotation
        Animated.parallel([
          Animated.spring(skateboardY, {
            toValue: 0,
            friction: 7,
            tension: 35,
            useNativeDriver: true,
          }),
          Animated.timing(skateboardRotate, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Small delay before logo animation
        Animated.delay(150),
        // Logo fades in and scales up
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 5,
            tension: 35,
            useNativeDriver: true,
          }),
        ]),
        // Bottom text fades in
        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Hold for a moment
        Animated.delay(500),
      ]).start(() => {
        // Animation complete, call onFinish if provided
        if (onFinish) {
          setTimeout(onFinish, 200);
        }
      });
    }, 100); // Small initial delay

    return () => clearTimeout(timer);
  }, []);

  const rotation = skateboardRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.contentContainer}>
        {/* Animated Skateboard Icon */}
        <Animated.View
          style={[
            styles.skateboardContainer,
            {
              transform: [
                { translateY: skateboardY },
                { rotate: rotation },
              ],
            },
          ]}
        >
          <View style={styles.skateboard}>
            {/* Skateboard deck */}
            <View style={styles.deck} />
            {/* Left wheel */}
            <View style={[styles.wheel, styles.wheelLeft]} />
            {/* Right wheel */}
            <View style={[styles.wheel, styles.wheelRight]} />
            {/* Trucks */}
            <View style={[styles.truck, styles.truckLeft]} />
            <View style={[styles.truck, styles.truckRight]} />
          </View>
        </Animated.View>

        {/* Animated UNPAIR Logo */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>UNPAIR</Text>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>Find Your Match</Text>
          </View>
        </Animated.View>

        {/* Bottom text */}
        <View style={styles.bottomContainer}>
          <Animated.View
            style={{
              opacity: bottomOpacity,
            }}
          >
            <Text style={styles.bottomText}>Sneaker Marketplace</Text>
          </Animated.View>
        </View>
      </View>
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
