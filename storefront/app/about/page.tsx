import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Heritage",
  description: "Learn about Sandstorm Kenya's 20-year heritage of crafting premium canvas and leather bags by hand in Nairobi.",
};

const milestones = [
  { year: "1993", text: "Founded in a small Nairobi workshop with 4 craftspeople and a dream" },
  { year: "2001", text: "Expanded to our current factory and introduced the iconic Adventurer series" },
  { year: "2010", text: "Began shipping internationally, bringing Kenyan craft to the world" },
  { year: "2024", text: "Celebrating 30 years of handmade bags, 120 artisans, and 40 countries served" },
];

const values = [
  {
    title: "Handcrafted Quality",
    text: "Every bag is hand-cut, hand-stitched, and hand-finished by skilled artisans in our Nairobi workshop. No shortcuts.",
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="6" r="3"/><path d="M6 9v12m0 0h12m0 0-3-3m3 3-3 3"/></svg>,
  },
  {
    title: "Guaranteed For Life",
    text: "We stand behind every bag we make. If a seam fails or hardware breaks within its lifetime, we will repair or replace it.",
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    title: "Made By Kenya",
    text: "We employ over 120 skilled craftspeople in Nairobi, paying fair wages and investing in skills training that lasts generations.",
    icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="about-hero" aria-label="Workshop at Sandstorm Kenya">
        <Image src="/images/heritage-2.png" alt="Sandstorm Kenya production workshop" fill priority style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        <div className="about-hero__overlay">
          <h1><em>Made By Kenya</em></h1>
        </div>
      </section>

      {/* Story */}
      <section className="about-story" aria-labelledby="story-heading">
        <p className="label-small" style={{ display: "block", marginBottom: 12 }}>THE SANDSTORM JOURNEY</p>
        <h2 id="story-heading" style={{ marginBottom: 32 }}>Our Heritage</h2>
        <p>
          Sandstorm Kenya was born from a deep love for the land, its people, and the timeless craft of bag-making.
          In 1993, with a small workshop in Nairobi, a skilled team of artisans, and a vision for creating bags built
          to last a lifetime, Sandstorm began its journey.
        </p>
        <p>
          Today, more than 20 years later, we remain true to that founding spirit. Every bag that leaves our Nairobi
          workshop is still hand-stitched by craftspeople who have spent years — often decades — mastering their trade.
        </p>
        <p>
          Inspired by the beauty of the Kenyan landscape and the ingenuity of its people, our collections balance rugged
          durability with classic, understated design.
        </p>
        <Link href="/shop" className="btn btn-filled" style={{ marginTop: 32 }}>SHOP ALL BAGS</Link>
      </section>

      {/* Timeline */}
      <section className="about-timeline" aria-labelledby="timeline-heading">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 48 }}>
            <p className="label-small" style={{ color: "rgba(255,255,255,0.6)" }}>OUR MILESTONES</p>
            <h2 id="timeline-heading" style={{ color: "white" }}>20 Years of Craft</h2>
          </div>
          <div className="timeline-grid">
            {milestones.map((m) => (
              <div key={m.year} className="timeline-item" style={{ textAlign: "center" }}>
                <div className="timeline-item__year">{m.year}</div>
                <p className="timeline-item__text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" aria-labelledby="values-heading">
        <div className="container">
          <div className="section-header">
            <p className="label-small">WHAT WE STAND FOR</p>
            <h2 id="values-heading">Our Principles</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 48 }}>
            {values.map((v) => (
              <div key={v.title} style={{ textAlign: "center", padding: 40, background: "white", border: "1px solid var(--color-border)" }}>
                <div style={{ width: 52, height: 52, background: "var(--color-warm-gray)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  {v.icon}
                </div>
                <h4 style={{ marginBottom: 12 }}>{v.title}</h4>
                <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.7 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Sections */}
      <section className="section-padding" aria-labelledby="craft-heading">
        <div className="container">
          <div className="about-craft__grid">
            <div className="about-craft__img">
              <Image src="/images/heritage-1.png" alt="Craftsman hand-stitching a bag" width={600} height={450} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
            <div className="about-craft__text">
              <p className="label-small" style={{ marginBottom: 12 }}>THE WORKSHOP</p>
              <h2 id="craft-heading">Hand-Made in Nairobi</h2>
              <p>
                Our workshop is home to more than 120 skilled craftspeople. Many have spent their entire careers here,
                learning and passing down techniques refined over decades. The process begins with selecting the finest
                materials: heavy-duty waxed canvas and full-grain vegetable-tanned leather.
              </p>
              <p>Each piece is cut by hand, assembled with precision, and stitched with heavy waxed linen thread.</p>
              <Link href="/contact" className="btn btn-outline">CONTACT US</Link>
            </div>
          </div>

          <div className="about-craft__grid" style={{ marginTop: 64 }}>
            <div className="about-craft__text" style={{ order: 1 }}>
              <p className="label-small" style={{ marginBottom: 12 }}>OUR MATERIALS</p>
              <h2>Chosen With Care</h2>
              <p>
                Our waxed canvas is heavy-duty and weather-resistant, developing a rich patina over years of use.
                Our leather is vegetable-tanned — a slow, traditional process that produces leather of unmatched quality.
                All hardware is solid brass — it will never rust, corrode, or fail.
              </p>
              <Link href="/shop" className="btn btn-outline">SHOP ALL BAGS</Link>
            </div>
            <div className="about-craft__img" style={{ order: 2 }}>
              <Image src="/images/heritage-3.png" alt="Premium leather and canvas material samples" width={600} height={450} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="brand-banner" aria-label="Shop Sandstorm Kenya">
        <Image src="/images/banner-dark.png" alt="Sandstorm Kenya bags" fill style={{ objectFit: "cover" }} />
        <div className="brand-banner__overlay">
          <p className="brand-banner__label">EXPLORE THE COLLECTION</p>
          <h2>Built for a Lifetime</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, maxWidth: 420, lineHeight: 1.8 }}>Discover bags that get better with every adventure.</p>
          <Link href="/shop" className="btn btn-outline-white">SHOP NOW</Link>
        </div>
      </section>
    </main>
  );
}
