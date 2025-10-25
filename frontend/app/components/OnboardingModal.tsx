import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Dimensions } from 'react-native';
import { Box, VStack, HStack, Heading, Text, Button, ButtonText, Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  icon: string;
  title: string;
  description: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    icon: 'home',
    title: 'Find Your Missing Pair',
    description: 'Browse single sneakers (left or right) posted by other users. The perfect match is just a tap away!',
  },
  {
    icon: 'add-circle',
    title: 'Drop Your Kicks',
    description: 'Got a lonely sneaker? Post it with photos and details. We\'ll match you with someone looking for it!',
  },
  {
    icon: 'search',
    title: 'Request What You Need',
    description: 'Looking for a specific sneaker? Post a request and get notified when it becomes available.',
  },
  {
    icon: 'chatbubbles',
    title: 'Connect & Trade',
    description: 'Message sellers directly, negotiate, and complete your pair. It\'s that simple!',
  },
];

export const OnboardingModal = () => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { colors, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('@unpair_onboarding_seen');
      if (!hasSeenOnboarding) {
        setVisible(true);
      }
    } catch (error) {
      console.log('Error checking onboarding:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('@unpair_onboarding_seen', 'true');
      setVisible(false);
    } catch (error) {
      console.log('Error saving onboarding:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleComplete}
    >
      <Box flex={1} backgroundColor={isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)'}>
        <VStack flex={1} justifyContent="space-between" padding="$6">
          <HStack justifyContent="flex-end">
            <Pressable onPress={handleSkip}>
              <Text color={colors.textSecondary} fontSize="$md">Skip</Text>
            </Pressable>
          </HStack>

          <VStack flex={1} justifyContent="center" alignItems="center" space="lg">
            <Box
              width={120}
              height={120}
              borderRadius="$full"
              backgroundColor={colors.primary}
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons name={step.icon as any} size={60} color={isDark ? '#000000' : '#FFFFFF'} />
            </Box>

            <VStack space="md" alignItems="center" paddingHorizontal="$4">
              <Heading size="2xl" color={colors.text} textAlign="center">
                {step.title}
              </Heading>
              <Text size="lg" color={colors.textSecondary} textAlign="center">
                {step.description}
              </Text>
            </VStack>
          </VStack>

          <VStack space="lg">
            <HStack justifyContent="center" space="sm">
              {ONBOARDING_STEPS.map((_, index) => (
                <Box
                  key={index}
                  width={currentStep === index ? 24 : 8}
                  height={8}
                  borderRadius="$full"
                  backgroundColor={currentStep === index ? colors.primary : colors.border}
                />
              ))}
            </HStack>

            <Button size="lg" onPress={handleNext} borderRadius="$full">
              <ButtonText>
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});