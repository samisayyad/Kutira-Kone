import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { SwapRequest } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type StatusFilter = "all" | "pending" | "accepted" | "declined";

export default function Swaps() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { swaps } = useApp();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const filtered = swaps.filter((s) => filter === "all" || s.status === filter);

  const statusColor = (status: SwapRequest["status"]) => {
    if (status === "pending") return colors.amber;
    if (status === "accepted") return colors.emerald;
    return colors.terracotta;
  };

  const statusIcon = (status: SwapRequest["status"]) => {
    if (status === "pending") return "clock";
    if (status === "accepted") return "check-circle";
    return "x-circle";
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
          <Text style={styles.headerTitle}>Swap Requests</Text>
          <View style={{ width: 22 }} />
        </View>
        <Text style={styles.headerSub}>{swaps.filter((s) => s.status === "pending").length} pending responses</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={[styles.filterRow, { backgroundColor: colors.background }]}>
        {(["all", "pending", "accepted", "declined"] as StatusFilter[]).map((f) => (
          <Pressable
            key={f}
            onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
            style={[styles.filterChip, {
              backgroundColor: filter === f ? colors.primary : colors.card,
              borderRadius: 20, borderWidth: 1,
              borderColor: filter === f ? colors.primary : colors.border,
            }]}
          >
            <Text style={[styles.filterText, { color: filter === f ? "#fff" : colors.foreground }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="refresh-cw" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No swap requests</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Start swapping by finding listings on the marketplace.
            </Text>
          </View>
        ) : (
          filtered.map((swap) => (
            <View
              key={swap.id}
              style={[styles.swapCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}
            >
              {/* Status Header */}
              <View style={[styles.statusBar, { backgroundColor: statusColor(swap.status) + "18" }]}>
                <Feather name={statusIcon(swap.status) as any} size={14} color={statusColor(swap.status)} />
                <Text style={[styles.statusText, { color: statusColor(swap.status) }]}>
                  {swap.status.toUpperCase()}
                </Text>
                <Text style={[styles.statusTime, { color: colors.mutedForeground }]}>{swap.createdAt}</Text>
              </View>

              {/* Swap items */}
              <View style={styles.swapItems}>
                <View style={styles.swapItem}>
                  <View style={[styles.swapColor, { backgroundColor: swap.theirListing.imageColor, borderRadius: 8 }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.swapItemLabel, { color: colors.mutedForeground }]}>They offer</Text>
                    <Text style={[styles.swapItemTitle, { color: colors.foreground }]} numberOfLines={1}>
                      {swap.theirListing.title}
                    </Text>
                    <Text style={[styles.swapItemMeta, { color: colors.mutedForeground }]}>
                      {swap.theirListing.material} · {swap.theirListing.quantity}
                    </Text>
                  </View>
                </View>

                <View style={[styles.arrowWrap, { backgroundColor: colors.primary + "18" }]}>
                  <Feather name="repeat" size={16} color={colors.primary} />
                </View>

                <View style={styles.swapItem}>
                  <View style={[styles.swapColor, { backgroundColor: swap.myListing.imageColor, borderRadius: 8 }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.swapItemLabel, { color: colors.mutedForeground }]}>For your</Text>
                    <Text style={[styles.swapItemTitle, { color: colors.foreground }]} numberOfLines={1}>
                      {swap.myListing.title}
                    </Text>
                    <Text style={[styles.swapItemMeta, { color: colors.mutedForeground }]}>
                      {swap.myListing.material} · {swap.myListing.quantity}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Message */}
              <View style={[styles.messageBox, { backgroundColor: colors.background, borderRadius: 8 }]}>
                <Text style={[styles.messageFrom, { color: colors.primary }]}>{swap.fromUser}:</Text>
                <Text style={[styles.messageText, { color: colors.foreground }]}>"{swap.message}"</Text>
              </View>

              {/* Actions */}
              {swap.status === "pending" && (
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.declineBtn, { borderColor: colors.border, borderRadius: 10 }]}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Text style={[styles.declineText, { color: colors.mutedForeground }]}>Decline</Text>
                  </Pressable>
                  <Pressable
                    style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}
                    onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                  >
                    <LinearGradient colors={["#2D6A4F", "#40916C"]} style={styles.acceptGrad}>
                      <Feather name="check" size={16} color="#fff" />
                      <Text style={styles.acceptText}>Accept Swap</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  headerSub: { fontSize: 13, color: "rgba(250,250,247,0.7)" },
  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#DDD8CC" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 12, fontWeight: "600" },
  scroll: { padding: 16, gap: 12 },
  empty: { alignItems: "center", paddingVertical: 80, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "800" },
  emptySub: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  swapCard: { overflow: "hidden", elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  statusBar: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10, paddingHorizontal: 14 },
  statusText: { fontSize: 11, fontWeight: "800", flex: 1 },
  statusTime: { fontSize: 11 },
  swapItems: { padding: 14, gap: 12 },
  swapItem: { flexDirection: "row", gap: 10, alignItems: "center" },
  swapColor: { width: 44, height: 44 },
  swapItemLabel: { fontSize: 10, fontWeight: "500", marginBottom: 2 },
  swapItemTitle: { fontSize: 14, fontWeight: "700" },
  swapItemMeta: { fontSize: 11, marginTop: 1 },
  arrowWrap: { alignSelf: "center", width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  messageBox: { marginHorizontal: 14, marginBottom: 14, padding: 12, gap: 4 },
  messageFrom: { fontSize: 12, fontWeight: "700" },
  messageText: { fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingBottom: 14 },
  declineBtn: { paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  declineText: { fontSize: 14, fontWeight: "600" },
  acceptGrad: { flexDirection: "row", gap: 6, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  acceptText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
