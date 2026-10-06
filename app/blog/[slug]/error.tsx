"use client";

import Link from "next/link";
import { HeaderBackdrop } from "@/components/header-backdrop";

export default function ArticleError({ reset }: { reset: () => void }) {
  return <main className="min-h-screen bg-[#faf7f4] text-[#30252a]" dir="rtl">
    <HeaderBackdrop />
    <div className="site-container py-24 text-center">
      <h1 className="text-3xl leading-relaxed">مقاله فعلاً در دسترس نیست.</h1>
      <p className="mt-4 text-sm leading-8 text-[#796870]">برای دریافت دوبارهٔ متن مقاله تلاش کن.</p>
      <button onClick={reset} className="mt-8 rounded-md bg-[#49313b] px-6 py-3 text-sm text-white">تلاش دوباره</button>
      <Link href="/blog" className="mx-5 text-sm text-[#945e73]">بازگشت به مجله</Link>
    </div>
  </main>;
}
