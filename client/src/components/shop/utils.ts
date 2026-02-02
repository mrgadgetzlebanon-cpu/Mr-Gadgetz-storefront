import { CategorySelection } from "./types";
import { CategoryStructure } from "@/config/categoryStructure";

// --- THE SOURCE OF TRUTH --- // Mapped strictly from the user's provided JSON
const COLLECTION_MAP: Record<string, string[]> = {
  // 1. PHONES
  phones: ["mobile-phones", "mobile-accessories-1"],
  "mobile phones": ["mobile-phones"],
  "mobile accessories": ["mobile-accessories-1"],

  // 2. TABLETS
  tablets: ["tablets-1", "tablet-accessories"],
  "tablet accessories": ["tablet-accessories"],

  // 3. LAPTOPS & COMPUTERS
  // Handles ribbon link: /shop?category=parent:PC+and+Laptops
  "pc and laptops": [
    "laptop",
    "desktops",
    "computer-accessories",
    "keyboards",
    "mice",
    "dell",
    "gaming-gaming-laptops-gaming-gaming-laptops-hp-gaming-laptops-laptops-laptops-hp",
    "macbook",
    "lenovo-laptops",
    "acer-laptops",
    "asus-laptops",
  ],
  laptops: [
    "laptop",
    "macbook",
    "dell",
    "lenovo-laptops",
    "asus-laptops",
    "acer-laptops",
  ],
  dell: ["dell"],
  hp: [
    "gaming-gaming-laptops-gaming-gaming-laptops-hp-gaming-laptops-laptops-laptops-hp",
  ],
  macbook: ["macbook"],
  lenovo: ["lenovo-laptops"],
  acer: ["acer-laptops"],
  asus: ["asus-laptops"],
  keyboards: ["keyboards"],
  mice: ["mice"],
  desktops: ["desktops"],

  // 4. ACCESSORIES (General)
  accessories: [
    "wearables",
    "mobile-accessories-1",
    "mobile-covers",
    "mobile-phone-stand",
    "tablet-accessories",
    "computer-accessories",
    "screen-protectors",
    "power-bank",
    "touch-pen",
    "storage",
    "charger-and-cable",
    "smart-tags",
    "car-accessories-1",
    "e-cigarettes",
  ],
  wearables: ["wearables"],
  "power bank": ["power-bank"],
  storage: ["storage"],

  // 5. AUDIO
  audio: ["headphones", "earbuds", "earphones", "speakers", "microphones"],
  headphones: ["headphones"],
  earbuds: ["earbuds"],
  earphones: ["earphones"],
  speakers: ["speakers"],
  microphones: ["microphones"],

  // 6. CAMERAS
  cameras: ["cameras", "camera-accessories-1"],

  // 7. SMART HOME
  "smart home": ["smart-home", "dyson-1", "home-appliances"],
  dyson: ["dyson-1"],
  "home appliances": ["home-appliances"],

  // 8. NETWORKING
  networking: ["networking-devices"],
};

export function deserializeSelection(
  param: string | null,
  _structure?: CategoryStructure,
): CategorySelection {
  if (!param) return { type: "all", handles: [] };

  // Decode first so we can inspect the raw value
  const decoded = decodeURIComponent(param);

  // Support bare handle URLs like `/shop?category=apple` (not tied to sidebar)
  if (!decoded.includes(":")) {
    const handles = decoded
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (handles.length === 0) return { type: "all", handles: [] };
    return {
      type: "parent",
      parent: handles.join(", "),
      handles,
    };
  }

  // Parse "type:parent:child" or "type:parent"
  // decodeURIComponent ensures "PC+and+Laptops" becomes "PC and Laptops"
  const parts = decoded.split(":");
  const type = parts[0];

  // 1. ALL PRODUCTS
  if (type === "parent" && parts[1] === "ALL_PRODUCTS") {
    return { type: "all", handles: [] };
  }

  // 2. PARENT CATEGORY (e.g. parent:Phones)
  if (type === "parent") {
    const parentName = parts[1];
    const key = parentName.toLowerCase();

    // LOOKUP THE HANDLES
    // We verify if the key exists in our map.
    const handles = COLLECTION_MAP[key] || [];
    // Fallback: If no map entry, assume the name itself is a handle (sluggified)
    // e.g., if a new category "VR" is added but not mapped, try fetching handle "vr"
    const finalHandles =
      handles.length > 0 ? handles : [key.replace(/\s+/g, "-")];
    return {
      type: "parent",
      parent: parentName,
      handles: finalHandles,
    };
  }

  // 3. CHILD CATEGORY (e.g. child:Phones:iPhone)
  if (type === "child") {
    const parentName = parts[1];
    const childName = parts[2];
    const key = childName.toLowerCase();

    // 1. Try specific child handle
    // 2. Try parent handle map
    // 3. Fallback to child name as handle
    const handles = COLLECTION_MAP[key] ||
      COLLECTION_MAP[parentName.toLowerCase()] || [key.replace(/\s+/g, "-")];
    return {
      type: "child",
      parent: parentName,
      childName: childName,
      handles: handles,
    };
  }

  return { type: "all", handles: [] };
}

export function serializeSelection(selection: CategorySelection): string {
  if (selection.type === "all") return "parent:ALL_PRODUCTS";
  if (selection.type === "child" && selection.parent && selection.childName) {
    return `child:${selection.parent}:${selection.childName}`;
  }
  if (selection.type === "parent" && selection.parent) {
    return `parent:${selection.parent}`;
  }
  return "parent:ALL_PRODUCTS";
}

export function buildShopUrl(params: {
  category?: string;
  sort?: string;
  page?: number;
  cursor?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.set("category", params.category);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page && params.page > 1)
    searchParams.set("page", params.page.toString());
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.search) searchParams.set("search", params.search);
  return `/shop?${searchParams.toString()}`;
}
