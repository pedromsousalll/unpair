import { Stack } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function ChatLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="[conversationId]" />
    </Stack>
  );
}