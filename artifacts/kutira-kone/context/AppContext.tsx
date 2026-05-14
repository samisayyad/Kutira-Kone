import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface FabricListing {
  id: string;
  title: string;
  material: string;
  color: string;
  quantity: string;
  condition: "new" | "good" | "fair";
  price: number | null;
  swapAvailable: boolean;
  seller: {
    id: string;
    name: string;
    rating: number;
    location: string;
    avatar: string;
  };
  imageColor: string;
  tags: string[];
  distance: number;
  coordinates: { lat: number; lng: number };
  postedAt: string;
  sustainabilityScore: number;
  ecoPoints: number;
  description: string;
  category: string;
}

export interface SwapRequest {
  id: string;
  theirListing: FabricListing;
  myListing: FabricListing;
  status: "pending" | "accepted" | "declined";
  message: string;
  createdAt: string;
  fromUser: string;
}

export interface AppNotification {
  id: string;
  type: "swap" | "message" | "eco" | "like";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  location: string;
  role: "tailor" | "artisan" | "boutique" | "creator";
  stats: {
    listings: number;
    swaps: number;
    savedKg: number;
    ecoPoints: number;
  };
  avatar: string;
  joinedAt: string;
}

const SEED_LISTINGS: FabricListing[] = [
  {
    id: "1",
    title: "Premium Indigo Cotton Bundle",
    material: "Cotton",
    color: "Indigo Blue",
    quantity: "2.5 kg",
    condition: "new",
    price: 450,
    swapAvailable: true,
    seller: { id: "u1", name: "Amara Crafts", rating: 4.9, location: "Nairobi", avatar: "A" },
    imageColor: "#3A7CA5",
    tags: ["cotton", "blue", "premium"],
    distance: 1.2,
    coordinates: { lat: -1.2921, lng: 36.8219 },
    postedAt: "2h ago",
    sustainabilityScore: 92,
    ecoPoints: 45,
    description: "Premium cotton scraps from Kenyan textile mills. Perfect for quilting, bags, and accessories. Zero dye waste – naturally dyed with indigo.",
    category: "Cotton",
  },
  {
    id: "2",
    title: "Silk Remnants – Emerald Green",
    material: "Silk",
    color: "Emerald",
    quantity: "800g",
    condition: "new",
    price: null,
    swapAvailable: true,
    seller: { id: "u2", name: "Zuri Textiles", rating: 4.7, location: "Mombasa", avatar: "Z" },
    imageColor: "#2D6A4F",
    tags: ["silk", "green", "luxury"],
    distance: 0.8,
    coordinates: { lat: -1.3032, lng: 36.8082 },
    postedAt: "5h ago",
    sustainabilityScore: 88,
    ecoPoints: 38,
    description: "Leftover silk from bridal gown production. High-quality, vibrant color. Swap only – looking for linen or cotton.",
    category: "Silk",
  },
  {
    id: "3",
    title: "Terracotta Linen Scraps",
    material: "Linen",
    color: "Terracotta",
    quantity: "3 kg",
    condition: "good",
    price: 280,
    swapAvailable: false,
    seller: { id: "u3", name: "EcoWeave Co.", rating: 4.6, location: "Kisumu", avatar: "E" },
    imageColor: "#C77B45",
    tags: ["linen", "earthy", "natural"],
    distance: 3.1,
    coordinates: { lat: -1.2630, lng: 36.8071 },
    postedAt: "1d ago",
    sustainabilityScore: 95,
    ecoPoints: 52,
    description: "Natural linen scraps in warm terracotta tones. Great for home decor, bags, and sustainable fashion projects.",
    category: "Linen",
  },
  {
    id: "4",
    title: "Mixed Batik Fabric Pieces",
    material: "Batik",
    color: "Multi",
    quantity: "1.5 kg",
    condition: "good",
    price: 320,
    swapAvailable: true,
    seller: { id: "u4", name: "Karibu Fabrics", rating: 4.8, location: "Nairobi", avatar: "K" },
    imageColor: "#8B4513",
    tags: ["batik", "colorful", "traditional"],
    distance: 2.3,
    coordinates: { lat: -1.2884, lng: 36.8233 },
    postedAt: "2d ago",
    sustainabilityScore: 86,
    ecoPoints: 41,
    description: "Traditional Kenyan batik fabric remnants in vibrant patterns. Each piece is unique. Great for artisan accessories.",
    category: "Batik",
  },
  {
    id: "5",
    title: "Organic Wool Yarn Bundle",
    material: "Wool",
    color: "Natural Beige",
    quantity: "1.2 kg",
    condition: "new",
    price: 600,
    swapAvailable: true,
    seller: { id: "u5", name: "Highlands Craft", rating: 5.0, location: "Nakuru", avatar: "H" },
    imageColor: "#C9A96E",
    tags: ["wool", "organic", "beige"],
    distance: 4.7,
    coordinates: { lat: -1.2780, lng: 36.8149 },
    postedAt: "3d ago",
    sustainabilityScore: 98,
    ecoPoints: 65,
    description: "Pure organic wool from highland sheep. No chemicals used. Perfect for knitwear and hand-woven projects.",
    category: "Wool",
  },
  {
    id: "6",
    title: "Ankara Print Offcuts",
    material: "Ankara",
    color: "Vibrant Multi",
    quantity: "2 kg",
    condition: "good",
    price: 190,
    swapAvailable: true,
    seller: { id: "u6", name: "Zawadi Studio", rating: 4.5, location: "Nairobi", avatar: "S" },
    imageColor: "#D4521A",
    tags: ["ankara", "african", "bright"],
    distance: 1.8,
    coordinates: { lat: -1.2955, lng: 36.8166 },
    postedAt: "4h ago",
    sustainabilityScore: 84,
    ecoPoints: 36,
    description: "Vibrant Ankara offcuts from boutique production. Multiple prints available. Minimum order 500g.",
    category: "Ankara",
  },
];

