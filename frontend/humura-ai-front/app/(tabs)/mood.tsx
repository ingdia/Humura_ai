import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4a90e2';
const { width } = Dimensions.get('window');

const MOODS = [
  { value: 'great',   emoji: '😄', label: 'Great',   color: '#4ADE80', score: 5 },
  { value: 'good',    emoji: '😊', label: 'Good',    color: '#60A5FA', score: 4 },
  { value: 'okay',    emoji: '😐', label: 'Okay',    color: '#FBBF24', score: 3 },
  { value: 'sad',     emoji: '😢', label: 'Sad',     color: '#F87171', score: 2 },
  { value: 'angry',   emoji: '😡', label: 'Angry',   color: '#EF4444', score: 1 },
];

const WEEKLY_DATA = [
  { day: 'Mon', score: 4 }, { day: 'Tue', score: 2 }, { day: 'Wed', score: 3 },
  { day: 'Thu', score: 5 }, { day: 'Fri', score: 4 }, { day: 'Sat', score: 3 },
  { day: 'Sun', score: null },
];

const INSIGHTS = [
  { icon: 'trending-up', text: 'Your mood improved 40% this week', color: '#4ADE80' },
  { icon: 'moon', text: 'You feel better after good sleep', color: '#818CF8' },
  { icon: 'sunny', text: 'Morning check-ins show higher scores', color: '#FBBF24' },
];

type MoodEntry = { emoji: string; label: string; color: string; time: string };

export default function MoodScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<MoodEntry[]>([
    { emoji: '😊', label: 'Good', color: '#60A5FA', time: 'Yesterday 8:00 PM' },
    { emoji: '😐', label: 'Okay', color: '#FBBF24', time: 'Yesterday 2:00 PM' },
    { emoji: '😄', label: 'Great', color: '#4ADE80', time: '2 days ago' },
  ]);

  const saveMood = (mood: typeof MOODS[0]) => {
    setSelected(mood.value);
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [{ emoji: mood.emoji, label: mood.label, color: mood.color, time: `Today ${time}` }, ...prev]);
  };

  const maxScore = 5;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FF" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mood Tracker</Text>
          <Text style={styles.headerSub}>How are you feeling today?</Text>
        </View>

        {/* Mood Picker */}
        <View style={styles.card}>
          <View style={styles.moodRow}>
            {MOODS.map(mood => (
              <TouchableOpacity
                key={mood.value}
                style={[styles.moodBtn, selected === mood.value && { borderColor: mood.color, borderWidth: 2, backgroundColor: mood.color + '20' }]}
                onPress={() => saveMood(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, selected === mood.value && { color: mood.color, fontWeight: '700' }]}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {selected && (
            <View style={styles.savedRow}>
              <Ionicons name="checkmark-circle" size={16} color="#4ADE80" />
              <Text style={styles.savedText}>Mood saved for today</Text>
            </View>
          )}
        </View>

        {/* Weekly Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((d, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={styles.barContainer}>
                  {d.score ? (
                    <View style={[styles.bar, { height: (d.score / maxScore) * 80, backgroundColor: PRIMARY }]} />
                  ) : (
                    <View style={[styles.bar, { height: 6, backgroundColor: '#E0E0E0' }]} />
                  )}
                </View>
                <Text style={styles.chartDay}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Insights</Text>
          {INSIGHTS.map((ins, i) => (
            <View key={i} style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: ins.color + '20' }]}>
                <Ionicons name={ins.icon as any} size={18} color={ins.color} />
              </View>
              <Text style={styles.insightText}>{ins.text}</Text>
            </View>
          ))}
        </View>

        {/* History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent History</Text>
          {history.slice(0, 5).map((entry, i) => (
            <View key={i} style={[styles.historyItem, { borderLeftColor: entry.color }]}>
              <Text style={styles.historyEmoji}>{entry.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyLabel}>{entry.label}</Text>
                <Text style={styles.historyTime}>{entry.time}</Text>
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
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  scroll: { paddingBottom: 20 },
  header: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e' },
  headerSub: { fontSize: 15, color: '#666', marginTop: 4 },
  card: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, padding: 20,
    shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    alignItems: 'center', padding: 10, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#EEF2FF', width: (width - 80) / 5,
  },
  moodEmoji: { fontSize: 26 },
  moodLabel: { fontSize: 11, color: '#888', marginTop: 4, fontWeight: '500' },
  savedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, justifyContent: 'center' },
  savedText: { color: '#4ADE80', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  chartCol: { alignItems: 'center', flex: 1 },
  barContainer: { height: 90, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 22, borderRadius: 8 },
  chartDay: { fontSize: 11, color: '#888', marginTop: 6, fontWeight: '600' },
  insightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  insightIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  insightText: { fontSize: 14, color: '#444', flex: 1, lineHeight: 20 },
  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 8, marginBottom: 8,
    backgroundColor: '#F9FBFF', borderRadius: 8,
  },
  historyEmoji: { fontSize: 22, marginRight: 12 },
  historyLabel: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  historyTime: { fontSize: 12, color: '#999', marginTop: 2 },
});
