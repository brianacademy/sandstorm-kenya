"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SearchProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  variants: { calculated_price?: { calculated_amount: number; currency_code: string } | null }[];
  categories?: { name: string }[];
}

/** Extract price from a SearchProduct's first variant */
function searchProductPrice(p: SearchProduct): number {
  return p.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
}

/** Format KES integer amount (e.g. 1890000 → "KSh 18,900") */
function fmtPrice(amount: number): string {
  if (!amount) return "";
  return `KSh ${(amount / 100).toLocaleString("en-KE")}`;
}

// ── Search fetch ──────────────────────────────────────────────────────────────

async function searchProducts(q: string): Promise<SearchProduct[]> {
  if (!q.trim()) return [];
  const base = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
  const key  = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";
  const url  = `${base}/store/products?q=${encodeURIComponent(q)}&limit=8&fields=id,title,handle,thumbnail,*variants,*categories`;
  const res  = await fetch(url, {
    headers: { "x-publishable-api-key": key },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.products ?? [];
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(0);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery("");
      setResults([]);
      setFocused(0);
    }
  }, [isOpen]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const r = await searchProducts(q);
    setResults(r);
    setFocused(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 280);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Close on Escape, navigate on Enter
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
      if (e.key === "Enter" && results[focused]) {
        onClose();
        router.push(`/products/${results[focused].handle}`);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, focused, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Search products">
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        {/* Input row */}
        <div className="search-input-row">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search bags, categories…"
            autoComplete="off"
            aria-label="Search products"
            aria-controls="search-results"
            aria-expanded={results.length > 0}
          />
          {loading && (
            <div className="search-spinner" aria-label="Searching…" />
          )}
          <button className="search-close-btn" onClick={onClose} aria-label="Close search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Results */}
        {query.trim() && (
          <div id="search-results" className="search-results" role="listbox" aria-label="Search results">
            {results.length === 0 && !loading && (
              <div className="search-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p>No products found for &ldquo;{query}&rdquo;</p>
                <Link href={`/shop`} className="search-see-all" onClick={onClose}>
                  Browse all products →
                </Link>
              </div>
            )}

            {results.map((product, i) => {
              const price = searchProductPrice(product);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className={`search-result-item${focused === i ? " focused" : ""}`}
                  onClick={onClose}
                  role="option"
                  aria-selected={focused === i}
                  onMouseEnter={() => setFocused(i)}
                >
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="search-result-img"
                    />
                  ) : (
                    <div className="search-result-img search-result-placeholder" />
                  )}
                  <div className="search-result-info">
                    <span className="search-result-name">{product.title}</span>
                    {product.categories?.[0] && (
                      <span className="search-result-cat">{product.categories[0].name}</span>
                    )}
                  </div>
                  <span className="search-result-price">
                    {fmtPrice(price)}
                  </span>
                </Link>
              );
            })}

            {results.length > 0 && (
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                className="search-see-all"
                onClick={onClose}
              >
                See all results for &ldquo;{query}&rdquo; →
              </Link>
            )}
          </div>
        )}

        {/* Quick links when empty */}
        {!query.trim() && (
          <div className="search-quick-links">
            <p className="search-quick-title">Popular Categories</p>
            <div className="search-quick-grid">
              {["Backpacks", "Totes", "Duffles", "Briefcases", "Messengers", "Wallets"].map(cat => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat.toLowerCase()}`}
                  className="search-quick-chip"
                  onClick={onClose}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="search-hint">
          <kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>Enter</kbd> select · <kbd>Esc</kbd> close
        </p>
      </div>
    </div>
  );
}
