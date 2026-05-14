import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FabricListing } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  listing: FabricListing;
  onPress: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
  delay?: number;
  compact?: boolean;
}

export function FabricCard({ listing, onPress, isFavorite, onFavorite, delay = 0, compact }: Props) {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(fadeAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFavorite?.();
  };

  const cardHeight = compact ? 160 : 210;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          { borderRadius: colors.radius, height: cardHeight },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <View style={[styles.imageArea, { backgroundColor: listing.imageColor }]}>
          <LinearGradient
            colors={[listing.imageColor + "CC", listing.imageColor + "88", "transparent"]}
            style={styles.imageGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.imagePlaceholder}>
            <Text style={styles.materialEmoji}>
              {getMaterialIcon(listing.material)}
            </Text>
          </View>

          {onFavorite && (
            <Pressable onPress={handleFavorite} style={styles.heartBtn} hitSlop={8}>
              <Feather
                name={isFavorite ? "heart" : "heart"}
                size={16}
                color={isFavorite ? "#E63946" : "rgba(255,255,255,0.9)"}
              />
            </Pressable>
          )}

          <View style={styles.ecoBadge}>
            <View style={[styles.ecoInner, { backgroundColor: colors.primary }]}>
              <Text style={styles.ecoText}>{listing.sustainabilityScore}</Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={["rgba(250,250,247,0)", colors.card]}
          style={styles.infoGradient}
        />

        <View style={[styles.info, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {listing.title}
          </Text>
          <View style={styles.row}>
            <View style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                {listing.material}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                {listing.quantity}
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {listing.price ? `KSh ${listing.price}` : "Swap Only"}
            </Text>
            <Text style={[styles.distance, { color: colors.mutedForeground }]}>
              <Feather name="map-pin" size={10} /> {listing.distance}km
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function getMaterialIcon(material: string) {
  switch (material.toLowerCase()) {
    case "silk": return "🪡";
    case "wool": return "🧶";
    case "cotton": return "🌿";
    case "linen": return "🌾";
    case "batik": return "🎨";
    default: return "🪢";
  }
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageArea: {
    flex: 1,
    position: "relative",
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  materialEmoji: {
    fontSize: 36,
    opacity: 0.6,
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  ecoBadge: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  ecoInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ecoText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  infoGradient: {
    height: 12,
    marginTop: -12,
  },
  info: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 6,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
  },
  distance: {
    fontSize: 10,
  },
});
