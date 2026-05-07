import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Refined Color Palette: White, Gray, and #4a90e2 Blue
const COLORS = {
  primary: '#4a90e2', // New Blue
  primaryDark: '#357ABD', // Darker blue
  primaryDarker: '#2C5F8F', // Even darker
  primaryLight: '#7BB3E8', // Lighter blue
  primaryLighter: '#A4C8F0', // Very light blue
  accent: '#E8F0FF', // Light blue accent
  bg: '#F0F0F0', // Gray background
  white: '#FFFFFF',
  textDark: '#333333', // Dark Gray
  textMedium: '#666666', // Medium Gray
  textLight: '#999999', // Light Gray
  overlay: 'rgba(74, 144, 226, 0.75)', // Blue overlay
  overlayLight: 'rgba(74, 144, 226, 0.6)',
  overlayDark: 'rgba(51, 51, 51, 0.8)', // Dark gray overlay
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - Balanced Image + Purple */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80' }}
            style={styles.heroBg}
            imageStyle={styles.heroBgImage}
          >
            <LinearGradient
              colors={['rgba(74, 144, 226, 0.85)', 'rgba(53, 122, 189, 0.8)', 'rgba(44, 95, 143, 0.85)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroOverlay}
            >
              <View style={styles.heroContent}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoIcon}>
                    <Ionicons name="leaf" size={24} color="#fff" />
                  </View>
                  <Text style={styles.brandName}>Humura</Text>
                </View>
                <Text style={styles.heroTitle}>
                  Your mental health{'\n'}journey starts here
                </Text>
                <Text style={styles.heroSubtitle}>
                  AI support • Professional care • Immersive calm
                </Text>
                <TouchableOpacity style={styles.getStartedBtn}>
                  <Text style={styles.getStartedText}>Begin Journey</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.primaryDark} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Discover Your Path</Text>
          
          {/* AI Chat - Hero Card */}
          <TouchableOpacity style={styles.cardLarge} activeOpacity={0.92}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80' }}
              style={styles.cardBg}
              imageStyle={styles.cardBgImage}
            >
              <LinearGradient
                colors={['rgba(74, 144, 226, 0.7)', 'rgba(53, 122, 189, 0.75)']}
                start={{ x: 0, y: 0.4 }}
                end={{ x: 0, y: 1 }}
                style={styles.cardOverlay}
              >
                <View style={styles.cardTopContent}>
                  <View style={styles.cardIconWrapper}>
                    <Ionicons name="chatbubbles" size={32} color="#fff" />
                  </View>
                  <View style={styles.availabilityBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.availabilityText}>Always here</Text>
                  </View>
                </View>
                <View style={styles.cardBottomContent}>
                  <Text style={styles.cardTitleLarge}>AI Companion</Text>
                  <Text style={styles.cardDescLarge}>
                    Talk freely anytime. Compassionate support that understands you.
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Grid Cards */}
          <View style={styles.gridRow}>
            {/* Doctor Consult */}
            <TouchableOpacity style={[styles.cardSmall, styles.cardTall]} activeOpacity={0.92}>
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&q=80' }}
                style={styles.cardBgSmall}
                imageStyle={styles.cardBgImageSmall}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(74, 144, 226, 0.85)']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.cardOverlaySmall}
                >
                  <View style={styles.smallCardIcon}>
                    <Ionicons name="medical" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitleSmall}>Doctor Consult</Text>
                  <Text style={styles.cardTextSmall}>Licensed therapists</Text>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>

            {/* VR Calm */}
            <TouchableOpacity style={[styles.cardSmall, styles.cardMedium]} activeOpacity={0.92}>
              <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80' }}
                style={styles.cardBgSmall}
                imageStyle={styles.cardBgImageSmall}
              >
                <LinearGradient
                  colors={['rgba(176, 224, 230, 0.6)', 'rgba(74, 144, 226, 0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardOverlaySmall}
                >
                  <View style={styles.smallCardIcon}>
                    <Ionicons name="eye" size={24} color="#fff" />
                  </View>
                  <Text style={styles.cardTitleSmall}>VR Calm Mode</Text>
                  <Text style={styles.cardTextSmall}>Immersive peace</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {/* Mood Tracking - Wide Card */}
          <TouchableOpacity style={styles.cardWide} activeOpacity={0.92}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' }}
              style={styles.cardBgWide}
              imageStyle={styles.cardBgImageWide}
            >
              <LinearGradient
                colors={['rgba(74, 144, 226, 0.65)', 'rgba(53, 122, 189, 0.7)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardOverlayWide}
              >
                <View style={styles.wideCardLeft}>
                  <View style={styles.smallCardIcon}>
                    <Ionicons name="analytics" size={26} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.cardTitleWide}>Mood Tracking</Text>
                    <Text style={styles.cardTextWide}>Understand your patterns</Text>
                  </View>
                </View>
                <View style={styles.moodIndicators}>
                  {[0.4, 0.6, 0.8, 1].map((opacity, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.moodDot, 
                        { opacity, backgroundColor: `rgba(255,255,255,${opacity})` }
                      ]} 
                    />
                  ))}
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionSubtitle}>Quick Wellness</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScroll}
          >
            <QuickCard 
              icon="musical-notes"
              title="Breathe"
              image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80"
            />
            <QuickCard 
              icon="moon"
              title="Sleep"
              image="https://images.unsplash.com/photo-1511295742349-848f3e02f78a?w=300&q=80"
            />
            <QuickCard 
              icon="flame"
              title="Release"
              image="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&q=80"
            />
            <QuickCard 
              icon="heart"
              title="Care"
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80"
            />
          </ScrollView>
        </View>

        {/* Inspiration Card */}
        <TouchableOpacity style={styles.inspirationCard} activeOpacity={0.9}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80' }}
            style={styles.inspirationBg}
            imageStyle={styles.inspirationImage}
          >
            <LinearGradient
              colors={['rgba(74, 144, 226, 0.75)', 'rgba(51, 51, 51, 0.8)']}
              style={styles.inspirationOverlay}
            >
              <Ionicons name="chatbubble" size={36} color="rgba(255,255,255,0.9)" style={styles.quoteIcon} />
              <Text style={styles.quoteText}>
                "Healing is a journey, not a destination"
              </Text>
              <Text style={styles.quoteAuthor}>Daily Inspiration</Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Card Component
