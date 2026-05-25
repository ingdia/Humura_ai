import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { messagesAPI } from '../../src/services/api';

interface InboxRow {
  other_user_id: number;
  other_user_name: string;
  other_user_role: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  unread_count: number;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 24 * 3600 * 1000) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 48 * 3600 * 1000) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ProfessionalInbox() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [conversations, setConversations] = useState<InboxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadInbox = useCallback(async () => {
    try {
      const res = await messagesAPI.inbox();
      setConversations(res.data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload whenever the tab gains focus (e.g., after returning from a thread)
  useFocusEffect(useCallback(() => {
    setLoading(true);
    loadInbox();
  }, [loadInbox]));

  const onRefresh = () => {
    setRefreshing(true);
    loadInbox();
  };

  const openThread = (userId: number, name: string, role: string) => {
    router.push(
      `/thread/${userId}?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}` as any
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="chatbubbles" size={18} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>{t('pro_patient_messages')}</Text>
          </View>
        </View>
        <View style={styles.titleUnderline} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
          <Text style={styles.sectionSubtitle}>{t('pro_recent_inquiries')}</Text>

          {conversations.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.tabInactive} />
              <Text style={styles.emptyText}>
                {language === 'kn' ? 'Nta biganiro bihari' : 'No messages yet'}
              </Text>
              <Text style={styles.emptySubText}>
                {language === 'kn'
                  ? 'Abakiriya bazabaza hano.'
                  : 'Patient inquiries will appear here.'}
              </Text>
            </View>
          ) : (
            conversations.map((conv, idx) => (
              <View key={conv.other_user_id}>
                <TouchableOpacity
                  style={styles.chatRow}
                  activeOpacity={0.8}
                  onPress={() => openThread(conv.other_user_id, conv.other_user_name, conv.other_user_role)}
                >
                  <View style={styles.avatarContainer}>
                    <View style={[styles.avatarCircle, { backgroundColor: idx % 2 === 0 ? '#E8F4FD' : '#EAF7EE' }]}>
                      <Text style={[styles.avatarText, { color: idx % 2 === 0 ? Colors.primary : Colors.positive }]}>
                        {conv.other_user_name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName}>{conv.other_user_name}</Text>
                      <Text style={styles.chatTime}>{formatTime(conv.created_at)}</Text>
                    </View>
                    <View style={styles.chatFooter}>
                      <Text
                        style={[styles.chatSnippet, conv.unread_count > 0 && { color: Colors.text, fontWeight: '700' }]}
                        numberOfLines={1}
                      >
                        {conv.content}
                      </Text>
                      {conv.unread_count > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{conv.unread_count}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {idx < conversations.length - 1 && <View style={styles.divider} />}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16,
    backgroundColor: Colors.white, ...Shadows.soft,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  langToggle: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 12, backgroundColor: '#E8F4FD',
    borderWidth: 1, borderColor: '#D2E6F9',
  },
  langText: { color: Colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
  titleUnderline: { width: 32, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 8 },
  container: { padding: Spacing.md, paddingBottom: 100 },
  sectionSubtitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 16, letterSpacing: 0.2 },
  chatRow: {
    flexDirection: 'row', paddingVertical: Spacing.md,
    alignItems: 'center', backgroundColor: Colors.white,
  },
  avatarContainer: { position: 'relative', marginRight: Spacing.md },
  avatarCircle: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#F0F3F6',
  },
  avatarText: { fontSize: 20, fontWeight: '800' },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  chatTime: { fontSize: 12, color: Colors.tabInactive, fontWeight: '600' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatSnippet: {
    fontSize: 14, color: Colors.textMuted,
    flex: 1, paddingRight: Spacing.sm, fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Colors.primary, borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 5,
  },
  unreadText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#F3F6FA', marginLeft: 66 },
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptySubText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
});
