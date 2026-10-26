import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page renders a Hindi document with a main landmark", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expect(page.locator("main")).toBeVisible();
});

test("home page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(
    results.violations.filter((item) =>
      ["critical", "serious"].includes(item.impact ?? ""),
    ),
  ).toEqual([]);
});

test("category links open their category page", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/category/history/"]').first().click();
  await expect(page).toHaveURL(/\/category\/history\/$/);
  await expect(page.locator("h1")).toContainText("इतिहास");
});

test("contact form keeps invalid submissions in the browser", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.locator('form button[type="submit"]').click();
  const isInvalid = await page
    .locator('input[name="name"]')
    .evaluate((input: HTMLInputElement) => !input.validity.valid);
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

test("editorial and media routes reject unauthenticated visitors", async ({
  page,
  request,
}) => {
  await page.goto(
    "/admin/articles/00000000-0000-0000-0000-000000000000/preview",
  );
  await expect(page).toHaveURL(/\/admin\/login/);

  const media = await request.post("/api/admin/media/sign", {
    data: { fileName: "test.png", fileType: "image/png", fileSize: 100 },
  });
  expect(media.status()).toBe(401);
});

test("scheduled publishing requires its cron secret", async ({ request }) => {
  const response = await request.get("/api/cron/publish-scheduled");
  expect(response.status()).toBe(401);
});

test("redirect endpoint preserves its permanent redirect contract", async ({
  request,
}) => {
  const response = await request.get("/sitemap-index.xml", { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers()["location"]).toContain("/sitemap.xml");
});
