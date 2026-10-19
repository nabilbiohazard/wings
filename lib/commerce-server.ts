import "server-only";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";

export const sessionCookie = "wings_session";
export const challengeCookie = "wings_otp";
export const sessionAge = 7 * 24 * 60 * 60;
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export class CommerceError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message);
  }
}

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const configured = process.env.APP_URL;
  const expected = configured
    ? new URL(configured).origin
    : new URL(request.url).origin;
  if (!origin || origin !== expected)
    throw new CommerceError("درخواست نامعتبر است؛ صفحه را تازه کنید.", 403);
}

export async function readBody(request: Request, limit = 32768) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new CommerceError("نوع درخواست نامعتبر است.", 415);
  // Bound the streamed body as well as Content-Length; chunked bodies must not bypass the limit.
  const reader = request.body?.getReader();
  if (!reader) throw new CommerceError("اطلاعات درخواست خالی است.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new CommerceError("حجم درخواست بیش از حد مجاز است.", 413);
    }
    chunks.push(value);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new CommerceError("اطلاعات درخواست معتبر نیست.", 400);
  }
}

export async function bridge<T>(
  path: string,
  request: Request,
  method = "GET",
  body?: unknown,
  authenticated = true,
): Promise<T> {
  const base = process.env.WINGS_BRIDGE_URL;
  const key = process.env.WINGS_BRIDGE_SECRET;
  if (!base || !key || key.length < 32)
    throw new CommerceError(
      "اتصال حساب کاربری فروشگاه هنوز تنظیم نشده است.",
      503,
    );
  const url = new URL(`${base.replace(/\/$/, "")}/${path}`);
  if (
    url.protocol !== "https:" &&
    !(
      process.env.NODE_ENV !== "production" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
  ) {
    throw new CommerceError("اتصال امن فروشگاه تنظیم نشده است.", 503);
  }
  const token = (await cookies()).get(sessionCookie)?.value;
  if (authenticated && !token)
    throw new CommerceError("برای ادامه وارد حساب خود شوید.", 401);
  // Configure only a header that the hosting proxy overwrites; default is a shared anonymous bucket.
  const ipHeader = process.env.TRUSTED_CLIENT_IP_HEADER;
  const client = ipHeader
    ? request.headers.get(ipHeader)?.split(",")[0]?.trim() || "unknown"
    : "unknown";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Wings-Key": key,
    "X-Wings-Client": createHmac("sha256", key).update(client).digest("hex"),
  };
  if (process.env.APP_URL)
    headers["X-Wings-Storefront"] = new URL(process.env.APP_URL).origin;
  if (authenticated && token) headers["X-Wings-Session"] = token;
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new CommerceError(
      "ارتباط با ووکامرس انجام نشد؛ دوباره تلاش کنید.",
      502,
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new CommerceError(
      typeof data?.message === "string"
        ? data.message
        : "درخواست فروشگاه انجام نشد.",
      response.status,
    );
  if (data === null) throw new CommerceError("پاسخ فروشگاه معتبر نیست.", 502);
  return data as T;
}

export function failure(error: unknown) {
  const known = error instanceof CommerceError;
  return Response.json(
    { message: known ? error.message : "درخواست انجام نشد؛ دوباره تلاش کنید." },
    {
      status: known ? error.status : 500,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
