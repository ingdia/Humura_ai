import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Image, Dimensions, ScrollView, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const RESOURCES = [
  { 
    id: '1', 
    title: 'Help for Teen Mothers', 
    titleK: 'Ubufasha ku bangavu babyaye',
    category: 'Health',
    categoryK: 'Ubuzima',
    image: 'https://images.unsplash.com/photo-1551030173-122adabc44f9?auto=format&fit=crop&w=800&q=80',
    readTime: '10 min',
    content: 'Teen mothers and their babies face significant challenges. It is essential to seek medical support at Isange One Stop Center (3029) or local health centers. Emotional support is key—talk to a psychologist or a peer counselor.',
    contentK: 'Umwana w’umwangavu n’umwana we bakunze guhura n’ibibazo bikomeye iyo babuze ubufasha. Ubufasha bw’ubuzima ni ingenzi: Mujyane kwa muganga cyangwa kuri Isange One Stop Center (3029).',
  },
  { 
    id: '2', 
    title: 'Know Your Legal Rights', 
    titleK: 'Menya uburenganzira bwawe',
    category: 'Legal',
    categoryK: 'Amategeko',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min',
    content: 'If you have faced violence or been forced into pregnancy, legal aid is available for free. Isange One Stop Center (3029) and MAJ (Maison d’Accès à la Justice) are here to protect you.',
    contentK: 'Niba yatewe inda atabishaka cyangwa yarahohotewe, Isange (3029) na MAJ (Maison d’Accès à la Justice) bamufasha mu mategeko kubuntu.',
  },
  { 
    id: '3', 
    title: 'Emotional Resilience', 
    titleK: 'Kwiyubaka mu mutwe',
    category: 'Mental Health',
    categoryK: 'Ubuzima bwo mu mutwe',
    image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min',
    content: 'Healing starts with being heard. Find a safe space where you can share your story without judgment. Organizations like HDI (3530) offer youth counseling.',
    contentK: 'Kuvura ibikomere bitangira no kumvwa. Shaka ahantu hizewe ushobora kuvugira inkuru yawe utaciriwe urubanza. HDI (3530) itanga ubujyanama.',
  },
  { 
    id: '4', 
    title: 'Return to School', 
    titleK: 'Gusubira mu ishuri',
    category: 'Education',
    categoryK: 'Uburezi',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    readTime: '7 min',
    content: 'Education is your right. Even as a young mother, you can return to school. Talk to your teachers and find support programs like Imbuto Foundation.',
    contentK: 'Uburezi ni uburenganzira bwawe. Nubwo waba uri umubyeyi ukiri muto, ushobora gusubira mu ishuri. Ganira n’abarimu bawe n’imiryango nka Imbuto Foundation.',
  },
  { 
    id: '5', 
    title: 'Vocational Training', 
    titleK: 'Amahugurwa y’imyuga',
    category: 'Skills',
    categoryK: 'Ubumenyi',
    image: 'https://images.unsplash.com/photo-1520004434532-668416a0c78d?auto=format&fit=crop&w=800&q=80',
    readTime: '8 min',
    content: 'Learn a trade to build your future. Tailoring, hair styling, and digital skills are available through local NGOs and government centers.',
    contentK: 'Iga umwuga wagufasha kwiteza imbere. Kudoda, gusuka, n’ikoranabuhanga bishobora kwigwa binyuze mu miryango itegamiye kuri Leta.',
  },
];

const HELPLINES = [
  { name: 'Isange One Stop Center', number: '3029', icon: 'shield-checkmark', color: '#E74C3C' },
  { name: 'Youth Helpline (HDI)', number: '3530', icon: 'call', color: '#4a90e2' },
  { name: 'Child Helpline', number: '116', icon: 'heart', color: '#27AE60' },
  { name: 'Police', number: '112', icon: 'flash', color: '#F39C12' },
];

