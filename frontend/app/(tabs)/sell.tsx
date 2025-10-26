import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Alert, View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { GraffitiInput, GraffitiButton, GraffitiHeader, BrandPicker, SizePicker } from '../components/graffiti';

const MAX_IMAGES = 5;

export default function SellScreen() {
  const [foot, setFoot] = useState<'left' | 'right'>('left');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('Good');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();

  const pickImages = async (useCamera: boolean) => {
    if (imageUris.length >= MAX_IMAGES) {
      Alert.alert('Max Photos', `You can only add up to ${MAX_IMAGES} photos`);
      return;
    }

    const { status } = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera/gallery access to upload photos!');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          allowsMultipleSelection: true,
          quality: 0.7,
        });

    if (!result.canceled && result.assets) {
      const newImages = result.assets
        .slice(0, MAX_IMAGES - imageUris.length)
        .map(asset => asset.uri);
      setImageUris([...imageUris, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = imageUris.filter((_, i) => i !== index);
    setImageUris(newImages);
  };

  const handleSubmit = async () => {
    if (!brand || !size || imageUris.length === 0) {
      Alert.alert('Hold up! ✋', 'Add at least one photo, brand, and size!');
      return;
    }

    setUploading(true);

    try {
      // Upload all images
      const uploadPromises = imageUris.map(async (uri, index) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `sneakers/${user?.uid}/${Date.now()}_${index}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      });

      const downloadURLs = await Promise.all(uploadPromises);

      await addDoc(collection(db, 'sneakers'), {
        userId: user?.uid,
        userEmail: user?.email,
        foot,
        model: model.toLowerCase(),
        brand: brand.toLowerCase(),
        size,
        condition,
        imageUrl: downloadURLs[0], // Primary image for backwards compatibility
        imageUrls: downloadURLs, // All images
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        '🔥 Kick Posted!',
        'Your sneaker is now live! We\'ll hit you up when someone\'s looking for your match.',
        [{ text: 'Awesome! 🛹' }]
      );
      
      // Reset form
      setModel('');
      setBrand('');
      setSize('');
      setCondition('Good');
      setImageUris([]);
      setFoot('left');
    } catch (err: any) {
      console.error('Upload error:', err);
      Alert.alert('Oops! 😅', err.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Texture */}
      <View style={styles.texturePattern}>
        {[...Array(100)].map((_, i) => (
          <View key={i} style={[styles.textureSpot, { 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
          }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formContainer}>
              <GraffitiHeader color="#f1b311" size="large">
                Sell Your Kicks
              </GraffitiHeader>
              <Text style={styles.subtitle}>
                Find a match for your lonely sneaker
              </Text>

              <View style={styles.form}>
                {/* Image Upload Section */}
                <View style={styles.imageSection}>
                  <Text style={styles.label}>PHOTOS ({imageUris.length}/{MAX_IMAGES})</Text>
                  
                  {/* Image Grid */}
                  <View style={styles.imageGrid}>
                    {imageUris.map((uri, index) => (
                      <View key={index} style={styles.imagePreview}>
                        <Image source={{ uri }} style={styles.image} />
                        <Pressable
                          style={styles.removeButton}
                          onPress={() => removeImage(index)}
                        >
                          <Ionicons name="close-circle" size={24} color="#f1b311" />
                        </Pressable>
                        {index === 0 && (
                          <View style={styles.primaryBadge}>
                            <Text style={styles.primaryText}>PRIMARY</Text>
                          </View>
                        )}
                      </View>
                    ))}
                    
                    {/* Add Photo Button */}
                    {imageUris.length < MAX_IMAGES && (
                      <View style={styles.imagePlaceholder}>
                        <View style={styles.uploadButtons}>
                          <Pressable
                            style={styles.uploadOption}
                            onPress={() => pickImages(true)}
                          >
                            <Ionicons name="camera" size={32} color="#f1b311" />
                          </Pressable>
                          <View style={styles.dividerVertical} />
                          <Pressable
                            style={styles.uploadOption}
                            onPress={() => pickImages(false)}
                          >
                            <Ionicons name="images" size={32} color="#f1b311" />
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                {/* Foot Selection */}
                <View style={styles.footSelector}>
                  <Text style={styles.label}>WHICH FOOT?</Text>
                  <View style={styles.footButtons}>
                    <GraffitiButton
                      onPress={() => setFoot('left')}
                      variant={foot === 'left' ? 'primary' : 'secondary'}
                      style={styles.footButton}
                    >
                      👈 LEFT
                    </GraffitiButton>
                    <GraffitiButton
                      onPress={() => setFoot('right')}
                      variant={foot === 'right' ? 'primary' : 'secondary'}
                      style={styles.footButton}
                    >
                      👉 RIGHT
                    </GraffitiButton>
                  </View>
                </View>

                <BrandPicker
                  label="Brand"
                  value={brand}
                  onValueChange={setBrand}
                />

                <GraffitiInput
                  label="Model (Optional)"
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g., Air Jordan 1"
                  borderColor="#f1b311"
                />

                <SizePicker
                  label="Size"
                  value={size}
                  onValueChange={setSize}
                />

                <GraffitiInput
                  label="Condition"
                  value={condition}
                  onChangeText={setCondition}
                  placeholder="e.g., New, Good, Fair"
                  borderColor="#f1b311"
                />

                <GraffitiButton
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.submitButton}
                >
                  {uploading ? 'UPLOADING...' : 'POST IT!'}
                </GraffitiButton>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Loading Overlay */}
        {uploading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#f1b311" />
              <Text style={styles.loadingText}>Uploading {imageUris.length} photo{imageUris.length > 1 ? 's' : ''}...</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  texturePattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  textureSpot: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 1.5,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
  },
  form: {
    width: '100%',
  },
  imageSection: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f1b311',
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imagePlaceholder: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'rgba(45, 45, 42, 0.8)',
    borderWidth: 2,
    borderColor: '#f1b311',
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 12,
  },
  dividerVertical: {
    width: 2,
    height: 40,
    backgroundColor: '#555',
  },
  imagePreview: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#f1b311',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#f1b311',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  footSelector: {
    marginBottom: 20,
    width: '100%',
  },
  footButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  footButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: 'rgba(45, 45, 42, 0.95)',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1b311',
  },
  loadingText: {
    color: '#f1b311',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
  },
});