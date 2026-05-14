import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Callout, Circle, Marker } from "react-native-maps";

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
  const initialRegion = {
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  const selectedListing = listings.find((l) => l.id === selected);

  const markerColor = (score: number) => {
    if (score >= 90) return colors.emerald;
    if (score >= 75) return colors.primary;
    return colors.terracotta;
  };

  return (
    <>
      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <Circle
            center={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
            radius={radius * 1000}
            fillColor="rgba(45,106,79,0.12)"
            strokeColor="rgba(45,106,79,0.4)"
            strokeWidth={1.5}
          />
          {listings.map((listing) => (
            <Marker
              key={listing.id}
              coordinate={{ latitude: listing.coordinates.lat, longitude: listing.coordinates.lng }}
              onPress={() => setSelected(listing.id)}
            >
              <View style={[styles.marker, { backgroundColor: markerColor(listing.sustainabilityScore) }]}>
                <Text style={styles.markerText}>{listing.material.charAt(0)}</Text>
              </View>
              <Callout tooltip>
                <View style={[styles.callout, { backgroundColor: colors.background, borderRadius: colors.radius }]}>
                  <Text style={[styles.calloutTitle, { color: colors.foreground }]}>{listing.title}</Text>
                  <Text style={[styles.calloutPrice, { color: colors.primary }]}>
                    {listing.price ? `KSh ${listing.price}` : "Swap Only"}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <Pressable style={[styles.recenterBtn, { backgroundColor: colors.background }]}>
          <Feather name="navigation" size={20} color={colors.primary} />
        </Pressable>
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
            {listings.slice(0, 5).map((l) => (
              <Pressable
                key={l.id}
                onPress={() => setSelected(l.id)}
                style={[styles.miniCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}
              >
                <View style={[styles.miniColor, { backgroundColor: l.imageColor }]} />
                <Text style={[styles.miniTitle, { color: colors.foreground }]} numberOfLines={1}>{l.title}</Text>
                <Text style={[styles.miniDist, { color: colors.primary }]}>{l.distance}km</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 1, position: "relative" },
  map: { flex: 1 },
  marker: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
    elevation: 4, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  markerText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  callout: {
    padding: 10, minWidth: 140,
    elevation: 4, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  calloutTitle: { fontSize: 13, fontWeight: "700" },
  calloutPrice: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  recenterBtn: {
    position: "absolute", right: 16, bottom: 16,
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
    elevation: 4, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
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
