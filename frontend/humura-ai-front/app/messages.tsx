import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, SectionList,
  TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Shadows } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';
import { messagesAPI, psychologistsAPI } from '../src/services/api';
import { getSocket } from '../src/services/socket';
import { useAuth } from '../src/contexts/AuthContext';

interface InboxRow {
  other_user_id: number;
  other_user_name: string;
  other_user_role: string;
  profile_picture_url: string | null;
  content: string;
  created_at: string;
  unread_count: number;
}

interface Specialist {
  id: number;
  name: string;
  specialization: string;
  bio: string | null;
  hourly_rate: string | null;
  availability: string | null;
  profile_picture_url: string | null;
  is_approved: boolean;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const diff = Date.now() - date.getTime();
  if (diff < 24 * 3600 * 1000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 48 * 3600 * 1000) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const SPECIALTY_COLORS: Record<string, string> = {
  'Clinical Psychology': '#4a90e2',
  'Counseling Psychology': '#27AE60',
  'Child & Adolescent Psychology': '#F39C12',
  'Trauma & PTSD': '#E74C3C',
  'Sexual & Reproductive Health': '#8E44AD',
  'Anxiety & Depression': '#16A085',
  'Family Therapy': '#D35400',
};
function colorFor(spec: string) {
  return SPECIALTY_COLORS[spec] ?? Colors.primary;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const { user } = useAuth();
  const isKn = language === 'kn';

  const [conversations, setConversations] = useState<InboxRow[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const timer = setTimeout(() => { setLoading(false); setRefreshing(false); }, 6000);
    try {
      const [inboxRes, psyRes] = await Promise.all([
        messagesAPI.inbox(),
        psychologistsAPI.list(),
      ]);
      setConversations(inboxRes.data);
      setSpecialists(psyRes.data);
    } catch {
      // keep existing state on error
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload when tab gains focus
  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Listen for new incoming messages and bump the inbox in real-time
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    const handleNewMsg = (msg: any) => {
      // Only care if the message is for us and from someone else
      if (msg.receiver_id !== user.id) return;
      setConversations(prev => {
        const idx = prev.findIndex(c => c.other_user_id === msg.sender_id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            content: msg.content,
            created_at: msg.created_at,
            unread_count: updated[idx].unread_count + 1,
          };
          // Move to top
          const [item] = updated.splice(idx, 1);
          return [item, ...updated];
        }
        // New conversation — reload fully
        load(true);
        return prev;
      });
    };
    socket.on('new_message', handleNewMsg);
    return () => { socket.off('new_message', handleNewMsg); };
  }, [user?.id, load]);

  const openThread = (userId: number, name: string, role: string) => {
    router.push(`/thread/${userId}?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}` as any);
  };

  // ── render helpers ──────────────────────────────────────────

