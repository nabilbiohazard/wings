import { getCharms } from "@/lib/get-charms";
export async function GET() {
  try {
    return Response.json(
      { charms: await getCharms() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { message: "دریافت چارم‌های فروشگاه انجام نشد؛ دوباره تلاش کنید." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
