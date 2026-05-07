import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChat } from '../../src/hooks/useChat';

const PRIMARY = '#4a90e2';
const BG = '#F5F8FF';

export default function ChatScreen() {
  const { messages, sendMessage, loading, crisisDetected } = useChat();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const renderItem = ({ item }: any) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="leaf" size={14} color="#fff" />
          </View>
        )}
        <View style={[styles.bubbleContent, isUser ? styles.userContent : styles.aiContent]}>
          <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Ionicons name="leaf" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Humura AI</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Always here for you</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.calmBtn} onPress={() => router.push('/(tabs)/calm')}>
          <Ionicons name="leaf" size={16} color={PRIMARY} />
          <Text style={styles.calmBtnText}>Calm</Text>
        </TouchableOpacity>
      </View>

      {/* Crisis Banner */}
      {crisisDetected && (
        <View style={styles.crisisBanner}>
          <Ionicons name="heart" size={18} color="#fff" />
          <Text style={styles.crisisText}>
            You're not alone. Crisis line: <Text style={styles.crisisLink}>116</Text>
          </Text>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {loading && (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" color={PRIMARY} />
            <Text style={styles.typingText}>Humura is thinking...</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="How are you feeling right now?"
            placeholderTextColor="#aaa"
            style={styles.input}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EEF2FF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 3,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ADE80', marginRight: 5 },
  onlineText: { fontSize: 12, color: '#666' },
  calmBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EEF6FF', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#C8DEFF',
  },
  calmBtnText: { color: PRIMARY, fontSize: 13, fontWeight: '600', marginLeft: 4 },
  crisisBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E53E3E', paddingHorizontal: 16, paddingVertical: 10,
  },
  crisisText: { color: '#fff', fontSize: 13, marginLeft: 8, fontWeight: '500' },
  crisisLink: { fontWeight: '800', textDecorationLine: 'underline' },
  messageList: { paddingHorizontal: 16, paddingVertical: 12 },
  bubble: { flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end' },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  bubbleContent: { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  userContent: { backgroundColor: PRIMARY, borderBottomRightRadius: 4 },
  aiContent: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  userText: { color: '#fff', fontSize: 15, lineHeight: 21 },
  aiText: { color: '#1a1a2e', fontSize: 15, lineHeight: 21 },
  typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  typingText: { color: '#888', fontSize: 13, marginLeft: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#EEF2FF',
  },
  input: {
    flex: 1, backgroundColor: '#F5F8FF', color: '#1a1a2e',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24,
    fontSize: 15, maxHeight: 100, marginRight: 10,
    borderWidth: 1, borderColor: '#DDE8FF',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#B8D0F5' },
});
