import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check auth for non-home routes
    const isHome = pathname.includes('/home');
    
    if (!loading && !user && !isHome) {
      // Redirect to login if trying to access protected tabs via URL
      router.replace('/(auth)/login');
    }
  }, [user, loading, pathname]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
      screenListeners={{
        tabPress: (e) => {
          // Prevent navigation to protected tabs if not authenticated
          const targetRoute = e.target?.split('--')[0];
          const protectedRoutes = ['sell', 'search', 'messages', 'profile', 'settings'];
          
          if (!user && protectedRoutes.some(route => targetRoute?.includes(route))) {
            e.preventDefault();
            router.push('/(auth)/login');
          }
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}