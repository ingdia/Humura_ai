import { Platform } from 'react-native';

export const Colors = {
  primary: '#4a90e2',    // Professional Blue
  secondary: '#357ABD',  // Mid Blue
  positive: '#27AE60',   // Success Green
  accent: '#2C5F8F',     // Dark Blue
  background: '#f9fafb', // Light Grey Background
  white: '#FFFFFF',
  text: '#2d2e32',       // Charcoal Text
  textMuted: '#555555',  // Mid Grey Text
  
  // Tab colors
  tabInactive: '#AABDD4',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Border = {
  radiusSm: 8,
  radius: 16,
  radiusLg: 24,
  radiusFull: 999,
};

export const Shadows = {
  soft: {
    shadowColor: '#2d2e32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  premium: {
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  }
};
