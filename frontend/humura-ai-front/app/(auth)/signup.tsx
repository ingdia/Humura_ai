import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

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
  success: '#4ADE80',
};

type Errors = { name?: string; email?: string; password?: string; confirm?: string; terms?: string };

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [terms, setTerms]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Errors>({});

  const nameFocus    = useRef(new Animated.Value(0)).current;
  const emailFocus   = useRef(new Animated.Value(0)).current;
  const passFocus    = useRef(new Animated.Value(0)).current;
  const confFocus    = useRef(new Animated.Value(0)).current;

  const animFocus = (anim: Animated.Value, v: boolean) =>
    Animated.timing(anim, { toValue: v ? 1 : 0, duration: 200, useNativeDriver: false }).start();

  const borderColor = (anim: Animated.Value, hasError?: string) =>
    hasError ? C.error : anim.interpolate({ inputRange: [0, 1], outputRange: [C.border, C.primary] });

  const passStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#FBBF24', '#4ADE80', '#22C55E'];
  const strength = passStrength();

  const validate = () => {
    const e: Errors = {};
    if (!name.trim())                    e.name     = 'Name is required';
    if (!email.trim())                   e.email    = 'Email is required';
    else if (!email.includes('@'))       e.email    = 'Enter a valid email';
    if (!password)                       e.password = 'Password is required';
    else if (password.length < 6)       e.password = 'At least 6 characters';
    if (!confirm)                        e.confirm  = 'Please confirm your password';
    else if (confirm !== password)       e.confirm  = 'Passwords do not match';
    if (!terms)                          e.terms    = 'Please accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    router.replace('/(tabs)');
  };

  const Field = ({
    label, value, onChange, placeholder, secure, showToggle, onToggle,
    focusAnim, error, keyboardType = 'default', icon, autoCapitalize = 'none',
  }: any) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.inputWrap, { borderColor: borderColor(focusAnim, error) }]}>
        <Ionicons name={icon} size={18} color={C.textSoft} style={styles.inputIcon} />
        <TextInput
          value={value}
          onChangeText={(v: string) => { onChange(v); setErrors((e: Errors) => ({ ...e, [label.toLowerCase()]: undefined })); }}
          placeholder={placeholder}
          placeholderTextColor={C.textSoft}
          style={styles.input}
          secureTextEntry={secure && !showToggle}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => animFocus(focusAnim, true)}
          onBlur={() => animFocus(focusAnim, false)}
        />
        {onToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Ionicons name={showToggle ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textSoft} />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Hero */}
      <LinearGradient colors={['#0A1628', '#0D2144', '#1565C0']} style={styles.hero}>
        <View style={styles.heroBg1} />
        <View style={styles.heroBg2} />
        <SafeAreaView>
          <View style={styles.heroContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <LinearGradient colors={['#4a90e2', '#2C5F8F']} style={styles.logoBox}>
                <Ionicons name="leaf" size={22} color="#fff" />
              </LinearGradient>
              <Text style={styles.logoText}>Humura</Text>
            </View>
            <Text style={styles.heroTitle}>Create account</Text>
            <Text style={styles.heroSub}>Join thousands healing with Humura</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.formTitle}>Your Details</Text>

            <Field
              label="Full Name" value={name} onChange={setName}
              placeholder="How should we call you?"
              icon="person-outline" focusAnim={nameFocus} error={errors.name}
              autoCapitalize="words"
            />
            <Field
              label="Email" value={email} onChange={setEmail}
              placeholder="your@email.com"
              icon="mail-outline" focusAnim={emailFocus} error={errors.email}
              keyboardType="email-address"
            />
            <Field
              label="Password" value={password} onChange={setPassword}
              placeholder="Create a strong password"
              icon="lock-closed-outline" focusAnim={passFocus} error={errors.password}
              secure showToggle={showPass} onToggle={() => setShowPass(!showPass)}
            />

            {/* Password strength */}
            {password.length > 0 && (
              <View style={styles.strengthWrap}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <View
                      key={i}
                      style={[styles.strengthBar, { backgroundColor: i <= strength ? strengthColor[strength] : C.border }]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strengthColor[strength] }]}>
                  {strengthLabel[strength]}
                </Text>
              </View>
            )}

            <Field
              label="Confirm Password" value={confirm} onChange={setConfirm}
              placeholder="Repeat your password"
              icon="shield-checkmark-outline" focusAnim={confFocus} error={errors.confirm}
              secure showToggle={showConf} onToggle={() => setShowConf(!showConf)}
            />

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} onPress={() => { setTerms(!terms); setErrors(e => ({ ...e, terms: undefined })); }}>
              <View style={[styles.checkbox, terms && styles.checkboxActive]}>
                {terms && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={[styles.errorText, { marginTop: -8, marginBottom: 12 }]}>{errors.terms}</Text>}

            {/* Anonymous note */}
            <View style={styles.anonNote}>
              <Ionicons name="shield-outline" size={15} color={C.primary} />
              <Text style={styles.anonNoteText}>
                Your data is private. You can use Humura anonymously at any time.
              </Text>
            </View>

            {/* Signup button */}
            <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading} activeOpacity={0.88}>
              <LinearGradient colors={[C.primary, C.accent]} style={styles.signupBtnGrad}>
                {loading ? (
                  <Text style={styles.signupBtnText}>Creating account...</Text>
                ) : (
                  <>
                    <Text style={styles.signupBtnText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Anonymous skip */}
            <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
              <Ionicons name="eye-off-outline" size={15} color={C.textSoft} />
              <Text style={styles.skipText}>Skip — continue anonymously</Text>
            </TouchableOpacity>

          </View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
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
  heroContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logoBox: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.65)' },

  scroll: { paddingHorizontal: 16 },
  card: {
    backgroundColor: C.card, borderRadius: 24, padding: 24,
    marginTop: 16,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  formTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginBottom: 20 },

  fieldWrap: { marginBottom: 14 },
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

  // Password strength
  strengthWrap: { flexDirection: 'row', alignItems: 'center', marginTop: -6, marginBottom: 14, gap: 10 },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '700', minWidth: 70, textAlign: 'right' },

  // Terms
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: C.primary, borderColor: C.primary },
  termsText: { flex: 1, fontSize: 13, color: C.textMid, lineHeight: 20 },
  termsLink: { color: C.primary, fontWeight: '600' },

  // Anon note
  anonNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: C.sky, borderRadius: 12, padding: 12, marginBottom: 20, gap: 10 },
  anonNoteText: { flex: 1, fontSize: 12, color: C.textMid, lineHeight: 18 },

  // Buttons
  signupBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 14 },
  signupBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  signupBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 8 },
  skipText: { fontSize: 13, color: C.textSoft, fontWeight: '500' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: C.textSoft },
  loginLink: { fontSize: 14, color: C.primary, fontWeight: '700' },
});
