import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    gradient: ["#1B4332", "#2D6A4F", "#40916C"] as const,
    icon: "♻️",
    title: "Zero Waste Fashion",
    subtitle: "Turn textile scraps into treasures. Upload your leftover fabric and join the circular economy.",
    accent: "#74C69D",
  },
  {
    id: "2",
    gradient: ["#7B2D00", "#C77B45", "#E07A5F"] as const,
    icon: "🗺️",
    title: "Discover Locally",
    subtitle: "Find artisans and tailors near you. Swap, buy, or donate fabric scraps within your community.",
    accent: "#F2CC8F",
  },
  {
    id: "3",
    gradient: ["#1B3A5C", "#2E6EA6", "#40916C"] as const,
    icon: "✨",
    title: "AI-Powered Ideas",
    subtitle: "Get AI design suggestions for your scraps. Turn waste into art, fashion, and income.",
    accent: "#74C69D",
  },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem("kutira_onboarded", "true");
      router.replace("/auth");
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("kutira_onboarded", "true");
    router.replace("/auth");
  };

  const currentSlide = SLIDES[activeIndex];

  return (
    <LinearGradient
      colors={currentSlide.gradient}
      style={styles.container}
    >
      <Pressable
        onPress={handleSkip}
        style={[styles.skipBtn, { top: insets.top + (Platform.OS === "web" ? 67 : 16) }]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(s) => s.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={[styles.bottom, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24) }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: i === activeIndex ? 24 : 8,
                  backgroundColor: i === activeIndex ? "#FAFAF7" : "rgba(250,250,247,0.4)",
                },
              ]}
            />
          ))}
        </View>
        <Pressable onPress={handleNext} style={styles.nextBtn}>
          <LinearGradient
            colors={["rgba(250,250,247,0.2)", "rgba(250,250,247,0.1)"]}
            style={styles.nextGrad}
          >
            <Text style={styles.nextText}>
              {activeIndex < SLIDES.length - 1 ? "Continue" : "Get Started"}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    position: "absolute",
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: { color: "rgba(250,250,247,0.7)", fontSize: 15, fontWeight: "500" },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 20,
  },
  icon: { fontSize: 88 },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FAFAF7",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: "rgba(250,250,247,0.8)",
    textAlign: "center",
    lineHeight: 26,
  },
  bottom: {
    paddingHorizontal: 24,
    gap: 24,
    alignItems: "center",
  },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: { width: "100%", borderRadius: 16, overflow: "hidden" },
  nextGrad: {
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(250,250,247,0.4)",
    borderRadius: 16,
  },
  nextText: { color: "#FAFAF7", fontSize: 17, fontWeight: "700" },
});
