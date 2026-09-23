"use client";

import Image from "next/image";
import { categories } from "@/lib/products";
import { Icon } from "../icon";
import { Reveal } from "../reveal";
import { useShop } from "../shop-provider";

type CategoryCardProps = {
  category: (typeof categories)[number];
};

function CategoryCard({ category }: CategoryCardProps) {
  const { setCategory } = useShop();

  return (
    <a
      href="#new-arrivals"
      onClick={() => setCategory(category.id)}
      className="group relative block aspect-square overflow-hidden rounded-[24px]"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="
          (max-width:640px) 50vw,
          (max-width:1024px) 33vw,
          25vw
        "
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-right text-white sm:p-6">
        <span lang="en" className="mb-2 block text-xs tracking-[3px] text-white/80">
          {category.english}
        </span>

        <h3 className="text-xl font-medium sm:text-2xl">{category.name}</h3>

        <p className="mt-2 line-clamp-2 text-sm text-white/80">{category.tagline}</p>

        <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 transition-all duration-300 group-hover:bg-white group-hover:text-black">
          <Icon name="arrow" size={16} />
        </span>
      </div>
    </a>
  );
}

export function Collections() {
  return (
    <section
      id="collections"
      className="w-full py-16 sm:py-20 lg:py-24"
      aria-labelledby="collections-heading"
    >
      <div className="mx-auto w-full max-w-[1600px] px-8">
        <div className="mb-10 flex flex-col items-start gap-3 text-right sm:mb-14">
          <h2 id="collections-heading" className="text-3xl font-medium sm:text-4xl lg:text-5xl">
            دنیای کوچکِ دوست‌داشتنی‌ها
          </h2>

          <span lang="en" dir="ltr" className="text-xs tracking-[4px] text-black/50">
            FIND YOUR LITTLE JOY
          </span>
        </div>

        <Reveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
