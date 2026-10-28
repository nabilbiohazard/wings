import { Icon, type IconName } from "../icon";
import { Reveal } from "../reveal";

const values: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "sparkle",
    title: "طراحی با احساس",
    text: "هر قطعه با الهام از لحظه‌ها، رنگ‌ها و داستان‌های شخصی طراحی می‌شود.",
  },

  {
    icon: "check",
    title: "انتخاب با دقت",
    text: "ما جزئیاتی را انتخاب می‌کنیم که زیبایی و کیفیت را کنار هم داشته باشند.",
  },

  {
    icon: "gift",
    title: "بسته‌بندی خاص",
    text: "تجربه وینگز از لحظه انتخاب شروع می‌شود؛ حتی قبل از باز کردن جعبه.",
  },

  {
    icon: "heart",
    title: "برای تو ساخته شده",
    text: "هر ترکیب می‌تواند داستانی متفاوت داشته باشد؛ درست مثل خود تو.",
  },
];

export function AboutValues() {
  return (
    <section className="w-full bg-[#faf8f5] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto site-container  ">
        <Reveal>
          <div className="text-center">
            <p className="text-xs tracking-[5px] text-black/40">WHY WINGS</p>

            <h2 className="mt-6 font-serif text-4xl leading-relaxed sm:text-5xl">
              چیزی فراتر از
              <br />
              <span className="text-pink-400 italic">یک اکسسوری</span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <div
                key={item.title}

                className="group rounded-[32px] border border-black/10 bg-white p-8 text-right transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white transition-all duration-500 group-hover:bg-pink-400">
                  <Icon
                    name={item.icon}

                    size={25}
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