const SEED_SWAPS: SwapRequest[] = [
  {
    id: "sw1",
    theirListing: SEED_LISTINGS[0],
    myListing: SEED_LISTINGS[2],
    status: "pending",
    message: "I love your cotton bundle! Would love to swap for my linen scraps.",
    createdAt: "1h ago",
    fromUser: "Amara Crafts",
  },
  {
    id: "sw2",
    theirListing: SEED_LISTINGS[3],
    myListing: SEED_LISTINGS[1],
    status: "accepted",
    message: "Perfect swap! My batik for your silk.",
    createdAt: "3h ago",
    fromUser: "Karibu Fabrics",
  },
  {
    id: "sw3",
    theirListing: SEED_LISTINGS[4],
    myListing: SEED_LISTINGS[5],
    status: "declined",
    message: "Would you swap wool for my ankara prints?",
    createdAt: "1d ago",
    fromUser: "Highlands Craft",
  },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "swap",
    title: "New Swap Request!",
    body: "Amara Crafts wants to swap their Cotton Bundle for your Linen Scraps.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n2",
    type: "eco",
    title: "Eco Milestone Reached",
    body: "You've saved 10kg of textile waste. You earned 100 Eco Points!",
    time: "3h ago",
    read: false,
  },
  {
    id: "n3",
    type: "like",
    title: "Your listing got 5 likes",
    body: "Your Terracotta Linen Scraps listing is trending!",
    time: "6h ago",
    read: true,
  },
  {
    id: "n4",
    type: "message",
    title: "Message from Zuri Textiles",
    body: "Hi! Is the silk still available? I'm interested in the full bundle.",
    time: "1d ago",
    read: true,
  },
  {
    id: "n5",
    type: "swap",
    title: "Swap Accepted!",
    body: "Karibu Fabrics accepted your swap request. Coordinate pickup!",
    time: "2d ago",
    read: true,
  },
];

const SEED_PROFILE: UserProfile = {
  id: "me",
  name: "Njeri Wanjiru",
  bio: "Sustainable fashion advocate & artisan tailor based in Nairobi.",
  location: "Nairobi, Kenya",
  role: "tailor",
  stats: {
    listings: 12,
    swaps: 8,
    savedKg: 34,
    ecoPoints: 420,
  },
  avatar: "N",
  joinedAt: "March 2024",
};

interface AppContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  listings: FabricListing[];
  addListing: (l: FabricListing) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  swaps: SwapRequest[];
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  unreadCount: number;
  getListing: (id: string) => FabricListing | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<FabricListing[]>(SEED_LISTINGS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [swaps] = useState<SwapRequest[]>(SEED_SWAPS);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);

  useEffect(() => {
    AsyncStorage.getItem("kutira_user").then((v) => {
      if (v) setUserState(JSON.parse(v));
    });
    AsyncStorage.getItem("kutira_favorites").then((v) => {
      if (v) setFavorites(JSON.parse(v));
    });
  }, []);

  const setUser = useCallback((u: UserProfile | null) => {
    setUserState(u);
    if (u) AsyncStorage.setItem("kutira_user", JSON.stringify(u));
    else AsyncStorage.removeItem("kutira_user");
  }, []);

  const addListing = useCallback((l: FabricListing) => {
    setListings((prev) => [l, ...prev]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem("kutira_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getListing = useCallback(
    (id: string) => listings.find((l) => l.id === id),
    [listings]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        listings,
        addListing,
        favorites,
        toggleFavorite,
        swaps,
        notifications,
        markNotificationRead,
        unreadCount,
        getListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
