import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Haversine formula
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

export default function ClinicLocatorScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ON_HUMURA' | 'NEARBY'>('ALL');

  const MOCK_CLINICS = [
    {
      id: '1',
      name: 'Kigali Health Clinic',
      type: 'Private Clinic',
      address: 'KG 11 Ave, Gasabo, Kigali',
      phone: '0788000001',
      lat: -1.9441,
      lon: 30.0619,
      isOnboarded: true,
      specialistCount: 3,
    },
    {
      id: '2',
      name: 'Isange One Stop Centre - Kacyiru',
      type: 'Emergency Support & Medical',
      address: 'Kacyiru District Hospital, Kigali',
      phone: '0788000002',
      lat: -1.9445,
      lon: 30.0600,
      isOnboarded: false,
    },
    {
      id: '3',
      name: 'Youth Friendly Center - Kimisagara',
      type: 'SRH & Counseling',
      address: 'Kimisagara, Nyarugenge',
      phone: '0788000003',
      lat: -1.9540,
      lon: 30.0520,
      isOnboarded: false,
    }
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Showing defaults for Kigali.');
        // Fallback Kigali coords
        setLocation({
          coords: { latitude: -1.9441, longitude: 30.0619, altitude: null as any, accuracy: null as any, altitudeAccuracy: null as any, heading: null as any, speed: null as any },
          timestamp: Date.now()
        });
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const openMap = (lat: number, lon: number, label: string) => {
    const url = `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(label)})`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
    });
  };

  const dialPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const processedClinics = MOCK_CLINICS.map(c => {
    let dist = 0;
    if (location) {
      dist = getDistanceFromLatLonInKm(location.coords.latitude, location.coords.longitude, c.lat, c.lon);
    }
    return { ...c, distanceKm: dist };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const filteredClinics = processedClinics.filter(c => {
    if (filter === 'ALL') return true;
    if (filter === 'ON_HUMURA') return c.isOnboarded;
    if (filter === 'NEARBY') return true; 
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('clinic_locator')}</Text>
        <Text style={styles.headerSub}>Find safe, youth-friendly clinics and Isange centers near you.</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* Filter Toggle */}
      <View style={styles.filterContainer}>
        {['ALL', 'ON_HUMURA', 'NEARBY'].map(f => (
          <TouchableOpacity 
            key={f} 
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f as any)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Map Preview */}
        <View style={styles.mapCard}>
          {location ? (
            <MapView
              style={styles.mapImage}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation
            >
              {MOCK_CLINICS.map(c => (
                <Marker
                  key={c.id}
                  coordinate={{ latitude: c.lat, longitude: c.lon }}
                  title={c.name}
                  description={c.type}
                  pinColor={c.isOnboarded ? Colors.primary : '#E74C3C'}
                />
              ))}
            </MapView>
          ) : (
            <View style={[styles.mapImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0' }]}>
              <Text>Loading map...</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          {filteredClinics.map(c => (
            <View key={c.id} style={styles.clinicCard}>
              <View style={styles.clinicHeader}>
                <Text style={styles.clinicName}>{c.name}</Text>
                {c.isOnboarded ? (
                  <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.badgeText, { color: '#2E7D32' }]}>✅ On Humura</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[styles.badgeText, { color: '#EF6C00' }]}>📍 Nearby</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.clinicType}>{c.type} • {c.distanceKm.toFixed(1)} km away</Text>
              
              {!c.isOnboarded && (
                <>
                  <Text style={styles.clinicAddress}>{c.address}</Text>
                  <Text style={styles.clinicAddress}>{c.phone}</Text>
                </>
              )}

              {c.isOnboarded && (
                <Text style={styles.specialistCount}>{c.specialistCount} Specialists Available</Text>
              )}

              <View style={styles.clinicFooter}>
                {c.isOnboarded ? (
                  <TouchableOpacity 
                    style={styles.primaryBtn} 
                    onPress={() => router.push(`/clinic/${c.id}` as any)}
                  >
                    <Text style={styles.primaryBtnText}>View Specialists →</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.outlineBtn} onPress={() => openMap(c.lat, c.lon, c.name)}>
                      <Ionicons name="navigate" size={16} color={Colors.primary} />
                      <Text style={styles.outlineBtnText}>Get Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineBtn} onPress={() => dialPhone(c.phone)}>
                      <Ionicons name="call" size={16} color={Colors.primary} />
                      <Text style={styles.outlineBtnText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 20, backgroundColor: Colors.white, ...Shadows.soft },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 14, color: Colors.textMuted, marginTop: 4, fontWeight: '500', lineHeight: 20 },
  titleUnderline: { width: 40, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 12 },

  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, gap: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '800', color: Colors.textMuted },
  filterTextActive: { color: '#fff' },

  scroll: { padding: 20 },
  
  mapCard: { height: 200, borderRadius: 28, overflow: 'hidden', ...Shadows.soft, marginBottom: 20 },
  mapImage: { flex: 1 },

  section: { marginTop: 10 },
  
  clinicCard: { 
    backgroundColor: '#fff', borderRadius: 24, padding: 20, 
    marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', ...Shadows.soft 
  },
  clinicHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  clinicName: { fontSize: 18, fontWeight: '900', color: Colors.text, flex: 1, marginRight: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  clinicType: { fontSize: 13, color: Colors.textMuted, fontWeight: '600', marginBottom: 12 },
  clinicAddress: { fontSize: 13, color: Colors.text, marginBottom: 4 },
  specialistCount: { fontSize: 13, color: Colors.primary, fontWeight: '800', marginBottom: 12 },
  
  clinicFooter: { marginTop: 12 },
  primaryBtn: { backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 12 },
  outlineBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary, gap: 6 },
  outlineBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '800' },
});
