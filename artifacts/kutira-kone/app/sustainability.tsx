import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
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

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const MONTHLY_SAVED = [2.1, 4.3, 3.8, 6.2, 5.5, 8.4];
const MAX_SAVED = 10;

const ACHIEVEMENTS = [
  { icon: "leaf", label: "First Listing", desc: "You listed your first fabric", earned: true },
  { icon: "refresh-cw", label: "Swap Master", desc: "Complete 5 successful swaps", earned: true },
  { icon: "award", label: "Eco Champion", desc: "Save 30kg of textile waste", earned: true },
  { icon: "star", label: "Community Star", desc: "Get 50 likes on your listings", earned: false },
  { icon: "zap", label: "AI Pioneer", desc: "Use AI studio 10 times", earned: false },
  { icon: "globe", label: "Local Hero", desc: "Connect with 20 local artisans", earned: false },
];

export default function Sustainability() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const barAnimations = useRef(MONTHLY_SAVED.map(() => new Animated.Value(0))).current;
  const circleAnim = useRef(new Animated.Value(0)).current;

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  useEffect(() => {
    Animated.timing(circleAnim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
    barAnimations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1, duration: 800, delay: i * 100, useNativeDriver: false,
      }).start();
    });
  }, []);

  const stats = user?.stats ?? { listings: 12, swaps: 8, savedKg: 34, ecoPoints: 420 };

  const IMPACT_CARDS = [
    { icon: "cloud-off", label: "CO₂ Prevented", value: `${(stats.savedKg * 2.1).toFixed(0)} kg`, color: colors.emerald },
    { icon: "droplet", label: "Water Saved", value: `${(stats.savedKg * 11).toFixed(0)} L`, color: "#2E6EA6" },
    { icon: "trash-2", label: "Waste Diverted", value: `${stats.savedKg} kg`, color: colors.primary },
    { icon: "zap", label: "Energy Saved", value: `${(stats.savedKg * 4.3).toFixed(0)} kWh`, color: colors.amber },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#1B4332", "#2D6A4F", "#40916C"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#FAFAF7" />
          </Pressable>
          <Text style={styles.headerTitle}>Sustainability Dashboard</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Big eco circle */}
        <View style={styles.circleSection}>
          <View style={styles.circle}>
            <Text style={styles.circleNum}>{stats.savedKg}</Text>
            <Text style={styles.circleUnit}>kg saved</Text>
          </View>
          <View style={styles.circleLabels}>
            <Text style={styles.circleMainLabel}>Textile Waste Prevented</Text>
            <Text style={styles.circleSub}>Your eco-impact this year</Text>
            <View style={styles.ecoPointsBadge}>
              <Feather name="award" size={14} color="#F2CC8F" />
              <Text style={styles.ecoPointsText}>{stats.ecoPoints} Eco Points earned</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Impact Grid */}
        <View style={styles.sectionTitle}>
          <Text style={[styles.secTitle, { color: colors.foreground }]}>Your Environmental Impact</Text>
        </View>

        <View style={styles.impactGrid}>
          {IMPACT_CARDS.map((card) => (
            <View key={card.label} style={[styles.impactCard, { backgroundColor: card.color + "15", borderRadius: colors.radius, borderColor: card.color + "44", borderWidth: 1 }]}>
              <View style={[styles.impactIcon, { backgroundColor: card.color + "22" }]}>
                <Feather name={card.icon as any} size={20} color={card.color} />
              </View>
              <Text style={[styles.impactValue, { color: card.color }]}>{card.value}</Text>
              <Text style={[styles.impactLabel, { color: colors.mutedForeground }]}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Monthly Chart */}
        <View style={styles.sectionTitle}>
          <Text style={[styles.secTitle, { color: colors.foreground }]}>Monthly Fabric Saved</Text>
          <Text style={[styles.secSub, { color: colors.mutedForeground }]}>Kilograms diverted from landfill</Text>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <View style={styles.chart}>
            {MONTHLY_SAVED.map((val, i) => (
              <View key={i} style={styles.barCol}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: barAnimations[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, (val / MAX_SAVED) * 120],
                      }),
                      backgroundColor: i === MONTHLY_SAVED.length - 1 ? colors.primary : colors.sage,
                      borderRadius: 4,
                    },
                  ]}
                />
                <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{MONTHS[i]}</Text>
                <Text style={[styles.barValue, { color: colors.primary }]}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress to Goal */}
        <View style={styles.sectionTitle}>
          <Text style={[styles.secTitle, { color: colors.foreground }]}>Goal Progress</Text>
        </View>
        <View style={[styles.goalCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          {[
            { label: "Reduce Textile Waste", current: stats.savedKg, goal: 50, color: colors.primary },
            { label: "Community Swaps", current: stats.swaps, goal: 20, color: colors.emerald },
            { label: "Active Listings", current: stats.listings, goal: 25, color: colors.terracotta },
          ].map((g) => {
            const pct = Math.min(g.current / g.goal, 1);
            return (
              <View key={g.label} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <Text style={[styles.goalLabel, { color: colors.foreground }]}>{g.label}</Text>
                  <Text style={[styles.goalValues, { color: colors.mutedForeground }]}>
                    {g.current}/{g.goal}
                  </Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, { width: `${pct * 100}%`, backgroundColor: g.color }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements */}
        <View style={styles.sectionTitle}>
          <Text style={[styles.secTitle, { color: colors.foreground }]}>Achievements</Text>
        </View>
        <View style={styles.achieveGrid}>
          {ACHIEVEMENTS.map((a) => (
            <View
              key={a.label}
              style={[
                styles.achieveCard,
                {
                  backgroundColor: a.earned ? colors.primary + "18" : colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: a.earned ? colors.primary + "44" : colors.border,
                  opacity: a.earned ? 1 : 0.5,
                },
              ]}
            >
              <View style={[styles.achieveIcon, { backgroundColor: a.earned ? colors.primary : colors.muted }]}>
                <Feather name={a.icon as any} size={18} color={a.earned ? "#fff" : colors.mutedForeground} />
              </View>
              <Text style={[styles.achieveLabel, { color: colors.foreground }]}>{a.label}</Text>
              <Text style={[styles.achieveDesc, { color: colors.mutedForeground }]}>{a.desc}</Text>
              {a.earned && <Feather name="check-circle" size={14} color={colors.emerald} />}
            </View>
          ))}
        </View>

        {/* Tip */}
        <View style={[styles.tip, { backgroundColor: colors.forest, borderRadius: colors.radius }]}>
          <Feather name="info" size={18} color="#74C69D" />
          <Text style={styles.tipText}>
            Every kilogram of fabric you save prevents ~2.1kg of CO₂ and 11 litres of water from being wasted in new textile production.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 28, gap: 20 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FAFAF7" },
  circleSection: { flexDirection: "row", gap: 20, alignItems: "center" },
  circle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(250,250,247,0.15)",
    borderWidth: 3, borderColor: "rgba(250,250,247,0.3)",
    alignItems: "center", justifyContent: "center",
  },
  circleNum: { fontSize: 28, fontWeight: "900", color: "#FAFAF7" },
  circleUnit: { fontSize: 11, color: "rgba(250,250,247,0.75)", fontWeight: "600" },
  circleLabels: { flex: 1, gap: 4 },
  circleMainLabel: { fontSize: 18, fontWeight: "800", color: "#FAFAF7" },
  circleSub: { fontSize: 13, color: "rgba(250,250,247,0.7)" },
  ecoPointsBadge: { flexDirection: "row", gap: 6, alignItems: "center", marginTop: 4 },
  ecoPointsText: { color: "#F2CC8F", fontSize: 13, fontWeight: "700" },
  scroll: { padding: 16, gap: 8 },
  sectionTitle: { marginTop: 12, marginBottom: 4 },
  secTitle: { fontSize: 17, fontWeight: "800" },
  secSub: { fontSize: 12, marginTop: 2 },
  impactGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  impactCard: { width: "47%", alignItems: "center", padding: 16, gap: 8 },
  impactIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  impactValue: { fontSize: 22, fontWeight: "800" },
  impactLabel: { fontSize: 11, fontWeight: "500", textAlign: "center" },
  chartCard: { padding: 16 },
  chart: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 160, paddingTop: 16 },
  barCol: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 4 },
  bar: { width: "100%" },
  barLabel: { fontSize: 9, fontWeight: "600" },
  barValue: { fontSize: 9, fontWeight: "800" },
  goalCard: { padding: 16, gap: 16 },
  goalItem: { gap: 8 },
  goalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  goalLabel: { fontSize: 13, fontWeight: "600" },
  goalValues: { fontSize: 12 },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  achieveGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  achieveCard: { width: "47%", alignItems: "center", padding: 14, gap: 8 },
  achieveIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  achieveLabel: { fontSize: 13, fontWeight: "700", textAlign: "center" },
  achieveDesc: { fontSize: 10, textAlign: "center", lineHeight: 14 },
  tip: { flexDirection: "row", gap: 10, padding: 16, alignItems: "flex-start" },
  tipText: { flex: 1, color: "rgba(250,250,247,0.75)", fontSize: 13, lineHeight: 19 },
});
