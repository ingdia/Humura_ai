import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, ImageBackground, Modal,
  Dimensions, TextInput, ActivityIndicator, RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { communityAPI } from '../../src/services/api';

const { width } = Dimensions.get('window');

// Static group metadata (images, colours, translations).
// IDs must match the `communities` table in the database.
const GROUPS = [
  {
    id: '1',
    name: 'My Voice',
    nameK: 'Ijwi Ryanjye',
    desc: 'A safe space to speak out without judgment.',
    descK: 'Ahantu hizewe ho kuvuga ikiri kumutima utagishijwe isoni.',
    icon: 'mic',
    color: '#4a90e2',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Know Your Rights',
    nameK: 'Menya Uburenganzira',
    desc: 'Learn about legal aid and social protection.',
    descK: "Soma ku muryango, amategeko n'uburenganzira bwawe.",
    icon: 'shield-checkmark',
    color: '#E74C3C',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Support for Moms',
    nameK: 'Mama, Ntihute',
    desc: 'Guidance and love for teen mothers.',
    descK: "Urukundo n'ubujyanama ku bangavu babyaye.",
    icon: 'heart',
    color: '#27AE60',
    image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Safe Protection',
    nameK: 'Kwirinda Inda',
    desc: 'Understanding contraception and safe choices.',
    descK: 'Gusobanukirwa uburyo bwo kwirinda inda zitateganyijwe.',
    icon: 'shield',
    color: '#8E44AD',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Back to School',
    nameK: 'Subira mu ishuri',
    desc: 'Supporting teen mothers to continue education.',
    descK: 'Ubufasha ku bangavu babyaye bifuza gusubira mu ishuri.',
    icon: 'book',
    color: '#F39C12',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    name: 'Skills & Vocations',
    nameK: "Imyuga n'Ubumenyi",
    desc: 'Learning tailoring, hair styling, and more.',
    descK: "Kwiga imyuga nko kudoda, gusuka, n'ibindi bibyara inyungu.",
    icon: 'construct',
    color: '#16A085',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '7',
    name: 'Isange One Stop',
    nameK: 'Isange One Stop',
    desc: 'Connect with legal and medical experts.',
    descK: "Guhuza n'inzobere mu mategeko n'ubuvuzi.",
    icon: 'medkit',
    color: '#C0392B',
    image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '8',
    name: 'Big Sisters',
    nameK: "Abajyanama b'Urungano",
    desc: 'Peer mentorship for young girls.',
    descK: "Ubufasha n'inama bitangwa n'abakobwa b'inararibonye.",
    icon: 'people-circle',
    color: '#D35400',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80',
  },
];

interface Post {
  id: number;
  community_id: string;
  user_id: number;
  content: string;
  tag?: string;
  created_at: string;
  author_name: string;
  reaction_count: number;
  liked?: boolean;
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function FeedScreen() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeGroup = GROUPS.find(g => g.id === activeGroupId);

  // Load posts when entering a group
  const loadPosts = useCallback(async (groupId: string, silent = false) => {
    if (!silent) setPostsLoading(true);
    const timeout = setTimeout(() => { setPostsLoading(false); setRefreshing(false); }, 5000);
    try {
      const res = await communityAPI.posts(groupId);
      setPosts(res.data);
    } catch {
      // Show empty list on error
    } finally {
      clearTimeout(timeout);
      setPostsLoading(false);
      setRefreshing(false);
    }
  }, []);

