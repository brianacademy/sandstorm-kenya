"use client";

import Link from "next/link";
import { NAV_CATEGORIES } from "@/lib/products";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`nav-overlay${isOpen ? " active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={`nav-drawer${isOpen ? " active" : ""}`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        id="nav-drawer"
      >
        <div className="nav-drawer__header">
          <button
            className="nav-drawer__close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button className="navbar__currency" style={{ fontSize: 13 }}>
              <img src="https://flagcdn.com/w40/ke.png" alt="Kenya" className="currency-flag" />
              KES
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <Link href="/account" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, color: "var(--color-dark)" }} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Account
            </Link>
          </div>
        </div>

        <div className="nav-drawer__section-title">Styles</div>

        <Link href="/shop" className="nav-drawer__item" onClick={onClose}>All Products</Link>
        <Link href="/shop" className="nav-drawer__item" onClick={onClose}>All Collections</Link>

        {NAV_CATEGORIES.slice(1).map((cat) => (
          <div
            key={cat}
            className="nav-drawer__item"
            style={{ justifyContent: "space-between" }}
          >
            <span>{cat}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        ))}

        <div className="nav-drawer__footer">
          <Link href="/about" style={{ fontSize: 14, color: "var(--color-dark)" }} onClick={onClose}>Our Heritage</Link>
          <Link href="/contact" style={{ fontSize: 14, color: "var(--color-dark)" }} onClick={onClose}>Contact Us</Link>
        </div>
      </nav>
    </>
  );
}
