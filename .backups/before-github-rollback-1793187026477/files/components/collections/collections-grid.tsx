import Link from "next/link";
import Image from "next/image";
import { Icon } from "../icon";
import { Reveal } from "../reveal";

const collections = [
  {
    title: "Necklace",
    name: "گردنبندها",
    image: "/images/grid-necklace.jpg",
  },

  {
    title: "Bracelet",
    name: "دستبندها",
    image: "/images/grid-bracelet.jpg",
  },

  {
    title: "Charm",
    name: "چارم‌های خاص",
    image: "/images/grid-charm.jpg",
  },

  {
    title: "Rings",
    name: "انگشترها",
    image: "/images/grid-rings.jpg",
  },

  {
    title: "Gift Sets",
    name: "ست‌های هدیه",
    image: "/images/grid-gift.jpg",
  },

  {
    title: "Limited",
    name: "کالکشن محدود",
    image: "/images/grid-limited.jpg",
  },
];

export function CollectionsGrid() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto site-container  ">
        <Reveal>
          <div className="text-center">
            <p className="text-xs tracking-[5px] text-black/40">ALL COLLECTIONS</p>

            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">همه کالکشن‌ها</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((item) => (
              <Link
                key={item.title}

                href="/shop"

                className="group relative aspect-[4/5] overflow-hidden rounded-[36px]"
              >
                <Image
                  src={item.image}

                  alt={item.name}

                  fill

                  sizes="
                      (max-width:640px) 100vw,
                      (max-width:1024px) 50vw,
                      33vw
                    "

                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute right-8 bottom-8 left-8 text-right text-white">
                  <p className="text-xs tracking-[4px] text-white/60">{item.title}</p>

                  <h3 className="mt-3 text-2xl">{item.name}</h3>

                  <span className="mt-5 flex items-center justify-end gap-3 text-sm opacity-0 transition-all duration-500 group-hover:opacity-100">
                    مشاهده
                    <Icon
                      name="arrow"

                      size={15}
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
