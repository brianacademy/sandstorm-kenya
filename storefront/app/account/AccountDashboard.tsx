"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  loadToken,
  clearToken,
  getMe,
  updateMe,
  getMyOrders,
  addAddress,
  deleteAddress,
  Customer,
  CustomerOrder,
  CustomerAddress,
} from "@/lib/customer";
import { formatMedusaPrice } from "@/lib/medusa-store";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? "pending";
  const cls = `badge badge--${s}`;
  const label = s.replace(/_/g, " ");
  return <span className={cls}>{label}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

type Tab = "orders" | "profile" | "addresses";

function Sidebar({
  customer,
  tab,
  onTab,
  onLogout,
}: {
  customer: Customer;
  tab: Tab;
  onTab: (t: Tab) => void;
  onLogout: () => void;
}) {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "orders",
      label: "My Orders",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    },
  ];

  return (
    <nav className="account-sidebar" aria-label="Account navigation">
      <p className="account-sidebar__greeting">Welcome back,</p>
      <p className="account-sidebar__name">
        {customer.first_name} {customer.last_name}
      </p>
      <div className="account-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`account-nav__item${tab === item.id ? " active" : ""}`}
            onClick={() => onTab(item.id)}
            aria-current={tab === item.id ? "page" : undefined}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "12px 0" }} />
        <Link href="/shop" className="account-nav__item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
          Continue Shopping
        </Link>
        <button className="account-nav__item danger" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

// ── Orders tab ────────────────────────────────────────────────────────────────

