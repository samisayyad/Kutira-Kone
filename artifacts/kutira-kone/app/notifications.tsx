import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNotification, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const NOTIF_ICONS: Record<AppNotification["type"], { icon: string; color: string }> = {
  swap: { icon: "refresh-cw", color: "#2D6A4F" },
  message: { icon: "message-circle", color: "#2E6EA6" },
  eco: { icon: "leaf", color: "#40916C" },
  like: { icon: "heart", color: "#E07A5F" },
};

export default function Notifications() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead } = useApp();

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const handlePress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    markNotificationRead(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#1B4332", "#2D6A4F"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#FAFAF7" />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Pressable>
            <Text style={styles.markAll}>Mark all read</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="bell-off" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const { icon, color } = NOTIF_ICONS[notif.type];
            return (
              <Pressable
                key={notif.id}
                onPress={() => handlePress(notif.id)}
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: notif.read ? colors.card : color + "0F",
                    borderRadius: colors.radius,
                    borderLeftColor: notif.read ? "transparent" : color,
                    borderLeftWidth: 4,
                  },
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: color + "22" }]}>
                  <Feather name={icon as any} size={18} color={color} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <View style={styles.notifTop}>
                    <Text style={[styles.notifTitle, { color: colors.foreground }]}>{notif.title}</Text>
                    {!notif.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
                  </View>
                  <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {notif.body}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  markAll: { color: "rgba(250,250,247,0.7)", fontSize: 13, fontWeight: "600" },
  scroll: { padding: 16, gap: 10 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyText: { fontSize: 15 },
  notifCard: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginTop: 2 },
  notifTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  notifTitle: { fontSize: 14, fontWeight: "700", flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { fontSize: 13, lineHeight: 18 },
  notifTime: { fontSize: 11, marginTop: 2 },
});
