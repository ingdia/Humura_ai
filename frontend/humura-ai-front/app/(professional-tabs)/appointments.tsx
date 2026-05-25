import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Switch, TextInput, Linking, Alert, StatusBar, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { appointmentsAPI } from '../../src/services/api';
import { useFocusEffect } from '@react-navigation/native';

interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  scheduled_at: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  meet_link?: string;
  type?: string;
}

export default function ProfessionalAppointments() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await appointmentsAPI.list();
      setAppointments(res.data);
    } catch {
      // keep existing
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const [tab, setTab] = useState<'upcoming' | 'pending'>('upcoming');
  const [isTeleconsultation, setIsTeleconsultation] = useState(true);
  const [customLink, setCustomLink] = useState('');

  const upcomingList = appointments.filter(a => a.status === 'CONFIRMED');
  const pendingList  = appointments.filter(a => a.status === 'PENDING');

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAccept = async (appt: Appointment) => {
    try {
      await appointmentsAPI.updateStatus(appt.id, 'CONFIRMED');
      if (isTeleconsultation) {
        await appointmentsAPI.videoLink(appt.id);
      }
      setAppointments(prev => prev.map(a =>
        a.id === appt.id ? { ...a, status: 'CONFIRMED' } : a
      ));
      Alert.alert('Booking Approved', `Confirmed with ${appt.patient_name}.${isTeleconsultation ? '\nA Jitsi video link will be generated.' : ''}`, [{ text: 'Great' }]);
      setCustomLink('');
    } catch {
      Alert.alert('Error', 'Could not confirm appointment. Try again.');
    }
  };

  const handleDecline = (appt: Appointment) => {
    Alert.alert(
      'Decline Appointment',
      `Decline the request from ${appt.patient_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline', style: 'destructive',
          onPress: async () => {
            try {
              await appointmentsAPI.updateStatus(appt.id, 'CANCELLED');
              setAppointments(prev => prev.filter(a => a.id !== appt.id));
              Alert.alert('Declined', `Request from ${appt.patient_name} declined.`);
            } catch {
              Alert.alert('Error', 'Could not decline. Try again.');
            }
          },
        },
      ]
    );
  };

  const handleStartSession = (meetLink: string, patientName: string) => {
    if (!meetLink) {
      Alert.alert("Clinic Session", `This is scheduled as an In-Person session with ${patientName}. Please meet at Kigali Mental Health Center.`);
      return;
    }
    
    Alert.alert(
      "Start Teleconsultation",
      `Opening secure telemedicine call with ${patientName}.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Open Video Call", 
          onPress: () => {
            Linking.canOpenURL(meetLink).then(supported => {
              if (supported) {
                Linking.openURL(meetLink);
              } else {
                Alert.alert("Link Info", `Could not open link automatically. Copy and paste in your browser:\n\n${meetLink}`);
              }
            });
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
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="calendar" size={18} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>{t('pro_client_sessions')}</Text>
          </View>
        </View>
        <View style={styles.titleUnderline} />
      </View>
      
      {/* TAB SELECTOR */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, tab === 'upcoming' && styles.tabButtonActive]}
          onPress={() => setTab('upcoming')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>{t('pro_upcoming')}</Text>
          {upcomingList.length > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: '#E8F4FD' }]}>
              <Text style={[styles.tabBadgeText, { color: Colors.primary }]}>{upcomingList.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, tab === 'pending' && styles.tabButtonActive]}
          onPress={() => setTab('pending')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>{t('pro_pending_requests')}</Text>
          {pendingList.length > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: '#FDEDEC' }]}>
              <Text style={[styles.tabBadgeText, { color: '#E74C3C' }]}>{pendingList.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} tintColor={Colors.primary} />}
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : tab === 'upcoming' ? (
          upcomingList.length > 0 ? (
            upcomingList.map(app => (
              <View key={app.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.appointmentTime}>{fmtDate(app.scheduled_at)}</Text>
                  </View>
                  <View style={[styles.statusBadge, app.meet_link ? styles.virtualBadge : styles.clinicBadge]}>
                    <Text style={[styles.statusText, app.meet_link ? styles.virtualText : styles.clinicText]}>
                      {app.meet_link ? t('pro_virtual_room') : t('pro_in_person')}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentBody}>
                  <View style={styles.patientInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>{app.patient_name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.patientName}>{app.patient_name}</Text>
                      <Text style={styles.patientType}>{app.type ?? 'Session'}</Text>
                    </View>
                  </View>
                </View>

                {app.meet_link && (
                  <View style={styles.meetingLinkBox}>
                    <Ionicons name="link" size={14} color={Colors.primary} />
                    <Text style={styles.meetingLinkText} numberOfLines={1}>{app.meet_link}</Text>
                  </View>
                )}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => Alert.alert('Reschedule', 'Message the patient in the inbox to coordinate a new slot.')}
                  >
                    <Ionicons name="chatbubbles-outline" size={16} color={Colors.text} style={{ marginRight: 6 }} />
                    <Text style={styles.secondaryButtonText}>{t('pro_message')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handleStartSession(app.meet_link ?? '', app.patient_name)}
                  >
                    <Ionicons name={app.meet_link ? 'videocam' : 'business'} size={16} color={Colors.white} style={{ marginRight: 6 }} />
                    <Text style={styles.primaryButtonText}>
                      {app.meet_link ? t('pro_start_meet') : t('pro_view_clinic')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCircle}>
                <Ionicons name="calendar-outline" size={32} color={Colors.tabInactive} />
              </View>
              <Text style={styles.emptyText}>{t('pro_no_confirmed')}</Text>
              <Text style={styles.emptySub}>{t('pro_no_confirmed_sub')}</Text>
            </View>
          )
        ) : (
          pendingList.length > 0 ? (
            pendingList.map(app => (
              <View key={app.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.appointmentTime}>{fmtDate(app.scheduled_at)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: '#FEF3E6' }]}>
                    <Text style={[styles.statusText, { color: '#F39C12' }]}>{t('pro_awaiting_action')}</Text>
                  </View>
                </View>

                <View style={styles.appointmentBody}>
                  <View style={styles.patientInfo}>
                    <View style={[styles.avatarPlaceholder, { backgroundColor: '#FDF2E9' }]}>
                      <Text style={[styles.avatarText, { color: '#F39C12' }]}>{app.patient_name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.patientName}>{app.patient_name}</Text>
                      <Text style={styles.patientType}>{app.type ?? 'Session request'}</Text>
                      <Text style={styles.patientDate}>{t('pro_requested_slot')}: {fmtDate(app.scheduled_at)}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Teleconsultation Configuration Toggle */}
                <View style={styles.teleconsultContainer}>
                  <View style={styles.teleconsultHeader}>
                    <View style={[styles.toggleIconWrap, { backgroundColor: isTeleconsultation ? '#E8F4FD' : '#EAF7EE' }]}>
                      <Ionicons 
                        name={isTeleconsultation ? "videocam" : "business"} 
                        size={18} 
                        color={isTeleconsultation ? Colors.primary : Colors.positive} 
                      />
                    </View>
                    <View>
                      <Text style={styles.teleconsultText}>
                        {isTeleconsultation ? t('pro_teleconsult_virtual') : t('pro_teleconsult_inperson')}
                      </Text>
                      <Text style={styles.teleconsultSubtext}>
                        {isTeleconsultation ? t('pro_teleconsult_link_gen') : t('pro_teleconsult_clinic')}
                      </Text>
                    </View>
                  </View>
                  <Switch 
                    value={isTeleconsultation} 
                    onValueChange={setIsTeleconsultation} 
                    trackColor={{ true: Colors.primary, false: '#CBD5E1' }}
                    thumbColor="#fff"
                  />
                </View>

                {isTeleconsultation && (
                  <View style={styles.linkInputContainer}>
                    <Ionicons name="link" size={16} color={Colors.textMuted} style={styles.linkIcon} />
                    <TextInput 
                      style={styles.linkInput}
                      placeholder="Optional: Custom Google Meet / Zoom link"
                      placeholderTextColor={Colors.tabInactive}
                      value={customLink}
                      onChangeText={setCustomLink}
                    />
                  </View>
                )}

                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.dangerButton]}
                    onPress={() => handleDecline(app)}
                  >
                    <Ionicons name="close-circle-outline" size={16} color="#E74C3C" style={{ marginRight: 6 }} />
                    <Text style={styles.dangerButtonText}>{t('pro_decline')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.successButton]}
                    onPress={() => handleAccept(app)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color={Colors.white} style={{ marginRight: 6 }} />
                    <Text style={styles.primaryButtonText}>{t('pro_accept_booking')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyCircle, { backgroundColor: '#EAF7EE' }]}>
                <Ionicons name="checkmark-done-circle" size={32} color={Colors.positive} />
              </View>
              <Text style={styles.emptyText}>{t('pro_all_caught_up')}</Text>
              <Text style={styles.emptySub}>{t('pro_no_pending')}</Text>
            </View>
          )
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    ...Shadows.soft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#D2E6F9',
  },
  langText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
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
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F6',
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.tabInactive,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  tabBadge: {
    borderRadius: 12,
    minWidth: 20,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  container: {
    padding: Spacing.md,
    paddingBottom: 100, // safety spacing
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    padding: Spacing.md,
    ...Shadows.soft,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EBF2FA',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F6FC',
    paddingBottom: Spacing.sm,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.radiusSm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  virtualBadge: {
    backgroundColor: '#EBF4FF',
  },
  virtualText: {
    color: Colors.primary,
  },
  clinicBadge: {
    backgroundColor: '#EAF7EE',
  },
  clinicText: {
    color: Colors.positive,
  },
  appointmentBody: {
    marginBottom: Spacing.md,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: '#D2E6F9',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  patientType: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  patientDate: {
    fontSize: 12,
    color: Colors.tabInactive,
    marginTop: 2,
    fontWeight: '600',
  },
  meetingLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8FC',
    borderRadius: Border.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: Spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E1EEF7',
  },
  meetingLinkText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    flex: 1,
  },
  teleconsultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: Spacing.sm,
    borderRadius: Border.radius,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    marginBottom: Spacing.md,
  },
  teleconsultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Border.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teleconsultText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  teleconsultSubtext: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  linkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Border.radius,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  linkIcon: {
    marginRight: Spacing.xs,
  },
  linkInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Border.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    ...Shadows.soft,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    flexShrink: 1,
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
    flexShrink: 1,
  },
  dangerButton: {
    backgroundColor: '#FDF2F2',
    borderWidth: 1,
    borderColor: '#FDE2E2',
  },
  dangerButtonText: {
    color: '#E74C3C',
    fontWeight: '700',
    fontSize: 13,
    flexShrink: 1,
  },
  successButton: {
    backgroundColor: Colors.positive,
    ...Shadows.soft,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
});
