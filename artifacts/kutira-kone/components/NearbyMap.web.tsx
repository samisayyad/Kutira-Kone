import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FabricListing } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  listings: FabricListing[];
  radius: number;
  selected: string | null;
  setSelected: (id: string | null) => void;
  onNavigate: (id: string) => void;
}

export function NearbyMapView({ listings, radius, selected, setSelected, onNavigate }: Props) {
  const colors = useColors();
  const selectedListing = listings.find((l) => l.id === selected);

  const markerColor = (score: number) => {
    if (score >= 90) return colors.emerald;
    if (score >= 75) return colors.primary;
    return colors.terracotta;
  };

  const PIN_POSITIONS = [
    { top: "22%", left: "18%" },
    { top: "38%", left: "62%" },
    { top: "55%", left: "30%" },
    { top: "20%", left: "72%" },
    { top: "68%", left: "55%" },
    { top: "48%", left: "80%" },
    { top: "72%", left: "20%" },
  ];

  return (
    <>
      {/* Visual map */}
      <View style={styles.mapWrap}>
        <LinearGradient
          colors={["#1B4332", "#2D6A4F", "#40916C", "#74C69D"]}
          style={styles.mapBg}
        >
          {[...Array(10)].map((_, i) => (
            <View key={`h${i}`} style={[styles.gridH, { top: `${i * 11}%` as any }]} />
          ))}
          {[...Array(8)].map((_, i) => (
            <View key={`v${i}`} style={[styles.gridV, { left: `${i * 14}%` as any }]} />
          ))}

          <View style={[styles.radiusCircle, { borderColor: "rgba(250,250,247,0.25)" }]} />

          <View style={styles.userPin}>
            <View style={[styles.userPinInner, { backgroundColor: colors.amber }]}>
              <Feather name="navigation" size={14} color="#fff" />
            </View>
            <Text style={styles.youLabel}>You</Text>
          </View>

          {listings.slice(0, 7).map((l, i) => {
            const pos = PIN_POSITIONS[i];
            return (
              <Pressable
                key={l.id}
                onPress={() => setSelected(l.id === selected ? null : l.id)}
                style={[
                  styles.pin,
                  {
                    top: pos.top as any,
                    left: pos.left as any,
                    backgroundColor: markerColor(l.sustainabilityScore),
                    borderColor: selected === l.id ? "#fff" : "rgba(255,255,255,0.4)",
                    borderWidth: selected === l.id ? 3 : 1.5,
                  },
                ]}
              >
                <Text style={styles.pinText}>{l.material.charAt(0)}</Text>
              </Pressable>
            );
          })}

          {selectedListing && (
            <View style={[styles.callout, { backgroundColor: colors.background, borderRadius: 10 }]}>
              <Text style={[styles.calloutTitle, { color: colors.foreground }]} numberOfLines={1}>
                {selectedListing.title}
              </Text>
              <Text style={[styles.calloutPrice, { color: colors.primary }]}>
                {selectedListing.price ? `KSh ${selectedListing.price}` : "Swap Only"} · {selectedListing.distance}km
              </Text>
            </View>
          )}

          <View style={[styles.legend, { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 8 }]}>
            {[
              { color: colors.emerald, label: "Eco 90+" },
              { color: colors.primary, label: "Eco 75+" },
              { color: colors.terracotta, label: "Eco <75" },
            ].map((l) => (
              <View key={l.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
        {selectedListing ? (
          <Pressable
            onPress={() => onNavigate(selectedListing.id)}
            style={[styles.selectedCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}
          >
            <View style={[styles.selectedColor, { backgroundColor: selectedListing.imageColor, borderRadius: 8 }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.selectedTitle, { color: colors.foreground }]} numberOfLines={1}>
                {selectedListing.title}
              </Text>
              <Text style={[styles.selectedMeta, { color: colors.mutedForeground }]}>
                {selectedListing.material} · {selectedListing.quantity} · {selectedListing.distance}km away
              </Text>
              <Text style={[styles.selectedPrice, { color: colors.primary }]}>
                {selectedListing.price ? `KSh ${selectedListing.price}` : "Swap Only"}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </Pressable>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
            {listings.slice(0, 6).map((l) => (
              <Pressable
                key={l.id}
                onPress={() => setSelected(l.id)}
                style={[styles.miniCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}
              >
                <View style={[styles.miniColor, { backgroundColor: l.imageColor }]} />
                <Text style={[styles.miniTitle, { color: colors.foreground }]} numberOfLines={1}>{l.title}</Text>
                <Text style={[styles.miniDist, { color: colors.primary }]}>{l.distance}km away</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 1, overflow: "hidden" },
  mapBg: { flex: 1, position: "relative" },
  gridH: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(250,250,247,0.07)" },
  gridV: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(250,250,247,0.07)" },
  radiusCircle: {
    position: "absolute", top: "12%", left: "18%",
    width: "64%", height: "76%", borderRadius: 999, borderWidth: 1.5,
  },
  userPin: { position: "absolute", top: "47%", left: "46%", alignItems: "center", gap: 2 },
  userPinInner: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, borderColor: "#fff",
  },
  youLabel: { color: "#FAFAF7", fontSize: 10, fontWeight: "800" },
  pin: {
    position: "absolute", width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center",
    elevation: 4, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  pinText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  callout: {
    position: "absolute", top: 10, left: 10, right: 10,
    padding: 10,
    elevation: 4, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  calloutTitle: { fontSize: 14, fontWeight: "700" },
  calloutPrice: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  legend: { position: "absolute", bottom: 12, right: 12, padding: 8, gap: 5 },
  legendItem: { flexDirection: "row", gap: 6, alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: "#FAFAF7", fontSize: 10, fontWeight: "600" },
  bottomSheet: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: "#DDD8CC",
    maxHeight: 140,
  },
  selectedCard: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  selectedColor: { width: 48, height: 48 },
  selectedTitle: { fontSize: 15, fontWeight: "700" },
  selectedMeta: { fontSize: 12, marginTop: 2 },
  selectedPrice: { fontSize: 14, fontWeight: "700", marginTop: 2 },
  cardScroll: { gap: 10, paddingRight: 16 },
  miniCard: { width: 130, padding: 10, gap: 6, overflow: "hidden" },
  miniColor: { width: "100%", height: 60, borderRadius: 8 },
  miniTitle: { fontSize: 12, fontWeight: "600" },
  miniDist: { fontSize: 12, fontWeight: "700" },
});
