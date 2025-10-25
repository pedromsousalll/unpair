import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Spinner,
  Pressable,
} from '@gluestack-ui/themed';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: any;
}

interface OtherUser {
  id: string;
  name: string;
  photoURL?: string;
}

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadOtherUser();
    loadMessages();
  }, [conversationId]);

  const loadOtherUser = async () => {
    try {
      const participants = (conversationId as string).split('_');
      const otherUserId = participants.find(id => id !== user?.uid);
      
      if (otherUserId) {
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOtherUser({
            id: otherUserId,
            name: userData.email?.split('@')[0] || 'User',
            photoURL: userData.photoURL,
          });
        }
      }
    } catch (error) {
      console.log('Error loading other user:', error);
    }
  };

  const loadMessages = () => {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(msgs);
        setLoading(false);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      },
      (error) => {
        console.log('Error loading messages:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user) return;

    try {
      const newMessage = {
        conversationId,
        senderId: user.uid,
        text: messageText.trim(),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'messages'), newMessage);

      const convQuery = query(
        collection(db, 'conversations'),
        where('conversationId', '==', conversationId)
      );
      const convSnapshot = await getDoc(doc(db, 'conversations', conversationId as string));
      
      if (convSnapshot.exists()) {
        await updateDoc(doc(db, 'conversations', conversationId as string), {
          lastMessage: messageText.trim(),
          lastMessageTime: serverTimestamp(),
        });
      }

      setMessageText('');
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <HStack
          padding="$4"
          space="md"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor={colors.border}
          backgroundColor={colors.surface}
        >
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Avatar size="sm" backgroundColor={colors.surface}>
            {otherUser?.photoURL ? (
              <AvatarImage source={{ uri: otherUser.photoURL }} />
            ) : (
              <AvatarFallbackText>{otherUser?.name || 'U'}</AvatarFallbackText>
            )}
          </Avatar>
          <Text fontSize="$lg" fontWeight="$bold" color={colors.text}>
            {otherUser?.name || 'User'}
          </Text>
        </HStack>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
        >
          {messages.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center" padding="$8">
              <Text color={colors.textSecondary} textAlign="center">
                Start the conversation!
              </Text>
            </Box>
          ) : (
            messages.map((message) => {
              const isMyMessage = message.senderId === user?.uid;
              return (
                <Box
                  key={message.id}
                  alignSelf={isMyMessage ? 'flex-end' : 'flex-start'}
                  maxWidth="75%"
                  marginBottom="$2"
                >
                  <Box
                    padding="$3"
                    borderRadius="$lg"
                    backgroundColor={isMyMessage ? colors.primary : colors.surface}
                  >
                    <Text color={isMyMessage ? colors.background : colors.text}>
                      {message.text}
                    </Text>
                  </Box>
                  <Text
                    size="xs"
                    color={colors.textSecondary}
                    alignSelf={isMyMessage ? 'flex-end' : 'flex-start'}
                    marginTop="$1"
                  >
                    {formatTime(message.createdAt)}
                  </Text>
                </Box>
              );
            })
          )}
        </ScrollView>

        <HStack
          padding="$3"
          space="sm"
          backgroundColor={colors.surface}
          borderTopWidth={1}
          borderTopColor={colors.border}
        >
          <RNTextInput
            style={[
              styles.input,
              {
                flex: 1,
                backgroundColor: isDark ? colors.background : '#FFFFFF',
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!messageText.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: messageText.trim() ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons
              name="send"
              size={20}
              color={messageText.trim() ? colors.background : colors.textSecondary}
            />
          </Pressable>
        </HStack>
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
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});