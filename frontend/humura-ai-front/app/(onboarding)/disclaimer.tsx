import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DisclaimerOnboarding() {
  const router = useRouter();

  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, '#fff']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning-outline" size={60} color="#F59E0B" />
          </View>

          <Text style={styles.title}>Important Notice</Text>
          <Text style={styles.subtitle}>
            Please read these points carefully before you begin your journey with Humura Shenge.
          </Text>

          <View style={styles.disclaimerBox}>
            <View style={styles.disclaimerItem}>
              <View style={styles.bullet} />
              <Text style={styles.disclaimerText}>
                Humura Shenge provides information and professional guidance, but it is <Text style={styles.bold}>not a replacement for emergency medical care.</Text>
              </Text>
            </View>

            <View style={styles.disclaimerItem}>
              <View style={styles.bullet} />
              <Text style={styles.disclaimerText}>
                In case of a physical emergency or life-threatening situation, please go directly to the nearest hospital or call <Text style={styles.bold}>112</Text>.
              </Text>
            </View>

            <View style={styles.disclaimerItem}>
              <View style={styles.bullet} />
              <Text style={styles.disclaimerText}>
                If you have experienced violence, you can find the nearest <Text style={styles.bold}>Isange One Stop Centre</Text> through our clinic locator.
              </Text>
            </View>

            <View style={styles.disclaimerItem}>
              <View style={styles.bullet} />
              <Text style={styles.disclaimerText}>
                By continuing, you agree to our terms and understand that we prioritize your safety above all else.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleFinish}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Enter Safe Space</Text>
              <Ionicons name="shield-checkmark" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  scroll: { paddingHorizontal: 30, alignItems: 'center', paddingBottom: 40 },
  iconContainer: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 30, marginTop: 20
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  
  disclaimerBox: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 24, padding: 24, width: '100%',
    borderWidth: 1, borderColor: '#FDE68A'
  },
  disclaimerItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, gap: 12 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginTop: 8 },
  disclaimerText: { flex: 1, fontSize: 15, color: Colors.text, lineHeight: 22 },
  bold: { fontWeight: '700', color: Colors.text },

  footer: { paddingHorizontal: 30, paddingBottom: 30 },
  button: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
