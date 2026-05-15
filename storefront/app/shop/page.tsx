import type { Metadata } from "next";
import Link from "next/link";
import {
  getProducts,
  getCategories,
  getCategoryByHandle,
  MedusaProduct,
} from "@/lib/medusa-store";
import ProductCard from "@/components/shop/ProductCard";
import ShopSortClient from "./ShopSortClient";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Shop all Sandstorm Kenya premium canvas and leather bags — totes, backpacks, duffles, briefcases, messengers and more. Handcrafted in Nairobi.",
};

export const revalidate = 60;

type SortKey = "alpha-asc" | "alpha-desc" | "price-asc" | "price-desc";

function sortProducts(products: MedusaProduct[], sort: SortKey): MedusaProduct[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case "alpha-asc":  return a.title.localeCompare(b.title);
      case "alpha-desc": return b.title.localeCompare(a.title);
      case "price-asc": {
        const pa = a.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
        const pb = b.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
        return pa - pb;
      }
      case "price-desc": {
        const pa = a.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
        const pb = b.variants?.[0]?.calculated_price?.calculated_amount ?? 0;
        return pb - pa;
      }
      default: return 0;
    }
  });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const { category: categoryHandle, sort = "alpha-asc", q } = await searchParams;

  // Resolve category handle → category ID for the API filter
  const [categories, categoryObj] = await Promise.all([
    getCategories(),
    categoryHandle ? getCategoryByHandle(categoryHandle) : Promise.resolve(null),
  ]);

  // Fetch products — with text search or category filter
  const products = await getProducts({
    limit: 100,
    category_id: categoryObj ? [categoryObj.id] : undefined,
    q: q || undefined,
  });

  const sorted = sortProducts(products, sort as SortKey);
  const activeCategoryName = categoryObj?.name ?? (q ? `Results for "${q}"` : null);

  return (
    <>
      {/* Page Hero */}
      <div className="shop-hero">
        <div className="container">
          <h1>{activeCategoryName ?? "All Products"}</h1>
        </div>
      </div>

      <main>
        <div className="container" style={{ padding: 0 }}>
          <div className="shop-layout">
            {/* Sidebar */}
            <aside className="shop-sidebar" aria-label="Product filters">
              <div className="shop-sidebar__title">Categories</div>
              <div className="filter-group">
                <Link
                  href="/shop"
                  className={`filter-group__header${!categoryHandle ? " active" : ""}`}
                  style={{ display: "flex", textDecoration: "none", color: "inherit" }}
                >
                  <span>All Products</span>
                </Link>
              </div>
              {categories.map((cat) => (
                <div key={cat.handle} className="filter-group">
                  <Link
                    href={`/shop?category=${cat.handle}`}
                    className={`filter-group__header${categoryHandle === cat.handle ? " active" : ""}`}
                    style={{ display: "flex", textDecoration: "none", color: "inherit" }}
                  >
                    <span>{cat.name}</span>
                  </Link>
                </div>
              ))}
            </aside>

            {/* Product grid */}
            <div className="shop-main">
              {/* Toolbar */}
              <div className="shop-toolbar">
                <div className="shop-toolbar__left">
                  <span className="product-count">
                    {sorted.length} {sorted.length === 1 ? "product" : "products"}
                  </span>
                </div>
                {/* Client component handles sort navigation */}
                <ShopSortClient currentSort={sort} currentCategory={categoryHandle} currentQ={q} />
              </div>

              {sorted.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                  <p style={{ color: "var(--color-muted)", marginBottom: 24 }}>
                    {q ? `No products found for "${q}".` : "No products found in this category."}
                  </p>
                  <Link href="/shop" className="btn btn-outline">
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className="shop-grid" role="list">
                  {sorted.map((product) => (
                    <div key={product.id} role="listitem">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
