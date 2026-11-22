import { expect, test } from "@playwright/test";

test("the hero starts its video after the poster loads", async ({ page, isMobile }) => {
  const poster = isMobile ? "home-hero-mobile.webp" : "home-hero.webp";
  const film = isMobile ? "home-hero-mobile.mp4" : "videoplayback.mp4";

  let releasePoster!: () => void;
  const holdPoster = new Promise<void>((resolve) => {
    releasePoster = resolve;
  });
  await page.route(`**/images/${poster}`, async (route) => {
    await holdPoster;
    await route.continue();
  });

  const hero = page.locator("main > section").first();
  const video = hero.locator("video");
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await video.getAttribute("src")).toBeNull();
  } finally {
    releasePoster();
  }

  await expect(video).toHaveAttribute("src", `/videos/${film}`);
  await expect.poll(() =>
    video.evaluate((element: HTMLVideoElement) =>
      element.muted && element.playsInline && !element.paused && element.currentTime > 0,
    ),
  ).toBe(true);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() =>
    video.evaluate((element: HTMLVideoElement) => element.paused),
  ).toBe(true);
});
