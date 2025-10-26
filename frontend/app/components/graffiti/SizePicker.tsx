import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface SizePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

const SIZES = [
  'Select size...',
  '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5',
  '10', '10.5', '11', '11.5', '12', '12.5', '13', '13.5', '14', '14.5', '15'
];

export const SizePicker: React.FC<SizePickerProps> = ({
  value,
  onValueChange,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label.toUpperCase()}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#f1b311"
        >
          {SIZES.map((size, index) => (
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
  pickerContainer: {
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    borderWidth: 2,
    borderColor: '#f1b311',
    borderRadius: 25,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
  },
});