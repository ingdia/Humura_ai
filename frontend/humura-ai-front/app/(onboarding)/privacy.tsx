import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/theme';

export default function PrivacyOnboarding() {
  const router = useRouter();

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
            <Ionicons name="lock-closed" size={60} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Your privacy is our priority</Text>
          <Text style={styles.subtitle}>
            We understand that sexual health is private. Humura Shenge is built to keep your identity safe.
          </Text>

          <View style={styles.card}>
            <View style={styles.cardItem}>
              <Ionicons name="eye-off" size={24} color={Colors.primary} style={styles.cardIcon} />
              <View>
                <Text style={styles.cardTitle}>Complete Anonymity</Text>
                <Text style={styles.cardText}>You don't need to use your real name or photo.</Text>
              </View>
            </View>

            <View style={styles.cardItem}>
              <Ionicons name="shield-outline" size={24} color={Colors.primary} style={styles.cardIcon} />
              <View>
                <Text style={styles.cardTitle}>Secure Data</Text>
                <Text style={styles.cardText}>All messages are encrypted and never shared with 3rd parties.</Text>
              </View>
            </View>

            <View style={styles.cardItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.primary} style={styles.cardIcon} />
              <View>
                <Text style={styles.cardTitle}>Rwanda Compliant</Text>
                <Text style={styles.cardText}>We follow local data protection laws strictly.</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(onboarding)/disclaimer')}
          >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.buttonGradient}
              >
              <Text style={styles.buttonText}>I Understand</Text>
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
    backgroundColor: 'rgba(74,144,226,0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 30, marginTop: 20
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 4
  },
  cardItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
  cardIcon: { marginTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  cardText: { fontSize: 14, color: Colors.textMuted, lineHeight: 20, paddingRight: 20 },

  footer: { paddingHorizontal: 30, paddingBottom: 30 },
  button: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
