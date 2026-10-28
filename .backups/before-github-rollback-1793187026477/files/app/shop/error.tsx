"use client";

import Link from "next/link";
import { HeaderBackdrop } from "@/components/header-backdrop";

export default function ShopError({ retry }: { retry: () => void }) {
  return (
    <main className="min-h-screen bg-[#fdfbfa]" dir="rtl">
      <HeaderBackdrop />
      <div className="site-container py-24 text-center">
        <h1 className="text-3xl leading-relaxed">فروشگاه فعلاً در دسترس نیست.</h1>
        <p className="mt-4 text-sm leading-8 text-[#796870]">
          دریافت اطلاعات محصولات انجام نشد. لطفاً دوباره تلاش کنید.
        </p>
        <button
          onClick={retry}
          className="mt-8 rounded-md bg-[#49313b] px-6 py-3 text-sm text-white"
        >
          تلاش دوباره
        </button>
        <Link href="/" className="mx-5 text-sm text-[#945e73]">
          بازگشت به خانه
        </Link>
      </div>
    </main>
  );
}
