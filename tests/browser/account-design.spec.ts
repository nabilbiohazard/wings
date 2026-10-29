import { test, expect } from "@playwright/test";

const customer = {
  id: 7,
  phone: "09121234567",
  first_name: "نیلوفر",
  last_name: "احمدی",
  email: "niloofar@example.com",
};
const address = {
  id: "home",
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
const order = {
  id: 1001,
  number: "1001",
  status: "processing",
  status_label: "در حال انجام",
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
      name: "گردنبند پروانه",
      quantity: 1,
      total: "250000",
      image: "",
      attributes: [],
    },
  ],
  notes: [],
  can_cancel: true,
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/woo/products*", (route) =>
    route.fulfill({ json: { success: true, products: [] } }),
  );
  await page.route("**/api/commerce/**", async (route) => {
    const path = new URL(route.request().url()).pathname.replace(
      "/api/commerce/",
      "",
    );
    if (path === "me")
      return route.fulfill({
        json: {
          customer: {
            ...customer,
            ...(route.request().method() === "PATCH"
              ? route.request().postDataJSON()
              : {}),
          },
        },
      });
    if (path === "cart") return route.fulfill({ json: { items: [] } });
    if (path === "addresses")
      return route.fulfill({ json: { addresses: [address] } });
    if (path === "locations")
      return route.fulfill({ json: { states: { THR: "تهران" } } });
    if (path === "orders")
      return route.fulfill({
        json: {
          orders: [
            order,
            {
              ...order,
              id: 1002,
              number: "1002",
              status: "completed",
              status_label: "تکمیل شده",
            },
          ],
          total: 2,
          pages: 1,
        },
      });
    if (path === "orders/1001") return route.fulfill({ json: { order } });
    return route.fulfill({ status: 404, json: { message: "یافت نشد" } });
  });
});

test("account pages render without overflow and preserve form actions", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/account",
    "/account/profile",
    "/account/addresses",
    "/account/orders/1001",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("navigation", { name: "حساب کاربری", exact: true }),
    ).toBeVisible();
    await expect(page.locator("main")).toHaveCSS(
      "background-color",
      "rgb(247, 245, 243)",
    );
    if (path === "/account") {
      await expect(
        page.getByRole("link", { name: /سفارش #1001/ }),
      ).toBeVisible();
      await page
        .getByRole("combobox", { name: "نمایش در این صفحه" })
        .selectOption("completed");
      await expect(page.getByRole("link", { name: /سفارش #1001/ })).toHaveCount(
        0,
      );
      await expect(
        page.getByRole("link", { name: /سفارش #1002/ }),
      ).toBeVisible();
      await page.getByRole("combobox").selectOption("all");
    }
    if (path === "/account/profile") {
      await page
        .getByRole("textbox", { name: "نام", exact: true })
        .fill("سارا");
      await page.getByRole("button", { name: "ذخیره اطلاعات" }).click();
      await expect(page.getByRole("status")).toContainText(
        "اطلاعات حساب ذخیره شد",
      );
    }
    if (path === "/account/addresses") {
      await page.getByRole("button", { name: "آدرس جدید" }).click();
      await expect(
        page.getByRole("heading", { name: "افزودن آدرس" }),
      ).toBeVisible();
    }
    if (path === "/account/orders/1001") {
      await expect(
        page.getByRole("list", { name: "وضعیت سفارش" }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "لغو سفارش", exact: true })
        .click();
      await expect(page.getByText("از لغو سفارش مطمئن هستید؟")).toBeVisible();
      await page.getByRole("button", { name: "انصراف", exact: true }).click();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: testInfo.outputPath(path.replaceAll("/", "-") + ".png"),
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("logged out account has an accessible login form", async ({
  page,
}, testInfo) => {
  await page.route("**/api/commerce/me", (route) =>
    route.fulfill({ status: 401, json: { message: "برای ادامه وارد شوید." } }),
  );
  await page.goto("/account");
  await expect(
    page.getByRole("textbox", { name: "شماره موبایل", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("login.png"),
    fullPage: true,
  });
});
