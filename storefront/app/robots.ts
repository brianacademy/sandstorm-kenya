import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",     // private auth pages
          "/checkout",     // don't index checkout flow
          "/cart",         // don't index cart
          "/api/",         // internal API routes
        ],
      },
    ],
    sitemap: "https://sandstormkenya.com/sitemap.xml",
    host: "https://sandstormkenya.com",
  };
}
