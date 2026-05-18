import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROVINCES = ['Kigali City', 'East', 'West', 'North', 'South'];
const DISTRICTS: Record<string, string[]> = {
  'Kigali City': ['Nyarugenge', 'Kicukiro', 'Gasabo'],
  'East': ['Nyagatare', 'Gatsibo', 'Kayonza', 'Rwamagana', 'Ngoma', 'Kirehe', 'Bugesera'],
  'West': ['Rubavu', 'Nyabihu', 'Ngororero', 'Karongi', 'Rutsiro', 'Nyamasheke', 'Rusizi'],
  'North': ['Musanze', 'Burera', 'Gicumbi', 'Rulindo', 'Gakenke'],
  'South': ['Huye', 'Nyanza', 'Gisagara', 'Nyamagabe', 'Nyaruguru', 'Kamonyi', 'Muhanga', 'Ruhango'],
};

export default function DetailsOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Gender, 2: Location
  const [gender, setGender] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  const handleFinish = async () => {
    // Save details locally
    await AsyncStorage.setItem('userGender', gender || '');
    await AsyncStorage.setItem('userProvince', province || '');
    await AsyncStorage.setItem('userDistrict', district || '');
    
    // Redirect to Tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, '#fff']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safe}>
        <View style={styles.progress}>
          <View style={[styles.progressBar, { width: `${(step / 2) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Help us personalize your experience</Text>
              <Text style={styles.subtitle}>Choose your gender to receive relevant support.</Text>
              
              <View style={styles.optionRow}>
                <TouchableOpacity 
                  style={[styles.optionCard, gender === 'Girl' && styles.optionSelected]}
                  onPress={() => setGender('Girl')}
                >
                  <View style={[styles.iconCircle, gender === 'Girl' && styles.iconSelected]}>
                    <Ionicons name="woman" size={32} color={gender === 'Girl' ? '#fff' : Colors.primary} />
                  </View>
                  <Text style={[styles.optionText, gender === 'Girl' && styles.optionTextSelected]}>Girl</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.optionCard, gender === 'Boy' && styles.optionSelected]}
                  onPress={() => setGender('Boy')}
                >
                  <View style={[styles.iconCircle, gender === 'Boy' && styles.iconSelected]}>
                    <Ionicons name="man" size={32} color={gender === 'Boy' ? '#fff' : Colors.primary} />
                  </View>
                  <Text style={[styles.optionText, gender === 'Boy' && styles.optionTextSelected]}>Boy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Where are you located?</Text>
              <Text style={styles.subtitle}>This helps us find the nearest clinics for you.</Text>
              
              {!province ? (
                <View style={styles.list}>
                  {PROVINCES.map(p => (
                    <TouchableOpacity key={p} style={styles.listItem} onPress={() => setProvince(p)}>
                      <Text style={styles.listItemText}>{p} Province</Text>
                      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.list}>
                  <TouchableOpacity style={styles.backLink} onPress={() => { setProvince(null); setDistrict(null); }}>
                    <Ionicons name="arrow-back" size={16} color={Colors.primary} />
                    <Text style={styles.backLinkText}>Change Province ({province})</Text>
                  </TouchableOpacity>
                  
                  {DISTRICTS[province].map(d => (
                    <TouchableOpacity 
                      key={d} 
                      style={[styles.listItem, district === d && styles.listItemActive]} 
                      onPress={() => setDistrict(d)}
                    >
                      <Text style={[styles.listItemText, district === d && styles.listItemTextActive]}>{d}</Text>
                      {district === d && <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 1 ? (
            <TouchableOpacity 
              style={[styles.button, !gender && { opacity: 0.5 }]}
              disabled={!gender}
              onPress={() => setStep(2)}
            >
              <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, !district && { opacity: 0.5 }]}
              disabled={!district}
              onPress={handleFinish}
            >
              <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Finish Setup</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  progress: { height: 4, backgroundColor: '#E2E8F0', width: '100%' },
  progressBar: { height: '100%', backgroundColor: Colors.primary },
  scroll: { paddingHorizontal: 30, paddingTop: 40 },
  stepContent: { flex: 1 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  subtitle: { fontSize: 16, color: Colors.textMuted, lineHeight: 24, marginBottom: 40 },
  
  optionRow: { flexDirection: 'row', gap: 20 },
  optionCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 24, padding: 24,
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  optionSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(74,144,226,0.05)' },
  iconCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(74,144,226,0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  iconSelected: { backgroundColor: Colors.primary },
  optionText: { fontSize: 18, fontWeight: '700', color: Colors.text },
  optionTextSelected: { color: Colors.primary },

  list: { gap: 12 },
  listItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', padding: 20, borderRadius: 16,
    borderWidth: 1, borderColor: '#E2E8F0'
  },
  listItemActive: { borderColor: Colors.primary, backgroundColor: 'rgba(74,144,226,0.05)' },
  listItemText: { fontSize: 16, color: Colors.text, fontWeight: '600' },
  listItemTextActive: { color: Colors.primary, fontWeight: '700' },
  backLink: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  backLinkText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },

  footer: { padding: 30 },
  button: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  buttonGradient: { paddingVertical: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
