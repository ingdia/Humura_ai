import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert, StatusBar
} from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useProfessional } from '../../src/contexts/ProfessionalContext';
import { useLanguage } from '../../src/contexts/LanguageContext';


export default function ProfessionalQA() {
  const { questions, answerQuestion, profile } = useProfessional();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'unanswered' | 'answered'>('unanswered');
  const [replyDrafts, setReplyDrafts] = useState<{ [key: string]: string }>({});

  const unansweredList = questions.filter(q => !q.isAnswered);
  const answeredList = questions.filter(q => q.isAnswered);
  const pendingCount = unansweredList.length;

  const handleTextChange = (id: string, text: string) => {
    setReplyDrafts(prev => ({ ...prev, [id]: text }));
  };

  const handlePublishAnswer = (id: string) => {
    const text = replyDrafts[id];
    if (!text || !text.trim()) {
      Alert.alert("Input Required", "Please enter a therapeutic, professional response before publishing.");
      return;
    }

    answerQuestion(id, text.trim());
    Alert.alert(
      "Answer Published",
      "Your professional guidance has been posted anonymously to the community. Thank you for your support! 🌿",
      [{ text: "Done" }]
    );

    // Clear draft
    setReplyDrafts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="help-circle" size={18} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>{t('pro_anonymous_qa')}</Text>
          </View>
        </View>
        <View style={styles.titleUnderline} />
        <View style={styles.filterBanner}>
          <Ionicons name="filter" size={12} color="#856404" />
          <Text style={styles.filterBannerText}>
            Showing mental health questions only — anxiety, depression, trauma, stress & SRH
          </Text>
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'unanswered' && styles.tabButtonActive]}
          onPress={() => setActiveTab('unanswered')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'unanswered' && styles.tabTextActive]}>{t('pro_inquiries')}</Text>
          {pendingCount > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: '#E8F4FD' }]}>
              <Text style={[styles.tabBadgeText, { color: Colors.primary }]}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'answered' && styles.tabButtonActive]}
          onPress={() => setActiveTab('answered')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'answered' && styles.tabTextActive]}>{t('pro_answered_forum')}</Text>
          {answeredList.length > 0 && (
            <View style={[styles.tabBadge, { backgroundColor: '#E8F4FD' }]}>
              <Text style={[styles.tabBadgeText, { color: Colors.primary }]}>{answeredList.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {activeTab === 'unanswered' ? (
          unansweredList.length > 0 ? (
            unansweredList.map(q => (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{q.category}</Text>
                  </View>
                  <Text style={styles.timeText}>{q.time}</Text>
                </View>
                
                <Text style={styles.questionText}>{q.text}</Text>
                
                <View style={styles.replySection}>
                  <Text style={styles.replyTitle}>{t('pro_your_guidance')}</Text>
                  <TextInput
                    style={styles.replyInput}
                    placeholder={t('pro_reply_placeholder')}
                    placeholderTextColor={Colors.tabInactive}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={replyDrafts[q.id] || ''}
                    onChangeText={(text) => handleTextChange(q.id, text)}
                  />
                  <View style={styles.replyActionRow}>
                    <View style={styles.helperRow}>
                      <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                      <Text style={styles.helperText}>{t('pro_anonymous_answer')}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={() => handlePublishAnswer(q.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                      <Text style={styles.sendButtonText}>{t('pro_publish')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyCircle, { backgroundColor: '#EAF7EE' }]}>
                <Ionicons name="checkmark-done-circle" size={32} color={Colors.positive} />
              </View>
              <Text style={styles.emptyText}>{t('pro_all_answered')}</Text>
              <Text style={styles.emptySub}>{t('pro_no_inquiries')}</Text>
            </View>
          )
        ) : (
          answeredList.length > 0 ? (
            answeredList.map(q => (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={[styles.tag, { backgroundColor: '#F0F4F8' }]}>
                    <Text style={[styles.tagText, { color: Colors.textMuted }]}>{q.category}</Text>
                  </View>
                  <Text style={styles.timeText}>{q.time}</Text>
                </View>
                
                <Text style={[styles.questionText, { opacity: 0.9, fontStyle: 'italic', marginBottom: 16 }]}>
                  "{q.text}"
                </Text>
                
                <View style={styles.answeredBox}>
                  <View style={styles.answeredDoctorHeader}>
                    <View style={styles.docAvatar}>
                      <Ionicons name="leaf" size={12} color="#fff" />
                    </View>
                    <View>
                      <Text style={styles.docName}>{t('pro_answer_by')} {profile.name}</Text>
                      <Text style={styles.docSpecialization}>{profile.specialization}</Text>
                    </View>
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                      <Text style={styles.verifiedText}>{t('pro_verified')}</Text>
                    </View>
                  </View>
                  <Text style={styles.answerContentText}>{q.answerText}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCircle}>
                <Ionicons name="help-circle-outline" size={32} color={Colors.tabInactive} />
              </View>
              <Text style={styles.emptyText}>{t('pro_no_forum')}</Text>
              <Text style={styles.emptySub}>{t('pro_no_forum_sub')}</Text>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radiusLg,
    padding: Spacing.md,
    ...Shadows.soft,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EBF2FA',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Border.radiusSm,
  },
  tagText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '700',
  },
  timeText: {
    fontSize: 12,
    color: Colors.tabInactive,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  replySection: {
    borderTopWidth: 1,
    borderTopColor: '#F2F6FC',
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  replyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  replyInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: Border.radius,
    padding: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#EBF2FA',
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  replyActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  helperText: {
    fontSize: 11,
    color: Colors.tabInactive,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Border.radius,
    ...Shadows.soft,
  },
  sendButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  answeredBox: {
    backgroundColor: '#F3FAF5',
    borderRadius: Border.radiusLg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#D4EFDF',
  },
  answeredDoctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  docAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.positive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  docSpecialization: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  verifiedBadge: {
    marginLeft: 'auto',
    backgroundColor: Colors.positive,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Border.radiusSm,
    gap: 2,
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.white,
  },
  answerContentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    fontWeight: '500',
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
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  filterBannerText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '600',
    flex: 1,
  },
});