interface QuickCardProps {
  icon: string;
  title: string;
  image: string;
}

function QuickCard({ icon, title, image }: QuickCardProps) {
  return (
    <TouchableOpacity style={styles.quickCard}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.quickCardBg}
        imageStyle={styles.quickCardImage}
      >
        <LinearGradient
          colors={['rgba(74, 144, 226, 0.7)', 'rgba(53, 122, 189, 0.75)']}
          style={styles.quickCardOverlay}
        >
          <Ionicons name={icon as any} size={26} color="#fff" />
          <Text style={styles.quickCardTitle}>{title}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 20 },
  
  // Hero
  heroContainer: {
    height: 420,
    overflow: 'hidden',
  },
  heroBg: { flex: 1 },
  heroBgImage: { borderRadius: 0 },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heroContent: { paddingTop: 40 },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 44,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.92)',
    marginBottom: 32,
    fontWeight: '500',
  },
  getStartedBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedText: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  
  // Features
  featuresSection: { paddingHorizontal: 16, marginTop: -30 },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMedium,
    marginTop: 28,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  
  // Large Card
  cardLarge: {
    borderRadius: 24,
    height: 340,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#FFFFFF', // White
  },
  cardBg: { flex: 1 },
  cardBgImage: { borderRadius: 24 },
  cardOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    borderRadius: 24,
  },
  cardTopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBottomContent: {},
  cardTitleLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescLarge: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
    maxWidth: '90%',
  },
  
  // Grid
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardSmall: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: '#FFFFFF', // White
  },
  cardTall: {
    width: (width - 44) / 2,
    height: 250,
  },
  cardMedium: {
    width: (width - 44) / 2,
    height: 190,
  },
  cardBgSmall: { flex: 1 },
  cardBgImageSmall: { borderRadius: 20 },
  cardOverlaySmall: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
    borderRadius: 20,
  },
  smallCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleSmall: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardTextSmall: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  newBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },
  
  // Wide Card
  cardWide: {
    borderRadius: 20,
    height: 150,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: '#FFFFFF', // White
  },
  cardBgWide: { flex: 1 },
  cardBgImageWide: { borderRadius: 20 },
  cardOverlayWide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
  },
  wideCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitleWide: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  cardTextWide: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
  },
  moodIndicators: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  moodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Quick Scroll
  quickScroll: { paddingHorizontal: 4 },
  quickCard: {
    width: 110,
    height: 130,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF', // White
  },
  quickCardBg: { flex: 1 },
  quickCardImage: { borderRadius: 20 },
  quickCardOverlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  quickCardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Inspiration
  inspirationCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    overflow: 'hidden',
    height: 200,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: '#FFFFFF', // White
  },
  inspirationBg: { flex: 1 },
  inspirationImage: { borderRadius: 24 },
  inspirationOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  quoteIcon: { marginBottom: 14 },
  quoteText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 27,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  quoteAuthor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});