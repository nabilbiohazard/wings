import { Icon } from "../icon";
import { Reveal } from "../reveal";

const items = [
  {
    icon: "sparkle",
    title: "جزئیات کوچک",
    text: "گاهی یک انتخاب کوچک می‌تواند حال یک روز کامل را تغییر دهد.",
  },

  {
    icon: "heart",
    title: "انتخاب شخصی",
    text: "هر قطعه باید شبیه تو باشد؛ با سلیقه، خاطره و داستان خودت.",
  },

  {
    icon: "gift",
    title: "لحظه‌های ماندگار",
    text: "اکسسوری‌هایی برای هدیه دادن، به یاد آوردن و ساختن خاطره.",
  },
];

export function AboutPhilosophy() {
  return (
    <section className="w-full py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          {/* TITLE */}

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs tracking-[5px] text-black/40">OUR PHILOSOPHY</p>

            <h2 className="mt-6 font-serif text-4xl leading-relaxed sm:text-5xl">
              چیزی بیشتر از یک
              <br />
              <span className="text-pink-400 italic">اکسسوری</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-black/60">
              ما باور داریم زیبایی واقعی در جزئیاتی است که داستان تو را تعریف می‌کنند.
            </p>
          </div>

          {/* CARDS */}

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.title}

                className="group rounded-[32px] border border-black/10 bg-white p-8 text-right transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white transition-all duration-500 group-hover:bg-pink-400">
                  <Icon
                    name={item.icon as any}

                    size={26}
                  />
                </div>

                <h3 className="mt-8 text-xl font-medium">{item.title}</h3>

                <p className="mt-4 text-sm leading-8 text-black/60">{item.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
