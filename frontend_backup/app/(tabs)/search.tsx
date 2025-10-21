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
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

export default function SearchScreen() {
  const [foot, setFoot] = useState<'left' | 'right'>('left');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  };

  const handleSubmit = async () => {
    if (!brand || !size) {
      Alert.alert('Hold up! ✋', 'Fill in at least brand and size, skater!');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        userId: user?.uid,
        foot,
        model: model.toLowerCase(),
        brand: brand.toLowerCase(),
        size,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'searchRequests'), requestData);

      let q = query(
        collection(db, 'sneakers'),
        where('foot', '==', foot),
        where('brand', '==', brand.toLowerCase()),
        where('size', '==', size)
      );

      const querySnapshot = await getDocs(q);
      
      for (const docSnap of querySnapshot.docs) {
        const sneaker = docSnap.data();
        if (sneaker.userId !== user?.uid) {
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

      const hasPermission = await requestNotificationPermission();
      
      Alert.alert(
        'Nice! 🎯',
        "You'll catch a notification if we find your pair!" + 
        (hasPermission ? " \n\nNotifications are ON 🔔" : "\n\nTurn on notifications to get instant alerts! 🔔"),
        [
          {
            text: hasPermission ? 'Cool! 😎' : 'Enable Notifications',
            onPress: hasPermission ? undefined : async () => {
              await requestNotificationPermission();
            }
          }
        ]
      );
      
      setModel('');
      setBrand('');
      setSize('');
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
                Looking for kicks? 🔍
              </Heading>
              <Text size="sm" color={colors.textSecondary} textAlign="center" marginBottom="$6">
                We'll hit you up when we find 'em!
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
                  borderRadius="$full"
                >
                  <ButtonText>{loading ? 'Posting...' : 'Drop the Request'}</ButtonText>
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