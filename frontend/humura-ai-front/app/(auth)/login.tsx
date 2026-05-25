import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, ImageBackground, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { authAPI } from '../../src/services/api';

const C = {
  primary: '#4a90e2',
  mid:     '#357ABD',
  accent:  '#2C5F8F',
  text:    '#0D1B2A',
  textSoft:'#78909C',
  border:  '#DDE8FF',
  error:   '#EF4444',
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // Anonymous flow
  const [loading, setLoading] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  // Return anonymous user flow
  const [showReturnLogin, setShowReturnLogin] = useState(false);
  const [returnId, setReturnId] = useState('');

  // Doctor login flow
  const [showDoctorLogin, setShowDoctorLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  // ── Anonymous: get a real anonymous account from the backend ─
  const handleGenerateAnonymous = async () => {
    setLoading(true);
    try {
      const res = await authAPI.anonymous();
      const { token, ...user } = res.data;
      setGeneratedId(user.name ?? `humura.${user.id}`);
      await login(user, token);
      setShowIdentity(true);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error ?? 'Could not connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleEnterApp = () => {
    router.replace('/(onboarding)/details');
  };

  // ── Return anonymous login ────────────────────────────────────
  const handleReturnLogin = async () => {
    const trimmed = returnId.trim();
    if (!trimmed) {
      Alert.alert('Required', 'Please enter your humura ID (e.g. humura.0042).');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.anonymousLogin(trimmed);
      const { token, ...user } = res.data;
      await login(user, token);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Not Found', err?.response?.data?.error ?? 'Could not find that ID. Check and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Doctor login ─────────────────────────────────────────────
  const handleDoctorLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(email.trim(), password.trim());
      const { token, ...user } = res.data;
      await login(user, token);
      if (user.role === 'PSYCHOLOGIST' || user.role === 'ADMIN') {
        router.replace('/(professional-tabs)');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err?.response?.data?.error ?? 'Invalid email or password.');
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
          colors={['rgba(10,22,40,0.88)', 'rgba(21,101,192,0.72)']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

            {/* Logo */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={[C.primary, C.accent]} style={styles.logoBox}>
                  <Ionicons name="leaf" size={28} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.brandTitle}>Humura Shenge</Text>
              <Text style={styles.brandTagline}>Your Safe & Anonymous Space</Text>
            </View>

            {/* Card */}
            <View style={styles.glassCard}>
              {showDoctorLogin ? (
                /* ── Doctor login form ── */
                <View>
                  <TouchableOpacity style={styles.backRow} onPress={() => setShowDoctorLogin(false)}>
                    <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.backRowText}>Back</Text>
                  </TouchableOpacity>

                  <Text style={styles.cardTitle}>Professional Login</Text>
                  <Text style={styles.cardDesc}>Sign in to your Humura Pro account.</Text>

                  <View style={styles.inputWrap}>
                    <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email address"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputWrap}>
                    <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Password"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPw}
                    />
                    <TouchableOpacity onPress={() => setShowPw(v => !v)} style={{ padding: 4 }}>
                      <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.mainBtn} onPress={handleDoctorLogin} disabled={loading} activeOpacity={0.8}>
                    <LinearGradient colors={[C.primary, C.accent]} style={styles.btnGrad}>
                      <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
                      {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/(auth)/signup')}>
                    <Text style={styles.linkText}>
                      New professional? <Text style={styles.linkHighlight}>Register here</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : !showIdentity ? (
                /* ── Anonymous entry ── */
                <View>
                  {showReturnLogin ? (
                    <>
                      <TouchableOpacity style={styles.backRow} onPress={() => setShowReturnLogin(false)}>
                        <Ionicons name="chevron-back" size={18} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.backRowText}>Back</Text>
                      </TouchableOpacity>

                      <Text style={styles.cardTitle}>Welcome Back</Text>
                      <Text style={styles.cardDesc}>
                        Enter your unique Humura ID to continue where you left off.
                      </Text>

                      <View style={styles.inputWrap}>
                        <Ionicons name="finger-print-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="e.g. humura.0042"
                          placeholderTextColor="rgba(255,255,255,0.35)"
                          value={returnId}
                          onChangeText={setReturnId}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                      </View>

                      <TouchableOpacity style={styles.mainBtn} onPress={handleReturnLogin} disabled={loading} activeOpacity={0.8}>
                        <LinearGradient colors={[C.primary, C.accent]} style={styles.btnGrad}>
                          <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Enter with my ID'}</Text>
                          {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
                        </LinearGradient>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.cardTitle}>Anonymous Access</Text>
                      <Text style={styles.cardDesc}>
                        We protect your privacy. Generate a secure identity to begin — no name or email needed.
                      </Text>

                      <TouchableOpacity style={styles.mainBtn} onPress={handleGenerateAnonymous} disabled={loading} activeOpacity={0.8}>
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

                      <TouchableOpacity style={styles.linkBtn} onPress={() => setShowReturnLogin(true)}>
                        <Text style={styles.linkText}>
                          Already have an ID? <Text style={styles.linkHighlight}>Return with my ID</Text>
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity style={[styles.linkBtn, { marginTop: showReturnLogin ? 20 : 0 }]} onPress={() => setShowDoctorLogin(true)}>
                    <Text style={styles.linkText}>
                      I'm a health professional. <Text style={styles.linkHighlight}>Sign in</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* ── Identity reveal ── */
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

                  <TouchableOpacity style={styles.mainBtn} onPress={handleEnterApp} activeOpacity={0.8}>
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

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A1628' },
  safe: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: 30, justifyContent: 'center', paddingVertical: 40 },

  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 80, height: 80, borderRadius: 24, padding: 4, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 20 },
  logoBox: { flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  brandTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  brandTagline: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: '600' },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 32, padding: 32,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3, shadowRadius: 30, elevation: 15,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 12, textAlign: 'center' },
  cardDesc: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 24, textAlign: 'center', marginBottom: 28 },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  backRowText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 14 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16, marginBottom: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#fff', fontWeight: '500' },

  mainBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 6 },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 12 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  linkBtn: { marginTop: 24, alignItems: 'center' },
  linkText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  linkHighlight: { color: '#60A5FA', fontWeight: '800' },

  idFlow: { alignItems: 'center' },
  idBox: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24,
    padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed', marginBottom: 24,
  },
  idHeader: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 10 },
  idText: { fontSize: 28, fontWeight: '900', color: '#60A5FA', letterSpacing: 3 },
  idFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  idFooterText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },

  noteBox: {
    flexDirection: 'row', backgroundColor: 'rgba(96,165,250,0.1)', padding: 16,
    borderRadius: 20, gap: 12, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(96,165,250,0.2)',
  },
  noteText: { flex: 1, fontSize: 14, color: '#93C5FD', lineHeight: 20 },

  footer: { alignItems: 'center', marginTop: 24, paddingBottom: 20 },
  footerText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: 1 },
});
