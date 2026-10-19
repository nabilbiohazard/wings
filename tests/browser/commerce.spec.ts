import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test("rejected quote is replaced instead of retrying the stale order request", async ({
  page,
}) => {
  await mockStore(page);
  let quotes = 0;
  const requests: { quote_id: string; idempotency_key: string }[] = [];
  await page.route("**/api/commerce/checkout/quote", (route) =>
    route.fulfill({
      json: { ...quote, id: (++quotes === 1 ? "a" : "b").repeat(48) },
    }),
  );
  await page.route("**/api/commerce/checkout/order", (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill(
      requests.length === 1
        ? {
            status: 409,
            json: {
              message: "تغییر در مبلغ سفارش؛ دوباره محاسبه کنید. (نسخه 1.2.3)",
            },
          }
        : { json: { order } },
    );
  });
  await page.goto("/checkout");
  await page.getByRole("radio", { name: "منزل" }).check();
  const calculate = page.getByRole("button", {
    name: "محاسبه مبلغ و هزینه ارسال",
  });
  const submit = page.getByRole("button", {
    name: "ثبت سفارش بدون پرداخت",
    exact: true,
  });
  await calculate.click();
  await submit.click();
  await expect(page.getByText(/تغییر در مبلغ سفارش/)).toBeVisible();
  expect(
    await page.evaluate(() => sessionStorage.getItem("wings-pending-order")),
  ).toBeNull();
  await calculate.click();
  await submit.click();
  await expect(
    page.getByRole("heading", { name: "سفارش #1001 ثبت شد" }),
  ).toBeVisible();
  expect(requests[0].quote_id).toBe("a".repeat(48));
  expect(requests[1].quote_id).toBe("b".repeat(48));
  expect(requests[1].idempotency_key).not.toBe(requests[0].idempotency_key);
});

const customer = {
  id: 7,
  phone: "09121234567",
  first_name: "نیلوفر",
  last_name: "احمدی",
  email: "niloofar@example.com",
};
const address = {
  id: "c36b2367-7875-4446-a93a-c88f386fe2e5",
  label: "منزل",
  first_name: "نیلوفر",
  last_name: "احمدی",
  phone: customer.phone,
  country: "IR",
  state: "THR",
  city: "تهران",
  address_1: "خیابان بهار، پلاک ۱۰",
  address_2: "واحد ۲",
  postcode: "1234567890",
};
const product = {
  id: 10,
  slug: "necklace",
  name: "گردنبند پروانه",
  image: "",
  images: [],
  category: "necklaces",
  price: 25000,
  isInStock: true,
};
const quote = {
  id: "a".repeat(48),
  currency: "IRR",
  subtotal: "250000",
  discount: "0",
  shipping_total: "50000",
  tax: "0",
  total: "300000",
  shipping: [
    {
      package: 0,
      name: "بسته ۱",
      selected: "flat_rate:1",
      rates: [{ id: "flat_rate:1", label: "پست", cost: "50000" }],
    },
  ],
  items: [{ name: product.name, quantity: 1, total: "250000" }],
};
const order = {
  id: 1001,
  number: "1001",
  status: "on-hold",
  status_label: "در انتظار بررسی",
  created: "2026-10-14T12:00:00+03:30",
  currency: "IRR",
  total: "300000",
  subtotal: "250000",
  discount: "0",
  shipping_total: "50000",
  tax: "0",
  payment_title: "ثبت سفارش بدون پرداخت آنلاین",
  customer_note: "",
  shipping: address,
  items: [
    {
      id: 1,
      product_id: 10,
      variation_id: 0,
      name: product.name,
      quantity: 1,
      total: "250000",
      image: "",
      attributes: [],
    },
  ],
  notes: [
    {
      id: 1,
      note: "سفارش شما در حال آماده‌سازی است.",
      created: "2026-10-14T12:00:00+03:30",
    },
  ],
  can_cancel: true,
};

