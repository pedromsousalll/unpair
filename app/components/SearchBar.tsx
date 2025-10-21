import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const SearchBar: React.FC<{ onSearch: (query: string) => void; placeholder?: string }> = ({ 
  onSearch, 
  placeholder = "Search for kicks..." 
}) => {
  const [query, setQuery] = useState('');
  const { colors, isDark } = useTheme();

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
      </View>
      <TextInput
        style={[
          styles.input,
          { 
            color: colors.text,
            backgroundColor: isDark ? colors.background : '#FFFFFF',
            borderColor: colors.border,
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={query}
        onChangeText={handleSearch}
      />
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
    left: 28,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 44,
    paddingLeft: 40,
    paddingRight: 16,
    borderRadius: 22,
    borderWidth: 1,
    fontSize: 16,
  },
});