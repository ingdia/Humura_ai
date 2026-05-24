import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, TextInput, KeyboardAvoidingView, Platform, StatusBar, Alert
} from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfessional, ChatSession } from '../../src/contexts/ProfessionalContext';

export default function ProfessionalInbox() {
  const { chats, sendMessageToChat, profile } = useProfessional();
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Sync modal state if chat data changes while modal is open
  useEffect(() => {
    if (selectedChat) {
      const updatedChat = chats.find(c => c.patientName === selectedChat.patientName);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    }
  }, [chats, selectedChat]);

  // Scroll to bottom on open or new messages
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedChat?.messages, isTyping]);

  const handleSend = () => {
    if (!typedText || !typedText.trim() || !selectedChat) return;

    const patientName = selectedChat.patientName;
    const textToSend = typedText.trim();
    
    sendMessageToChat(patientName, textToSend);
    setTypedText('');

    // Trigger typing simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="chatbubbles" size={18} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Patient Messages</Text>
        </View>
        <View style={styles.titleUnderline} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionSubtitle}>Recent Inquiries</Text>
        
        {chats.map((chat, idx) => (
          <View key={chat.patientName}>
            <TouchableOpacity 
              style={styles.chatRow}
              activeOpacity={0.8}
              onPress={() => setSelectedChat(chat)}
            >
              <View style={styles.avatarContainer}>
                <View style={[styles.avatarCircle, { backgroundColor: idx % 2 === 0 ? '#E8F4FD' : '#EAF7EE' }]}>
                  <Text style={[styles.avatarText, { color: idx % 2 === 0 ? Colors.primary : Colors.positive }]}>
                    {chat.avatarLetter}
                  </Text>
                </View>
                {chat.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.patientName}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <View style={styles.chatFooter}>
                  <Text style={[
                    styles.chatSnippet, 
                    chat.unreadCount > 0 && { color: Colors.text, fontWeight: '700' }
                  ]} numberOfLines={1}>
                    {chat.snippet}
                  </Text>
                  {chat.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {idx < chats.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>

      {/* CHAT MODAL */}
      <Modal 
        visible={!!selectedChat} 
        animationType="slide" 
        onRequestClose={() => setSelectedChat(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setSelectedChat(null)} 
              style={styles.modalBackBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalHeaderTitle}>{selectedChat?.patientName}</Text>
              <View style={styles.modalStatusRow}>
                <View style={[styles.statusDot, { backgroundColor: selectedChat?.online ? Colors.positive : Colors.tabInactive }]} />
                <Text style={styles.modalHeaderSub}>
                  {selectedChat?.online ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.modalCallBtn}
              onPress={() => Alert.alert("Call Patient", "Voice consults can be initiated via scheduling. Please send a message to coordinate a virtual room slot.")}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.anonymousBanner}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.primary} />
                <Text style={styles.anonymousBannerText}>
                  This connection is fully encrypted. Support provided is public and certified.
                </Text>
              </View>

              {selectedChat?.messages.map(msg => (
                <View 
                  key={msg.id} 
                  style={[
                    styles.bubbleWrap, 
                    msg.sender === 'specialist' ? styles.bubbleWrapDoctor : styles.bubbleWrapPatient
                  ]}
                >
                  <View style={[
                    styles.bubble, 
                    msg.sender === 'specialist' ? styles.bubbleDoctor : styles.bubblePatient
                  ]}>
                    <Text style={[
                      styles.bubbleText, 
                      msg.sender === 'specialist' ? styles.bubbleTextDoctor : styles.bubbleTextPatient
                    ]}>
                      {msg.text}
                    </Text>
                  </View>
                  <Text style={styles.bubbleTime}>{msg.time}</Text>
                </View>
              ))}

              {isTyping && (
                <View style={[styles.bubbleWrap, styles.bubbleWrapPatient]}>
                  <View style={[styles.bubble, styles.bubblePatient, styles.typingBubble]}>
                    <Text style={[styles.bubbleText, { color: Colors.textMuted }]}>Typing...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputArea}>
              <TextInput 
                style={styles.input} 
                placeholder={`Reply as ${profile.name}...`} 
                placeholderTextColor={Colors.tabInactive}
                value={typedText} 
                onChangeText={setTypedText} 
                multiline
              />
              <TouchableOpacity 
                style={[
                  styles.sendBtn, 
                  (!typedText || !typedText.trim()) && { backgroundColor: Colors.tabInactive }
                ]} 
                onPress={handleSend}
                disabled={!typedText || !typedText.trim()}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    ...Shadows.soft,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.positive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  titleUnderline: {
    width: 32,
    height: 4,
    backgroundColor: Colors.positive,
    borderRadius: 2,
    marginTop: 8,
  },
  container: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  chatRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F3F6',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.positive,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.tabInactive,
    fontWeight: '600',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatSnippet: {
    fontSize: 14,
    color: Colors.textMuted,
    flex: 1,
    paddingRight: Spacing.sm,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F6FA',
    marginLeft: 66,
  },
  
  // MODAL STYLING
  modalSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F6',
    ...Shadows.soft,
  },
  modalBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  modalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalHeaderSub: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  modalCallBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  anonymousBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    padding: 12,
    borderRadius: Border.radius,
    marginBottom: Spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: '#D4E6FC',
  },
  anonymousBannerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  bubbleWrap: {
    maxWidth: '82%',
    marginBottom: 16,
  },
  bubbleWrapDoctor: {
    alignSelf: 'flex-end',
  },
  bubbleWrapPatient: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 14,
    borderRadius: Border.radiusLg,
  },
  bubbleDoctor: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    ...Shadows.soft,
  },
  bubblePatient: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    ...Shadows.soft,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  bubbleTextDoctor: {
    color: Colors.white,
  },
  bubbleTextPatient: {
    color: Colors.text,
  },
  bubbleTime: {
    fontSize: 10,
    color: Colors.tabInactive,
    marginTop: 4,
    marginHorizontal: 8,
    fontWeight: '600',
  },
  typingBubble: {
    opacity: 0.75,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F6',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: Border.radiusLg,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    fontWeight: '500',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
});
