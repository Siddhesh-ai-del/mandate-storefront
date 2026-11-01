import { Router } from "express";
import { CATALOG, CAPABILITIES, SHOP_ID, SHOP_NAME } from "../data/catalog";

export const storefrontRouter = Router();

/** Agent-readable storefront: catalog + how-to-buy capabilities (WebMCP-style). */
storefrontRouter.get("/storefront", (_req, res) => {
  res.json({
    shop: { id: SHOP_ID, name: SHOP_NAME, currency: "USD" },
    capabilities: CAPABILITIES,
    items: CATALOG,
  });
});
