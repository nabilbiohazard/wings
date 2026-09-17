import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

const posts = [
  {
    image: "/images/blog-1.jpg",
    category: "STYLE GUIDE",
    title: "چطور اکسسوری مناسب استایل خودت را پیدا کنیم؟",
    description: "راهنمای انتخاب قطعه‌ای که با شخصیت و سبک روزمره تو هماهنگ باشد.",
    date: "۱۴۰۵/۰۱/۱۰",
  },

  {
    image: "/images/blog-2.jpg",
    category: "JEWELRY CARE",
    title: "چطور از اکسسوری‌های خود بهتر مراقبت کنیم؟",
    description: "چند نکته ساده برای حفظ زیبایی و کیفیت اکسسوری‌ها.",
    date: "۱۴۰۵/۰۱/۱۸",
  },

  {
    image: "/images/blog-3.jpg",
    category: "GIFT IDEAS",
    title: "چند ایده خاص برای یک هدیه متفاوت",
    description: "گاهی یک انتخاب کوچک می‌تواند یک خاطره بزرگ بسازد.",
    date: "۱۴۰۵/۰۲/۰۵",
  },

  {
    image: "/images/blog-4.jpg",
    category: "WINGS STORY",
    title: "داستان شکل‌گیری وینگز گالری",
    description: "از یک ایده کوچک تا ساختن دنیایی از جزئیات زیبا.",
    date: "۱۴۰۵/۰۲/۲۰",
  },
];

export function BlogGrid() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-5">
            <h2 className="font-serif text-4xl sm:text-5xl">آخرین داستان‌ها</h2>

            <p className="hidden text-sm text-black/50 sm:block">WINGS JOURNAL</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <article
                key={post.title}

                className="group text-right"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
                  <Image
                    src={post.image}

                    alt={post.title}

                    fill

                    sizes="
                        (max-width:640px) 100vw,
                        (max-width:1024px) 50vw,
                        25vw
                      "

                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="mt-6 text-[11px] tracking-[3px] text-black/40">{post.category}</p>

                <h3 className="mt-3 text-xl leading-8 transition group-hover:text-pink-400">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-black/60">{post.description}</p>

                <div className="mt-5 flex items-center justify-between text-xs text-black/40">
                  <span>{post.date}</span>

                  <a
                    href="#"

                    className="flex items-center gap-2 text-black transition hover:text-pink-400"
                  >
                    مطالعه
                    <Icon
                      name="arrow"

                      size={14}
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
