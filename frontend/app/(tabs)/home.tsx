import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Card,
  Avatar,
  AvatarFallbackText,
  Spinner,
} from '@gluestack-ui/themed';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Sneaker {
  id: string;
  userId: string;
  userName?: string;
  foot: 'left' | 'right';
  model: string;
  brand: string;
  size: string;
  condition: string;
  imageUrl: string;
  createdAt: any;
}

export default function HomeScreen() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'sneakers'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sneakersData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
          // Get user info
          let userName = 'Unknown';
          try {
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            if (userDoc.exists()) {
              userName = userDoc.data().email?.split('@')[0] || 'Unknown';
            }
          } catch (err) {
            console.log('Error fetching user:', err);
          }

          return {
            id: docSnap.id,
            ...data,
            userName,
          } as Sneaker;
        })
      );

      setSneakers(sneakersData);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Box flex={1} backgroundColor="$backgroundLight0">
        <HStack
          padding="$4"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="$borderLight200"
        >
          <Heading size="xl">UNPAIR</Heading>
          <Avatar size="sm">
            <AvatarFallbackText>{user?.email || 'U'}</AvatarFallbackText>
          </Avatar>
        </HStack>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <VStack space="md" padding="$4">
            {sneakers.length === 0 ? (
              <Box padding="$8" alignItems="center">
                <Text size="lg" color="$textLight500" textAlign="center">
                  No sneakers listed yet. Be the first to sell!
                </Text>
              </Box>
            ) : (
              sneakers.map((sneaker) => (
                <Pressable key={sneaker.id}>
                  <Card padding="$4" marginBottom="$2">
                    <HStack space="md">
                      <Image
                        source={{ uri: sneaker.imageUrl }}
                        alt={sneaker.model}
                        width={100}
                        height={100}
                        borderRadius={8}
                      />
                      <VStack flex={1} space="xs">
                        <Heading size="md">{sneaker.model}</Heading>
                        <Text size="sm" color="$textLight600">
                          {sneaker.brand}
                        </Text>
                        <HStack space="sm">
                          <Text size="sm" fontWeight="$bold">
                            {sneaker.foot === 'left' ? 'Left' : 'Right'} Foot
                          </Text>
                          <Text size="sm">Size {sneaker.size}</Text>
                        </HStack>
                        <Text size="xs" color="$textLight500">
                          Condition: {sneaker.condition}
                        </Text>
                        <HStack space="xs" alignItems="center" marginTop="$2">
                          <Avatar size="xs">
                            <AvatarFallbackText>
                              {sneaker.userName || 'U'}
                            </AvatarFallbackText>
                          </Avatar>
                          <Text size="xs" color="$textLight500">
                            {sneaker.userName}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Card>
                </Pressable>
              ))
            )}
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
    paddingBottom: 20,
  },
});