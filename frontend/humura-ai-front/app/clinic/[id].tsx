import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../../src/constants/theme';

export default function ClinicSpecialistsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const MOCK_SPECIALISTS = [
    { id: '1', name: 'Dr. Amina Uwase', role: 'Clinical Psychologist', rating: 4.9, photo: 'https://images.unsplash.com/photo-1594824432258-29367468817d?auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'Nurse Grace Nkusi', role: 'SRH Nurse', rating: 4.8, photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clinic Specialists</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {MOCK_SPECIALISTS.map(s => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: s.photo }} style={styles.photo} />
              <View style={styles.info}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.role}>{s.role}</Text>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.rating}>{s.rating}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => router.push(`/thread/${s.id}` as any)}>
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                <Text style={styles.btnText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]}>
                <Ionicons name="call" size={20} color={Colors.primary} />
                <Text style={styles.btnOutlineText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]}>
                <Ionicons name="calendar" size={20} color={Colors.primary} />
                <Text style={styles.btnOutlineText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 40, backgroundColor: '#fff', ...Shadows.soft },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  scroll: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, ...Shadows.soft },
  cardHeader: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  photo: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E2E8F0' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: '800', color: Colors.text },
  role: { fontSize: 14, color: Colors.textMuted, marginTop: 2, marginBottom: 6 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  rating: { fontSize: 12, fontWeight: '700', color: '#B45309' },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 12, gap: 6 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary },
  btnOutlineText: { color: Colors.primary, fontWeight: '800', fontSize: 14 }
});
