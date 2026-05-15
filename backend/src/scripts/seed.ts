import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

// ── KES currency workflow ────────────────────────────────────────────────────
const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((c) => ({
          currency_code: c.currency_code,
          is_default: c.is_default ?? false,
        })),
      },
    }));
    const stores = updateStoresStep(normalizedInput);
    return new WorkflowResponse(stores);
  }
);

// ── Main seed function ───────────────────────────────────────────────────────
export default async function seedSandstormKenya({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // ── Store & Sales Channel ─────────────────────────────────────────────────
  logger.info("🏪 Setting up Sandstorm Kenya store...");
  const [store] = await storeModuleService.listStores();

  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Sandstorm Kenya Online Store",
  });

  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [{ name: "Sandstorm Kenya Online Store" }],
      },
    });
    defaultSalesChannel = result;
    logger.info("  ✅ Sales channel created");
  } else {
    logger.info("  ↩ Sales channel already exists");
  }

  // ── Store currencies: KES (default) + USD ────────────────────────────────
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "kes", is_default: true },
        { currency_code: "usd" },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_sales_channel_id: defaultSalesChannel[0].id },
    },
  });
  logger.info("  ✅ Store configured (KES default currency)");

  // ── Region: Kenya (idempotent) ───────────────────────────────────────
  logger.info("🌍 Setting up Kenya region...");
  const regionModuleService = container.resolve(Modules.REGION);
  const existingRegions = await regionModuleService.listRegions({ name: "Kenya" });
  let region: any;
  if (existingRegions.length) {
    region = existingRegions[0];
    logger.info(`  ↩ Region already exists: ${region.name}`);
  } else {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [{
          name: "Kenya",
          currency_code: "kes",
          countries: ["ke"],
          payment_providers: ["pp_system_default"],
        }],
      },
    });
    region = regionResult[0];
    logger.info(`  ✅ Region created: ${region.name}`);
  }

  // ── Tax regions (idempotent) ─────────────────────────────────────────
  logger.info("🧧 Setting up tax regions...");
  const taxModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxModuleService.listTaxRegions({ country_code: "ke" });
  if (!existingTaxRegions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "ke", provider_id: "tp_system" }],
    });
    logger.info("  ✅ Tax region: Kenya");
  } else {
    logger.info("  ↩ Tax region already exists");
  }

  // ── Stock location: Nairobi Warehouse (idempotent) ───────────────────────
  logger.info("📦 Setting up Nairobi stock location...");
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const existingLocations = await stockLocationModuleService.listStockLocations(
    { name: "Nairobi Workshop & Warehouse" }
  );
  let stockLocation: any;
  if (existingLocations.length) {
    stockLocation = existingLocations[0];
    logger.info(`  ↩ Stock location already exists: ${stockLocation.name}`);
  } else {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [{
          name: "Nairobi Workshop & Warehouse",
          address: { city: "Nairobi", country_code: "KE", address_1: "Industrial Area" },
        }],
      },
    });
    stockLocation = stockLocationResult[0];

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: { default_location_id: stockLocation.id },
      },
    });
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
    logger.info(`  ✅ Stock location: ${stockLocation.name}`);
  }

  // ── Fulfillment & Shipping ────────────────────────────────────────────────
  logger.info("🚚 Setting up shipping...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles[0] ?? null;

  if (!shippingProfile) {
    const { result: spResult } = await createShippingProfilesWorkflow(
      container
    ).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    });
    shippingProfile = spResult[0];
  }

  const existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets({
    name: "Sandstorm Kenya Delivery",
  });

  if (!existingFulfillmentSets.length) {
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Sandstorm Kenya Delivery",
      type: "shipping",
      service_zones: [
        { name: "Kenya", geo_zones: [{ country_code: "ke", type: "country" }] },
        {
          name: "International",
          geo_zones: [
            { country_code: "ug", type: "country" },
            { country_code: "tz", type: "country" },
            { country_code: "za", type: "country" },
            { country_code: "gb", type: "country" },
            { country_code: "us", type: "country" },
            { country_code: "de", type: "country" },
          ],
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    });

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Free Kenya Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Standard", description: "3-5 business days", code: "standard" },
          prices: [{ currency_code: "kes", amount: 0 }],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "International Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[1].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "International", description: "7-14 business days", code: "international" },
          prices: [
            { currency_code: "kes", amount: 350000 },
            { currency_code: "usd", amount: 25 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
    });
    logger.info("  ✅ Shipping options configured");
  } else {
    logger.info("  ↩ Shipping already configured");
  }



  // ── Publishable API Key ────────────────────────────────────────────────────
  logger.info("🔑 Setting up publishable API key...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title"],
    filters: { type: "publishable" },
  });
  publishableApiKey = data?.[0] ?? null;

  if (!publishableApiKey) {
    const { result: [keyResult] } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{
          title: "Sandstorm Kenya Webshop",
          type: "publishable",
          created_by: "",
        }],
      },
    });
    publishableApiKey = keyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  });
  logger.info(`  ✅ Publishable API Key: ${publishableApiKey.token}`);
  logger.info(`  ⚠️  Add this to storefront/.env.local:`);
  logger.info(`     NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`);

  // ── Product Categories (idempotent) ──────────────────────────────────────
  logger.info("📂 Ensuring product categories...");
  const productCategoryModuleService = container.resolve(Modules.PRODUCT);
  const existingCategories = await productCategoryModuleService.listProductCategories(
    {}, { select: ["id", "name", "handle"] }
  );
  const existingHandles = new Set(existingCategories.map((c: any) => c.handle));

  const categoryDefs = [
    { name: "Totes",       handle: "totes" },
    { name: "Backpacks",   handle: "backpacks" },
    { name: "Laptop Bags", handle: "laptop-bags" },
    { name: "Messengers",  handle: "messengers" },
    { name: "Briefcases",  handle: "briefcases" },
    { name: "Duffles",     handle: "duffles" },
    { name: "Weekenders",  handle: "weekenders" },
    { name: "Washbags",    handle: "washbags" },
    { name: "Top Handles", handle: "top-handles" },
    { name: "Clutches",    handle: "clutches" },
    { name: "Wallets",     handle: "wallets" },
  ];

  const toCreate = categoryDefs.filter((c) => !existingHandles.has(c.handle));
  let categoryResult: any[] = [...existingCategories];

  if (toCreate.length > 0) {
    const { result: newCats } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: toCreate.map((c) => ({ ...c, is_active: true })),
      },
    });
    categoryResult = [...categoryResult, ...newCats];
    logger.info(`  ✅ ${toCreate.length} new categories created, ${existingCategories.length} already existed`);
  } else {
    logger.info(`  ↩ All ${categoryResult.length} categories already exist`);
  }

  const cat = (name: string) =>
    categoryResult.find((c: any) => c.name === name)!.id;

  // ── Products ───────────────────────────────────────────────────────────────
  logger.info("🛍️  Creating products...");
  const sc = defaultSalesChannel[0].id;

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // 1. Canvas Adventurer Backpack
        {
          title: "Canvas Adventurer Backpack",
          handle: "canvas-adventurer-backpack",
          description:
            "The Canvas Adventurer Backpack is built for those who refuse to choose between style and function. Handcrafted in our Nairobi workshop using heavy-duty waxed canvas and full-grain vegetable-tanned leather, this pack is designed to accompany you for decades — not just seasons.",
          subtitle: "The original Nairobi everyday carry",
          category_ids: [cat("Backpacks")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Olive Green", "Stone", "Black", "Khaki"] }],
          variants: [
            { title: "Olive Green", sku: "CAB-OLV", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 3250000 }] },
            { title: "Stone",       sku: "CAB-STN", options: { Color: "Stone" },       prices: [{ currency_code: "kes", amount: 3250000 }] },
            { title: "Black",       sku: "CAB-BLK", options: { Color: "Black" },       prices: [{ currency_code: "kes", amount: 3250000 }] },
            { title: "Khaki",       sku: "CAB-KHK", options: { Color: "Khaki" },       prices: [{ currency_code: "kes", amount: 3250000 }] },
          ],
        },
        // 2. Canvas Explorer Tote
        {
          title: "Canvas Explorer Tote",
          handle: "canvas-explorer-tote",
          description:
            "Our most iconic tote, reimagined. The Canvas Explorer Tote pairs waxed canvas with cognac leather handles — a bag that carries your daily essentials with enduring elegance.",
          subtitle: "The everyday icon",
          category_ids: [cat("Totes")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Olive Green", "Tan"] }],
          variants: [
            { title: "Olive Green", sku: "CET-OLV", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 1890000 }] },
            { title: "Tan",         sku: "CET-TAN", options: { Color: "Tan" },         prices: [{ currency_code: "kes", amount: 1890000 }] },
          ],
        },
        // 3. Canvas Adventurer Duffle
        {
          title: "Canvas Adventurer Duffle",
          handle: "canvas-adventurer-duffle",
          description:
            "Whether heading to the bush or a business trip, the Canvas Adventurer Duffle is your ideal travel companion. Spacious, structured, and built to last.",
          subtitle: "Your indispensable travel companion",
          category_ids: [cat("Duffles")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Khaki", "Stone", "Black"] }],
          variants: [
            { title: "Khaki", sku: "CAD-KHK", options: { Color: "Khaki" }, prices: [{ currency_code: "kes", amount: 4090000 }] },
            { title: "Stone", sku: "CAD-STN", options: { Color: "Stone" }, prices: [{ currency_code: "kes", amount: 4090000 }] },
            { title: "Black", sku: "CAD-BLK", options: { Color: "Black" }, prices: [{ currency_code: "kes", amount: 4090000 }] },
          ],
        },
        // 4. Canvas Messenger Bag
        {
          title: "Canvas Messenger Bag",
          handle: "canvas-messenger-bag",
          description:
            "The Canvas Messenger Bag is the everyday carry for the modern urbanite. Adjustable leather strap, full-length flap closure, and a 15\" laptop pocket — everything you need, nothing you don't.",
          subtitle: "The ultimate urban carry",
          category_ids: [cat("Messengers")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Olive Green", "Stone"] }],
          variants: [
            { title: "Olive Green", sku: "CMB-OLV", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 2250000 }] },
            { title: "Stone",       sku: "CMB-STN", options: { Color: "Stone" },       prices: [{ currency_code: "kes", amount: 2250000 }] },
          ],
        },
        // 5. Premium Leather Briefcase
        {
          title: "Premium Leather Briefcase",
          handle: "premium-leather-briefcase",
          description:
            "Crafted from the finest full-grain leather, the Premium Leather Briefcase is a statement piece for the discerning professional. Two main compartments accommodate a 15\" laptop alongside your documents and daily essentials.",
          subtitle: "The executive statement piece",
          category_ids: [cat("Briefcases")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Cognac", "Black"] }],
          variants: [
            { title: "Cognac", sku: "PLB-COG", options: { Color: "Cognac" }, prices: [{ currency_code: "kes", amount: 5490000 }] },
            { title: "Black",  sku: "PLB-BLK", options: { Color: "Black" },  prices: [{ currency_code: "kes", amount: 5490000 }] },
          ],
        },
        // 6. Canvas Washbag
        {
          title: "Canvas Washbag",
          handle: "canvas-washbag",
          description:
            "The Canvas Washbag keeps your travel toiletries beautifully organised. Compact enough for your gym bag, roomy enough for a weekend trip.",
          subtitle: "The organised traveller",
          category_ids: [cat("Washbags")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Khaki", "Olive Green"] }],
          variants: [
            { title: "Khaki",       sku: "CWB-KHK", options: { Color: "Khaki" },       prices: [{ currency_code: "kes", amount: 990000 }] },
            { title: "Olive Green", sku: "CWB-OLV", options: { Color: "Olive Green" }, prices: [{ currency_code: "kes", amount: 990000 }] },
          ],
        },
        // 7. Leather Clutch Purse
        {
          title: "Leather Clutch Purse",
          handle: "leather-clutch-purse",
          description:
            "Timeless and versatile, the Leather Clutch Purse is made from buttery-soft full-grain leather. Sized to carry just the essentials — cards, phone, keys, and lipstick.",
          subtitle: "Timeless and versatile",
          category_ids: [cat("Clutches")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Tan", "Black"] }],
          variants: [
            { title: "Tan",   sku: "LCP-TAN", options: { Color: "Tan" },   prices: [{ currency_code: "kes", amount: 1450000 }] },
            { title: "Black", sku: "LCP-BLK", options: { Color: "Black" }, prices: [{ currency_code: "kes", amount: 1450000 }] },
          ],
        },
        // 8. Slim Leather Wallet
        {
          title: "Slim Leather Wallet",
          handle: "slim-leather-wallet",
          description:
            "Hand-crafted in full-grain leather, this slim billfold wallet holds up to 8 cards plus notes. Designed to slip seamlessly into any pocket.",
          subtitle: "Perfectly slim, perfectly crafted",
          category_ids: [cat("Wallets")],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: sc }],
          options: [{ title: "Color", values: ["Cognac", "Dark Brown"] }],
          variants: [
            { title: "Cognac",     sku: "SLW-COG", options: { Color: "Cognac" },     prices: [{ currency_code: "kes", amount: 690000 }] },
            { title: "Dark Brown", sku: "SLW-DBR", options: { Color: "Dark Brown" }, prices: [{ currency_code: "kes", amount: 690000 }] },
          ],
        },
      ],
    },
  });

  logger.info("  ✅ 8 products created with variants and KES pricing");

  // ── Summary ────────────────────────────────────────────────────────────────
  logger.info("\n" + "═".repeat(60));
  logger.info("🎉 Sandstorm Kenya seed complete!");
  logger.info("═".repeat(60));
  logger.info("📋 Next steps:");
  logger.info("   1. Admin UI:  http://localhost:9000/app");
  logger.info(`   2. Add to storefront/.env.local:`);
  logger.info(`      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`);
  logger.info("   3. Restart Next.js storefront");
  logger.info("═".repeat(60));
}
