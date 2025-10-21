import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
  CircleIcon,
  Image,
  Pressable,
} from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SellScreen() {
  const [foot, setFoot] = useState<'left' | 'right'>('left');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hold up! ✋', 'We need photo access to show off your kicks!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hold up! ✋', 'We need camera access!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!model || !brand || !size || !condition || !image) {
      Alert.alert('Hold up! ✋', 'Fill in all fields and snap a pic!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `sneakers/${user?.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      const sneakerData = {
        userId: user?.uid,
        foot,
        model,
        brand,
        size,
        condition,
        imageUrl,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'sneakers'), sneakerData);

      const q = query(
        collection(db, 'searchRequests'),
        where('foot', '==', foot),
        where('brand', '==', brand.toLowerCase()),
        where('size', '==', size)
      );

      const querySnapshot = await getDocs(q);
      
      for (const docSnap of querySnapshot.docs) {
        const request = docSnap.data();
        if (request.userId !== user?.uid) {
          await addDoc(collection(db, 'notifications'), {
            userId: request.userId,
            type: 'match',
            message: `A ${foot} foot ${brand} ${model} (Size ${size}) just dropped!`,
            sneakerId: sneakerData.userId,
            read: false,
            createdAt: serverTimestamp(),
          });
        }
      }

      Alert.alert('Dropped! 🛹', 'Your kick is live!');
      
      setModel('');
      setBrand('');
      setSize('');
      setCondition('');
      setImage(null);
      setFoot('left');
    } catch (err: any) {
      Alert.alert('Oops! 😅', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Box padding="$4" alignItems="center">
            <Box width="100%" maxWidth={400}>
              <Heading size="xl" marginBottom="$2" color={colors.text} textAlign="center">
                Drop your kicks! 🛹
              </Heading>
              <Text size="sm" color={colors.textSecondary} textAlign="center" marginBottom="$6">
                List that lonely sneaker
              </Text>

              <VStack space="lg">
                <VStack space="sm">
                  <Text fontWeight="$bold" color={colors.text}>Which foot?</Text>
                  <RadioGroup value={foot} onChange={(value) => setFoot(value as 'left' | 'right')}>
                    <HStack space="xl" justifyContent="center">
                      <Radio value="left">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel marginLeft="$2">👈 Left</RadioLabel>
                      </Radio>
                      <Radio value="right">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel marginLeft="$2">👉 Right</RadioLabel>
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </VStack>

                <Input variant="outline">
                  <InputField
                    placeholder="Model (e.g., Air Jordan 1)"
                    value={model}
                    onChangeText={setModel}
                  />
                </Input>

                <Input variant="outline">
                  <InputField
                    placeholder="Brand (e.g., Nike)"
                    value={brand}
                    onChangeText={setBrand}
                  />
                </Input>

                <Input variant="outline">
                  <InputField
                    placeholder="Size (e.g., 10.5)"
                    value={size}
                    onChangeText={setSize}
                    keyboardType="decimal-pad"
                  />
                </Input>

                <Input variant="outline">
                  <InputField
                    placeholder="Condition (e.g., Brand New, Worn Once)"
                    value={condition}
                    onChangeText={setCondition}
                  />
                </Input>

                <VStack space="sm">
                  <Text fontWeight="$bold" color={colors.text}>Snap a pic 📸</Text>
                  {image ? (
                    <Pressable onPress={pickImage}>
                      <Image
                        source={{ uri: image }}
                        alt="Sneaker"
                        width="100%"
                        height={200}
                        borderRadius={8}
                      />
                    </Pressable>
                  ) : (
                    <HStack space="sm">
                      <Button flex={1} onPress={pickImage} variant="outline">
                        <Ionicons name="images" size={20} color={colors.primary} />
                        <ButtonText marginLeft="$2">Gallery</ButtonText>
                      </Button>
                      <Button flex={1} onPress={takePhoto} variant="outline">
                        <Ionicons name="camera" size={20} color={colors.primary} />
                        <ButtonText marginLeft="$2">Camera</ButtonText>
                      </Button>
                    </HStack>
                  )}
                </VStack>

                <Button
                  size="lg"
                  onPress={handleSubmit}
                  isDisabled={loading}
                  marginTop="$4"
                  borderRadius="$full"
                >
                  <ButtonText>{loading ? 'Posting...' : 'Drop it!'}</ButtonText>
                </Button>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});