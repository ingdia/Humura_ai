import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfessionalDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>Dr. Uwase</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/(professional-tabs)/profile')}>
            <Ionicons name="person-circle-outline" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#E8F4FD' }]}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Today's{'\n'}Appointments</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3E6' }]}>
              <Ionicons name="help-circle" size={24} color="#F39C12" />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Pending{'\n'}Q&A</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.appointmentTime}>10:00 AM - 11:00 AM</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
          <View style={styles.appointmentBody}>
            <View style={styles.patientInfo}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>J</Text>
              </View>
              <View>
                <Text style={styles.patientName}>John Doe</Text>
                <Text style={styles.patientType}>Initial Consultation</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.meetButton}>
              <Ionicons name="videocam" size={18} color={Colors.white} />
              <Text style={styles.meetButtonText}>Join Meet</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: 100, // padding for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileIcon: {
    ...Shadows.soft,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius,
    padding: Spacing.md,
    width: '48%',
    ...Shadows.soft,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius,
    padding: Spacing.md,
    ...Shadows.soft,
    marginBottom: Spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: Spacing.sm,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.radiusSm,
  },
  statusText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  appointmentBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  patientType: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  meetButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Border.radius,
  },
  meetButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});
