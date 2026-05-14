import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EcoBadge } from "@/components/EcoBadge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FABRIC_IMAGES = [
  require("../../assets/images/fabric1.png"),
  require("../../assets/images/fabric2.png"),
  require("../../assets/images/fabric3.png"),
  require("../../assets/images/fabric4.png"),
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getListing, favorites, toggleFavorite } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const listing = getListing(id ?? "");

  if (!listing) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={48} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Listing not found</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isFav = favorites.includes(listing.id);
  const imageIdx = parseInt(listing.id) % FABRIC_IMAGES.length;

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true, tension: 200 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 200 }),
    ]).start();
    toggleFavorite(listing.id);
  };

  const conditionColor = listing.condition === "new" ? colors.emerald : listing.condition === "good" ? colors.amber : colors.terracotta;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Hero */}
        <View style={[styles.imageHero, { backgroundColor: listing.imageColor }]}>
          <Image
            source={FABRIC_IMAGES[imageIdx]}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={[listing.imageColor + "44", "transparent", listing.imageColor + "88"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.topBtn, { top: insets.top + (Platform.OS === "web" ? 67 : 16), left: 16 }]}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </Pressable>

          {/* Fav */}
          <Animated.View style={[styles.topBtn, { top: insets.top + (Platform.OS === "web" ? 67 : 16), right: 16, transform: [{ scale: scaleAnim }] }]}>
            <Pressable onPress={handleFav}>
              <Feather name="heart" size={22} color={isFav ? "#E63946" : "#fff"} />
            </Pressable>
          </Animated.View>

          {/* Eco badge overlay */}
          <View style={styles.heroEco}>
            <EcoBadge points={listing.ecoPoints} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + Price */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.foreground }]}>{listing.title}</Text>
              <View style={styles.tagRow}>
                <View style={[styles.tag, { backgroundColor: conditionColor + "22" }]}>
                  <View style={[styles.dot, { backgroundColor: conditionColor }]} />
                  <Text style={[styles.tagText, { color: conditionColor }]}>
                    {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                  </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{listing.material}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{listing.quantity}</Text>
                </View>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={[styles.price, { color: colors.primary }]}>
                {listing.price ? `KSh ${listing.price}` : "Swap Only"}
              </Text>
              {listing.swapAvailable && listing.price && (
                <Text style={[styles.swapHint, { color: colors.terracotta }]}>Swap available</Text>
              )}
            </View>
          </View>

          {/* Seller */}
          <View style={[styles.sellerCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <View style={[styles.sellerAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.sellerAvatarText}>{listing.seller.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sellerName, { color: colors.foreground }]}>{listing.seller.name}</Text>
              <View style={styles.sellerMeta}>
                <Text style={[styles.sellerRating, { color: colors.amber }]}>⭐ {listing.seller.rating}</Text>
                <View style={styles.sellerLocation}>
                  <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                  <Text style={[styles.sellerLocationText, { color: colors.mutedForeground }]}>
                    {listing.seller.location}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable style={[styles.msgBtn, { backgroundColor: colors.primary + "18", borderRadius: 20 }]}>
              <Feather name="message-circle" size={18} color={colors.primary} />
            </Pressable>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>About this fabric</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{listing.description}</Text>
          </View>

          {/* Details Grid */}
          <View style={[styles.detailsGrid, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            {[
              { icon: "layers", label: "Material", value: listing.material },
              { icon: "droplet", label: "Color", value: listing.color },
              { icon: "package", label: "Quantity", value: listing.quantity },
              { icon: "map-pin", label: "Distance", value: `${listing.distance} km` },
              { icon: "clock", label: "Posted", value: listing.postedAt },
              { icon: "leaf", label: "Eco Score", value: `${listing.sustainabilityScore}/100` },
            ].map((d) => (
              <View key={d.label} style={styles.detailItem}>
                <Feather name={d.icon as any} size={14} color={colors.primary} />
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{d.label}</Text>
                <Text style={[styles.detailValue, { color: colors.foreground }]}>{d.value}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {listing.tags.map((t) => (
              <View key={t} style={[styles.tag, { backgroundColor: colors.primary + "18" }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>#{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 12) }]}>
        <Pressable style={[styles.swapBtn, { borderColor: colors.primary, borderRadius: 12 }]}>
          <Feather name="refresh-cw" size={18} color={colors.primary} />
          <Text style={[styles.swapBtnText, { color: colors.primary }]}>Propose Swap</Text>
        </Pressable>
        {listing.price && (
          <Pressable style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}>
            <LinearGradient colors={["#2D6A4F", "#40916C"]} style={styles.buyGrad}>
              <Feather name="shopping-bag" size={18} color="#fff" />
              <Text style={styles.buyText}>Buy · KSh {listing.price}</Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  notFoundText: { fontSize: 16 },
  backBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  backBtnText: { color: "#fff", fontWeight: "700" },
  imageHero: { height: 320, position: "relative" },
  heroImage: { ...StyleSheet.absoluteFillObject },
  topBtn: {
    position: "absolute", width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center",
  },
  heroEco: { position: "absolute", bottom: 16, left: 16 },
  content: { padding: 20, gap: 20 },
  titleRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { flexDirection: "row", gap: 4, alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  tagText: { fontSize: 11, fontWeight: "600" },
  priceBox: { alignItems: "flex-end", gap: 2 },
  price: { fontSize: 22, fontWeight: "800" },
  swapHint: { fontSize: 11, fontWeight: "600" },
  sellerCard: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  sellerAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  sellerAvatarText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  sellerName: { fontSize: 15, fontWeight: "700" },
  sellerMeta: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 2 },
  sellerRating: { fontSize: 12, fontWeight: "600" },
  sellerLocation: { flexDirection: "row", gap: 3, alignItems: "center" },
  sellerLocationText: { fontSize: 11 },
  msgBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  descSection: { gap: 8 },
  sectionLabel: { fontSize: 16, fontWeight: "800" },
  desc: { fontSize: 14, lineHeight: 22 },
  detailsGrid: { padding: 4 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 0.5, borderBottomColor: "#DDD8CC" },
  detailLabel: { flex: 1, fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: "700" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "#DDD8CC",
  },
  swapBtn: { flex: 1, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", borderWidth: 1.5, paddingVertical: 14 },
  swapBtnText: { fontSize: 14, fontWeight: "700" },
  buyGrad: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  buyText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
