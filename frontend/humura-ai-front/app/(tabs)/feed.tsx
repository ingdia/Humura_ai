import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ImageBackground, Modal,
  Dimensions, Share, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const GROUPS = [
  { 
    id: '1', 
    name: 'Ijwi Ryanjye (My Voice)', 
    nameK: 'Ijwi Ryanjye', 
    desc: 'A safe space to speak out without judgment.', 
    descK: 'Ahantu hizewe ho kuvuga ikiri kumutima utagishijwe isoni.', 
    icon: 'mic', 
    color: '#4a90e2',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '2', 
    name: 'Know Your Rights', 
    nameK: 'Menya Uburenganzira', 
    desc: 'Learn about legal aid and social protection.', 
    descK: 'Soma ku muryango, amategeko n’uburenganzira bwawe.', 
    icon: 'shield-checkmark', 
    color: '#E74C3C',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '3', 
    name: 'Mama, Ntihute (Support)', 
    nameK: 'Mama, Ntihute', 
    desc: 'Guidance and love for teen mothers.', 
    descK: 'Urukundo n’ubujyanama ku bangavu babyaye.', 
    icon: 'heart', 
    color: '#27AE60',
    image: 'https://images.unsplash.com/photo-1509909756405-be01998816c5?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '4', 
    name: 'Safe Protection', 
    nameK: 'Kwirinda Inda', 
    desc: 'Understanding contraception and safe choices.', 
    descK: 'Gusobanukirwa uburyo bwo kwirinda inda zitateganyijwe.', 
    icon: 'shield', 
    color: '#8E44AD',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '5', 
    name: 'Back to School', 
    nameK: 'Subira mu ishuri', 
    desc: 'Supporting teen mothers to continue education.', 
    descK: 'Ubufasha ku bangavu babyaye bifuza gusubira mu ishuri.', 
    icon: 'book', 
    color: '#F39C12',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '6', 
    name: 'Skills & Vocations', 
    nameK: 'Imyuga n’Ubumenyi', 
    desc: 'Learning tailoring, hair styling, and more.', 
    descK: 'Kwiga imyuga nko kudoda, gusuka, n’ibindi bibyara inyungu.', 
    icon: 'construct', 
    color: '#16A085',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '7', 
    name: 'Isange One Stop', 
    nameK: 'Isange One Stop', 
    desc: 'Connect with legal and medical experts.', 
    descK: 'Guhuza n’inzobere mu mategeko n’ubuvuzi.', 
    icon: 'medkit', 
    color: '#C0392B',
    image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: '8', 
    name: 'Big Sisters', 
    nameK: 'Abajyanama b’Urungano', 
    desc: 'Peer mentorship for young girls.', 
    descK: 'Ubufasha n’inama bitangwa n’abakobwa b’inararibonye.', 
    icon: 'people-circle', 
    color: '#D35400',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80'
  },
];

const MOCK_POSTS: Record<string, any[]> = {
  '1': [
    { id: 'p1', author: 'Anonymous', time: '2h ago', content: 'I finally spoke to my mentor today. It feels lighter.', contentK: 'Uyu munsi navuganye n’umujyanama wanjye. Numva nuhutse.', likes: 15 },
    { id: 'p2', author: 'Anonymous', time: '5h ago', content: 'Don’t let shame hold you back. We are here.', contentK: 'Isoni ntizigufate mpiri. Turi kumwe.', likes: 22, specialistReply: { author: 'Nurse Grace Nkusi', clinic: 'Kigali Health Clinic', content: 'We are very proud of you for speaking out!' } },
  ],
  '3': [
    { id: 'p3', author: 'Anonymous', time: '1h ago', content: 'My baby is growing healthy thanks to Isange support.', contentK: 'Umwana wanjye araakura neza kubera ubufasha bwa Isange.', likes: 30 },
  ],
};

