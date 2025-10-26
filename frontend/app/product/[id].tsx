import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, Linking, Share } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Spinner,
  Badge,
  BadgeText,
  Pressable,
} from '@gluestack-ui/themed';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
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
  userPhotoURL?: string;
  foot: 'left' | 'right';
  model: string;
  brand: string;
  size: string;
  condition: string;
  imageUrl: string;
  imageUrls?: string[];
  createdAt: any;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
        let userPhotoURL = '';
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userEmail = userData.email;
            userName = userData.displayName || userEmail?.split('@')[0] || 'Unknown';
            userPhotoURL = userData.photoURL || '';
          }
        } catch (err) {
          console.log('Error fetching user:', err);
        }

        setSneaker({
          id: sneakerDoc.id,
          ...data,
          userName,
          userEmail,
          userPhotoURL,
        } as Sneaker);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading sneaker:', error);
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to message the seller.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/welcome') },
        ]
      );
      return;
    }

    if (!sneaker) return;

    try {
      const participants = [user.uid, sneaker.userId].sort();
      const conversationId = participants.join('_');

      const convQuery = query(
        collection(db, 'conversations'),
        where('conversationId', '==', conversationId)
      );

      const existingConv = await getDocs(convQuery);

      if (existingConv.empty) {
        await addDoc(collection(db, 'conversations'), {
          conversationId,
          participants,
          productId: sneaker.id,
          productBrand: sneaker.brand,
          productModel: sneaker.model,
          lastMessage: '',
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
      }

      router.push(`/chat/${conversationId}`);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', error.message || 'Failed to start chat');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${sneaker?.brand} ${sneaker?.model} on KICKS!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Listing',
      'Why are you reporting this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Fake/Scam',
          onPress: () => submitReport('fake'),
        },
        {
          text: 'Inappropriate',
          onPress: () => submitReport('inappropriate'),
        },
        {
          text: 'Other',
          onPress: () => submitReport('other'),
        },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    try {
      await addDoc(collection(db, 'reports'), {
        reportedBy: user?.uid,
        sneakerId: sneaker?.id,
        sellerId: sneaker?.userId,
        reason,
        createdAt: serverTimestamp(),
        status: 'pending',
      });
      Alert.alert('Thanks!', 'Report submitted. We\'ll review it soon.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit report');
    }
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
          <Button marginTop="$4" onPress={() => router.back()} borderRadius="$full">
            <ButtonText>Go Back</ButtonText>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  const isOwnListing = user?.uid === sneaker.userId;
  const images = sneaker.imageUrls && sneaker.imageUrls.length > 0 ? sneaker.imageUrls : [sneaker.imageUrl];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView>
        <Box position="relative">
          <Image
            source={{ uri: images[selectedImageIndex] }}
            alt={sneaker.model}
            width="100%"
            height={400}
          />
          
          {/* Image thumbnails */}
          {images.length > 1 && (
            <HStack
              position="absolute"
              bottom={16}
              left={16}
              right={16}
              space="sm"
              justifyContent="center"
            >
              {images.map((img, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    alt={`Image ${index + 1}`}
                    width={50}
                    height={50}
                    borderRadius={8}
                  />
                </Pressable>
              ))}
            </HStack>
          )}
          
          <HStack
            position="absolute"
            top={16}
            left={16}
            right={16}
            justifyContent="space-between"
          >
            <Pressable
              onPress={() => router.back()}
              style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <HStack space="sm">
              <Pressable
                onPress={handleShare}
                style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              >
                <Ionicons name="share-social" size={24} color="#FFFFFF" />
              </Pressable>
              {!isOwnListing && (
                <Pressable
                  onPress={handleReport}
                  style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                >
                  <Ionicons name="flag" size={24} color="#FFFFFF" />
                </Pressable>
              )}
            </HStack>
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
                <BadgeText color={colors.background}>
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
                <Avatar size="md" backgroundColor={colors.surface}>
                  {sneaker.userPhotoURL ? (
                    <AvatarImage source={{ uri: sneaker.userPhotoURL }} />
                  ) : (
                    <AvatarFallbackText>{sneaker.userName || 'U'}</AvatarFallbackText>
                  )}
                </Avatar>
                <VStack flex={1}>
                  <Text fontWeight="$bold" color={colors.text}>
                    {sneaker.userName}
                  </Text>
                  <Text size="sm" color={colors.textSecondary}>
                    Seller
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {isOwnListing ? (
              <Box
                padding="$3"
                backgroundColor={colors.surface}
                borderRadius="$lg"
                marginTop="$2"
              >
                <Text size="sm" color={colors.textSecondary} textAlign="center">
                  This is your listing
                </Text>
              </Box>
            ) : (
              <Button
                size="lg"
                marginTop="$4"
                onPress={handleStartChat}
                borderRadius="$full"
                backgroundColor="#f1b311"
              >
                <Ionicons name="chatbubble" size={20} color="#000000" />
                <ButtonText marginLeft="$2" color="#000000" fontWeight="$bold">
                  MESSAGE SELLER
                </ButtonText>
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  thumbnailActive: {
    borderColor: '#f1b311',
  },
});