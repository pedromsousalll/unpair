import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GraffitiButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'accent';
  style?: ViewStyle;
}

export const GraffitiButton: React.FC<GraffitiButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return ['#FF10F0', '#B625FF']; // Neon pink to purple
      case 'secondary':
        return ['#00FF41', '#00D9FF']; // Neon green to blue
      case 'accent':
        return ['#FFFF00', '#FF6B00']; // Yellow to orange
      default:
        return ['#FF10F0', '#B625FF'];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>{children.toUpperCase()}</Text>
        {/* Drip effect */}
        <LinearGradient
          colors={['transparent', getColors()[1]]}
          style={styles.drip}
        />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#FF10F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  drip: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    width: 20,
    height: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    transform: [{ translateX: -10 }],
  },
});
