/**
 * Medusa customer auth & account API functions.
 * All API calls use JWT stored in localStorage (client-side) or passed as prop (server-side).
 */

const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const KEY  = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

const STORAGE_KEY = "sandstorm_customer_token";

// ── Token helpers (client-side only) ─────────────────────────────────────────

export function saveToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, token);
}

export function loadToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CustomerAddress {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  country_code: string;
  phone: string | null;
  is_default_shipping: boolean;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  has_account: boolean;
  addresses: CustomerAddress[];
}

export interface CustomerOrder {
  id: string;
  display_id: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  total: number;
  subtotal: number;
  created_at: string;
  items: {
    id: string;
    product_title: string;
    variant_title: string;
    thumbnail: string | null;
    quantity: number;
    unit_price: number;
  }[];
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/** Register a new customer auth identity. Returns a short-lived token. */
export async function registerCustomer(
  email: string,
  password: string
): Promise<{ token: string } | { error: string }> {
  try {
    const res = await fetch(`${BASE}/auth/customer/emailpass/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.message ?? "Registration failed. Please try again." };
    return { token: json.token };
  } catch {
    return { error: "Network error. Please check your connection." };
  }
}

/** Login — returns JWT token. */
export async function loginCustomer(
  email: string,
  password: string
): Promise<{ token: string } | { error: string }> {
  try {
    const res = await fetch(`${BASE}/auth/customer/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { error: "Invalid email or password. Please try again." };
    if (!json.token) return { error: "Invalid email or password. Please try again." };
    return { token: json.token };
  } catch {
    return { error: "Network error. Please check your connection." };
  }
}

/** Create the customer profile (required after first registration). */
export async function createCustomerProfile(
  token: string,
  data: { email: string; first_name: string; last_name: string; phone?: string }
): Promise<Customer | null> {
  try {
    const res = await fetch(`${BASE}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-publishable-api-key": KEY,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.customer as Customer;
  } catch { return null; }
}

// ── Customer ──────────────────────────────────────────────────────────────────

function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "x-publishable-api-key": KEY,
  };
}

/** Fetch the logged-in customer's profile. */
export async function getMe(token: string): Promise<Customer | null> {
  try {
    const res = await fetch(`${BASE}/store/customers/me`, {
      headers: authHeaders(token),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.customer as Customer;
  } catch { return null; }
}

/** Update customer profile fields. */
export async function updateMe(
  token: string,
  data: { first_name?: string; last_name?: string; phone?: string }
): Promise<Customer | null> {
  try {
    const res = await fetch(`${BASE}/store/customers/me`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.customer as Customer;
  } catch { return null; }
}

/** Fetch this customer's orders. */
export async function getMyOrders(token: string): Promise<CustomerOrder[]> {
  try {
    const res = await fetch(
      `${BASE}/store/orders?fields=id,display_id,status,payment_status,fulfillment_status,total,subtotal,created_at,*items`,
      { headers: authHeaders(token), cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.orders ?? []) as CustomerOrder[];
  } catch { return []; }
}

/** Add a shipping address to the customer. */
export async function addAddress(
  token: string,
  address: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    country_code: string;
    phone?: string;
  }
): Promise<CustomerAddress | null> {
  try {
    const res = await fetch(`${BASE}/store/customers/me/addresses`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(address),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.address as CustomerAddress;
  } catch { return null; }
}

/** Delete a shipping address. */
export async function deleteAddress(token: string, addressId: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/store/customers/me/addresses/${addressId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    return res.ok;
  } catch { return false; }
}
