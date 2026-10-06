import Image from "next/image";
import { Reveal } from "../reveal";
import { Icon } from "../icon";

const collections = [
  {
    title: "Necklace",
    subtitle: "گردنبندها",
    image: "/images/hero.png",
  },
  {
    title: "Bracelet",
    subtitle: "دستبندها",
    image: "/images/hero.png",
  },
  {
    title: "Charm",
    subtitle: "چارم‌های خاص",
    image: "/images/hero.png",
  },
  {
    title: "Gift",
    subtitle: "هدیه‌های ماندگار",
    image: "/images/hero.png",
  },
];

export function CollectionShowcase() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-28">
      <div className="mx-auto site-container  ">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-xs tracking-[5px] text-black/40">EXPLORE COLLECTIONS</p>

            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">دنیای وینگز</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {collections.map((item) => (
              <a
                href="#"

                key={item.title}

                className="group relative aspect-[4/5] overflow-hidden rounded-[40px]"
              >
                <Image
                  src={item.image}

                  alt={item.subtitle}

                  fill

                  sizes="
                      (max-width:640px) 100vw,
                      50vw
                    "

                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute right-8 bottom-8 left-8 text-right text-white">
                  <p className="text-xs tracking-[4px] text-white/60">{item.title}</p>

                  <h3 className="mt-3 text-3xl font-medium">{item.subtitle}</h3>

                  <span className="mt-5 flex items-center justify-end gap-3 text-sm opacity-0 transition-all duration-500 group-hover:opacity-100">
                    مشاهده کالکشن
                    <Icon
                      name="arrow"

                      size={16}
                    />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
