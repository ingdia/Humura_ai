import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  SafeAreaView, StatusBar, ScrollView, Dimensions,
  ImageBackground, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const SCENES = [
  {
    id: 'forest', label: 'Forest', emoji: '🌲',
    desc: 'Quiet forest, birds singing softly',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    vrUrl: 'https://www.youtube.com/watch?v=Un4QFMFnxe4',
    ambience: 'Birds · Wind · Leaves',
  },
  {
    id: 'beach', label: 'Beach', emoji: '🌊',
    desc: 'Gentle waves, warm golden sun',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    vrUrl: 'https://www.youtube.com/watch?v=qNPLQFBFMlI',
    ambience: 'Waves · Seagulls · Breeze',
  },
  {
    id: 'sky', label: 'Open Sky', emoji: '☁️',
    desc: 'Floating above clouds, open air',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    vrUrl: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    ambience: 'Wind · Silence · Peace',
  },
];

const TECHNIQUES = [
  { label: '4-2-4-2', name: 'Box Breathing',    desc: 'Calm & focus',        durations: [4000, 2000, 4000, 2000] },
  { label: '4-7-8',   name: 'Sleep Breathing',   desc: 'Anxiety & sleep',     durations: [4000, 7000, 8000, 1000] },
  { label: '5-5',     name: 'Equal Breathing',   desc: 'Balance & grounding', durations: [5000, 1000, 5000, 1000] },
];

const PHASES = ['Breathe in...', 'Hold...', 'Breathe out...', 'Rest...'];

