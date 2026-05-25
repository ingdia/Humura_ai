import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use(async (config) => {
  try {
    let token: string | null = await SecureStore.getItemAsync('auth_token');
    if (!token) {
      token = await AsyncStorage.getItem('auth_token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Non-fatal — request proceeds without auth header
  }
  return config;
});

export default api;

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  anonymous: () =>
    api.post('/api/auth/anonymous'),

  anonymousLogin: (humura_id: string) =>
    api.post('/api/auth/anonymous-login', { humura_id }),

  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  register: (name: string, email: string, password: string, role = 'PSYCHOLOGIST', specialization?: string) =>
    api.post('/api/auth/register', { name, email, password, role, specialization }),

  me: () =>
    api.get('/api/auth/me'),
};

// ── Messages ──────────────────────────────────────────────────
export const messagesAPI = {
  inbox: () =>
    api.get('/api/messages/inbox'),

  thread: (otherId: number) =>
    api.get(`/api/messages/${otherId}`),

  send: (receiver_id: number, content: string) =>
    api.post('/api/messages', { receiver_id, content }),

  markRead: (messageId: number) =>
    api.put(`/api/messages/${messageId}/read`),

  unreadCount: () =>
    api.get('/api/messages/unread/count'),
};

// ── Psychologists (for patient "start conversation" list) ─────
export const psychologistsAPI = {
  list: () =>
    api.get('/api/psychologists'),
};

// ── Community ─────────────────────────────────────────────────
export const communityAPI = {
  groups: () =>
    api.get('/api/community/groups'),

  posts: (groupId: string) =>
    api.get(`/api/community/${groupId}/posts`),

  createPost: (groupId: string, content: string, tag?: string) =>
    api.post(`/api/community/${groupId}/posts`, { content, tag }),

  react: (postId: number, reaction_type = 'heart') =>
    api.post(`/api/community/posts/${postId}/react`, { reaction_type }),

  deletePost: (postId: number) =>
    api.delete(`/api/community/posts/${postId}`),
};
