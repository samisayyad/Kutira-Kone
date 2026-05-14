import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function UploadTabIcon({ color, focused }: { color: string; focused: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.uploadIcon, { backgroundColor: focused ? colors.primary : colors.emerald }]}>
      <Feather name="plus" size={22} color="#fff" />
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();
  const { unreadCount } = useApp();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 84 : 72,
          paddingBottom: isWeb ? 34 : 8,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border }]} />
          ),
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Market",
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Nearby",
          tabBarIcon: ({ color }) => <Feather name="map-pin" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, focused }) => <UploadTabIcon color={color} focused={focused} />,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "700", color: colors.primary },
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI Ideas",
          tabBarIcon: ({ color }) => <Feather name="zap" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    elevation: 4,
    shadowColor: "#2D6A4F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});
