import { Stack } from 'expo-router';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import AnimatedSplashScreen from './components/AnimatedSplashScreen';
import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash screen visible while we prepare the app
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Hide native splash screen once we're ready to show our custom one
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    // Simulate app initialization (loading fonts, assets, etc.)
    setTimeout(() => {
      setAppReady(true);
    }, 100);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!appReady || showSplash) {
    return <AnimatedSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GluestackUIProvider config={config}>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/register" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </AuthProvider>
        </GluestackUIProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}