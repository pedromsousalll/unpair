import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { GraffitiHeader, GraffitiButton, GraffitiInput } from '../components/graffiti';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, signOut, updatePassword } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Peace out! 🛹',
      'Later, skater!',
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/welcome');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Hold up!', 'Fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Oops!', 'Passwords don\'t match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Too short!', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(newPassword);
      Alert.alert('Success! 🎉', 'Password changed successfully');
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({ icon, title, onPress, color = '#f1b311' }: any) => (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Texture */}
      <View style={styles.texturePattern}>
        {[...Array(100)].map((_, i) => (
          <View key={i} style={[styles.textureSpot, { 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
          }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#f1b311" />
            </Pressable>

            <GraffitiHeader color="#f1b311" size="large">
              Settings
            </GraffitiHeader>
          </View>

          <View style={styles.content}>
            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ACCOUNT</Text>
              <View style={styles.card}>
                <View style={styles.userInfo}>
                  <Ionicons name="person-circle" size={60} color="#f1b311" />
                  <View style={styles.userDetails}>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.userLabel}>Skater ID</Text>
                    {user?.emailVerified ? (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    ) : (
                      <View style={styles.verifiedBadge}>
                        <Ionicons name="warning" size={16} color="#f1b311" />
                        <Text style={styles.unverifiedText}>Not Verified</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Security Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SECURITY</Text>
              <View style={styles.card}>
                <SettingItem
                  icon="lock-closed"
                  title="Change Password"
                  onPress={() => setShowPasswordChange(!showPasswordChange)}
                />
              </View>
              {showPasswordChange && (
                <View style={styles.passwordChangeSection}>
                  <GraffitiInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    secureTextEntry
                    borderColor="#f1b311"
                  />
                  <GraffitiInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry
                    borderColor="#f1b311"
                  />
                  <GraffitiButton
                    onPress={handleChangePassword}
                    variant="primary"
                  >
                    {loading ? 'CHANGING...' : 'CHANGE PASSWORD'}
                  </GraffitiButton>
                </View>
              )}
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PREFERENCES</Text>
              <View style={styles.card}>
                <SettingItem
                  icon="notifications"
                  title="Notifications"
                  onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
                />
              </View>
            </View>

            {/* Legal Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LEGAL</Text>
              <View style={styles.card}>
                <SettingItem
                  icon="shield-checkmark"
                  title="Privacy Policy"
                  onPress={() => router.push('/privacy')}
                />
                <View style={styles.divider} />
                <SettingItem
                  icon="document-text"
                  title="Terms of Service"
                  onPress={() => router.push('/terms')}
                />
              </View>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutSection}>
              <GraffitiButton
                onPress={handleLogout}
                variant="secondary"
              >
                LOGOUT
              </GraffitiButton>
            </View>

            {/* App Info */}
            <Text style={styles.appVersion}>KICKS v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texturePattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  textureSpot: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 1.5,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(241, 179, 17, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1b311',
    marginBottom: 12,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(241, 179, 17, 0.3)',
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    fontWeight: '300',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  unverifiedText: {
    fontSize: 12,
    color: '#f1b311',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#555',
    marginHorizontal: 16,
  },
  passwordChangeSection: {
    marginTop: 16,
    gap: 12,
  },
  logoutSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '300',
  },
});