import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  SafeAreaView, StatusBar, Dimensions, Animated, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const C = {
  primary:  '#4a90e2',
  mid:      '#357ABD',
  accent:   '#2C5F8F',
  sky:      '#EBF4FF',
  bg:       '#F0F7FF',
  card:     '#FFFFFF',
  text:     '#0D1B2A',
  textMid:  '#37474F',
  textSoft: '#78909C',
  border:   '#DDE8FF',
};

const MOODS = [
  { value: 'amazing', emoji: '🤩', label: 'Amazing', score: 5 },
  { value: 'good',    emoji: '😊', label: 'Good',    score: 4 },
  { value: 'okay',    emoji: '😐', label: 'Okay',    score: 3 },
  { value: 'sad',     emoji: '😢', label: 'Sad',     score: 2 },
  { value: 'awful',   emoji: '😩', label: 'Awful',   score: 1 },
];

const WEEKLY_DATA = [
  { day: 'Mon', score: 4 },
  { day: 'Tue', score: 2 },
  { day: 'Wed', score: 3 },
  { day: 'Thu', score: 5 },
  { day: 'Fri', score: 4 },
  { day: 'Sat', score: 3 },
  { day: 'Sun', score: 0 },
];

const INSIGHTS = [
  { icon: 'trending-up', text: 'Mood improved 40% this week' },
  { icon: 'moon',        text: 'Better mood after good sleep' },
  { icon: 'sunny',       text: 'Morning check-ins score higher' },
  { icon: 'leaf',        text: 'Calm sessions boost mood 30%' },
];

type Entry = { emoji: string; label: string; time: string; note: string };

