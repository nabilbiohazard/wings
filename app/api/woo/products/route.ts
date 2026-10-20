import { getProducts } from "@/lib/get-products";

export async function GET() {
  try {
    return Response.json({ success: true, products: await getProducts() });
  } catch {
    return Response.json(
      { success: false, message: "?????? ??????? ?? ??????? ????? ???." },
      { status: 503 },
    );
  }
}
