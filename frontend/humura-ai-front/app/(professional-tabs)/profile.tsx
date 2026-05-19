import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch, TextInput } from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfessionalProfile() {
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [acceptingPatients, setAcceptingPatients] = useState(true);

  // Sample availability state
  const [availability, setAvailability] = useState({
    Monday: { enabled: true, hours: '09:00 - 17:00' },
    Tuesday: { enabled: true, hours: '09:00 - 17:00' },
    Wednesday: { enabled: false, hours: 'Off' },
    Thursday: { enabled: true, hours: '10:00 - 14:00' },
    Friday: { enabled: true, hours: '09:00 - 13:00' },
  });

  const toggleDay = (day: keyof typeof availability) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Availability</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Profile Setup Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>U</Text>
            <TouchableOpacity style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          {isEditingProfile ? (
            <View style={styles.editForm}>
              <TextInput style={styles.input} defaultValue="Dr. Uwase" placeholder="Full Name" />
              <TextInput style={styles.input} defaultValue="Clinical Psychologist" placeholder="Specialization" />
              <TextInput 
                style={[styles.input, { height: 80 }]} 
                defaultValue="Passionate about mental well-being and CBT." 
                placeholder="Bio" 
                multiline 
              />
              <TouchableOpacity style={styles.saveButton} onPress={() => setIsEditingProfile(false)}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.name}>Dr. Uwase</Text>
              <Text style={styles.specialization}>Clinical Psychologist</Text>
              <Text style={styles.bio}>Passionate about mental well-being and Cognitive Behavioral Therapy (CBT).</Text>
              
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditingProfile(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Practice Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Details</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="medical-outline" size={22} color={Colors.textMuted} />
                <Text style={styles.rowText}>Clinic Affiliation</Text>
              </View>
              <Text style={styles.rowValue}>Kigali Mental Health</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="cash-outline" size={22} color={Colors.textMuted} />
                <Text style={styles.rowText}>Hourly Rate</Text>
              </View>
              <Text style={styles.rowValue}>25,000 RWF</Text>
            </View>
          </View>
        </View>

        {/* Shared Availability Matrix */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Share Availability</Text>
            <Switch 
              value={acceptingPatients} 
              onValueChange={setAcceptingPatients} 
              trackColor={{ true: Colors.primary }} 
            />
          </View>
          <Text style={styles.helperText}>Set your weekly schedule so patients can book sessions.</Text>
          
          <View style={styles.card}>
            {Object.keys(availability).map((day, index) => {
              const dayKey = day as keyof typeof availability;
              const { enabled, hours } = availability[dayKey];
              return (
                <View key={day}>
                  <View style={styles.availabilityRow}>
                    <TouchableOpacity style={styles.dayToggle} onPress={() => toggleDay(dayKey)}>
                      <Ionicons 
                        name={enabled ? "checkmark-circle" : "ellipse-outline"} 
                        size={22} 
                        color={enabled ? Colors.positive : Colors.textMuted} 
                      />
                      <Text style={[styles.dayText, !enabled && { color: Colors.textMuted }]}>{day}</Text>
                    </TouchableOpacity>
                    <View style={styles.hoursBox}>
                      <Text style={[styles.hoursText, !enabled && { color: Colors.textMuted }]}>
                        {enabled ? hours : 'Unavailable'}
                      </Text>
                    </View>
                  </View>
                  {index < Object.keys(availability).length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/(auth)')}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
  container: {
    padding: Spacing.lg,
    paddingBottom: 100, 
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  specialization: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  editButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Border.radiusFull,
    backgroundColor: '#E8F4FD',
  },
  editButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  editForm: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: Border.radiusSm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    fontSize: 15,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Border.radius,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginLeft: 4,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius,
    ...Shadows.soft,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  rowValue: {
    fontSize: 15,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: Spacing.md,
    marginRight: Spacing.md,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  dayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginLeft: Spacing.sm,
    width: 90,
  },
  hoursBox: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.radiusSm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  hoursText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    color: '#F44336',
    fontWeight: '800',
    fontSize: 15,
  },
});
