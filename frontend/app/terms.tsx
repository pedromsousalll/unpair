import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Box, VStack, Heading, Text, Pressable } from '@gluestack-ui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
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
            <Heading size="2xl" color={colors.text}>Terms of Service</Heading>
            <Text size="sm" color={colors.textSecondary}>Last updated: {new Date().toLocaleDateString()}</Text>

            <VStack space="md">
              <Heading size="md" color={colors.text}>1. Acceptance of Terms</Heading>
              <Text color={colors.text}>
                By accessing and using UNPAIR, you accept and agree to be bound by the terms and provision of this agreement.
              </Text>

              <Heading size="md" color={colors.text}>2. Use License</Heading>
              <Text color={colors.text}>
                Permission is granted to temporarily use UNPAIR for personal, non-commercial purposes. This is the grant of a license, not a transfer of title.
              </Text>

              <Heading size="md" color={colors.text}>3. User Accounts</Heading>
              <Text color={colors.text}>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </Text>

              <Heading size="md" color={colors.text}>4. Prohibited Uses</Heading>
              <Text color={colors.text}>
                You may not use UNPAIR:
                {"\n"}• For any unlawful purpose
                {"\n"}• To solicit others to perform or participate in any unlawful acts
                {"\n"}• To violate any international, federal, provincial or state regulations
                {"\n"}• To infringe upon or violate our intellectual property rights
                {"\n"}• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
                {"\n"}• To submit false or misleading information
                {"\n"}• To upload or transmit viruses or any other type of malicious code
              </Text>

              <Heading size="md" color={colors.text}>5. Listings and Transactions</Heading>
              <Text color={colors.text}>
                UNPAIR is a marketplace platform. We do not own, sell, or control the items listed. Users are solely responsible for the accuracy of their listings and for completing transactions.
              </Text>

              <Heading size="md" color={colors.text}>6. Intellectual Property</Heading>
              <Text color={colors.text}>
                The service and its original content, features, and functionality are owned by UNPAIR and are protected by international copyright, trademark, and other intellectual property laws.
              </Text>

              <Heading size="md" color={colors.text}>7. Disclaimer</Heading>
              <Text color={colors.text}>
                UNPAIR is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim all warranties.
              </Text>

              <Heading size="md" color={colors.text}>8. Limitation of Liability</Heading>
              <Text color={colors.text}>
                In no event shall UNPAIR, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
              </Text>

              <Heading size="md" color={colors.text}>9. Changes to Terms</Heading>
              <Text color={colors.text}>
                We reserve the right to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes.
              </Text>

              <Heading size="md" color={colors.text}>10. Contact Us</Heading>
              <Text color={colors.text}>
                If you have any questions about these Terms, please contact us through the app.
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