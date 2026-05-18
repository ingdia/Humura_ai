import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Switch,
  Linking, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

type Slot = { time: string; available: boolean };

type Specialist = {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  roleLabelK: string;
  icon: string;
  color: string;
  phone: string;
  slots?: Slot[];
};

const SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Amina Uwase',
    role: 'srh_specialist',
    roleLabel: 'SRH Specialist',
    roleLabelK: 'Inzobere muri SRH',
    icon: 'heart',
    color: '#4a90e2',
    phone: '+250 788 123 456',
    slots: [
      { time: 'Today  9:00 AM',  available: true  },
      { time: 'Today  2:00 PM',  available: true  },
    ],
  },
  {
    id: '2',
    name: 'Nurse Grace Nkusi',
    role: 'social_worker',
    roleLabel: 'SRH Counselor',
    roleLabelK: 'Umujyanama muri SRH',
    icon: 'medical',
    color: '#27AE60',
    phone: '+250 788 654 321',
  },
  {
    id: '3',
    name: 'Keza',
    role: 'peer_support',
    roleLabel: 'Peer Support',
    roleLabelK: 'Ubufasha bwa bagenzi bawe',
    icon: 'people',
    color: '#8E44AD',
    phone: '+250 788 999 888',
    slots: [
      { time: 'Tomorrow 10:00 AM', available: true },
      { time: 'Tomorrow 3:00 PM',  available: true  },
    ],
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [notifications, setNotifications]   = useState(true);
  const [anonymous, setAnonymous]           = useState(true);
  
  const [selectedSpec, setSelectedSpec] = useState<Specialist | null>(null);
  const [messagingSpec, setMessagingSpec] = useState<Specialist | null>(null);
  const [messageText, setMessageText] = useState('');
  
  const [phone, setPhone] = useState(user?.phone || '+250 788 000 000');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [name, setName] = useState(user?.name || (language === 'en' ? 'Anonymous User' : 'Uwakoresha Utazwi'));
  const [isEditingName, setIsEditingName] = useState(false);

  const STATS = [
    { label: language === 'en' ? 'Days Active' : 'Iminsi',   value: '14',  icon: 'calendar',  color: '#4CAF50' },
    { label: language === 'en' ? 'Resources Read' : 'Amakuru', value: '23',  icon: 'book', color: Colors.primary },
    { label: language === 'en' ? 'Safe Discussions' : 'Ibiganiro', value: '12',   icon: 'chatbubbles', color: '#27AE60' },
  ];

  const CONVERSATIONS = [
    { id: '1', name: 'Dr. Amina Uwase', role: 'Clinical Psychologist', lastMessage: 'I am here for you.', time: '10:06 AM', unread: 0, photo: 'https://images.unsplash.com/photo-1594824432258-29367468817d?auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'Nurse Grace Nkusi', role: 'SRH Nurse', lastMessage: 'Please come by the clinic tomorrow.', time: 'Yesterday', unread: 2, photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80' },
  ];

  const handleAction = (type: 'message' | 'call' | 'book', spec: Specialist) => {
    if (type === 'call') {
      Linking.openURL(`tel:${spec.phone.replace(/\s/g, '')}`);
    } else if (type === 'message') {
      setMessagingSpec(spec);
    } else if (type === 'book') {
      setSelectedSpec(spec);
    }
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    Alert.alert(
      language === 'en' ? 'Message Sent' : 'Ubutumwa bwoherejwe',
      language === 'en' ? `Your message has been sent to ${messagingSpec?.name}. They will respond shortly.` : `Ubutumwa bwawe bwoherejwe kuri ${messagingSpec?.name}. Azagusubiza vuba.`
    );
    setMessageText('');
    setMessagingSpec(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Booking Modal */}
      <Modal visible={!!selectedSpec} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedSpec?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedSpec(null)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>{language === 'en' ? 'Select an appointment time' : 'Hitamo igihe cya gahunda'}</Text>

            {selectedSpec?.slots?.map((slot, i) => (
              <TouchableOpacity
                key={i}
                style={styles.slotBtn}
                onPress={() => {
                  Alert.alert('Booked!', `Session confirmed for ${slot.time}`);
                  setSelectedSpec(null);
                }}
              >
                <Text style={styles.slotTime}>{slot.time}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Messaging Modal */}
      <Modal visible={!!messagingSpec} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            style={{ flex: 1 }}
          >
            <View style={styles.msgHeader}>
              <TouchableOpacity onPress={() => setMessagingSpec(null)} style={styles.backBtnSmall}>
                <Ionicons name="chevron-back" size={24} color={Colors.text} />
              </TouchableOpacity>
              <View style={styles.msgHeaderInfo}>
                <Text style={styles.msgHeaderName}>{messagingSpec?.name}</Text>
                <Text style={styles.msgHeaderStatus}>{language === 'en' ? 'Online' : 'Arahari'}</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView 
              style={styles.msgBody} 
              contentContainerStyle={{ padding: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.systemMsg}>
                <Ionicons name="lock-closed" size={14} color={Colors.textMuted} style={{ marginBottom: 8 }} />
                <Text style={styles.systemMsgText}>
                  {language === 'en' 
                    ? `You are starting a private conversation with ${messagingSpec?.name}. This chat is confidential and safe.` 
                    : `Ugiye gutangira ikiganiro cy’ibanga na ${messagingSpec?.name}. Ibi biganiro ni ibanga kandi birinzwe.`}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.msgInputRow}>
              <TextInput
                style={styles.msgInput}
                placeholder={language === 'en' ? "Type your message..." : "Andika ubutumwa..."}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !messageText.trim() && { backgroundColor: '#E2E8F0' }]} 
                onPress={sendMessage}
                disabled={!messageText.trim()}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={42} color={Colors.primary} />
            <TouchableOpacity style={styles.avatarEdit}>
              <Ionicons name="camera" size={12} color="#fff" />
            </TouchableOpacity>
          </View>

          {isEditingName ? (
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
          
          <View style={styles.phoneSection}>
            {isEditingPhone ? (
              <View style={styles.phoneInputRow}>
                <TextInput 
                  style={styles.phoneInput} 
                  value={phone} 
                  onChangeText={setPhone} 
                  keyboardType="phone-pad"
                  autoFocus
                />
                <TouchableOpacity onPress={() => setIsEditingPhone(false)} style={styles.savePhoneBtn}>
                  <Text style={styles.savePhoneText}>{language === 'en' ? 'Save' : 'Bika'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.phoneDisplay} onPress={() => setIsEditingPhone(true)}>
                <Ionicons name="call-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.phoneText}>{phone}</Text>
                <Ionicons name="pencil" size={12} color={Colors.primary} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            )}
          </View>

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

        {/* Messages Inbox */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'My Messages' : 'Ubutumwa bwanjye'}</Text>
          <Text style={styles.sectionSub}>{language === 'en' ? 'Your private conversations' : 'Ibiganiro byawe bwite'}</Text>

          {CONVERSATIONS.map(conv => (
            <TouchableOpacity key={conv.id} style={styles.convRow} onPress={() => router.push(`/thread/${conv.id}` as any)}>
              <Image source={{ uri: conv.photo }} style={styles.convPhoto} />
              <View style={styles.convInfo}>
                <View style={styles.convHeader}>
                  <Text style={styles.convName}>{conv.name}</Text>
                  <Text style={[styles.convTime, conv.unread > 0 && { color: Colors.primary, fontWeight: '800' }]}>{conv.time}</Text>
                </View>
                <Text style={styles.convRole}>{conv.role}</Text>
                <Text style={[styles.convLastMessage, conv.unread > 0 && { fontWeight: '700', color: Colors.text }]} numberOfLines={1}>{conv.lastMessage}</Text>
              </View>
              {conv.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conv.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Professional Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{language === 'en' ? 'Professional Support' : 'Ubufasha bw’inzobere'}</Text>
          <Text style={styles.sectionSub}>{language === 'en' ? 'Directly message, call, or book a session.' : 'Andika, hamagara, cyangwa fashisha gahunda.'}</Text>

          {SPECIALISTS.map(spec => (
            <View key={spec.id} style={styles.specCard}>
              <View style={styles.specHeader}>
                <View style={[styles.specIcon, { backgroundColor: spec.color + '15' }]}>
                  <Ionicons name={spec.icon as any} size={24} color={spec.color} />
                </View>
                <View>
                  <Text style={styles.specName}>{spec.name}</Text>
                  <Text style={[styles.specRole, { color: spec.color }]}>{language === 'en' ? spec.roleLabel : spec.roleLabelK}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('message', spec)}>
                  <Ionicons name="chatbubble" size={16} color={Colors.primary} />
                  <Text style={styles.actionBtnText}>{language === 'en' ? 'Message' : 'Andika'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('call', spec)}>
                  <Ionicons name="call" size={16} color={Colors.primary} />
                  <Text style={styles.actionBtnText}>{language === 'en' ? 'Call' : 'Hamagara'}</Text>
                </TouchableOpacity>
                
                {spec.role !== 'social_worker' && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('book', spec)}>
                    <Ionicons name="calendar" size={16} color={Colors.primary} />
                    <Text style={styles.actionBtnText}>{language === 'en' ? 'Book' : 'Gahunda'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
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

  phoneSection: { marginTop: 12 },
  phoneDisplay: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  phoneText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phoneInput: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontSize: 13, minWidth: 140, fontWeight: '600', color: Colors.text },
  savePhoneBtn: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  savePhoneText: { color: '#fff', fontSize: 11, fontWeight: '800' },

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

  specCard: { marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 20 },
  specHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  specIcon: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  specName: { fontSize: 17, fontWeight: '800', color: Colors.text },
  specRole: { fontSize: 13, fontWeight: '700', marginTop: 2 },

  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', paddingVertical: 10, borderRadius: 12, gap: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  actionBtnText: { fontSize: 12, fontWeight: '800', color: Colors.text },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 15, fontWeight: '700', color: Colors.text },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingVertical: 14, backgroundColor: '#FFF5F5', borderRadius: 16, gap: 10 },
  logoutText: { color: '#F44336', fontWeight: '800', fontSize: 15 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  viewAllLink: { fontSize: 12, color: Colors.primary, fontWeight: '800' },
  miniClinicCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  miniClinicIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  miniClinicName: { fontSize: 14, fontWeight: '800', color: Colors.text },
  miniClinicDist: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', marginTop: 2 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.text },
  modalSub: { fontSize: 14, color: Colors.textMuted, marginBottom: 24 },
  slotBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16, marginBottom: 12 },
  slotTime: { fontSize: 16, fontWeight: '700', color: Colors.text },

  // Messaging Styles
  msgHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtnSmall: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  msgHeaderInfo: { alignItems: 'center' },
  msgHeaderName: { fontSize: 17, fontWeight: '800', color: Colors.text },
  msgHeaderStatus: { fontSize: 12, color: '#27AE60', fontWeight: '700' },
  msgBody: { flex: 1 },
  systemMsg: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  systemMsgText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20, fontWeight: '600' },
  msgInputRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
  msgInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.text, maxHeight: 120 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', ...Shadows.soft },

  convRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  convPhoto: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E2E8F0' },
  convInfo: { flex: 1, justifyContent: 'center' },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convName: { fontSize: 16, fontWeight: '800', color: Colors.text },
  convTime: { fontSize: 11, color: Colors.textMuted },
  convRole: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 2 },
  convLastMessage: { fontSize: 13, color: Colors.textMuted },
  unreadBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: '900' },
});