  const renderSpecialistCard = ({ item }: { item: Specialist }) => {
    const color = colorFor(item.specialization);
    const initials = item.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <TouchableOpacity
        style={styles.specCard}
        activeOpacity={0.85}
        onPress={() => openThread(item.id, item.name, item.specialization)}
      >
        <View style={[styles.specAvatar, { backgroundColor: color + '20', borderColor: color + '40' }]}>
          <Text style={[styles.specInitials, { color }]}>{initials}</Text>
        </View>
        <View style={styles.specBody}>
          <View style={styles.specNameRow}>
            <Text style={styles.specName}>{item.name}</Text>
            {item.is_approved && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.primary} />
                <Text style={styles.verifiedText}>{isKn ? 'Byemejwe' : 'Verified'}</Text>
              </View>
            )}
          </View>
          <View style={[styles.specTag, { backgroundColor: color + '15' }]}>
            <Text style={[styles.specTagText, { color }]}>{item.specialization}</Text>
          </View>
          {item.bio ? (
            <Text style={styles.specBio} numberOfLines={2}>{item.bio}</Text>
          ) : null}
          <View style={styles.specFooter}>
            <View style={styles.specMeta}>
              <Ionicons name="business-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.specMetaText}>
                {isKn ? 'Ikigo Ndangamuntu cya Kigali' : 'Kigali Mental Health Center'}
              </Text>
            </View>
            {item.hourly_rate ? (
              <View style={styles.specMeta}>
                <Ionicons name="card-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.specMetaText}>{item.hourly_rate}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.chatBtn}>
          <Ionicons name="chatbubble" size={18} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderConvRow = ({ item }: { item: InboxRow }) => (
    <TouchableOpacity
      style={styles.convRow}
      activeOpacity={0.8}
      onPress={() => openThread(item.other_user_id, item.other_user_name, item.other_user_role)}
    >
      <View style={styles.convAvatar}>
        <Text style={styles.convAvatarLetter}>{item.other_user_name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.convInfo}>
        <View style={styles.convTop}>
          <Text style={styles.convName}>{item.other_user_name}</Text>
          <Text style={[styles.convTime, item.unread_count > 0 && styles.convTimeUnread]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
        <Text style={styles.convRole}>{item.other_user_role}</Text>
        <Text
          style={[styles.convLastMsg, item.unread_count > 0 && styles.convLastMsgUnread]}
          numberOfLines={1}
        >
          {item.content}
        </Text>
      </View>
      {item.unread_count > 0 && (
        <View style={styles.badge}><Text style={styles.badgeText}>{item.unread_count}</Text></View>
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: { title: string; subtitle?: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.subtitle ? <Text style={styles.sectionSub}>{section.subtitle}</Text> : null}
    </View>
  );

  const sections = [
    {
      title: isKn ? 'Inzobere zibonetse' : 'Explore Specialists',
      subtitle: isKn ? 'Kanda inzobere utangire ikiganiro' : 'Tap a specialist to start a private conversation',
      data: specialists.length > 0 ? specialists : [{ _empty: true } as any],
      renderItem: specialists.length > 0
        ? renderSpecialistCard
        : () => (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={40} color={Colors.tabInactive} />
            <Text style={styles.emptyText}>{isKn ? 'Nta nzobere zabonetse' : 'No specialists onboarded yet'}</Text>
          </View>
        ),
    },
    ...(conversations.length > 0 ? [{
      title: isKn ? 'Ibiganiro byawe' : 'Your Conversations',
      data: conversations,
      renderItem: renderConvRow,
    }] : []),
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isKn ? 'Ubutumwa' : 'Messages'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, i) => (item.id ?? item.other_user_id ?? i).toString()}
          renderItem={({ item, section }: any) => (section as any).renderItem({ item })}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(true); }}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', ...Shadows.soft,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.text },
  list: { paddingBottom: 80 },

  sectionHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: Colors.text },
  sectionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2, fontWeight: '500' },

  // ── Specialist card ──────────────────────────────────────────
  specCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 20, padding: 16, gap: 14,
    borderWidth: 1, borderColor: '#EBF2FA', ...Shadows.soft,
  },
  specAvatar: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5,
  },
  specInitials: { fontSize: 18, fontWeight: '900' },
  specBody: { flex: 1 },
  specNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  specName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#EBF4FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  specTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  specTagText: { fontSize: 11, fontWeight: '800' },
  specBio: { fontSize: 12, color: Colors.textMuted, lineHeight: 17, marginBottom: 8, fontWeight: '500' },
  specFooter: { gap: 4 },
  specMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specMetaText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  chatBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', ...Shadows.soft,
  },

  // ── Conversation row ─────────────────────────────────────────
  convRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 2,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 16, gap: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  convAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  convAvatarLetter: { color: '#fff', fontWeight: '800', fontSize: 18 },
  convInfo: { flex: 1 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  convName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  convTime: { fontSize: 11, color: Colors.textMuted },
  convTimeUnread: { color: Colors.primary, fontWeight: '800' },
  convRole: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginBottom: 3 },
  convLastMsg: { fontSize: 13, color: Colors.textMuted },
  convLastMsgUnread: { fontWeight: '700', color: Colors.text },
  badge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: Colors.textMuted },
});
