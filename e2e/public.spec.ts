import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page renders a Hindi document with a main landmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expect(page.locator("main")).toBeVisible();
});

test("home page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["critical", "serious"].includes(item.impact ?? ""))).toEqual([]);
});

test("contact form keeps invalid submissions in the browser", async ({ page }) => {
  await page.goto("/contact");
  await page.locator('form button[type="submit"]').click();
  const isInvalid = await page.locator('input[name="name"]').evaluate((input: HTMLInputElement) => !input.validity.valid);
  expect(isInvalid).toBeTruthy();
});

test("unknown paths use the branded not-found page", async ({ page }) => {
  const response = await page.goto("/this-url-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator('a[href="/"]').first()).toBeVisible();
});

test("SEO utility routes respond", async ({ request }) => {
  const [sitemap, rss, robots] = await Promise.all([
    request.get("/sitemap.xml"),
    request.get("/rss.xml"),
    request.get("/robots.txt"),
  ]);
  expect(sitemap.ok()).toBeTruthy();
  expect(rss.ok()).toBeTruthy();
  expect(robots.ok()).toBeTruthy();
});
