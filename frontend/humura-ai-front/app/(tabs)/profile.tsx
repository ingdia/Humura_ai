import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Switch,
  Linking, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/contexts/AuthContext';

const C = {
  primary:  '#4a90e2',
  mid:      '#357ABD',
  light:    '#7BB3E8',
  accent:   '#2C5F8F',
  sky:      '#EBF4FF',
  bg:       '#F0F7FF',
  card:     '#FFFFFF',
  text:     '#0D1B2A',
  textMid:  '#37474F',
  textSoft: '#78909C',
};

type Slot = { time: string; available: boolean };

type Therapist = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  sessions: number;
  price: string;
  meetLink: string;
  slots: Slot[];
};

const THERAPISTS: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Amina Uwase',
    specialty: 'Anxiety & Depression',
    rating: 4.9,
    sessions: 120,
    price: 'Free (subsidized)',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    slots: [
      { time: 'Today  9:00 AM',  available: true  },
      { time: 'Today  11:00 AM', available: false },
      { time: 'Today  2:00 PM',  available: true  },
      { time: 'Tomorrow 10:00 AM', available: true },
    ],
  },
  {
    id: '2',
    name: 'Dr. Jean Habimana',
    specialty: 'Trauma & PTSD',
    rating: 4.8,
    sessions: 95,
    price: '2,000 RWF',
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    slots: [
      { time: 'Today  10:00 AM', available: false },
      { time: 'Today  3:00 PM',  available: true  },
      { time: 'Tomorrow 9:00 AM', available: true  },
      { time: 'Tomorrow 1:00 PM', available: false },
    ],
  },
  {
    id: '3',
    name: 'Dr. Grace Mutoni',
    specialty: 'Family & Relationships',
    rating: 4.7,
    sessions: 78,
    price: '1,500 RWF',
    meetLink: 'https://meet.google.com/uvw-xyz1-234',
    slots: [
      { time: 'Today  4:00 PM',    available: false },
      { time: 'Tomorrow 11:00 AM', available: true  },
      { time: 'Tomorrow 3:00 PM',  available: true  },
      { time: 'Thu  9:00 AM',      available: true  },
    ],
  },
];

