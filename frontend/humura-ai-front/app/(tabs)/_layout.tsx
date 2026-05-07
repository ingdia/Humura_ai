import { Tabs } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const PRIMARY = '#4a90e2';
const BG = '#FFFFFF';

const TABS = [
  { name: 'index',   icon: 'home',        iconActive: 'home'        },
  { name: 'chat',    icon: 'chatbubbles-outline', iconActive: 'chatbubbles' },
  { name: 'mood',    icon: 'analytics-outline',   iconActive: 'analytics'   },
  { name: 'calm',    icon: 'leaf-outline',         iconActive: 'leaf'        },
  { name: 'feed',    icon: 'people-outline',       iconActive: 'people'      },
  { name: 'profile', icon: 'person-outline',       iconActive: 'person'      },
];

function PinterestTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS[index];

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
                  color={isFocused ? '#fff' : '#AABDD4'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <PinterestTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home' }} />
      <Tabs.Screen name="chat"    options={{ title: 'AI Chat' }} />
      <Tabs.Screen name="mood"    options={{ title: 'Mood' }} />
      <Tabs.Screen name="calm"    options={{ title: 'Calm' }} />
      <Tabs.Screen name="feed"    options={{ title: 'Community' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: BG,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
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
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
