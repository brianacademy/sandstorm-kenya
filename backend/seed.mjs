/**
 * Sandstorm Kenya — Medusa v2 Product Seed Script
 * Run: node seed.mjs
 *
 * Seeds: region, sales channel, shipping profile,
 *        product categories, and 8 products with variants.
 */

import Medusa from "@medusajs/js-sdk";

const sdk = new Medusa({
  baseUrl: "http://localhost:9000",
  debug: false,
});

// ── AUTH ────────────────────────────────────────────────────────────────────
async function authenticate() {
  const { token } = await sdk.auth.login("user", "emailpass", {
    email: "admin@sandstormkenya.com",
    password: "SandStorm2024!",
  });
  sdk.client.setToken(token);
  console.log("✅ Authenticated as admin");
}

// ── REGION ──────────────────────────────────────────────────────────────────
async function ensureRegion(salesChannelId) {
  const { regions } = await sdk.admin.region.list();
  if (regions.length > 0) {
    console.log(`✅ Region: ${regions[0].name} (${regions[0].id})`);
    return regions[0];
  }
  const { region } = await sdk.admin.region.create({
    name: "Kenya",
    currency_code: "kes",
    countries: ["ke"],
  });
  console.log(`✅ Created region: ${region.name}`);
  return region;
}

// ── SALES CHANNEL ────────────────────────────────────────────────────────────
async function ensureSalesChannel() {
  const { sales_channels } = await sdk.admin.salesChannel.list();
  if (sales_channels.length > 0) {
    console.log(`✅ Sales channel: ${sales_channels[0].name} (${sales_channels[0].id})`);
    return sales_channels[0];
  }
  const { sales_channel } = await sdk.admin.salesChannel.create({
    name: "Sandstorm Kenya Online Store",
    description: "Main ecommerce storefront",
  });
  console.log(`✅ Created sales channel: ${sales_channel.name}`);
  return sales_channel;
}

// ── CATEGORIES ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Totes",      handle: "totes" },
  { name: "Backpacks",  handle: "backpacks" },
  { name: "Laptop Bags",handle: "laptop-bags" },
  { name: "Messengers", handle: "messengers" },
  { name: "Briefcases", handle: "briefcases" },
  { name: "Duffles",    handle: "duffles" },
  { name: "Weekenders", handle: "weekenders" },
  { name: "Washbags",   handle: "washbags" },
  { name: "Top Handles",handle: "top-handles" },
  { name: "Clutches",   handle: "clutches" },
  { name: "Wallets",    handle: "wallets" },
];

