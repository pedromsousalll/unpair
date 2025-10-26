import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface BrandPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

const BRANDS = [
  'Select a brand...',
  'Vans',
  'DC Shoes',
  'Etnies',
  'Emerica',
  'Globe',
  'Osiris',
  'Lakai',
  'Fallen Footwear',
  'DVS Shoes',
  'Supra',
  'HUF',
  'C1RCA',
  'State Footwear',
  'New Balance Numeric',
  'Nike SB',
  'Adidas Skateboarding',
  'Converse CONS',
  'éS Footwear',
  'Kariuma',
  'ThirtyTwo',
  'Puma Skateboarding',
  'Reebok',
  'Palace',
  'Supreme',
  'Stüssy',
  'Diamond Supply Co.',
  'Converse One Star',
  'Alltimers',
  'Bronze 56K',
  'Polar Skate Co.',
];

export const BrandPicker: React.FC<BrandPickerProps> = ({
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
          {BRANDS.map((brand, index) => (
            <Picker.Item
              key={index}
              label={brand}
              value={index === 0 ? '' : brand}
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