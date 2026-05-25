import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, SectionList,
  TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl,
  Modal, ScrollView, Alert, Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Shadows } from '../src/constants/theme';
import { useLanguage } from '../src/contexts/LanguageContext';
import { messagesAPI, psychologistsAPI, appointmentsAPI } from '../src/services/api';
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
  const isPatient = !user?.role || user?.role !== 'PSYCHOLOGIST';

  const [conversations, setConversations] = useState<InboxRow[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Booking
  const [bookingSpecialist, setBookingSpecialist] = useState<Specialist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

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

  // Generate next 3 days of morning + afternoon slots
  const buildSlots = () => {
    const slots: { label: string; iso: string }[] = [];
    for (let d = 1; d <= 3; d++) {
      const day = new Date();
      day.setDate(day.getDate() + d);
      const label = day.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
      for (const [h, suffix] of [[9, 'AM'], [11, 'AM'], [14, 'PM'], [16, 'PM']] as [number, string][]) {
        day.setHours(h, 0, 0, 0);
        slots.push({ label: `${label} · ${h <= 12 ? h : h - 12}:00 ${suffix}`, iso: day.toISOString() });
      }
    }
    return slots;
  };

  const handleBook = async () => {
    if (!bookingSpecialist || !selectedSlot) return;
    setBooking(true);
    try {
      await appointmentsAPI.book(bookingSpecialist.id, selectedSlot);
      setBookingSpecialist(null);
      setSelectedSlot(null);
      Alert.alert(
        isKn ? 'Ibisabwa byoherejwe!' : 'Request Sent!',
        isKn
          ? `Ubusabe bwawe bwa ${bookingSpecialist.name} bwakiriwe. Azakwemeza vuba.`
          : `Your booking request with ${bookingSpecialist.name} has been sent. They will confirm shortly.`
      );
    } catch {
      Alert.alert(isKn ? 'Byanze' : 'Failed', isKn ? 'Ongera ugerageze.' : 'Could not send request. Try again.');
    } finally {
      setBooking(false);
    }
  };

  const openThread = (userId: number, name: string, role: string) => {
    router.push(`/thread/${userId}?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}` as any);
  };

  // ── render helpers ──────────────────────────────────────────

  const renderSpecialistCard = ({ item }: { item: Specialist }) => {
    const color = colorFor(item.specialization);
    const initials = item.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (
      <View style={styles.specCard}>
        {/* Avatar / photo */}
        {item.profile_picture_url ? (
          <Image
            source={{ uri: item.profile_picture_url }}
            style={[styles.specAvatar, styles.specAvatarImg]}
          />
        ) : (
          <View style={[styles.specAvatar, { backgroundColor: color + '20', borderColor: color + '40' }]}>
            <Text style={[styles.specInitials, { color }]}>{initials}</Text>
          </View>
        )}

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
        </View>

        <View style={styles.specActions}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => { setBookingSpecialist(item); setSelectedSlot(null); }}
          >
            <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => openThread(item.id, item.name, item.specialization)}
          >
            <Ionicons name="chatbubble" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
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
    ...(isPatient ? [{
      title: isKn ? 'Inzobere zibonetse' : 'Explore Specialists',
      subtitle: isKn ? 'Kanda inzobere utangire ikiganiro bwite' : 'Tap to start a private, safe conversation',
      data: specialists.length > 0 ? specialists : [{ _empty: true } as any],
      renderItem: specialists.length > 0
        ? renderSpecialistCard
        : () => (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={40} color={Colors.tabInactive} />
            <Text style={styles.emptyText}>{isKn ? 'Nta nzobere zabonetse' : 'No specialists onboarded yet'}</Text>
          </View>
        ),
    }] : []),
    ...(conversations.length > 0 ? [{
      title: isKn ? 'Ibiganiro byawe' : 'Your Conversations',
      subtitle: isKn ? 'Ibiganiro byawe bya vuba aha' : 'Your recent message threads',
      data: conversations,
      renderItem: renderConvRow,
    }] : []),
    ...(conversations.length === 0 && !loading ? [{
      title: isKn ? 'Ibiganiro byawe' : 'Your Conversations',
      data: [{ _noConvs: true } as any],
      renderItem: () => (
        <View style={styles.emptyBox}>
          <Ionicons name="chatbubbles-outline" size={40} color={Colors.tabInactive} />
          <Text style={styles.emptyText}>{isKn ? 'Nta biganiro kandi' : 'No conversations yet'}</Text>
          <Text style={styles.emptySubText}>{isKn ? 'Tangira ikiganiro na inzobere' : 'Pick a specialist above to get started'}</Text>
        </View>
      ),
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

      {/* ── Booking modal ── */}
      <Modal visible={!!bookingSpecialist} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.bookModal}>
            <View style={styles.bookModalHeader}>
              <Text style={styles.bookModalTitle}>
                {isKn ? 'Saba Igihe' : 'Book a Session'}
              </Text>
              <TouchableOpacity onPress={() => setBookingSpecialist(null)}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>
            {bookingSpecialist && (
              <Text style={styles.bookModalSub}>
                {isKn ? 'Na' : 'With'} <Text style={{ fontWeight: '800', color: Colors.text }}>{bookingSpecialist.name}</Text>
                {' · '}{bookingSpecialist.specialization}
              </Text>
            )}
            <Text style={styles.bookModalLabel}>{isKn ? 'Hitamo igihe:' : 'Pick a time slot:'}</Text>
            <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
              {buildSlots().map(slot => (
                <TouchableOpacity
                  key={slot.iso}
                  style={[styles.slotRow, selectedSlot === slot.iso && styles.slotRowActive]}
                  onPress={() => setSelectedSlot(slot.iso)}
                >
                  <Ionicons
                    name={selectedSlot === slot.iso ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={selectedSlot === slot.iso ? Colors.primary : Colors.textMuted}
                  />
                  <Text style={[styles.slotText, selectedSlot === slot.iso && styles.slotTextActive]}>
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.bookConfirmBtn, (!selectedSlot || booking) && { opacity: 0.5 }]}
              onPress={handleBook}
              disabled={!selectedSlot || booking}
            >
              {booking
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.bookConfirmText}>{isKn ? 'Ohereza Ubusabe' : 'Send Request'}</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5,
  },
  specAvatarImg: { borderWidth: 0, overflow: 'hidden' },
  specInitials: { fontSize: 20, fontWeight: '900' },
  specBody: { flex: 1 },
  specNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  specName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#EBF4FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  verifiedText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  specTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 },
  specTagText: { fontSize: 11, fontWeight: '800' },
  specBio: { fontSize: 12, color: Colors.textMuted, lineHeight: 17, fontWeight: '500' },
  specActions: { flexDirection: 'column', gap: 8, alignSelf: 'center' },
  bookBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#EBF4FF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#D4E6FC',
  },
  chatBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    ...Shadows.soft,
  },

  // Booking modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  bookModal: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
  },
  bookModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  bookModalTitle: { fontSize: 20, fontWeight: '900', color: Colors.text },
  bookModalSub: { fontSize: 13, color: Colors.textMuted, fontWeight: '600', marginBottom: 20 },
  bookModalLabel: { fontSize: 13, fontWeight: '800', color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 10 },
  slotRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 8,
  },
  slotRowActive: { borderColor: Colors.primary, backgroundColor: '#F0F7FF' },
  slotText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  slotTextActive: { color: Colors.primary, fontWeight: '800' },
  bookConfirmBtn: {
    marginTop: 16, backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', ...Shadows.soft,
  },
  bookConfirmText: { color: '#fff', fontSize: 16, fontWeight: '800' },

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
  emptySubText: { fontSize: 13, color: Colors.tabInactive, fontWeight: '500', textAlign: 'center', paddingHorizontal: 20 },
});
