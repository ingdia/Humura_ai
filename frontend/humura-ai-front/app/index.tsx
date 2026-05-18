import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated,
  Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';
import { Colors } from '../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Core animations
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  // Logo
  const logoScale      = useRef(new Animated.Value(0)).current;
  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoRotate     = useRef(new Animated.Value(-0.1)).current;

  // Glow rings
  const ring1Scale     = useRef(new Animated.Value(0.4)).current;
  const ring1Opacity   = useRef(new Animated.Value(0)).current;
  const ring2Scale     = useRef(new Animated.Value(0.4)).current;
  const ring2Opacity   = useRef(new Animated.Value(0)).current;
  const ring3Scale     = useRef(new Animated.Value(0.4)).current;
  const ring3Opacity   = useRef(new Animated.Value(0)).current;

  // Text
  const nameOpacity    = useRef(new Animated.Value(0)).current;
  const nameY          = useRef(new Animated.Value(30)).current;
  const tagOpacity     = useRef(new Animated.Value(0)).current;
  const tagY           = useRef(new Animated.Value(20)).current;

  // Dots
  const dot1Opacity    = useRef(new Animated.Value(0)).current;
  const dot2Opacity    = useRef(new Animated.Value(0)).current;
  const dot3Opacity    = useRef(new Animated.Value(0)).current;

  // Bar
  const barWidth       = useRef(new Animated.Value(0)).current;
  const barOpacity     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) return;

    // Main sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ring1Opacity, { toValue: 0.5, duration: 500, useNativeDriver: true }),
        Animated.spring(ring1Scale,   { toValue: 1,   tension: 40, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ring2Opacity, { toValue: 0.35, duration: 400, useNativeDriver: true }),
        Animated.spring(ring2Scale,   { toValue: 1,    tension: 35, friction: 8, useNativeDriver: true }),
        Animated.timing(ring3Opacity, { toValue: 0.2,  duration: 400, useNativeDriver: true }),
        Animated.spring(ring3Scale,   { toValue: 1,    tension: 30, friction: 8, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1,   tension: 70, friction: 6, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1,   duration: 300, useNativeDriver: true }),
        Animated.spring(logoRotate,  { toValue: 0,   tension: 70, friction: 6, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(nameOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(nameY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(tagY,       { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      Animated.stagger(120, [
        Animated.timing(dot1Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.timing(barOpacity, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(barWidth,   { toValue: width * 0.6, duration: 1600, useNativeDriver: false }),
      Animated.delay(300),
      Animated.timing(screenOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        const checkOnboarding = async () => {
          const seen = await AsyncStorage.getItem('hasSeenOnboarding');
          if (seen === 'true') {
            router.replace('/(auth)/login');
          } else {
            router.replace('/(onboarding)');
          }
        };
        checkOnboarding();
      }
    });
  }, [isLoading, isAuthenticated]);

  const spin = logoRotate.interpolate({ inputRange: [-0.1, 0], outputRange: ['-15deg', '0deg'] });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[Colors.text, Colors.accent, Colors.primary, Colors.accent, Colors.text]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glowCenter} />

      <Animated.View style={[styles.ring, styles.ring3, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />

      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }, { rotate: spin }] }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
            style={styles.logoOuter}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.logoInner}
            >
              <Ionicons name="leaf" size={46} color="#fff" />
            </LinearGradient>
          </LinearGradient>
        </Animated.View>

        <Animated.Text style={[styles.appName, { opacity: nameOpacity, transform: [{ translateY: nameY }] }]}>
          Humura
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: tagOpacity, transform: [{ translateY: tagY }] }]}>
          Be at peace 🌿
        </Animated.Text>

        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, styles.dotMid, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>

      <Animated.View style={[styles.barWrap, { opacity: barOpacity }]}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]}>
            <LinearGradient
              colors={[Colors.secondary, Colors.primary, Colors.white]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </Animated.View>

      <View style={styles.bottom}>
        <Text style={styles.bottomText}>SRH Innovation · Rwanda 2025</Text>
        <View style={styles.bottomLine} />
        <Text style={styles.bottomSub}>Bonae Ineza & Diane Ingabire</Text>
      </View>
    </Animated.View>
  );
}

const RING_BASE = 160;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCenter: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,144,226,0.15)',
    top: height / 2 - 220,
    left: width / 2 - 150,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(74,144,226,0.4)',
    top: height / 2 - 220,
    alignSelf: 'center',
  },
  ring1: { width: RING_BASE,       height: RING_BASE,       borderRadius: RING_BASE / 2,       top: height / 2 - RING_BASE / 2 - 60 },
  ring2: { width: RING_BASE + 80,  height: RING_BASE + 80,  borderRadius: (RING_BASE + 80) / 2, top: height / 2 - (RING_BASE + 80) / 2 - 60 },
  ring3: { width: RING_BASE + 160, height: RING_BASE + 160, borderRadius: (RING_BASE + 160) / 2, top: height / 2 - (RING_BASE + 160) / 2 - 60 },

  center: { alignItems: 'center' },
  logoWrap: { marginBottom: 32 },
  logoOuter: {
    width: 120, height: 120, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  logoInner: {
    width: 90, height: 90, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  appName: {
    fontSize: 56, fontWeight: '900', color: '#fff',
    letterSpacing: 1, marginBottom: 8,
    textShadowColor: 'rgba(74,144,226,0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 16, color: 'rgba(255,255,255,0.8)',
    fontWeight: '600', letterSpacing: 1,
    marginBottom: 32,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(74,144,226,0.4)' },
  dotMid: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  barWrap: { position: 'absolute', bottom: 120, alignItems: 'center' },
  barTrack: {
    width: width * 0.6, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden',
  },
  barFill: { height: 4, borderRadius: 2 },

  bottom: { position: 'absolute', bottom: 44, alignItems: 'center' },
  bottomText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, fontWeight: '600' },
  bottomLine: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 8 },
  bottomSub: { fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.4, fontWeight: '500' },
});
