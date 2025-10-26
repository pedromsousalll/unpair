import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Alert, View, Text } from 'react-native';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { GraffitiInput, GraffitiButton, GraffitiHeader, BrandPicker, SizePicker } from '../components/graffiti';
import { Ionicons } from '@expo/vector-icons';

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
      Alert.alert('Hold up! ✋', 'Fill in at least brand and size!');
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
                Looking for kicks?
              </GraffitiHeader>
              <Text style={styles.subtitle}>
                We'll hit you up when we find 'em!
              </Text>

              <View style={styles.form}>
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

                <GraffitiInput
                  label="Model (Optional)"
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g., Air Jordan 1"
                  borderColor="#f1b311"
                />

                <BrandPicker
                  label="Brand"
                  value={brand}
                  onValueChange={setBrand}
                />

                <GraffitiInput
                  label="Size"
                  value={size}
                  onChangeText={setSize}
                  placeholder="e.g., 10.5"
                  keyboardType="decimal-pad"
                  borderColor="#f1b311"
                />

                <GraffitiButton
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.submitButton}
                >
                  {loading ? 'POSTING...' : 'DROP THE REQUEST'}
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
  footSelector: {
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