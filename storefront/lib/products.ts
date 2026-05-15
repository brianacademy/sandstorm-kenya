// Sandstorm Kenya — Mock product catalog
// This data will be replaced by Medusa API calls in Phase 2

export interface ProductVariant {
  id: string;
  color: string;
  hex: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  handle: string;
  name: string;
  category: string;
  categoryHandle: string;
  price: number;
  badge?: string;
  image: string;
  images: string[];
  variants: ProductVariant[];
  description: string;
  materials: string[];
  dimensions: string[];
  care: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod_01",
    handle: "canvas-adventurer-backpack",
    name: "Canvas Adventurer Backpack",
    category: "Backpacks",
    categoryHandle: "backpacks",
    price: 32500,
    badge: "Best Seller",
    image: "/images/category-backpacks.png",
    images: [
      "/images/category-backpacks.png",
      "/images/heritage-1.png",
      "/images/hero-1.png",
      "/images/heritage-3.png",
    ],
    variants: [
      { id: "var_01a", color: "Olive Green", hex: "#4A5240", price: 32500, inStock: true },
      { id: "var_01b", color: "Stone",       hex: "#8B7355", price: 32500, inStock: true },
      { id: "var_01c", color: "Black",       hex: "#1A1A1A", price: 32500, inStock: true },
      { id: "var_01d", color: "Khaki",       hex: "#B5A585", price: 32500, inStock: false },
    ],
    description:
      "The Canvas Adventurer Backpack is built for those who refuse to choose between style and function. Handcrafted in our Nairobi workshop using heavy-duty waxed canvas and full-grain vegetable-tanned leather, this pack is designed to accompany you for decades — not just seasons.",
    materials: [
      "Body: 16oz waxed cotton canvas",
      "Trim: Full-grain vegetable-tanned leather",
      "Hardware: Solid brass YKK",
      "Lining: 100% cotton canvas",
      "Thread: Heavy-duty waxed linen",
    ],
    dimensions: [
      "Height: 46cm", "Width: 32cm", "Depth: 16cm",
      "Capacity: 28 litres", "Weight: 1.1kg",
      "Laptop compartment: fits up to 15\"",
    ],
    care: "Brush off dirt with a damp cloth. Re-wax canvas annually. Condition leather with natural balm. Do not machine wash.",
  },
  {
    id: "prod_02",
    handle: "canvas-explorer-tote",
    name: "Canvas Explorer Tote",
    category: "Totes",
    categoryHandle: "totes",
    price: 18900,
    badge: "New",
    image: "/images/category-totes.png",
    images: ["/images/category-totes.png", "/images/heritage-2.png"],
    variants: [
      { id: "var_02a", color: "Olive Green", hex: "#4A5240", price: 18900, inStock: true },
      { id: "var_02b", color: "Tan",         hex: "#C5924A", price: 18900, inStock: true },
    ],
    description:
      "Our most iconic tote, reimagined. The Canvas Explorer Tote pairs waxed canvas with cognac leather handles — a bag that carries your daily essentials with enduring elegance.",
    materials: ["Body: 14oz waxed cotton canvas", "Handles: Full-grain leather", "Hardware: Solid brass"],
    dimensions: ["Height: 38cm", "Width: 36cm", "Depth: 14cm", "Weight: 0.7kg"],
    care: "Wipe clean with a damp cloth. Re-wax annually.",
  },
  {
    id: "prod_03",
    handle: "canvas-adventurer-duffle",
    name: "Canvas Adventurer Duffle",
    category: "Duffles",
    categoryHandle: "duffles",
    price: 40900,
    image: "/images/category-duffles.png",
    images: ["/images/category-duffles.png", "/images/hero-3.png"],
    variants: [
      { id: "var_03a", color: "Khaki",       hex: "#B5A585", price: 40900, inStock: true },
      { id: "var_03b", color: "Stone",       hex: "#8B7355", price: 40900, inStock: true },
      { id: "var_03c", color: "Black",       hex: "#1A1A1A", price: 40900, inStock: true },
    ],
    description:
      "Whether you're heading to the bush or a business trip, the Canvas Adventurer Duffle is your ideal travel companion. Spacious, structured, and built to last.",
    materials: ["Body: 16oz waxed canvas", "Base: Full-grain leather", "Hardware: Solid brass"],
    dimensions: ["Length: 56cm", "Height: 29cm", "Depth: 26cm", "Capacity: 42 litres"],
    care: "Brush clean, re-wax periodically.",
  },
  {
    id: "prod_04",
    handle: "canvas-messenger-bag",
    name: "Canvas Messenger Bag",
    category: "Messengers",
    categoryHandle: "messengers",
    price: 22500,
    image: "/images/product-messenger.png",
    images: ["/images/product-messenger.png", "/images/hero-1.png"],
    variants: [
      { id: "var_04a", color: "Olive Green", hex: "#4A5240", price: 22500, inStock: true },
      { id: "var_04b", color: "Stone",       hex: "#8B7355", price: 22500, inStock: true },
    ],
    description:
      "The Canvas Messenger Bag is the everyday carry for the modern urbanite. Adjustable leather strap, full-length flap closure, and a 15\" laptop pocket — everything you need, nothing you don't.",
    materials: ["Body: Waxed canvas", "Strap + trim: Leather", "Hardware: Brass"],
    dimensions: ["Width: 38cm", "Height: 28cm", "Depth: 10cm"],
    care: "Spot clean with damp cloth.",
  },
  {
    id: "prod_05",
    handle: "premium-leather-briefcase",
    name: "Premium Leather Briefcase",
    category: "Briefcases",
    categoryHandle: "briefcases",
    price: 54900,
    badge: "Best Seller",
    image: "/images/product-briefcase.png",
    images: ["/images/product-briefcase.png", "/images/heritage-3.png"],
    variants: [
      { id: "var_05a", color: "Cognac", hex: "#8B4513", price: 54900, inStock: true },
      { id: "var_05b", color: "Black",  hex: "#1A1A1A", price: 54900, inStock: true },
    ],
    description:
      "Crafted from the finest full-grain leather, the Premium Leather Briefcase is a statement piece for the discerning professional. Two main compartments accommodate a 15\" laptop alongside your documents and daily essentials.",
    materials: ["Full-grain vegetable-tanned leather", "Solid brass hardware", "Cotton canvas lining"],
    dimensions: ["Width: 40cm", "Height: 30cm", "Depth: 12cm", "Weight: 1.4kg"],
    care: "Condition leather monthly with quality leather balm.",
  },
  {
    id: "prod_06",
    handle: "canvas-washbag",
    name: "Canvas Washbag",
    category: "Washbags",
    categoryHandle: "washbags",
    price: 9900,
    image: "/images/product-washbag.png",
    images: ["/images/product-washbag.png"],
    variants: [
      { id: "var_06a", color: "Khaki",       hex: "#B5A585", price: 9900, inStock: true },
      { id: "var_06b", color: "Olive Green", hex: "#4A5240", price: 9900, inStock: true },
    ],
    description:
      "The Canvas Washbag keeps your travel toiletries beautifully organised. Compact enough for your gym bag, roomy enough for a weekend trip.",
    materials: ["Waxed canvas exterior", "PVC-lined interior", "Leather zip pull"],
    dimensions: ["Length: 25cm", "Height: 15cm", "Depth: 11cm"],
    care: "Wipe interior clean with damp cloth.",
  },
  {
    id: "prod_07",
    handle: "leather-clutch-purse",
    name: "Leather Clutch Purse",
    category: "Clutches",
    categoryHandle: "clutches",
    price: 14500,
    image: "/images/product-clutch.png",
    images: ["/images/product-clutch.png"],
    variants: [
      { id: "var_07a", color: "Tan",   hex: "#C5924A", price: 14500, inStock: true },
      { id: "var_07b", color: "Black", hex: "#1A1A1A", price: 14500, inStock: true },
    ],
    description:
      "Timeless and versatile, the Leather Clutch Purse is made from buttery-soft full-grain leather. Sized to carry just the essentials — cards, phone, keys, and lipstick.",
    materials: ["Full-grain leather", "Suede interior", "Magnetic clasp"],
    dimensions: ["Width: 24cm", "Height: 14cm", "Depth: 3cm"],
    care: "Keep away from moisture. Condition occasionally.",
  },
  {
    id: "prod_08",
    handle: "slim-leather-wallet",
    name: "Slim Leather Wallet",
    category: "Wallets",
    categoryHandle: "wallets",
    price: 6900,
    image: "/images/category-wallets.png",
    images: ["/images/category-wallets.png"],
    variants: [
      { id: "var_08a", color: "Cognac",     hex: "#8B4513", price: 6900, inStock: true },
      { id: "var_08b", color: "Dark Brown", hex: "#3D2B1F", price: 6900, inStock: true },
    ],
    description:
      "Hand-crafted in full-grain leather, this slim billfold wallet holds up to 8 cards plus notes. Designed to slip seamlessly into any pocket.",
    materials: ["Full-grain vegetable-tanned leather", "Cotton stitching"],
    dimensions: ["Width: 10cm", "Height: 8.5cm", "Holds: 8 cards + notes"],
    care: "Condition with leather balm once a month.",
  },
];

