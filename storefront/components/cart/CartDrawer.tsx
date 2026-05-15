"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart";
import { formatMedusaPrice } from "@/lib/medusa-store";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();
  const sub = subtotal();

  return (
    <>
      {/* Overlay */}
      <div
        className={`nav-overlay${isOpen ? " active" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer${isOpen ? " active" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Your Bag</h2>
          <button
            className="navbar__icon-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.5" style={{ margin: "0 auto" }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p>Your bag is empty</p>
              <Link href="/shop" onClick={closeCart} className="btn btn-outline" style={{ marginTop: 24 }}>
                BROWSE ALL BAGS
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="cart-item__img"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="cart-item__img"
                    style={{
                      width: 80,
                      height: 80,
                      background: "linear-gradient(135deg, #e8dfd0, #c4b49a)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a0927e" strokeWidth="1">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                )}
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>{item.color}</p>
                  <p className="cart-item__price">{formatMedusaPrice(item.price)}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--color-border)", padding: "2px 8px" }}>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        style={{ fontSize: 16, lineHeight: 1, color: "var(--color-dark)", background: "none", border: "none", cursor: "pointer" }}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span style={{ fontSize: 13, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        style={{ fontSize: 16, lineHeight: 1, color: "var(--color-dark)", background: "none", border: "none", cursor: "pointer" }}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.variantId)}
                      aria-label={`Remove ${item.name}`}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-totals">
              <div className="cart-totals__row">
                <span>Subtotal</span>
                <span>{formatMedusaPrice(sub)}</span>
              </div>
              <div className="cart-totals__row">
                <span>Shipping</span>
                <span style={{ color: "var(--color-olive)", fontWeight: 500 }}>Free</span>
              </div>
              <div className="cart-totals__row total">
                <span>Total</span>
                <span>{formatMedusaPrice(sub)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="btn btn-filled btn-full"
              onClick={closeCart}
            >
              PROCEED TO CHECKOUT
            </Link>
            <Link
              href="/cart"
              className="btn btn-outline btn-full"
              onClick={closeCart}
              style={{ marginTop: 10 }}
            >
              VIEW FULL CART
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
