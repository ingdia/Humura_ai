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
    how_feeling: 'How can we help you today?',
    talk_specialist: 'Talk to an SRH specialist',
    overwhelmed: 'Do you have a sensitive question? Talk to our specialist now...',
    wellness_tools: 'Safe Tools',
    community_title: 'Community',
    chat_select_pro: 'Talk to a Professional',
    chat_select_desc: 'Choose who you would like to talk to. All conversations are anonymous.',
    role_srh_specialist: 'SRH Specialist',
    role_srh_specialist_desc: 'Sexual health, contraception, and pregnancy guidance.',
    role_social_worker: 'Social Worker',
    role_social_worker_desc: 'SRH rights, legal support, and protection.',
    role_peer_support: 'Peer Support',
    role_peer_support_desc: 'Guidance from someone who has been there.',
    pro_amina: 'Nurse Amina',
    pro_grace: 'Nurse Grace',
    pro_keza: 'Counselor Keza',
    chat_placeholder: 'Type your message privately...',
    community_desc: 'You are not alone. 47 active today.',
    resources_title: 'Library',
    resources_desc: 'Read, learn, understand.',
    srh_title: 'SRH',
    srh_desc: 'Sexual & reproductive health. Ask safely.',
    calm_title: '360 Support',
    clinic_locator: 'Clinic Locator',
    social_community: 'Social Community',
    social_desc: 'Talk freely with our community.',
    book_therapist: 'Book a Specialist',
    subsidized: 'Safe & Private →',
    groups_title: 'Discussion Groups',
    group_srh: 'SRH Discussion',
    group_srh_desc: 'Private talk on sexual and reproductive health.',
    group_rights: 'Sexual Rights',
    group_rights_desc: 'Understanding your body and your legal rights.',
    group_contraception: 'Safe Contraception',
    group_contraception_desc: 'Choosing the right protection for your future.',
    group_motherhood: 'Teen Motherhood',
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
    how_feeling: 'Ni gute twagufasha uyu munsi?',
    talk_specialist: 'Vugana n’inzobere yacu',
    overwhelmed: 'Waba ufite ikibazo cyihariye? Vugana n’inzobere ubu...',
    wellness_tools: 'Ibikoresho byizewe',
    community_title: 'Itsinda',
    chat_select_pro: 'Vugana n’inzobere',
    chat_select_desc: 'Hitamo uwo wifuza kuvugana nawe. Ibiganiro byose biba mu ibanga.',
    community_desc: 'Ntabwo uri wenyine. 47 bari kumwe natwe.',
    resources_title: 'Amakuru',
    resources_desc: 'Soma, igire, usobanukirwe.',
    srh_title: 'Ubuzima bw’imyororokere',
    srh_desc: 'Ubuzima bw’imyororokere. Baza mu mutuzo.',
    calm_title: 'Ubufasha bwuzuye',
    clinic_locator: 'Amavuriro akwegereye',
    social_community: 'Itsinda ryacu',
    social_desc: 'Vugana n’abandi mu mutuzo.',
    book_therapist: 'Gushaka inzobere',
    subsidized: 'Mu ibanga rikomeye →',
    groups_title: 'Amatsinda yo kuganira',
    group_srh: 'Ubuzima bw’imyororokere',
    group_srh_desc: 'Ikiganiro cy’ibanga ku buzima bw’imyororokere.',
    group_rights: 'Uburenganzira bwawe',
    group_rights_desc: 'Gusobanukirwa umubiri wawe n\'uburenganzira bwawe.',
    group_contraception: 'Kwirinda inda zitateganyijwe',
    group_contraception_desc: 'Guhitamo uburyo bukwaniye ku bwa kazoza kawe.',
    role_srh_specialist: 'Inzobere muri SRH',
    role_srh_specialist_desc: 'Ubuzima bw’imyororokere n’uburyo bwo kwirinda.',
    role_social_worker: 'Umukozi mbonezamubano',
    role_social_worker_desc: 'Uburenganzira muri SRH n’imibereho myiza.',
    role_peer_support: 'Ubufasha bwa bagenzi bawe',
    role_peer_support_desc: 'Inama zitanzwe n\'umuntu wanyuze mu byo urimo.',
    pro_amina: 'Umuganga Amina',
    pro_grace: 'Umuganga Grace',
    pro_keza: 'Keza',
    chat_placeholder: 'Andika ubutumwa bwawe mu ibanga...',
    group_motherhood: 'Kuba umubyeyi ukiri muto',
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
