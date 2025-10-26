import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    card: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const lightColors = {
  background: '#F0FFFC', // Very light mint
  surface: '#FFFFFF',
  primary: '#9EEEE6', // Mint green
  secondary: '#FFB6C1', // Pastel pink
  accent: '#FFD93D', // Yellow
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0F4F1',
  error: '#FF6B6B',
  success: '#4ADE80',
  card: '#FFFFFF',
};

const darkColors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  primary: '#9EEEE6', // Keep mint green in dark mode too
  secondary: '#FFB6C1', // Pastel pink
  accent: '#FFD93D', // Yellow
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  border: '#333333',
  error: '#FF6B6B',
  success: '#4ADE80',
  card: '#1E1E1E',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@unpair_theme');
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('@unpair_theme', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
