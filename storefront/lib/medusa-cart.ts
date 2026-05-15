/**
 * Medusa Store API — Cart & Checkout functions
 * All functions run server-side or from client components (fetch with credentials).
 */

const BASE = typeof window === "undefined"
  ? (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000")
  : (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000");

const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

function headers(extra: Record<string, string> = {}): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-publishable-api-key": KEY,
    ...extra,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MedusaShippingOption {
  id: string;
  name: string;
  amount: number;
  provider_id?: string;
}

export interface MedusaLineItem {
  id: string;
  variant_id: string;
  product_title: string;
  variant_title: string;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface MedusaCart {
  id: string;
  email: string | null;
  items: MedusaLineItem[];
  shipping_address: Record<string, string> | null;
  shipping_methods: { shipping_option_id: string; name: string; amount: number }[];
  subtotal: number;
  shipping_total: number;
  total: number;
  region_id: string;
}

export interface MedusaOrder {
  id: string;
  display_id: number;
  status: string;
  email: string;
  total: number;
  items: MedusaLineItem[];
}

// ── Cart ──────────────────────────────────────────────────────────────────────

/** Create a fresh Medusa cart, always scoped to the Sandstorm sales channel */
export async function createCart(regionId?: string): Promise<MedusaCart | null> {
  const salesChannelId = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID;
  try {
    const body: Record<string, string | undefined> = {};
    if (regionId) body.region_id = regionId;
    if (salesChannelId) body.sales_channel_id = salesChannelId;

    const res = await fetch(`${BASE}/store/carts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[medusa] createCart failed", res.status, text);
      return null;
    }
    const json = await res.json();
    return json.cart as MedusaCart;
  } catch (e) { console.error("[medusa] createCart error", e); return null; }
}

/** Add a line item to the Medusa cart */
export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<MedusaCart | null> {
  try {
    const res = await fetch(`${BASE}/store/carts/${cartId}/line-items`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.cart as MedusaCart;
  } catch { return null; }
}

/** Update a line item quantity (set to 0 to remove) */
export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<MedusaCart | null> {
  try {
    const res = await fetch(`${BASE}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.cart as MedusaCart;
  } catch { return null; }
}

/** Delete a line item from the cart */
export async function deleteLineItem(
  cartId: string,
  lineItemId: string
): Promise<MedusaCart | null> {
  try {
    const res = await fetch(`${BASE}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.cart as MedusaCart;
  } catch { return null; }
}

/** Update cart with customer contact + shipping address */
export async function updateCart(
  cartId: string,
  data: {
    email?: string;
    shipping_address?: {
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      country_code: string;
      phone?: string;
    };
  }
): Promise<MedusaCart | null> {
  try {
    const res = await fetch(`${BASE}/store/carts/${cartId}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) { console.error("[medusa] updateCart failed", res.status, await res.text()); return null; }
    const json = await res.json();
    return json.cart as MedusaCart;
  } catch (e) { console.error("[medusa] updateCart error", e); return null; }
}

/** Fetch available shipping options for a cart */
export async function getShippingOptions(cartId: string): Promise<MedusaShippingOption[]> {
  try {
    const res = await fetch(`${BASE}/store/shipping-options?cart_id=${cartId}`, {
      headers: headers(),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.shipping_options ?? []) as MedusaShippingOption[];
  } catch { return []; }
}

/** Add a shipping method to the cart */
export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<MedusaCart | null> {
  try {
    const res = await fetch(`${BASE}/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ option_id: optionId }),
    });
    if (!res.ok) { console.error("[medusa] addShippingMethod failed", res.status, await res.text()); return null; }
    const json = await res.json();
    return json.cart as MedusaCart;
  } catch (e) { console.error("[medusa] addShippingMethod error", e); return null; }
}

/**
 * Medusa v2 payment flow:
 * 1. Create a payment collection for the cart
 * 2. Init a payment session on that collection with provider_id: "pp_system_default"
 * Returns true on success.
 */
export async function initPaymentSession(cartId: string): Promise<boolean> {
  try {
    // Step 1: Create payment collection
    const colRes = await fetch(`${BASE}/store/payment-collections`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ cart_id: cartId }),
    });
    if (!colRes.ok) {
      console.error("[medusa] create payment-collection failed", colRes.status, await colRes.text());
      return false;
    }
    const colJson = await colRes.json();
    const payColId: string = colJson.payment_collection?.id;
    if (!payColId) return false;

    // Step 2: Init payment session with manual/system provider
    const sesRes = await fetch(`${BASE}/store/payment-collections/${payColId}/payment-sessions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ provider_id: "pp_system_default" }),
    });
    if (!sesRes.ok) {
      console.error("[medusa] init payment-session failed", sesRes.status, await sesRes.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[medusa] initPaymentSession error", e);
    return false;
  }
}

/** Complete the cart → creates an order */
export async function completeCart(cartId: string): Promise<{ type: "order" | "cart"; order?: MedusaOrder } | null> {
  try {
    const res = await fetch(`${BASE}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers: headers(),
    });
    if (!res.ok) { console.error("[medusa] completeCart failed", res.status, await res.text()); return null; }
    const json = await res.json();
    return json as { type: "order" | "cart"; order?: MedusaOrder };
  } catch (e) { console.error("[medusa] completeCart error", e); return null; }
}

/** Fetch a region by country code; returns first matching region */
export async function getRegionByCountry(countryCode: string): Promise<{ id: string } | null> {
  try {
    const res = await fetch(`${BASE}/store/regions?fields=id,countries`, {
      headers: headers(),
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const regions: any[] = json.regions ?? [];
    const match = regions.find((r) =>
      r.countries?.some((c: any) => c.iso_2 === countryCode || c.iso_2 === countryCode.toLowerCase())
    );
    return match ? { id: match.id } : (regions[0] ? { id: regions[0].id } : null);
  } catch { return null; }
}
