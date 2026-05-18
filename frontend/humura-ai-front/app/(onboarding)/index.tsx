import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../src/constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeOnboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80' }} 
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient 
          colors={['rgba(10,22,40,0.4)', 'rgba(10,22,40,0.95)']} 
          style={StyleSheet.absoluteFill} 
        />
      </ImageBackground>
      
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.logoGradient}>
                <Ionicons name="leaf" size={32} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Humura Shenge</Text>
            <Text style={styles.subtitle}>Your Secure Journey to Health & Freedom</Text>
          </View>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark" size={22} color="#fff" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Total Anonymity</Text>
                <Text style={styles.featureSub}>Your identity is protected. Ask safely.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="chatbubbles" size={22} color="#fff" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Expert Care</Text>
                <Text style={styles.featureSub}>24/7 Access to SRH professionals.</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="compass" size={22} color="#fff" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>360 Support</Text>
                <Text style={styles.featureSub}>Mental, clinical, and social guidance.</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/(onboarding)/privacy')}
          >
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Start My Safe Journey</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.footerNote}>Privacy is our Promise</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  safe: { flex: 1, paddingHorizontal: 32 },
  content: { flex: 1, justifyContent: 'flex-end', paddingBottom: 60 },
  header: { alignItems: 'flex-start', marginBottom: 40 },
  logoContainer: { marginBottom: 20 },
  logoGradient: {
    width: 64, height: 64, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.premium
  },
  title: { fontSize: 38, fontWeight: '900', color: '#fff', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 18, color: 'rgba(255,255,255,0.7)', fontWeight: '600', lineHeight: 26 },
  
  featureList: { width: '100%', gap: 28 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  iconCircle: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  featureSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 20, fontWeight: '500' },

  footer: { paddingBottom: 40 },
  button: { width: '100%', borderRadius: 20, overflow: 'hidden', ...Shadows.premium },
  buttonGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 20, gap: 12
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  footerNote: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 20, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
});
