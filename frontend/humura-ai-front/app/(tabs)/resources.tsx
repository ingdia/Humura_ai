import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ScrollView, ImageBackground,
  Modal, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../../src/constants/theme';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { width } = Dimensions.get('window');

// ── Data ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',       label: 'All',       labelK: 'Byose' },
  { id: 'stories',   label: 'Stories',   labelK: 'Inkuru' },
  { id: 'health',    label: 'Health',    labelK: 'Ubuzima' },
  { id: 'education', label: 'Education', labelK: 'Uburezi' },
  { id: 'skills',    label: 'Skills',    labelK: 'Ubumenyi' },
  { id: 'legal',     label: 'Rights',    labelK: 'Uburenganzira' },
  { id: 'srh',       label: 'SRH',       labelK: 'Ubuzima bw\'imyororokere' },
];

interface Article {
  id: string;
  category: string;
  tag: string;
  tagK: string;
  title: string;
  titleK: string;
  intro: string;
  introK: string;
  body: string;
  bodyK: string;
  author: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: '1',
    category: 'stories',
    tag: 'Inspiring Story',
    tagK: 'Inkuru izitura',
    title: "From School Dropout to Master Tailor — Amara's Story",
    titleK: "Kuva mu ishuri kugera ku kudoda neza — Inkuru ya Amara",
    intro: "At 17, Amara left school and thought her future was over. Three years later, she runs her own tailoring shop in Nyamirambo.",
    introK: "Afite imyaka 17, Amara yaretse ishuri akabona uko azabaho ari ikibazo. Imyaka itatu nyuma, afungura inzu ye yo kudoda i Nyamirambo.",
    body: "Amara Uwimana grew up in Kicukiro with her grandmother. When she got pregnant at 17, she assumed school was behind her forever.\n\n\"I cried for weeks,\" she said. \"I thought I was nothing without my school certificate.\"\n\nBut her neighbour, a tailor named Dancille, saw something different. She offered Amara a space in her workshop — not out of pity, but because she recognised focus when she saw it.\n\nAmara spent six months learning the machine. She made mistakes, cut wrong, had to unpick stitching again and again. But she kept going.\n\nToday, Amara employs two other young women from her neighbourhood. Her speciality is umushanana — the Rwandan formal dress. She is booked weeks in advance for weddings.\n\n\"My daughter watches me work every day,\" she said. \"I want her to see what is possible.\"",
    bodyK: "Amara Uwimana yakuriye i Kicukiro hamwe na nyirakuru. Igihe yabyaye afite imyaka 17, yibwiraga ko ishuri ryarangiye burundu.\n\n\"Naririye amavuma menshi,\" aravuga. \"Nibwiraga ko ndi ubusa nta mpamyabumenyi nfite.\"\n\nAriko umuturanyi we, umudoda witwaga Dancille, yabonye ikindi. Yamufunguriiye aho gukora mu bwubatsi bwe — si kubera impuhwe, ahubwo kuko yabonaga umukali igihe abitaga.\n\nAmara yanyuze amezi atandatu yiga machine. Yakoshe, aguca nabi, akanza gusohora imibatiro inshuro nyinshi. Ariko akomezaga.\n\nUyu munsi, Amara akora n'abakobwa babiri bandi bo mu muturanyi we. Inzobere ye ni umushanana — impuzu y'impuzabirarane y'u Rwanda. Arangirwa mu buryo bw'ibisaniro amaviki amaze.",
    author: 'Humura Stories',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    category: 'stories',
    tag: 'Inspiring Story',
    tagK: 'Inkuru izitura',
    title: "Clarisse Went Back to School — One Year After Giving Birth",
    titleK: "Clarisse yasubiye mu ishuri — umwaka umwe nyuma yo kubyara",
    intro: "Everyone told her to wait. She enrolled anyway. Now she is in her second year of nursing school.",
    introK: "Bose bamubwiraga ko ategereze. Yiyandikisha anyuze. None ari mu mwaka wa kabiri w'ishuri ry'ubuforomo.",
    body: "Clarisse Nkurunziza had her son in October. By the following September, she was sitting in a classroom again.\n\n\"People said, 'you have a baby now, focus on that.' But I thought — why can't I do both?\"\n\nIt was not easy. She woke at 5am to study before her son needed feeding. She negotiated with her teachers for extra time on assignments. She leaned on her mother, her sister, and a peer support group she found through her local health centre.\n\n\"The hardest part was not the studying. It was believing I was still allowed to want things for myself,\" she said.\n\nClarisse is now studying nursing at a college in Huye. She plans to return to her community as a midwife. \"I want to be there for girls like me,\" she said. \"The ones who think the door is already closed.\"",
    bodyK: "Clarisse Nkurunziza yabyaye umuhungu we mu kwakira. Mu Nzeri ikurikiraho, yari yicaye mu cyumba cy'amasomo nanone.\n\n\"Abantu bavugaga, 'Ubu ufite umwana, wirinde icyo.' Ariko nibwiraga — kuki ntashobora gukora byombi?\"\n\nNtabwo byari byoroshye. Yibukiraga saa cyenda zo mu gitondo kwiga mbere yuko umuhungu we akeneye kunyonya. Yaganiriye n'abarimu be kubona akanya karenga ku bikorwa. Yaregereje nyina, se, n'itsinda ry'inshuti yahasanze kuri kiyazina.",
    author: 'Humura Stories',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    category: 'stories',
    tag: 'Inspiring Story',
    tagK: 'Inkuru izitura',
    title: "Diane Taught Herself to Code at 16. Now She Teaches Others.",
    titleK: "Diane Yigiye Gupanga Kode Afite Imyaka 16. None Yigisha Abandi.",
    intro: "No laptop. No mentor. Just a phone, YouTube, and four hours of sleep a night.",
    introK: "Nta mukomputeri. Nta muyobozi. Gusa telefone, YouTube, na saa nne zo gutaha bukeye.",
    body: "Diane Ingabire learned her first lines of HTML in her school's computer lab — after hours, when the teacher had locked up and she had found a way back in.\n\n\"I knew if I asked for permission they would say no. So I just showed up and made it work,\" she said.\n\nShe taught herself through YouTube tutorials and free online courses, studying by phone until her battery died each night. At 16, she built a simple website for her uncle's pharmacy. He paid her 8,000 RWF — her first income.\n\nAt 19, she was accepted into a tech bootcamp in Kigali. She was the only girl in a group of eleven.\n\n\"I felt it, the way some of them looked at me when I walked in. Like I was there by mistake.\"\n\nShe finished top of her cohort.\n\nToday, Diane runs free Saturday coding sessions for girls aged 14-18 from her neighbourhood in Gikondo. \"Every girl who sits down at that computer changes something in herself,\" she said. \"I know because it happened to me.\"",
    bodyK: "Diane Ingabire yiga imirongo ye ya mbere ya HTML mu cyumba cy'ikoranabuhanga cy'ishuri rye — nyuma y'amasomo, igihe umwarimu yari afunze kandi we asanga uburyo bwo gusubira mu nzu.\n\n\"Nari nzi ko niba nasaba uruhushya bari kuvuga oya. Nuko najanika nkagira uburyo,\" aravuga.\n\nYiyigishije binyuze mu masomero ya YouTube n'amasomo y'ubwisanzure kuri interineti, yiga binyuze kuri telefone kugeza iyo bateri igwa ijoro rirenze. Afite imyaka 16, yubatse urubuga rworoshye rw'apotikari wa sekuru. Yamuhemba franga 8.000 — umusaruro we wa mbere.",
    author: 'Humura Stories',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '7',
    category: 'srh',
    tag: 'SRH Guide',
    tagK: 'Ubuzima bw\'imyororokere',
    title: 'What to Talk About with an SRH Specialist',
    titleK: 'Ibyo Uvugana na Inzobere y\'Ubuzima bw\'Imyororokere',
    intro: "Seeing an SRH specialist for the first time? Here is exactly what you can bring up — no question is too private or too small.",
    introK: "Ugiye kubona inzobere y'ubuzima bw'imyororokere bwa mbere? Dore neza ibintu ushobora kuvugana nawe — nta kibazo gito cyangwa cy'ibanga cyane.",
    body: "An SRH (Sexual and Reproductive Health) specialist is a trained health professional who you can speak to privately and without judgment.\n\nTopics you can bring up freely:\n\n• Contraception — which method fits your life, your body, your plans\n• Irregular or painful periods — this is medical, not normal suffering\n• Pregnancy — whether planned, unplanned, or you're not sure\n• STIs — symptoms, testing, treatment (all confidential)\n• Sexual violence or unwanted contact — they are trained to support you\n• Vaginal discomfort, discharge, or pain during sex — these are medical issues\n• Questions about your body that you've been too embarrassed to ask anyone\n\nWhat to expect:\n1. The consultation is private and confidential\n2. You don't need a parent or guardian to come with you\n3. You won't be judged for your choices or history\n4. They will explain all options before anything happens\n5. You can say no to anything at any point\n\nHow to book:\nIn the Messages tab, tap a specialist's name → then tap 'Book Session' to request a date and time. The doctor will confirm and send a video link if you choose teleconsultation.\n\nFor emergency SRH support right now: call Isange One Stop Center on 3029. Free, 24 hours, confidential.",
    bodyK: "Inzobere y'ubuzima bw'imyororokere (SRH) ni umuganga wamenyeshejwe ushobora kuvugana nawe mu ibanga kandi utagishijwe isoni.\n\nIbintu ushobora kuvuga :\n\n• Uburyo bwo kwirinda inda — ubuhe buryo buhuye ubuzima bwawe, imipaka yawe, n'ibyo ushaka\n• Imihango idatunganye cyangwa irababaza — iyi ni ikibazo cy'ubuvuzi, si ubusanzwe\n• Gutwita — teganyijwe, bitateganijwe, cyangwa ntubizi\n• STI — ibimenyetso, isuzuma, imiti (byose mu ibanga)\n• Guhohotwa bya seksiwali cyangwa gukorwa udashaka — barangojwe kukufasha\n• Ibibazo by'umubiri wawe wahoraga utinya kubaza\n\nIbyo witeganyirize:\n1. Ikiganiro ni mu ibanga\n2. Nta mubyeyi cyangwa umurezi ukeneye kujyana nawe\n3. Ntuzagishijwa isoni kubera ibyagiye cyangwa ibyo uhitamo",
    author: 'Humura SRH Team',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    category: 'health',
    tag: 'Health',
    tagK: 'Ubuzima',
    title: 'Your Body, Your Rights — What Every Young Woman Should Know',
    titleK: "Umubiri wawe, Uburenganzira bwawe — Ibyo umukobwa wese agomba kumenya",
    intro: "Understanding contraception and reproductive rights is not shameful — it is knowledge that protects you.",
    introK: "Gusobanukirwa uburyo bwo kwirinda inda zitateganyijwe n'uburenganzira bw'imyororokere si isoni — ni ubumenyi bukurinda.",
    body: "Knowing your reproductive rights means you can make safe, informed choices for your own body and your own future.\n\nContraception is available, legal, and confidential at most health centres across Rwanda. You do not need a parent's permission. You do not need to be married.\n\nCommon options include:\n• Oral contraceptive pills (taken daily)\n• Injectable contraception (every 3 months)\n• Implant (lasts up to 3 years)\n• Condoms (also protect against STIs)\n\nIf you have experienced unwanted sexual contact or are worried about an unplanned pregnancy, Isange One Stop Center (call 3029) offers free, confidential support — medical, legal, and psychological.\n\nYou are never alone. Knowledge is the first protection.",
    bodyK: "Gusobanukirwa uburenganzira bw'imyororokere bisobanura ko ushobora gufata imyanzuro iboneye, ikurikira ubumenyi kuri umubiri wawe n'ejo hawe.\n\nUburyo bwo kwirinda inda bushoborika, ni bwemewe, kandi buba mu ibanga mu mavuriro menshi mu Rwanda. Ntukeneye uruhushya rw'umubyeyi. Ntukeneye kubana n'uwo bashakanye.\n\nInzira zikunze gukoreshwa ni:\n• Ibinini byo gufata buri munsi\n• Urushinge (buri mezi atatu)\n• Implant (igamije imyaka itatu)\n• Agacondomu (birarinda no kwandura indwara)\n\nNiba wahuye n'isoni z'ubusambanyi buteganijwe cyangwa utinya inda itateganijwe, Isange One Stop Center (hamagara 3029) itanga ubufasha buhoraho, mu ibanga — ubuvuzi, amategeko, n'ubwenge.",
    author: 'Humura Health Team',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    category: 'legal',
    tag: 'Know Your Rights',
    tagK: 'Menya uburenganzira bwawe',
    title: 'If You Have Been Hurt — Legal Help Is Free and Confidential',
    titleK: "Niba Wahohotewe — Ubufasha bw'amategeko ni ubuntu kandi buba mu ibanga",
    intro: "Violence is never your fault. There are people trained to help you, and the law is on your side.",
    introK: "Guhohotwa si ikosa ryawe. Hari abantu baragoye gufasha, kandi amategeko ari ku ruhande rwawe.",
    body: "If you have experienced gender-based violence, sexual assault, or have been forced into a pregnancy, you are protected by Rwandan law — and free help is available right now.\n\nIsange One Stop Center\nCall: 3029 (free, 24 hours)\nServices: Medical care, psychological support, legal advice, safe shelter\n\nMAJ — Maison d'Accès à la Justice\nFree legal advice and representation across Rwanda\n\nYouth Helpline (HDI)\nCall: 3530\nFor young people facing any crisis\n\nChild Helpline\nCall: 116\n\nWhat to know:\n• You do not need money to access these services\n• You do not need to tell a parent or guardian\n• Medical evidence can be collected — it helps, but you do not have to wait for it to ask for help\n• Your report is confidential\n\nYou deserve safety. Reach out.",
    bodyK: "Niba wahuye n'ubutegetsi bw'igitsina, guhohotwa bya seksiwali, cyangwa watewe inda udashaka, amategeko y'u Rwanda akurinda — kandi ubufasha bubuntu buhari ubu.\n\nIsange One Stop Center\nHamagara: 3029 (ubuntu, amasaha 24)\nSerivisi: Ubuvuzi, ubufasha bw'iby'umutima, inama z'amategeko, inzu y'umutekano\n\nMAJ — Maison d'Accès à la Justice\nInama z'amategeko z'ubuntu kandi guhagararirwa mu Rwanda\n\nUrugendo rw'Urubyiruko (HDI)\nHamagara: 3530\nKubo bari mu bibazo igihe cyose",
    author: 'Humura Rights Team',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    category: 'education',
    tag: 'Education',
    tagK: 'Uburezi',
    title: 'You Can Go Back — Resources for Young Mothers Returning to School',
    titleK: "Ushobora Gusubira — Uburyo bw'inkunga ku babyeyi bato basubira mu ishuri",
    intro: "Education is a right, not a privilege. Here is how to find your way back in.",
    introK: "Uburezi ni uburenganzira, si impundu. Uru ni uburyo bwo kurongera inzira yawe.",
    body: "Rwanda's education policy protects the right of young mothers to return to school after giving birth. You cannot legally be barred from school because of a pregnancy.\n\nSteps to return:\n1. Visit your school's head teacher or district education officer\n2. Ask about re-enrollment — you have the right to be readmitted\n3. If you face barriers, contact the Rwanda Education Board (REB): 0788 305 106\n\nOrganisations that can help:\n• Imbuto Foundation — scholarship and mentorship programmes for young mothers\n• FAWE Rwanda — supports girls' education, including re-entry after pregnancy\n• Plan International Rwanda — vocational and education programmes\n\nVocational options if returning to formal school is difficult:\nThe Workforce Development Authority (WDA) runs skills centres across Rwanda where you can learn tailoring, cookery, hospitality, ICT, and more — often for free or at low cost.\n\nYour future did not stop. It paused. You can start again.",
    bodyK: "Politike y'uburezi y'u Rwanda irinda uburenganzira bw'umubyeyi muto gusubira mu ishuri nyuma yo kubyara. Ntushobora guburizwa mu mategeko mu ishuri kubera inda.\n\nInzira zo gusubira:\n1. Sura umuyobozi w'ishuri cyangwa umukozi w'uburezi w'akarere\n2. Baza gusubira — ufite uburenganzira bwo kwakira\n3. Niba uhura n'inzitizi, vugana na REB: 0788 305 106\n\nImiryango ishobora gufasha:\n• Imbuto Foundation — porogaramu z'inkunga z'amafaranga no kuyoboka ku babyeyi bato\n• FAWE Rwanda — ishyigikira uburezi bw'abakobwa, harimo gusubira nyuma yo gutwita\n• Plan International Rwanda — porogaramu z'imyuga n'uburezi",
    author: 'Humura Education Team',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
];