export const CATEGORIES = [
  { name: "Totes",       handle: "totes",      image: "/images/category-totes.png" },
  { name: "Backpacks",   handle: "backpacks",   image: "/images/category-backpacks.png" },
  { name: "Duffles",     handle: "duffles",     image: "/images/category-duffles.png" },
  { name: "Wallets",     handle: "wallets",     image: "/images/category-wallets.png" },
  { name: "Messengers",  handle: "messengers",  image: "/images/product-messenger.png" },
  { name: "Briefcases",  handle: "briefcases",  image: "/images/product-briefcase.png" },
  { name: "Washbags",    handle: "washbags",    image: "/images/product-washbag.png" },
  { name: "Clutches",    handle: "clutches",    image: "/images/product-clutch.png" },
];

export const NAV_CATEGORIES = [
  "All Products", "Totes", "Backpacks", "Laptop Bags",
  "Messengers", "Briefcases", "Duffles", "Weekenders",
  "Washbags", "Top Handles", "Clutches", "Wallets",
];

export function getProductByHandle(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}

export function getProductsByCategory(categoryHandle: string): Product[] {
  if (!categoryHandle || categoryHandle === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.categoryHandle === categoryHandle);
}

export function formatPrice(amount: number, currency = "KSh"): string {
  return `${currency} ${amount.toLocaleString("en-KE")}`;
}
