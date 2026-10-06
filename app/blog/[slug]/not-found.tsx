import Link from "next/link";
import { HeaderBackdrop } from "@/components/header-backdrop";

export default function ArticleNotFound() {
  return <main className="min-h-screen bg-[#faf7f4] text-[#30252a]" dir="rtl">
    <HeaderBackdrop />
    <div className="site-container py-24 text-center">
      <p className="text-sm text-[#945e73]">مجله وینگز</p>
      <h1 className="mt-5 text-3xl leading-relaxed">این داستان پیدا نشد.</h1>
      <p className="mt-4 text-sm leading-8 text-[#796870]">ممکن است آدرس تغییر کرده باشد؛ داستان‌های دیگر را در مجله بخوان.</p>
      <Link href="/blog" className="mt-8 inline-flex rounded-md bg-[#49313b] px-6 py-3 text-sm text-white">بازگشت به مجله</Link>
    </div>
  </main>;
}