async function mockStore(page: Page, loggedIn = true) {
  let authenticated = loggedIn;
  let addresses = [address];
  let orderRequests = 0;
  let receivedBody: Record<string, unknown> | null = null;
  await page.route("**/api/woo/products", (route) =>
    route.fulfill({ json: { success: true, products: [product] } }),
  );
  await page.route("**/api/commerce/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace("/api/commerce/", "");
    if (path === "auth/request")
      return route.fulfill({ json: { retry_after: 60 } });
    if (path === "auth/verify") {
      authenticated = true;
      return route.fulfill({ json: { customer } });
    }
    if (path === "auth/logout") {
      authenticated = false;
      return route.fulfill({ json: { success: true } });
    }
    if (path === "locations")
      return route.fulfill({
        json: { states: { THR: "تهران", ESF: "اصفهان" } },
      });
    if (!authenticated)
      return route.fulfill({
        status: 401,
        json: { message: "برای ادامه وارد شوید." },
      });
    if (path === "me") return route.fulfill({ json: { customer } });
    if (path === "cart")
      return route.fulfill({
        json: { items: loggedIn ? [{ ...product, quantity: 1 }] : [] },
      });
    if (path.startsWith("addresses")) {
      if (request.method() === "POST")
        addresses = [
          ...addresses,
          {
            ...request.postDataJSON(),
            id: "d36b2367-7875-4446-a93a-c88f386fe2e5",
          },
        ];
      if (request.method() === "DELETE")
        addresses = addresses.filter((item) => item.id !== path.split("/")[1]);
      return route.fulfill({ json: { addresses } });
    }
    if (path === "checkout/quote") {
      receivedBody = request.postDataJSON();
      return route.fulfill({ json: quote });
    }
    if (path === "checkout/order") {
      orderRequests++;
      return route.fulfill({ json: { order } });
    }
    if (path.startsWith("orders/")) return route.fulfill({ json: { order } });
    if (path === "orders")
      return route.fulfill({ json: { orders: [order], total: 1, pages: 1 } });
    return route.fulfill({ status: 404, json: { message: "یافت نشد" } });
  });
  return { requests: () => orderRequests, body: () => receivedBody };
}

test("SMS login exposes real account navigation after verification", async ({
  page,
}) => {
  await mockStore(page, false);
  await page.goto("/account");
  await page
    .getByRole("textbox", { name: "شماره موبایل", exact: true })
    .fill("۰۹۱۲۱۲۳۴۵۶۷");
  await page.getByRole("button", { name: "دریافت کد ورود" }).click();
  await page
    .getByRole("textbox", { name: "کد ورود", exact: true })
    .fill("۱۲۳۴");
  await page.getByRole("button", { name: "تأیید و ورود" }).click();
  await expect(
    page.getByRole("navigation", { name: "حساب کاربری" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "آدرس‌های من" })).toBeVisible();
});

test("Console OTP accepts the complete provider code without truncating it", async ({
  page,
}) => {
  await mockStore(page, false);
  await page.route("**/api/commerce/auth/request", (route) =>
    route.fulfill({ json: { retry_after: 60, code_length: 10 } }),
  );
  const sent = page.waitForRequest((request) =>
    request.url().endsWith("/api/commerce/auth/verify"),
  );
  await page.goto("/account");
  await page
    .getByRole("textbox", { name: "شماره موبایل", exact: true })
    .fill("09121234567");
  await page
    .getByRole("button", { name: "دریافت کد ورود", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "کد ورود", exact: true })
    .fill("۱۲۳۴۵۶۷۸۹۰");
  await page.getByRole("button", { name: "تأیید و ورود", exact: true }).click();
  expect((await sent).postDataJSON().code).toBe("1234567890");
  await expect(
    page.getByRole("navigation", { name: "حساب کاربری" }),
  ).toBeVisible();
});

test("address book saves a WooCommerce province code and recipient details", async ({
  page,
}) => {
  await mockStore(page);
  await page.goto("/account/addresses");
  await page.getByRole("button", { name: "+ آدرس جدید", exact: true }).click();
  await page.getByRole("textbox", { name: "عنوان آدرس" }).fill("دفتر");
  await page
    .getByRole("combobox", { name: "استان", exact: true })
    .selectOption("ESF");
  await page.getByRole("textbox", { name: "شهر", exact: true }).fill("اصفهان");
  await page
    .getByRole("textbox", { name: "کد پستی ده‌رقمی" })
    .fill("1234567890");
  await page
    .getByRole("textbox", { name: "آدرس کامل" })
    .fill("خیابان نمونه، پلاک ۵");
  await page.getByRole("button", { name: "ذخیره آدرس", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "دفتر", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("اصفهان، اصفهان، خیابان نمونه، پلاک ۵"),
  ).toBeVisible();
});

test("checkout calculates on server and submits exactly one unpaid order", async ({
  page,
}) => {
  const store = await mockStore(page);
  await page.goto("/checkout");
  await page.getByRole("radio", { name: "منزل" }).check();
  await page.getByRole("button", { name: "محاسبه مبلغ و هزینه ارسال" }).click();
  await expect(page.getByText("مبلغ نهایی سفارش")).toBeVisible();
  expect(store.body()).toMatchObject({
    items: [{ id: 10, quantity: 1 }],
    address_id: address.id,
  });
  expect(store.body()).not.toHaveProperty("total");
  const submit = page.getByRole("button", {
    name: "ثبت سفارش بدون پرداخت",
    exact: true,
  });
  await submit.click();
  await expect(
    page.getByRole("heading", { name: "سفارش #1001 ثبت شد" }),
  ).toBeVisible();
  expect(store.requests()).toBe(1);
  await page.getByRole("link", { name: "مشاهده و پیگیری سفارش" }).click();
  await expect(
    page.getByText("سفارش شما در حال آماده‌سازی است."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "لغو سفارش", exact: true }),
  ).toBeVisible();
});

