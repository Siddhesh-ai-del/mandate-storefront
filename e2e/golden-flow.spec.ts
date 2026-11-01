import { test, expect, type Page } from "@playwright/test";

/** Golden flow E2E: mint → compliant run → approve+capture → violation BLOCKED → reset.
 *  Runs 3× via config `for` in package.json script (judge-breaking resistance). */

async function mintMandate(page: Page) {
  await page.getByRole("button", { name: "Mint Spend Mandate" }).click();
  await page.getByRole("button", { name: "Sign mandate" }).click();
  await expect(page.getByText("ACTIVE")).toBeVisible();
}

test("golden flow: compliant purchase captures and decrements the mandate", async ({ page }) => {
  await page.goto("/");

  // Chips visible immediately (Stage-1 "runs consistently")
  await expect(page.getByText("PayPal: DEMO MODE")).toBeVisible();
  await expect(page.getByText("LLM: SCRIPTED FALLBACK")).toBeVisible();

  // Storefront loads
  await expect(page.getByText("Aria HD-700 Over-Ear")).toBeVisible();

  // 1. Mint
  await mintMandate(page);

  // 2. Compliant run → approve sheet
  await page.getByRole("button", { name: "Run: compliant goal" }).click();
  const approveBtn = page.getByRole("button", { name: "Approve & capture (sandbox buyer)" });
  await expect(approveBtn).toBeVisible({ timeout: 10_000 });

  // 3. Approve & capture → mandate decrements
  await approveBtn.click();
  await expect(page.getByText("Spent")).toBeVisible();
  await expect(page.getByText("$34.99").first()).toBeVisible();

  // Audit log recorded the capture
  await expect(page.getByText("COMPLETED", { exact: false }).first()).toBeVisible();
});

test("violation goal: mandate gate blocks and slams the banner", async ({ page }) => {
  await page.goto("/");
  await mintMandate(page);

  await page.getByRole("button", { name: "Run: violation goal" }).click();

  // The slam banner
  const banner = page.getByRole("alert");
  await expect(banner).toBeVisible({ timeout: 10_000 });
  await expect(banner).toContainText("SPEND MANDATE VIOLATION");
  await expect(banner).toContainText("create_order was never invoked");

  // No order was created: no approve sheet
  await expect(
    page.getByRole("button", { name: "Approve & capture (sandbox buyer)" })
  ).not.toBeVisible();

  // BLOCKED row in audit grid
  await expect(page.getByText("OUT_OF_SCOPE", { exact: false }).first()).toBeVisible();

  // Banner dismissible
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(banner).not.toBeVisible();
});

test("reset returns the demo to a clean state", async ({ page }) => {
  await page.goto("/");
  await mintMandate(page);
  await page.getByRole("button", { name: "Run: violation goal" }).click();
  await expect(page.getByRole("alert")).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Reset demo" }).click();

  // Back to mint prompt
  await expect(page.getByRole("button", { name: "Mint Spend Mandate" })).toBeVisible();
  await expect(page.getByRole("alert")).not.toBeVisible();
});