const STATS = [
  { label: 'Days Active',   value: '14',  icon: 'calendar',  color: '#4CAF50' },
  { label: 'Mood Logs',     value: '11',  icon: 'analytics', color: C.mid },
  { label: 'Calm Sessions', value: '6',   icon: 'leaf',      color: '#0288D1' },
  { label: 'Streak',        value: '5🔥', icon: 'flame',     color: '#FFC107' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications]   = useState(true);
  const [anonymous, setAnonymous]           = useState(true);
  const [dailyReminder, setDailyReminder]   = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [bookedSlot, setBookedSlot]         = useState<{ therapistId: string; slot: string } | null>(null);

  const openMeet = async (therapist: Therapist, slot: string) => {
    setSelectedTherapist(null);
    setBookedSlot({ therapistId: therapist.id, slot });

    const canOpen = await Linking.canOpenURL(therapist.meetLink);
    if (canOpen) {
      await Linking.openURL(therapist.meetLink);
    } else {
      // Fallback: open Google Meet in browser
      await Linking.openURL(`https://meet.google.com`);
    }
  };

  const confirmBook = (therapist: Therapist, slot: Slot) => {
    if (!slot.available) return;
    Alert.alert(
      'Confirm Booking',
      `Book ${slot.time} with ${therapist.name}?\n\nA Google Meet link will open for your session.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book & Open Meet', onPress: () => openMeet(therapist, slot.time) },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Slot Picker Modal */}
      <Modal visible={!!selectedTherapist} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTherapist?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedTherapist(null)}>
                <Ionicons name="close" size={22} color={C.textMid} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>Select an available time slot</Text>

            {selectedTherapist?.slots.map((slot, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.slotBtn, !slot.available && styles.slotBtnBusy]}
                onPress={() => selectedTherapist && confirmBook(selectedTherapist, slot)}
                disabled={!slot.available}
              >
                <View style={styles.slotLeft}>
                  <Ionicons
                    name={slot.available ? 'time' : 'time-outline'}
                    size={18}
                    color={slot.available ? C.primary : C.textSoft}
                  />
                  <Text style={[styles.slotTime, !slot.available && styles.slotTimeBusy]}>
                    {slot.time}
                  </Text>
                </View>
                <View style={[styles.slotBadge, !slot.available && styles.slotBadgeBusy]}>
                  <Text style={[styles.slotBadgeText, !slot.available && styles.slotBadgeTextBusy]}>
                    {slot.available ? 'Available' : 'Booked'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.meetNote}>
              <Ionicons name="videocam" size={16} color={C.primary} />
              <Text style={styles.meetNoteText}>Session opens in Google Meet</Text>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Header */}
        <LinearGradient colors={[C.primary, C.accent]} style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color="#fff" />
          </View>
          <Text style={styles.username}>{user?.name || 'Anonymous User'}</Text>
          <Text style={styles.userSub}>Your journey is private & safe 🌿</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Teleconsultation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book a Therapist</Text>
          <Text style={styles.sectionSub}>Tap a therapist to see availability & join via Google Meet</Text>

          {THERAPISTS.map(t => {
            const isBooked = bookedSlot?.therapistId === t.id;
            const availableCount = t.slots.filter(s => s.available).length;

            return (
              <View key={t.id} style={styles.therapistCard}>
                <View style={styles.therapistTop}>
                  <View style={styles.therapistAvatar}>
                    <Ionicons name="person" size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.therapistName}>{t.name}</Text>
                    <Text style={styles.therapistSpec}>{t.specialty}</Text>
                    <View style={styles.therapistMeta}>
                      <Ionicons name="star" size={12} color="#FFC107" />
                      <Text style={styles.metaText}>{t.rating}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaText}>{t.sessions} sessions</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={[styles.metaText, { color: C.primary, fontWeight: '700' }]}>{t.price}</Text>
                    </View>
                  </View>
                </View>

                {/* Availability preview */}
                <View style={styles.availRow}>
                  <View style={[styles.availDot, { backgroundColor: availableCount > 0 ? '#4CAF50' : '#EF5350' }]} />
                  <Text style={styles.availText}>
                    {availableCount > 0 ? `${availableCount} slots available` : 'No slots today'}
                  </Text>
                </View>

                {/* Action buttons */}
                <View style={styles.therapistActions}>
                  <TouchableOpacity
                    style={[styles.viewSlotsBtn, isBooked && styles.viewSlotsBtnBooked]}
                    onPress={() => setSelectedTherapist(t)}
                  >
                    <Ionicons name="calendar" size={15} color={isBooked ? '#fff' : C.primary} />
                    <Text style={[styles.viewSlotsBtnText, isBooked && { color: '#fff' }]}>
                      {isBooked ? `✓ Booked — ${bookedSlot?.slot}` : 'View Availability'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.meetBtn}
                    onPress={() => Linking.openURL(t.meetLink)}
                  >
                    <Ionicons name="videocam" size={15} color="#fff" />
                    <Text style={styles.meetBtnText}>Meet</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { label: 'Push Notifications',  icon: 'notifications', value: notifications,   set: setNotifications },
            { label: 'Stay Anonymous',       icon: 'eye-off',       value: anonymous,       set: setAnonymous },
            { label: 'Daily Mood Reminder',  icon: 'alarm',         value: dailyReminder,   set: setDailyReminder },
          ].map((s, i) => (
            <View key={i} style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name={s.icon as any} size={18} color={C.primary} />
                </View>
                <Text style={styles.settingText}>{s.label}</Text>
              </View>
              <Switch
                value={s.value}
                onValueChange={s.set}
                trackColor={{ false: '#E0E0E0', true: C.light }}
                thumbColor={s.value ? C.primary : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {[
            { label: 'Help & FAQ',           icon: 'help-circle',        onPress: () => {} },
            { label: 'About Humura',         icon: 'information-circle', onPress: () => {} },
            { label: 'Crisis Helpline: 116', icon: 'call',               onPress: () => Linking.openURL('tel:116'), color: '#EF5350' },
            { label: 'Logout',               icon: 'log-out-outline',    onPress: handleLogout, color: '#EF5350' },
          ].map((o, i) => (
            <TouchableOpacity key={i} style={styles.optionRow} onPress={o.onPress}>
              <View style={styles.settingIcon}>
                <Ionicons name={o.icon as any} size={18} color={o.color ?? C.primary} />
              </View>
              <Text style={[styles.settingText, { flex: 1 }, o.color && { color: o.color }]}>{o.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 100 },

  // Profile Header
  profileHeader: { alignItems: 'center', paddingTop: 36, paddingBottom: 28 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  username: { fontSize: 20, fontWeight: '800', color: '#fff' },
  userSub: { fontSize: 14, color: 'rgba(255,255,255,0.82)', marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginTop: 16, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 12, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  statIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: C.textSoft, textAlign: 'center', marginTop: 2, fontWeight: '500' },

  // Section
  section: { marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card, borderRadius: 20, padding: 20, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 4 },
  sectionSub: { fontSize: 13, color: C.textSoft, marginBottom: 16, lineHeight: 18 },

  // Therapist Card
  therapistCard: { borderBottomWidth: 1, borderBottomColor: '#EEF4FF', paddingVertical: 16 },
  therapistTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  therapistAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  therapistName: { fontSize: 15, fontWeight: '700', color: C.text },
  therapistSpec: { fontSize: 12, color: C.textSoft, marginTop: 2 },
  therapistMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: C.textMid, marginLeft: 3 },
  metaDot: { fontSize: 11, color: '#ccc', marginHorizontal: 3 },
  availRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  availDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  availText: { fontSize: 13, color: C.textMid, fontWeight: '500' },
  therapistActions: { flexDirection: 'row', gap: 10 },
  viewSlotsBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: C.primary, gap: 6 },
  viewSlotsBtnBooked: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  viewSlotsBtnText: { fontSize: 13, fontWeight: '700', color: C.primary },
  meetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: C.primary, gap: 6 },
  meetBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Settings
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF4FF' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.sky, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingText: { fontSize: 15, color: C.text, fontWeight: '500' },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF4FF' },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: C.text },
  modalSub: { fontSize: 13, color: C.textSoft, marginBottom: 20 },
  slotBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1.5, borderColor: C.primary, marginBottom: 10, backgroundColor: C.sky },
  slotBtnBusy: { borderColor: '#E0E0E0', backgroundColor: '#FAFAFA' },
  slotLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slotTime: { fontSize: 15, fontWeight: '600', color: C.text },
  slotTimeBusy: { color: C.textSoft },
  slotBadge: { backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  slotBadgeBusy: { backgroundColor: '#E0E0E0' },
  slotBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  slotBadgeTextBusy: { color: C.textSoft },
  meetNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 },
  meetNoteText: { fontSize: 13, color: C.primary, fontWeight: '600' },
});
