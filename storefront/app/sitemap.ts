import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/medusa-store";

const SITE = "https://sandstormkenya.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE,             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/shop`,   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE}/about`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ limit: 200 });
    productRoutes = products.map(p => ({
      url: `${SITE}/products/${p.handle}`,
      lastModified: new Date(p.updated_at ?? Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // If Medusa is unavailable at build time, skip dynamic routes
  }

  return [...staticRoutes, ...productRoutes];
}
