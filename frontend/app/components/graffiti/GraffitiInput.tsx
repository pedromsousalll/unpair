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
  borderColor = '#f1b311',
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
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1b311',
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    borderWidth: 2,
    borderRadius: 25, // Rounded
    overflow: 'hidden',
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
  },
  error: {
    color: '#FF073A',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '300',
    textAlign: 'center',
  },
});