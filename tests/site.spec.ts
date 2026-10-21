import { expect, test } from "@playwright/test";

const paths = [
  "/",
  "/tjanster",
  "/priser",
  "/kundcase",
  "/om-oss",
  "/kontakt",
  "/faq",
  "/integritetspolicy",
];

test("all production pages reload, render local resources and fit the viewport", async ({
  page,
  baseURL,
}, testInfo) => {
  const external: string[] = [];
  const failed: string[] = [];
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().includes("favicon"))
      failed.push(`${response.status()} ${response.url()}`);
  });
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (url.startsWith("http") && new URL(url).origin !== new URL(baseURL!).origin) {
      external.push(url);
      await route.abort();
    } else await route.continue();
  });
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await page.reload();
    await expect(page.locator("header")).toBeVisible();
    await page.locator("details[data-screenshot]").evaluateAll((elements) =>
      elements.forEach((element) => {
        if (element instanceof HTMLDetailsElement) element.open = true;
      }),
    );
    // Trigger the actual native lazy loads without loading unrelated external customer links.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    });
    await expect
      .poll(
        () =>
          page.locator("img").evaluateAll((images) =>
            images
              .filter(
                (image) =>
                  image instanceof HTMLImageElement &&
                  (!image.complete || image.naturalWidth === 0),
              )
              .map((image) => ({
                src: image.getAttribute("src"),
                loading: image.getAttribute("loading"),
              })),
          ),
        { message: path },
      )
      .toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      path,
    ).toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: testInfo.outputPath(`${path.replaceAll("/", "") || "home"}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
  expect(external).toEqual([]);
  expect(failed).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test("reduced-motion visitors never request the hero video", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", (request) => {
    if (/\.(webm|mp4)(\?|$)/.test(request.url())) videos.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(videos).toEqual([]);
  expect(await page.locator("video[src]").count()).toBe(0);
});

test("motion-enabled visitors receive the hero video on every viewport", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("video[src]")).toHaveCount(1);
  await expect(page.locator("video[src]")).toHaveAttribute(
    "src",
    "/assets/video/dalanord-hero.webm",
  );
});

test("legacy service URLs and case anchors land below the fixed menu", async ({ page }) => {
  await page.goto("/tjanster/cms-adminpanel");
  await expect(page).toHaveURL(/\/tjanster#cms-adminpanel$/);
  await expect(page.locator("#cms-adminpanel")).toBeInViewport();
  await page.goto("/kundcase#rozans");
  // Validate actual IDs from home links, without assuming a renamed slug.
  await page.goto("/");
  const link = page.locator('a[href^="/kundcase#"]').first();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"));
  const target = page.locator(`#${href!.split("#")[1]}`);
  await expect(target).toBeInViewport();
  await expect
    .poll(() => target.evaluate((el) => el.getBoundingClientRect().top))
    .toBeGreaterThanOrEqual(75);
});

test("quote choices survive contact navigation and reload; failed submission preserves text", async ({
  page,
}) => {
  await page.goto("/priser");
  const addon = page.getByRole("button", { name: /CMS & adminpanel/ });
  await addon.click();
  await expect(addon).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("link", { name: /Begär offert/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/kontakt\?quote=/);
  await expect(page.getByText("CMS & adminpanel").first()).toBeVisible();
  await page.reload();
  await expect(page.getByText("CMS & adminpanel").first()).toBeVisible();
  await page.getByRole("textbox", { name: /^Namn/ }).fill("Testperson QA");
  await page.getByRole("textbox", { name: /^E-post/ }).fill("qa@example.invalid");
  await page
    .getByRole("textbox", { name: "Meddelande" })
    .fill("Detta är ett lokalt test som aldrig ska skicka något mejl.");
  await page.waitForTimeout(2100); // Form's deliberate anti-bot minimum elapsed time.
  await page.getByRole("button", { name: "Skicka förfrågan", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Inget har skickats");
  await expect(page.getByRole("textbox", { name: "Meddelande" })).toHaveValue(
    "Detta är ett lokalt test som aldrig ska skicka något mejl.",
  );
  expect(page.url()).not.toContain("example.invalid");
  await page.goto("/priser");
  await expect(page.getByRole("button", { name: /CMS & adminpanel/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("package dialog traps keyboard focus, closes with Escape and restores its trigger", async ({
  page,
}) => {
  await page.goto("/priser");
  const firstPackage = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Mini", exact: true }) });
  await firstPackage.locator("summary").click();
  const trigger = firstPackage.getByRole("button", { name: /Välj Mini/ });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 18; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("direct unknown paths return a real 404", async ({ page }) => {
  const response = await page.goto("/saknas-qa-404");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Sidan finns inte", { exact: true })).toBeVisible();
});

test("metadata, local sharing image, robots and sitemap agree with the configured origin", async ({
  page,
  request,
}) => {
  let canonicalOrigin: string | null = null;
  for (const path of paths) {
    await page.goto(path);
    await expect(page).toHaveTitle(/DALADANA/);
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveAttribute("content", /\/assets\/social-share\.jpg$/);
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.count()) {
      const url = new URL((await canonical.getAttribute("href"))!);
      canonicalOrigin = url.origin;
      expect(url.pathname).toBe(path);
      expect(url.search).toBe("");
    } else {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
    }
  }
  const sharing = await request.get("/assets/social-share.jpg");
  expect(sharing.status()).toBe(200);
  expect(sharing.headers()["content-type"]).toContain("image/jpeg");
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const sitemap = await request.get("/sitemap.xml");
  if (canonicalOrigin) {
    expect(await robots.text()).toContain(`${canonicalOrigin}/sitemap.xml`);
    expect(sitemap.status()).toBe(200);
    for (const path of paths)
      expect(await sitemap.text()).toContain(`<loc>${canonicalOrigin}${path}</loc>`);
  } else {
    expect(await robots.text()).toContain("Disallow: /");
    expect(sitemap.status()).toBe(503);
  }
});

test("cross-site server-function requests fail CSRF validation", async ({ page, request }) => {
  await page.goto("/kontakt");
  await page.getByRole("textbox", { name: /^Namn/ }).fill("Testperson QA");
  await page.getByRole("textbox", { name: /^E-post/ }).fill("csrf@example.invalid");
  await page
    .getByRole("textbox", { name: "Meddelande" })
    .fill("Ett lokalt test av serverns CSRF-skydd.");
  await page.waitForTimeout(2100);
  const requestPromise = page.waitForRequest((req) => req.method() === "POST");
  await page.getByRole("button", { name: "Skicka förfrågan", exact: true }).click();
  const original = await requestPromise;
  const forged = await request.post(original.url(), {
    headers: {
      "content-type": original.headers()["content-type"] ?? "application/json",
      origin: "https://untrusted.example.invalid",
      "sec-fetch-site": "cross-site",
    },
    data: original.postData()!,
  });
  expect(forged.status()).toBe(403);
});
