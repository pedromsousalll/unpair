import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  AvatarFallbackText,
  Button,
  ButtonText,
  Card,
  Image,
  Divider,
  Switch,
  Spinner,
} from '@gluestack-ui/themed';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

interface Sneaker {
  id: string;
  foot: string;
  model: string;
  brand: string;
  size: string;
  condition: string;
  imageUrl: string;
}

interface SearchRequest {
  id: string;
  foot: string;
  model: string;
  brand: string;
  size: string;
}

export default function ProfileScreen() {
  const [myListings, setMyListings] = useState<Sneaker[]>([]);
  const [myRequests, setMyRequests] = useState<SearchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  useEffect(() => {
    if (!user) return;

    // Listen to user's sneaker listings
    const sneakersQuery = query(
      collection(db, 'sneakers'),
      where('userId', '==', user.uid)
    );

    const unsubscribeSneakers = onSnapshot(sneakersQuery, (snapshot) => {
      const listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sneaker[];
      setMyListings(listings);
      setLoading(false);
    });

    // Listen to user's search requests
    const requestsQuery = query(
      collection(db, 'searchRequests'),
      where('userId', '==', user.uid)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SearchRequest[];
      setMyRequests(requests);
    });

    return () => {
      unsubscribeSneakers();
      unsubscribeRequests();
    };
  }, [user]);

  const handleDeleteListing = async (id: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'sneakers', id));
              Alert.alert('Success', 'Listing deleted');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete listing');
            }
          },
        },
      ]
    );
  };

  const handleDeleteRequest = async (id: string) => {
    Alert.alert(
      'Delete Request',
      'Are you sure you want to delete this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'searchRequests', id));
              Alert.alert('Success', 'Request deleted');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete request');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to logout');
          }
        },
      },
    ]);
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box padding="$4">
          {/* Profile Header */}
          <VStack space="lg" alignItems="center" marginBottom="$6">
            <Avatar size="xl">
              <AvatarFallbackText>{user?.email || 'User'}</AvatarFallbackText>
            </Avatar>
            <VStack space="xs" alignItems="center">
              <Heading size="lg">{user?.email?.split('@')[0]}</Heading>
              <Text size="sm" color="$textLight500">
                {user?.email}
              </Text>
            </VStack>
          </VStack>

          <Divider marginVertical="$4" />

          {/* My Listings Section */}
          <VStack space="md" marginBottom="$6">
            <Heading size="md">My Listings</Heading>
            {myListings.length === 0 ? (
              <Text color="$textLight500">No listings yet</Text>
            ) : (
              myListings.map((listing) => (
                <Card key={listing.id} padding="$3">
                  <HStack space="md" alignItems="center">
                    <Image
                      source={{ uri: listing.imageUrl }}
                      alt={listing.model}
                      width={60}
                      height={60}
                      borderRadius={6}
                    />
                    <VStack flex={1} space="xs">
                      <Text fontWeight="$bold">{listing.model}</Text>
                      <Text size="sm" color="$textLight600">
                        {listing.brand} - {listing.foot} foot - Size {listing.size}
                      </Text>
                    </VStack>
                    <Pressable onPress={() => handleDeleteListing(listing.id)}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </Pressable>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>

          <Divider marginVertical="$4" />

          {/* My Requests Section */}
          <VStack space="md" marginBottom="$6">
            <Heading size="md">My Requests</Heading>
            {myRequests.length === 0 ? (
              <Text color="$textLight500">No requests yet</Text>
            ) : (
              myRequests.map((request) => (
                <Card key={request.id} padding="$3">
                  <HStack space="md" alignItems="center">
                    <VStack flex={1} space="xs">
                      <Text fontWeight="$bold">
                        Looking for: {request.brand}{request.model ? ` ${request.model}` : ''}
                      </Text>
                      <Text size="sm" color="$textLight600">
                        {request.foot} foot - Size {request.size}
                      </Text>
                    </VStack>
                    <Pressable onPress={() => handleDeleteRequest(request.id)}>
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                    </Pressable>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>

          <Divider marginVertical="$4" />

          {/* Settings Section */}
          <VStack space="md" marginBottom="$6">
            <Heading size="md">Settings</Heading>
            
            <HStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
              <HStack space="sm" alignItems="center">
                <Ionicons name="moon" size={20} color={isDarkMode ? '#007AFF' : '#666'} />
                <Text>Dark Mode</Text>
              </HStack>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                disabled
              />
            </HStack>
            <Text size="xs" color="$textLight500" marginTop="-$2">
              (Follows system preference)
            </Text>
          </VStack>

          <Button size="lg" action="negative" onPress={handleLogout}>
            <ButtonText>Logout</ButtonText>
          </Button>
        </Box>
      </ScrollView>
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