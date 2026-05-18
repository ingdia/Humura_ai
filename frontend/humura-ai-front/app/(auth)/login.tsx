import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, Animated, Dimensions, ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

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
  error:   '#EF4444',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  const generateIdentity = () => {
    setLoading(true);
    setTimeout(() => {
      const randomId = 'humura.' + Math.floor(1000 + Math.random() * 9000);
      setGeneratedId(randomId);
      setShowIdentity(true);
      setLoading(false);
    }, 1800);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const mockUser = {
        id: Math.floor(Math.random() * 10000),
        name: generatedId,
        email: generatedId + '@anonymous.humura',
        role: 'USER',
        is_anonymous: true,
      };
      const mockToken = 'anon-' + Date.now();
      await login(mockUser, mockToken);
      router.replace('/(onboarding)/details');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80' }} 
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient 
          colors={['rgba(10,22,40,0.85)', 'rgba(21,101,192,0.7)']} 
          style={StyleSheet.absoluteFill} 
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.container}>
            
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={[C.primary, C.accent]} style={styles.logoBox}>
                  <Ionicons name="leaf" size={28} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.brandTitle}>Humura Shenge</Text>
              <Text style={styles.brandTagline}>Your Safe & Anonymous Space</Text>
            </View>

            <View style={styles.glassCard}>
              {!showIdentity ? (
                <View>
                  <Text style={styles.cardTitle}>Anonymous Access</Text>
                  <Text style={styles.cardDesc}>
                    We protect your privacy by not asking for personal info. 
                    Generate a secure identity to begin.
                  </Text>

                  <TouchableOpacity 
                    style={styles.mainBtn} 
                    onPress={generateIdentity} 
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={[C.primary, C.accent]} style={styles.btnGrad}>
                      {loading ? (
                        <Text style={styles.btnText}>Securing Identity...</Text>
                      ) : (
                        <>
                          <Text style={styles.btnText}>Generate Secure ID</Text>
                          <Ionicons name="shield-checkmark" size={20} color="#fff" />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/(auth)/signup')}>
                    <Text style={styles.linkText}>Have an account? <Text style={styles.linkHighlight}>Log in</Text></Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.idFlow}>
                  <View style={styles.idBox}>
                    <Text style={styles.idHeader}>YOUR SECURE USERNAME</Text>
                    <Text style={styles.idText}>{generatedId}</Text>
                    <View style={styles.idFooter}>
                      <Ionicons name="copy-outline" size={14} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.idFooterText}>Copy to clipboard</Text>
                    </View>
                  </View>

                  <View style={styles.noteBox}>
                    <Ionicons name="bookmark" size={20} color="#60A5FA" />
                    <Text style={styles.noteText}>
                      Write this down. It is the <Text style={{ fontWeight: 'bold' }}>only way</Text> to access your account again.
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.mainBtn} onPress={handleLogin} activeOpacity={0.8}>
                    <LinearGradient colors={['#10B981', '#059669']} style={styles.btnGrad}>
                      <Text style={styles.btnText}>I've Saved It, Enter</Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>100% Encrypted & Anonymous</Text>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628' },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 24, padding: 4,
    backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 20
  },
  logoBox: { flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  brandTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  brandTagline: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: '600' },
  
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 32, padding: 32,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3, shadowRadius: 30, elevation: 15
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 12, textAlign: 'center' },
  cardDesc: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 24, textAlign: 'center', marginBottom: 32 },
  
  mainBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 12 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
  linkBtn: { marginTop: 24, alignItems: 'center' },
  linkText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  linkHighlight: { color: C.primary, fontWeight: '800' },
  
  idFlow: { alignItems: 'center' },
  idBox: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24,
    padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed', marginBottom: 24
  },
  idHeader: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 10 },
  idText: { fontSize: 32, fontWeight: '900', color: '#60A5FA', letterSpacing: 3 },
  idFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  idFooterText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  
  noteBox: {
    flexDirection: 'row', backgroundColor: 'rgba(96,165,250,0.1)', padding: 16,
    borderRadius: 20, gap: 12, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)'
  },
  noteText: { flex: 1, fontSize: 14, color: '#93C5FD', lineHeight: 20 },
  
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  footerText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: 1 },
});


