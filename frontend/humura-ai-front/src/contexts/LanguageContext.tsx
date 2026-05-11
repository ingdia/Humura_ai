import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    greeting: 'Good morning',
    greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening',
    how_feeling: 'How are you feeling?',
    talk_specialist: 'Talk to our specialist',
    overwhelmed: 'Do you feel overwhelmed? Talk to our specialist now...',
    wellness_tools: 'Wellness Tools',
    community_title: 'Community',
    chat_select_pro: 'Talk to a Professional',
    chat_select_desc: 'Choose who you would like to talk to. All conversations are anonymous.',
    role_psychologist: 'Psychologist',
    role_psychologist_desc: 'Mental health, anxiety, and trauma support.',
    role_social_worker: 'Social Worker',
    role_social_worker_desc: 'SRH, legal rights, and social protection.',
    role_peer_support: 'Peer Support',
    role_peer_support_desc: 'Guidance from someone who has been there.',
    pro_amina: 'Dr. Amina',
    pro_grace: 'Nurse Grace',
    pro_keza: 'Brother Keza',
    chat_placeholder: 'Type your message privately...',
    community_desc: 'You are not alone. 47 active today.',
    calm_title: 'Calm Mode',
    calm_desc: 'Breathe & find peace.',
    resources_title: 'Resources',
    resources_desc: 'Read, learn, understand.',
    srh_title: 'SRH',
    srh_desc: 'Sexual & reproductive health. Ask safely.',
    mood_title: 'Mood Tracker',
    mood_desc: 'Track your patterns.',
    social_community: 'Social Community',
    social_desc: 'Talk freely with our community.',
    book_therapist: 'Book a Specialist',
    subsidized: 'Subsidized →',
    groups_title: 'Discussion Groups',
    group_grief: 'Grief Support',
    group_grief_desc: 'Find comfort and share memories in a safe space.',
    group_anxiety: 'Anxiety Circle',
    group_anxiety_desc: 'Techniques and support for managing daily stress.',
    group_srh: 'SRH Discussion',
    group_srh_desc: 'Private talk on sexual and reproductive health.',
    group_wellness: 'Mental Wellness',
    group_wellness_desc: 'General wellness and holistic health tips.',
    group_recovery: 'Recovery Path',
    group_recovery_desc: 'Support for overcoming trauma and addiction.',
    group_motherhood: 'Motherhood',
    group_motherhood_desc: 'Connecting mothers through shared journeys.',
    enter_group: 'Enter Group',
    share_anonymous: 'Post Anonymously',
    anonymous_desc: 'Your identity is protected.',
    share_thoughts: 'Share your thoughts...',
    share_privately: 'Share Privately',
  },
  kn: {
    greeting: 'Mwiriwe neza',
    greeting_afternoon: 'Mwirirwe neza',
    greeting_evening: 'Mwiriwe neza',
    how_feeling: 'Umeze ute uyu munsi?',
    talk_specialist: 'Vugana n’inzobere yacu',
    overwhelmed: 'Wumva uremerewe? Vugana n’inzobere yacu ubu...',
    wellness_tools: 'Ibikoresho by’ubuzima',
    community_title: 'Itsinda',
    chat_select_pro: 'Vugana n’inzobere',
    chat_select_desc: 'Hitamo uwo wifuza kuvugana nawe. Ibiganiro byose biba mu ibanga.',
    community_desc: 'Ntabwo uri wenyine. 47 bari kumwe natwe.',
    calm_title: 'Igihe cyo gutuza',
    calm_desc: 'Humeka kandi utuze.',
    resources_title: 'Amakuru',
    resources_desc: 'Soma, igire, usobanukirwe.',
    srh_title: 'Ubuzima bw’imyororokere',
    srh_desc: 'Ubuzima bw’imyororokere. Baza mu mutuzo.',
    mood_title: 'Gukurikirana uko wiyumva',
    mood_desc: 'Reba imiterere y’ibyiyumvo byawe.',
    social_community: 'Itsinda ryacu',
    social_desc: 'Vugana n’abandi mu mutuzo.',
    book_therapist: 'Gushaka inzobere',
    subsidized: 'Kunganirwa →',
    groups_title: 'Amatsinda yo kuganira',
    group_grief: 'Kwihangana mu kababaro',
    group_grief_desc: 'Gushaka ihumure no gusangira amateka ahantu hizewe.',
    group_anxiety: 'Gufashanya mu guhangayika',
    group_anxiety_desc: 'Uburyo n’ubufasha bwo guhangana n’imihangayiko ya buri munsi.',
    group_srh: 'Kuganira ku buzima bw’imyororokere',
    group_srh_desc: 'Ikiganiro cy’ibanga ku buzima bw’imyororokere.',
    group_wellness: 'Ubuzima bwo mu mutwe',
    role_psychologist: 'Umusinganyandwara',
    role_psychologist_desc: 'Ubuzima bwo mu mutwe, guhangayika, n’ihungabana.',
    role_social_worker: 'Umukozi mbonezamubano',
    role_social_worker_desc: 'SRH, uburenganzira mu mategeko, n’imibereho myiza.',
    role_peer_support: 'Ubufasha bwa bagenzi bawe',
    role_peer_support_desc: 'Inama zitanzwe n\'umuntu wanyuze mu byo urimo.',
    pro_amina: 'Dr. Amina',
    pro_grace: 'Umuganga Grace',
    pro_keza: 'Keza',
    chat_placeholder: 'Andika ubutumwa bwawe mu ibanga...',
    group_wellness_desc: 'Inama rusange ku buzima n’uburyo bwo kwitaho.',
    group_recovery: 'Inzira y’ubuzima bushya',
    group_recovery_desc: 'Ubufasha bwo kurenga ihungabana n’ibiyobyabwenge.',
    group_motherhood: 'Kuba umubyeyi',
    group_motherhood_desc: 'Guhuza ababyeyi binyuze mu gusangira amateka.',
    enter_group: 'Injira mu itsinda',
    share_anonymous: 'Andika mu ibanga',
    anonymous_desc: 'Umwirondoro wawe urahishwe.',
    share_thoughts: 'Sangira natwe ibiguri ku mutima...',
    share_privately: 'Andika mu ibanga',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
