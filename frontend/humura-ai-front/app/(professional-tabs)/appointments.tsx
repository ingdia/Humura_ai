import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Switch } from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfessionalAppointments() {
  const [tab, setTab] = useState('upcoming'); // upcoming or pending
  const [isTeleconsultation, setIsTeleconsultation] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, tab === 'upcoming' && styles.tabButtonActive]}
          onPress={() => setTab('upcoming')}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, tab === 'pending' && styles.tabButtonActive]}
          onPress={() => setTab('pending')}
        >
          <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>Pending Requests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {tab === 'upcoming' ? (
          <>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>Today, May 20</Text>
            </View>
            
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTime}>10:00 AM - 11:00 AM</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Confirmed (Virtual)</Text>
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
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                  <Ionicons name="videocam" size={16} color={Colors.white} style={{marginRight: 4}} />
                  <Text style={styles.primaryButtonText}>Start Teleconsultation</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTime}>May 21, 2:00 PM</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#FFF3CD' }]}>
                  <Text style={[styles.statusText, { color: '#856404' }]}>Pending Approval</Text>
                </View>
              </View>
              
              <View style={styles.appointmentBody}>
                <View style={styles.patientInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>A</Text>
                  </View>
                  <View>
                    <Text style={styles.patientName}>Alice Smith</Text>
                    <Text style={styles.patientType}>Follow-up Session</Text>
                  </View>
                </View>
              </View>
              
              {/* Teleconsultation Toggle */}
              <View style={styles.teleconsultContainer}>
                <View style={styles.teleconsultHeader}>
                  <Ionicons name={isTeleconsultation ? "videocam" : "business"} size={20} color={Colors.primary} />
                  <Text style={styles.teleconsultText}>
                    {isTeleconsultation ? "Teleconsultation (Virtual)" : "In-Person (Clinic)"}
                  </Text>
                </View>
                <Switch 
                  value={isTeleconsultation} 
                  onValueChange={setIsTeleconsultation} 
                  trackColor={{ true: Colors.primary }} 
                />
              </View>

              {isTeleconsultation && (
                <View style={styles.linkInputContainer}>
                  <Ionicons name="link" size={18} color={Colors.textMuted} style={styles.linkIcon} />
                  <TextInput 
                    style={styles.linkInput}
                    placeholder="Provide a meeting link (Google Meet, Zoom)"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
                  <Text style={styles.dangerButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.successButton]}>
                  <Text style={styles.primaryButtonText}>Accept Booking</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: 100, // padding for bottom tabs
  },
  dateHeader: {
    marginBottom: Spacing.md,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius,
    padding: Spacing.md,
    ...Shadows.soft,
    marginBottom: Spacing.lg,
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
    fontSize: 15,
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
    marginBottom: Spacing.md,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  patientType: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  teleconsultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: Spacing.sm,
    borderRadius: Border.radiusSm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: Spacing.md,
  },
  teleconsultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teleconsultText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  linkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Border.radiusSm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  linkIcon: {
    marginRight: Spacing.sm,
  },
  linkInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Border.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
    marginRight: Spacing.sm,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  dangerButton: {
    backgroundColor: '#FDEDEC',
    marginRight: Spacing.sm,
  },
  dangerButtonText: {
    color: '#E74C3C',
    fontWeight: '600',
    fontSize: 14,
  },
  successButton: {
    backgroundColor: Colors.positive,
    marginLeft: Spacing.sm,
  },
});
