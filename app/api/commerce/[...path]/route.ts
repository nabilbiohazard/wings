import { cookies } from "next/headers";
import {
  bridge,
  challengeCookie,
  CommerceError,
  cookieOptions,
  failure,
  readBody,
  requireSameOrigin,
  sessionAge,
  sessionCookie,
} from "@/lib/commerce-server";
import { digits, normalizePhone } from "@/lib/commerce-types";
import type { Customer } from "@/lib/commerce-types";

export const runtime = "nodejs";
type Context = { params: Promise<{ path: string[] }> };
const allowed: Record<string, string[]> = {
  me: ["GET", "PATCH"],
  addresses: ["GET", "POST"],
  orders: ["GET"],
  "checkout/quote": ["POST"],
  "checkout/order": ["POST"],
  locations: ["GET"],
  cart: ["GET", "PUT"],
  "designs/prepare": ["POST"],
  "designs/catalogue": ["GET"],
};

async function handle(request: Request, context: Context) {
  try {
    const path = (await context.params).path.join("/");
    const method = request.method;
    if (method !== "GET") requireSameOrigin(request);
    const jar = await cookies();
    if (path === "auth/request" && method === "POST") {
      const body = await readBody(request);
      const phone =
        typeof body.phone === "string" ? normalizePhone(body.phone) : null;
      if (!phone) throw new CommerceError("شماره موبایل معتبر وارد کنید.", 400);
      const result = await bridge<{
        challenge: string;
        retry_after: number;
        code_length?: number;
      }>("auth/request", request, "POST", { phone }, false);
      jar.set(challengeCookie, result.challenge, {
        ...cookieOptions,
        maxAge: 300,
      });
      const length =
        Number.isInteger(result.code_length) &&
        result.code_length! >= 4 &&
        result.code_length! <= 10
          ? result.code_length!
          : null;
      if (length)
        jar.set("wings_otp_length", String(length), {
          ...cookieOptions,
          maxAge: 300,
        });
      else jar.delete("wings_otp_length");
      return Response.json(
        { retry_after: result.retry_after, code_length: length },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (path === "auth/verify" && method === "POST") {
      const body = await readBody(request);
      const code =
        typeof body.code === "string" ? digits(body.code.trim()) : "";
      const challenge = jar.get(challengeCookie)?.value;
      const expectedLength = Number(jar.get("wings_otp_length")?.value || 0);
      if (
        !challenge ||
        !/^\d{4,10}$/.test(code) ||
        (expectedLength >= 4 &&
          expectedLength <= 10 &&
          code.length !== expectedLength)
      )
        throw new CommerceError(
          "کد پیامک‌شده را کامل وارد کنید یا دوباره کد بگیرید.",
          400,
        );
      const result = await bridge<{ token: string; customer: Customer }>(
        "auth/verify",
        request,
        "POST",
        { code, challenge },
        false,
      );
      // Rotate the old session when the browser logs into another account.
      if (jar.has(sessionCookie))
        await bridge("auth/logout", request, "POST", {}).catch(() => undefined);
      jar.set(sessionCookie, result.token, {
        ...cookieOptions,
        maxAge: sessionAge,
      });
      jar.delete(challengeCookie);
      jar.delete("wings_otp_length");
      return Response.json(
        { customer: result.customer },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (path === "auth/logout" && method === "POST") {
      if (jar.has(sessionCookie)) {
        try {
          await bridge("auth/logout", request, "POST", {});
        } catch (error) {
          if (!(error instanceof CommerceError) || error.status !== 401)
            throw error;
        }
      }
      jar.delete(sessionCookie);
      jar.delete(challengeCookie);
      jar.delete("wings_otp_length");
      return Response.json(
        { success: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    let methods = allowed[path];
    if (/^addresses\/[a-f0-9-]{36}$/.test(path)) methods = ["PATCH", "DELETE"];
    if (/^orders\/[1-9]\d*$/.test(path)) methods = ["GET"];
    if (/^orders\/[1-9]\d*\/cancel$/.test(path)) methods = ["POST"];
    if (/^products\/[1-9]\d*\/variations$/.test(path)) methods = ["GET"];
    if (/^checkout\/requests\/[a-f0-9-]{36}$/.test(path)) methods = ["GET"];
    if (!methods?.includes(method))
      throw new CommerceError("مسیر درخواست پیدا نشد.", 404);
    const body =
      method === "GET" || method === "DELETE"
        ? undefined
        : await readBody(request, 524288);
    const query = new URL(request.url).searchParams;
    const hasStoreCharms = (value: unknown) => {
      const design = value as
        { charms?: { charm?: { id?: string } }[] } | undefined;
      return (
        Array.isArray(design?.charms) &&
        design.charms.some(
          (item) =>
            typeof item.charm?.id === "string" &&
            /^woo-\d+$/.test(item.charm.id),
        )
      );
    };
    const needsStoreCharms =
      hasStoreCharms(body?.design) ||
      (Array.isArray(body?.items) &&
        body.items.some((item) => hasStoreCharms(item?.design)));
    if (needsStoreCharms) {
      const capability = await bridge<{ source?: string }>(
        "designs/catalogue",
        request,
        "GET",
        undefined,
        false,
      ).catch((error) => {
        if (error instanceof CommerceError && error.status === 404)
          throw new CommerceError(
            "برای ثبت طرح با چارم‌های محصولات فروشگاه، افزونهٔ وینگز را به نسخهٔ ۱.۲.۱ به‌روزرسانی کنید. طرح شما در سبد محفوظ می‌ماند.",
            503,
          );
        throw error;
      });
      if (capability.source !== "woocommerce")
        throw new CommerceError(
          "برای ثبت طرح با چارم‌های محصولات فروشگاه، افزونهٔ وینگز را به نسخهٔ ۱.۲.۱ به‌روزرسانی کنید. طرح شما در سبد محفوظ می‌ماند.",
          503,
        );
    }
    if (
      !needsStoreCharms &&
      Array.isArray(body?.items) &&
      body.items.some(
        (item: unknown) => item && typeof item === "object" && "design" in item,
      )
    ) {
      // An old WordPress bridge may silently drop unknown fields and turn a design into a plain product.
      try {
        await bridge("designs/catalogue", request, "GET", undefined, false);
      } catch (error) {
        if (error instanceof CommerceError && error.status === 404)
          throw new CommerceError(
            "طرح در سبد شما محفوظ است. برای ثبت سفارش طرح، افزونهٔ وینگز روی وردپرس باید به نسخهٔ ۱.۱.۰ یا جدیدتر به‌روزرسانی شود.",
            503,
          );
        throw error;
      }
    }
    const suffix =
      path === "orders"
        ? `?page=${Math.max(1, Math.min(10000, Number(query.get("page")) || 1))}`
        : "";
    const result = await bridge(
      path + suffix,
      request,
      method,
      body,
      !path.startsWith("products/") &&
        !path.startsWith("designs/") &&
        path !== "locations",
    );
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return failure(error);
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