const HELPLINES = [
  { name: 'Isange', number: '3029', icon: 'shield-checkmark' as const, color: '#E74C3C' },
  { name: 'Youth Line', number: '3530', icon: 'call' as const, color: '#4a90e2' },
  { name: 'Child Line', number: '116', icon: 'heart' as const, color: '#27AE60' },
  { name: 'Police', number: '112', icon: 'flash' as const, color: '#F39C12' },
];

const TAG_COLORS: Record<string, string> = {
  stories: '#8E44AD',
  health: '#27AE60',
  legal: '#E74C3C',
  education: '#4a90e2',
  skills: '#F39C12',
};

// ── Component ──────────────────────────────────────────────────
export default function ResourcesScreen() {
  const { t, language } = useLanguage();
  const isKn = language === 'kn';
  const [activeCategory, setActiveCategory] = useState('all');
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const storySlides = ARTICLES.filter(a => a.category === 'stories');
  const SLIDE_W = width - 32;
  const carouselRef = useRef<ScrollView>(null);

  const handleCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (SLIDE_W + 16));
    setSlideIndex(idx);
  };

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => {
        const next = (prev + 1) % storySlides.length;
        carouselRef.current?.scrollTo({ x: next * (SLIDE_W + 16), animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [storySlides.length, SLIDE_W]);

  const filtered = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  // Stories always show in carousel; list shows non-story articles for current filter
  const listArticles = filtered.filter(a => a.category !== 'stories');

  const tagColor = (cat: string) => TAG_COLORS[cat] ?? Colors.primary;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{isKn ? 'Inyandiko & Inkuru' : 'Stories & Resources'}</Text>
          <Text style={styles.headerSub}>{isKn ? 'Soma. Menya. Iterimbere.' : 'Read. Learn. Grow.'}</Text>
        </View>
        <View style={styles.titleUnderline} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Emergency helplines 2×2 grid ── */}
        <View style={styles.helplinesGrid}>
          {HELPLINES.map((h, i) => (
            <View key={i} style={styles.helplineCard}>
              <View style={[styles.helplineIconBox, { backgroundColor: h.color + '15' }]}>
                <Ionicons name={h.icon} size={18} color={h.color} />
              </View>
              <View style={styles.helplineTextCol}>
                <Text style={styles.helplineName}>{h.name}</Text>
                <Text style={[styles.helplineNum, { color: h.color }]}>{h.number}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Category pills ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.catPill, activeCategory === c.id && styles.catPillActive]}
              onPress={() => setActiveCategory(c.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.catPillText, activeCategory === c.id && styles.catPillTextActive]}>
                {isKn ? c.labelK : c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Inspiring Stories carousel — always visible ── */}
        {true && (
          <View style={styles.carouselWrap}>
            <Text style={styles.sectionLabel}>
              {isKn ? 'INKURU ZITURURA' : 'INSPIRING STORIES'}
            </Text>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SLIDE_W + 16}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
              onMomentumScrollEnd={handleCarouselScroll}
            >
              {storySlides.map(story => (
                <TouchableOpacity
                  key={story.id}
                  activeOpacity={0.9}
                  onPress={() => setOpenArticle(story)}
                  style={{ width: SLIDE_W }}
                >
                  <ImageBackground
                    source={{ uri: story.image }}
                    style={styles.slideImage}
                    imageStyle={{ borderRadius: 20 }}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(13,27,42,0.93)']}
                      style={styles.slideOverlay}
                    >
                      <View style={[styles.tagPill, { backgroundColor: tagColor(story.category) }]}>
                        <Text style={styles.tagText}>{isKn ? story.tagK : story.tag}</Text>
                      </View>
                      <Text style={styles.slideTitle}>{isKn ? story.titleK : story.title}</Text>
                      <Text style={styles.slideIntro} numberOfLines={2}>
                        {isKn ? story.introK : story.intro}
                      </Text>
                      <View style={styles.slideMeta}>
                        <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.65)" />
                        <Text style={styles.slideMetaText}>{story.readTime} read</Text>
                        <Text style={styles.slideMetaDot}>·</Text>
                        <Text style={styles.slideMetaText}>{story.author}</Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Dot indicators */}
            <View style={styles.dotsRow}>
              {storySlides.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === slideIndex && styles.dotActive]}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── Section label for rest ── */}
        {listArticles.length > 0 && (
          <Text style={styles.sectionLabel}>
            {isKn ? 'INYANDIKO ZINDI' : 'MORE ARTICLES'}
          </Text>
        )}

        {/* ── Article list ── */}
        {listArticles.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleRow}
            activeOpacity={0.88}
            onPress={() => setOpenArticle(article)}
          >
            <ImageBackground
              source={{ uri: article.image }}
              style={styles.articleThumb}
              imageStyle={{ borderRadius: 14 }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)']}
                style={StyleSheet.absoluteFill}
              />
            </ImageBackground>
            <View style={styles.articleInfo}>
              <View style={[styles.tagPillSmall, { backgroundColor: tagColor(article.category) + '20' }]}>
                <Text style={[styles.tagPillSmallText, { color: tagColor(article.category) }]}>
                  {isKn ? article.tagK : article.tag}
                </Text>
              </View>
              <Text style={styles.articleTitle} numberOfLines={3}>
                {isKn ? article.titleK : article.title}
              </Text>
              <View style={styles.articleMeta}>
                <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
                <Text style={styles.articleMetaText}>{article.readTime}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Article modal ── */}
      <Modal visible={!!openArticle} animationType="slide">
        {openArticle && (
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Modal top bar */}
            <View style={styles.modalBar}>
              <TouchableOpacity style={styles.modalBackBtn} onPress={() => setOpenArticle(null)}>
                <Ionicons name="chevron-back" size={22} color={Colors.text} />
              </TouchableOpacity>
              <View style={[styles.tagPillSmall, { backgroundColor: tagColor(openArticle.category) + '20' }]}>
                <Text style={[styles.tagPillSmallText, { color: tagColor(openArticle.category) }]}>
                  {isKn ? openArticle.tagK : openArticle.tag}
                </Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Hero image */}
              <ImageBackground
                source={{ uri: openArticle.image }}
                style={styles.modalHeroImage}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,1)']}
                  style={styles.modalHeroFade}
                />
              </ImageBackground>

              <View style={styles.modalBody}>
                <Text style={styles.modalTitle}>
                  {isKn ? openArticle.titleK : openArticle.title}
                </Text>

                <View style={styles.modalMeta}>
                  <View style={styles.modalAuthorDot} />
                  <Text style={styles.modalAuthor}>{openArticle.author}</Text>
                  <Text style={styles.modalMetaDot}>·</Text>
                  <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.modalAuthor}>{openArticle.readTime} read</Text>
                </View>

                {/* Pull quote */}
                <View style={styles.pullQuote}>
                  <View style={styles.pullQuoteLine} />
                  <Text style={styles.pullQuoteText}>
                    {isKn ? openArticle.introK : openArticle.intro}
                  </Text>
                </View>

                <Text style={styles.modalBodyText}>
                  {isKn ? openArticle.bodyK : openArticle.body}
                </Text>

                {/* Bottom CTA */}
                <View style={styles.emergencyBox}>
                  <Ionicons name="heart" size={18} color="#E74C3C" />
                  <Text style={styles.emergencyText}>
                    {isKn
                      ? 'Niba ukeneye ubufasha ubu: Isange 3029 · Urubyiruko 3530'
                      : 'Need support now? Isange 3029 · Youth Line 3530'}
                  </Text>
                </View>
              </View>
              <View style={{ height: 60 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 16 },

  header: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 20, backgroundColor: '#fff', ...Shadows.soft },
  headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.text },
  headerSub: { fontSize: 14, color: Colors.textMuted, marginTop: 3, fontWeight: '500' },
  titleUnderline: { width: 36, height: 4, backgroundColor: Colors.primary, borderRadius: 2, marginTop: 12 },

  // Helplines 2×2 grid
  helplinesGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, gap: 10,
  },
  helplineCard: {
    width: (width - 42) / 2,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    ...Shadows.soft, borderWidth: 1, borderColor: '#F1F5F9',
  },
  helplineIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  helplineTextCol: { flex: 1 },
  helplineName: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', marginBottom: 2 },
  helplineNum: { fontSize: 18, fontWeight: '900' },

  // Category pills
  catScroll: { paddingHorizontal: 16, paddingBottom: 4, gap: 8 },
  catPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  catPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catPillText: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  catPillTextActive: { color: '#fff' },

  // Stories carousel
  carouselWrap: { marginTop: 8 },
  slideImage: { width: '100%', height: 290, justifyContent: 'flex-end', borderRadius: 20, overflow: 'hidden' },
  slideOverlay: { padding: 20, paddingTop: 80, borderRadius: 20 },
  slideTitle: { fontSize: 20, fontWeight: '900', color: '#fff', lineHeight: 27, marginTop: 8, marginBottom: 8 },
  slideIntro: { fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 20, fontWeight: '500', marginBottom: 12 },
  slideMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  slideMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  slideMetaDot: { color: 'rgba(255,255,255,0.4)', marginHorizontal: 4 },

  // Dot indicators
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E1' },
  dotActive: { width: 18, backgroundColor: Colors.primary },

  // Tag pills
  tagPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  tagText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.4 },
  tagPillSmall: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagPillSmallText: { fontSize: 10, fontWeight: '800' },

  // Section label
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: Colors.textMuted,
    letterSpacing: 1.5, marginHorizontal: 20, marginTop: 28, marginBottom: 12,
  },

  // Article row
  articleRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 2,
    paddingVertical: 16, paddingHorizontal: 16, borderRadius: 18,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    ...Shadows.soft,
  },
  articleThumb: { width: 90, height: 90, borderRadius: 14, overflow: 'hidden' },
  articleInfo: { flex: 1, paddingTop: 2 },
  articleTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, lineHeight: 21, marginTop: 6, marginBottom: 8 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  articleMetaText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },

  // Modal
  modalBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  modalBackBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },

  modalHeroImage: { width: '100%', height: 280 },
  modalHeroFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },

  modalBody: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 24 },
  modalTitle: { fontSize: 26, fontWeight: '900', color: Colors.text, lineHeight: 33, marginBottom: 14 },

  modalMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
  modalAuthorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  modalAuthor: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  modalMetaDot: { color: '#CBD5E1', fontSize: 16 },

  pullQuote: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  pullQuoteLine: { width: 4, borderRadius: 2, backgroundColor: Colors.primary },
  pullQuoteText: { flex: 1, fontSize: 16, fontStyle: 'italic', color: Colors.text, lineHeight: 24, fontWeight: '600' },

  modalBodyText: { fontSize: 16, color: '#334155', lineHeight: 28, fontWeight: '400' },

  emergencyBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFF5F5', padding: 16, borderRadius: 16, marginTop: 28,
    borderWidth: 1, borderColor: '#FECACA',
  },
  emergencyText: { flex: 1, fontSize: 14, color: '#991B1B', fontWeight: '600', lineHeight: 20 },
});
