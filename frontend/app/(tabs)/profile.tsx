import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, View as RNView, Platform, TouchableOpacity } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Card,
  Image,
  Divider,
  Spinner,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  CloseIcon,
} from '@gluestack-ui/themed';
import { collection, query, where, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { storage } from '../config/firebase';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';

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
  const [uploading, setUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

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

  const handlePhotoUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need access to your photos!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && user) {
        setUploading(true);
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const filename = `profile/${user.uid}/${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const photoURL = await getDownloadURL(storageRef);
        
        // Update Firebase Auth profile
        await updateProfile(user, { photoURL });
        
        // Update Firestore user document
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          photoURL: photoURL,
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0],
        }, { merge: true });
        
        Alert.alert('Nice! 🎉', 'Profile photo updated! You may need to refresh to see changes.');
        setUploading(false);
        // Force re-render by reloading user
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Photo upload error:', error);
      Alert.alert('Oops!', error.message || 'Failed to upload photo');
      setUploading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    Alert.alert(
      'Delete Listing',
      'Remove this kick from the lineup?',
      [
        { text: 'Nah', style: 'cancel' },
        {
          text: 'Yep',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'sneakers', id));
              // Success feedback - no need for additional alert as list updates automatically
            } catch (err: any) {
              console.error('Delete error:', err);
              Alert.alert('Error', err.message || 'Failed to delete');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteRequest = async (id: string) => {
    Alert.alert(
      'Delete Request',
      'Stop looking for this pair?',
      [
        { text: 'Nah', style: 'cancel' },
        {
          text: 'Yep',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'searchRequests', id));
              // Success feedback - no need for additional alert as list updates automatically
            } catch (err: any) {
              console.error('Delete error:', err);
              Alert.alert('Error', err.message || 'Failed to delete');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
      router.replace('/welcome');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to logout');
      setShowLogoutModal(false);
    }
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
      <EmailVerificationBanner />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Box padding="$4">
          <VStack space="lg" alignItems="center" marginBottom="$6">
            <TouchableOpacity onPress={handlePhotoUpload} disabled={uploading}>
              <Box position="relative">
                <Avatar size="2xl" backgroundColor={colors.surface}>
                  {user?.photoURL ? (
                    <AvatarImage source={{ uri: user.photoURL }} />
                  ) : (
                    <AvatarFallbackText>{user?.email || 'User'}</AvatarFallbackText>
                  )}
                </Avatar>
                <RNView
                  style={[
                    styles.cameraButton,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </RNView>
              </Box>
            </TouchableOpacity>
            {uploading && (
              <Text size="sm" color={colors.textSecondary}>Uploading...</Text>
            )}
            <VStack space="xs" alignItems="center">
              <Heading size="lg" color={colors.text}>
                {user?.displayName || user?.email?.split('@')[0]}
              </Heading>
              <Text size="sm" color={colors.textSecondary}>
                {user?.email}
              </Text>
            </VStack>
          </VStack>

          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <HStack 
              padding="$3" 
              backgroundColor={colors.surface}
              borderRadius="$full"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="$6"
            >
              <HStack space="sm" alignItems="center">
                <Ionicons name="settings" size={20} color={colors.text} />
                <Text color={colors.text} fontWeight="$medium">Settings</Text>
              </HStack>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </HStack>
          </TouchableOpacity>

          <Divider marginVertical="$4" />

          <VStack space="md" marginBottom="$6">
            <Heading size="md" color={colors.text}>My Kicks</Heading>
            {myListings.length === 0 ? (
              <Text color={colors.textSecondary}>No listings yet. Drop some!</Text>
            ) : (
              myListings.map((listing) => (
                <Card key={listing.id} padding="$3" backgroundColor={colors.card} borderRadius="$lg">
                  <HStack space="md" alignItems="center">
                    <Image
                      source={{ uri: listing.imageUrl }}
                      alt={listing.model}
                      width={60}
                      height={60}
                      borderRadius={8}
                    />
                    <VStack flex={1} space="xs">
                      <Text fontWeight="$bold" color={colors.text}>{listing.model}</Text>
                      <Text size="sm" color={colors.textSecondary}>
                        {listing.brand} - {listing.foot} foot - Size {listing.size}
                      </Text>
                    </VStack>
                    <TouchableOpacity onPress={() => handleDeleteListing(listing.id)}>
                      <Ionicons name="trash-outline" size={24} color="#FF0000" />
                    </TouchableOpacity>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>

          <Divider marginVertical="$4" />

          <VStack space="md" marginBottom="$6">
            <Heading size="md" color={colors.text}>Looking For</Heading>
            {myRequests.length === 0 ? (
              <Text color={colors.textSecondary}>No requests yet</Text>
            ) : (
              myRequests.map((request) => (
                <Card key={request.id} padding="$3" backgroundColor={colors.card} borderRadius="$lg">
                  <HStack space="md" alignItems="center">
                    <VStack flex={1} space="xs">
                      <Text fontWeight="$bold" color={colors.text}>
                        {request.brand}{request.model ? ` ${request.model}` : ''}
                      </Text>
                      <Text size="sm" color={colors.textSecondary}>
                        {request.foot} foot - Size {request.size}
                      </Text>
                    </VStack>
                    <TouchableOpacity onPress={() => handleDeleteRequest(request.id)}>
                      <Ionicons name="trash-outline" size={24} color="#FF0000" />
                    </TouchableOpacity>
                  </HStack>
                </Card>
              ))
            )}
          </VStack>

          <Divider marginVertical="$4" />

          <Button size="lg" action="negative" onPress={handleLogout} borderRadius="$full">
            <ButtonText>Catch you later!</ButtonText>
          </Button>
        </Box>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <ModalBackdrop />
        <ModalContent backgroundColor={colors.card}>
          <ModalHeader borderBottomWidth={1} borderColor={colors.border}>
            <Heading size="lg" color={colors.text}>Peace out! 🛹</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} color={colors.text} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody paddingVertical="$6">
            <Text color={colors.text} size="md">
              Later, skater! Are you sure you want to logout?
            </Text>
          </ModalBody>
          <ModalFooter borderTopWidth={1} borderColor={colors.border}>
            <HStack space="md" width="$full">
              <Button
                flex={1}
                variant="outline"
                onPress={() => setShowLogoutModal(false)}
                borderColor={colors.border}
              >
                <ButtonText color={colors.text}>Stay</ButtonText>
              </Button>
              <Button
                flex={1}
                action="negative"
                onPress={confirmLogout}
              >
                <ButtonText>Logout</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    padding: 8,
  },
});