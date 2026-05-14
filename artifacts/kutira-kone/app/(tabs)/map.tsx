import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NearbyMapView } from "@/components/NearbyMap";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function NearbyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { listings } = useApp();
  const [radius, setRadius] = useState(5);
  const [selected, setSelected] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#1B4332", "#2D6A4F"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Text style={styles.headerTitle}>Nearby Fabrics</Text>
        <Text style={styles.headerSub}>{listings.length} listings within {radius}km</Text>
      </LinearGradient>

      <View style={[styles.radiusRow, { backgroundColor: colors.background }]}>
        {[2, 5, 10, 20].map((r) => (
          <Pressable
            key={r}
            onPress={() => setRadius(r)}
            style={[
              styles.radiusPill,
              {
                backgroundColor: radius === r ? colors.primary : colors.card,
                borderColor: radius === r ? colors.primary : colors.border,
                borderRadius: 20,
              },
            ]}
          >
            <Text style={[styles.radiusText, { color: radius === r ? "#fff" : colors.foreground }]}>
              {r}km
            </Text>
          </Pressable>
        ))}
      </View>

      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <NearbyMapView
          listings={listings}
          radius={radius}
          selected={selected}
          setSelected={setSelected}
          onNavigate={(id) => router.push(`/product/${id}` as any)}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 4 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FAFAF7" },
  headerSub: { fontSize: 13, color: "rgba(250,250,247,0.7)" },
  radiusRow: {
    flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "#DDD8CC",
  },
  radiusPill: { paddingHorizontal: 16, paddingVertical: 7, borderWidth: 1 },
  radiusText: { fontSize: 13, fontWeight: "600" },
});
