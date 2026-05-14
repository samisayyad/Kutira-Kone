import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ROLES = ["tailor", "artisan", "boutique", "creator"] as const;

export default function Auth() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUser } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [role, setRole] = useState<typeof ROLES[number]>("tailor");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      id: "me",
      name: mode === "register" ? name : "Njeri Wanjiru",
      bio: "Sustainable fashion advocate & artisan tailor.",
      location,
      role,
      stats: { listings: 12, swaps: 8, savedKg: 34, ecoPoints: 420 },
      avatar: (mode === "register" ? name : "Njeri Wanjiru").charAt(0).toUpperCase(),
      joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    });
    setLoading(false);
    router.replace("/(tabs)");
  };

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  return (
    <LinearGradient colors={["#1B4332", "#2D6A4F"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 48, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>🌿</Text>
        <Text style={styles.brand}>Kutira-Kone</Text>
        <Text style={styles.tagline}>Sustainable Fabric Marketplace</Text>

        <View style={[styles.card, { borderRadius: colors.radius }]}>
          <View style={styles.tabs}>
            {(["login", "register"] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => { setMode(m); setError(""); }}
                style={[
                  styles.tab,
                  {
                    borderBottomColor: mode === m ? colors.primary : "transparent",
                    borderBottomWidth: 2,
                  },
                ]}
              >
                <Text style={[styles.tabText, { color: mode === m ? colors.primary : colors.mutedForeground }]}>
                  {m === "login" ? "Sign In" : "Join Us"}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.form}>
            {mode === "register" && (
              <View style={[styles.inputWrap, { borderColor: colors.border }]}>
                <Feather name="user" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Full name"
                  placeholderTextColor={colors.mutedForeground}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={[styles.inputWrap, { borderColor: colors.border }]}>
              <Feather name="mail" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Email address"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputWrap, { borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPwd}
              />
              <Pressable onPress={() => setShowPwd(!showPwd)}>
                <Feather name={showPwd ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {mode === "register" && (
              <>
                <View style={[styles.inputWrap, { borderColor: colors.border }]}>
                  <Feather name="map-pin" size={18} color={colors.mutedForeground} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder="Your location"
                    placeholderTextColor={colors.mutedForeground}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>

                <Text style={[styles.roleLabel, { color: colors.mutedForeground }]}>I am a...</Text>
                <View style={styles.roleRow}>
                  {ROLES.map((r) => (
                    <Pressable
                      key={r}
                      onPress={() => setRole(r)}
                      style={[
                        styles.roleChip,
                        {
                          backgroundColor: role === r ? colors.primary : colors.muted,
                          borderRadius: colors.radius / 2,
                        },
                      ]}
                    >
                      <Text style={[styles.roleText, { color: role === r ? "#fff" : colors.foreground }]}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <Pressable onPress={handleSubmit} disabled={loading} style={styles.submitBtn}>
              <LinearGradient colors={["#2D6A4F", "#40916C"]} style={styles.submitGrad}>
                <Text style={styles.submitText}>
                  {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
              <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
                {mode === "login"
                  ? "New to Kutira-Kone? Join us →"
                  : "Already have an account? Sign in →"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, alignItems: "center", gap: 8 },
  logo: { fontSize: 56 },
  brand: { fontSize: 28, fontWeight: "800", color: "#FAFAF7", letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: "rgba(250,250,247,0.65)", marginBottom: 24 },
  card: { width: "100%", backgroundColor: "#FAFAF7", overflow: "hidden" },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#DDD8CC" },
  tab: { flex: 1, paddingVertical: 16, alignItems: "center" },
  tabText: { fontSize: 15, fontWeight: "700" },
  form: { padding: 24, gap: 14 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#F0EDE4",
  },
  input: { flex: 1, fontSize: 15 },
  roleLabel: { fontSize: 13, fontWeight: "500" },
  roleRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  roleChip: { paddingHorizontal: 14, paddingVertical: 8 },
  roleText: { fontSize: 13, fontWeight: "600" },
  error: { color: "#E63946", fontSize: 13, textAlign: "center" },
  submitBtn: { borderRadius: 12, overflow: "hidden", marginTop: 4 },
  submitGrad: { paddingVertical: 16, alignItems: "center" },
  submitText: { color: "#FAFAF7", fontSize: 16, fontWeight: "700" },
  switchText: { fontSize: 13, textAlign: "center", marginTop: 4 },
});
