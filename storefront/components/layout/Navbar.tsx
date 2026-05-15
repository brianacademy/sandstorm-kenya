"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cart";
import { loadToken, getMe } from "@/lib/customer";
import NavDrawer from "./NavDrawer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchModal from "@/components/search/SearchModal";

export default function Navbar() {
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const { openCart, isOpen: cartOpen, itemCount } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load customer session from localStorage
  useEffect(() => {
    const token = loadToken();
    if (!token) return;
    getMe(token).then(me => {
      if (me) setCustomerName(me.first_name ?? me.email.split("@")[0]);
    }).catch(() => {});
  }, []);

  // Trap body scroll when any overlay is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen || cartOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, cartOpen, searchOpen]);

  // '/' shortcut to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className={`navbar${scrolled ? " scrolled" : ""}`} role="banner">
        <div className="navbar__inner">
          {/* Left */}
          <div className="navbar__left">
            <button
              className="navbar__hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              aria-controls="nav-drawer"
            >
              <span /><span /><span />
            </button>
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products (press / to open)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>

          {/* Center Logo */}
          <Link href="/" className="navbar__logo" aria-label="Sandstorm Kenya home">
            <div className="navbar__logo-text">
              <span className="brand-name">SAND&amp;STORM</span>
              <span className="brand-sub">KENYA</span>
            </div>
          </Link>

          {/* Right */}
          <div className="navbar__right">
            <button className="navbar__currency" aria-label="Change currency">
              <img src="https://flagcdn.com/w40/ke.png" alt="Kenya" className="currency-flag" />
              Kenya (KES KSh)
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-muted)" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <Link
              href={customerName ? "/account" : "/account/login"}
              className="navbar__icon-btn"
              aria-label={customerName ? `Account: ${customerName}` : "Sign in"}
              style={{ gap: 6, fontSize: 12 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {customerName && (
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {customerName}
                </span>
              )}
              {customerName && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-olive)", flexShrink: 0 }} />
              )}
            </Link>
            <button
              className="navbar__icon-btn"
              onClick={openCart}
              aria-label={`Shopping cart, ${count} item${count !== 1 ? "s" : ""}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {count > 0 && (
                <span className="cart-badge" aria-live="polite">{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
