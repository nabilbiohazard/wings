import type { Metadata } from "next";
import { ShoppingPage } from "@/components/commerce/shopping-page";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها | وینگز" };
export default function WishlistPage() { return <ShoppingPage kind="wishlist" />; }
