import { CommerceError, readBody, requireSameOrigin } from "@/lib/commerce-server";
import { allowContactRequest } from "@/lib/contact-rate-limit";
import { sendContactMessage } from "@/lib/contact-service";

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    requireSameOrigin(request);
    if (!allowContactRequest(request)) {
      return Response.json({ error: "تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید." }, { status: 429, headers: { "Retry-After": "600", "Cache-Control": "no-store" } });
    }
    input = await readBody(request, 16384);
  } catch (error) {
    if (error instanceof CommerceError) return Response.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return Response.json({ error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const subject = typeof input.subject === "string" ? input.subject.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (input.website) return Response.json({ ok: true });
  if (name.length < 2 || name.length > 100 || !/^[+\d۰-۹٠-٩\s()-]{7,25}$/.test(phone) ||
      (email && (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
      subject.length > 120 || message.length < 10 || message.length > 3000) {
    return Response.json({ error: "اطلاعات پیام را بررسی کنید." }, { status: 400 });
  }

  try {
    await sendContactMessage({
      name,
      phone,
      ...(email ? { email } : {}),
      message: subject ? `موضوع: ${subject}\n\n${message}` : message,
    });
    return Response.json({ ok: true });
  } catch {
    console.error("Contact message delivery failed");
    return Response.json({ error: "ارسال پیام انجام نشد." }, { status: 502 });
  }
}
