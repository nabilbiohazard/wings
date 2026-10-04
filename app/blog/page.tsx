import Image from "next/image";
import Link from "next/link";
import { Journal } from "@/components/blog/journal";
import { getPosts } from "@/lib/get-posts";

export default async function BlogPage() {
  const { posts, failed } = await getPosts().then((posts) => ({ posts, failed: false })).catch((error: unknown) => {
    console.error("Wings journal could not be loaded:", error);
    return { posts: [], failed: true };
  });

  return (
    <main className="overflow-hidden bg-[#faf7f4] text-[#30252a]">
      <div aria-hidden="true" className="relative h-[140px] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[140px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[90px]" />
      </div>

      

      {posts.length > 0 ? (
        <Journal posts={posts} />
      ) : (
        <section id="journal-posts" className="mx-auto max-w-[1000px] px-5 py-24 text-center sm:px-8" dir="rtl">
          <h2 className="text-3xl font-medium sm:text-4xl">{failed ? "مجله فعلاً در دسترس نیست." : "داستان تازه‌ای به‌زودی اینجا می‌نشیند."}</h2>
          <p className="mt-5 text-sm leading-8 text-[#817176]">{failed ? "لطفاً کمی بعد دوباره سر بزنید." : "تا آن زمان، می‌توانی کالکشن‌های وینگز را ببینی."}</p>
          <Link href="/collections" className="mt-8 inline-flex rounded-full bg-[#49313b] px-7 py-3 text-sm text-white hover:bg-[#945e73]">دیدن کالکشن‌ها</Link>
        </section>
      )}

      <section className="px-5 py-20 text-center sm:px-8 sm:py-28" aria-labelledby="journal-cta-title" dir="rtl">
        <div className="mx-auto max-w-2xl"><p className="text-[11px] tracking-[0.25em] text-[#a06b7d]" dir="ltr">FROM INSPIRATION TO YOU</p><h2 id="journal-cta-title" className="mt-5 text-4xl leading-[1.4] font-medium sm:text-5xl">ایده‌ات را به انتخابی واقعی تبدیل کن.</h2><p className="mt-5 text-sm leading-8 text-[#817176]">از میان قطعه‌های وینگز انتخاب کن یا دستبند خودت را با چارم‌های دلخواهت بساز.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/shop" className="inline-flex min-h-12 items-center rounded-full bg-[#49313b] px-7 py-3 text-sm text-white hover:bg-[#945e73]">دیدن محصولات</Link><Link href="/custom-design" className="inline-flex min-h-12 items-center rounded-full border border-[#bb9ba4] px-7 py-3 text-sm text-[#755362] hover:bg-[#f1e3e7]">خودت بساز</Link></div></div>
      </section>
    </main>
  );
}
