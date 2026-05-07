import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#4a90e2';

const TAGS = ['#all', '#family', '#anxiety', '#recovery', '#addiction', '#loneliness'];

interface Post {
  id: string;
  content: string;
  tag: string;
  reactions: { heart: number; hands: number };
  time: string;
  reacted: { heart: boolean; hands: boolean };
}

const INITIAL_POSTS: Post[] = [
  { id: '1', content: 'Family pressure is real. Anyone else feeling overwhelmed by expectations?', tag: '#family', reactions: { heart: 12, hands: 7 }, time: '2h ago', reacted: { heart: false, hands: false } },
  { id: '2', content: 'Overcame my anxiety today and went outside. Small steps matter so much. 🌿', tag: '#recovery', reactions: { heart: 24, hands: 11 }, time: '4h ago', reacted: { heart: false, hands: false } },
  { id: '3', content: 'Some days are just hard. Grateful for this space where I can say that.', tag: '#anxiety', reactions: { heart: 18, hands: 9 }, time: '6h ago', reacted: { heart: false, hands: false } },
  { id: '4', content: 'Day 30 clean. Never thought I would make it this far. Thank you all.', tag: '#addiction', reactions: { heart: 41, hands: 22 }, time: '1d ago', reacted: { heart: false, hands: false } },
  { id: '5', content: 'Feeling lonely even in a room full of people. Does anyone else feel this?', tag: '#loneliness', reactions: { heart: 33, hands: 15 }, time: '1d ago', reacted: { heart: false, hands: false } },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');
  const [selectedTag, setSelectedTag] = useState('#all');
  const [postTag, setPostTag] = useState('#general');
  const [showCompose, setShowCompose] = useState(false);

  const filtered = selectedTag === '#all' ? posts : posts.filter(p => p.tag === selectedTag);

  const addPost = () => {
    if (!newPost.trim()) return;
    setPosts([{
      id: Date.now().toString(),
      content: newPost,
      tag: postTag,
      reactions: { heart: 0, hands: 0 },
      time: 'Just now',
      reacted: { heart: false, hands: false },
    }, ...posts]);
    setNewPost('');
    setShowCompose(false);
  };

  const react = (id: string, type: 'heart' | 'hands') => {
    setPosts(posts.map(p => {
      if (p.id !== id) return p;
      const already = p.reacted[type];
      return {
        ...p,
        reactions: { ...p.reactions, [type]: p.reactions[type] + (already ? -1 : 1) },
        reacted: { ...p.reacted, [type]: !already },
      };
    }));
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.anonAvatar}>
          <Ionicons name="person" size={14} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.anonName}>Anonymous</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.reactRow}>
        <TouchableOpacity style={styles.reactBtn} onPress={() => react(item.id, 'heart')}>
          <Ionicons name={item.reacted.heart ? 'heart' : 'heart-outline'} size={20} color={item.reacted.heart ? '#F87171' : '#aaa'} />
          <Text style={[styles.reactCount, item.reacted.heart && { color: '#F87171' }]}>{item.reactions.heart}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactBtn} onPress={() => react(item.id, 'hands')}>
          <Ionicons name={item.reacted.hands ? 'hand-left' : 'hand-left-outline'} size={20} color={item.reacted.hands ? PRIMARY : '#aaa'} />
          <Text style={[styles.reactCount, item.reacted.hands && { color: PRIMARY }]}>{item.reactions.hands}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FF" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSub}>You are not alone 🌿</Text>
        </View>
        <TouchableOpacity style={styles.composeBtn} onPress={() => setShowCompose(!showCompose)}>
          <Ionicons name={showCompose ? 'close' : 'add'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* AI Weekly Summary */}
      <View style={styles.summaryCard}>
        <Ionicons name="sparkles" size={18} color={PRIMARY} />
        <Text style={styles.summaryText}>
          This week: <Text style={styles.summaryBold}>47 people</Text> shared recovery stories. You're part of something real.
        </Text>
      </View>

      {/* Compose */}
      {showCompose && (
        <View style={styles.composeCard}>
          <TextInput
            value={newPost}
            onChangeText={setNewPost}
            placeholder="Share how you feel anonymously..."
            placeholderTextColor="#aaa"
            style={styles.composeInput}
            multiline
            maxLength={300}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
            {TAGS.filter(t => t !== '#all').map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tagOption, postTag === t && styles.tagOptionSelected]}
                onPress={() => setPostTag(t)}
              >
                <Text style={[styles.tagOptionText, postTag === t && styles.tagOptionTextSelected]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.postBtn} onPress={addPost}>
            <Text style={styles.postBtnText}>Post Anonymously</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tag Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {TAGS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.filterTag, selectedTag === t && styles.filterTagActive]}
            onPress={() => setSelectedTag(t)}
          >
            <Text style={[styles.filterTagText, selectedTag === t && styles.filterTagTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a2e' },
  headerSub: { fontSize: 14, color: '#666', marginTop: 2 },
  composeBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center',
  },
  summaryCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#EEF6FF', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#C8DEFF',
  },
  summaryText: { flex: 1, fontSize: 13, color: '#444', marginLeft: 10, lineHeight: 19 },
  summaryBold: { fontWeight: '700', color: PRIMARY },
  composeCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  composeInput: {
    backgroundColor: '#F5F8FF', borderRadius: 12, padding: 12,
    fontSize: 15, color: '#1a1a2e', minHeight: 80,
    borderWidth: 1, borderColor: '#DDE8FF', marginBottom: 12,
  },
  tagScroll: { marginBottom: 12 },
  tagOption: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#DDE8FF', marginRight: 8, backgroundColor: '#F5F8FF',
  },
  tagOptionSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  tagOptionText: { fontSize: 13, color: '#666', fontWeight: '500' },
  tagOptionTextSelected: { color: '#fff' },
  postBtn: { backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  postBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  filterRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterTag: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: '#DDE8FF', backgroundColor: '#fff', marginRight: 8,
  },
  filterTagActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  filterTagText: { fontSize: 13, color: '#666', fontWeight: '500' },
  filterTagTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  post: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#4a90e2', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  anonAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#B8D0F5', justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  anonName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  postTime: { fontSize: 12, color: '#aaa', marginTop: 1 },
  tagBadge: { backgroundColor: '#EEF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 12, color: PRIMARY, fontWeight: '600' },
  postContent: { fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 12 },
  reactRow: { flexDirection: 'row', gap: 16 },
  reactBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reactCount: { fontSize: 14, color: '#aaa', fontWeight: '600' },
});