async function ensureCategories() {
  const { product_categories } = await sdk.admin.productCategory.list({ limit: 50 });
  const existing = new Map(product_categories.map((c) => [c.handle, c]));
  const result = {};

  for (const cat of CATEGORIES) {
    if (existing.has(cat.handle)) {
      result[cat.handle] = existing.get(cat.handle);
      console.log(`  ↩ Category exists: ${cat.name}`);
    } else {
      const { product_category } = await sdk.admin.productCategory.create({
        name: cat.name,
        handle: cat.handle,
        is_active: true,
      });
      result[cat.handle] = product_category;
      console.log(`  ✅ Created category: ${cat.name}`);
    }
  }
  return result;
}

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
function makeProducts(categories, salesChannelId) {
  const catId = (handle) => categories[handle]?.id;

  return [
    {
      title: "Canvas Adventurer Backpack",
      handle: "canvas-adventurer-backpack",
      subtitle: "The original Nairobi everyday carry",
      description:
        "The Canvas Adventurer Backpack is built for those who refuse to choose between style and function. Handcrafted in our Nairobi workshop using heavy-duty waxed canvas and full-grain vegetable-tanned leather, this pack is designed to accompany you for decades — not just seasons.",
      category_ids: [catId("backpacks")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Olive Green", "Stone", "Black", "Khaki"] }],
      variants: [
        { title: "Olive Green", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 3250000 }] },
        { title: "Stone",       options: { Color: "Stone" },       prices: [{ currency_code: "kes", amount: 3250000 }] },
        { title: "Black",       options: { Color: "Black" },       prices: [{ currency_code: "kes", amount: 3250000 }] },
        { title: "Khaki",       options: { Color: "Khaki" },       prices: [{ currency_code: "kes", amount: 3250000 }], manage_inventory: true, allow_backorder: false },
      ],
    },
    {
      title: "Canvas Explorer Tote",
      handle: "canvas-explorer-tote",
      subtitle: "The everyday icon",
      description:
        "Our most iconic tote, reimagined. The Canvas Explorer Tote pairs waxed canvas with cognac leather handles — a bag that carries your daily essentials with enduring elegance.",
      category_ids: [catId("totes")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Olive Green", "Tan"] }],
      variants: [
        { title: "Olive Green", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 1890000 }] },
        { title: "Tan",         options: { Color: "Tan" },         prices: [{ currency_code: "kes", amount: 1890000 }] },
      ],
    },
    {
      title: "Canvas Adventurer Duffle",
      handle: "canvas-adventurer-duffle",
      subtitle: "Your indispensable travel companion",
      description:
        "Whether heading to the bush or a business trip, the Canvas Adventurer Duffle is your ideal travel companion. Spacious, structured, and built to last.",
      category_ids: [catId("duffles")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Khaki", "Stone", "Black"] }],
      variants: [
        { title: "Khaki", options: { Color: "Khaki" }, prices: [{ currency_code: "kes", amount: 4090000 }] },
        { title: "Stone", options: { Color: "Stone" }, prices: [{ currency_code: "kes", amount: 4090000 }] },
        { title: "Black", options: { Color: "Black" }, prices: [{ currency_code: "kes", amount: 4090000 }] },
      ],
    },
    {
      title: "Canvas Messenger Bag",
      handle: "canvas-messenger-bag",
      subtitle: "The ultimate urban carry",
      description:
        "The Canvas Messenger Bag is the everyday carry for the modern urbanite. Adjustable leather strap, full-length flap closure, and a 15\" laptop pocket — everything you need, nothing you don't.",
      category_ids: [catId("messengers")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Olive Green", "Stone"] }],
      variants: [
        { title: "Olive Green", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 2250000 }] },
        { title: "Stone",       options: { Color: "Stone" },       prices: [{ currency_code: "kes", amount: 2250000 }] },
      ],
    },
    {
      title: "Premium Leather Briefcase",
      handle: "premium-leather-briefcase",
      subtitle: "The executive statement piece",
      description:
        "Crafted from the finest full-grain leather, the Premium Leather Briefcase is a statement piece for the discerning professional.",
      category_ids: [catId("briefcases")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Cognac", "Black"] }],
      variants: [
        { title: "Cognac", options: { Color: "Cognac" }, prices: [{ currency_code: "kes", amount: 5490000 }] },
        { title: "Black",  options: { Color: "Black" },  prices: [{ currency_code: "kes", amount: 5490000 }] },
      ],
    },
    {
      title: "Canvas Washbag",
      handle: "canvas-washbag",
      subtitle: "The organised traveller",
      description:
        "The Canvas Washbag keeps your travel toiletries beautifully organised. Compact enough for your gym bag, roomy enough for a weekend trip.",
      category_ids: [catId("washbags")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Khaki", "Olive Green"] }],
      variants: [
        { title: "Khaki",       options: { Color: "Khaki" },       prices: [{ currency_code: "kes", amount: 990000 }] },
        { title: "Olive Green", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 990000 }] },
      ],
    },
    {
      title: "Leather Clutch Purse",
      handle: "leather-clutch-purse",
      subtitle: "Timeless and versatile",
      description:
        "Timeless and versatile, the Leather Clutch Purse is made from buttery-soft full-grain leather. Sized to carry just the essentials.",
      category_ids: [catId("clutches")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Tan", "Black"] }],
      variants: [
        { title: "Tan",   options: { Color: "Tan" },   prices: [{ currency_code: "kes", amount: 1450000 }] },
        { title: "Black", options: { Color: "Black" }, prices: [{ currency_code: "kes", amount: 1450000 }] },
      ],
    },
    {
      title: "Slim Leather Wallet",
      handle: "slim-leather-wallet",
      subtitle: "Perfectly slim, perfectly crafted",
      description:
        "Hand-crafted in full-grain leather, this slim billfold wallet holds up to 8 cards plus notes. Designed to slip seamlessly into any pocket.",
      category_ids: [catId("wallets")],
      status: "published",
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Color", values: ["Cognac", "Dark Brown"] }],
      variants: [
        { title: "Cognac",     options: { Color: "Cognac" },     prices: [{ currency_code: "kes", amount: 690000 }] },
        { title: "Dark Brown", options: { Color: "Dark Brown" }, prices: [{ currency_code: "kes", amount: 690000 }] },
      ],
    },
  ];
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("\n🌱 Sandstorm Kenya — Seed Script\n" + "─".repeat(50));

  await authenticate();

  const salesChannel = await ensureSalesChannel();
  await ensureRegion(salesChannel.id);

  console.log("\n📂 Ensuring product categories…");
  const categories = await ensureCategories();

  console.log("\n📦 Seeding products…");
  const products = makeProducts(categories, salesChannel.id);

  // Check existing to avoid duplicates
  const { products: existing } = await sdk.admin.product.list({ limit: 100 });
  const existingHandles = new Set(existing.map((p) => p.handle));

  let created = 0;
  let skipped = 0;

  for (const productData of products) {
    if (existingHandles.has(productData.handle)) {
      console.log(`  ↩ Skipping (exists): ${productData.title}`);
      skipped++;
      continue;
    }
    try {
      const { product } = await sdk.admin.product.create(productData);
      console.log(`  ✅ Created: ${product.title} (${product.variants?.length ?? 0} variants)`);
      created++;
    } catch (err) {
      console.error(`  ❌ Failed: ${productData.title} — ${err.message}`);
    }
  }

  console.log(`\n✨ Seed complete — ${created} created, ${skipped} skipped`);
  console.log("\n📋 Next steps:");
  console.log("  1. Open http://localhost:9000/app and log in");
  console.log("  2. Go to Settings → API Keys → Create Publishable Key");
  console.log("  3. Copy the key into storefront/.env.local as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  console.error(err);
  process.exit(1);
});
