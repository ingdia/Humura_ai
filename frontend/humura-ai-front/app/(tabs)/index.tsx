import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width } = Dimensions.get('window');

const QUOTES = [
  'Knowledge is power. Understanding your body is the first step.',
  'You are not alone. A safe community is here for you.',
  'Your privacy is our priority. Speak your truth safely.',
  'Umuntu ngumuntu ngabantu — we are stronger together.',
];

export default function HomeScreen() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const hour = new Date().getHours();

  const getGreeting = () => {
    if (hour < 12) return t('greeting');
    if (hour < 17) return t('greeting_afternoon');
    return t('greeting_evening');
  };

  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  const FEATURES = [
    { 
      tab: '/(tabs)/profile', 
      icon: 'chatbubbles', 
      title: t('talk_specialist'), 
      desc: 'Talk to a nurse.', 
      colors: [Colors.primary, Colors.secondary] as [string, string], 
      badge: 'Private',
    },
    { 
      tab: '/(tabs)/feed', 
      icon: 'people', 
      title: t('community_title'), 
      desc: t('community_desc'), 
      colors: [Colors.white, '#F1F5F9'] as [string, string], 
      badge: 'Active',
      isGrey: true
    },
    { 
      tab: '/(tabs)/resources', 
      icon: 'book', 
      title: t('resources_title'), 
      desc: t('resources_desc'), 
      colors: [Colors.white, '#F1F5F9'] as [string, string], 
      badge: 'Library',
      isGrey: true
    },
    { 
      tab: '/(tabs)/calm', 
      icon: 'compass', 
      title: t('calm_title'), 
      desc: 'Holistic support tools.', 
      colors: [Colors.white, '#F1F5F9'] as [string, string], 
      badge: '360',
      isGrey: true
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* HERO - Back to Full Image BG */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' }}
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
                <Text style={styles.logoText}>Humura</Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.langToggle}
                  onPress={() => setLanguage(language === 'en' ? 'kn' : 'en')}
                >
                  <Text style={styles.langText}>{language === 'en' ? 'KN' : 'EN'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
                  <Ionicons name="person" size={17} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.heroGreeting}>{getGreeting()} 🌿</Text>
            <Text style={styles.heroTitle}>{t('how_feeling')}</Text>

            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/profile')}>
              <Ionicons name="chatbubbles" size={17} color={Colors.primary} />
              <Text style={styles.heroBtnText}>{t('talk_specialist')}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        {/* Crisis strip */}
        <TouchableOpacity style={styles.crisisBar} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="alert-circle" size={16} color="#fff" />
          <Text style={styles.crisisText}>{t('overwhelmed')}</Text>
          <Ionicons name="chevron-forward" size={14} color="#fff" />
        </TouchableOpacity>

        {/* Wellness Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('wellness_tools')}</Text>
          <View style={styles.grid}>
            {FEATURES.map((f, i) => {
              const CardContent = (
                <LinearGradient colors={f.colors} style={styles.featureGrad}>
                  <View style={styles.featureTop}>
                    <View style={[styles.featureIcon, (f.isGrey || f.bgImage) && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                      <Ionicons name={f.icon as any} size={20} color={(f.isGrey && !f.bgImage) ? Colors.primary : "#fff"} />
                    </View>
                    <Text style={[styles.featureBadge, (f.isGrey || f.bgImage) && { color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                      {f.badge}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.featureTitle, (f.isGrey && !f.bgImage) && { color: Colors.text }]}>{f.title}</Text>
                    <Text style={[styles.featureDesc, (f.isGrey && !f.bgImage) && { color: Colors.textMuted }]}>{f.desc}</Text>
                  </View>
                </LinearGradient>
              );

              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.featureCard, f.isGrey && !f.bgImage && styles.featureCardGrey]}
                  activeOpacity={0.87}
                  onPress={() => router.push(f.tab as any)}
                >
                  {f.bgImage ? (
                    <ImageBackground source={{ uri: f.bgImage }} style={{ flex: 1 }}>
                      {CardContent}
                    </ImageBackground>
                  ) : CardContent}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1516589174184-c685266e430c?auto=format&fit=crop&w=600&q=80' }}
            style={styles.quoteCard}
            imageStyle={{ borderRadius: 18 }}
            resizeMode="cover"
          >
            <LinearGradient colors={['rgba(74,144,226,0.85)', 'rgba(44,95,143,0.92)']} style={styles.quoteOverlay}>
              <Ionicons name="chatbubble-ellipses" size={18} color="rgba(255,255,255,0.6)" style={{ marginBottom: 8 }} />
              <Text style={styles.quoteText}>"{quote}"</Text>
            </LinearGradient>
          </ImageBackground>

          <TouchableOpacity style={styles.consultCard} activeOpacity={0.9} onPress={() => router.push('/(tabs)/profile')}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80' }}
              style={{ flex: 1 }}
              imageStyle={{ borderRadius: 18 }}
              resizeMode="cover"
            >
              <LinearGradient colors={['rgba(53,122,189,0.88)', 'rgba(26,26,46,0.92)']} style={styles.consultOverlay}>
                <View style={styles.consultIcon}>
                  <Ionicons name="videocam" size={20} color="#fff" />
                </View>
                <Text style={styles.consultTitle}>{t('book_therapist')}</Text>
                <Text style={styles.consultSub}>{t('subsidized')}</Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 16 },

  hero: { width: '100%' },
  heroOverlay: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoText: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langToggle: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  langText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  profileBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  heroGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '500', marginBottom: 4 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#fff', marginBottom: 20, lineHeight: 36 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, ...Shadows.premium },
  heroBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700', marginLeft: 8 },

  crisisBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent, paddingHorizontal: 16, paddingVertical: 12 },
  crisisText: { flex: 1, color: '#fff', fontSize: 13, fontWeight: '600', marginHorizontal: 10 },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 16 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: (width - 44) / 2, borderRadius: 20, overflow: 'hidden', ...Shadows.soft },
  featureCardGrey: { borderWidth: 1, borderColor: '#E2E8F0' },
  featureGrad: { padding: 18, height: 150, justifyContent: 'space-between' },
  featureTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featureIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  featureBadge: { color: '#fff', fontSize: 10, fontWeight: '800', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  featureTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  featureDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 16 },

  bottomRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 12 },
  quoteCard: { flex: 1.3, height: 160, borderRadius: 20, overflow: 'hidden' },
  quoteOverlay: { flex: 1, padding: 20, justifyContent: 'center', borderRadius: 20 },
  quoteText: { fontSize: 13, fontWeight: '600', color: '#fff', lineHeight: 20, fontStyle: 'italic' },
  consultCard: { flex: 1, height: 160, borderRadius: 20, overflow: 'hidden' },
  consultOverlay: { flex: 1, padding: 16, justifyContent: 'space-between', borderRadius: 20 },
  consultIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  consultTitle: { fontSize: 15, fontWeight: '800', color: '#fff', lineHeight: 20 },
  consultSub: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '700' },
});
