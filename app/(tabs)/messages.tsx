import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, View as RNView } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Spinner,
} from '@gluestack-ui/themed';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: any;
  unreadCount: number;
  otherUser: {
    id: string;
    name: string;
    photoURL?: string;
  };
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[];
        
        convos.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis();
        });
        
        setConversations(convos);
        setLoading(false);
      },
      (error) => {
        console.log('Error loading conversations:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
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
          borderBottomWidth={1}
          borderBottomColor={colors.border}
          backgroundColor={colors.surface}
        >
          <Text fontSize="$2xl" fontWeight="$bold" color={colors.text}>
            Messages
          </Text>
        </HStack>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {conversations.length === 0 ? (
            <Box padding="$8" alignItems="center">
              <Text fontSize="$xl" marginBottom="$2">💬</Text>
              <Text size="lg" color={colors.textSecondary} textAlign="center">
                No messages yet!
              </Text>
              <Text size="sm" color={colors.textSecondary} textAlign="center" marginTop="$2">
                Start chatting with other skaters
              </Text>
            </Box>
          ) : (
            conversations.map((convo) => (
              <Pressable
                key={convo.id}
                onPress={() => router.push(`/chat/${convo.id}`)}
              >
                <HStack
                  padding="$4"
                  space="md"
                  borderBottomWidth={1}
                  borderBottomColor={colors.border}
                  backgroundColor={convo.unreadCount > 0 ? colors.surface : colors.background}
                >
                  <Avatar size="md">
                    {convo.otherUser.photoURL ? (
                      <AvatarImage source={{ uri: convo.otherUser.photoURL }} />
                    ) : (
                      <AvatarFallbackText>{convo.otherUser.name}</AvatarFallbackText>
                    )}
                  </Avatar>
                  
                  <VStack flex={1}>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text fontWeight="$bold" color={colors.text}>
                        {convo.otherUser.name}
                      </Text>
                      <Text size="xs" color={colors.textSecondary}>
                        {formatTime(convo.lastMessageTime)}
                      </Text>
                    </HStack>
                    <HStack justifyContent="space-between" alignItems="center">
                      <Text
                        size="sm"
                        color={colors.textSecondary}
                        numberOfLines={1}
                        flex={1}
                      >
                        {convo.lastMessage}
                      </Text>
                      {convo.unreadCount > 0 && (
                        <RNView
                          style={[
                            styles.badge,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text size="xs" color={colors.background}>
                            {convo.unreadCount}
                          </Text>
                        </RNView>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
              </Pressable>
            ))
          )}
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
    flexGrow: 1,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});