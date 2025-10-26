import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export const EmailVerificationBanner = () => {
  const { user, resendVerificationEmail } = useAuth();
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    try {
      setSending(true);
      await resendVerificationEmail();
      Alert.alert('Email Sent!', 'Check your inbox for the verification link.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="warning" size={24} color="#f1b311" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>⚠️ Verify your email</Text>
          <Text style={styles.message}>
            Please verify your email to access all features
          </Text>
        </View>
      </View>
      <Pressable 
        style={styles.button}
        onPress={handleResend}
        disabled={sending}
      >
        <Text style={styles.buttonText}>
          {sending ? 'Sending...' : 'Resend Email'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(241, 179, 17, 0.2)',
    borderLeftWidth: 4,
    borderLeftColor: '#f1b311',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1b311',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  button: {
    backgroundColor: '#f1b311',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
});
