import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashGate() {
  useEffect(() => {
    (async () => {
      const onboarded = await AsyncStorage.getItem("kutira_onboarded");
      const user = await AsyncStorage.getItem("kutira_user");
      await new Promise((r) => setTimeout(r, 1200));
      if (!onboarded) {
        router.replace("/onboarding");
      } else if (!user) {
        router.replace("/auth");
      } else {
        router.replace("/(tabs)");
      }
    })();
  }, []);

  return (
    <LinearGradient
      colors={["#1B4332", "#2D6A4F", "#40916C"]}
      style={styles.container}
    >
      <View style={styles.logoWrap}>
        <Text style={styles.logoIcon}>🌿</Text>
        <Text style={styles.logoText}>Kutira-Kone</Text>
        <Text style={styles.tagline}>Zero Waste. Full Circle.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoWrap: { alignItems: "center", gap: 12 },
  logoIcon: { fontSize: 72 },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FAFAF7",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(250,250,247,0.75)",
    fontWeight: "500",
    letterSpacing: 1,
  },
});
