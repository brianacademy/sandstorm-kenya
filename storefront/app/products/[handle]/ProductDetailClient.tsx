"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MedusaProduct,
  MedusaVariant,
  medusaPrice,
  formatMedusaPrice,
} from "@/lib/medusa-store";
import { useCartStore } from "@/lib/cart";
import ProductCard from "@/components/shop/ProductCard";

// Deterministic swatch colours (mirrors ProductCard list)
const COLOR_HEX: Record<string, string> = {
  "olive green": "#6b7c4b",
  "olive":       "#6b7c4b",
  "stone":       "#c4b8a0",
  "black":       "#1a1a1a",
  "khaki":       "#c2b280",
  "tan":         "#d2a679",
  "cognac":      "#9a4f2a",
  "dark brown":  "#4a2c1a",
  "navy":        "#1f3460",
  "cream":       "#f5f0e8",
};
const getHex = (t: string) => COLOR_HEX[t.toLowerCase()] ?? "#8b7355";

// Fallback images for products seeded without thumbnails
// Maps product handle → local image in /public/images/
const FALLBACK_IMAGES: Record<string, string[]> = {
  "canvas-adventurer-backpack": ["/images/category-backpacks.png", "/images/heritage-1.png", "/images/hero-1.png", "/images/heritage-3.png"],
  "canvas-explorer-tote":       ["/images/category-totes.png", "/images/heritage-2.png"],
  "canvas-adventurer-duffle":   ["/images/category-duffles.png", "/images/hero-3.png"],
  "canvas-messenger-bag":       ["/images/product-messenger.png", "/images/hero-1.png"],
  "premium-leather-briefcase":  ["/images/product-briefcase.png", "/images/heritage-3.png"],
  "canvas-washbag":             ["/images/product-washbag.png"],
  "leather-clutch-purse":       ["/images/product-clutch.png"],
  "slim-leather-wallet":        ["/images/category-wallets.png"],
};

interface Props {
  product: MedusaProduct;
  related: MedusaProduct[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const firstVariant   = product.variants?.[0];
  const fallback       = FALLBACK_IMAGES[product.handle];
  const [selectedVariant, setSelectedVariant] = useState<MedusaVariant>(firstVariant);
  const [mainImage, setMainImage] = useState<string | null>(
    product.thumbnail ?? product.images?.[0]?.url ?? fallback?.[0] ?? null
  );
  const [openTab, setOpenTab] = useState("description");
  const [added, setAdded]     = useState(false);

  const { addItem, openCart } = useCartStore();

  const price       = medusaPrice(selectedVariant);
  const variantName = selectedVariant.title; // e.g. "Olive Green"
  const categoryName = product.categories?.[0]?.name ?? "Shop";

  const allImages = product.images?.length
    ? product.images.map((i) => i.url)
    : product.thumbnail
    ? [product.thumbnail]
    : fallback ?? ["/images/placeholder.png"];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.title,
      color: variantName,
      price: price,
      quantity: 1,
      image: allImages[0],
    });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    {
      id: "description",
      label: "Description",
      content: <p>{product.description ?? "No description available."}</p>,
    },
    {
      id: "details",
      label: "Details",
      content: (
        <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
          <li>Waxed canvas body — heavy-duty, weather-resistant</li>
          <li>Full-grain vegetable-tanned leather trim</li>
          <li>Solid brass YKK hardware</li>
          <li>Hand-stitched with waxed linen thread</li>
          <li>Handcrafted in Nairobi, Kenya</li>
        </ul>
      ),
    },
    {
      id: "shipping",
      label: "Shipping",
      content: (
        <ul style={{ paddingLeft: 20, listStyle: "disc" }}>
          <li>Free delivery within Kenya (3–5 business days)</li>
          <li>International shipping available (7–14 business days)</li>
          <li>All orders are dispatched from our Nairobi workshop</li>
        </ul>
      ),
    },
    {
      id: "returns",
      label: "Returns",
      content: (
        <p>
          We accept returns within 30 days of delivery for unworn, unused items in original
          condition. Contact us at{" "}
          <a href="mailto:customercare@sandstormkenya.com" style={{ color: "var(--color-tan)" }}>
            customercare@sandstormkenya.com
          </a>{" "}
          to initiate a return.
        </p>
      ),
    },
  ];

  return (
    <main>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">{categoryName}</Link>
          <span>/</span>
          <span style={{ color: "var(--color-dark)" }}>{product.title}</span>
        </nav>

        {/* Product Detail */}
        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__main">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.title}
                  width={600}
                  height={600}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 480,
                    background: "linear-gradient(135deg, #e8dfd0 0%, #c4b49a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#a0927e" strokeWidth="0.8">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <p style={{ color: "#a0927e", fontSize: 13, letterSpacing: "0.05em" }}>
                    PRODUCT IMAGE COMING SOON
                  </p>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="product-gallery__thumbs" role="list">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb${mainImage === img ? " active" : ""}`}
                    onClick={() => setMainImage(img)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      width={72}
                      height={72}
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="product-info">
            <h1 className="product-info__title">{product.title}</h1>
            {product.subtitle && (
              <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>
                {product.subtitle}
              </p>
            )}
            <p className="product-info__price">{formatMedusaPrice(price)}</p>

            {/* Variant / colour selector */}
            {product.variants?.length > 1 && (
              <>
                <p className="product-info__label">
                  Colour:{" "}
                  <span style={{ color: "var(--color-dark)", textTransform: "none", letterSpacing: 0 }}>
                    {variantName}
                  </span>
                </p>
                <div className="color-swatches-lg" role="group" aria-label="Select colour">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`swatch-lg${selectedVariant.id === v.id ? " active" : ""}`}
                      style={{ background: getHex(v.title) }}
                      title={v.title}
                      aria-label={v.title}
                      onClick={() => setSelectedVariant(v)}
                    />
                  ))}
                </div>
              </>
            )}

            <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 40, lineHeight: 1.7 }}>
              Waxed canvas body with full-grain vegetable-tanned leather trim. Solid brass YKK
              hardware. Handcrafted in Nairobi, Kenya.
            </p>

            {/* Add to Cart */}
            <button
              id="add-to-cart-btn"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              {added ? "✓ ADDED TO BAG" : "ADD TO BAG"}
            </button>

            {/* Trust signals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
              {[
                "Free shipping within Kenya",
                "Guaranteed for life",
                "30-day returns",
              ].map((label) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--color-muted)" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="product-accordion">
              {tabs.map((tab) => (
                <div key={tab.id} className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => setOpenTab(openTab === tab.id ? "" : tab.id)}
                    aria-expanded={openTab === tab.id}
                  >
                    <span>{tab.label}</span>
                    <span>{openTab === tab.id ? "−" : "+"}</span>
                  </button>
                  <div
                    className={`accordion-body${openTab === tab.id ? " open" : ""}`}
                    style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.7 }}
                  >
                    {tab.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" style={{ padding: "64px 0" }}>
            <div className="section-header">
              <p className="label-small">BROWSE MORE</p>
              <h2 id="related-heading">You May Also Like</h2>
            </div>
            <div className="products-grid" role="list">
              {related.map((p) => (
                <div key={p.id} role="listitem">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
