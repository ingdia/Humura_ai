import { Tabs } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, Shadows } from '../../src/constants/theme';
import { ProfessionalProvider } from '../../src/contexts/ProfessionalContext';

const TABS = [
  { name: 'index',       icon: 'grid-outline',         iconActive: 'grid' },
  { name: 'appointments', icon: 'calendar-outline',    iconActive: 'calendar' },
  { name: 'community',   icon: 'people-outline',       iconActive: 'people' },
  { name: 'qa',          icon: 'help-circle-outline',  iconActive: 'help-circle' },
  { name: 'inbox',       icon: 'chatbubbles-outline',  iconActive: 'chatbubbles' },
  { name: 'profile',     icon: 'person-outline',       iconActive: 'person' },
];

function ProfessionalTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find(t => t.name === route.name);

          if (!tab) return null;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={(isFocused ? tab.iconActive : tab.icon) as any}
                  size={22}
                  color={isFocused ? '#fff' : Colors.tabInactive}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}


export default function ProfessionalTabLayout() {
  return (
    <ProfessionalProvider>
      <Tabs
        tabBar={(props) => <ProfessionalTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index"        options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="appointments" options={{ title: 'Appointments' }} />
        <Tabs.Screen name="community"    options={{ title: 'Community' }} />
        <Tabs.Screen name="qa"           options={{ title: 'Q&A' }} />
        <Tabs.Screen name="inbox"        options={{ title: 'Inbox' }} />
        <Tabs.Screen name="profile"      options={{ title: 'Profile' }} />
      </Tabs>
    </ProfessionalProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 40,
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.premium,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primary, // Using professional blue
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
