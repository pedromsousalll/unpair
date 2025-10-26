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
  background: '#1A1A1A', // Dark concrete
  surface: '#2D2D2D', // Dark brick
  primary: '#FF10F0', // Neon pink
  secondary: '#00FF41', // Neon green
  accent: '#FFFF00', // Neon yellow
  accentBlue: '#00D9FF', // Neon blue
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#FF10F0',
  error: '#FF073A',
  success: '#00FF41',
  card: '#252525',
  graffiti: {
    pink: '#FF10F0',
    green: '#00FF41',
    yellow: '#FFFF00',
    blue: '#00D9FF',
    orange: '#FF6B00',
    purple: '#B625FF',
  }
};

const darkColors = {
  background: '#0D0D0D', // Darker concrete
  surface: '#1A1A1A', // Darker brick
  primary: '#FF10F0', // Neon pink
  secondary: '#00FF41', // Neon green
  accent: '#FFFF00', // Neon yellow
  accentBlue: '#00D9FF', // Neon blue
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#FF10F0',
  error: '#FF073A',
  success: '#00FF41',
  card: '#1F1F1F',
  graffiti: {
    pink: '#FF10F0',
    green: '#00FF41',
    yellow: '#FFFF00',
    blue: '#00D9FF',
    orange: '#FF6B00',
    purple: '#B625FF',
  }
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
