import { useState } from "react";

export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: "Hi, I’m Humura 🌿 I’m here for you. How are you feeling today?",
      sender: "ai",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
    };

    setMessages((prev) => [userMessage, ...prev]);

    setLoading(true);

    // 2. Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 3. Generate AI response (mock logic for now)
    const aiResponse = generateAIResponse(text);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: "ai",
    };

    setMessages((prev) => [aiMessage, ...prev]);

    setLoading(false);
  };

  return {
    messages,
    sendMessage,
    loading,
  };
}

// Simple emotional response logic (temporary AI brain)
function generateAIResponse(input: string): string {
  const text = input.toLowerCase();

  if (text.includes("sad") || text.includes("cry") || text.includes("depressed")) {
    return "I hear that you're feeling really heavy right now. You're not alone 🌿 Take a slow breath with me.";
  }

  if (text.includes("angry") || text.includes("hate")) {
    return "It sounds like you're feeling a lot of anger. That’s valid. Let’s slow things down together 🌿";
  }

  if (text.includes("lonely")) {
    return "Feeling lonely can be really painful. I'm here with you right now 🤍";
  }

  return "I understand. Thank you for sharing that with me 🌿 Tell me more if you'd like.";
}