import type { Metadata } from "next";
import { ShoppingPage } from "@/components/commerce/shopping-page";

export const metadata: Metadata = { title: "سبد خرید | وینگز" };
export default function CartPage() { return <ShoppingPage kind="cart" />; }
