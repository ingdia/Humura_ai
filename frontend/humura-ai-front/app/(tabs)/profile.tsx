import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Switch,
  Linking, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [anonymous, setAnonymous]         = useState(true);
  const isAnonymous = !!user?.is_anonymous;
  const [name, setName]                   = useState(user?.name || (language === 'en' ? 'Anonymous User' : 'Uwakoresha Utazwi'));
  const [isEditingName, setIsEditingName] = useState(false);

  const STATS = [
    { label: language === 'en' ? 'Days Active' : 'Iminsi',   value: '14',  icon: 'calendar',  color: '#4CAF50' },
    { label: language === 'en' ? 'Resources Read' : 'Amakuru', value: '23',  icon: 'book', color: Colors.primary },
    { label: language === 'en' ? 'Safe Discussions' : 'Ibiganiro', value: '12',   icon: 'chatbubbles', color: '#27AE60' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={42} color={Colors.primary} />
            <TouchableOpacity style={styles.avatarEdit}>
              <Ionicons name="camera" size={12} color="#fff" />
            </TouchableOpacity>
          </View>

          {isAnonymous ? (
            <View style={styles.nameDisplay}>
              <Text style={styles.username}>{name}</Text>
            </View>
          ) : isEditingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                autoFocus
              />
              <TouchableOpacity onPress={() => setIsEditingName(false)} style={styles.saveSmallBtn}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nameDisplay} onPress={() => setIsEditingName(true)}>
              <Text style={styles.username}>{name}</Text>
              <Ionicons name="pencil" size={14} color={Colors.primary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
          {isAnonymous && (
            <View style={styles.anonIdBadge}>
              <Ionicons name="finger-print-outline" size={13} color={Colors.primary} />
              <Text style={styles.anonIdText}>Your unique login ID — save it</Text>
            </View>
          )}
          
          <View style={styles.headerLangRow}>
            <TouchableOpacity 
              style={[styles.headerLangBtn, language === 'en' && styles.headerLangBtnActive]} 
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.headerLangText, language === 'en' && styles.headerLangTextActive]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerLangBtn, language === 'kn' && styles.headerLangBtnActive]} 
              onPress={() => setLanguage('kn')}
            >
              <Text style={[styles.headerLangText, language === 'kn' && styles.headerLangTextActive]}>Kinyarwanda</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                <Ionicons name={s.icon as any} size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Messages shortcut */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Professional Support' : "Ubufasha bw'inzobere"}</Text>
          <Text style={styles.sectionSub}>{language === 'en' ? 'Chat privately with a specialist.' : "Vugana mu ibanga n'inzobere."}</Text>
          <TouchableOpacity style={styles.msgShortcut} onPress={() => router.push('/messages' as any)}>
            <View style={styles.msgShortcutIcon}>
              <Ionicons name="chatbubbles" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.msgShortcutTitle}>{language === 'en' ? 'My Conversations' : 'Ibiganiro byanjye'}</Text>
              <Text style={styles.msgShortcutSub}>{language === 'en' ? 'View messages and start new chats' : 'Reba no gutangira ibiganiro bishya'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Nearby Clinics Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{language === 'en' ? 'Nearby Services' : 'Amavuriro akwegereye'}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/mood' as any)}>
              <Text style={styles.viewAllLink}>{language === 'en' ? 'View All' : 'Reba yose'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSub}>{language === 'en' ? 'Safe locations near your current area.' : 'Ahantu hizewe hakwegereye.'}</Text>
          
          <TouchableOpacity style={styles.miniClinicCard} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=Isange+One+Stop+Centre+Kacyiru')}>
            <View style={[styles.miniClinicIcon, { backgroundColor: '#E74C3C15' }]}>
              <Ionicons name="shield-checkmark" size={20} color="#E74C3C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.miniClinicName}>Isange Centre - Kacyiru</Text>
              <Text style={styles.miniClinicDist}>2.4 km away</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.miniClinicCard} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=Kimisagara+Youth+Friendly+Center')}>
            <View style={[styles.miniClinicIcon, { backgroundColor: '#4a90e215' }]}>
              <Ionicons name="people" size={20} color="#4a90e2" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.miniClinicName}>Youth Center - Kimisagara</Text>
              <Text style={styles.miniClinicDist}>3.1 km away</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Account Settings' : 'Igenamiterere rya konti'}</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye-off-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.settingText}>{language === 'en' ? 'Stay Anonymous' : 'Guma mu ibanga'}</Text>
            </View>
            <Switch value={anonymous} onValueChange={setAnonymous} />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textMuted} />
              <Text style={styles.settingText}>{language === 'en' ? 'Notifications' : 'Imenyesha'}</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          
          {isAnonymous && (
            <View style={styles.logoutIdReminder}>
              <Ionicons name="information-circle-outline" size={16} color="#F59E0B" />
              <Text style={styles.logoutIdReminderText}>
                {language === 'en'
                  ? `To return, use: ${name}`
                  : `Kugirango ugaruke, koresha: ${name}`}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#F44336" />
            <Text style={styles.logoutText}>{language === 'en' ? 'Logout' : 'Sohoka'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },

  profileHeader: { alignItems: 'center', paddingTop: 40, paddingBottom: 32, backgroundColor: Colors.white, ...Shadows.soft },
  avatar: { width: 80, height: 80, borderRadius: 28, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  avatarEdit: { position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  nameDisplay: { flexDirection: 'row', alignItems: 'center' },
  username: { fontSize: 22, fontWeight: '900', color: Colors.text },
  editNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameInput: { fontSize: 20, fontWeight: '800', color: Colors.text, borderBottomWidth: 1, borderBottomColor: Colors.primary, minWidth: 150, textAlign: 'center' },
  saveSmallBtn: { backgroundColor: Colors.primary, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },

  headerLangRow: { flexDirection: 'row', marginTop: 24, backgroundColor: '#F1F5F9', borderRadius: 20, padding: 4 },
  headerLangBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 18 },
  headerLangBtnActive: { backgroundColor: Colors.white, ...Shadows.soft },
  headerLangText: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' },
  headerLangTextActive: { color: Colors.primary },

  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginTop: 24 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 20, padding: 16, alignItems: 'center', ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  statIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700' },

  section: { marginHorizontal: 20, marginTop: 24, backgroundColor: Colors.white, borderRadius: 24, padding: 20, ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  sectionSub: { fontSize: 14, color: Colors.textMuted, marginBottom: 20, fontWeight: '500' },

  msgShortcut: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#F0F7FF', padding: 16, borderRadius: 18,
    borderWidth: 1, borderColor: '#D4E6FC',
  },
  msgShortcutIcon: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: '#E0EFFE', justifyContent: 'center', alignItems: 'center',
  },
  msgShortcutTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  msgShortcutSub: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, paddingVertical: 14, backgroundColor: '#FFF5F5', borderRadius: 16, gap: 10 },
  logoutText: { color: '#F44336', fontWeight: '800', fontSize: 15 },

  anonIdBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, backgroundColor: '#EBF4FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  anonIdText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },

  logoutIdReminder: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFBEB', padding: 12, borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: '#FDE68A' },
  logoutIdReminderText: { flex: 1, fontSize: 13, color: '#92400E', fontWeight: '600' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  viewAllLink: { fontSize: 12, color: Colors.primary, fontWeight: '800' },
  miniClinicCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  miniClinicIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  miniClinicName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  miniClinicDist: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', marginTop: 2 },

});
