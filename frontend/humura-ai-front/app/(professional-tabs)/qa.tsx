import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Colors, Spacing, Border, Shadows } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfessionalQA() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anonymous Q&A</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Mental Health</Text>
            </View>
            <Text style={styles.timeText}>2 hours ago</Text>
          </View>
          
          <Text style={styles.questionText}>
            I've been feeling incredibly anxious before social events lately, to the point where I cancel them. Is this normal and how can I cope?
          </Text>
          
          <View style={styles.replySection}>
            <TextInput
              style={styles.replyInput}
              placeholder="Write your professional response..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.replyActionRow}>
              <Text style={styles.helperText}>Your response will be public but anonymous.</Text>
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={16} color={Colors.white} />
                <Text style={styles.sendButtonText}>Answer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Border.radius,
    padding: Spacing.md,
    ...Shadows.soft,
    marginBottom: Spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.radiusSm,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  questionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  replySection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.md,
  },
  replyInput: {
    backgroundColor: Colors.background,
    borderRadius: Border.radiusSm,
    padding: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    marginBottom: Spacing.sm,
  },
  replyActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Border.radius,
  },
  sendButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});