function OrdersTab({ orders, loading }: { orders: CustomerOrder[]; loading: boolean }) {
  if (loading) return <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Loading orders…</p>;

  if (orders.length === 0) {
    return (
      <div className="account-empty">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>You haven't placed any orders yet.</p>
        <Link href="/shop" className="btn btn-filled">BROWSE COLLECTION</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="account-section-title">Your Orders ({orders.length})</div>
      <div className="order-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <span className="order-card__id">Order #{order.display_id}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="order-card__meta">
                <span>{formatDate(order.created_at)}</span>
                <span>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}</span>
              </div>
              {order.items && order.items.length > 0 && (
                <div className="order-items-preview">
                  {order.items.slice(0, 5).map(item => (
                    item.thumbnail
                      ? <Image key={item.id} src={item.thumbnail} alt={item.product_title} width={56} height={56} className="order-item-thumb" />
                      : <div key={item.id} className="order-item-placeholder" title={item.product_title} />
                  ))}
                  {order.items.length > 5 && (
                    <div className="order-item-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--color-muted)", background: "var(--color-warm-gray)" }}>
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="order-card__total">
              {formatMedusaPrice(order.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────────

function ProfileTab({ customer, token, onUpdated }: { customer: Customer; token: string; onUpdated: (c: Customer) => void }) {
  const [firstName, setFirstName] = useState(customer.first_name ?? "");
  const [lastName,  setLastName]  = useState(customer.last_name ?? "");
  const [phone,     setPhone]     = useState(customer.phone ?? "");
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateMe(token, { first_name: firstName, last_name: lastName, phone });
      if (!updated) { setError("Could not save profile. Please try again."); return; }
      onUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="account-section-title">Profile Details</div>
      <div className="account-card">
        {success && (
          <div className="auth-success" role="status">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Profile updated successfully.
          </div>
        )}
        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSave} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile-first">First Name</label>
              <input id="profile-first" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="profile-last">Last Name</label>
              <input id="profile-last" type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={customer.email} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
          </div>
          <div className="form-group">
            <label htmlFor="profile-phone">Phone Number</label>
            <input id="profile-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" />
          </div>
          <button id="save-profile-btn" type="submit" className="btn btn-filled" disabled={saving} style={{ marginTop: 4 }}>
            {saving ? "SAVING…" : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Addresses tab ─────────────────────────────────────────────────────────────

function AddressesTab({ customer, token, onUpdated }: { customer: Customer; token: string; onUpdated: (c: Customer) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", address_1: "", city: "Nairobi", country_code: "ke", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.address_1 || !form.city) {
      setError("Please fill in all required fields."); return;
    }
    setSaving(true);
    setError(null);
    try {
      await addAddress(token, { ...form, phone: form.phone || undefined });
      const updated = await getMe(token);
      if (updated) onUpdated(updated);
      setShowForm(false);
      setForm({ first_name: "", last_name: "", address_1: "", city: "Nairobi", country_code: "ke", phone: "" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Remove this address?")) return;
    await deleteAddress(token, addressId);
    const updated = await getMe(token);
    if (updated) onUpdated(updated);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="account-section-title" style={{ marginBottom: 0, borderBottom: "none" }}>Saved Addresses</div>
        <button className="btn btn-outline" style={{ fontSize: 12, padding: "8px 16px" }} onClick={() => { setShowForm(f => !f); setError(null); }}>
          {showForm ? "CANCEL" : "+ ADD ADDRESS"}
        </button>
      </div>
      <div style={{ borderBottom: "1px solid var(--color-border)", marginBottom: 20 }} />

      {/* Add form */}
      {showForm && (
        <div className="account-card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 16 }}>New Address</div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleAddAddress} noValidate>
            <div className="form-row">
              <div className="form-group"><label>First Name *</label><input type="text" value={form.first_name} onChange={set("first_name")} required /></div>
              <div className="form-group"><label>Last Name *</label><input type="text" value={form.last_name} onChange={set("last_name")} required /></div>
            </div>
            <div className="form-group"><label>Street Address *</label><input type="text" value={form.address_1} onChange={set("address_1")} placeholder="45 Kimathi Street" required /></div>
            <div className="form-row">
              <div className="form-group"><label>City *</label><input type="text" value={form.city} onChange={set("city")} required /></div>
              <div className="form-group">
                <label>Country</label>
                <select value={form.country_code} onChange={set("country_code")}>
                  <option value="ke">Kenya</option>
                  <option value="ug">Uganda</option>
                  <option value="tz">Tanzania</option>
                  <option value="gb">United Kingdom</option>
                  <option value="us">United States</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+254 700 000 000" /></div>
            <button type="submit" className="btn btn-filled" disabled={saving}>{saving ? "SAVING…" : "SAVE ADDRESS"}</button>
          </form>
        </div>
      )}

      {/* Address list */}
      {customer.addresses.length === 0 && !showForm ? (
        <div className="account-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <p>No saved addresses yet.</p>
        </div>
      ) : (
        <div className="address-grid">
          {customer.addresses.map(addr => (
            <div key={addr.id} className="address-card">
              <div className="address-card__actions">
                <button className="address-card__btn address-card__btn--delete" onClick={() => handleDelete(addr.id)}>Remove</button>
              </div>
              <p className="address-card__name">{addr.first_name} {addr.last_name}</p>
              <p className="address-card__line">{addr.address_1}</p>
              <p className="address-card__line">{addr.city}, {addr.country_code?.toUpperCase()}</p>
              {addr.phone && <p className="address-card__line">{addr.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function AccountDashboard() {
  const router = useRouter();
  const [tab,      setTab]      = useState<Tab>("orders");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders,   setOrders]   = useState<CustomerOrder[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [token,    setToken]    = useState<string | null>(null);

  const load = useCallback(async (t: string) => {
    const [me, myOrders] = await Promise.all([getMe(t), getMyOrders(t)]);
    if (!me) {
      clearToken();
      router.push("/account/login");
      return;
    }
    setCustomer(me);
    setOrders(myOrders);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const t = loadToken();
    if (!t) { router.push("/account/login"); return; }
    setToken(t);
    load(t);
  }, [load, router]);

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  if (loading || !customer || !token) {
    return (
      <div className="account-page">
        <div className="container">
          <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Loading your account…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <Sidebar
            customer={customer}
            tab={tab}
            onTab={setTab}
            onLogout={handleLogout}
          />
          <main className="account-main" aria-label="Account content">
            {tab === "orders" && (
              <OrdersTab orders={orders} loading={false} />
            )}
            {tab === "profile" && (
              <ProfileTab
                customer={customer}
                token={token}
                onUpdated={updated => setCustomer(updated)}
              />
            )}
            {tab === "addresses" && (
              <AddressesTab
                customer={customer}
                token={token}
                onUpdated={updated => setCustomer(updated)}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
