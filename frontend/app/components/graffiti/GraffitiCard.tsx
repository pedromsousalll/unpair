import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GraffitiCardProps {
  children: ReactNode;
  borderColor?: string;
  style?: ViewStyle;
}

export const GraffitiCard: React.FC<GraffitiCardProps> = ({
  children,
  borderColor = '#FF10F0',
  style,
}) => {
  return (
    <View style={[styles.card, { borderColor }, style]}>
      {/* Spray paint corners */}
      <View style={[styles.corner, styles.topLeftCorner, { backgroundColor: borderColor }]} />
      <View style={[styles.corner, styles.topRightCorner, { backgroundColor: borderColor }]} />
      <View style={[styles.corner, styles.bottomLeftCorner, { backgroundColor: borderColor }]} />
      <View style={[styles.corner, styles.bottomRightCorner, { backgroundColor: borderColor }]} />
      
      {/* Spray dots around card */}
      <View style={[styles.sprayDot, styles.dot1, { backgroundColor: borderColor }]} />
      <View style={[styles.sprayDot, styles.dot2, { backgroundColor: borderColor }]} />
      <View style={[styles.sprayDot, styles.dot3, { backgroundColor: borderColor }]} />
      <View style={[styles.sprayDot, styles.dot4, { backgroundColor: borderColor }]} />
      
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(37, 37, 37, 0.9)',
    borderRadius: 12,
    borderWidth: 3,
    padding: 16,
    position: 'relative',
    shadowColor: '#FF10F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    opacity: 0.7,
  },
  topLeftCorner: {
    top: -6,
    left: -6,
    borderTopLeftRadius: 6,
  },
  topRightCorner: {
    top: -6,
    right: -6,
    borderTopRightRadius: 6,
  },
  bottomLeftCorner: {
    bottom: -6,
    left: -6,
    borderBottomLeftRadius: 6,
  },
  bottomRightCorner: {
    bottom: -6,
    right: -6,
    borderBottomRightRadius: 6,
  },
  sprayDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  dot1: {
    top: 15,
    left: -8,
  },
  dot2: {
    top: '30%',
    right: -7,
  },
  dot3: {
    bottom: '25%',
    left: -6,
  },
  dot4: {
    bottom: 20,
    right: -9,
  },
});