export default function ResourcesScreen() {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<typeof RESOURCES[0] | null>(null);

  const renderResource = ({ item }: { item: typeof RESOURCES[0] }) => (
    <TouchableOpacity style={styles.resourceCard} activeOpacity={0.9} onPress={() => setSelectedArticle(item)}>
      <Image source={{ uri: item.image }} style={styles.resourceImage} />
      <View style={styles.resourceContent}>
        <View style={styles.resourceMeta}>
          <Text style={styles.resourceCat}>{language === 'en' ? item.category : item.categoryK}</Text>
          <Text style={styles.resourceTime}>{item.readTime}</Text>
        </View>
        <Text style={styles.resourceTitle}>{language === 'en' ? item.title : item.titleK}</Text>
        <View style={styles.resourceFooter}>
          <Text style={styles.readNow}>{language === 'en' ? 'Read Article' : 'Soma amakuru'}</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('resources_title')}</Text>
          <Text style={styles.headerSub}>{t('resources_desc')}</Text>
        </View>
        <View style={styles.titleUnderline} />
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={RESOURCES}
        renderItem={renderResource}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.helplinesRow}>
              {HELPLINES.map((h, i) => (
                <View key={i} style={styles.helplineCol}>
                  <View style={[styles.helplineIcon, { backgroundColor: h.color + '15' }]}>
                    <Ionicons name={h.icon as any} size={22} color={h.color} />
                  </View>
                  <Text style={styles.helplineNum}>{h.number}</Text>
                  <Text style={styles.helplineName} numberOfLines={1}>{h.name}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.sectionTitle}>{language === 'en' ? 'Latest Articles' : 'Inkuru nshya'}</Text>
          </View>
        }
      />

      <Modal visible={!!selectedArticle} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.modalBack}>
              <Ionicons name="chevron-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{language === 'en' ? selectedArticle?.category : selectedArticle?.categoryK}</Text>
            <TouchableOpacity style={styles.modalBack}><Ionicons name="share-outline" size={22} color={Colors.text} /></TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedArticle && (
              <>
                <Image source={{ uri: selectedArticle.image }} style={styles.modalImage} />
                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{language === 'en' ? selectedArticle.title : selectedArticle.titleK}</Text>
                  <View style={styles.modalMeta}>
                    <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.modalTime}>{selectedArticle.readTime} read</Text>
                    <View style={styles.dot} />
                    <Text style={styles.modalTime}>By Humura Team</Text>
                  </View>
                  <Text style={styles.modalContent}>{language === 'en' ? selectedArticle.content : selectedArticle.contentK}</Text>
                  
                  <View style={styles.storyCard}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1516589174184-c685266e430c?auto=format&fit=crop&w=600&q=80' }} style={styles.storyImage} />
                    <Text style={styles.storyCaption}>
                      {language === 'en' ? 'Speak out. You are not alone.' : 'Kuvuga s’ugusebanya. Ni ukwikiza.'}
                    </Text>
                  </View>

                  <Text style={styles.modalContent}>
                    {language === 'en' 
                      ? 'Remember, you are never alone. If you have been affected by these issues, call 3029 (Isange) or 3530 (Youth Line) for free support in Rwanda.' 
                      : 'Ibuka ko utari wenyine. Niba uhuye n’ibi bibazo, hamagara 3029 (Isange) cyangwa 3530 (Urungano) uone ubufasha kubuntu mu Rwanda.'}
                  </Text>
                </View>
              </>
            )}
            <View style={{ height: 60 }} />
          </ScrollView>
        </SafeAreaView>
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
  list: { paddingBottom: 100 },
  listHeader: { padding: 20 },
  helplinesRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  helplineCol: { flex: 1, alignItems: 'center', backgroundColor: Colors.white, padding: 12, borderRadius: 20, ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9' },
  helplineIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  helplineNum: { fontSize: 14, fontWeight: '900', color: Colors.text },
  helplineName: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', marginTop: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 16 },
  resourceCard: { backgroundColor: Colors.white, borderRadius: 24, marginBottom: 16, ...Shadows.soft, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  resourceImage: { width: '100%', height: 160 },
  resourceContent: { padding: 16 },
  resourceMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  resourceCat: { fontSize: 12, color: Colors.primary, fontWeight: '800' },
  resourceTime: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  resourceTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  resourceFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  readNow: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalBack: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '800', color: Colors.textMuted },
  modalImage: { width: '100%', height: 250 },
  modalBody: { padding: 24 },
  modalTitle: { fontSize: 26, fontWeight: '900', color: Colors.text, marginBottom: 12, lineHeight: 32 },
  modalMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  modalTime: { fontSize: 13, color: Colors.textMuted, marginLeft: 6, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 10 },
  modalContent: { fontSize: 16, color: Colors.text, lineHeight: 26, marginBottom: 24, fontWeight: '500' },
  storyCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  storyImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 12 },
  storyCaption: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', fontStyle: 'italic', fontWeight: '500' },
});
