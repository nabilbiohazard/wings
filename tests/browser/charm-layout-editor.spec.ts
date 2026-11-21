import { test, expect } from "@playwright/test";
import fs from "node:fs";

test("admin can drag, nudge, undo, add/remove slots and save coordinates", async ({
  page,
}) => {
  const php = fs.readFileSync(
    "wordpress/wings-commerce/charm-layouts.php",
    "utf8",
  );
  // Use the actual PHP-rendered static controls rather than a second UI fixture.
  const controls = [...php.matchAll(/echo '([^']*)';/g)]
    .map((match) => match[1])
    .filter(
      (html) =>
        html.startsWith("<p><label>") ||
        html.startsWith("<p>Drag") ||
        html.startsWith('<div class="wings-layout') ||
        html.startsWith("<p role="),
    )
    .join("");
  const defaults = JSON.parse(
    fs.readFileSync("wordpress/wings-commerce/assets/bc2-layout.json", "utf8"),
  );
  const image = `data:image/webp;base64,${fs.readFileSync("public/images/bracelet-bc-2.webp").toString("base64")}`;
  await page.setContent(
    `<form><div id="wings-layout-editor"><label><input type="checkbox" id="wings-layout-enabled" checked> Use fixed slots</label>${controls}</div><button id="save">Update</button></form>`,
  );
  await page.locator("#wings-layout-editor").evaluate(
    (root, data) => {
      root.setAttribute(
        "data-initial",
        JSON.stringify({ ...data.defaults, image: data.image }),
      );
    },
    { defaults, image },
  );
  await page.addStyleTag({
    path: "wordpress/wings-commerce/assets/charm-layout-editor.css",
  });
  await page.addScriptTag({
    path: "wordpress/wings-commerce/assets/charm-layout-editor.js",
  });
  await expect(page.locator(".wings-slot")).toHaveCount(11);
  await page.locator("#wings-layout-enabled").check();
  await page.locator("#wings-slot-list button").first().click();
  await page.locator(".wings-layout-canvas").press("ArrowRight");
  let value = await page.locator("#wings-layout-value").inputValue();
  expect(JSON.parse(value).slots[0].x).toBe(457);
  await page.locator('[data-action="undo"]').click();
  value = await page.locator("#wings-layout-value").inputValue();
  expect(JSON.parse(value).slots[0].x).toBe(456);
  await page.locator('[data-axis="x"]').fill("450");
  await page.locator('[data-axis="x"]').dispatchEvent("change");
  expect(
    JSON.parse(await page.locator("#wings-layout-value").inputValue()).slots[0]
      .x,
  ).toBe(450);
  await page.locator('[data-action="add"]').click();
  await expect(page.locator(".wings-slot")).toHaveCount(12);
  await page.locator('[data-action="remove"]').click();
  await expect(page.locator(".wings-slot")).toHaveCount(11);
  await page.locator("#wings-layout-max").fill("8");
  await page.locator("#wings-layout-max").dispatchEvent("change");
  expect(
    JSON.parse(await page.locator("#wings-layout-value").inputValue())
      .maxCharms,
  ).toBe(8);
  // Pointer capture must keep working when marker DOM nodes are re-rendered.
  const marker = await page.locator(".wings-slot").first().boundingBox();
  const canvas = await page.locator(".wings-layout-canvas").boundingBox();
  if (!marker || !canvas) throw new Error("Missing canvas");
  await page.mouse.move(
    marker.x + marker.width / 2,
    marker.y + marker.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    canvas.x + canvas.width * 0.7,
    canvas.y + canvas.height * 0.3,
    { steps: 4 },
  );
  await page.mouse.up();
  const moved = JSON.parse(
    await page.locator("#wings-layout-value").inputValue(),
  ).slots[0];
  expect(moved.x).toBeCloseTo(420, 0);
  expect(moved.y).toBeCloseTo(180, 0);
  await page.screenshot({
    path: `.backups/charm-layout-editor-${test.info().project.name}.png`,
    fullPage: true,
  });
});
