import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const SkateLoader = () => {
  const { colors } = useTheme();
  const skatePosition = useRef(new Animated.Value(-100)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const moveSkate = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(skatePosition, {
            toValue: 400,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 360,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(skatePosition, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    moveSkate.start();

    return () => moveSkate.stop();
  }, []);

  const rotationDeg = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: colors.text }]}>Hold up, skater! 🛹</Text>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>You gotta log in first...</Text>
        
        <View style={styles.trackContainer}>
          <View style={[styles.track, { backgroundColor: colors.border }]} />
          <Animated.View
            style={[
              styles.skater,
              {
                transform: [
                  { translateX: skatePosition },
                  { rotate: rotationDeg },
                ],
              },
            ]}
          >
            <Text style={styles.skateEmoji}>🛹</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 40,
  },
  trackContainer: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  track: {
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
  skater: {
    position: 'absolute',
    top: -10,
  },
  skateEmoji: {
    fontSize: 40,
  },
});