import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

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
        return { bg: '#f1b311', text: '#000000' }; // Golden with black text
      case 'secondary':
        return { bg: 'transparent', text: '#f1b311' }; // Outline style
      case 'accent':
        return { bg: '#E5A00D', text: '#000000' };
      default:
        return { bg: '#f1b311', text: '#000000' };
    }
  };

  const colors = getColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.bg },
        variant === 'secondary' && styles.outlineButton,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: colors.text }]}>
        {children.toUpperCase()}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30, // Rounded
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#f1b311',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});