export default function CalmScreen() {
  const { t, language } = useLanguage();
  const [scene, setScene]             = useState(SCENES[0]);
  const [technique, setTechnique]     = useState(TECHNIQUES[0]);
  const [mode, setMode]               = useState<'browse' | 'session' | 'done'>('browse');
  const [phase, setPhase]             = useState(0);
  const [seconds, setSeconds]         = useState(0);

  const scale       = useRef(new Animated.Value(1)).current;
  const ringScale   = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.25)).current;
  const activeRef   = useRef(false);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetSession = () => {
    activeRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(0);
    setPhase(0);
    scale.setValue(1);
    ringScale.setValue(1);
    ringOpacity.setValue(0.25);
    scale.stopAnimation();
    ringScale.stopAnimation();
    ringOpacity.stopAnimation();
  };

  useEffect(() => {
    if (mode === 'session') {
      activeRef.current = true;
      runCycle(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      resetSession();
    }
    return () => resetSession();
  }, [mode]);

  const runCycle = (p: number) => {
    if (!activeRef.current) return;
    setPhase(p);
    const dur = technique.durations[p];
    const anims: Animated.CompositeAnimation[] = [];
    if (p === 0) {
      anims.push(Animated.timing(scale,       { toValue: 1.5,  duration: dur, useNativeDriver: true }));
      anims.push(Animated.timing(ringScale,   { toValue: 1.8,  duration: dur, useNativeDriver: true }));
      anims.push(Animated.timing(ringOpacity, { toValue: 0.6,  duration: dur, useNativeDriver: true }));
    } else if (p === 2) {
      anims.push(Animated.timing(scale,       { toValue: 1,    duration: dur, useNativeDriver: true }));
      anims.push(Animated.timing(ringScale,   { toValue: 1,    duration: dur, useNativeDriver: true }));
      anims.push(Animated.timing(ringOpacity, { toValue: 0.25, duration: dur, useNativeDriver: true }));
    }
    const anim = anims.length > 0 ? Animated.parallel(anims) : Animated.delay(dur);
    anim.start(() => { if (activeRef.current) runCycle((p + 1) % 4); });
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const openVR = (url: string) => {
    Linking.openURL(url);
  };

  if (mode === 'session') {
    return (
      <ImageBackground source={{ uri: scene.image }} style={styles.sessionBg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(26,26,46,0.5)', 'rgba(74,144,226,0.3)', 'rgba(26,26,46,0.8)']}
          style={styles.sessionOverlay}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.sessionTop}>
              <TouchableOpacity style={styles.sessionBackBtn} onPress={() => { setMode('done'); }}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.sessionAmbience}>
                <Ionicons name="musical-notes" size={14} color="#fff" />
                <Text style={styles.ambienceText}>{scene.ambience}</Text>
              </View>
              <View style={styles.sessionTimerPill}>
                <Text style={styles.sessionTimer}>{fmt(seconds)}</Text>
              </View>
            </View>

            <View style={styles.sessionCircleWrap}>
              <Animated.View style={[styles.ringPulse, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
              <Animated.View style={[styles.sessionCircle, { transform: [{ scale }] }]}>
                <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.sessionCircleGrad}>
                  <Ionicons name="leaf" size={42} color="#fff" />
                </LinearGradient>
              </Animated.View>
            </View>

            <View style={styles.sessionPhaseWrap}>
              <Text style={styles.sessionPhase}>{PHASES[phase]}</Text>
              <Text style={styles.sessionTechnique}>{technique.name} · {technique.label}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('calm_title')}</Text>
          <Text style={styles.headerSub}>{t('calm_desc')}</Text>
          <View style={styles.titleUnderline} />
        </View>

        {/* Guided Visual Journeys (Background Selection) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{language === 'en' ? 'CHOOSE YOUR CALM SCENE' : 'HITAMO AHO WICARA'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sceneScroll}>
            {SCENES.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.sceneCard, scene.id === s.id && styles.sceneCardActive]}
                onPress={() => setScene(s)}
                activeOpacity={0.9}
              >
                <ImageBackground source={{ uri: s.image }} style={styles.sceneCardBg} imageStyle={{ borderRadius: 24 }}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.sceneCardOverlay}>
                    {scene.id === s.id && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      </View>
                    )}
                    <View>
                      <Text style={styles.sceneCardEmoji}>{s.emoji}</Text>
                      <Text style={styles.sceneCardLabel}>{s.label}</Text>
                      <TouchableOpacity style={styles.vrLinkBtn} onPress={() => openVR(s.vrUrl)}>
                        <Ionicons name="videocam" size={14} color="#fff" />
                        <Text style={styles.vrLinkText}>360° VR</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Breathing Technique Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{language === 'en' ? 'Breathing Technique' : 'Uburyo bwo guhumeka'}</Text>
          {TECHNIQUES.map(t => (
            <TouchableOpacity
              key={t.label}
              style={[styles.techniqueRow, technique.label === t.label && styles.techniqueRowActive]}
              onPress={() => setTechnique(t)}
            >
              <View style={[styles.radio, technique.label === t.label && styles.radioActive]}>
                {technique.label === t.label && <View style={styles.radioDot} />}
              </View>
              <View>
                <Text style={styles.techniqueName}>{t.name}</Text>
                <Text style={styles.techniqueDesc}>{t.label} · {t.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start Button (No Heart Icon) */}
        <TouchableOpacity style={styles.startBtn} onPress={() => setMode('session')} activeOpacity={0.88}>
          <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.startBtnGrad}>
            <Text style={styles.startBtnText}>{language === 'en' ? 'Start Breathing Guide' : 'Tangira guhumeka'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* YouTube Calm Music (Quick Links) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{language === 'en' ? 'CALM MUSIC LIBRARY' : 'INDIRIMBO ZO GUTUZA'}</Text>
          <View style={styles.card}>
            {[
              { id: '1', title: 'Deep Relaxation', url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4' },
              { id: '2', title: 'Soft Breezy Ambience', url: 'https://www.youtube.com/watch?v=Un4QFMFnxe4' },
            ].map(m => (
              <TouchableOpacity key={m.id} style={styles.musicLink} onPress={() => Linking.openURL(m.url)}>
                <Ionicons name="musical-notes" size={20} color={Colors.primary} />
                <Text style={styles.musicLinkText}>{m.title}</Text>
                <Ionicons name="open-outline" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
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

  section: { marginTop: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: Colors.primary, marginLeft: 20, marginBottom: 12, letterSpacing: 1 },
  sceneScroll: { paddingHorizontal: 16, gap: 14 },
  sceneCard: { width: 150, height: 210, borderRadius: 24, overflow: 'hidden', borderWidth: 3, borderColor: 'transparent' },
  sceneCardActive: { borderColor: Colors.primary },
  sceneCardBg: { flex: 1 },
  sceneCardOverlay: { flex: 1, padding: 16, justifyContent: 'flex-end' },
  selectedBadge: { position: 'absolute', top: 12, right: 12 },
  sceneCardEmoji: { fontSize: 24, marginBottom: 4 },
  sceneCardLabel: { fontSize: 16, fontWeight: '800', color: '#fff' },
  vrLinkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4, marginTop: 8 },
  vrLinkText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  card: { backgroundColor: Colors.white, marginHorizontal: 20, marginTop: 24, borderRadius: 24, padding: 20, ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 18 },

  techniqueRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 10 },
  techniqueRowActive: { borderColor: Colors.primary, backgroundColor: '#F8FAFC' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  techniqueName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  techniqueDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 2, fontWeight: '500' },

  startBtn: { marginHorizontal: 20, marginTop: 24, borderRadius: 16, overflow: 'hidden', ...Shadows.premium },
  startBtnGrad: { alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  musicLink: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  musicLinkText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text },

  // Session
  sessionBg: { flex: 1, width, height },
  sessionOverlay: { flex: 1 },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  sessionBackBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  sessionAmbience: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  ambienceText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  sessionTimerPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sessionTimer: { color: '#fff', fontWeight: '800', fontSize: 14 },
  sessionCircleWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ringPulse: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  sessionCircle: { width: 150, height: 150, borderRadius: 75, overflow: 'hidden' },
  sessionCircleGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sessionPhaseWrap: { alignItems: 'center', paddingBottom: 80 },
  sessionPhase: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  sessionTechnique: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 12, fontWeight: '600' },
});
