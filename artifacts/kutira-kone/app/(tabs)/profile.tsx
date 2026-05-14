import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
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

import { EcoBadge } from "@/components/EcoBadge";
import { FabricCard } from "@/components/FabricCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FABRIC_IMAGES = [
  require("../../assets/images/fabric1.png"),
  require("../../assets/images/fabric2.png"),
  require("../../assets/images/fabric3.png"),
  require("../../assets/images/fabric4.png"),
];

export default function Profile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, setUser, listings, favorites } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const myListings = listings.slice(0, 4);
  const myFavorites = listings.filter((l) => favorites.includes(l.id));

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.multiRemove(["kutira_user", "kutira_onboarded"]);
    setUser(null);
    router.replace("/auth");
  };

  const profile = user;

  const MENU_ITEMS = [
    { icon: "refresh-cw", label: "My Swap Requests", onPress: () => router.push("/swaps") },
    { icon: "bar-chart-2", label: "Sustainability Dashboard", onPress: () => router.push("/sustainability") },
    { icon: "users", label: "Community Showcase", onPress: () => router.push("/community") },
    { icon: "bell", label: "Notifications", onPress: () => router.push("/notifications") },
    { icon: "settings", label: "Settings", onPress: () => {} },
    { icon: "help-circle", label: "Help & Support", onPress: () => {} },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={["#1B4332", "#2D6A4F", "#40916C"]}
          style={[styles.header, { paddingTop: topPad + 16 }]}
        >
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { backgroundColor: colors.terracotta }]}>
              <Text style={styles.avatarText}>{profile?.avatar ?? "U"}</Text>
            </View>
            <View style={styles.nameCol}>
              <Text style={styles.name}>{profile?.name ?? "Guest"}</Text>
              <Text style={styles.role}>{profile?.role?.charAt(0).toUpperCase() + (profile?.role?.slice(1) ?? "")}</Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color="rgba(250,250,247,0.7)" />
                <Text style={styles.location}>{profile?.location ?? "Unknown"}</Text>
              </View>
            </View>
            <Pressable style={styles.editBtn}>
              <Feather name="edit-3" size={18} color="rgba(250,250,247,0.8)" />
            </Pressable>
          </View>

          <Text style={styles.bio}>{profile?.bio}</Text>

          {/* Stats */}
          <View style={styles.statsGrid}>
            {[
              { label: "Listings", value: profile?.stats.listings ?? 0 },
              { label: "Swaps", value: profile?.stats.swaps ?? 0 },
              { label: "Kg Saved", value: `${profile?.stats.savedKg ?? 0}` },
              { label: "Eco Pts", value: profile?.stats.ecoPoints ?? 0 },
            ].map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Eco Badge */}
        <View style={[styles.ecoBanner, { backgroundColor: colors.sage + "22", borderColor: colors.sage }]}>
          <Feather name="award" size={20} color={colors.emerald} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.ecoTitle, { color: colors.forest }]}>Eco Champion 🌿</Text>
            <Text style={[styles.ecoSub, { color: colors.emerald }]}>
              You've saved {profile?.stats.savedKg}kg of textile waste this month!
            </Text>
          </View>
          <EcoBadge points={profile?.stats.ecoPoints ?? 0} size="sm" />
        </View>

        {/* My Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Listings</Text>
            <Text style={[styles.count, { color: colors.mutedForeground }]}>{myListings.length}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {myListings.map((l, i) => (
              <View key={l.id} style={styles.hCard}>
                <FabricCard
                  listing={l}
                  onPress={() => router.push(`/product/${l.id}` as any)}
                  delay={i * 60}
                  compact
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Favorites */}
        {myFavorites.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Saved</Text>
              <Feather name="heart" size={16} color={colors.terracotta} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {myFavorites.map((l, i) => (
                <View key={l.id} style={styles.hCard}>
                  <FabricCard
                    listing={l}
                    onPress={() => router.push(`/product/${l.id}` as any)}
                    delay={i * 60}
                    compact
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Menu */}
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={[
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.primary + "18" }]}>
                <Feather name={item.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        {/* Member since */}
        <Text style={[styles.joinedText, { color: colors.mutedForeground }]}>
          Member since {profile?.joinedAt}
        </Text>

        {/* Logout */}
        <Pressable onPress={handleLogout} style={[styles.logoutBtn, { borderColor: colors.border, borderRadius: 12 }]}>
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 24, gap: 14 },
  avatarRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  avatar: { width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  nameCol: { flex: 1, gap: 3 },
  name: { fontSize: 22, fontWeight: "800", color: "#FAFAF7" },
  role: { fontSize: 13, color: "rgba(250,250,247,0.75)", fontWeight: "600", textTransform: "capitalize" },
  locationRow: { flexDirection: "row", gap: 4, alignItems: "center" },
  location: { fontSize: 12, color: "rgba(250,250,247,0.65)" },
  editBtn: { padding: 8 },
  bio: { fontSize: 14, color: "rgba(250,250,247,0.75)", lineHeight: 20 },
  statsGrid: { flexDirection: "row", backgroundColor: "rgba(250,250,247,0.1)", borderRadius: 12, padding: 4 },
  stat: { flex: 1, alignItems: "center", paddingVertical: 10 },
  statValue: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  statLabel: { fontSize: 10, color: "rgba(250,250,247,0.7)", fontWeight: "500" },
  ecoBanner: {
    marginHorizontal: 16, marginTop: 16, flexDirection: "row", gap: 12, padding: 14, alignItems: "center",
    borderWidth: 1, borderRadius: 14,
  },
  ecoTitle: { fontSize: 14, fontWeight: "800" },
  ecoSub: { fontSize: 12, marginTop: 2 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  count: { fontSize: 14, fontWeight: "600" },
  hScroll: { gap: 10, paddingRight: 16 },
  hCard: { width: 155 },
  menuCard: { marginHorizontal: 16, marginTop: 20, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 16, paddingHorizontal: 16 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  joinedText: { fontSize: 12, textAlign: "center", marginTop: 20 },
  logoutBtn: {
    flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center",
    borderWidth: 1, paddingVertical: 14, marginHorizontal: 16, marginTop: 12, marginBottom: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "700" },
});
