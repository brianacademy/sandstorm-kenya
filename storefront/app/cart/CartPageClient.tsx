"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, CartItem } from "@/lib/cart";
import { formatMedusaPrice } from "@/lib/medusa-store";

function CartRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="cart-page-row">
      {/* Product */}
      <div className="cart-page-row__product">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="cart-page-row__img"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="cart-page-row__img"
            style={{ background: "linear-gradient(135deg, #e8dfd0, #c4b49a)", flexShrink: 0 }}
          />
        )}
        <div>
          <Link href={`/products/${item.variantId.split("_")[0]}`} style={{ textDecoration: "none" }}>
            <p className="cart-page-row__name">{item.name}</p>
          </Link>
          <p className="cart-page-row__variant">{item.color}</p>
        </div>
      </div>

      {/* Unit price */}
      <div className="cart-page-row__price">{formatMedusaPrice(item.price)}</div>

      {/* Qty */}
      <div className="qty-selector" role="group" aria-label="Quantity">
        <button
          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span aria-live="polite">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        className="cart-page-row__remove"
        onClick={() => removeItem(item.variantId)}
        aria-label={`Remove ${item.name}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export default function CartPageClient() {
  const { items, subtotal } = useCartStore();
  const sub = subtotal();

  if (items.length === 0) {
    return (
      <>
        <div className="cart-page-hero">
          <div className="container">
            <h1>Your Bag</h1>
          </div>
        </div>
        <main>
          <div className="container">
            <div className="cart-empty-page">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>Your bag is empty.</p>
              <Link href="/shop" className="btn btn-filled">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="cart-page-hero">
        <div className="container">
          <h1>Your Bag</h1>
        </div>
      </div>

      <main>
        <div className="container">
          <div className="cart-page-layout">
            {/* Items table */}
            <div>
              <div className="cart-page-table" role="table" aria-label="Cart items">
                <div className="cart-page-table__head" role="row">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span></span>
                </div>
                {items.map((item) => (
                  <CartRow key={item.id} item={item} />
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
                <Link href="/shop" style={{ fontSize: 13, color: "var(--color-muted)", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <aside className="cart-summary-card" aria-label="Order summary">
              <div className="cart-summary-card__title">Order Summary</div>

              <div className="cart-summary-row">
                <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
                <span>{formatMedusaPrice(sub)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span style={{ color: "var(--color-olive)", fontWeight: 500 }}>Free</span>
              </div>
              <div className="cart-summary-row cart-summary-row--total">
                <span>Total</span>
                <span>{formatMedusaPrice(sub)}</span>
              </div>

              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                <Link
                  href="/checkout"
                  id="proceed-to-checkout-btn"
                  className="btn btn-filled btn-full"
                  style={{ textAlign: "center" }}
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>

              {/* Trust signals */}
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Free delivery within Kenya",
                  "Guaranteed for life",
                  "30-day returns",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--color-muted)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive)" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
