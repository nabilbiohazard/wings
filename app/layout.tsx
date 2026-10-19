import type { Metadata } from "next";
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/amiri/arabic-700.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShopProvider } from "@/components/shop-provider";
import { CommerceProvider } from "@/components/commerce/provider";

export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  title: "وینگز گالری | جزئیات کوچک، روزهای رنگی",
  description:
    "دنیای رنگی وینگز گالری؛ گردنبند، دستبند، گوشواره و چارم‌های دوست‌داشتنی برای داستان منحصربه‌فرد شما.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CommerceProvider>
          <ShopProvider>
            <Header />
            {children}
            <Footer />
          </ShopProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}