  const openGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setPosts([]);
    loadPosts(groupId);
  };

  const closeGroup = () => {
    setActiveGroupId(null);
    setPosts([]);
  };

  const onRefresh = () => {
    if (activeGroupId) {
      setRefreshing(true);
      loadPosts(activeGroupId, true);
    }
  };

  const handlePost = async () => {
    const trimmed = postContent.trim();
    if (!trimmed || !activeGroupId) return;
    setSubmitting(true);
    try {
      const res = await communityAPI.createPost(activeGroupId, trimmed);
      // Prepend the new post so it appears at the top
      setPosts(prev => [{ ...res.data, author_name: user?.name ?? 'Anonymous member', reaction_count: 0 }, ...prev]);
      setPostContent('');
      setIsPosting(false);
    } catch (err: any) {
      Alert.alert(
        language === 'en' ? 'Post Failed' : 'Byanze',
        err?.response?.data?.error ?? (language === 'en' ? 'Could not post. Try again.' : 'Byanze. Ongera ugerageze.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (post: Post) => {
    // Optimistic update
    setPosts(prev => prev.map(p =>
      p.id === post.id
        ? { ...p, liked: !p.liked, reaction_count: p.liked ? p.reaction_count - 1 : p.reaction_count + 1 }
        : p
    ));
    try {
      await communityAPI.react(post.id);
    } catch {
      // Revert on failure
      setPosts(prev => prev.map(p =>
        p.id === post.id
          ? { ...p, liked: post.liked, reaction_count: post.reaction_count }
          : p
      ));
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarLetter}>{item.author_name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.postAuthor}>{item.author_name}</Text>
          <Text style={styles.postTime}>{timeAgo(item.created_at)}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionItem} onPress={() => handleLike(item)}>
          <Ionicons
            name={item.liked ? 'heart' : 'heart-outline'}
            size={18}
            color={item.liked ? '#E74C3C' : Colors.textMuted}
          />
          <Text style={[styles.actionText, item.liked && { color: '#E74C3C' }]}>
            {item.reaction_count}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGroupCard = ({ item }: { item: typeof GROUPS[0] }) => (
    <TouchableOpacity style={styles.groupCard} activeOpacity={0.9} onPress={() => openGroup(item.id)}>
      <ImageBackground source={{ uri: item.image }} style={styles.groupCardBg} imageStyle={{ borderRadius: 28 }}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']} style={styles.groupCardOverlay}>
          <View style={styles.groupIconWrap}>
            <Ionicons name={item.icon as any} size={20} color="#fff" />
          </View>
          <Text style={styles.groupCardName}>
            {language === 'en' ? item.name : item.nameK}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      {!activeGroupId ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('community_title')}</Text>
          <Text style={styles.headerSub}>
            {language === 'en' ? 'Safe Space for Rwandan Youth' : 'Ahantu Hizewe ku Rubyiruko'}
          </Text>
          <View style={styles.titleUnderline} />
        </View>
      ) : (
        <View style={styles.groupHeader}>
          <TouchableOpacity onPress={closeGroup} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.groupHeaderTitle}>
            {language === 'en' ? activeGroup?.name : activeGroup?.nameK}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      )}

      {!activeGroupId ? (
        /* ── Group grid ── */
        <FlatList
          data={GROUPS}
          renderItem={renderGroupCard}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.discoveryList}
          ListHeaderComponent={
            <View style={styles.discoveryHero}>
              <Text style={styles.discoveryTitle}>
                {language === 'en' ? 'Community Groups' : "Amatsinda y'Ibiganiro"}
              </Text>
              <Text style={styles.discoverySub}>
                {language === 'en'
                  ? "Speak out. It's not gossip. It's healing."
                  : "Kuvuga s'ugusebanya. Ni ukwikiza."}
              </Text>
            </View>
          }
        />
      ) : (
        /* ── Posts list ── */
        <>
          {postsLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.groupList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
              }
              ListHeaderComponent={
                <View style={styles.groupHero}>
                  <Text style={styles.groupHeroDesc}>
                    {language === 'en' ? activeGroup?.desc : activeGroup?.descK}
                  </Text>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Ionicons name="chatbubbles-outline" size={48} color={Colors.tabInactive} />
                  <Text style={styles.emptyText}>
                    {language === 'en' ? 'No posts yet' : 'Nta makuru arabonetse'}
                  </Text>
                  <Text style={styles.emptySubText}>
                    {language === 'en' ? 'Be the first to share!' : 'Banza usangire!'}
                  </Text>
                </View>
              }
            />
          )}

          {/* FAB to open post modal */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: activeGroup?.color ?? Colors.primary }]}
            onPress={() => setIsPosting(true)}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {/* Post Modal */}
      <Modal visible={isPosting} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setIsPosting(false); setPostContent(''); }}>
              <Text style={styles.modalCancel}>
                {language === 'en' ? 'Cancel' : 'Reka'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {language === 'en' ? 'New Anonymous Post' : 'Andika mu ibanga'}
            </Text>
            <TouchableOpacity
              onPress={handlePost}
              disabled={!postContent.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={[styles.modalPost, !postContent.trim() && { opacity: 0.4 }]}>
                  {language === 'en' ? 'Share' : 'Ohereza'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.postInputWrap}>
            <View style={styles.anonBanner}>
              <Ionicons name="eye-off-outline" size={14} color={Colors.primary} />
              <Text style={styles.anonText}>
                {language === 'en' ? 'Posted anonymously — your identity is protected.' : 'Ubutumwa bwawe burahishwe.'}
              </Text>
            </View>
            <TextInput
              style={styles.postInput}
              placeholder={language === 'en' ? "What's on your mind?" : 'Ni iki kiri kukugaruka mu mutwe?'}
              placeholderTextColor={Colors.tabInactive}
              multiline
              autoFocus
              value={postContent}
              onChangeText={setPostContent}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 20, backgroundColor: Colors.white, ...Shadows.soft },
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 15, color: Colors.textMuted, marginTop: 4, fontWeight: '500' },
  titleUnderline: { width: 40, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 12 },

  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', ...Shadows.soft },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  groupHeaderTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },

  discoveryList: { paddingBottom: 100 },
  discoveryHero: { padding: 20 },
  discoveryTitle: { fontSize: 22, fontWeight: '900', color: Colors.text },
  discoverySub: { fontSize: 14, color: Colors.primary, marginTop: 4, fontWeight: '800' },

  gridRow: { paddingHorizontal: 16, justifyContent: 'space-between' },
  groupCard: { width: (width - 48) / 2, height: 180, borderRadius: 32, marginBottom: 16, ...Shadows.soft, overflow: 'hidden' },
  groupCardBg: { flex: 1 },
  groupCardOverlay: { flex: 1, padding: 16, justifyContent: 'space-between' },
  groupIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  groupCardName: { color: '#fff', fontSize: 15, fontWeight: '900', flexShrink: 1 },

  groupHero: { padding: 20 },
  groupHeroDesc: { fontSize: 14, color: Colors.textMuted, lineHeight: 20 },
  groupList: { padding: 20, paddingBottom: 120 },

  post: { backgroundColor: Colors.white, borderRadius: 24, padding: 20, marginBottom: 16, ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  postAvatarLetter: { color: '#fff', fontWeight: '800', fontSize: 16 },
  postAuthor: { fontSize: 14, fontWeight: '800', color: Colors.text },
  postTime: { fontSize: 11, color: Colors.textMuted },
  postContent: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  postActions: { flexDirection: 'row', marginTop: 14, gap: 20 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },

  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '800', color: Colors.text },
  emptySubText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },

  fab: { position: 'absolute', bottom: 100, right: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', ...Shadows.premium },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  modalCancel: { color: Colors.textMuted, fontWeight: '600', fontSize: 15 },
  modalPost: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  postInputWrap: { padding: 20, flex: 1 },
  anonBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EBF4FF', borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: '#D4E6FC' },
  anonText: { fontSize: 12, color: Colors.primary, fontWeight: '600', flex: 1 },
  postInput: { fontSize: 18, color: Colors.text, flex: 1, textAlignVertical: 'top' },
});
