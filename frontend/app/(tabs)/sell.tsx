import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Alert, View, Text, Image, Pressable } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { GraffitiInput, GraffitiButton, GraffitiHeader, BrandPicker, SizePicker } from '../components/graffiti';

export default function SellScreen() {
  const [foot, setFoot] = useState<'left' | 'right'>('left');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();

  const pickImage = async (useCamera: boolean) => {
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
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!brand || !size || !imageUri) {
      Alert.alert('Hold up! ✋', 'Add a photo, brand, and size at least!');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `sneakers/${user?.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'sneakers'), {
        userId: user?.uid,
        userEmail: user?.email,
        foot,
        model: model.toLowerCase(),
        brand: brand.toLowerCase(),
        size,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Posted! 🔥', 'Your kick is now live!');
      
      setModel('');
      setBrand('');
      setSize('');
      setImageUri(null);
      setFoot('left');
    } catch (err: any) {
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
                {/* Image Upload */}
                <View style={styles.imageSection}>
                  <Text style={styles.label}>PHOTO</Text>
                  {imageUri ? (
                    <View style={styles.imagePreview}>
                      <Image source={{ uri: imageUri }} style={styles.image} />
                      <Pressable
                        style={styles.removeButton}
                        onPress={() => setImageUri(null)}
                      >
                        <Ionicons name="close-circle" size={32} color="#f1b311" />
                      </Pressable>
                    </View>
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <View style={styles.uploadButtons}>
                        <Pressable
                          style={styles.uploadOption}
                          onPress={() => pickImage(true)}
                        >
                          <Ionicons name="camera" size={40} color="#f1b311" />
                          <Text style={styles.uploadText}>Camera</Text>
                        </Pressable>
                        <View style={styles.dividerVertical} />
                        <Pressable
                          style={styles.uploadOption}
                          onPress={() => pickImage(false)}
                        >
                          <Ionicons name="images" size={40} color="#f1b311" />
                          <Text style={styles.uploadText}>Gallery</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
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
  imagePlaceholder: {
    width: '100%',
    height: 200,
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
    gap: 20,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 20,
  },
  uploadText: {
    color: '#f1b311',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  dividerVertical: {
    width: 2,
    height: 60,
    backgroundColor: '#555',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
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
});