import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView,
  Platform, ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useChat } from '../../src/hooks/useChat';

const { width } = Dimensions.get('window');
const PRIMARY = '#4a90e2';

export default function ChatScreen() {
  const { messages, sendMessage, loading, crisisDetected } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const SUGGESTIONS = [
    "I'm feeling anxious",
    "I need to talk",
    "I'm overwhelmed",
    "I feel lonely",
  ];

  // Messages are stored newest-first (inverted), so reverse for display
  const displayMessages = [...messages].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F7FF" />

      {/* Background */}
      <LinearGradient colors={['#F0F7FF', '#FFFFFF', '#EBF4FF']} style={StyleSheet.absoluteFill} />
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.headerAvatarWrap, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient colors={['#4a90e2', '#2C5F8F']} style={styles.headerAvatar}>
              <Ionicons name="leaf" size={18} color="#fff" />
            </LinearGradient>
            <View style={styles.onlineBadge} />
          </Animated.View>
          <View>
            <Text style={styles.headerTitle}>Humura AI</Text>
            <Text style={styles.headerSub}>
              {loading ? 'Thinking...' : 'Online · Always here'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.calmBtn} onPress={() => router.push('/(tabs)/calm')}>
          <Ionicons name="leaf" size={14} color={PRIMARY} />
          <Text style={styles.calmBtnText}>Calm</Text>
        </TouchableOpacity>
      </View>

      {/* Crisis Banner */}
      {crisisDetected && (
        <View style={styles.crisisBanner}>
          <Ionicons name="heart" size={16} color="#fff" />
          <Text style={styles.crisisText}>
            You are not alone. Crisis line: <Text style={styles.crisisLink}>116</Text>
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick suggestions — only when fresh */}
          {messages.length <= 1 && (
            <View style={styles.suggestionsWrap}>
              <Text style={styles.suggestionsLabel}>Quick start</Text>
              <View style={styles.suggestionsRow}>
                {SUGGESTIONS.map((s, i) => (
                  <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => setInput(s)}>
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {displayMessages.map((item) => {
            const isUser = item.sender === 'user';
            return (
              <View key={item.id} style={[styles.bubbleRow, isUser ? styles.userRow : styles.aiRow]}>
                {!isUser && (
                  <View style={styles.aiAvatarSmall}>
                    <LinearGradient colors={['#4a90e2', '#2C5F8F']} style={styles.aiAvatarGrad}>
                      <Ionicons name="leaf" size={12} color="#fff" />
                    </LinearGradient>
                  </View>
                )}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                  {isUser ? (
                    <LinearGradient colors={['#4a90e2', '#2C5F8F']} style={styles.userBubbleGrad}>
                      <Text style={styles.userText}>{item.text}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.aiBubbleInner}>
                      <Text style={styles.aiText}>{item.text}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <View style={styles.aiRow}>
              <View style={styles.aiAvatarSmall}>
                <LinearGradient colors={['#4a90e2', '#2C5F8F']} style={styles.aiAvatarGrad}>
                  <Ionicons name="leaf" size={12} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.typingBubble}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={[styles.typingDot, { opacity: 0.4 + i * 0.2 }]} />
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="How are you feeling right now?"
              placeholderTextColor="#A0B8D0"
              style={styles.input}
              multiline
              maxLength={500}
              returnKeyType="default"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <LinearGradient
                colors={input.trim() ? ['#4a90e2', '#2C5F8F'] : ['#E3F0FF', '#E3F0FF']}
                style={styles.sendBtnGrad}
              >
                <Ionicons name="send" size={17} color={input.trim() ? '#fff' : '#A0B8D0'} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>Humura AI · Not a substitute for professional care</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },

  orb1: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(74,144,226,0.05)', top: -50, right: -70 },
  orb2: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(74,144,226,0.04)', bottom: 180, left: -50 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: 'rgba(74,144,226,0.12)',
    shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAvatarWrap: { marginRight: 12, position: 'relative' },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  onlineBadge: { position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: '#4ADE80', borderWidth: 2, borderColor: '#fff' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0D1B2A' },
  headerSub: { fontSize: 11, color: PRIMARY, marginTop: 1, fontWeight: '500' },
  calmBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EBF4FF', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(74,144,226,0.25)',
  },
  calmBtnText: { color: PRIMARY, fontSize: 13, fontWeight: '600', marginLeft: 5 },

  crisisBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#C0392B', paddingHorizontal: 16, paddingVertical: 10 },
  crisisText: { color: '#fff', fontSize: 13, marginLeft: 8, fontWeight: '500' },
  crisisLink: { fontWeight: '800', textDecorationLine: 'underline' },

  messageList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

  suggestionsWrap: { marginBottom: 20 },
  suggestionsLabel: { fontSize: 12, color: '#A0B8D0', fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  suggestionChip: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(74,144,226,0.25)' },
  suggestionText: { color: PRIMARY, fontSize: 13, fontWeight: '500' },

  bubbleRow: { flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatarSmall: { marginRight: 8 },
  aiAvatarGrad: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  bubble: { maxWidth: width * 0.72 },
  userBubble: {},
  aiBubble: {},
  userBubbleGrad: { borderRadius: 20, borderBottomRightRadius: 4, paddingHorizontal: 16, paddingVertical: 11 },
  aiBubbleInner: { backgroundColor: '#fff', borderRadius: 20, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderColor: 'rgba(74,144,226,0.15)', shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  userText: { color: '#fff', fontSize: 15, lineHeight: 22 },
  aiText: { color: '#1a2e4a', fontSize: 15, lineHeight: 22 },

  typingBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(74,144,226,0.15)', gap: 5 },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: PRIMARY },

  inputBar: {
    paddingHorizontal: 12, paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 110 : 90,
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: 'rgba(74,144,226,0.12)',
  },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#F0F7FF', borderRadius: 28, borderWidth: 1, borderColor: 'rgba(74,144,226,0.25)', paddingHorizontal: 6, paddingVertical: 6 },
  input: { flex: 1, color: '#0D1B2A', fontSize: 15, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 120, lineHeight: 21 },
  sendBtn: { borderRadius: 22, overflow: 'hidden' },
  sendBtnOff: { opacity: 0.6 },
  sendBtnGrad: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  disclaimer: { textAlign: 'center', color: '#C0D4E8', fontSize: 10, marginTop: 8, fontWeight: '500' },
});
