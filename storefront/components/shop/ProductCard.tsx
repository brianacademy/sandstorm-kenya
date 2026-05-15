import Link from "next/link";
import Image from "next/image";
import { MedusaProduct, medusaPrice, formatMedusaPrice } from "@/lib/medusa-store";

interface ProductCardProps {
  product: MedusaProduct;
}

// Deterministic color map for variant swatches (Medusa has no hex field)
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

// Fallback images for products seeded without thumbnails
// Maps product handle → local image in /public/images/
const FALLBACK_IMAGES: Record<string, string> = {
  "canvas-adventurer-backpack": "/images/category-backpacks.png",
  "canvas-explorer-tote":       "/images/category-totes.png",
  "canvas-adventurer-duffle":   "/images/category-duffles.png",
  "canvas-messenger-bag":       "/images/product-messenger.png",
  "premium-leather-briefcase":  "/images/product-briefcase.png",
  "canvas-washbag":             "/images/product-washbag.png",
  "leather-clutch-purse":       "/images/product-clutch.png",
  "slim-leather-wallet":        "/images/category-wallets.png",
};

function getHex(colorTitle: string): string {
  return COLOR_HEX[colorTitle.toLowerCase()] ?? "#8b7355";
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstVariant = product.variants?.[0];
  const price        = firstVariant ? medusaPrice(firstVariant) : 0;
  const thumbnail    = product.thumbnail ?? product.images?.[0]?.url ?? FALLBACK_IMAGES[product.handle] ?? null;
  const hasSwatches  = (product.variants?.length ?? 0) > 1;

  return (
    <article>
      <Link href={`/products/${product.handle}`} className="product-card">
        <span className="product-card__img-wrap">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #e8dfd0 0%, #c4b49a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a0927e"
                strokeWidth="1"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          )}
        </span>
      </Link>
      <div className="product-card__info">
        <p className="product-card__name">{product.title}</p>
        <p className="product-card__price">{formatMedusaPrice(price)}</p>
        {hasSwatches && (
          <div className="product-card__swatches" role="group" aria-label="Available colors">
            {product.variants.map((v) => (
              <button
                key={v.id}
                className="swatch"
                style={{ background: getHex(v.title) }}
                title={v.title}
                aria-label={v.title}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
