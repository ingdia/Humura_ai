import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
  specialization?: string;
  is_anonymous?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Storage helpers
const getStorage = () => ({
  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      // Fallback to AsyncStorage
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  },
  setToken: async (value: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, value);
    } catch {
      // Fallback to AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, value);
    }
  },
  removeToken: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // Fallback to AsyncStorage
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  },
  getUser: async () => {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data;
    } catch {
      return null;
    }
  },
  setUser: async (value: string) => {
    try {
      await AsyncStorage.setItem(USER_KEY, value);
    } catch {
      console.warn('Failed to store user data');
    }
  },
  removeUser: async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch {
      console.warn('Failed to remove user data');
    }
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storage = getStorage();

  useEffect(() => {
    // Add a small delay to ensure storage is ready
    const timer = setTimeout(() => {
      const initializeAuth = async () => {
        await loadStoredAuth();
      };
      initializeAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // Clear corrupted data
          try {
            await storage.removeToken();
            await storage.removeUser();
          } catch (clearError) {
            console.error('Error clearing corrupted data:', clearError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, authToken: string) => {
    try {
      await storage.setToken(authToken);
      await storage.setUser(JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error storing auth data:', error);
      // Still update state even if storage fails
      setToken(authToken);
      setUser(userData);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.removeToken();
      await storage.removeUser();
      setToken(null);
      setUser(null);
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 100);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear state even if storage fails
      setToken(null);
      setUser(null);
      router.replace('/(auth)/login');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}