import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
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

import { useColors } from "@/hooks/useColors";

const AI_IDEAS = [
  {
    id: "1",
    title: "Patchwork Market Bag",
    description: "Combine cotton scraps into a durable, stylish market bag. Zero waste, maximum utility.",
    materials: ["Cotton", "Linen"],
    difficulty: "Beginner",
    timeEstimate: "2-3 hrs",
    ecoImpact: "Saves 400g textile waste",
    gradient: ["#1B4332", "#2D6A4F"] as const,
    image: require("../../assets/images/ai2.png"),
  },
  {
    id: "2",
    title: "Upcycled Silk Scarf",
    description: "Transform silk remnants into an elegant hand-stitched scarf with a natural tie-dye finish.",
    materials: ["Silk"],
    difficulty: "Intermediate",
    timeEstimate: "3-4 hrs",
    ecoImpact: "Saves 200g fabric",
    gradient: ["#7B2D00", "#C77B45"] as const,
    image: require("../../assets/images/ai1.png"),
  },
  {
    id: "3",
    title: "Ankara Cushion Cover",
    description: "Vibrant patchwork cushion cover from Ankara offcuts. Mix prints for a bold, cultural look.",
    materials: ["Ankara", "Cotton"],
    difficulty: "Beginner",
    timeEstimate: "1.5 hrs",
    ecoImpact: "Saves 600g waste",
    gradient: ["#4A1A00", "#8B4513"] as const,
    image: require("../../assets/images/ai3.png"),
  },
  {
    id: "4",
    title: "Woven Wall Art",
    description: "Frame fabric scraps as woven art panels — hang as eco décor or sell at craft markets.",
    materials: ["Wool", "Linen", "Cotton"],
    difficulty: "Advanced",
    timeEstimate: "5-6 hrs",
    ecoImpact: "Saves 1kg+ textiles",
    gradient: ["#1B3A5C", "#2E6EA6"] as const,
    image: require("../../assets/images/fabric4.png"),
  },
  {
    id: "5",
    title: "Fabric Pot Holders Set",
    description: "Thick, layered pot holders from linen or cotton scraps. Functional kitchen items from waste.",
    materials: ["Linen", "Cotton"],
    difficulty: "Beginner",
    timeEstimate: "1 hr",
    ecoImpact: "Saves 300g textile",
    gradient: ["#3D2B00", "#C9A96E"] as const,
    image: require("../../assets/images/fabric3.png"),
  },
  {
    id: "6",
    title: "Kanga Print Dress",
    description: "Full upcycled kanga dress from 2kg of fabric offcuts. Traditional pattern, modern cut.",
    materials: ["Batik", "Ankara"],
    difficulty: "Advanced",
    timeEstimate: "8-10 hrs",
    ecoImpact: "Saves 2kg textile",
    gradient: ["#5C1B00", "#D4521A"] as const,
    image: require("../../assets/images/fabric1.png"),
  },
];

