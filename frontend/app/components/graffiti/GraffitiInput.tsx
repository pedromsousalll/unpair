import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

interface GraffitiInputProps extends TextInputProps {
  label?: string;
  error?: string;
  borderColor?: string;
}

export const GraffitiInput: React.FC<GraffitiInputProps> = ({
  label,
  error,
  borderColor = '#FF10F0',
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      )}
      <View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          {...props}
          style={[styles.input, props.style]}
          placeholderTextColor="#999"
        />
        {/* Spray effect corners */}
        <View style={[styles.sprayCorner, styles.topLeft, { backgroundColor: borderColor }]} />
        <View style={[styles.sprayCorner, styles.topRight, { backgroundColor: borderColor }]} />
        <View style={[styles.sprayCorner, styles.bottomLeft, { backgroundColor: borderColor }]} />
        <View style={[styles.sprayCorner, styles.bottomRight, { backgroundColor: borderColor }]} />
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 16, 240, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderWidth: 3,
    borderRadius: 8,
    overflow: 'visible',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sprayCorner: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  topLeft: {
    top: -3,
    left: -3,
  },
  topRight: {
    top: -3,
    right: -3,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
  },
  error: {
    color: '#FF073A',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
});