export default function MoodScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [history, setHistory] = useState<Entry[]>([
    { emoji: '😊', label: 'Good',    time: 'Yesterday · 8:00 PM', note: 'Had a productive day' },
    { emoji: '😐', label: 'Okay',    time: 'Yesterday · 2:00 PM', note: '' },
    { emoji: '🤩', label: 'Amazing', time: '2 days ago',           note: 'Went for a walk outside' },
    { emoji: '😢', label: 'Sad',     time: '3 days ago',           note: 'Feeling disconnected' },
  ]);

  const scaleAnims = useRef(MOODS.map(() => new Animated.Value(1))).current;

  const selectMood = (mood: typeof MOODS[0], i: number) => {
    setSelected(mood.value);
    setShowNote(true);
    Animated.sequence([
      Animated.timing(scaleAnims[i], { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnims[i], { toValue: 1,   duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const saveMood = () => {
    const mood = MOODS.find(m => m.value === selected);
    if (!mood) return;
    const time = `Today · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setHistory(prev => [{ emoji: mood.emoji, label: mood.label, time, note }, ...prev]);
    setNote('');
    setShowNote(false);
    setSelected(null);
  };

  const selectedMood = MOODS.find(m => m.value === selected);
  const maxScore = 5;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <LinearGradient colors={[C.primary, C.accent]} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Mood Tracker</Text>
              <Text style={styles.headerSub}>Track how you feel every day</Text>
            </View>
            <View style={styles.streakBox}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakCount}>5</Text>
              <Text style={styles.streakText}>streak</Text>
            </View>
          </View>
          <View style={styles.statsPills}>
            <View style={styles.pill}>
              <Ionicons name="analytics-outline" size={13} color="rgba(255,255,255,0.9)" />
              <Text style={styles.pillText}>Avg: <Text style={styles.pillBold}>Good</Text></Text>
            </View>
            <View style={styles.pill}>
              <Ionicons name="checkmark-circle-outline" size={13} color="rgba(255,255,255,0.9)" />
              <Text style={styles.pillText}><Text style={styles.pillBold}>6</Text> logs this week</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Today's Check-in */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TODAY'S CHECK-IN</Text>
          <Text style={styles.cardTitle}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((mood, i) => (
              <Animated.View key={mood.value} style={{ transform: [{ scale: scaleAnims[i] }] }}>
                <TouchableOpacity
                  style={[styles.moodBtn, selected === mood.value && styles.moodBtnActive]}
                  onPress={() => selectMood(mood, i)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, selected === mood.value && styles.moodLabelActive]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {showNote && selectedMood && (
            <View style={styles.noteBox}>
              <Text style={styles.notePrompt}>
                {selectedMood.emoji}  Feeling {selectedMood.label} — anything on your mind?
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Write a note... (optional)"
                placeholderTextColor={C.textSoft}
                style={styles.noteInput}
                multiline
                maxLength={200}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={saveMood}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardLabel}>THIS WEEK</Text>
              <Text style={styles.cardTitle}>Mood Overview</Text>
            </View>
          </View>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((d, i) => {
              const h = d.score ? (d.score / maxScore) * 80 : 6;
              const opacity = d.score ? 0.4 + (d.score / maxScore) * 0.6 : 0.15;
              return (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.barWrap}>
                    <View style={[styles.bar, { height: h, opacity }]} />
                  </View>
                  <Text style={[styles.chartDay, !d.score && { color: C.border }]}>{d.day.slice(0, 1)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>INSIGHTS</Text>
          <Text style={styles.cardTitle}>What we noticed</Text>
          {INSIGHTS.map((ins, i) => (
            <View key={i} style={styles.insightRow}>
              <View style={styles.insightIcon}>
                <Ionicons name={ins.icon as any} size={16} color={C.primary} />
              </View>
              <Text style={styles.insightText}>{ins.text}</Text>
            </View>
          ))}
        </View>

        {/* History */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardLabel}>HISTORY</Text>
              <Text style={styles.cardTitle}>Recent Entries</Text>
            </View>
            <Text style={styles.historyCount}>{history.length} entries</Text>
          </View>
          {history.slice(0, 5).map((e, i) => (
            <View key={i} style={[styles.historyRow, i === history.slice(0, 5).length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyEmoji}>{e.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.historyMeta}>
                  <Text style={styles.historyLabel}>{e.label}</Text>
                  <Text style={styles.historyTime}>{e.time}</Text>
                </View>
                {e.note ? <Text style={styles.historyNote}>{e.note}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 100 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 22 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 2 },
  streakBox: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  streakEmoji: { fontSize: 20 },
  streakCount: { fontSize: 18, fontWeight: '800', color: '#fff' },
  streakText: { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  statsPills: { flexDirection: 'row', gap: 10 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, gap: 5 },
  pillText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  pillBold: { fontWeight: '700', color: '#fff' },

  // Card
  card: {
    backgroundColor: C.card, marginHorizontal: 16, marginTop: 14,
    borderRadius: 18, padding: 18,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 0 },
  cardLabel: { fontSize: 10, fontWeight: '700', color: C.primary, letterSpacing: 1, marginBottom: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 16 },

  // Mood picker
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    alignItems: 'center', paddingVertical: 10, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.bg, width: (width - 76) / 5,
  },
  moodBtnActive: { borderColor: C.primary, backgroundColor: C.sky },
  moodEmoji: { fontSize: 26 },
  moodLabel: { fontSize: 9, color: C.textSoft, marginTop: 5, fontWeight: '600' },
  moodLabelActive: { color: C.primary, fontWeight: '700' },

  // Note
  noteBox: { marginTop: 14, backgroundColor: C.bg, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  notePrompt: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 10 },
  noteInput: {
    backgroundColor: C.card, borderRadius: 10, padding: 12,
    fontSize: 14, color: C.text, minHeight: 64,
    borderWidth: 1, borderColor: C.border, marginBottom: 10,
  },
  saveBtn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // Chart
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  chartCol: { alignItems: 'center', flex: 1 },
  barWrap: { height: 88, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 22, borderRadius: 8, backgroundColor: C.primary },
  chartDay: { fontSize: 11, color: C.textSoft, marginTop: 6, fontWeight: '600' },

  // Insights
  insightRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.bg },
  insightIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.sky, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  insightText: { fontSize: 14, color: C.textMid, flex: 1, lineHeight: 20 },

  // History
  historyCount: { fontSize: 12, color: C.textSoft, fontWeight: '600', marginBottom: 16 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.bg },
  historyLeft: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.sky, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  historyEmoji: { fontSize: 20 },
  historyMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  historyLabel: { fontSize: 14, fontWeight: '700', color: C.text },
  historyTime: { fontSize: 11, color: C.textSoft },
  historyNote: { fontSize: 13, color: C.textSoft, lineHeight: 18 },
});
