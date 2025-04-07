import React from "react";
import { Tabs } from "expo-router";
import { Home, BookOpen } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textLight,
        tabBarStyle: {
          borderTopColor: Colors.light.border,
          backgroundColor: Colors.light.white,
          elevation: 0,
          shadowOpacity: 0.1,
        },
        headerStyle: {
          backgroundColor: Colors.light.white,
          elevation: 0,
          shadowOpacity: 0.1,
          borderBottomWidth: 1,
          borderBottomColor: Colors.light.border,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.light.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sign Translator",
          tabBarLabel: "Translate",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn Signs",
          tabBarLabel: "Learn",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}