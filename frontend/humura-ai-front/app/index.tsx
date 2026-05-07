import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated,
  Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

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

  // Floating particles
  const p1Y = useRef(new Animated.Value(0)).current;
  const p2Y = useRef(new Animated.Value(0)).current;
  const p3Y = useRef(new Animated.Value(0)).current;
  const p4Y = useRef(new Animated.Value(0)).current;
  const p1O = useRef(new Animated.Value(0)).current;
  const p2O = useRef(new Animated.Value(0)).current;
  const p3O = useRef(new Animated.Value(0)).current;
  const p4O = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating particles loop
    const floatParticle = (y: Animated.Value, o: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(o, { toValue: 0.7, duration: 600, useNativeDriver: true }),
            Animated.timing(y, { toValue: -30, duration: 2000, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(o, { toValue: 0, duration: 600, useNativeDriver: true }),
            Animated.timing(y, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    };
    floatParticle(p1Y, p1O, 0);
    floatParticle(p2Y, p2O, 400);
    floatParticle(p3Y, p3O, 800);
    floatParticle(p4Y, p4O, 1200);

    // Main sequence
    Animated.sequence([
      // Rings expand outward
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
      // Logo pops in with rotation
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1,   tension: 70, friction: 6, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1,   duration: 300, useNativeDriver: true }),
        Animated.spring(logoRotate,  { toValue: 0,   tension: 70, friction: 6, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      // App name
      Animated.parallel([
        Animated.timing(nameOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(nameY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      // Tagline
      Animated.parallel([
        Animated.timing(tagOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(tagY,       { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      Animated.delay(100),
      // Dots
      Animated.stagger(120, [
        Animated.timing(dot1Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot2Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(dot3Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      // Loading bar
      Animated.timing(barOpacity, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(barWidth,   { toValue: width * 0.6, duration: 1600, useNativeDriver: false }),
      Animated.delay(200),
      // Fade out
      Animated.timing(screenOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => router.replace('/(tabs)'));
  }, []);

  const spin = logoRotate.interpolate({ inputRange: [-0.1, 0], outputRange: ['-15deg', '0deg'] });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Deep gradient background */}
      <LinearGradient
        colors={['#0A1628', '#0D2144', '#1565C0', '#0D2144', '#0A1628']}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial glow behind logo */}
      <View style={styles.glowCenter} />

      {/* Glow rings */}
      <Animated.View style={[styles.ring, styles.ring3, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />

      {/* Floating particles */}
      {[
        { y: p1Y, o: p1O, left: width * 0.2,  top: height * 0.38, size: 6  },
        { y: p2Y, o: p2O, left: width * 0.75, top: height * 0.42, size: 4  },
        { y: p3Y, o: p3O, left: width * 0.35, top: height * 0.55, size: 5  },
        { y: p4Y, o: p4O, left: width * 0.65, top: height * 0.35, size: 7  },
      ].map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            { width: p.size, height: p.size, borderRadius: p.size / 2, left: p.left, top: p.top },
            { opacity: p.o, transform: [{ translateY: p.y }] },
          ]}
        />
      ))}

      {/* Main content */}
      <View style={styles.center}>

        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }, { rotate: spin }] }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
            style={styles.logoOuter}
          >
            <LinearGradient
              colors={['#4a90e2', '#2C5F8F']}
              style={styles.logoInner}
            >
              <Ionicons name="leaf" size={46} color="#fff" />
            </LinearGradient>
          </LinearGradient>
        </Animated.View>

        {/* App name */}
        <Animated.Text style={[styles.appName, { opacity: nameOpacity, transform: [{ translateY: nameY }] }]}>
          Humura
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: tagOpacity, transform: [{ translateY: tagY }] }]}>
          Your mental health companion
        </Animated.Text>

        {/* Decorative dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, styles.dotMid, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>

      {/* Loading bar */}
      <Animated.View style={[styles.barWrap, { opacity: barOpacity }]}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]}>
            <LinearGradient
              colors={['#7BB3E8', '#4a90e2', '#fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.bottomText}>Mental Health Innovation · Rwanda 2025</Text>
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
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },

  glowCenter: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74,144,226,0.12)',
    top: height / 2 - 220,
    left: width / 2 - 150,
  },

  // Rings
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(74,144,226,0.6)',
    top: height / 2 - 220,
    alignSelf: 'center',
  },
  ring1: { width: RING_BASE,       height: RING_BASE,       borderRadius: RING_BASE / 2,       top: height / 2 - RING_BASE / 2 - 60 },
  ring2: { width: RING_BASE + 80,  height: RING_BASE + 80,  borderRadius: (RING_BASE + 80) / 2, top: height / 2 - (RING_BASE + 80) / 2 - 60 },
  ring3: { width: RING_BASE + 160, height: RING_BASE + 160, borderRadius: (RING_BASE + 160) / 2, top: height / 2 - (RING_BASE + 160) / 2 - 60 },

  // Particles
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(74,144,226,0.9)',
  },

  // Center content
  center: { alignItems: 'center' },

  // Logo
  logoWrap: { marginBottom: 32 },
  logoOuter: {
    width: 120, height: 120, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  logoInner: {
    width: 90, height: 90, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },

  // Text
  appName: {
    fontSize: 52, fontWeight: '900', color: '#fff',
    letterSpacing: 2, marginBottom: 10,
    textShadowColor: 'rgba(74,144,226,0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 14, color: 'rgba(255,255,255,0.65)',
    fontWeight: '400', letterSpacing: 0.8,
    marginBottom: 28,
  },

  // Dots
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(74,144,226,0.5)' },
  dotMid: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4a90e2' },

  // Loading bar
  barWrap: { position: 'absolute', bottom: 120, alignItems: 'center' },
  barTrack: {
    width: width * 0.6, height: 3, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden',
  },
  barFill: { height: 3, borderRadius: 2 },

  // Bottom
  bottom: { position: 'absolute', bottom: 44, alignItems: 'center' },
  bottomText: { fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5, fontWeight: '500' },
  bottomLine: { width: 30, height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 6 },
  bottomSub: { fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.3 },
});
