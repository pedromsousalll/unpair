import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Box, Heading, VStack } from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish?: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  // Animation values
  const skateboardY = useRef(new Animated.Value(-100)).current;
  const skateboardRotate = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Skateboard drops in with rotation
      Animated.parallel([
        Animated.spring(skateboardY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(skateboardRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Logo fades in and scales up
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(400),
    ]).start(() => {
      // Animation complete, call onFinish if provided
      if (onFinish) {
        setTimeout(onFinish, 300);
      }
    });
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
      <VStack space="2xl" alignItems="center" justifyContent="center" flex={1}>
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
          <Box
            width={120}
            height={40}
            backgroundColor="#FF6B35"
            borderRadius={20}
            position="relative"
          >
            {/* Skateboard deck */}
            <Box
              width={120}
              height={30}
              backgroundColor="#FF6B35"
              borderRadius={15}
              position="absolute"
              top={5}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
            />
            {/* Left wheel */}
            <Box
              width={20}
              height={20}
              backgroundColor="#333"
              borderRadius={10}
              position="absolute"
              left={15}
              bottom={-10}
            />
            {/* Right wheel */}
            <Box
              width={20}
              height={20}
              backgroundColor="#333"
              borderRadius={10}
              position="absolute"
              right={15}
              bottom={-10}
            />
            {/* Trucks */}
            <Box
              width={8}
              height={15}
              backgroundColor="#666"
              position="absolute"
              left={20}
              bottom={-5}
            />
            <Box
              width={8}
              height={15}
              backgroundColor="#666"
              position="absolute"
              right={20}
              bottom={-5}
            />
          </Box>
        </Animated.View>

        {/* Animated UNPAIR Logo */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <VStack space="sm" alignItems="center">
            <Heading size="3xl" color="#FFFFFF" fontWeight="$black" letterSpacing="$2xl">
              UNPAIR
            </Heading>
            <Box
              width={200}
              height={4}
              backgroundColor="#FF6B35"
              borderRadius={2}
            />
            <Heading size="sm" color="#CCCCCC" fontWeight="$medium" letterSpacing="$xl">
              Find Your Match
            </Heading>
          </VStack>
        </Animated.View>

        {/* Subtle pulsing dots */}
        <Box position="absolute" bottom={60}>
          <VStack space="sm" alignItems="center">
            <Animated.View
              style={{
                opacity: logoOpacity,
              }}
            >
              <Heading size="xs" color="#999" fontWeight="$normal">
                Sneaker Marketplace
              </Heading>
            </Animated.View>
          </VStack>
        </Box>
      </VStack>
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
  skateboardContainer: {
    marginBottom: 40,
  },
});