export default function FeedScreen() {
  const { t, language } = useLanguage();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');

  const activeGroup = useMemo(() => GROUPS.find(g => g.id === activeGroupId), [activeGroupId]);
  const currentPosts = useMemo(() => (activeGroupId ? MOCK_POSTS[activeGroupId] || [] : []), [activeGroupId]);

  const renderItem = ({ item }: { item: any }) => {
    if (activeGroupId) {
      return (
        <TouchableOpacity style={styles.post} activeOpacity={0.8} onPress={() => setSelectedPost(item)}>
          <View style={styles.postHeader}>
            <Ionicons name="person-circle" size={32} color={Colors.primary} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.postAuthor}>{item.author}</Text>
              <Text style={styles.postTime}>{item.time}</Text>
            </View>
          </View>
          <Text style={styles.postContent}>{language === 'en' ? item.content : item.contentK}</Text>
          {item.specialistReply && (
            <View style={{ marginTop: 12, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: Colors.primary }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                <Text style={{ fontSize: 12, fontWeight: '800', color: Colors.primary, marginLeft: 4 }}>{item.specialistReply.author}</Text>
                <Text style={{ fontSize: 11, color: Colors.textMuted, marginLeft: 6 }}>Verified from {item.specialistReply.clinic}</Text>
              </View>
              <Text style={{ fontSize: 14, color: Colors.text }}>{item.specialistReply.content}</Text>
            </View>
          )}
          <View style={styles.postActions}>
            <View style={styles.actionItem}><Ionicons name="heart-outline" size={18} color={Colors.textMuted} /><Text style={styles.actionText}>{item.likes}</Text></View>
            <View style={styles.actionItem}><Ionicons name="chatbubble-outline" size={18} color={Colors.textMuted} /><Text style={styles.actionText}>{language === 'en' ? 'Reply' : 'Subiza'}</Text></View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.groupCard} activeOpacity={0.9} onPress={() => setActiveGroupId(item.id)}>
          <ImageBackground source={{ uri: item.image }} style={styles.groupCardBg} imageStyle={{ borderRadius: 28 }}>
            <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']} style={styles.groupCardOverlay}>
              <View style={styles.groupIconWrap}>
                <Ionicons name={item.icon as any} size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.groupCardName}>{language === 'en' ? item.name : item.nameK}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {!activeGroupId && (
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t('community_title')}</Text>
            <Text style={styles.headerSub}>{language === 'en' ? 'Safe Space for Rwandan Youth' : 'Ahantu Hizewe ku Rubyiruko'}</Text>
          </View>
          <View style={styles.titleUnderline} />
          <TouchableOpacity style={styles.searchBtn}><Ionicons name="search" size={22} color={Colors.text} /></TouchableOpacity>
        </View>
      )}

      {activeGroupId && (
        <View style={styles.groupHeader}>
          <TouchableOpacity onPress={() => setActiveGroupId(null)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.groupHeaderTitle}>{language === 'en' ? activeGroup?.name : activeGroup?.nameK}</Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      <FlatList
        key={activeGroupId ? 'posts' : 'groups'}
        data={activeGroupId ? currentPosts : GROUPS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={activeGroupId ? 1 : 2}
        columnWrapperStyle={!activeGroupId ? styles.gridRow : null}
        contentContainerStyle={activeGroupId ? styles.groupList : styles.discoveryList}
        ListHeaderComponent={
          activeGroupId ? (
            <View style={styles.groupHero}>
              <Text style={styles.groupHeroDesc}>{language === 'en' ? activeGroup?.desc : activeGroup?.descK}</Text>
            </View>
          ) : (
            <View style={styles.discoveryHero}>
              <Text style={styles.discoveryTitle}>{language === 'en' ? 'Community Groups' : 'Amatsinda y’Ibiganiro'}</Text>
              <Text style={styles.discoverySub}>{language === 'en' ? 'Kuvuga s’ugusebanya. Ni ukwikiza.' : 'Kuvuga s’ugusebanya. Ni ukwikiza.'}</Text>
            </View>
          )
        }
      />

      {activeGroupId && (
        <TouchableOpacity style={[styles.fab, { backgroundColor: activeGroup?.color || Colors.primary }]} onPress={() => setIsPosting(true)}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal visible={isPosting} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsPosting(false)}><Text style={styles.modalCancel}>{language === 'en' ? 'Cancel' : 'Reka'}</Text></TouchableOpacity>
            <Text style={styles.modalTitle}>{language === 'en' ? 'New Anonymous Post' : 'Andika'}</Text>
            <TouchableOpacity onPress={() => setIsPosting(false)} disabled={!postContent.trim()}><Text style={[styles.modalPost, !postContent.trim() && { opacity: 0.5 }]}>{language === 'en' ? 'Share' : 'Ohereza'}</Text></TouchableOpacity>
          </View>
          <View style={styles.postInputWrap}>
            <TextInput
              style={styles.postInput}
              placeholder={language === 'en' ? "What's on your mind?" : "Ni iki kiri kukugaruka mu mutwe?"}
              multiline
              autoFocus
              value={postContent}
              onChangeText={setPostContent}
            />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={!!selectedPost} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)}><Ionicons name="close" size={24} color={Colors.text} /></TouchableOpacity>
              <Text style={styles.modalTitle}>{language === 'en' ? 'Post' : 'Ubutumwa'}</Text>
              <View style={{ width: 24 }} />
            </View>
            {selectedPost && (
              <View style={{ padding: 24 }}>
                <Text style={styles.detailContent}>{language === 'en' ? selectedPost.content : selectedPost.contentK}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24, backgroundColor: Colors.white, ...Shadows.soft },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 15, color: Colors.textMuted, marginTop: 4, fontWeight: '500' },
  titleUnderline: { width: 40, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 12 },
  searchBtn: { position: 'absolute', right: 20, top: 40, width: 44, height: 44, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', ...Shadows.soft },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  groupHeaderTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  discoveryList: { paddingBottom: 100 },
  discoveryHero: { padding: 20, paddingTop: 20 },
  discoveryTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
  discoverySub: { fontSize: 14, color: Colors.primary, marginTop: 4, fontWeight: '800' },
  gridRow: { paddingHorizontal: 16, justifyContent: 'space-between' },
  groupCard: { width: (width - 48) / 2, height: 180, borderRadius: 32, marginBottom: 16, ...Shadows.soft, overflow: 'hidden' },
  groupCardBg: { flex: 1 },
  groupCardOverlay: { flex: 1, padding: 24, justifyContent: 'space-between' },
  groupIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  groupCardName: { color: '#fff', fontSize: 16, fontWeight: '900' },
  groupHero: { padding: 20 },
  groupHeroDesc: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  groupList: { padding: 20, paddingBottom: 100 },
  post: { backgroundColor: Colors.white, borderRadius: 24, padding: 20, marginBottom: 16, ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAuthor: { fontSize: 14, fontWeight: '800', color: Colors.text },
  postTime: { fontSize: 11, color: Colors.textMuted },
  postContent: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  postActions: { flexDirection: 'row', marginTop: 16, gap: 20 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', ...Shadows.premium },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  modalCancel: { color: Colors.textMuted, fontWeight: '600' },
  modalPost: { color: Colors.primary, fontWeight: '800' },
  postInputWrap: { padding: 20 },
  postInput: { fontSize: 18, color: Colors.text, minHeight: 200, textAlignVertical: 'top' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  detailModalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, minHeight: height * 0.4 },
  detailContent: { fontSize: 17, color: Colors.text, lineHeight: 26 },
});
