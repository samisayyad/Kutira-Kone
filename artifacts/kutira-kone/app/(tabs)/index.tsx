import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EcoBadge } from "@/components/EcoBadge";
import { FabricCard } from "@/components/FabricCard";
import { FilterBar } from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FABRIC_IMAGES = [
  require("../../assets/images/fabric1.png"),
  require("../../assets/images/fabric2.png"),
  require("../../assets/images/fabric3.png"),
  require("../../assets/images/fabric4.png"),
];

export default function MarketplaceHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { listings, favorites, toggleFavorite, user, unreadCount } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [searchFocused, setSearchFocused] = useState(false);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const filtered = listings.filter((l) => {
    const matchCat = category === "All" || l.category === category;
    const matchSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.material.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const numColumns = 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={["#1B4332", "#2D6A4F"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greet}>Good morning, {user?.name?.split(" ")[0] ?? "there"} 👋</Text>
            <Text style={styles.sub}>Find & swap fabric near you</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push("/notifications")} style={styles.iconBtn}>
              <Feather name="bell" size={22} color="#FAFAF7" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/sustainability")} style={styles.iconBtn}>
              <Feather name="bar-chart-2" size={22} color="#FAFAF7" />
            </Pressable>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { borderRadius: colors.radius }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search fabrics, materials…"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Filters */}
        <FilterBar selectedCategory={category} onSelectCategory={setCategory} />

        {/* Featured */}
        {featured && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Featured</Text>
            <Pressable
              onPress={() => router.push(`/product/${featured.id}` as any)}
              style={[styles.featuredCard, { borderRadius: colors.radius, backgroundColor: featured.imageColor }]}
            >
              <Image
                source={FABRIC_IMAGES[0]}
                style={styles.featuredImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(26,43,26,0.85)"]}
                style={styles.featuredGradient}
              />
              <View style={styles.featuredInfo}>
                <EcoBadge points={featured.ecoPoints} />
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <View style={styles.featuredRow}>
                  <Text style={styles.featuredPrice}>
                    {featured.price ? `KSh ${featured.price}` : "Swap Only"}
                  </Text>
                  <View style={styles.featuredSeller}>
                    <Text style={styles.featuredSellerName}>{featured.seller.name}</Text>
                    <Text style={styles.featuredRating}>⭐ {featured.seller.rating}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { icon: "refresh-cw", label: "Active Swaps", value: "284" },
            { icon: "package", label: "Listings Today", value: "62" },
            { icon: "leaf", label: "Kg Saved", value: "4.2t" },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Feather name={s.icon as any} size={20} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Near You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Near You</Text>
            <Pressable onPress={() => router.push("/(tabs)/map" as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See map →</Text>
            </Pressable>
          </View>

          {rest.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="inbox" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No listings found</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {rest.map((listing, i) => (
                <View key={listing.id} style={styles.gridItem}>
                  <FabricCard
                    listing={listing}
                    onPress={() => router.push(`/product/${listing.id}` as any)}
                    isFavorite={favorites.includes(listing.id)}
                    onFavorite={() => { toggleFavorite(listing.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    delay={i * 60}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Community Teaser */}
        <Pressable
          onPress={() => router.push("/community")}
          style={[styles.communityBanner, { borderRadius: colors.radius }]}
        >
          <LinearGradient
            colors={["#C77B45", "#E07A5F"]}
            style={styles.communityGrad}
          >
            <Image
              source={require("../../assets/images/fabric4.png")}
              style={styles.communityImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(199,123,69,0.9)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.communityText}>
              <Text style={styles.communityTitle}>Community Showcase</Text>
              <Text style={styles.communitySub}>See what artisans have created →</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greet: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  sub: { fontSize: 13, color: "rgba(250,250,247,0.7)", marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(250,250,247,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  badge: {
    position: "absolute", top: -2, right: -2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: "#E07A5F", alignItems: "center", justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#FAFAF7", paddingHorizontal: 14, paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 15 },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  seeAll: { fontSize: 13, fontWeight: "600" },
  featuredCard: { height: 220, overflow: "hidden" },
  featuredImage: { ...StyleSheet.absoluteFillObject, opacity: 0.75 },
  featuredGradient: { ...StyleSheet.absoluteFillObject },
  featuredInfo: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, gap: 6 },
  featuredTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  featuredRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredPrice: { fontSize: 16, fontWeight: "700", color: "#F2CC8F" },
  featuredSeller: { flexDirection: "row", gap: 6, alignItems: "center" },
  featuredSellerName: { color: "rgba(250,250,247,0.85)", fontSize: 13 },
  featuredRating: { color: "rgba(250,250,247,0.85)", fontSize: 12 },
  statsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginTop: 16 },
  statCard: { flex: 1, alignItems: "center", padding: 12, gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, fontWeight: "500", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "47%", flex: 1 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: "500" },
  communityBanner: { marginHorizontal: 16, marginTop: 24, height: 140, overflow: "hidden" },
  communityGrad: { flex: 1 },
  communityImage: { ...StyleSheet.absoluteFillObject },
  communityText: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 16 },
  communityTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  communitySub: { fontSize: 13, color: "rgba(250,250,247,0.8)", marginTop: 2 },
});
