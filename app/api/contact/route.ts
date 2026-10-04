import { sendContactMessage } from "@/lib/contact-service";

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = await request.json();
  } catch {
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
  } catch (error) {
    console.error("Contact message delivery failed:", error);
    return Response.json({ error: "ارسال پیام انجام نشد." }, { status: 502 });
  }
}
