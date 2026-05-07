import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index"   options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login"   options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup"  options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)/disclaimer" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
