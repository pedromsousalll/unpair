import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const skaterAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const useNative = Platform.OS !== 'web';

  useEffect(() => {
    // Continuous skateboard animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(skaterAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: useNative,
        }),
        Animated.timing(skaterAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: useNative,
        }),
      ])
    ).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: useNative,
    }).start();
  }, []);

  const translateX = skaterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  return (
    <LinearGradient
      colors={['#9EEEE6', '#B4F8C8']} // Mint green gradient
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Language Selector - Top Left */}
      <Pressable style={styles.languageSelector}>
        <Ionicons name="globe-outline" size={20} color="#1A1A1A" />
        <Text style={styles.languageText}>EN</Text>
      </Pressable>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Skateboard Animation */}
        <View style={styles.skaterContainer}>
          <Animated.View
            style={[
              styles.skater,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            {/* Skater figure */}
            <View style={styles.skaterBody}>
              <View style={styles.head} />
              <View style={styles.body} />
              <View style={styles.leftArm} />
              <View style={styles.rightArm} />
              <View style={styles.leftLeg} />
              <View style={styles.rightLeg} />
            </View>
            
            {/* Skateboard */}
            <View style={styles.skateboard}>
              <View style={styles.deck} />
              <View style={[styles.wheel, { left: 10 }]} />
              <View style={[styles.wheel, { right: 10 }]} />
            </View>
          </Animated.View>
        </View>

        {/* Copy Text */}
        <Text style={styles.mainText}>List your lonely sneakers</Text>
        <Text style={styles.subText}>Find the perfect match for your single kicks! 🛹</Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>I already have an account</Text>
          </Pressable>

          <Pressable
            style={styles.registerButton}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.registerButtonText}>Create account</Text>
          </Pressable>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSelector: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  skaterContainer: {
    width: width * 0.8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  skater: {
    alignItems: 'center',
  },
  skaterBody: {
    width: 40,
    height: 80,
    position: 'relative',
    marginBottom: 10,
  },
  head: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFB6C1', // Pastel pink
    position: 'absolute',
    top: 0,
    left: 10,
  },
  body: {
    width: 15,
    height: 30,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    top: 22,
    left: 12.5,
    borderRadius: 8,
  },
  leftArm: {
    width: 20,
    height: 6,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    top: 28,
    left: 2,
    borderRadius: 3,
    transform: [{ rotate: '-30deg' }],
  },
  rightArm: {
    width: 20,
    height: 6,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    top: 28,
    right: 2,
    borderRadius: 3,
    transform: [{ rotate: '30deg' }],
  },
  leftLeg: {
    width: 8,
    height: 25,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    bottom: 0,
    left: 10,
    borderRadius: 4,
  },
  rightLeg: {
    width: 8,
    height: 25,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    bottom: 0,
    right: 10,
    borderRadius: 4,
  },
  skateboard: {
    width: 80,
    height: 20,
    position: 'relative',
  },
  deck: {
    width: 80,
    height: 15,
    backgroundColor: '#FFD93D', // Yellow
    borderRadius: 8,
    position: 'absolute',
    top: 5,
  },
  wheel: {
    width: 12,
    height: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
  },
  mainText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  registerButton: {
    backgroundColor: '#FFB6C1', // Pastel pink
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
