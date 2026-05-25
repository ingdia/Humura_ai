import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { messagesAPI } from '../../src/services/api';
import { getSocket, getRoomId } from '../../src/services/socket';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ThreadScreen() {
  const { id, name, role } = useLocalSearchParams<{ id: string; name: string; role: string }>();
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const otherId = parseInt(id as string, 10);
  const displayName = name ?? 'Specialist';
  const displayRole = role ?? '';

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  // Load thread history — 5 s timeout so we never block the screen
  const loadThread = useCallback(async () => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    try {
      const res = await messagesAPI.thread(otherId);
      setMessages(res.data);
    } catch {
      // Silently fail — show empty thread
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }, [otherId]);

  useEffect(() => {
    loadThread();
  }, [loadThread]);

  // Socket.io real-time setup
  useEffect(() => {
    if (!user?.id || isNaN(otherId)) return;

    const socket = getSocket();
    const roomId = getRoomId(user.id, otherId);

    socket.emit('join_room', roomId);

    const handleNewMessage = (msg: Message) => {
      // Only add messages from the other person — our sent messages are added immediately on send
      if (msg.sender_id !== user.id) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setIsOtherTyping(false);
      }
    };

    const handleTyping = () => setIsOtherTyping(true);
    const handleStopTyping = () => setIsOtherTyping(false);

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);
    socket.on('user_stop_typing', handleStopTyping);

    return () => {
      socket.emit('leave_room', roomId);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stop_typing', handleStopTyping);
    };
  }, [user?.id, otherId]);

  // Auto-scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 80);
    }
  }, [loading]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !user?.id) return;

    setSending(true);
    setText('');

    // Emit stop_typing
    if (user?.id && !isNaN(otherId)) {
      const socket = getSocket();
      socket.emit('stop_typing', { roomId: getRoomId(user.id, otherId) });
    }

    try {
      const res = await messagesAPI.send(otherId, trimmed);
      // Add sent message immediately from API response
      setMessages(prev => {
        if (prev.some(m => m.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
    } catch {
      // Restore text on failure
      setText(trimmed);
    } finally {
      setSending(false);
    }
  };

  const handleTextChange = (val: string) => {
    setText(val);
    if (!user?.id || isNaN(otherId)) return;
    const socket = getSocket();
    const roomId = getRoomId(user.id, otherId);
    if (val.trim()) {
      socket.emit('typing', { roomId });
    } else {
      socket.emit('stop_typing', { roomId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.headerAvatarFallback}>
            <Text style={styles.headerAvatarLetter}>{displayName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{displayName}</Text>
            {displayRole ? <Text style={styles.headerSub}>{displayRole}</Text> : null}
          </View>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            <View style={styles.encryptedBanner}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
              <Text style={styles.encryptedText}>
                {language === 'kn'
                  ? 'Ibiganiro birinzwe. Ibanga ryawe rirahishwe.'
                  : 'Conversation encrypted. Your identity is protected.'}
              </Text>
            </View>

            {messages.map(m => {
              const isMe = m.sender_id === user?.id;
              return (
                <View
                  key={m.id}
                  style={[styles.bubbleWrap, isMe ? styles.bubbleWrapUser : styles.bubbleWrapOther]}
                >
                  <View style={[styles.bubble, isMe ? styles.bubbleUser : styles.bubbleOther]}>
                    <Text style={[styles.bubbleText, isMe ? styles.bubbleTextUser : styles.bubbleTextOther]}>
                      {m.content}
                    </Text>
                  </View>
                  <Text style={[styles.time, isMe && { textAlign: 'right' }]}>
                    {formatTime(m.created_at)}
                  </Text>
                </View>
              );
            })}

            {isOtherTyping && (
              <View style={[styles.bubbleWrap, styles.bubbleWrapOther]}>
                <View style={[styles.bubble, styles.bubbleOther, { opacity: 0.6 }]}>
                  <Text style={styles.bubbleTextOther}>
                    {language === 'kn' ? 'Andika...' : 'Typing...'}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder={language === 'kn' ? 'Andika ubutumwa...' : 'Type your message...'}
            value={text}
            onChangeText={handleTextChange}
            multiline
            placeholderTextColor={Colors.tabInactive}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && { backgroundColor: Colors.tabInactive }]}
            onPress={send}
            disabled={!text.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="send" size={20} color="#fff" />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, paddingTop: 20, backgroundColor: '#fff', ...Shadows.soft,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
  },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginHorizontal: 8 },
  headerAvatarFallback: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  headerAvatarLetter: { color: '#fff', fontWeight: '800', fontSize: 16 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  encryptedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EBF4FF', borderRadius: 10, padding: 10,
    marginBottom: 20, borderWidth: 1, borderColor: '#D4E6FC',
  },
  encryptedText: { fontSize: 11, color: Colors.primary, fontWeight: '600', flex: 1 },
  scroll: { padding: 16, paddingBottom: 24 },
  bubbleWrap: { maxWidth: '82%', marginBottom: 16 },
  bubbleWrapUser: { alignSelf: 'flex-end' },
  bubbleWrapOther: { alignSelf: 'flex-start' },
  bubble: { padding: 14, borderRadius: 20 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4, ...Shadows.soft },
  bubbleOther: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#EBF2FA', ...Shadows.soft },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#fff', fontWeight: '500' },
  bubbleTextOther: { color: Colors.text, fontWeight: '500' },
  time: { fontSize: 11, color: Colors.tabInactive, marginTop: 4, marginHorizontal: 4, fontWeight: '600' },
  inputArea: {
    flexDirection: 'row', padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'flex-end', gap: 12,
  },
  input: {
    flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
    maxHeight: 100, fontSize: 15, color: Colors.text,
    borderWidth: 1, borderColor: '#EBF2FA',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', ...Shadows.soft,
  },
});
