"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart";
import { formatMedusaPrice } from "@/lib/medusa-store";
import { loadToken, getMe } from "@/lib/customer";
import {
  createCart,
  updateCart,
  getShippingOptions,
  addShippingMethod,
  initPaymentSession,
  completeCart,
  getRegionByCountry,
  MedusaShippingOption,
} from "@/lib/medusa-cart";

// ── Step indicator ──────────────────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Contact & Shipping" },
    { n: 2, label: "Delivery" },
    { n: 3, label: "Review & Pay" },
  ] as const;

  return (
    <div className="checkout-steps" role="list" aria-label="Checkout progress">
      {steps.map((s, i) => {
        const state =
          current === s.n ? "active" : current > s.n ? "done" : "";
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
            <div className={`checkout-step ${state}`} role="listitem">
              <span className="checkout-step__num">
                {state === "done" ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.n}
              </span>
              <span className="checkout-step__label">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="checkout-step__divider" />}
          </div>
        );
      })}
    </div>
  );
}

// ── Order summary sidebar ───────────────────────────────────────────────────

function OrderSummary({ shippingCost }: { shippingCost: number }) {
  const { items, subtotal } = useCartStore();
  const sub = subtotal();
  const total = sub + shippingCost;

  return (
    <aside className="checkout-summary" aria-label="Order summary">
      <div className="checkout-summary__title">Order Summary</div>

      <div className="checkout-items">
        {items.map((item) => (
          <div key={item.id} className="checkout-item">
            <div className="checkout-item__img-wrap">
              {item.image ? (
                <Image src={item.image} alt={item.name} width={64} height={64} style={{ objectFit: "cover", borderRadius: 2 }} />
              ) : (
                <div className="checkout-item__img-placeholder" />
              )}
              <span className="checkout-item__qty">{item.quantity}</span>
            </div>
            <div className="checkout-item__info">
              <div className="checkout-item__name">{item.name}</div>
              <div className="checkout-item__variant">{item.color}</div>
            </div>
            <div className="checkout-item__price">
              {formatMedusaPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-totals">
        <div className="checkout-totals__row">
          <span>Subtotal</span>
          <span>{formatMedusaPrice(sub)}</span>
        </div>
        <div className="checkout-totals__row">
          <span>Shipping</span>
          <span style={{ color: shippingCost === 0 ? "var(--color-olive)" : "inherit", fontWeight: shippingCost === 0 ? 500 : 400 }}>
            {shippingCost === 0 ? "Free" : formatMedusaPrice(shippingCost)}
          </span>
        </div>
        <div className="checkout-totals__row checkout-totals__row--total">
          <span>Total (KES)</span>
          <span>{formatMedusaPrice(total)}</span>
        </div>
      </div>

      <div className="checkout-trust">
        {[
          "Free delivery within Kenya",
          "Guaranteed for life",
          "30-day returns",
        ].map((t) => (
          <div key={t} className="checkout-trust__item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t}
          </div>
        ))}
      </div>
    </aside>
  );
}

// ── Contact form data ────────────────────────────────────────────────────────

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  country: string;
}

// ── Step 1: Contact & Shipping address ─────────────────────────────────────

function ContactStep({
  data,
  onNext,
  loading,
  error,
}: {
  data: ContactData;
  onNext: (d: ContactData) => void;
  loading: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<ContactData>(data);

  const set = (k: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <div className="checkout-section-title">Contact Information</div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" value={form.firstName} onChange={set("firstName")} placeholder="Jane" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" value={form.lastName} onChange={set("lastName")} placeholder="Doe" required />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" required />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number (M-Pesa)</label>
        <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+254 700 000 000" />
      </div>

      <div className="checkout-section-title" style={{ marginTop: 24 }}>Delivery Address</div>

      <div className="form-group">
        <label htmlFor="address1">Street Address</label>
        <input id="address1" type="text" value={form.address1} onChange={set("address1")} placeholder="123 Moi Avenue" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City / Town</label>
          <input id="city" type="text" value={form.city} onChange={set("city")} placeholder="Nairobi" required />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select id="country" value={form.country} onChange={set("country")} required>
            <option value="ke">Kenya</option>
            <option value="ug">Uganda</option>
            <option value="tz">Tanzania</option>
            <option value="za">South Africa</option>
            <option value="gb">United Kingdom</option>
            <option value="us">United States</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="checkout-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        id="continue-to-delivery-btn"
        className="btn btn-filled btn-full"
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? "SAVING…" : "CONTINUE TO DELIVERY →"}
      </button>
    </form>
  );
}

// ── Step 2: Shipping method ─────────────────────────────────────────────────

function DeliveryStep({
  options,
  selectedId,
  onSelect,
  onNext,
  onBack,
  loading,
  error,
}: {
  options: MedusaShippingOption[];
  selectedId: string | null;
  onSelect: (id: string, amount: number) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div>
      <div className="checkout-back-row">
        <button className="checkout-back" onClick={onBack}>← Back</button>
      </div>

      <div className="checkout-section-title">Choose Delivery Method</div>

      {options.length === 0 ? (
        <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Loading delivery options…</p>
      ) : (
        <div className="shipping-options">
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`shipping-option${selectedId === opt.id ? " selected" : ""}`}
              htmlFor={`ship-${opt.id}`}
            >
              <input
                type="radio"
                id={`ship-${opt.id}`}
                name="shipping"
                value={opt.id}
                checked={selectedId === opt.id}
                onChange={() => onSelect(opt.id, opt.amount)}
              />
              <div className="shipping-option__info">
                <span className="shipping-option__name">{opt.name}</span>
                <span className="shipping-option__desc">
                  {opt.name.toLowerCase().includes("kenya") ? "3–5 business days" : "7–14 business days"}
                </span>
              </div>
              <span className="shipping-option__price">
                {opt.amount === 0 ? "Free" : formatMedusaPrice(opt.amount)}
              </span>
            </label>
          ))}
        </div>
      )}

      {error && (
        <div className="checkout-error" role="alert" style={{ marginTop: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /></svg>
          {error}
        </div>
      )}

      <button
        id="continue-to-review-btn"
        className="btn btn-filled btn-full"
        style={{ marginTop: 24 }}
        onClick={onNext}
        disabled={!selectedId || loading}
      >
        {loading ? "SAVING…" : "CONTINUE TO REVIEW →"}
      </button>
    </div>
  );
}

// ── Step 3: Review & Place order ────────────────────────────────────────────

function ReviewStep({
  contact,
  shippingName,
  shippingCost,
  onBack,
  onEdit,
  onPlace,
  loading,
  error,
}: {
  contact: ContactData;
  shippingName: string;
  shippingCost: number;
  onBack: () => void;
  onEdit: (step: 1 | 2) => void;
  onPlace: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div>
      <div className="checkout-back-row">
        <button className="checkout-back" onClick={onBack}>← Back</button>
      </div>

      <div className="checkout-section-title">Review Your Order</div>

      {/* Address recap */}
      <div className="review-block">
        <div className="review-block__header">
          <span>Contact & Address</span>
          <button className="review-block__edit" onClick={() => onEdit(1)}>Edit</button>
        </div>
        <div className="review-block__value">
          {contact.firstName} {contact.lastName} · {contact.email}
          <br />
          {contact.address1}, {contact.city}, {contact.country.toUpperCase()}
          {contact.phone && <><br />{contact.phone}</>}
        </div>
      </div>

      {/* Shipping recap */}
      <div className="review-block">
        <div className="review-block__header">
          <span>Delivery Method</span>
          <button className="review-block__edit" onClick={() => onEdit(2)}>Edit</button>
        </div>
        <div className="review-block__value">
          {shippingName} — {shippingCost === 0 ? "Free" : formatMedusaPrice(shippingCost)}
        </div>
      </div>

      {/* Payment notice */}
      <div className="checkout-payment-notice">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-tan)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        <div>
          <div className="checkout-payment-notice__title">Pay on Delivery / Bank Transfer</div>
          <div className="checkout-payment-notice__sub">
            Place your order now. Our team will contact you with M-Pesa payment details
            within 24 hours. Orders ship once payment is confirmed.
          </div>
        </div>
      </div>

      {error && (
        <div className="checkout-error" role="alert" style={{ marginTop: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
          {error}
        </div>
      )}

      <button
        id="place-order-btn"
        className="btn btn-filled btn-full"
        style={{ marginTop: 24, padding: 18 }}
        onClick={onPlace}
        disabled={loading}
      >
        {loading ? "PLACING ORDER…" : "PLACE ORDER"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--color-muted)", marginTop: 12 }}>
        By placing your order you agree to our{" "}
        <Link href="/about" style={{ color: "var(--color-tan)" }}>Terms & Conditions</Link>.
      </p>
    </div>
  );
}

// ── Main Checkout component ─────────────────────────────────────────────────

export default function CheckoutClient() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [medusaCartId, setMedusaCartId] = useState<string | null>(null);
  const [contact, setContact]         = useState<ContactData>({
    firstName: "", lastName: "", email: "", phone: "",
    address1: "", city: "Nairobi", country: "ke",
  });
  const [shippingOptions, setShippingOptions]   = useState<MedusaShippingOption[]>([]);
  const [selectedShipId, setSelectedShipId]     = useState<string | null>(null);
  const [selectedShipAmount, setSelectedShipAmount] = useState(0);
  const [selectedShipName, setSelectedShipName] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  // Prevents empty-cart guard from firing during post-order redirect
  const orderPlaced = useRef(false);

  // Redirect if cart is empty (but not if we just placed an order)
  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) router.push("/cart");
  }, [items.length, router]);

  // Pre-fill contact form if customer is logged in
  useEffect(() => {
    const token = loadToken();
    if (!token) return;
    setCustomerToken(token);
    getMe(token).then(me => {
      if (!me) return;
      setContact(prev => ({
        ...prev,
        firstName: prev.firstName || (me.first_name ?? ""),
        lastName:  prev.lastName  || (me.last_name  ?? ""),
        email:     prev.email     || me.email,
        phone:     prev.phone     || (me.phone ?? ""),
      }));
    }).catch(() => {});
  }, []);

  /** Create Medusa cart and add all Zustand items to it */
  const initMedusaCart = useCallback(async () => {
    if (medusaCartId) return medusaCartId;

    setLoading(true);
    try {
      // Get Kenya region
      const region = await getRegionByCountry("ke");

      // Create cart
      const cart = await createCart(region?.id);
      if (!cart) throw new Error("Could not create cart. Please try again.");

      // Add each item as a line item (pass customer JWT if logged in, linking the order)
      const lineItemHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      };
      if (customerToken) lineItemHeaders["Authorization"] = `Bearer ${customerToken}`;

      for (const item of items) {
        await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/store/carts/${cart.id}/line-items`,
          {
            method: "POST",
            headers: lineItemHeaders,
            body: JSON.stringify({ variant_id: item.variantId, quantity: item.quantity }),
          }
        );
      }

      setMedusaCartId(cart.id);
      return cart.id;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [medusaCartId, items]);

  // ── Step 1 → 2 ──────────────────────────────────────────────────────────

  const handleContactNext = async (data: ContactData) => {
    setContact(data);
    setError(null);
    setLoading(true);

    try {
      let cartId = medusaCartId ?? await initMedusaCart();
      if (!cartId) return;

      const updated = await updateCart(cartId, {
        email: data.email,
        shipping_address: {
          first_name: data.firstName,
          last_name: data.lastName,
          address_1: data.address1,
          city: data.city,
          country_code: data.country,
          phone: data.phone,
        },
      });
      if (!updated) throw new Error("Could not save your address. Please check all fields.");

      // Fetch shipping options for this cart
      const opts = await getShippingOptions(cartId);
      setShippingOptions(opts);
      if (opts.length > 0) {
        setSelectedShipId(opts[0].id);
        setSelectedShipAmount(opts[0].amount);
        setSelectedShipName(opts[0].name);
      }
      setStep(2);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 → 3 ──────────────────────────────────────────────────────────

  const handleDeliveryNext = async () => {
    if (!selectedShipId || !medusaCartId) return;
    setError(null);
    setLoading(true);
    try {
      const updated = await addShippingMethod(medusaCartId, selectedShipId);
      if (!updated) throw new Error("Could not set delivery method. Please try again.");
      setStep(3);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Place order ──────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!medusaCartId) return;
    setError(null);
    setLoading(true);
    try {
      // Initialize payment session with manual provider (Medusa v2 two-step flow)
      const payOk = await initPaymentSession(medusaCartId);
      if (!payOk) throw new Error("Could not initialize payment. Please try again.");

      const result = await completeCart(medusaCartId);
      if (!result || result.type !== "order" || !result.order) {
        throw new Error("Order could not be placed. Please contact us at customercare@sandstormkenya.com");
      }

      // Mark order placed BEFORE clearCart so the useEffect guard doesn't redirect to /cart
      orderPlaced.current = true;
      const orderId = result.order.id;
      const displayId = result.order.display_id;
      clearCart();
      router.push(`/order/confirmed?id=${orderId}&display=${displayId}`);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  // ── Guard ────────────────────────────────────────────────────────────────

  if (items.length === 0) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left panel */}
        <div className="checkout-form-panel">
          {/* Logo */}
          <div className="checkout-logo">
            <Link href="/">
              <div className="checkout-logo__text">SANDSTORM</div>
            </Link>
            <span className="checkout-logo__sub">KENYA</span>
          </div>

          {/* Steps */}
          <Steps current={step} />

          {/* Step content */}
          {step === 1 && (
            <ContactStep
              data={contact}
              onNext={handleContactNext}
              loading={loading}
              error={error}
            />
          )}

          {step === 2 && (
            <DeliveryStep
              options={shippingOptions}
              selectedId={selectedShipId}
              onSelect={(id, amount) => {
                setSelectedShipId(id);
                setSelectedShipAmount(amount);
                const opt = shippingOptions.find((o) => o.id === id);
                setSelectedShipName(opt?.name ?? "");
              }}
              onNext={handleDeliveryNext}
              onBack={() => { setStep(1); setError(null); }}
              loading={loading}
              error={error}
            />
          )}

          {step === 3 && (
            <ReviewStep
              contact={contact}
              shippingName={selectedShipName}
              shippingCost={selectedShipAmount}
              onBack={() => { setStep(2); setError(null); }}
              onEdit={(s) => { setStep(s); setError(null); }}
              onPlace={handlePlaceOrder}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* Right: order summary */}
        <OrderSummary shippingCost={step === 3 ? selectedShipAmount : 0} />
      </div>
    </div>
  );
}