const FILTER_OPTS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function AIInspiration() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const filtered = AI_IDEAS.filter((i) => filter === "All" || i.difficulty === filter);

  const diffColor = (d: string) => {
    if (d === "Beginner") return colors.emerald;
    if (d === "Intermediate") return colors.amber;
    return colors.terracotta;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#1B3A5C", "#2E6EA6", "#2D6A4F"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>AI Design Studio</Text>
            <Text style={styles.headerSub}>Upcycling ideas for your scraps</Text>
          </View>
          <View style={styles.sparkBadge}>
            <Feather name="zap" size={16} color="#F2CC8F" />
            <Text style={styles.sparkText}>AI</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTER_OPTS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterChip, {
                backgroundColor: filter === f ? "rgba(250,250,247,0.25)" : "rgba(250,250,247,0.1)",
                borderColor: filter === f ? "rgba(250,250,247,0.6)" : "transparent",
              }]}
            >
              <Text style={[styles.filterText, { color: filter === f ? "#FAFAF7" : "rgba(250,250,247,0.65)" }]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {filtered.map((idea, i) => (
            <Pressable
              key={idea.id}
              onPress={() => setExpanded(expanded === idea.id ? null : idea.id)}
              style={[styles.card, { borderRadius: colors.radius, backgroundColor: colors.card }]}
            >
              <View style={[styles.imageWrap, { borderRadius: colors.radius }]}>
                <Image
                  source={idea.image}
                  style={styles.image}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={[...idea.gradient, "transparent"]}
                  style={styles.imageGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.diffBadge}>
                  <View style={[styles.diffDot, { backgroundColor: diffColor(idea.difficulty) }]} />
                  <Text style={styles.diffText}>{idea.difficulty}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{idea.title}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.meta}>
                    <Feather name="clock" size={11} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{idea.timeEstimate}</Text>
                  </View>
                  <View style={styles.meta}>
                    <Feather name="leaf" size={11} color={colors.emerald} />
                    <Text style={[styles.metaText, { color: colors.emerald }]}>{idea.ecoImpact}</Text>
                  </View>
                </View>

                {expanded === idea.id && (
                  <View style={styles.expanded}>
                    <Text style={[styles.desc, { color: colors.mutedForeground }]}>{idea.description}</Text>
                    <View style={styles.materialsRow}>
                      <Text style={[styles.materialsLabel, { color: colors.foreground }]}>Materials: </Text>
                      {idea.materials.map((m) => (
                        <View key={m} style={[styles.matTag, { backgroundColor: colors.primary + "22" }]}>
                          <Text style={[styles.matText, { color: colors.primary }]}>{m}</Text>
                        </View>
                      ))}
                    </View>
                    <Pressable style={[styles.tryBtn, { backgroundColor: colors.primary, borderRadius: 8 }]}>
                      <Feather name="zap" size={14} color="#fff" />
                      <Text style={styles.tryText}>Get Full Tutorial</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* AI Generate Prompt */}
        <View style={[styles.generateCard, { backgroundColor: colors.forest, borderRadius: colors.radius }]}>
          <LinearGradient
            colors={["rgba(64,145,108,0.3)", "rgba(27,67,50,0.1)"]}
            style={StyleSheet.absoluteFill}
          />
          <Feather name="cpu" size={28} color="#74C69D" />
          <Text style={styles.genTitle}>Have a specific fabric?</Text>
          <Text style={styles.genSub}>Describe your scrap and get AI-powered design ideas tailored to your materials.</Text>
          <Pressable style={[styles.genBtn, { borderColor: "#74C69D", borderRadius: 10 }]}>
            <Feather name="zap" size={16} color="#74C69D" />
            <Text style={styles.genBtnText}>Generate Ideas for My Fabric</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 14 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FAFAF7" },
  headerSub: { fontSize: 13, color: "rgba(250,250,247,0.7)", marginTop: 2 },
  sparkBadge: {
    flexDirection: "row", gap: 4, alignItems: "center",
    backgroundColor: "rgba(242,204,143,0.2)", borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: "rgba(242,204,143,0.4)",
  },
  sparkText: { color: "#F2CC8F", fontWeight: "800", fontSize: 13 },
  filterRow: { gap: 8, flexDirection: "row" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "600" },
  scroll: { padding: 16, gap: 12 },
  grid: { gap: 12 },
  card: {
    overflow: "hidden",
    elevation: 2, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6,
  },
  imageWrap: { height: 180, overflow: "hidden" },
  image: { ...StyleSheet.absoluteFillObject },
  imageGradient: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  diffBadge: {
    position: "absolute", top: 10, right: 10,
    flexDirection: "row", gap: 5, alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  diffDot: { width: 8, height: 8, borderRadius: 4 },
  diffText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  cardContent: { padding: 14, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: "800" },
  metaRow: { flexDirection: "row", gap: 16 },
  meta: { flexDirection: "row", gap: 4, alignItems: "center" },
  metaText: { fontSize: 11, fontWeight: "500" },
  expanded: { gap: 10, marginTop: 4 },
  desc: { fontSize: 14, lineHeight: 20 },
  materialsRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  materialsLabel: { fontSize: 12, fontWeight: "700" },
  matTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  matText: { fontSize: 11, fontWeight: "600" },
  tryBtn: { flexDirection: "row", gap: 8, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", alignSelf: "flex-start" },
  tryText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  generateCard: {
    padding: 24, alignItems: "center", gap: 12, overflow: "hidden", marginTop: 4,
  },
  genTitle: { fontSize: 20, fontWeight: "800", color: "#FAFAF7", textAlign: "center" },
  genSub: { fontSize: 14, color: "rgba(250,250,247,0.7)", textAlign: "center", lineHeight: 20 },
  genBtn: { flexDirection: "row", gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1.5, alignItems: "center" },
  genBtnText: { color: "#74C69D", fontSize: 14, fontWeight: "700" },
});
