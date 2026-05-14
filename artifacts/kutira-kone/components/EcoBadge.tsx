import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  points: number;
  label?: string;
  size?: "sm" | "md";
}

export function EcoBadge({ points, label = "Eco Pts", size = "md" }: Props) {
  const colors = useColors();
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.sage + "33",
          borderColor: colors.sage,
          borderRadius: colors.radius / 2,
          paddingHorizontal: isSmall ? 6 : 10,
          paddingVertical: isSmall ? 3 : 5,
        },
      ]}
    >
      <Feather name="leaf" size={isSmall ? 10 : 12} color={colors.emerald} />
      <Text
        style={[
          styles.text,
          {
            color: colors.emerald,
            fontSize: isSmall ? 10 : 12,
          },
        ]}
      >
        {points} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
  },
});
