import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width } = Dimensions.get('window');

const MOODS = [
  { id: '1', emoji: '🌟', label: 'Amazing', color: '#FFD700', labelK: 'Nishimye', score: 5 },
  { id: '2', emoji: '🙂', label: 'Good',    color: '#4CAF50', labelK: 'Meze neza', score: 4 },
  { id: '3', emoji: '😐', label: 'Okay',    color: '#FF9800', labelK: 'Ndasanzwe', score: 3 },
  { id: '4', emoji: '😔', label: 'Down',    color: '#2196F3', labelK: 'Ndi mu gahinda', score: 2 },
  { id: '5', emoji: '😫', label: 'Stressed', color: '#F44336', labelK: 'Naniwe', score: 1 },
];

const WEEKLY_DATA = [
  { day: 'Mon', score: 4 },
  { day: 'Tue', score: 5 },
  { day: 'Wed', score: 3 },
  { day: 'Thu', score: 4 },
  { day: 'Fri', score: 2 },
  { day: 'Sat', score: 5 },
  { day: 'Sun', score: 5 },
];

export default function MoodScreen() {
  const { t, language } = useLanguage();
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const activeMood = MOODS.find(m => m.id === selectedMoodId);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Header - Aligned with Calm/Community */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t('mood_title')}</Text>
            <Text style={styles.headerSub}>{language === 'en' ? 'Track your emotional journey.' : 'Kurikirana uko umerewe.'}</Text>
          </View>
          <View style={styles.titleUnderline} />
        </View>

        {/* Weekly Trend Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{language === 'en' ? 'Weekly Trend' : 'Imiterere y’icyumweru'}</Text>
            <View style={styles.insightBadge}>
              <Text style={styles.insightText}>+12% Stable</Text>
            </View>
          </View>
          <View style={styles.chartRow}>
            {WEEKLY_DATA.map((d, i) => {
              const height = (d.score / 5) * 60;
              return (
                <View key={i} style={styles.chartCol}>
                  <View style={[styles.chartBar, { height, backgroundColor: d.score > 3 ? '#4CAF50' : d.score === 3 ? '#FF9800' : '#F44336' }]} />
                  <Text style={styles.chartDay}>{d.day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#4CAF50' }]} /><Text style={styles.legendText}>Good</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#FF9800' }]} /><Text style={styles.legendText}>Okay</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: '#F44336' }]} /><Text style={styles.legendText}>Bad</Text></View>
          </View>
        </View>

        {/* Mood Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('how_feeling')}</Text>
          <View style={styles.moodGrid}>
            {MOODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.moodBox,
                  selectedMoodId === m.id && { backgroundColor: m.color + '15', borderColor: m.color, borderWidth: 2 }
                ]}
                onPress={() => setSelectedMoodId(m.id)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMoodId === m.id && { color: m.color, fontWeight: '800' }]}>
                  {language === 'en' ? m.label : m.labelK}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{language === 'en' ? 'What happened?' : 'Byagenze bite?'}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={language === 'en' ? "Add a small note..." : "Andika ikiri kumutima..."}
            placeholderTextColor={Colors.textMuted}
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.88}>
          <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.saveGrad}>
            <Text style={styles.saveText}>{language === 'en' ? 'Save Entry' : 'Bika amakuru'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Detailed History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Mood History' : 'Amateka'}</Text>
          {[
            { date: 'Today, 2:30 PM', moodId: '1', note: 'Feeling great after the morning session!', type: 'Good' },
            { date: 'Yesterday, 8:00 PM', moodId: '3', note: 'A bit tired but stable.', type: 'Okay' },
            { date: 'May 6, 11:00 AM', moodId: '5', note: 'Heavy traffic and stress at work.', type: 'Bad' },
          ].map((item, i) => {
            const mood = MOODS.find(m => m.id === item.moodId);
            const statusColor = item.type === 'Good' ? '#4CAF50' : item.type === 'Okay' ? '#FF9800' : '#F44336';
            return (
              <View key={i} style={styles.historyCard}>
                <View style={[styles.statusLine, { backgroundColor: statusColor }]} />
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                      <Text style={[styles.statusTextSmall, { color: statusColor }]}>{item.type}</Text>
                    </View>
                  </View>
                  <View style={styles.historyMain}>
                    <Text style={styles.historyEmoji}>{mood?.emoji}</Text>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.historyMoodName}>{language === 'en' ? mood?.label : mood?.labelK}</Text>
                      <Text style={styles.historyNote} numberOfLines={2}>{item.note}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 16 },

  header: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24, backgroundColor: Colors.white, ...Shadows.soft },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 15, color: Colors.textMuted, marginTop: 4, fontWeight: '500' },
  titleUnderline: { width: 40, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 12 },

  card: { backgroundColor: Colors.white, marginHorizontal: 20, marginTop: 20, borderRadius: 24, padding: 20, ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.text },
  insightBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  insightText: { color: '#2E7D32', fontSize: 12, fontWeight: '800' },

  // Chart
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, paddingHorizontal: 10 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBar: { width: 14, borderRadius: 7, marginBottom: 8 },
  chartDay: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  chartLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },

  // Mood Grid
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  moodBox: { width: (width - 100) / 3, alignItems: 'center', paddingVertical: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  moodEmoji: { fontSize: 32, marginBottom: 8 },
  moodLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },

  noteInput: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, fontSize: 15, color: Colors.text, minHeight: 80, textAlignVertical: 'top' },

  saveBtn: { marginHorizontal: 20, marginTop: 24, borderRadius: 16, overflow: 'hidden', ...Shadows.premium },
  saveGrad: { paddingVertical: 18, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  // History
  historySection: { paddingHorizontal: 20, marginTop: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  historyCard: { backgroundColor: Colors.white, borderRadius: 24, marginBottom: 14, ...Shadows.soft, overflow: 'hidden', flexDirection: 'row' },
  statusLine: { width: 6 },
  historyContent: { flex: 1, padding: 16 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  historyDate: { fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusTextSmall: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  historyMain: { flexDirection: 'row', alignItems: 'center' },
  historyEmoji: { fontSize: 28 },
  historyMoodName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  historyNote: { fontSize: 14, color: Colors.textMuted, marginTop: 2, lineHeight: 20, fontWeight: '500' },
});
