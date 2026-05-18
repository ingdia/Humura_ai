import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../../src/constants/theme';

const { width } = Dimensions.get('window');

const C = {
  primary: '#4a90e2',
  mid:     '#357ABD',
  accent:  '#2C5F8F',
  bg:      '#F0F7FF',
  text:    '#0D1B2A',
  textSoft:'#78909C',
};

export default function SignupScreen() {
  const router = useRouter();

  const handleGenerate = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0A1628', '#0D2144', '#1565C0']} style={styles.hero}>
        <SafeAreaView>
          <View style={styles.heroContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Join Humura</Text>
            <Text style={styles.subtitle}>Create your secure, anonymous identity to access SRH support.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why Anonymous?</Text>
          <Text style={styles.cardText}>
            We believe your reproductive health is private. By using an anonymous ID, 
            you can ask questions and get help without ever sharing your name or email.
          </Text>

          <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
            <LinearGradient colors={[C.primary, C.accent]} style={styles.btnGrad}>
              <Text style={styles.btnText}>Start My Journey</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: C.primary, fontWeight: 'bold' }}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  hero: { paddingBottom: 60, paddingTop: 20 },
  heroContent: { paddingHorizontal: 30 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 24 },
  cardContainer: { paddingHorizontal: 20, marginTop: -40 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 30, ...Shadows.premium },
  cardTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 15 },
  cardText: { fontSize: 15, color: C.textSoft, lineHeight: 22, marginBottom: 30 },
  btn: { borderRadius: 18, overflow: 'hidden' },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 12 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  loginLink: { marginTop: 24, alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: C.textSoft },
});
