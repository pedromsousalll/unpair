import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Avatar,
  AvatarFallbackText,
  Button,
  ButtonText,
  Spinner,
  Badge,
  BadgeText,
} from '@gluestack-ui/themed';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Sneaker {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  foot: 'left' | 'right';
  model: string;
  brand: string;
  size: string;
  condition: string;
  imageUrl: string;
  createdAt: any;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    loadSneaker();
  }, [id]);

  const loadSneaker = async () => {
    try {
      const sneakerDoc = await getDoc(doc(db, 'sneakers', id as string));
      if (sneakerDoc.exists()) {
        const data = sneakerDoc.data();
        
        let userName = 'Unknown';
        let userEmail = '';
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            userEmail = userDoc.data().email;
            userName = userEmail?.split('@')[0] || 'Unknown';
          }
        } catch (err) {
          console.log('Error fetching user:', err);
        }

        setSneaker({
          id: sneakerDoc.id,
          ...data,
          userName,
          userEmail,
        } as Sneaker);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading sneaker:', error);
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!sneaker?.userEmail) {
      Alert.alert('Oops!', 'Cannot contact seller');
      return;
    }

    Alert.alert(
      'Hit up the seller!',
      `Slide into ${sneaker.userName}'s DMs?`,
      [
        { text: 'Nah', style: 'cancel' },
        {
          text: 'Yeah!',
          onPress: () => {
            const subject = `UNPAIR: Interested in your ${sneaker.brand} ${sneaker.model}`;
            const body = `Hey! I'm interested in your ${sneaker.foot} foot ${sneaker.brand} ${sneaker.model} (Size ${sneaker.size}).

Let's talk!`;
            Linking.openURL(`mailto:${sneaker.userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor={colors.background}>
        <Spinner size="large" color={colors.primary} />
      </Box>
    );
  }

  if (!sneaker) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Box flex={1} justifyContent="center" alignItems="center" padding="$4">
          <Text fontSize="$xl" marginBottom="$2">😕</Text>
          <Text size="lg" color={colors.textSecondary}>Sneaker not found</Text>
          <Button marginTop="$4" onPress={() => router.back()}>
            <ButtonText>Go Back</ButtonText>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  const isOwnListing = user?.uid === sneaker.userId;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView>
        <Box position="relative">
          <Image
            source={{ uri: sneaker.imageUrl }}
            alt={sneaker.model}
            width="100%"
            height={400}
          />
          <HStack
            position="absolute"
            top={16}
            left={16}
            right={16}
            justifyContent="space-between"
          >
            <Button
              size="sm"
              onPress={() => router.back()}
              backgroundColor="rgba(0,0,0,0.5)"
              borderRadius="$full"
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Button>
          </HStack>
        </Box>

        <Box padding="$4">
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack flex={1} space="xs">
                <Heading size="2xl" color={colors.text}>
                  {sneaker.model}
                </Heading>
                <Text size="lg" color={colors.textSecondary}>
                  {sneaker.brand}
                </Text>
              </VStack>
              <Badge
                size="lg"
                variant="solid"
                backgroundColor={sneaker.foot === 'left' ? colors.primary : colors.secondary}
                borderRadius="$lg"
              >
                <BadgeText>
                  {sneaker.foot === 'left' ? '👈 LEFT' : '👉 RIGHT'}
                </BadgeText>
              </Badge>
            </HStack>

            <HStack space="lg" flexWrap="wrap">
              <VStack space="xs">
                <Text size="sm" color={colors.textSecondary}>
                  Size
                </Text>
                <Text fontSize="$xl" fontWeight="$bold" color={colors.text}>
                  {sneaker.size}
                </Text>
              </VStack>
              <VStack space="xs">
                <Text size="sm" color={colors.textSecondary}>
                  Condition
                </Text>
                <Text fontSize="$lg" fontWeight="$semibold" color={colors.text}>
                  {sneaker.condition}
                </Text>
              </VStack>
            </HStack>

            <Box
              padding="$4"
              backgroundColor={colors.surface}
              borderRadius="$lg"
              marginTop="$4"
            >
              <HStack space="md" alignItems="center">
                <Avatar size="md">
                  <AvatarFallbackText>{sneaker.userName || 'U'}</AvatarFallbackText>
                </Avatar>
                <VStack flex={1}>
                  <Text fontWeight="$bold" color={colors.text}>
                    {sneaker.userName}
                  </Text>
                  <Text size="sm" color={colors.textSecondary}>
                    Seller
                  </Text>
                </VStack>
                {!isOwnListing && (
                  <Button size="sm" onPress={handleContact}>
                    <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
                    <ButtonText marginLeft="$2">Chat</ButtonText>
                  </Button>
                )}
              </HStack>
            </Box>

            {isOwnListing && (
              <Box
                padding="$3"
                backgroundColor={colors.surface}
                borderRadius="$lg"
                marginTop="$2"
              >
                <Text size="sm" color={colors.textSecondary} textAlign="center">
                  This is your listing 😎
                </Text>
              </Box>
            )}

            {!isOwnListing && (
              <Button
                size="lg"
                marginTop="$4"
                onPress={handleContact}
              >
                <ButtonText>Message Seller 💬</ButtonText>
              </Button>
            )}
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
