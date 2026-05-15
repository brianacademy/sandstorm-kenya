import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts, getCategories } from "@/lib/medusa-store";

export const metadata: Metadata = {
  title: "Sandstorm Kenya — Made By Kenya",
  description:
    "Premium canvas and leather bags handcrafted in Nairobi for over 20 years. Shop totes, backpacks, duffles, briefcases and more.",
};

export const revalidate = 60;

// Static category images mapped by handle
const CATEGORY_IMAGES: Record<string, string> = {
  totes:        "/images/category-totes.png",
  backpacks:    "/images/category-backpacks.png",
  duffles:      "/images/category-duffles.png",
  wallets:      "/images/category-wallets.png",
  messengers:   "/images/category-backpacks.png",
  briefcases:   "/images/category-backpacks.png",
  washbags:     "/images/category-wallets.png",
  clutches:     "/images/category-totes.png",
  weekenders:   "/images/category-duffles.png",
  "laptop-bags":"/images/category-backpacks.png",
  "top-handles":"/images/category-totes.png",
};

export default async function HomePage() {
  // Fetch featured products + categories in parallel
  const [featuredProducts, categories] = await Promise.all([
    getProducts({ limit: 6 }),
    getCategories(),
  ]);

  // Show at most 6 categories in the scroll strip
  const displayCategories = categories.slice(0, 6);

  return (
    <main>
      {/* ── HERO ─── */}
      <HeroSlider />

      {/* ── FEATURE STRIP ─── */}
      <section className="feature-strip" aria-label="Our promises">
        <div className="container">
          <div className="feature-strip__grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 3h22l-2 13H3L1 3z" />
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                ),
                title: "Free Shipping",
                text: "Free delivery to all of Kenya. We ship worldwide.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                title: "Customer Service",
                text: "Day or night, email us at customercare@sandstormkenya.com",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "Secure Payment",
                text: "Your payment is processed securely by Direct Pay Online.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Guaranteed For Life",
                text: (
                  <>
                    <Link href="/about" style={{ color: "var(--color-tan)" }}>
                      Find out more
                    </Link>{" "}
                    about our lifetime guarantee.
                  </>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="feature-item">
                <div className="feature-item__icon">{item.icon}</div>
                <div>
                  <div className="feature-item__title">{item.title}</div>
                  <p className="feature-item__text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERITAGE ─── */}
      <section className="heritage section-padding" aria-labelledby="heritage-heading">
        <div className="container">
          <div className="text-center">
            <p className="label-small">THE SANDSTORM JOURNEY</p>
            <h2 id="heritage-heading">OUR HERITAGE</h2>
            <p style={{ maxWidth: 580, margin: "24px auto 0", color: "var(--color-muted)", fontSize: 15, lineHeight: 1.8 }}>
              Inspired by the beauty of our country and the strength and ingenuity of our people,
              Sandstorm has been making bags in Nairobi for over 20 years.
            </p>
            <Link href="/about" className="btn btn-outline" style={{ marginTop: 40 }}>
              DISCOVER OUR STORY
            </Link>
          </div>
          <div className="heritage__grid" role="list">
            {[
              { src: "/images/heritage-1.png", alt: "Craftsman hand-stitching a canvas bag in the Nairobi workshop" },
              { src: "/images/heritage-2.png", alt: "Sandstorm Kenya production floor" },
              { src: "/images/heritage-3.png", alt: "Premium leather and canvas material samples" },
            ].map((img) => (
              <div key={img.src} className="heritage__image" role="listitem">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={450}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─── */}
      {displayCategories.length > 0 && (
        <section className="categories section-padding" aria-labelledby="cat-heading">
          <div className="container" style={{ padding: 0 }}>
            <div className="section-header" style={{ padding: "0 40px" }}>
              <p className="label-small">EXPLORE</p>
              <h2 id="cat-heading">Shop By Style</h2>
            </div>
            <div className="categories__scroll" role="list">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.handle}
                  href={`/shop?category=${cat.handle}`}
                  className="category-card"
                  role="listitem"
                >
                  <div className="category-card__img">
                    <Image
                      src={CATEGORY_IMAGES[cat.handle] ?? "/images/category-backpacks.png"}
                      alt={cat.name}
                      width={220}
                      height={293}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>
                  <p className="category-card__name">{cat.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section className="products-section" aria-labelledby="featured-heading">
          <div className="container">
            <div className="section-header">
              <p className="label-small">OUR PRODUCTS</p>
              <h2 id="featured-heading">Featured Collection</h2>
            </div>
            <div className="products-grid" role="list">
              {featuredProducts.map((product) => (
                <div key={product.id} role="listitem">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: 64 }}>
              <Link href="/shop" className="btn btn-outline">
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND BANNER ─── */}
      <section className="brand-banner" aria-label="Made By Kenya brand story">
        <Image
          src="/images/banner-dark.png"
          alt="Sandstorm Kenya collection"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="brand-banner__overlay">
          <p className="brand-banner__label">OUR CRAFT</p>
          <h2>Made By Kenya</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, maxWidth: 460, lineHeight: 1.8 }}>
            Every bag is handcrafted in our Nairobi workshop by skilled artisans who have
            perfected their craft over decades.
          </p>
          <Link href="/about" className="btn btn-outline-white">
            DISCOVER OUR STORY
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ─── */}
      <section className="newsletter" aria-labelledby="newsletter-heading">
        <div className="container">
          <div className="newsletter__inner">
            <h2 id="newsletter-heading">Stay in the Loop</h2>
            <p>Sign up to our monthly newsletter &amp; get 10% off your first order.</p>
            <form className="newsletter__form" action="#" method="post" aria-label="Newsletter signup">
              <input type="email" name="email" placeholder="Your e-mail" required aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
