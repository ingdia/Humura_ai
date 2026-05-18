import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, ImageBackground, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width } = Dimensions.get('window');

export default function ClinicLocatorScreen() {
  const { t, language } = useLanguage();

  const CLINICS = [
    {
      id: '1',
      name: 'Isange One Stop Centre - Kacyiru',
      type: 'Emergency Support & Medical',
      address: 'Kacyiru District Hospital, Kigali',
      dist: '2.4 km away',
      icon: 'shield-checkmark',
      color: '#E74C3C',
      isange: true
    },
    {
      id: '2',
      name: 'Youth Friendly Center - Kimisagara',
      type: 'SRH & Counseling',
      address: 'Kimisagara, Nyarugenge',
      dist: '3.1 km away',
      icon: 'people',
      color: '#4a90e2',
    },
    {
      id: '3',
      name: 'Rwanda Military Hospital',
      type: 'General & Specialist Medical',
      address: 'Kanombe, Kicukiro',
      dist: '8.5 km away',
      icon: 'medical',
      color: '#27AE60',
    }
  ];

  const openMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('clinic_locator')}</Text>
        <Text style={styles.headerSub}>Find safe, youth-friendly clinics and Isange centers near you.</Text>
        <View style={styles.titleUnderline} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Map Preview */}
        <View style={styles.mapCard}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80' }} 
            style={styles.mapImage}
            imageStyle={{ borderRadius: 28 }}
          >
            <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.8)']} style={styles.mapOverlay}>
              <View style={styles.mapMarker}>
                <Ionicons name="location" size={24} color={Colors.primary} />
              </View>
              <View style={styles.mapInfo}>
                <Text style={styles.mapInfoText}>Tracking your current location...</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearest Services</Text>
          {CLINICS.map(c => (
            <TouchableOpacity key={c.id} style={styles.clinicCard} onPress={() => openMap(c.address)} activeOpacity={0.9}>
              <View style={[styles.clinicIconBox, { backgroundColor: c.color + '15' }]}>
                <Ionicons name={c.icon as any} size={24} color={c.color} />
              </View>
              <View style={styles.clinicInfo}>
                <View style={styles.clinicHeader}>
                  <Text style={styles.clinicName}>{c.name}</Text>
                  {c.isange && (
                    <View style={styles.isangeBadge}>
                      <Text style={styles.isangeText}>ISANGE</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.clinicType}>{c.type}</Text>
                <Text style={styles.clinicAddress}>{c.address}</Text>
                <View style={styles.clinicFooter}>
                  <Text style={styles.clinicDist}>{c.dist}</Text>
                  <TouchableOpacity style={styles.dirBtn} onPress={() => openMap(c.address)}>
                    <Ionicons name="navigate-circle" size={20} color={Colors.primary} />
                    <Text style={styles.dirBtnText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24, backgroundColor: Colors.white, ...Shadows.soft },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 14, color: Colors.textMuted, marginTop: 4, fontWeight: '500', lineHeight: 20 },
  titleUnderline: { width: 40, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 12 },

  scroll: { padding: 20 },
  
  mapCard: { height: 200, borderRadius: 28, overflow: 'hidden', ...Shadows.soft, marginBottom: 30 },
  mapImage: { flex: 1 },
  mapOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapMarker: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', ...Shadows.premium },
  mapInfo: { position: 'absolute', bottom: 15, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  mapInfoText: { fontSize: 12, fontWeight: '700', color: Colors.text },

  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  
  clinicCard: { 
    backgroundColor: '#fff', borderRadius: 24, padding: 16, 
    flexDirection: 'row', gap: 16, marginBottom: 16, 
    borderWidth: 1, borderColor: '#F1F5F9', ...Shadows.soft 
  },
  clinicIconBox: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  clinicInfo: { flex: 1 },
  clinicHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  clinicName: { fontSize: 16, fontWeight: '800', color: Colors.text, flex: 1 },
  isangeBadge: { backgroundColor: '#E74C3C', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  isangeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  clinicType: { fontSize: 12, color: Colors.primary, fontWeight: '700', marginBottom: 4 },
  clinicAddress: { fontSize: 13, color: Colors.textMuted, marginBottom: 12 },
  clinicFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clinicDist: { fontSize: 12, fontWeight: '700', color: Colors.text },
  dirBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dirBtnText: { fontSize: 13, fontWeight: '800', color: Colors.primary },
});
