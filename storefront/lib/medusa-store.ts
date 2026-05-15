/**
 * Server-side Medusa Store API fetch utilities
 * Used in React Server Components — never runs in the browser.
 */

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const KEY  = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

const headers: HeadersInit = {
  "x-publishable-api-key": KEY,
  "Content-Type": "application/json",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MedusaPrice {
  id: string;
  amount: number;
  currency_code: string;
}

export interface MedusaVariant {
  id: string;
  title: string;
  prices: MedusaPrice[];
  options?: { value: string; option?: { title: string } }[];
}

export interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  subtitle: string | null;
  description: string | null;
  thumbnail: string | null;
  updated_at?: string;
  images: { url: string }[];
  variants: (MedusaVariant & { calculated_price?: { calculated_amount: number; currency_code: string } | null })[];
  categories?: { name: string; handle: string }[];
}

export interface MedusaCategory {
  id: string;
  name: string;
  handle: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return the KES amount (or first currency) for a variant or product's first variant, in cents */
export function medusaPrice(productOrVariant: MedusaProduct | MedusaVariant): number {
  // If it's a product, use first variant
  const variant = "variants" in productOrVariant
    ? (productOrVariant as MedusaProduct).variants?.[0]
    : productOrVariant as MedusaVariant;
  if (!variant) return 0;
  // Prefer calculated_price (store API pricing context)
  const calc = (variant as { calculated_price?: { calculated_amount: number } | null }).calculated_price;
  if (calc?.calculated_amount) return calc.calculated_amount;
  // Fall back to raw prices array
  if (!variant.prices?.length) return 0;
  const kes = variant.prices.find((p) => p.currency_code === "kes");
  return kes?.amount ?? variant.prices[0]?.amount ?? 0;
}

/** Format an integer amount (e.g. 1890000) as "KSh 18,900" */
export function formatMedusaPrice(amount: number): string {
  if (!amount) return "KSh 0";
  // Medusa stores amounts in minor units *100 (e.g. 1890000 = KSh 18,900)
  const value = amount / 100;
  return `KSh ${value.toLocaleString("en-KE")}`;
}

// ── Shared fields to include in all product queries ────────────────────────────
// Using * prefix forces Medusa v2 to eager-load the relation
const PRODUCT_FIELDS = [
  "id",
  "title",
  "handle",
  "subtitle",
  "description",
  "thumbnail",
  "*images",
  "+variants.id",
  "+variants.title",
  "*variants.prices",
  "*categories",
].join(",");

// ── Fetch functions (Server Component safe) ───────────────────────────────────

/** List published products with optional category filter and text search */
export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  q?: string;
}): Promise<MedusaProduct[]> {
  const query = new URLSearchParams({
    limit: String(params?.limit ?? 100),
    offset: String(params?.offset ?? 0),
    fields: PRODUCT_FIELDS,
  });

  if (params?.category_id?.length) {
    params.category_id.forEach((id) => query.append("category_id[]", id));
  }
  if (params?.q) {
    query.set("q", params.q);
  }

  try {
    const res = await fetch(`${BASE}/store/products?${query}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error("[medusa] products fetch failed:", res.status);
      return [];
    }
    const json = await res.json();
    return (json.products ?? []) as MedusaProduct[];
  } catch (err) {
    console.error("[medusa] products fetch error:", err);
    return [];
  }
}

/** Look up a category by handle, returns the category or null */
export async function getCategoryByHandle(
  handle: string
): Promise<MedusaCategory | null> {
  try {
    const res = await fetch(
      `${BASE}/store/product-categories?handle=${encodeURIComponent(handle)}&fields=id,name,handle`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json.product_categories?.[0] ?? null) as MedusaCategory | null;
  } catch {
    return null;
  }
}

/** Get a single product by handle */
export async function getProductByHandle(
  handle: string
): Promise<MedusaProduct | null> {
  const query = new URLSearchParams({ handle, fields: PRODUCT_FIELDS });
  try {
    const res = await fetch(`${BASE}/store/products?${query}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.products?.[0] ?? null) as MedusaProduct | null;
  } catch {
    return null;
  }
}

/** List all product categories (store API does not filter by is_active) */
export async function getCategories(): Promise<MedusaCategory[]> {
  try {
    const res = await fetch(
      `${BASE}/store/product-categories?limit=50&fields=id,name,handle`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.product_categories ?? []) as MedusaCategory[];
  } catch {
    return [];
  }
}
