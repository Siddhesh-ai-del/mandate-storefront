/** Seeded catalog — "Aria's Audio". One shop, 9 items, agent-readable. */

export interface Product {
  sku: string;
  name: string;
  priceCents: number;
  category: string;
  rating: number;
  stock: number;
  blurb: string;
}

export const SHOP_ID = "aria-audio";
export const SHOP_NAME = "Aria's Audio";

export const CATALOG: Product[] = [
  { sku: "aria-hd-700", name: "Aria HD-700 Over-Ear", priceCents: 3499, category: "headphones", rating: 4.8, stock: 12, blurb: "45mm drivers, memory-foam pads, detachable cable." },
  { sku: "aria-hd-900", name: "Aria HD-900 Reference", priceCents: 8999, category: "headphones", rating: 4.9, stock: 4, blurb: "Studio reference — planar magnetic." },
  { sku: "aria-imo-5", name: "Aria IEM-5 In-Ear Monitors", priceCents: 2499, category: "headphones", rating: 4.6, stock: 20, blurb: "Hybrid drivers, 5 tip sizes, hard case." },
  { sku: "aria-buds-air", name: "Aria Buds Air", priceCents: 1299, category: "headphones", rating: 4.3, stock: 31, blurb: "ANC, 24h with case, USB-C." },
  { sku: "aria-buds-lite", name: "Aria Buds Lite", priceCents: 699, category: "headphones", rating: 4.1, stock: 50, blurb: "Featherweight, 18h battery." },
  { sku: "aria-cbl-braid", name: "Braided Audio Cable 2m", priceCents: 2499, category: "cables", rating: 4.4, stock: 40, blurb: "Oxygen-free copper, 3.5mm to 6.35mm." },
  { sku: "aria-cbl-usbc", name: "USB-C to 3.5mm Cable 1m", priceCents: 1299, category: "cables", rating: 4.2, stock: 44, blurb: "DAC-in-cable, plug-and-play." },
  { sku: "aria-stand-al", name: "Aluminum Headphone Stand", priceCents: 899, category: "accessories", rating: 4.5, stock: 25, blurb: "CNC aluminium, felt contact points." },
  { sku: "aria-mon-299", name: "Aria Studio Monitors (pair)", priceCents: 29900, category: "studio-monitors", rating: 4.7, stock: 2, blurb: "5-inch active pair — not in a typical listener mandate." },
];

/** WebMCP-style structured capabilities exposed to agents. */
export const CAPABILITIES = [
  {
    name: "search_items",
    description: "Filter the catalog by text, category, and max price.",
    input: { query: "string?", category: "string?", maxPriceCents: "number?" },
    output: { items: "Product[]" },
  },
  {
    name: "get_item",
    description: "Fetch one product by SKU.",
    input: { sku: "string" },
    output: { item: "Product" },
  },
  {
    name: "start_checkout",
    description: "Begin a PayPal order for a verified, in-mandate cart. Server enforces a signed spend mandate.",
    input: { sku: "string", mandateId: "string", mandateSignature: "string" },
    output: { orderId: "string", status: "PAYER_APPROVAL_REQUIRED" },
  },
] as const;
