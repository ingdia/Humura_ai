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
  accent:  '#2C5F8F',
};

const SPECIALIZATIONS = [
  'Clinical Psychology',
  'Counseling Psychology',
  'Child & Adolescent Psychology',
  'Trauma & PTSD',
  'Sexual & Reproductive Health',
  'Anxiety & Depression',
  'Family Therapy',
];

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showSpecPicker, setShowSpecPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !specialization) {
      Alert.alert('Required', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPw) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Too Short', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.register(name.trim(), email.trim(), password, 'PSYCHOLOGIST', specialization);
      const { token, ...user } = res.data;
      await login(user, token);
      router.replace('/(professional-tabs)');
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err?.response?.data?.error ?? 'Could not connect to server. Is the backend running?',
      );
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
          colors={['rgba(10,22,40,0.92)', 'rgba(21,101,192,0.75)']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

            {/* Back */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.7)" />
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={[C.primary, C.accent]} style={styles.logoBox}>
                  <Ionicons name="medkit" size={28} color="#fff" />
                </LinearGradient>
              </View>
              <Text style={styles.brandTitle}>Professional Portal</Text>
              <Text style={styles.brandTagline}>Register as a Humura Health Professional</Text>
            </View>

            {/* Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Create Account</Text>
              <Text style={styles.cardDesc}>
                Your account will be reviewed before activation.
              </Text>

              {/* Full Name */}
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email */}
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

              {/* Password */}
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPw}
                />
                <TouchableOpacity onPress={() => setShowPw(v => !v)} style={{ padding: 4 }}>
                  <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirm password"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={confirmPw}
                  onChangeText={setConfirmPw}
                  secureTextEntry={!showConfirmPw}
                />
                <TouchableOpacity onPress={() => setShowConfirmPw(v => !v)} style={{ padding: 4 }}>
                  <Ionicons name={showConfirmPw ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              </View>

              {/* Specialization picker */}
              <TouchableOpacity
                style={[styles.inputWrap, styles.pickerWrap]}
                onPress={() => setShowSpecPicker(v => !v)}
                activeOpacity={0.8}
              >
                <Ionicons name="briefcase-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <Text style={[styles.input, !specialization && { color: 'rgba(255,255,255,0.35)' }]}>
                  {specialization || 'Select specialization'}
                </Text>
                <Ionicons
                  name={showSpecPicker ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>

              {showSpecPicker && (
                <View style={styles.specList}>
                  {SPECIALIZATIONS.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.specItem, specialization === s && styles.specItemActive]}
                      onPress={() => { setSpecialization(s); setShowSpecPicker(false); }}
                    >
                      <Text style={[styles.specItemText, specialization === s && styles.specItemTextActive]}>
                        {s}
                      </Text>
                      {specialization === s && (
                        <Ionicons name="checkmark-circle" size={16} color={C.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.mainBtn}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[C.primary, C.accent]} style={styles.btnGrad}>
                  <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Register'}</Text>
                  {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkBtn} onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkHighlight}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Verified Professionals Only</Text>
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

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 24 },
  backText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600', fontSize: 14 },

  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { width: 80, height: 80, borderRadius: 24, padding: 4, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 18 },
  logoBox: { flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  brandTagline: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: '600', textAlign: 'center' },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 32, padding: 32,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3, shadowRadius: 30, elevation: 15,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8, textAlign: 'center' },
  cardDesc: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 22, textAlign: 'center', marginBottom: 24 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16, marginBottom: 14,
  },
  pickerWrap: { justifyContent: 'space-between' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 16, fontSize: 15, color: '#fff', fontWeight: '500' },

  specList: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    marginTop: -8, marginBottom: 14, overflow: 'hidden',
  },
  specItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  specItemActive: { backgroundColor: 'rgba(74,144,226,0.15)' },
  specItemText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  specItemTextActive: { color: '#fff' },

  mainBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 6 },
  btnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 12 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  linkBtn: { marginTop: 22, alignItems: 'center' },
  linkText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  linkHighlight: { color: '#60A5FA', fontWeight: '800' },

  footer: { alignItems: 'center', marginTop: 24, paddingBottom: 20 },
  footerText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: 1 },
});
