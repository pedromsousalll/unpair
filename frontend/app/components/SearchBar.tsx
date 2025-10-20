import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, InputField } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for kicks..." 
}) => {
  const [query, setQuery] = useState('');
  const { colors } = useTheme();

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
      </View>
      <Input variant="outline" flex={1}>
        <InputField
          placeholder={placeholder}
          value={query}
          onChangeText={handleSearch}
          paddingLeft="$10"
        />
      </Input>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 24,
    zIndex: 1,
  },
});