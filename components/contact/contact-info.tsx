import { Icon } from "../icon";
import { Reveal } from "../reveal";

const contacts = [
  {
    icon: "sparkle",
    title: "ایمیل",
    value: "hello@wingsgallery.ir",
    link: "mailto:hello@wingsgallery.ir",
  },
  {
    icon: "instagram",
    title: "اینستاگرام",
    value: "@wingsgallery",
    link: "#",
  },
  {
    icon: "heart",
    title: "پشتیبانی",
    value: "شنبه تا پنجشنبه | ۹ تا ۱۸",
    link: "#",
  },
];

export function ContactInfo() {
  return (
    <Reveal>
      <div className="text-right">
        <p className="text-xs tracking-[5px] text-black/40">GET IN TOUCH</p>

        <h2 className="mt-6 font-serif text-4xl leading-relaxed sm:text-5xl">
          خوشحال می‌شویم
          <br />
          <span className="text-pink-400 italic">از تو بشنویم.</span>
        </h2>

        <p className="mt-6 text-sm leading-9 text-black/60">
          سوالی داری؟ دنبال یک محصول خاص هستی؟ یا می‌خواهی درباره سفارش خودت صحبت کنی؟
          <br />
          تیم وینگز همیشه آماده پاسخگویی است.
        </p>

        <div className="mt-10 space-y-4">
          {contacts.map((item) => (
            <a
              key={item.title}

              href={item.link}

              className="group flex items-center gap-5 rounded-[28px] border border-black/10 p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-all duration-500 group-hover:bg-pink-400">
                <Icon
                  name={item.icon as any}

                  size={22}
                />
              </span>

              <div>
                <p className="text-sm text-black/40">{item.title}</p>

                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
