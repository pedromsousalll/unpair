import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
  Spinner,
  Badge,
  BadgeText,
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
  const [creatingChat, setCreatingChat] = useState(false);
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
    console.log('=== MESSAGE SELLER CLICKED ===');
    console.log('User:', user?.uid);
    console.log('Sneaker:', sneaker?.id);
    console.log('Sneaker userId:', sneaker?.userId);

    if (!user) {
      console.log('No user logged in - showing alert');
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

    if (!sneaker) {
      console.log('No sneaker data');
      return;
    }

    setCreatingChat(true);

    try {
      const participants = [user.uid, sneaker.userId].sort();
      const conversationId = participants.join('_');
      
      console.log('Creating/finding conversation:', conversationId);

      const convQuery = query(
        collection(db, 'conversations'),
        where('conversationId', '==', conversationId)
      );

      const existingConv = await getDocs(convQuery);

      if (existingConv.empty) {
        console.log('Creating new conversation');
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
        console.log('Conversation created');
      } else {
        console.log('Conversation already exists');
      }

      console.log('Navigating to chat:', conversationId);
      router.push(`/chat/${conversationId}`);
    } catch (error: any) {
      console.error('Chat error:', error);
      Alert.alert('Error', error.message || 'Failed to start chat');
    } finally {
      setCreatingChat(false);
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
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
                <TouchableOpacity
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
                </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </HStack>
        </Box>

        <Box padding="$4">
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack flex={1} space="xs">
                <Heading size="2xl" color={colors.text}>
                  {sneaker.model || sneaker.brand}
                </Heading>
                <Text size="lg" color={colors.textSecondary}>
                  {sneaker.brand}
                </Text>
              </VStack>
              <Badge
                size="lg"
                variant="solid"
                backgroundColor={sneaker.foot === 'left' ? '#f1b311' : '#999'}
                borderRadius="$lg"
              >
                <BadgeText color="#000000">
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
              {sneaker.condition && (
                <VStack space="xs">
                  <Text size="sm" color={colors.textSecondary}>
                    Condition
                  </Text>
                  <Text fontSize="$lg" fontWeight="$semibold" color={colors.text}>
                    {sneaker.condition}
                  </Text>
                </VStack>
              )}
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
              <TouchableOpacity
                onPress={handleStartChat}
                disabled={creatingChat}
                style={[styles.messageButton, creatingChat && styles.messageButtonDisabled]}
              >
                <Ionicons name="chatbubble" size={20} color="#000000" />
                <Text style={styles.messageButtonText}>
                  {creatingChat ? 'OPENING CHAT...' : 'MESSAGE SELLER'}
                </Text>
              </TouchableOpacity>
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
  backButton: {
    marginTop: 16,
    backgroundColor: '#f1b311',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1b311',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 16,
    gap: 8,
  },
  messageButtonDisabled: {
    backgroundColor: '#999',
  },
  messageButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});