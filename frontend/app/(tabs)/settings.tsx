import React from 'react';
import { ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  Divider,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '../config/firebase';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const [uploading, setUploading] = React.useState(false);

  const handlePhotoUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && user) {
        setUploading(true);
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const filename = `profile/${user.uid}/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const photoURL = await getDownloadURL(storageRef);
        
        await updateProfile(user, { photoURL });
        Alert.alert('Success', 'Profile photo updated! 📸');
        setUploading(false);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload photo');
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Later, skater! Come back soon! 🛹',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box padding="$4">
          {/* Profile Section */}
          <VStack space="lg" alignItems="center" marginBottom="$6">
            <Pressable onPress={handlePhotoUpload} disabled={uploading}>
              <Box position="relative">
                <Avatar size="2xl">
                  {user?.photoURL ? (
                    <AvatarImage source={{ uri: user.photoURL }} />
                  ) : (
                    <AvatarFallbackText>{user?.email || 'User'}</AvatarFallbackText>
                  )}
                </Avatar>
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  backgroundColor={colors.primary}
                  borderRadius="$full"
                  padding="$2"
                >
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </Box>
              </Box>
            </Pressable>
            <VStack space="xs" alignItems="center">
              <Text fontSize="$xl" fontWeight="$bold" color={colors.text}>
                {user?.displayName || user?.email?.split('@')[0]}
              </Text>
              <Text size="sm" color={colors.textSecondary}>
                {user?.email}
              </Text>
            </VStack>
          </VStack>

          <Divider marginVertical="$4" />

          {/* Theme Settings */}
          <VStack space="md" marginBottom="$6">
            <Text fontSize="$lg" fontWeight="$bold" color={colors.text}>
              🎨 Appearance
            </Text>
            
            <HStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
              <HStack space="sm" alignItems="center">
                <Ionicons name="moon" size={20} color={colors.text} />
                <Text color={colors.text}>Dark Mode</Text>
              </HStack>
              <Switch
                value={isDark}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
              />
            </HStack>

            <HStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
              <HStack space="sm" alignItems="center">
                <Ionicons name="phone-portrait" size={20} color={colors.text} />
                <Text color={colors.text}>Follow System Theme</Text>
              </HStack>
              <Switch
                value={themeMode === 'system'}
                onValueChange={(value) => setThemeMode(value ? 'system' : 'light')}
              />
            </HStack>
          </VStack>

          <Divider marginVertical="$4" />

          {/* Account Settings */}
          <VStack space="md" marginBottom="$6">
            <Text fontSize="$lg" fontWeight="$bold" color={colors.text}>
              ⚙️ Account
            </Text>
            
            <Pressable>
              <HStack justifyContent="space-between" alignItems="center" paddingVertical="$3">
                <HStack space="sm" alignItems="center">
                  <Ionicons name="notifications" size={20} color={colors.text} />
                  <Text color={colors.text}>Notifications</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </HStack>
            </Pressable>

            <Pressable>
              <HStack justifyContent="space-between" alignItems="center" paddingVertical="$3">
                <HStack space="sm" alignItems="center">
                  <Ionicons name="lock-closed" size={20} color={colors.text} />
                  <Text color={colors.text}>Privacy</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </HStack>
            </Pressable>

            <Pressable>
              <HStack justifyContent="space-between" alignItems="center" paddingVertical="$3">
                <HStack space="sm" alignItems="center">
                  <Ionicons name="help-circle" size={20} color={colors.text} />
                  <Text color={colors.text}>Help & Support</Text>
                </HStack>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </HStack>
            </Pressable>
          </VStack>

          <Divider marginVertical="$4" />

          <Button size="lg" action="negative" onPress={handleLogout} marginTop="$4">
            <ButtonText>Catch you later! 🛹</ButtonText>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});