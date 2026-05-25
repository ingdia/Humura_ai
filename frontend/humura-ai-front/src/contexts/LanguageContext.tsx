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
    calm_title: 'Just Breathe',
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

    // Professional portal
    pro_welcome_back: 'Welcome back 🌟',
    pro_dashboard_title: 'Dashboard',
    pro_active_sessions: 'Active Sessions',
    pro_pending_qa: 'Pending Q&A',
    pro_upcoming_sessions: 'Upcoming Sessions',
    pro_no_sessions: 'No upcoming sessions for today.',
    pro_no_sessions_sub: 'Take some time to review resources or respond to Q&As!',
    pro_toolkit: 'Professional Toolkit',
    pro_schedule: 'Schedule',
    pro_manage_bookings: 'Manage bookings',
    pro_qa_forum: 'Q&A Forum',
    pro_answer_inquiries: 'Answer inquiries',
    pro_inbox_label: 'Inbox',
    pro_availability: 'Availability',
    pro_set_hours: 'Set weekly hours',
    pro_join_meet: 'Join Meet',
    pro_virtual: 'Virtual',
    pro_in_person: 'In-Person',

    // Appointments
    pro_client_sessions: 'Client Sessions',
    pro_upcoming: 'Upcoming',
    pro_pending_requests: 'Pending Requests',
    pro_virtual_room: 'Virtual Room',
    pro_awaiting_action: 'Awaiting Action',
    pro_message: 'Message',
    pro_start_meet: 'Start Meet',
    pro_view_clinic: 'View Clinic',
    pro_decline: 'Decline',
    pro_accept_booking: 'Accept Booking',
    pro_teleconsult_virtual: 'Virtual (Telehealth)',
    pro_teleconsult_inperson: 'In-Person Clinic',
    pro_teleconsult_link_gen: 'Generates secure meeting link',
    pro_teleconsult_clinic: 'Kigali Mental Health Center',
    pro_no_confirmed: 'No upcoming sessions confirmed',
    pro_no_confirmed_sub: 'Approve incoming sessions in the "Pending Requests" tab.',
    pro_all_caught_up: 'All caught up!',
    pro_no_pending: 'No pending session requests to approve at the moment.',

    // Q&A
    pro_anonymous_qa: 'Anonymous Q&A',
    pro_inquiries: 'Inquiries',
    pro_answered_forum: 'Answered Forum',
    pro_your_guidance: 'Your Therapeutic Guidance',
    pro_reply_placeholder: 'Write a compassionate, CBT-focused response...',
    pro_anonymous_answer: 'Anonymous professional answer.',
    pro_publish: 'Publish',
    pro_all_answered: 'All questions answered!',
    pro_no_inquiries: 'No anonymous student inquiries are currently awaiting responses. Thank you!',
    pro_no_forum: 'No answered forum entries',
    pro_no_forum_sub: 'Guidance you publish will appear here in the public forum archives.',
    pro_verified: 'Verified',

    // Inbox
    pro_patient_messages: 'Patient Messages',
    pro_recent_inquiries: 'Recent Inquiries',
    pro_encrypted: 'This connection is fully encrypted. Support provided is public and certified.',
    pro_online: 'Online',
    pro_offline: 'Offline',
    pro_typing: 'Typing...',

    // Profile
    pro_profile_practice: 'Profile & Practice',
    pro_practice_settings: 'Practice Settings',
    pro_weekly_availability: 'Weekly Availability',
    pro_availability_sub: 'Set active work hours for student/patient calendar bookings.',
    pro_clinic_affiliation: 'Clinic Affiliation',
    pro_hourly_rate: 'Hourly Therapy Rate',
    pro_edit_profile: 'Edit Profile',
    pro_professional_name: 'Professional Name',
    pro_specialization: 'Specialization',
    pro_professional_bio: 'Professional Bio',
    pro_cancel: 'Cancel',
    pro_save: 'Save',
    pro_unavailable: 'Unavailable',
    pro_end_session: 'End Professional Session',

    // Extra strings
    pro_unread: 'unread',
    pro_requested_slot: 'Requested slot',
    pro_answer_by: 'Answer by',
    pro_reply_as: 'Reply as',

    // Appointment types
    appt_initial: 'Initial Consultation',
    appt_followup: 'Follow-up Session',
    appt_stress: 'Stress Management',
    appt_general: 'General Session',
  },
  kn: {
    greeting: 'Mwiriwe neza',
    greeting_afternoon: 'Mwirirwe neza',
    greeting_evening: 'Mwiriwe neza',
    how_feeling: 'Ni gute twagufasha uyu munsi?',
    talk_specialist: "Vugana n'inzobere yacu",
    overwhelmed: "Waba ufite ikibazo cyihariye? Vugana n'inzobere ubu...",
    wellness_tools: 'Ibikoresho byizewe',
    community_title: 'Itsinda',
    chat_select_pro: "Vugana n'inzobere",
    chat_select_desc: 'Hitamo uwo wifuza kuvugana nawe. Ibiganiro byose biba mu ibanga.',
    community_desc: 'Ntabwo uri wenyine. 47 bari kumwe natwe.',
    resources_title: 'Amakuru',
    resources_desc: 'Soma, igire, usobanukirwe.',
    srh_title: "Ubuzima bw'imyororokere",
    srh_desc: "Ubuzima bw'imyororokere. Baza mu mutuzo.",
    calm_title: 'Humeka',
    clinic_locator: 'Amavuriro akwegereye',
    social_community: 'Itsinda ryacu',
    social_desc: "Vugana n'abandi mu mutuzo.",
    book_therapist: 'Gushaka inzobere',
    subsidized: 'Mu ibanga rikomeye →',
    groups_title: 'Amatsinda yo kuganira',
    group_srh: "Ubuzima bw'imyororokere",
    group_srh_desc: "Ikiganiro cy'ibanga ku buzima bw'imyororokere.",
    group_rights: 'Uburenganzira bwawe',
    group_rights_desc: "Gusobanukirwa umubiri wawe n'uburenganzira bwawe.",
    group_contraception: 'Kwirinda inda zitateganyijwe',
    group_contraception_desc: 'Guhitamo uburyo bukwaniye ku bwa kazoza kawe.',
    role_srh_specialist: 'Inzobere muri SRH',
    role_srh_specialist_desc: "Ubuzima bw'imyororokere n'uburyo bwo kwirinda.",
    role_social_worker: 'Umukozi mbonezamubano',
    role_social_worker_desc: "Uburenganzira muri SRH n'imibereho myiza.",
    role_peer_support: 'Ubufasha bwa bagenzi bawe',
    role_peer_support_desc: "Inama zitanzwe n'umuntu wanyuze mu byo urimo.",
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

    // Professional portal
    pro_welcome_back: 'Murakaza neza 🌟',
    pro_dashboard_title: 'Ikibaho',
    pro_active_sessions: 'Inama Zikora',
    pro_pending_qa: 'Ibibazo Bitegereje',
    pro_upcoming_sessions: 'Inama Ziri Imbere',
    pro_no_sessions: 'Nta nama ziteganyijwe uyu munsi.',
    pro_no_sessions_sub: 'Nufate igihe ugenzure ibibazo cyangwa usubize ibibazo!',
    pro_toolkit: "Ibikoresho by'Inzobere",
    pro_schedule: 'Gahunda',
    pro_manage_bookings: 'Gucunga igihe',
    pro_qa_forum: "Ibibazo n'Ibisubizo",
    pro_answer_inquiries: 'Subiza ibibazo',
    pro_inbox_label: 'Ubutumwa',
    pro_availability: 'Igihe Mboneka',
    pro_set_hours: "Shyiraho amasaha y'icyumweru",
    pro_join_meet: 'Injira mu nama',
    pro_virtual: 'Kuri interineti',
    pro_in_person: 'Aho bari',

    // Appointments
    pro_client_sessions: "Inama z'Abarwayi",
    pro_upcoming: 'Izi Ziri Imbere',
    pro_pending_requests: 'Izisabwa',
    pro_virtual_room: 'Icumba cya Interineti',
    pro_awaiting_action: 'Bitegereje Igikorwa',
    pro_message: 'Ohereza Ubutumwa',
    pro_start_meet: 'Tangira Inama',
    pro_view_clinic: 'Reba Kiliniki',
    pro_decline: 'Nyima',
    pro_accept_booking: 'Emera Igihe',
    pro_teleconsult_virtual: 'Kuri interineti (Telemedicine)',
    pro_teleconsult_inperson: 'Kiliniki Aho Bari',
    pro_teleconsult_link_gen: "Ifungura umuyoboro w'inama ibanga",
    pro_teleconsult_clinic: 'Ikigo Ndangamuntu cya Kigali',
    pro_no_confirmed: 'Nta nama zemejwe',
    pro_no_confirmed_sub: 'Emeza izisabwa mu gahunda "Izisabwa".',
    pro_all_caught_up: 'Byose birangiye!',
    pro_no_pending: "Nta busabe bw'inama butegereje ubu.",

    // Q&A
    pro_anonymous_qa: 'Ibibazo mu Ibanga',
    pro_inquiries: 'Ibibazo',
    pro_answered_forum: 'Ibisubizo Byatanzwe',
    pro_your_guidance: "Inama Zawe z'Ubuvuzi",
    pro_reply_placeholder: "Andika igisubizo cy'inzobere cy'ubuntu...",
    pro_anonymous_answer: "Igisubizo cy'inzobere mu ibanga.",
    pro_publish: 'Sohorera',
    pro_all_answered: 'Ibibazo byose byasubijwe!',
    pro_no_inquiries: "Nta bibazo by'ibanga bihari ubu. Murakoze!",
    pro_no_forum: 'Nta bisubizo byatanzwe',
    pro_no_forum_sub: 'Ibisubizo byawe bizasohoka hano.',
    pro_verified: 'Byemejwe',

    // Inbox
    pro_patient_messages: "Ubutumwa bw'Abarwayi",
    pro_recent_inquiries: 'Ibibazo Bishya',
    pro_encrypted: 'Iyunganira ryawe ririnzwe. Ubufasha butangwa mu ruhame kandi bwemejwe.',
    pro_online: 'Kuri interineti',
    pro_offline: 'Ntari ku murimo',
    pro_typing: 'Andika...',

    // Profile
    pro_profile_practice: "Umwirondoro n'Akazi",
    pro_practice_settings: "Igenamiterere ry'Akazi",
    pro_weekly_availability: 'Igihe Mboneka mu Cyumweru',
    pro_availability_sub: "Shyiraho amasaha ugaragaramo kuri kalande y'abarwayi.",
    pro_clinic_affiliation: 'Kiliniki Ukorana Nayo',
    pro_hourly_rate: "Igiciro cy'Isaha",
    pro_edit_profile: 'Hindura Umwirondoro',
    pro_professional_name: "Izina ry'Inzobere",
    pro_specialization: 'Inzobere mu gice',
    pro_professional_bio: "Ibisobanuro by'Inzobere",
    pro_cancel: 'Reka',
    pro_save: 'Bika',
    pro_unavailable: 'Ntiboneka',
    pro_end_session: 'Sohoka mu Akazi',

    // Extra strings
    pro_unread: 'Ntarasomwa',
    pro_requested_slot: 'Igihe cisabwa',
    pro_answer_by: 'Igisubizo cya',
    pro_reply_as: 'Subiza nka',

    // Appointment types
    appt_initial: 'Inama ya Mbere',
    appt_followup: 'Gukurikirana',
    appt_stress: 'Gucunga Ingorane',
    appt_general: 'Inama Rusange',
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
