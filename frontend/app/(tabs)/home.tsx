import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, StyleSheet, Pressable, View as RNView } from 'react-native';
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
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../components/SearchBar';
import { useRouter } from 'expo-router';

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
  const [filteredSneakers, setFilteredSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'sneakers'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const sneakersData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
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
      setFilteredSneakers(sneakersData);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSneakers(sneakers);
      return;
    }

    const filtered = sneakers.filter(
      (sneaker) =>
        sneaker.model.toLowerCase().includes(query.toLowerCase()) ||
        sneaker.brand.toLowerCase().includes(query.toLowerCase()) ||
        sneaker.size.includes(query)
    );
    setFilteredSneakers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor={colors.background}>
        <Spinner size="large" color={colors.primary} />
      </Box>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Box flex={1}>
        <HStack
          padding="$4"
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor={colors.border}
          backgroundColor={colors.surface}
        >
          <Heading size="xl" color={colors.text}>UNPAIR 🛹</Heading>
          <Avatar size="sm">
            <AvatarFallbackText>{user?.email || 'U'}</AvatarFallbackText>
          </Avatar>
        </HStack>

        <SearchBar onSearch={handleSearch} placeholder="Search for kicks..." />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <RNView style={styles.grid}>
            {filteredSneakers.length === 0 ? (
              <Box padding="$8" alignItems="center" width="100%">
                <Text fontSize="$xl" marginBottom="$2">🛹</Text>
                <Text size="lg" color={colors.textSecondary} textAlign="center">
                  {sneakers.length === 0 ? "No kicks yet. Drop yours first!" : "No matching kicks found"}
                </Text>
              </Box>
            ) : (
              filteredSneakers.map((sneaker) => (
                <Pressable 
                  key={sneaker.id} 
                  style={styles.gridItem}
                  onPress={() => router.push(`/product/${sneaker.id}`)}
                >
                  <Card padding="$3" backgroundColor={colors.card} style={styles.card}>
                    <VStack space="sm">
                      <Image
                        source={{ uri: sneaker.imageUrl }}
                        alt={sneaker.model}
                        width="100%"
                        height={120}
                        borderRadius={8}
                      />
                      <VStack space="xs">
                        <Text fontSize="$md" fontWeight="$bold" color={colors.text} numberOfLines={1}>
                          {sneaker.model}
                        </Text>
                        <Text size="sm" color={colors.textSecondary} numberOfLines={1}>
                          {sneaker.brand}
                        </Text>
                        <HStack space="xs" flexWrap="wrap">
                          <Text size="xs" fontWeight="$bold" color={colors.text}>
                            {sneaker.foot === 'left' ? '👈 Left' : '👉 Right'}
                          </Text>
                          <Text size="xs" color={colors.textSecondary}>•</Text>
                          <Text size="xs" color={colors.textSecondary}>
                            Size {sneaker.size}
                          </Text>
                        </HStack>
                        <HStack space="xs" alignItems="center" marginTop="$1">
                          <Avatar size="2xs">
                            <AvatarFallbackText>
                              {sneaker.userName || 'U'}
                            </AvatarFallbackText>
                          </Avatar>
                          <Text size="xs" color={colors.textSecondary} numberOfLines={1}>
                            {sneaker.userName}
                          </Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Card>
                </Pressable>
              ))
            )}
          </RNView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});