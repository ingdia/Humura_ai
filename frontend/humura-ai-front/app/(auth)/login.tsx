import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, Animated, Dimensions,
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
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const emailFocus    = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;

  const animateFocus = (anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, { toValue: focused ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim())              e.email    = 'Email is required';
    else if (!email.includes('@'))  e.email    = 'Enter a valid email';
    if (!password)                  e.password = 'Password is required';
    else if (password.length < 6)  e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1500));

      // Mock successful login response
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: email,
        role: 'PATIENT',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      await login(mockUser, mockToken);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const borderColor = (anim: Animated.Value) =>
    anim.interpolate({ inputRange: [0, 1], outputRange: [C.border, C.primary] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top gradient hero */}
      <LinearGradient
        colors={['#0A1628', '#0D2144', '#1565C0']}
        style={styles.hero}
      >
        <View style={styles.heroBg1} />
        <View style={styles.heroBg2} />
        <SafeAreaView>
          <View style={styles.heroContent}>
            <View style={styles.logoRow}>
              <LinearGradient colors={['#4a90e2', '#2C5F8F']} style={styles.logoBox}>
                <Ionicons name="leaf" size={22} color="#fff" />
              </LinearGradient>
              <Text style={styles.logoText}>Humura</Text>
            </View>
            <Text style={styles.heroTitle}>Welcome back</Text>
            <Text style={styles.heroSub}>Sign in to continue your journey</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Form card */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>

            <Text style={styles.formTitle}>Sign In</Text>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Email</Text>
              <Animated.View style={[styles.inputWrap, { borderColor: errors.email ? C.error : borderColor(emailFocus) }]}>
                <Ionicons name="mail-outline" size={18} color={C.textSoft} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: undefined })); }}
                  placeholder="your@email.com"
                  placeholderTextColor={C.textSoft}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => animateFocus(emailFocus, true)}
                  onBlur={() => animateFocus(emailFocus, false)}
                />
              </Animated.View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Password</Text>
              <Animated.View style={[styles.inputWrap, { borderColor: errors.password ? C.error : borderColor(passwordFocus) }]}>
                <Ionicons name="lock-closed-outline" size={18} color={C.textSoft} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
                  placeholder="Enter your password"
                  placeholderTextColor={C.textSoft}
                  style={styles.input}
                  secureTextEntry={!showPass}
                  onFocus={() => animateFocus(passwordFocus, true)}
                  onBlur={() => animateFocus(passwordFocus, false)}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textSoft} />
                </TouchableOpacity>
              </Animated.View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot */}
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
              <LinearGradient colors={[C.primary, C.accent]} style={styles.loginBtnGrad}>
                {loading ? (
                  <View style={styles.loadingRow}>
                    <Animated.View style={styles.loadingDot} />
                    <Text style={styles.loginBtnText}>Signing in...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.loginBtnText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="phone-portrait-outline" size={18} color={C.text} />
                <Text style={styles.socialText}>Phone</Text>
              </TouchableOpacity>
            </View>

            {/* Anonymous */}
            <TouchableOpacity style={styles.anonBtn} onPress={() => router.replace('/(tabs)')}>
              <Ionicons name="eye-off-outline" size={16} color={C.primary} />
              <Text style={styles.anonText}>Continue anonymously</Text>
            </TouchableOpacity>

          </View>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  hero: { paddingBottom: 40 },
  heroBg1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(74,144,226,0.08)', top: -40, right: -40 },
  heroBg2: { position: 'absolute', width: 160, height: 160, borderRadius: 80,  backgroundColor: 'rgba(74,144,226,0.06)', bottom: 0,  left: -30 },
  heroContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoBox: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  card: {
    backgroundColor: C.card, borderRadius: 24, padding: 24,
    marginTop: 0,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  formTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 22 },

  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: C.textMid, marginBottom: 7 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderRadius: 14,
    borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 2,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: C.text, paddingVertical: 13 },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: C.error, marginTop: 5, marginLeft: 2 },

  forgotRow: { alignItems: 'flex-end', marginBottom: 22, marginTop: -4 },
  forgotText: { fontSize: 13, color: C.primary, fontWeight: '600' },

  loginBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 22 },
  loginBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)' },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerText: { fontSize: 12, color: C.textSoft, marginHorizontal: 12, fontWeight: '500' },

  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 13, borderRadius: 14, borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.bg, gap: 8,
  },
  socialIcon: { fontSize: 16, fontWeight: '800', color: '#EA4335' },
  socialText: { fontSize: 14, fontWeight: '600', color: C.text },

  anonBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8 },
  anonText: { fontSize: 14, color: C.primary, fontWeight: '600' },

  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signupText: { fontSize: 14, color: C.textSoft },
  signupLink: { fontSize: 14, color: C.primary, fontWeight: '700' },
});