test("foreign order errors are shown without displaying another customer's data", async ({
  page,
}) => {
  await mockStore(page);
  await page.route("**/api/commerce/orders/999", (route) =>
    route.fulfill({ status: 404, json: { message: "سفارش پیدا نشد." } }),
  );
  await page.goto("/account/orders/999");
  await expect(page.locator("p[role=alert]")).toContainText("سفارش پیدا نشد.");
  await expect(page.getByText("سفارش #1001", { exact: true })).toHaveCount(0);
});

test("a lost order response is recovered without submitting a second order", async ({
  page,
}) => {
  await mockStore(page);
  let created = 0;
  await page.route("**/api/commerce/checkout/order", async (route) => {
    created++;
    await route.fulfill({ status: 502, json: { message: "ارتباط قطع شد" } });
  });
  await page.route("**/api/commerce/checkout/requests/*", (route) =>
    route.fulfill({ json: { pending: true, order } }),
  );
  await page.goto("/checkout");
  await page.getByRole("radio", { name: "منزل" }).check();
  await page.getByRole("button", { name: "محاسبه مبلغ و هزینه ارسال" }).click();
  await page
    .getByRole("button", { name: "ثبت سفارش بدون پرداخت", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "بررسی نتیجه ثبت سفارش" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "بررسی نتیجه سفارش", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "سفارش #1001 ثبت شد" }),
  ).toBeVisible();
  expect(created).toBe(1);
});

test("variable product selections and quantity reach the saved cart", async ({
  page,
}) => {
  await mockStore(page);
  const variable = { ...product, id: 20, hasOptions: true };
  await page.route("**/api/woo/products", (route) =>
    route.fulfill({ json: { success: true, products: [variable] } }),
  );
  await page.route("**/api/commerce/products/20/variations", (route) =>
    route.fulfill({
      json: {
        attributes: [
          {
            key: "attribute_pa_color",
            name: "رنگ",
            options: [
              { value: "pink", label: "صورتی" },
              { value: "blue", label: "آبی" },
            ],
          },
        ],
        variations: [
          {
            id: 21,
            label: "صورتی",
            price: "250000",
            currency: "IRR",
            in_stock: true,
            purchasable: true,
            attributes: { attribute_pa_color: "pink" },
          },
          {
            id: 22,
            label: "رنگ دلخواه",
            price: "300000",
            currency: "IRR",
            in_stock: true,
            purchasable: true,
            attributes: { attribute_pa_color: "" },
          },
        ],
      },
    }),
  );
  await page.goto("/account");
  await page
    .getByRole("button", { name: /جستجو/ })
    .filter({ visible: true })
    .first()
    .click();
  await page
    .getByRole("searchbox", { name: "جستجوی محصولات", exact: true })
    .fill(variable.name);
  await page.getByRole("button", { name: variable.name, exact: true }).click();
  await page
    .getByRole("combobox", { name: "رنگ", exact: true })
    .selectOption("blue");
  await page.getByRole("spinbutton", { name: "تعداد", exact: true }).fill("2");
  const saved = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/commerce/cart") &&
      request.method() === "PUT" &&
      request
        .postDataJSON()
        .items.some(
          (item: { variation_id?: number }) => item.variation_id === 22,
        ),
  );
  await page
    .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
    .click();
  const request = await saved;
  expect(request.postDataJSON().items).toContainEqual({
    id: 20,
    variation_id: 22,
    quantity: 2,
    attributes: { attribute_pa_color: "blue" },
  });
  await expect(page.getByText("رنگ: آبی", { exact: true })).toBeVisible();
});

test("checkout layout fits the viewport", async ({ page }) => {
  await mockStore(page);
  await page.goto("/checkout");
  await page.getByRole("radio", { name: "منزل" }).check();
  await page.getByRole("button", { name: "محاسبه مبلغ و هزینه ارسال" }).click();
  await expect(
    page.getByRole("button", { name: "ثبت سفارش بدون پرداخت", exact: true }),
  ).toBeVisible();
  const width = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(width.page).toBeLessThanOrEqual(width.viewport);
  await page.screenshot({
    path: `test-results/checkout-${test.info().project.name}.png`,
    fullPage: true,
  });
});

