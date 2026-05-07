import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const C = {
  primary:  '#4a90e2',
  mid:      '#357ABD',
  light:    '#7BB3E8',
  accent:   '#2C5F8F',
  sky:      '#EBF4FF',
  bg:       '#F0F7FF',
  card:     '#FFFFFF',
  text:     '#0D1B2A',
  textSoft: '#78909C',
};

const QUOTES = [
  'Healing takes time, and asking for help is a courageous step.',
  'You are not alone. Millions walk this path with you.',
  "There is hope, even when your brain tells you there isn't.",
  'Umuntu ngumuntu ngabantu — a person is a person through other people.',
  'The wound is the place where the light enters you.',
  'Speak your truth even if your voice shakes.',
  'Mental health is not a destination, but a process.',
];

const FEATURES = [
  { tab: '/(tabs)/chat', icon: 'chatbubbles', title: 'AI Companion',  desc: 'Talk freely, 24/7.',    colors: ['#4a90e2', '#2C5F8F'] as [string, string], badge: '● Live' },
  { tab: '/(tabs)/mood', icon: 'analytics',   title: 'Mood Tracker',  desc: 'Track your patterns.',  colors: ['#357ABD', '#4a90e2'] as [string, string], badge: '5🔥' },
  { tab: '/(tabs)/calm', icon: 'leaf',        title: 'Calm Mode',     desc: 'Breathe & find peace.', colors: ['#5BA3E8', '#357ABD'] as [string, string], badge: 'NEW' },
  { tab: '/(tabs)/feed', icon: 'people',      title: 'Community',     desc: 'You are not alone.',    colors: ['#7BB3E8', '#4a90e2'] as [string, string], badge: '47 today' },
];

const MOODS = [
  { emoji: '😄', label: 'Great', color: '#4CAF50' },
  { emoji: '😊', label: 'Good',  color: '#42A5F5' },
  { emoji: '😐', label: 'Okay',  color: '#FFC107' },
  { emoji: '😢', label: 'Sad',   color: '#EF5350' },
  { emoji: '😡', label: 'Angry', color: '#E53935' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* HERO */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80' }}
          style={styles.hero}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(74,144,226,0.92)', 'rgba(44,95,143,0.90)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroTop}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <Ionicons name="leaf" size={16} color="#fff" />
                </View>
                <Text style={styles.logoText}>Humura</Text>
              </View>
              <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person" size={17} color={C.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.heroGreeting}>{greeting} 🌿</Text>
            <Text style={styles.heroTitle}>How are you feeling?</Text>

            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/chat')}>
              <Ionicons name="chatbubbles" size={17} color={C.primary} />
              <Text style={styles.heroBtnText}>Talk to Humura AI</Text>
            </TouchableOpacity>

            <View style={styles.moodRow}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m.label}
                  style={[styles.moodBtn, mood === m.label && { borderColor: m.color, backgroundColor: m.color + '35' }]}
                  onPress={() => setMood(m.label)}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {mood && <Text style={styles.moodSaved}>Feeling {mood} today ✓</Text>}
          </LinearGradient>
        </ImageBackground>

        {/* Crisis strip */}
        <TouchableOpacity style={styles.crisisBar} onPress={() => router.push('/(tabs)/chat')}>
          <Ionicons name="heart" size={14} color="#fff" />
          <Text style={styles.crisisText}>Overwhelmed? Talk to Humura AI now</Text>
          <Ionicons name="chevron-forward" size={14} color="#fff" />
        </TouchableOpacity>

        {/* Feature 2x2 grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wellness Tools</Text>
          <View style={styles.grid}>
            {FEATURES.map((f, i) => (
              <TouchableOpacity key={i} style={styles.featureCard} activeOpacity={0.87} onPress={() => router.push(f.tab as any)}>
                <LinearGradient colors={f.colors} style={styles.featureGrad}>
                  <View style={styles.featureTop}>
                    <View style={styles.featureIcon}>
                      <Ionicons name={f.icon as any} size={20} color="#fff" />
                    </View>
                    <Text style={styles.featureBadge}>{f.badge}</Text>
                  </View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Streak',    value: '5🔥', color: '#FFC107' },
            { label: 'Mood Logs', value: '11',  color: C.primary },
            { label: 'Calm',      value: '6',   color: '#27AE60' },
            { label: 'Posts',     value: '3❤️', color: C.mid },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quote + Consult */}
        <View style={styles.bottomRow}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80' }}
            style={styles.quoteCard}
            imageStyle={{ borderRadius: 18 }}
            resizeMode="cover"
          >
            <LinearGradient colors={['rgba(74,144,226,0.88)', 'rgba(44,95,143,0.92)']} style={styles.quoteOverlay}>
              <Ionicons name="chatbubble-ellipses" size={18} color="rgba(255,255,255,0.6)" style={{ marginBottom: 8 }} />
              <Text style={styles.quoteText}>"{quote}"</Text>
            </LinearGradient>
          </ImageBackground>

          <TouchableOpacity style={styles.consultCard} activeOpacity={0.9} onPress={() => router.push('/(tabs)/profile')}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80' }}
              style={{ flex: 1 }}
              imageStyle={{ borderRadius: 18 }}
              resizeMode="cover"
            >
              <LinearGradient colors={['rgba(74,144,226,0.88)', 'rgba(44,95,143,0.92)']} style={styles.consultOverlay}>
                <View style={styles.consultIcon}>
                  <Ionicons name="medical" size={20} color="#fff" />
                </View>
                <Text style={styles.consultTitle}>{'Book a\nTherapist'}</Text>
                <Text style={styles.consultSub}>Subsidized →</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 16 },

  hero: { width: '100%' },
  heroOverlay: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  profileBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  heroGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.82)', fontWeight: '500', marginBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 16 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 28, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
  heroBtnText: { color: C.primary, fontSize: 14, fontWeight: '700', marginLeft: 7 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { width: (width - 60) / 5, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.1)' },
  moodEmoji: { fontSize: 22 },
  moodSaved: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 10, textAlign: 'center' },

  crisisBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C5F8F', paddingHorizontal: 16, paddingVertical: 10 },
  crisisText: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '600', marginHorizontal: 10 },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  featureCard: { width: (width - 42) / 2, borderRadius: 18, overflow: 'hidden', shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 5 },
  featureGrad: { padding: 16, height: 130, justifyContent: 'space-between' },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featureIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center' },
  featureBadge: { color: '#fff', fontSize: 10, fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  featureTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  featureDesc: { fontSize: 11, color: 'rgba(255,255,255,0.85)' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginTop: 16 },
  statCard: { flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 12, alignItems: 'center', shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 9, color: C.textSoft, marginTop: 3, textAlign: 'center', fontWeight: '500' },

  bottomRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 10 },
  quoteCard: { flex: 1.4, height: 140, borderRadius: 18, overflow: 'hidden' },
  quoteOverlay: { flex: 1, padding: 16, justifyContent: 'center', borderRadius: 18 },
  quoteText: { fontSize: 12, fontWeight: '600', color: '#fff', lineHeight: 18 },
  consultCard: { flex: 1, height: 140, borderRadius: 18, overflow: 'hidden' },
  consultOverlay: { flex: 1, padding: 14, justifyContent: 'space-between', borderRadius: 18 },
  consultIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center' },
  consultTitle: { fontSize: 14, fontWeight: '800', color: '#fff', lineHeight: 19 },
  consultSub: { fontSize: 11, color: 'rgba(255,255,255,0.82)', fontWeight: '600' },
});
