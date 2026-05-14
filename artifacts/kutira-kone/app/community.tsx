import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
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

import { useColors } from "@/hooks/useColors";

const SHOWCASES = [
  {
    id: "1",
    creator: "Amara Crafts",
    avatar: "A",
    avatarColor: "#2D6A4F",
    title: "Patchwork Market Bag",
    desc: "Made from 800g cotton scraps sourced on Kutira-Kone!",
    likes: 142,
    image: require("../assets/images/ai2.png"),
    tags: ["cotton", "bag", "upcycled"],
    color: "#3A7CA5",
  },
  {
    id: "2",
    creator: "Zuri Textiles",
    avatar: "Z",
    avatarColor: "#C77B45",
    title: "Silk Wall Tapestry",
    desc: "6 silk remnants woven into a stunning wall piece.",
    likes: 98,
    image: require("../assets/images/ai1.png"),
    tags: ["silk", "art", "decor"],
    color: "#2D6A4F",
  },
  {
    id: "3",
    creator: "EcoWeave Co.",
    avatar: "E",
    avatarColor: "#8B4513",
    title: "Ankara Print Cushions",
    desc: "Vibrant Ankara offcuts transformed into home decor.",
    likes: 214,
    image: require("../assets/images/ai3.png"),
    tags: ["ankara", "cushions", "home"],
    color: "#8B4513",
  },
  {
    id: "4",
    creator: "Highlands Craft",
    avatar: "H",
    avatarColor: "#1B4332",
    title: "Hand-knit Wool Scarves",
    desc: "Organic wool bundle became 4 unique winter scarves.",
    likes: 67,
    image: require("../assets/images/fabric3.png"),
    tags: ["wool", "knit", "winter"],
    color: "#C9A96E",
  },
  {
    id: "5",
    creator: "Zawadi Studio",
    avatar: "S",
    avatarColor: "#D4521A",
    title: "Batik Wrap Dress",
    desc: "Traditional batik scraps into a stunning wrap dress.",
    likes: 189,
    image: require("../assets/images/fabric1.png"),
    tags: ["batik", "dress", "fashion"],
    color: "#8B4513",
  },
  {
    id: "6",
    creator: "Karibu Fabrics",
    avatar: "K",
    avatarColor: "#2E6EA6",
    title: "Linen Plant Hangers",
    desc: "Terracotta linen scraps into minimalist macramé plant hangers.",
    likes: 55,
    image: require("../assets/images/fabric2.png"),
    tags: ["linen", "macramé", "plants"],
    color: "#C77B45",
  },
];

export default function Community() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#7B2D00", "#C77B45", "#E07A5F"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#FAFAF7" />
          </Pressable>
          <Text style={styles.headerTitle}>Community Showcase</Text>
          <Feather name="award" size={22} color="#F2CC8F" />
        </View>
        <Text style={styles.headerSub}>
          Inspiring creations made from fabric scraps by our community ✨
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Masonry grid style */}
        {SHOWCASES.map((item, i) => {
          const isLiked = likedIds.includes(item.id);
          return (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }]}
            >
              {/* Image */}
              <View style={[styles.imageWrap, { height: i % 3 === 0 ? 220 : 180 }]}>
                <Image
                  source={item.image}
                  style={styles.image}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={["transparent", item.color + "CC"]}
                  style={StyleSheet.absoluteFill}
                />
                {/* Tags */}
                <View style={styles.tagRow}>
                  {item.tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>#{t}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                {/* Creator row */}
                <View style={styles.creatorRow}>
                  <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                    <Text style={styles.avatarText}>{item.avatar}</Text>
                  </View>
                  <Text style={[styles.creatorName, { color: colors.primary }]}>{item.creator}</Text>
                </View>

                <Text style={[styles.title, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.desc, { color: colors.mutedForeground }]}>{item.desc}</Text>

                {/* Actions */}
                <View style={styles.actions}>
                  <Pressable onPress={() => toggleLike(item.id)} style={styles.likeBtn}>
                    <Feather name="heart" size={18} color={isLiked ? "#E63946" : colors.mutedForeground} />
                    <Text style={[styles.likeCount, { color: isLiked ? "#E63946" : colors.mutedForeground }]}>
                      {item.likes + (isLiked ? 1 : 0)}
                    </Text>
                  </Pressable>
                  <Pressable style={styles.actionBtn}>
                    <Feather name="message-circle" size={18} color={colors.mutedForeground} />
                  </Pressable>
                  <Pressable style={styles.actionBtn}>
                    <Feather name="share-2" size={18} color={colors.mutedForeground} />
                  </Pressable>
                  <View style={{ flex: 1 }} />
                  <View style={[styles.ecoBadgeMini, { backgroundColor: colors.primary + "18" }]}>
                    <Feather name="leaf" size={10} color={colors.primary} />
                    <Text style={[styles.ecoBadgeText, { color: colors.primary }]}>Upcycled</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* CTA */}
        <Pressable style={[styles.ctaCard, { backgroundColor: colors.forest, borderRadius: colors.radius }]}>
          <LinearGradient colors={["rgba(64,145,108,0.3)", "transparent"]} style={StyleSheet.absoluteFill} />
          <Feather name="camera" size={28} color="#74C69D" />
          <Text style={styles.ctaTitle}>Share Your Creation</Text>
          <Text style={styles.ctaSub}>Upload photos of what you made from fabric scraps and inspire the community.</Text>
          <View style={[styles.ctaBtn, { borderColor: "#74C69D" }]}>
            <Text style={styles.ctaBtnText}>+ Share Your Work</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  headerSub: { fontSize: 14, color: "rgba(250,250,247,0.75)", lineHeight: 20 },
  scroll: { padding: 16, gap: 14 },
  card: { overflow: "hidden", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  imageWrap: { position: "relative", overflow: "hidden" },
  image: { ...StyleSheet.absoluteFillObject },
  tagRow: { position: "absolute", bottom: 10, left: 10, flexDirection: "row", gap: 6 },
  tag: { backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { color: "#FAFAF7", fontSize: 10, fontWeight: "600" },
  cardContent: { padding: 14, gap: 8 },
  creatorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  creatorName: { fontSize: 13, fontWeight: "700" },
  title: { fontSize: 17, fontWeight: "800" },
  desc: { fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  likeBtn: { flexDirection: "row", gap: 5, alignItems: "center" },
  likeCount: { fontSize: 13, fontWeight: "600" },
  actionBtn: { padding: 2 },
  ecoBadgeMini: { flexDirection: "row", gap: 4, alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ecoBadgeText: { fontSize: 10, fontWeight: "700" },
  ctaCard: { padding: 24, alignItems: "center", gap: 12, overflow: "hidden" },
  ctaTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7" },
  ctaSub: { fontSize: 14, color: "rgba(250,250,247,0.7)", textAlign: "center", lineHeight: 20 },
  ctaBtn: { borderWidth: 1.5, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 },
  ctaBtnText: { color: "#74C69D", fontSize: 14, fontWeight: "700" },
});
