import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  SafeAreaView, StatusBar, ScrollView, Dimensions,
  ImageBackground, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const C = {
  primary: '#4a90e2',
  mid:     '#357ABD',
  accent:  '#2C5F8F',
  sky:     '#EBF4FF',
  bg:      '#F0F7FF',
  card:    '#FFFFFF',
  text:    '#0D1B2A',
  textMid: '#37474F',
  textSoft:'#78909C',
  border:  '#DDE8FF',
};

const SCENES = [
  {
    id: 'forest', label: 'Forest', emoji: '🌲',
    desc: 'Quiet forest, birds singing softly',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
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
  {
    id: 'rain', label: 'Rain', emoji: '🌧️',
    desc: 'Soft rain on leaves, cozy inside',
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80',
    vrUrl: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    ambience: 'Rain · Thunder · Calm',
  },
];

const TECHNIQUES = [
  { label: '4-2-4-2', name: 'Box Breathing',    desc: 'Calm & focus',        durations: [4000, 2000, 4000, 2000] },
  { label: '4-7-8',   name: 'Sleep Breathing',   desc: 'Anxiety & sleep',     durations: [4000, 7000, 8000, 1000] },
  { label: '5-5',     name: 'Equal Breathing',   desc: 'Balance & grounding', durations: [5000, 1000, 5000, 1000] },
];

const PHASES = ['Breathe in...', 'Hold...', 'Breathe out...', 'Rest...'];

export default function CalmScreen() {
  const [scene, setScene]             = useState(SCENES[0]);
  const [technique, setTechnique]     = useState(TECHNIQUES[0]);
  const [mode, setMode]               = useState<'browse' | 'session' | 'vr' | 'done'>('browse');
  const [phase, setPhase]             = useState(0);
  const [seconds, setSeconds]         = useState(0);
  const [postMood, setPostMood]       = useState<string | null>(null);

  const scale       = useRef(new Animated.Value(1)).current;
  const ringScale   = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.25)).current;
  const activeRef   = useRef(false);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (mode === 'session') {
      activeRef.current = true;
      runCycle(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      activeRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      scale.stopAnimation();
      ringScale.stopAnimation();
      ringOpacity.stopAnimation();
      Animated.parallel([
        Animated.timing(scale,       { toValue: 1,    duration: 600, useNativeDriver: true }),
        Animated.timing(ringScale,   { toValue: 1,    duration: 600, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 0.25, duration: 600, useNativeDriver: true }),
      ]).start();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
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

  const openVR = async () => {
    Alert.alert(
      '🥽 VR Mode',
      `Open "${scene.label}" in VR?\n\nPlace your phone in a Google Cardboard headset for a fully immersive 360° experience.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open VR',
          onPress: async () => {
            const canOpen = await Linking.canOpenURL(scene.vrUrl);
            if (canOpen) {
              await Linking.openURL(scene.vrUrl);
            } else {
              await Linking.openURL('https://www.youtube.com/results?search_query=360+vr+nature+relaxation');
            }
          },
        },
      ]
    );
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── POST SESSION ──
  if (mode === 'done') {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <StatusBar barStyle="light-content" backgroundColor={C.primary} />
        <LinearGradient colors={[C.primary, C.accent]} style={styles.doneHeader}>
          <View style={styles.doneIconWrap}>
            <Ionicons name="checkmark-circle" size={52} color="#fff" />
          </View>
          <Text style={styles.doneTitle}>Session Complete</Text>
          <Text style={styles.doneDuration}>{fmt(seconds)} · {scene.label} · {technique.name}</Text>
        </LinearGradient>
        <View style={styles.doneBody}>
          <Text style={styles.doneQ}>How do you feel now?</Text>
          <View style={styles.doneMoodRow}>
            {[
              { label: 'Much better', emoji: '😌' },
              { label: 'A bit better', emoji: '🙂' },
              { label: 'Same', emoji: '😐' },
              { label: 'Still hard', emoji: '😔' },
            ].map(m => (
              <TouchableOpacity
                key={m.label}
                style={[styles.doneMoodBtn, postMood === m.label && styles.doneMoodBtnActive]}
                onPress={() => setPostMood(m.label)}
              >
                <Text style={styles.doneMoodEmoji}>{m.emoji}</Text>
                <Text style={[styles.doneMoodLabel, postMood === m.label && { color: C.primary, fontWeight: '700' }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => { setMode('browse'); setPostMood(null); setSeconds(0); }}
          >
            <Text style={styles.doneBtnText}>Back to Calm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── ACTIVE SESSION ──
  if (mode === 'session') {
    return (
      <ImageBackground source={{ uri: scene.image }} style={styles.sessionBg} resizeMode="cover">
        <LinearGradient
          colors={['rgba(13,27,42,0.55)', 'rgba(44,95,143,0.70)', 'rgba(13,27,42,0.80)']}
          style={styles.sessionOverlay}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Top bar */}
            <View style={styles.sessionTop}>
              <TouchableOpacity style={styles.sessionBackBtn} onPress={() => { setMode('done'); }}>
                <Ionicons name="stop" size={18} color="#fff" />
                <Text style={styles.sessionBackText}>End</Text>
              </TouchableOpacity>
              <View style={styles.sessionTimerPill}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.sessionTimer}>{fmt(seconds)}</Text>
              </View>
              <TouchableOpacity style={styles.vrPillBtn} onPress={openVR}>
                <Ionicons name="glasses-outline" size={16} color="#fff" />
                <Text style={styles.vrPillText}>VR</Text>
              </TouchableOpacity>
            </View>

            {/* Scene info */}
            <View style={styles.sessionSceneRow}>
              <Text style={styles.sessionSceneEmoji}>{scene.emoji}</Text>
              <Text style={styles.sessionSceneName}>{scene.label}</Text>
              <Text style={styles.sessionAmbience}>{scene.ambience}</Text>
            </View>

            {/* Breathing circle */}
            <View style={styles.sessionCircleWrap}>
              <Animated.View style={[styles.ringPulse, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
              <Animated.View style={[styles.sessionCircle, { transform: [{ scale }] }]}>
                <LinearGradient colors={['rgba(74,144,226,0.9)', 'rgba(44,95,143,0.95)']} style={styles.sessionCircleGrad}>
                  <Ionicons name="leaf" size={36} color="#fff" />
                </LinearGradient>
              </Animated.View>
            </View>

            {/* Phase */}
            <View style={styles.sessionPhaseWrap}>
              <Text style={styles.sessionPhase}>{PHASES[phase]}</Text>
              <Text style={styles.sessionTechnique}>{technique.name} · {technique.label}</Text>
            </View>

            {/* Progress dots */}
            <View style={styles.phaseDots}>
              {PHASES.map((_, i) => (
                <View key={i} style={[styles.phaseDot, i === phase && styles.phaseDotActive]} />
              ))}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  // ── BROWSE ──
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <LinearGradient colors={[C.primary, C.accent]} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Calm Mode</Text>
              <Text style={styles.headerSub}>Breathe · Relax · Reset</Text>
            </View>
            <View style={styles.vrBadge}>
              <Ionicons name="glasses" size={18} color="#fff" />
              <Text style={styles.vrBadgeText}>VR Ready</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Scene Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHOOSE YOUR SCENE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sceneScroll}>
            {SCENES.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.sceneCard, scene.id === s.id && styles.sceneCardActive]}
                onPress={() => setScene(s)}
                activeOpacity={0.85}
              >
                <ImageBackground source={{ uri: s.image }} style={styles.sceneCardBg} imageStyle={{ borderRadius: 16 }}>
                  <LinearGradient
                    colors={['transparent', 'rgba(13,27,42,0.82)']}
                    style={styles.sceneCardOverlay}
                  >
                    {scene.id === s.id && (
                      <View style={styles.sceneCheckBadge}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    )}
                    <Text style={styles.sceneCardEmoji}>{s.emoji}</Text>
                    <Text style={styles.sceneCardLabel}>{s.label}</Text>
                    <Text style={styles.sceneCardAmbience}>{s.ambience}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* VR Banner */}
        <TouchableOpacity style={styles.vrBanner} onPress={openVR} activeOpacity={0.88}>
          <LinearGradient colors={[C.accent, C.primary]} style={styles.vrBannerGrad}>
            <View style={styles.vrBannerLeft}>
              <View style={styles.vrIconWrap}>
                <Ionicons name="glasses" size={26} color="#fff" />
              </View>
              <View>
                <Text style={styles.vrBannerTitle}>Launch VR Experience</Text>
                <Text style={styles.vrBannerSub}>{scene.label} · 360° immersive · Google Cardboard</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Technique */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>BREATHING TECHNIQUE</Text>
          <Text style={styles.cardTitle}>Choose a pattern</Text>
          {TECHNIQUES.map(t => (
            <TouchableOpacity
              key={t.label}
              style={[styles.techniqueRow, technique.label === t.label && styles.techniqueRowActive]}
              onPress={() => setTechnique(t)}
            >
              <View style={[styles.radio, technique.label === t.label && styles.radioActive]}>
                {technique.label === t.label && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.techniqueName, technique.label === t.label && { color: C.primary }]}>
                  {t.name}
                </Text>
                <Text style={styles.techniquePattern}>{t.label} · {t.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => { setSeconds(0); setMode('session'); }}
          activeOpacity={0.88}
        >
          <LinearGradient colors={[C.primary, C.accent]} style={styles.startBtnGrad}>
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.startBtnText}>Start Breathing Session</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={16} color={C.primary} />
          </View>
          <Text style={styles.tipText}>
            Controlled breathing activates your parasympathetic nervous system, reducing cortisol and anxiety within minutes.
          </Text>
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
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 2 },
  vrBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, gap: 6 },
  vrBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Section
  section: { marginTop: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: C.primary, letterSpacing: 1, marginLeft: 20, marginBottom: 10 },

  // Scene cards
  sceneScroll: { paddingHorizontal: 16, gap: 12 },
  sceneCard: { width: 140, height: 180, borderRadius: 16, overflow: 'hidden', marginRight: 4, borderWidth: 2, borderColor: 'transparent' },
  sceneCardActive: { borderColor: C.primary },
  sceneCardBg: { flex: 1 },
  sceneCardOverlay: { flex: 1, padding: 12, justifyContent: 'flex-end' },
  sceneCheckBadge: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  sceneCardEmoji: { fontSize: 22, marginBottom: 4 },
  sceneCardLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },
  sceneCardAmbience: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  // VR Banner
  vrBanner: { marginHorizontal: 16, marginTop: 16, borderRadius: 18, overflow: 'hidden' },
  vrBannerGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  vrBannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  vrIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  vrBannerTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  vrBannerSub: { fontSize: 11, color: 'rgba(255,255,255,0.78)', marginTop: 2 },

  // Card
  card: { backgroundColor: C.card, marginHorizontal: 16, marginTop: 16, borderRadius: 18, padding: 18, shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 },
  cardLabel: { fontSize: 10, fontWeight: '700', color: C.primary, letterSpacing: 1, marginBottom: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginBottom: 14 },

  // Technique
  techniqueRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, marginBottom: 8, backgroundColor: C.bg },
  techniqueRowActive: { borderColor: C.primary, backgroundColor: C.sky },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  radioActive: { borderColor: C.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.primary },
  techniqueName: { fontSize: 14, fontWeight: '700', color: C.text },
  techniquePattern: { fontSize: 12, color: C.textSoft, marginTop: 1 },

  // Start button
  startBtn: { marginHorizontal: 16, marginTop: 16, borderRadius: 18, overflow: 'hidden', shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  startBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

  // Tip
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 16, marginTop: 14, backgroundColor: C.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  tipIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.sky, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tipText: { flex: 1, fontSize: 13, color: C.textMid, lineHeight: 19 },

  // ── SESSION SCREEN ──
  sessionBg: { flex: 1, width, height },
  sessionOverlay: { flex: 1 },
  sessionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  sessionBackBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  sessionBackText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  sessionTimerPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  sessionTimer: { color: '#fff', fontSize: 14, fontWeight: '700' },
  vrPillBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  vrPillText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sessionSceneRow: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  sessionSceneEmoji: { fontSize: 32, marginBottom: 6 },
  sessionSceneName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  sessionAmbience: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  sessionCircleWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ringPulse: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(74,144,226,0.25)', borderWidth: 1.5, borderColor: 'rgba(74,144,226,0.5)' },
  sessionCircle: { width: 150, height: 150, borderRadius: 75, overflow: 'hidden' },
  sessionCircleGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sessionPhaseWrap: { alignItems: 'center', paddingBottom: 16 },
  sessionPhase: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
  sessionTechnique: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  phaseDots: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: 40 },
  phaseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  phaseDotActive: { backgroundColor: '#fff', width: 24 },

  // ── DONE SCREEN ──
  doneHeader: { paddingTop: 80, paddingBottom: 40, alignItems: 'center' },
  doneIconWrap: { marginBottom: 14 },
  doneTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  doneDuration: { fontSize: 13, color: 'rgba(255,255,255,0.78)', marginTop: 6 },
  doneBody: { flex: 1, padding: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  doneQ: { fontSize: 20, fontWeight: '700', color: C.text, marginBottom: 24, textAlign: 'center' },
  doneMoodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 32 },
  doneMoodBtn: { alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card, minWidth: 100 },
  doneMoodBtnActive: { borderColor: C.primary, backgroundColor: C.sky },
  doneMoodEmoji: { fontSize: 24, marginBottom: 4 },
  doneMoodLabel: { fontSize: 12, color: C.textSoft, fontWeight: '600' },
  doneBtn: { backgroundColor: C.primary, paddingHorizontal: 44, paddingVertical: 14, borderRadius: 30 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