test("server routes reject foreign origins, arbitrary paths, and oversized JSON", async ({
  request,
  baseURL,
}) => {
  const foreign = await request.post("/api/commerce/auth/request", {
    headers: { Origin: "https://foreign.example" },
    data: { phone: "09121234567" },
  });
  expect(foreign.status()).toBe(403);
  const missing = await request.get("/api/commerce/customers/7");
  expect(missing.status()).toBe(404);
  const oversized = await request.post("/api/commerce/auth/request", {
    headers: { Origin: baseURL! },
    data: { phone: "a".repeat(40000) },
  });
  expect(oversized.status()).toBe(413);
});

test("a saved personal design enters cart and checkout with the original placement", async ({
  page,
}) => {
  await mockStore(page);
  const saved = {
    id: "a36b2367-7875-4446-a93a-c88f386fe2e5",
    savedAt: "2026-10-14T12:00:00Z",
    product: { ...product, category: "necklace" },
    charms: [
      {
        instanceId: "original-charm",
        x: 300.25,
        y: 500.75,
        rotation: -27.5,
        charm: {
          id: "clover",
          name: "Clover",
          image: "/images/charms/clover.png",
          price: 10000,
        },
      },
    ],
  };
  const prepared = {
    ...saved.product,
    quantity: 1,
    price: 35000,
    design: { ...saved, version: 1 },
  };
  let sent: Record<string, unknown> | undefined;
  await page.addInitScript(
    (design) =>
      localStorage.setItem("wings.saved-designs.v1", JSON.stringify([design])),
    saved,
  );
  await page.route("**/api/commerce/designs/prepare", (route) => {
    sent = route.request().postDataJSON();
    return route.fulfill({ json: { item: prepared } });
  });
  await page.goto("/account");
  await page
    .getByRole("button", { name: "علاقه‌مندی‌ها", exact: true })
    .click();
  const persisted = page.waitForRequest(
    (request) =>
      request.url().endsWith("/api/commerce/cart") &&
      request.method() === "PUT" &&
      request
        .postDataJSON()
        .items.some((item: { design?: unknown }) => item.design),
  );
  await page
    .getByRole("button", { name: "افزودن طرح به سبد خرید", exact: true })
    .click();
  await persisted;
  expect(sent).toMatchObject({
    id: 10,
    design: { version: 1, charms: [{ x: 300.25, y: 500.75, rotation: -27.5 }] },
  });
  await expect(page.getByText("طرح شخصی · ۱ چارم")).toBeVisible();
  await page
    .getByRole("link", { name: "ادامه و ثبت سفارش", exact: true })
    .click();
  await expect(page.getByText("همین طرح · ۱ چارم")).toBeVisible();
  const overlay = page
    .locator("main div[aria-hidden=true] div.absolute")
    .filter({ has: page.locator('img[src="/images/charms/clover.png"]') });
  await expect(overlay).toHaveCSS("transform-origin", /.+/);
  const style = await overlay.getAttribute("style");
  expect(style).toContain("rotate(-27.5deg)");
  expect(style).toContain("83.4583");
});

test("an outdated bridge does not block adding a design draft or lose it on reload", async ({
  page,
}) => {
  await mockStore(page);
  const saved = {
    id: "a36b2367-7875-4446-a93a-c88f386fe2e5",
    savedAt: "",
    product: { ...product, category: "necklace" },
    charms: [
      {
        instanceId: "original",
        x: 300.25,
        y: 500.75,
        rotation: -27.5,
        charm: {
          id: "clover",
          name: "Clover",
          image: "/images/charms/clover.png",
          price: 10000,
        },
      },
    ],
  };
  await page.addInitScript(
    (design) =>
      localStorage.setItem("wings.saved-designs.v1", JSON.stringify([design])),
    saved,
  );
  await page.route("**/api/commerce/designs/prepare", (route) =>
    route.fulfill({
      status: 404,
      json: { message: "هیچ مسیری منطبق با URL پیدا نشد." },
    }),
  );
  await page.route("**/api/commerce/cart", (route) =>
    route.request().method() === "PUT"
      ? route.fulfill({
          status: 503,
          json: { message: "افزونه باید به‌روزرسانی شود." },
        })
      : route.fulfill({ json: { items: [] } }),
  );
  await page.goto("/account");
  await page
    .getByRole("button", { name: "علاقه‌مندی‌ها", exact: true })
    .click();
  await page
    .getByRole("button", { name: "افزودن طرح به سبد خرید", exact: true })
    .click();
  await expect(page.getByText("طرح شخصی · ۱ چارم")).toBeVisible();
  await expect(page.getByText("قیمت در انتظار تأیید فروشگاه")).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("navigation", { name: "حساب کاربری" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "سبد خرید", exact: true }).click();
  await expect(page.getByText("طرح شخصی · ۱ چارم")).toBeVisible();
  await expect(page.getByText("قیمت در انتظار تأیید فروشگاه")).toBeVisible();
});
