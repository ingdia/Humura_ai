import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  patientName: string;
  type: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  isVirtual: boolean;
  date: string;
  meetLink: string;
}

export interface Question {
  id: string;
  category: string;
  time: string;
  text: string;
  isAnswered: boolean;
  answerText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist';
  text: string;
  time: string;
}

export interface ChatSession {
  patientName: string;
  snippet: string;
  unreadCount: number;
  time: string;
  online: boolean;
  avatarLetter: string;
  messages: ChatMessage[];
}

export interface AvailabilityDay {
  enabled: boolean;
  hours: string;
}

export interface AvailabilityMatrix {
  Monday: AvailabilityDay;
  Tuesday: AvailabilityDay;
  Wednesday: AvailabilityDay;
  Thursday: AvailabilityDay;
  Friday: AvailabilityDay;
}

export interface ProfessionalProfile {
  name: string;
  specialization: string;
  bio: string;
  clinic: string;
  rate: string;
}

interface ProfessionalContextType {
  profile: ProfessionalProfile;
  appointments: Appointment[];
  questions: Question[];
  chats: ChatSession[];
  availability: AvailabilityMatrix;
  updateProfile: (updates: Partial<ProfessionalProfile>) => void;
  acceptAppointment: (id: string, meetLink?: string) => void;
  declineAppointment: (id: string) => void;
  answerQuestion: (id: string, answerText: string) => void;
  sendMessageToChat: (patientName: string, text: string) => void;
  toggleAvailabilityDay: (day: keyof AvailabilityMatrix) => void;
  updateAvailabilityHours: (day: keyof AvailabilityMatrix, hours: string) => void;
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export function ProfessionalProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfessionalProfile>({
    name: '',
    specialization: '',
    bio: 'Passionate about mental well-being and supporting young women in Rwanda.',
    clinic: 'Kigali Mental Health Center',
    rate: '25,000 RWF',
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Bella Calmine',
      type: 'Initial Consultation',
      time: '10:00 AM - 11:00 AM',
      status: 'CONFIRMED',
      isVirtual: true,
      date: 'Today, May 25',
      meetLink: 'https://meet.jit.si/humura-ai-session-1',
    },
    {
      id: '2',
      patientName: 'Amara Niyonsaba',
      type: 'Follow-up Session',
      time: '02:00 PM - 03:00 PM',
      status: 'PENDING',
      isVirtual: true,
      date: 'Tomorrow, May 26',
      meetLink: '',
    },
    {
      id: '3',
      patientName: 'Claudine Uwera',
      type: 'Stress Management Support',
      time: '04:00 PM - 05:00 PM',
      status: 'PENDING',
      isVirtual: false,
      date: 'Tuesday, May 27',
      meetLink: '',
    },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      category: 'Anxiety & Social Event',
      time: '2 hours ago',
      text: "I've been feeling incredibly anxious before social events lately, to the point where I cancel them. Is this normal and how can I cope?",
      isAnswered: false,
      answerText: '',
    },
    {
      id: '2',
      category: 'Self-Care & Routine',
      time: '1 day ago',
      text: 'How do I build a consistent mindfulness routine when my life is extremely busy and chaotic?',
      isAnswered: true,
      answerText: 'Start with just 2 minutes a day immediately after waking up. Consistency is far more important than duration. Pair it with an existing habit like brushing your teeth (a method called habit stacking). Over time, it will feel natural.',
    },
    {
      id: '3',
      category: 'Depression',
      time: '3 days ago',
      text: 'I find it hard to get out of bed in the morning, feeling no motivation. What are small steps I can take to build momentum?',
      isAnswered: false,
      answerText: '',
    },
  ]);

  const [chats, setChats] = useState<ChatSession[]>([
    {
      patientName: 'Mary Jane',
      snippet: 'Thank you for the session today, Doctor. I feel much better.',
      unreadCount: 1,
      time: '10:42 AM',
      online: true,
      avatarLetter: 'M',
      messages: [
        { id: '1', sender: 'specialist', text: 'Hello Mary! How are you feeling after today\'s session?', time: '10:30 AM' },
        { id: '2', sender: 'user', text: 'Thank you for the session today, Doctor. I feel much better.', time: '10:42 AM' },
      ],
    },
    {
      patientName: 'Peter Parker',
      snippet: 'I will schedule a new appointment soon.',
      unreadCount: 0,
      time: 'Yesterday',
      online: false,
      avatarLetter: 'P',
      messages: [
        { id: '1', sender: 'user', text: 'Hi Dr. Uwase, I wanted to let you know the breathing exercises are helping.', time: 'Yesterday, 3:15 PM' },
        { id: '2', sender: 'specialist', text: 'That is wonderful to hear, Peter! Let us keep practicing them.', time: 'Yesterday, 3:20 PM' },
        { id: '3', sender: 'user', text: 'I will schedule a new appointment soon.', time: 'Yesterday, 4:00 PM' },
      ],
    },
  ]);

  const [availability, setAvailability] = useState<AvailabilityMatrix>({
    Monday: { enabled: true, hours: '09:00 - 17:00' },
    Tuesday: { enabled: true, hours: '09:00 - 17:00' },
    Wednesday: { enabled: false, hours: 'Off' },
    Thursday: { enabled: true, hours: '10:00 - 14:00' },
    Friday: { enabled: true, hours: '09:00 - 13:00' },
  });

  const updateProfile = (updates: Partial<ProfessionalProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const acceptAppointment = (id: string, meetLink?: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id
          ? {
              ...app,
              status: 'CONFIRMED',
              meetLink: meetLink || `https://meet.jit.si/humura-ai-session-${id}-${Math.floor(1000 + Math.random() * 9000)}`,
            }
          : app
      )
    );
  };

  const declineAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: 'CANCELLED' }
          : app
      )
    );
  };

  const answerQuestion = (id: string, answerText: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id
          ? { ...q, isAnswered: true, answerText }
          : q
      )
    );
  };

  const sendMessageToChat = (patientName: string, text: string) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChats(prev => {
      return prev.map(chat => {
        if (chat.patientName === patientName) {
          const updatedMessages = [
            ...chat.messages,
            { id: Date.now().toString(), sender: 'specialist' as const, text, time: formattedTime },
          ];
          return {
            ...chat,
            snippet: text,
            unreadCount: 0,
            time: 'Just Now',
            messages: updatedMessages,
          };
        }
        return chat;
      });
    });

    // Simulate an automatic reply from the patient after 1.5 seconds!
    setTimeout(() => {
      const patientResponses: { [key: string]: string[] } = {
        'Mary Jane': [
          'Yes, I will keep practicing the Cognitive Reframing technique you taught me.',
          'Understood, Doctor! I have written down my thoughts for our next discussion.',
          'Thank you again, Dr. Uwase. See you next week!',
        ],
        'Peter Parker': [
          'Excellent! I just booked a session for Thursday at 10 AM. See you then!',
          'Great, I will also read the resources about stress relief in the app.',
          'Thanks Doctor, I will keep trying my best!',
        ],
      };

      const replies = patientResponses[patientName] || [
        'Thank you for the advice, Doctor.',
        'I appreciate your prompt support!',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChats(prev => {
        return prev.map(chat => {
          if (chat.patientName === patientName) {
            const updatedMessages = [
              ...chat.messages,
              { id: (Date.now() + 1).toString(), sender: 'user' as const, text: randomReply, time: replyTime },
            ];
            return {
              ...chat,
              snippet: randomReply,
              unreadCount: 1,
              time: replyTime,
              messages: updatedMessages,
            };
          }
          return chat;
        });
      });
    }, 1500);
  };

  const toggleAvailabilityDay = (day: keyof AvailabilityMatrix) => {
    setAvailability(prev => {
      const current = prev[day];
      return {
        ...prev,
        [day]: {
          enabled: !current.enabled,
          hours: !current.enabled ? '09:00 - 17:00' : 'Off',
        },
      };
    });
  };

  const updateAvailabilityHours = (day: keyof AvailabilityMatrix, hours: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], hours },
    }));
  };

  return (
    <ProfessionalContext.Provider
      value={{
        profile,
        appointments,
        questions,
        chats,
        availability,
        updateProfile,
        acceptAppointment,
        declineAppointment,
        answerQuestion,
        sendMessageToChat,
        toggleAvailabilityDay,
        updateAvailabilityHours,
      }}
    >
      {children}
    </ProfessionalContext.Provider>
  );
}

export function useProfessional() {
  const context = useContext(ProfessionalContext);
  if (context === undefined) {
    throw new Error('useProfessional must be used within a ProfessionalProvider');
  }
  return context;
}
