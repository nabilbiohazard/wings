import { Icon } from "../icon";
import { Reveal } from "../reveal";

const categories = [
  {
    icon: "sparkle" as const,
    title: "استایل و ترندها",
    subtitle: "STYLE GUIDE",
  },
  {
    icon: "heart" as const,
    title: "راهنمای انتخاب",
    subtitle: "JEWELRY GUIDE",
  },
  {
    icon: "gift" as const,
    title: "ایده‌های هدیه",
    subtitle: "GIFT IDEAS",
  },
  {
    icon: "check" as const,
    title: "داستان وینگز",
    subtitle: "OUR STORY",
  },
];

export function BlogCategories() {
  return (
    <section className="w-full bg-[#faf8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto site-container  ">
        <Reveal>
          <div className="text-center">
            <p className="text-xs tracking-[5px] text-black/40">
              EXPLORE JOURNAL
            </p>

            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
              موضوعات مجله
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
              <a
                href="#"

                key={item.title}

                className="group rounded-[32px] border border-black/10 bg-white p-8 text-right transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white transition-all duration-500 group-hover:bg-pink-400">
                  <Icon
                    name={item.icon}

                    size={25}
                  />
                </span>

                <p className="mt-8 text-xs tracking-[3px] text-black/40">
                  {item.subtitle}
                </p>

                <h3 className="mt-3 text-xl font-medium">{item.title}</h3>

                <span className="mt-6 block h-px w-full bg-black/10 transition-all duration-500 group-hover:bg-pink-300" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
