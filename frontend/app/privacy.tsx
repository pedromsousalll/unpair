import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, VStack, Heading, Text, Pressable } from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Box flex={1}>
        <Box
          padding="$4"
          borderBottomWidth={1}
          borderBottomColor={colors.border}
          backgroundColor={colors.surface}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        </Box>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <VStack space="lg" padding="$4">
            <Heading size="2xl" color={colors.text}>Privacy Policy</Heading>
            <Text size="sm" color={colors.textSecondary}>Last updated: {new Date().toLocaleDateString()}</Text>

            <VStack space="md">
              <Heading size="md" color={colors.text}>1. Information We Collect</Heading>
              <Text color={colors.text}>
                We collect information that you provide directly to us:
                {"\n"}• Account information (email, profile photo)
                {"\n"}• Listing information (sneaker photos, descriptions)
                {"\n"}• Messages and communications
                {"\n"}• Device information and usage data
              </Text>

              <Heading size="md" color={colors.text}>2. How We Use Your Information</Heading>
              <Text color={colors.text}>
                We use the information we collect to:
                {"\n"}• Provide, maintain, and improve our services
                {"\n"}• Process transactions and send related information
                {"\n"}• Send you technical notices and support messages
                {"\n"}• Respond to your comments and questions
                {"\n"}• Monitor and analyze trends and usage
                {"\n"}• Detect and prevent fraudulent transactions
              </Text>

              <Heading size="md" color={colors.text}>3. Information Sharing</Heading>
              <Text color={colors.text}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information:
                {"\n"}• With other users to facilitate transactions
                {"\n"}• With service providers who assist in our operations
                {"\n"}• When required by law or to protect rights and safety
                {"\n"}• In connection with a merger, sale, or asset transfer
              </Text>

              <Heading size="md" color={colors.text}>4. Data Storage and Security</Heading>
              <Text color={colors.text}>
                We use Firebase (Google Cloud Platform) to store and process your data. We implement appropriate technical and organizational measures to protect your personal information.
              </Text>

              <Heading size="md" color={colors.text}>5. Your Rights</Heading>
              <Text color={colors.text}>
                You have the right to:
                {"\n"}• Access your personal information
                {"\n"}• Correct inaccurate information
                {"\n"}• Delete your account and associated data
                {"\n"}• Object to processing of your information
                {"\n"}• Export your data
              </Text>

              <Heading size="md" color={colors.text}>6. Cookies and Tracking</Heading>
              <Text color={colors.text}>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve user experience.
              </Text>

              <Heading size="md" color={colors.text}>7. Children's Privacy</Heading>
              <Text color={colors.text}>
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
              </Text>

              <Heading size="md" color={colors.text}>8. International Data Transfers</Heading>
              <Text color={colors.text}>
                Your information may be transferred to and maintained on servers located outside of your country. By using KICKS, you consent to this transfer.
              </Text>

              <Heading size="md" color={colors.text}>9. Changes to Privacy Policy</Heading>
              <Text color={colors.text}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </Text>

              <Heading size="md" color={colors.text}>10. Contact Us</Heading>
              <Text color={colors.text}>
                If you have any questions about this Privacy Policy, please contact us through the app.
              </Text>
            </VStack>
          </VStack>
        </ScrollView>
      </Box>
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