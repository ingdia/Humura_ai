import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../src/constants/theme';

export default function ThreadScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [text, setText] = useState('');
  
  const [messages, setMessages] = useState([
    { id: '1', sender: 'specialist', text: 'Hello! I received your request. How can I help you today?', time: '10:00 AM' },
    { id: '2', sender: 'user', text: 'Hi, I need someone to talk to about my anxiety.', time: '10:05 AM' },
    { id: '3', sender: 'specialist', text: 'I am here for you. Is there something specific on your mind?', time: '10:06 AM' }
  ]);

  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'user', text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Dr. Amina Uwase</Text>
          <Text style={styles.headerSub}>Clinical Psychologist</Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {messages.map(m => (
            <View key={m.id} style={[styles.bubbleWrap, m.sender === 'user' ? styles.bubbleWrapUser : styles.bubbleWrapSpecialist]}>
              <View style={[styles.bubble, m.sender === 'user' ? styles.bubbleUser : styles.bubbleSpecialist]}>
                <Text style={[styles.bubbleText, m.sender === 'user' ? styles.bubbleTextUser : styles.bubbleTextSpecialist]}>{m.text}</Text>
              </View>
              <Text style={styles.time}>{m.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput 
            style={styles.input} 
            placeholder="Type your message..." 
            value={text} 
            onChangeText={setText} 
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 40, backgroundColor: '#fff', ...Shadows.soft },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  headerSub: { fontSize: 12, color: Colors.textMuted },
  callBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' },
  
  scroll: { padding: 20, paddingBottom: 40 },
  bubbleWrap: { maxWidth: '80%', marginBottom: 16 },
  bubbleWrapUser: { alignSelf: 'flex-end' },
  bubbleWrapSpecialist: { alignSelf: 'flex-start' },
  
  bubble: { padding: 16, borderRadius: 20 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleSpecialist: { backgroundColor: '#fff', borderBottomLeftRadius: 4, ...Shadows.soft },
  
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextSpecialist: { color: Colors.text },
  
  time: { fontSize: 11, color: Colors.textMuted, marginTop: 4, marginHorizontal: 8 },
  
  inputArea: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'flex-end', gap: 12 },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, maxHeight: 100, fontSize: 15, color: Colors.text },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
