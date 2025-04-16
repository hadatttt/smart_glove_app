import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTitleStyle: {
          color: Colors.text,
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dịch Ngôn Ngữ Ký Hiệu',
          tabBarLabel: 'Dịch',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Học Ngôn Ngữ Ký Hiệu',
          tabBarLabel: 'Học',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}