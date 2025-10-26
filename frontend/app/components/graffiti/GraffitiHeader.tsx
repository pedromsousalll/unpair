import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface GraffitiHeaderProps {
  children: string;
  color?: string;
  size?: 'large' | 'medium' | 'small';
  style?: ViewStyle;
}

export const GraffitiHeader: React.FC<GraffitiHeaderProps> = ({
  children,
  color = '#FF10F0',
  size = 'large',
  style,
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'large':
        return 42;
      case 'medium':
        return 32;
      case 'small':
        return 24;
      default:
        return 42;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text 
        style={[
          styles.text,
          { 
            fontSize: getFontSize(),
            textShadowColor: color,
          }
        ]}
      >
        {children.toUpperCase()}
      </Text>
      {/* Underline drip effect */}
      <View style={[styles.underline, { backgroundColor: color }]}>
        <View style={[styles.drip1, { backgroundColor: color }]} />
        <View style={[styles.drip2, { backgroundColor: color }]} />
        <View style={[styles.drip3, { backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  text: {
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textShadowOpacity: 0.8,
  },
  underline: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    position: 'relative',
  },
  drip1: {
    position: 'absolute',
    width: 8,
    height: 10,
    left: '20%',
    bottom: -10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  drip2: {
    position: 'absolute',
    width: 6,
    height: 8,
    left: '50%',
    bottom: -8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  drip3: {
    position: 'absolute',
    width: 10,
    height: 12,
    right: '25%',
    bottom: -12,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
