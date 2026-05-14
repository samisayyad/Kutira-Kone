import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["All", "Cotton", "Silk", "Linen", "Wool", "Batik", "Ankara", "Denim"];
const CONDITIONS = ["Any", "New", "Good", "Fair"];

interface Props {
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  showCondition?: boolean;
}

export function FilterBar({ selectedCategory, onSelectCategory, showCondition }: Props) {
  const colors = useColors();
  const [selectedCondition, setSelectedCondition] = useState("Any");

  const handleCategory = (c: string) => {
    Haptics.selectionAsync();
    onSelectCategory(c);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CATEGORIES.map((cat) => {
          const active = cat === selectedCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => handleCategory(cat)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                  borderRadius: colors.radius / 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {showCondition && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingTop: 4 }]}
        >
          {CONDITIONS.map((cond) => {
            const active = cond === selectedCondition;
            return (
              <Pressable
                key={cond}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCondition(cond);
                }}
                style={[
                  styles.condChip,
                  {
                    backgroundColor: active ? colors.accent : "transparent",
                    borderColor: active ? colors.accent : colors.border,
                    borderRadius: colors.radius / 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.condText,
                    { color: active ? colors.accentForeground : colors.mutedForeground },
                  ]}
                >
                  {cond}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  condChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  condText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
