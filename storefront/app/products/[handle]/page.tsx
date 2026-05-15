import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import {
  getProductByHandle,
  getProducts,
  medusaPrice,
} from "@/lib/medusa-store";
import ProductDetailClient from "./ProductDetailClient";

const SITE = "https://sandstormkenya.com";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts({ limit: 200 });
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Product Not Found" };

  const price = medusaPrice(product);
  const description = product.description?.slice(0, 160) ??
    `Shop the ${product.title} — premium canvas and leather bag handcrafted in Nairobi by Sandstorm Kenya.`;
  const canonical = `${SITE}/products/${handle}`;
  const image = product.thumbnail ?? `${SITE}/og-default.jpg`;

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${product.title} — Sandstorm Kenya`,
      description,
      url: canonical,
      type: "website",
      images: [{ url: image, width: 800, height: 800, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — Sandstorm Kenya`,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { handle } = await params;

  // Fetch product + related in parallel
  const [product, allProducts] = await Promise.all([
    getProductByHandle(handle),
    getProducts({ limit: 50 }),
  ]);

  if (!product) notFound();

  // Related: same category, excluding self
  const categoryHandle = product.categories?.[0]?.handle;
  const related = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (!categoryHandle || p.categories?.some((c) => c.handle === categoryHandle))
    )
    .slice(0, 3);

  // JSON-LD Product structured data
  const price = medusaPrice(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.thumbnail ?? undefined,
    brand: { "@type": "Brand", name: "Sandstorm Kenya" },
    url: `${SITE}/products/${handle}`,
    offers: price > 0 ? {
      "@type": "Offer",
      price: (price / 100).toFixed(2),
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Sandstorm Kenya" },
    } : undefined,
  };

  return (
    <>
      <Script
        id={`json-ld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
