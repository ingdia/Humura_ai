import { useState } from 'react';

export type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hi, I'm Humura 🌿 I'm here for you — no judgment, no pressure. How are you feeling today?",
      sender: 'ai',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [userMessage, ...prev]);
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 900));

    const { response, crisis } = generateResponse(text);
    if (crisis) setCrisisDetected(true);

    const aiMessage: Message = { id: (Date.now() + 1).toString(), text: response, sender: 'ai' };
    setMessages(prev => [aiMessage, ...prev]);
    setLoading(false);
  };

  return { messages, sendMessage, loading, crisisDetected };
}

function generateResponse(input: string): { response: string; crisis: boolean } {
  const t = input.toLowerCase();

  if (t.includes('disappear') || t.includes('kill') || t.includes('suicide') || t.includes('end my life') || t.includes('want to die')) {
    return {
      response: "I hear you, and I'm so glad you're talking to me right now 🤍 What you're feeling is real and it matters. Please reach out to a crisis counselor — dial 116. You are not alone in this.",
      crisis: true,
    };
  }
  if (t.includes('sad') || t.includes('cry') || t.includes('depressed') || t.includes('hopeless')) {
    return { response: "I hear how heavy things feel right now. You don't have to carry this alone 🌿 Take a slow breath with me. Would you like to try Calm Mode for a few minutes?", crisis: false };
  }
  if (t.includes('angry') || t.includes('hate') || t.includes('rage') || t.includes('furious')) {
    return { response: "That anger is valid — something has hurt you deeply. Let's slow things down together 🌿 Can you tell me more about what happened?", crisis: false };
  }
  if (t.includes('lonely') || t.includes('alone') || t.includes('no one')) {
    return { response: "Loneliness can feel so heavy, especially when you're surrounded by people who don't understand. I'm here with you right now 🤍 You matter more than you know.", crisis: false };
  }
  if (t.includes('anxious') || t.includes('anxiety') || t.includes('panic') || t.includes('scared')) {
    return { response: "Anxiety can feel overwhelming, like your mind won't stop racing 🌿 Try this: breathe in for 4 counts, hold for 2, breathe out for 4. I'm right here with you.", crisis: false };
  }
  if (t.includes('family') || t.includes('pressure') || t.includes('parents')) {
    return { response: "Family pressure in our culture can be incredibly heavy — the expectations, the silence, the fear of disappointing people you love. You're not weak for struggling with this 🌿", crisis: false };
  }
  if (t.includes('good') || t.includes('better') || t.includes('happy') || t.includes('great')) {
    return { response: "That's really good to hear 😊 Hold onto that feeling. What's been making things feel better for you lately?", crisis: false };
  }
  if (t.includes('tired') || t.includes('exhausted') || t.includes('burnout')) {
    return { response: "Being tired — truly tired — is your body and mind asking for rest and care 🌿 You've been carrying a lot. What would feel like rest for you right now?", crisis: false };
  }

  return { response: "Thank you for sharing that with me 🌿 I'm listening. Tell me more — I'm here and I'm not going anywhere.", crisis: false };
}
