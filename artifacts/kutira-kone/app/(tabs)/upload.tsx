import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { FabricListing } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MATERIALS = ["Cotton", "Silk", "Linen", "Wool", "Batik", "Ankara", "Denim", "Other"];
const CONDITIONS = ["new", "good", "fair"] as const;
const COLORS_LIST = ["White", "Black", "Indigo", "Terracotta", "Emerald", "Amber", "Multi", "Natural"];

export default function UploadFabric() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addListing, user } = useApp();

  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [material, setMaterial] = useState("Cotton");
  const [fabricColor, setFabricColor] = useState("White");
  const [quantity, setQuantity] = useState("");
  const [condition, setCondition] = useState<typeof CONDITIONS[number]>("new");
  const [price, setPrice] = useState("");
  const [swapOnly, setSwapOnly] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const pickImage = async () => {
    if (images.length >= 4) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.8,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets[0]) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !quantity.trim()) {
      Alert.alert("Missing Info", "Please fill in title and quantity.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const colors_map: Record<string, string> = {
      "Indigo": "#3A7CA5", "Terracotta": "#C77B45", "Emerald": "#2D6A4F",
      "Amber": "#C9A96E", "White": "#F5F5F5", "Black": "#2A2A2A", "Natural": "#C9A96E", "Multi": "#8B4513",
    };

    const newListing: FabricListing = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      title: title.trim(),
      material,
      color: fabricColor,
      quantity: quantity.trim() + (quantity.includes("kg") ? "" : " kg"),
      condition,
      price: swapOnly ? null : (parseFloat(price) || null),
      swapAvailable: true,
      seller: {
        id: user?.id ?? "me",
        name: user?.name ?? "You",
        rating: 5.0,
        location: user?.location ?? "Nairobi",
        avatar: user?.avatar ?? "Y",
      },
      imageColor: colors_map[fabricColor] ?? "#2D6A4F",
      tags: [material.toLowerCase(), fabricColor.toLowerCase()],
      distance: 0,
      coordinates: { lat: -1.2921, lng: 36.8219 },
      postedAt: "Just now",
      sustainabilityScore: 90,
      ecoPoints: 40,
      description: description.trim() || `${material} fabric in ${fabricColor}. Quantity: ${quantity}.`,
      category: material,
    };

    addListing(newListing);
    setLoading(false);

    setTitle(""); setQuantity(""); setPrice(""); setDescription(""); setImages([]);
    Alert.alert("Listed!", "Your fabric is now on the marketplace. 🌿", [
      { text: "View Marketplace", onPress: () => router.replace("/(tabs)") },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#1B4332", "#2D6A4F"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Text style={styles.headerTitle}>List Your Fabric</Text>
        <Text style={styles.headerSub}>Give scraps a second life</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
            <Pressable onPress={pickImage} style={[styles.addPhoto, { borderColor: colors.border, borderRadius: colors.radius }]}>
              <Feather name="camera" size={28} color={colors.primary} />
              <Text style={[styles.addPhotoText, { color: colors.mutedForeground }]}>Add photo</Text>
            </Pressable>
            {images.map((uri, i) => (
              <View key={i} style={[styles.photoThumb, { borderRadius: colors.radius, backgroundColor: colors.sage }]}>
                <Text style={{ fontSize: 28 }}>📸</Text>
                <Pressable
                  onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  style={styles.removePhoto}
                >
                  <Feather name="x" size={12} color="#fff" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Listing Title *</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius / 2 }]}
            placeholder="e.g. Premium Cotton Scraps Bundle"
            placeholderTextColor={colors.mutedForeground}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Material */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Material Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {MATERIALS.map((m) => (
              <Pressable
                key={m}
                onPress={() => setMaterial(m)}
                style={[styles.chip, {
                  backgroundColor: material === m ? colors.primary : colors.card,
                  borderColor: material === m ? colors.primary : colors.border,
                  borderRadius: 8,
                }]}
              >
                <Text style={[styles.chipText, { color: material === m ? "#fff" : colors.foreground }]}>{m}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Color */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {COLORS_LIST.map((c) => (
              <Pressable
                key={c}
                onPress={() => setFabricColor(c)}
                style={[styles.chip, {
                  backgroundColor: fabricColor === c ? colors.accent : colors.card,
                  borderColor: fabricColor === c ? colors.amber : colors.border,
                  borderRadius: 8,
                }]}
              >
                <Text style={[styles.chipText, { color: colors.foreground }]}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Condition</Text>
          <View style={styles.condRow}>
            {CONDITIONS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCondition(c)}
                style={[styles.condChip, {
                  flex: 1,
                  backgroundColor: condition === c ? colors.emerald : colors.card,
                  borderRadius: 10,
                }]}
              >
                <Text style={[styles.chipText, { color: condition === c ? "#fff" : colors.foreground }]}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Quantity *</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius / 2 }]}
            placeholder="e.g. 2.5 kg or 3 metres"
            placeholderTextColor={colors.mutedForeground}
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        {/* Price */}
        <View style={styles.section}>
          <View style={styles.priceHeader}>
            <Text style={[styles.label, { color: colors.foreground }]}>Swap Only</Text>
            <Switch
              value={swapOnly}
              onValueChange={setSwapOnly}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor="#fff"
            />
          </View>
          {!swapOnly && (
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius / 2 }]}
              placeholder="Price in KSh (e.g. 450)"
              placeholderTextColor={colors.mutedForeground}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
          <TextInput
            style={[styles.textarea, { borderColor: colors.border, color: colors.foreground, borderRadius: colors.radius / 2 }]}
            placeholder="Describe the fabric, origin, texture, intended use..."
            placeholderTextColor={colors.mutedForeground}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Eco reminder */}
        <View style={[styles.ecoReminder, { backgroundColor: colors.sage + "22", borderRadius: colors.radius, borderColor: colors.sage }]}>
          <Feather name="leaf" size={18} color={colors.emerald} />
          <Text style={[styles.ecoText, { color: colors.forest }]}>
            Listing fabric earns you Eco Points and reduces textile waste. 🌱
          </Text>
        </View>

        {/* Submit */}
        <Pressable onPress={handleSubmit} disabled={loading} style={styles.submitBtn}>
          <LinearGradient colors={["#2D6A4F", "#40916C"]} style={styles.submitGrad}>
            <Feather name="upload-cloud" size={20} color="#fff" />
            <Text style={styles.submitText}>
              {loading ? "Listing..." : "List My Fabric"}
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 4 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#FAFAF7" },
  headerSub: { fontSize: 13, color: "rgba(250,250,247,0.7)" },
  scroll: { padding: 20, gap: 4 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
  imageRow: { gap: 10, flexDirection: "row" },
  addPhoto: {
    width: 90, height: 90, borderWidth: 2, borderStyle: "dashed",
    alignItems: "center", justifyContent: "center", gap: 4,
  },
  addPhotoText: { fontSize: 11, fontWeight: "500" },
  photoThumb: {
    width: 90, height: 90, alignItems: "center", justifyContent: "center",
  },
  removePhoto: {
    position: "absolute", top: 4, right: 4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center",
  },
  chipRow: { gap: 8, flexDirection: "row" },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: "600" },
  condRow: { flexDirection: "row", gap: 8 },
  condChip: { paddingVertical: 10, alignItems: "center" },
  input: {
    borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, minHeight: 100,
  },
  priceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  ecoReminder: {
    flexDirection: "row", gap: 10, padding: 14, alignItems: "flex-start", borderWidth: 1, marginBottom: 8,
  },
  ecoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  submitBtn: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  submitGrad: { flexDirection: "row", gap: 10, paddingVertical: 18, alignItems: "center", justifyContent: "center" },
  submitText: { color: "#fff", fontSize: 17, fontWeight: "800" },
});
