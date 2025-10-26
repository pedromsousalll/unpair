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
    accentBlue: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    card: string;
    graffiti: {
      pink: string;
      green: string;
      yellow: string;
      blue: string;
      orange: string;
      purple: string;
    };
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
  background: '#373734', // Black grey
  surface: '#2D2D2A',
  primary: '#f1b311', // Golden yellow
  secondary: '#E5A00D',
  accent: '#f1b311',
  accentBlue: '#f1b311',
  text: '#000000', // Black
  textSecondary: '#666666',
  border: '#f1b311',
  error: '#FF073A',
  success: '#4ADE80',
  card: '#3E3E3B',
  graffiti: {
    pink: '#f1b311',
    green: '#f1b311',
    yellow: '#f1b311',
    blue: '#f1b311',
    orange: '#f1b311',
    purple: '#f1b311',
  }
};

const darkColors = {
  background: '#373734', // Black grey
  surface: '#2D2D2A',
  primary: '#f1b311', // Golden yellow
  secondary: '#E5A00D',
  accent: '#f1b311',
  accentBlue: '#f1b311',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#f1b311',
  error: '#FF073A',
  success: '#4ADE80',
  card: '#3E3E3B',
  graffiti: {
    pink: '#f1b311',
    green: '#f1b311',
    yellow: '#f1b311',
    blue: '#f1b311',
    orange: '#f1b311',
    purple: '#f1b311',
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
