import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ImageBackground
} from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfessional } from '../../src/contexts/ProfessionalContext';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ProfessionalDashboard() {
  const router = useRouter();
  const { appointments, questions, chats } = useProfessional();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const displayName = user?.name ?? 'Doctor';
  const displayRole = user?.specialization ?? 'Health Professional';

  const translateType = (type: string) => {
    if (type.toLowerCase().includes('initial')) return t('appt_initial');
    if (type.toLowerCase().includes('follow')) return t('appt_followup');
    if (type.toLowerCase().includes('stress')) return t('appt_stress');
    return t('appt_general');
  };

  // Calculate dynamic stats
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMED').length;
  const pendingQA = questions.filter(q => !q.isAnswered).length;
  const unreadChats = chats.reduce((acc, chat) => acc + chat.unreadCount, 0);

  // Get next upcoming confirmed appointment
  const nextSession = appointments.find(a => a.status === 'CONFIRMED');

  const QUICK_ACTIONS = [
    {
      tab: '/(professional-tabs)/appointments',
      icon: 'calendar',
      title: t('pro_schedule'),
      desc: t('pro_manage_bookings'),
      color: '#4a90e2',
      bgColor: '#E8F4FD'
    },
    {
      tab: '/(professional-tabs)/qa',
      icon: 'help-circle',
      title: t('pro_qa_forum'),
      desc: t('pro_answer_inquiries'),
      color: '#F39C12',
      bgColor: '#FEF3E6'
    },
    {
      tab: '/(professional-tabs)/inbox',
      icon: 'chatbubbles',
      title: t('pro_inbox_label'),
      desc: `${unreadChats} unread`,
      color: '#27AE60',
      bgColor: '#EAF7EE'
    },
    {
      tab: '/(professional-tabs)/profile',
      icon: 'time',
      title: t('pro_availability'),
      desc: t('pro_set_hours'),
      color: '#9B59B6',
      bgColor: '#F5EEF8'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80' }}
          style={styles.hero}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(74,144,226,0.92)', 'rgba(44,95,143,0.88)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroTop}>
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <Ionicons name="leaf" size={16} color="#fff" />
                </View>
                <Text style={styles.logoText}>Humura Pro</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  style={styles.langToggle}
                  onPress={() => setLanguage(language === 'en' ? 'kn' : 'en')}
                >
                  <Text style={styles.langText}>{language === 'en' ? 'KN' : 'EN'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileBtn} 
                  onPress={() => router.push('/(professional-tabs)/profile')}
                >
                  <Ionicons name="person" size={17} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.heroGreeting}>{t('pro_welcome_back')}</Text>
            <Text style={styles.heroName}>{displayName}</Text>
            <Text style={styles.heroSubtitle}>{displayRole}</Text>
          </LinearGradient>
        </ImageBackground>

        {/* STATS MATRIX */}
        <View style={styles.section}>
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statCard} 
              activeOpacity={0.9} 
              onPress={() => router.push('/(professional-tabs)/appointments')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#E8F4FD' }]}>
                <Ionicons name="calendar" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{confirmedCount}</Text>
              <Text style={styles.statLabel}>{t('pro_active_sessions')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard} 
              activeOpacity={0.9} 
              onPress={() => router.push('/(professional-tabs)/qa')}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3E6' }]}>
                <Ionicons name="help-circle" size={22} color="#F39C12" />
              </View>
              <Text style={styles.statValue}>{pendingQA}</Text>
              <Text style={styles.statLabel}>{t('pro_pending_qa')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NEXT UPCOMING SESSION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pro_upcoming_sessions')}</Text>
          {nextSession ? (
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTime}>{nextSession.time}</Text>
                <View style={[styles.statusBadge, nextSession.isVirtual ? styles.virtualBadge : styles.clinicBadge]}>
                  <Text style={[styles.statusText, nextSession.isVirtual ? styles.virtualText : styles.clinicText]}>
                    {nextSession.isVirtual ? t('pro_virtual') : t('pro_in_person')}
                  </Text>
                </View>
              </View>
              <View style={styles.appointmentBody}>
                <View style={styles.patientInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{nextSession.patientName.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.patientName}>{nextSession.patientName}</Text>
                    <Text style={styles.patientType}>{translateType(nextSession.type)}</Text>
                  </View>
                </View>
                {nextSession.isVirtual && (
                  <TouchableOpacity 
                    style={styles.meetButton}
                    onPress={() => router.push('/(professional-tabs)/appointments')}
                  >
                    <Ionicons name="videocam" size={18} color={Colors.white} />
                    <Text style={styles.meetButtonText}>{t('pro_join_meet')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="happy-outline" size={40} color={Colors.tabInactive} style={{ marginBottom: 8 }} />
              <Text style={styles.emptyCardText}>{t('pro_no_sessions')}</Text>
              <Text style={styles.emptyCardSub}>{t('pro_no_sessions_sub')}</Text>
            </View>
          )}
        </View>

        {/* QUICK ACTIONS TOOLGRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pro_toolkit')}</Text>
          <View style={styles.grid}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.toolkitCard}
                activeOpacity={0.85}
                onPress={() => router.push(action.tab as any)}
              >
                <View style={[styles.toolkitIcon, { backgroundColor: action.bgColor }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <View style={styles.toolkitInfo}>
                  <Text style={styles.toolkitTitle}>{action.title}</Text>
                  <Text style={styles.toolkitDesc} numberOfLines={1}>{action.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.tabInactive} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
  scrollContainer: {
    paddingBottom: 100, // safety space for absolute bottom bar
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
  },
  heroOverlay: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  langToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  langText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  heroGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    padding: Spacing.md,
    width: '48%',
    borderWidth: 1,
    borderColor: '#EBF2FA',
    ...Shadows.soft,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Border.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    ...Shadows.soft,
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
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Border.radiusSm,
  },
  virtualBadge: {
    backgroundColor: '#E8F4FD',
  },
  clinicBadge: {
    backgroundColor: '#EAF7EE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  virtualText: {
    color: Colors.primary,
  },
  clinicText: {
    color: Colors.positive,
  },
  appointmentBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#DDE8FF',
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
  meetButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Border.radius,
    ...Shadows.soft,
  },
  meetButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBF2FA',
    borderStyle: 'dashed',
  },
  emptyCardText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  emptyCardSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  grid: {
    gap: 12,
  },
  toolkitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Border.radiusLg,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    ...Shadows.soft,
  },
  toolkitIcon: {
    width: 48,
    height: 48,
    borderRadius: Border.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  toolkitInfo: {
    flex: 1,
  },
  toolkitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  toolkitDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
