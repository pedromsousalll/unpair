import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from './contexts/ThemeContext';

export default function Index() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const onWelcome = segments[0] === 'welcome';

    // Show welcome screen for unauthenticated users who aren't already in auth flow
    if (!user && !inAuthGroup && !inTabsGroup && !onWelcome) {
      router.replace('/welcome');
    } else if (user && !inTabsGroup && !inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return null;
}