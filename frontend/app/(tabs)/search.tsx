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
} from '@gluestack-ui/themed';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const [foot, setFoot] = useState<'left' | 'right'>('left');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!brand || !size) {
      Alert.alert('Missing fields', 'Please fill at least brand and size');
      return;
    }

    setLoading(true);

    try {
      // Add search request to Firestore
      const requestData = {
        userId: user?.uid,
        foot,
        model: model.toLowerCase(),
        brand: brand.toLowerCase(),
        size,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'searchRequests'), requestData);

      // Check for matching sneakers
      let q = query(
        collection(db, 'sneakers'),
        where('foot', '==', foot),
        where('brand', '==', brand.toLowerCase()),
        where('size', '==', size)
      );

      const querySnapshot = await getDocs(q);
      
      // Create notifications for matching sneakers
      for (const docSnap of querySnapshot.docs) {
        const sneaker = docSnap.data();
        if (sneaker.userId !== user?.uid) {
          // Notify seller
          await addDoc(collection(db, 'notifications'), {
            userId: sneaker.userId,
            type: 'match',
            message: `Someone is looking for a ${foot} foot ${brand}${model ? ` ${model}` : ''} (Size ${size})!`,
            requestId: requestData.userId,
            read: false,
            createdAt: serverTimestamp(),
          });
        }
      }

      Alert.alert('Success', 'Search request posted! We\'ll notify you when we find a match.');
      
      // Reset form
      setModel('');
      setBrand('');
      setSize('');
      setFoot('left');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to post search request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Box padding="$4">
            <Heading size="xl" marginBottom="$6">
              Looking for a Sneaker
            </Heading>

            <VStack space="lg">
              <VStack space="sm">
                <Text fontWeight="$bold">Which foot?</Text>
                <RadioGroup value={foot} onChange={(value) => setFoot(value as 'left' | 'right')}>
                  <HStack space="xl">
                    <Radio value="left">
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel marginLeft="$2">Left</RadioLabel>
                    </Radio>
                    <Radio value="right">
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel marginLeft="$2">Right</RadioLabel>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </VStack>

              <Input variant="outline">
                <InputField
                  placeholder="Model (optional, e.g., Air Jordan 1)"
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

              <Button
                size="lg"
                onPress={handleSubmit}
                isDisabled={loading}
                marginTop="$4"
              >
                <ButtonText>{loading ? 'Posting...' : 'Post Request'}</ButtonText>
              </Button>
            </VStack>
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
    paddingBottom: 40,
  },
});