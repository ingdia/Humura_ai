import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Switch, TextInput, Alert, StatusBar
} from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfessional, AvailabilityMatrix } from '../../src/contexts/ProfessionalContext';
import { useAuth } from '../../src/contexts/AuthContext';


export default function ProfessionalProfile() {
  const router = useRouter();
  const { logout } = useAuth();
  const { 
    profile, 
    updateProfile, 
    availability, 
    toggleAvailabilityDay, 
    updateAvailabilityHours 
  } = useProfessional();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedSpecialty, setEditedSpecialty] = useState(profile.specialization);
  const [editedBio, setEditedBio] = useState(profile.bio);
  const [editedClinic, setEditedClinic] = useState(profile.clinic);
  const [editedRate, setEditedRate] = useState(profile.rate);

  // Availability matrices keys
  const weekdays: (keyof AvailabilityMatrix)[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleSaveProfile = () => {
    if (!editedName.trim()) {
      Alert.alert("Name Required", "Please enter your professional name.");
      return;
    }
    
    updateProfile({
      name: editedName.trim(),
      specialization: editedSpecialty.trim(),
      bio: editedBio.trim(),
      clinic: editedClinic.trim(),
      rate: editedRate.trim(),
    });
    
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your changes have been saved successfully.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Log Out",
      "Are you sure you want to log out from your professional account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              // Fallback if useAuth logout encounters issues in routing
              router.replace('/(auth)/login');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="person" size={18} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>Profile & Practice</Text>
        </View>
        <View style={styles.titleUnderline} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* AVATAR & BASIC DESCRIPTION */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{profile.name.charAt(0) || 'D'}</Text>
            <TouchableOpacity style={styles.avatarEditBadge} activeOpacity={0.8}>
              <Ionicons name="camera" size={13} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          {!isEditing ? (
            <>
              <Text style={styles.nameText}>{profile.name}</Text>
              <Text style={styles.specialtyText}>{profile.specialization}</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
              
              <TouchableOpacity 
                style={styles.editBtn} 
                onPress={() => setIsEditing(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="create" size={16} color={Colors.primary} />
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Professional Name</Text>
                <TextInput 
                  style={styles.textInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="e.g. Dr. Amina Uwase"
                  placeholderTextColor={Colors.tabInactive}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Specialization</Text>
                <TextInput 
                  style={styles.textInput}
                  value={editedSpecialty}
                  onChangeText={setEditedSpecialty}
                  placeholder="e.g. Clinical Psychologist"
                  placeholderTextColor={Colors.tabInactive}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Professional Bio</Text>
                <TextInput 
                  style={[styles.textInput, styles.textArea]}
                  value={editedBio}
                  onChangeText={setEditedBio}
                  placeholder="Describe your mental health approach, CBT, guidance..."
                  placeholderTextColor={Colors.tabInactive}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formRow}>
                <TouchableOpacity 
                  style={[styles.formBtn, styles.cancelBtn]}
                  onPress={() => {
                    setEditedName(profile.name);
                    setEditedSpecialty(profile.specialization);
                    setEditedBio(profile.bio);
                    setEditedClinic(profile.clinic);
                    setEditedRate(profile.rate);
                    setIsEditing(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.formBtn, styles.saveBtn]}
                  onPress={handleSaveProfile}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* PRACTICE DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Settings</Text>
          <View style={styles.card}>
            {isEditing ? (
              <View style={{ padding: Spacing.md }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Clinic Affiliation</Text>
                  <TextInput 
                    style={styles.textInput}
                    value={editedClinic}
                    onChangeText={setEditedClinic}
                    placeholder="e.g. Kigali Mental Health Center"
                    placeholderTextColor={Colors.tabInactive}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Hourly Therapy Rate</Text>
                  <TextInput 
                    style={styles.textInput}
                    value={editedRate}
                    onChangeText={setEditedRate}
                    placeholder="e.g. 25,000 RWF"
                    placeholderTextColor={Colors.tabInactive}
                  />
                </View>
              </View>
            ) : (
              <>
                <View style={styles.cardRow}>
                  <View style={styles.cardRowLeft}>
                    <Ionicons name="business" size={20} color={Colors.tabInactive} />
                    <Text style={styles.cardRowLabel}>Clinic Affiliation</Text>
                  </View>
                  <Text style={styles.cardRowValue}>{profile.clinic}</Text>
                </View>
                <View style={styles.cardDivider} />
                <View style={styles.cardRow}>
                  <View style={styles.cardRowLeft}>
                    <Ionicons name="cash" size={20} color={Colors.tabInactive} />
                    <Text style={styles.cardRowLabel}>Hourly Therapy Rate</Text>
                  </View>
                  <Text style={styles.cardRowValue}>{profile.rate}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* AVAILABILITY SCHEDULER MATRIX */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Availability</Text>
          <Text style={styles.sectionHelperText}>Set active work hours for student/patient calendar bookings.</Text>
          
          <View style={styles.card}>
            {weekdays.map((day, index) => {
              const daySchedule = availability[day];
              return (
                <View key={day}>
                  <View style={styles.availabilityRow}>
                    <TouchableOpacity 
                      style={styles.daySelection}
                      onPress={() => toggleAvailabilityDay(day)}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={daySchedule.enabled ? "checkmark-circle" : "ellipse-outline"} 
                        size={22} 
                        color={daySchedule.enabled ? Colors.positive : Colors.tabInactive} 
                      />
                      <Text style={[styles.dayNameText, !daySchedule.enabled && { color: Colors.tabInactive }]}>
                        {day}
                      </Text>
                    </TouchableOpacity>

                    {daySchedule.enabled ? (
                      <View style={styles.hoursBox}>
                        <TextInput 
                          style={styles.hoursInput}
                          value={daySchedule.hours}
                          onChangeText={(text) => updateAvailabilityHours(day, text)}
                          placeholder="09:00 - 17:00"
                          placeholderTextColor={Colors.tabInactive}
                        />
                        <Ionicons name="pencil-sharp" size={10} color={Colors.primary} />
                      </View>
                    ) : (
                      <View style={[styles.hoursBox, { backgroundColor: '#F3F6FA', borderColor: '#E5E9F0' }]}>
                        <Text style={styles.hoursOfflineText}>Unavailable</Text>
                      </View>
                    )}
                  </View>
                  {index < weekdays.length - 1 && <View style={styles.cardDivider} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={20} color="#F44336" />
          <Text style={styles.logoutText}>End Professional Session</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    ...Shadows.soft,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#9B59B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  titleUnderline: {
    width: 32,
    height: 4,
    backgroundColor: '#9B59B6',
    borderRadius: 2,
    marginTop: 8,
  },
  container: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    ...Shadows.soft,
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: Spacing.sm,
    borderWidth: 3,
    borderColor: '#E8F4FD',
    ...Shadows.soft,
  },
  avatarLetter: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.white,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.secondary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  specialtyText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  bioText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
    paddingHorizontal: 8,
    fontWeight: '500',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Border.radiusFull,
    marginTop: 14,
    gap: 6,
  },
  editBtnText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
  editForm: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    marginLeft: 2,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EBF2FA',
    borderRadius: Border.radius,
    padding: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  formBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Border.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    ...Shadows.soft,
  },
  saveBtnText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  sectionHelperText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
    marginBottom: 10,
    fontWeight: '500',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    ...Shadows.soft,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardRowLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  cardRowValue: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F6FA',
    marginHorizontal: Spacing.md,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  daySelection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dayNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    width: 80,
  },
  hoursBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Border.radius,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    gap: 6,
  },
  hoursInput: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
    padding: 0,
    width: 90,
    textAlign: 'center',
  },
  hoursOfflineText: {
    fontSize: 13,
    color: Colors.tabInactive,
    fontWeight: '700',
    width: 90,
    textAlign: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: '#FFF5F5',
    borderRadius: Border.radiusLg,
    borderWidth: 1,
    borderColor: '#FFE3E3',
    gap: 8,
  },
  logoutText: {
    color: '#F44336',
    fontWeight: '800',
    fontSize: 15,
  },
});
