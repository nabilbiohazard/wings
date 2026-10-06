import { HeaderBackdrop } from "@/components/header-backdrop";
﻿import Link from "next/link";
import { Journal } from "@/components/blog/journal";
import { getPosts } from "@/lib/get-posts";

export default async function BlogPage() {
  const { posts, failed } = await getPosts()
    .then((posts) => ({ posts, failed: false }))
    .catch((error: unknown) => {
      console.error("Wings journal could not be loaded:", error);
      return { posts: [], failed: true };
    });

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf7f4] text-[#30252a]"
    >
      {/* اگر هدر سایت ثابت نیست، این فاصله را حذف کن. */}
      <HeaderBackdrop />

      

      {posts.length > 0 ? (
        <Journal posts={posts} />
      ) : (
        <section className="mx-auto max-w-2xl px-5 py-24 text-center">
          <p className="text-xs text-[#945e73]">مجله وینگز</p>
          <h2 className="mt-4 text-2xl font-medium leading-relaxed sm:text-3xl">
            {failed
              ? "مجله فعلاً در دسترس نیست."
              : "اولین داستان، به‌زودی اینجاست."}
          </h2>
          <p className="mt-4 text-sm leading-8 text-[#75676c]">
            {failed
              ? "لطفاً کمی بعد دوباره سر بزن."
              : "تا آن زمان، انتخاب‌های وینگز را کشف کن."}
          </p>
          <Link
            href="/collections"
            className="mt-8 inline-flex min-h-12 items-center gap-5 rounded-md bg-[#49313b] px-6 text-sm text-white transition-colors hover:bg-[#704658] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49313b]"
          >
            دیدن کالکشن‌ها <span aria-hidden="true">←</span>
          </Link>
        </section>
      )}

      <section className="border-t border-[#ddcbd0] bg-[#f1e3e7]">
        <div className="mx-auto grid site-container items-center gap-8  py-14  sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 ">
          <div>
            <p className="text-xs text-[#805163]">از الهام تا انتخاب</p>
            <h2 className="mt-4 text-3xl font-medium leading-[1.6] sm:text-4xl">
              حالا نوبت
              <br className="hidden sm:block" />
              <span className="text-[#945e73]"> داستان توست.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-md text-sm leading-9 text-[#6e5962]">
              قطعه‌ای انتخاب کن که به استایلت معنا بدهد، یا دستبندت را
              با چارم‌های دلخواهت بساز.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center gap-6 rounded-md bg-[#49313b] px-6 text-sm text-white transition-colors hover:bg-[#704658] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49313b]"
              >
                دیدن محصولات <span aria-hidden="true">←</span>
              </Link>
              <Link
                href="/custom-design"
                className="inline-flex min-h-11 items-center border-b border-[#945e73] text-sm text-[#49313b] transition-colors hover:text-[#945e73]"
              >
                دستبندت را بساز
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}