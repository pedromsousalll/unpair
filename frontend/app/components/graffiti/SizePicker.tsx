import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface SizePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

const US_SIZES = [
  'Select size...',
  '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5',
  '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15'
];

const EU_SIZES = [
  'Select size...',
  '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40', '40.5',
  '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45', '45.5',
  '46', '46.5', '47', '47.5', '48', '48.5', '49', '49.5', '50'
];

export const SizePicker: React.FC<SizePickerProps> = ({
  value,
  onValueChange,
  label,
}) => {
  const [system, setSystem] = useState<'US' | 'EU'>('US');
  const sizes = system === 'US' ? US_SIZES : EU_SIZES;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <Pressable
          style={[styles.toggleButton, system === 'US' && styles.toggleButtonActive]}
          onPress={() => setSystem('US')}
        >
          <Text style={[styles.toggleText, system === 'US' && styles.toggleTextActive]}>US</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleButton, system === 'EU' && styles.toggleButtonActive]}
          onPress={() => setSystem('EU')}
        >
          <Text style={[styles.toggleText, system === 'EU' && styles.toggleTextActive]}>EU</Text>
        </Pressable>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#f1b311"
        >
          {sizes.map((size, index) => (
            <Picker.Item
              key={index}
              label={size}
              value={index === 0 ? '' : size}
              color={index === 0 ? '#999' : '#FFFFFF'}
            />
          ))}
        </Picker>
      </View>
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
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#f1b311',
    borderColor: '#f1b311',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999',
  },
  toggleTextActive: {
    color: '#000000',
  },
  pickerContainer: {
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    borderWidth: 2,
    borderColor: '#f1b311',
    borderRadius: 25,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    height: 50,
  },
});
