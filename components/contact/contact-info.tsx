import Image from "next/image";
import { Icon } from "@/components/icon";

// این مقادیر را با اطلاعات واقعی وینگز جایگزین کن.
const instagramUrl = "https://www.instagram.com/YOUR_USERNAME/";
const whatsappUrl = "https://wa.me/989120000000";
const telegramUrl = "https://t.me/YOUR_USERNAME";
const email = "hello@wingsgallery.ir";

const phones = [
  { title: "تماس با ما", display: "۰۹۱۲ ۰۰۰ ۰۰۰۰", number: "+989120000000" },
  { title: "شماره تماس دوم", display: "۰۹۱۳ ۰۰۰ ۰۰۰۰", number: "+989130000000" },
];

type Channel = "instagram" | "whatsapp" | "telegram" | "email" | "phone";

function ChannelIcon({
  channel,
  size = 24,
}: {
  channel: Channel;
  size?: number;
}) {
  if (channel === "instagram") {
    return <Icon name="instagram" size={size} />;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {channel === "whatsapp" && (
        <>
          <path d="M20.2 11.8a8.2 8.2 0 0 1-12.1 7.3L3.5 20.5l1.4-4.5a8.2 8.2 0 1 1 15.3-4.2Z" />
          <path d="M9 8.3c-.4-.6-.8-.6-1.2-.4-.5.3-.7 1-.5 1.8.8 2.8 3.8 5.6 6.5 6.3.8.2 1.7-.2 1.9-.8l.3-1.2-2.5-1.2-1.1 1c-1.3-.6-2.3-1.6-3-2.8l.8-1.1L9 8.3Z" />
        </>
      )}

      {channel === "telegram" && (
        <>
          <path d="m21 3-3.7 17-5.5-4.1-2.9 2.8.6-4.6L21 3Z" />
          <path d="M9.5 14.1 21 3 3 10.7l5.9 2.2" />
        </>
      )}

      {channel === "email" && (
        <>
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </>
      )}

      {channel === "phone" && (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.91.69 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.69A2 2 0 0 1 22 16.92Z" />
      )}
    </svg>
  );
}

function ChannelCard({
  channel,
  title,
  detail,
  href,
}: {
  channel: Channel;
  title: string;
  detail: string;
  href: string;
}) {
  const external = channel !== "email" && channel !== "phone";

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-white/20 bg-black/20 p-3 text-right backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f0cad4]">
        <ChannelIcon channel={channel} size={21} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">
          {title}
        </span>

        <span
          className="mt-1 block truncate text-xs text-white/85"
          dir={channel === "email" || channel === "phone" ? "ltr" : "rtl"}
        >
          {detail}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="text-lg text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}

export function ContactInfo() {
  return (
    <aside
      className="relative isolate overflow-hidden rounded-[4px] bg-[#38292e] text-[#fff8f3]"
      aria-label="راه‌های ارتباطی وینگز"
      dir="rtl"
    >
      <Image
        src="/images/contact-hero.jpg"
        alt="هدیه وینگز روی میز در کنار گل‌ها و یادداشت"
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="-z-20 object-cover object-center"
      />

      {/* سایه از پایین عکس برای خوانایی اطلاعات */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(30,17,23,0.98)_0%,rgba(30,17,23,0.90)_45%,rgba(30,17,23,0.45)_75%,rgba(30,17,23,0.08)_100%)]"
      />

      {/* ارتفاع با محتوا رشد می‌کند تا در موبایل چیزی بریده نشود */}
      <div className="flex min-h-[780px] flex-col justify-start px-5 py-7 sm:px-8 sm:py-9 lg:min-h-[600px] lg:px-10 lg:py-12 xl:min-h-[500px]">
        <p className="mb-5 text-xs text-white/90">
          هر پیام، آغاز یک گفت‌وگوی تازه.
        </p>

        <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/25 pb-5">
          <div>
            <p
              className="text-[10px] tracking-[0.22em] text-[#e6b9c3]"
              dir="ltr"
            >
              FIND US HERE
            </p>
            <h2 className="mt-2 text-xl font-medium sm:text-2xl">
              راه‌های ارتباطی وینگز
            </h2>
          </div>

          <span className="text-[#d7aab7]" aria-hidden="true">
            ✦
          </span>
        </div>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-[20px] border border-[#e6b1c1]/45 bg-[#a2637b]/90 p-5 text-white shadow-[0_14px_32px_rgba(16,5,11,0.18)] backdrop-blur-sm transition-colors hover:bg-[#b2748c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20">
            <ChannelIcon channel="instagram" size={25} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold">
              اینستاگرام وینگز
            </span>
            <span className="mt-1 block text-xs text-white/90">
              داستان‌ها و تازه‌ترین انتخاب‌های ما
            </span>
          </span>

          <span
            aria-hidden="true"
            className="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        </a>

        <div className="mt-4 grid gap-2">
          <ChannelCard
            channel="whatsapp"
            title="واتساپ"
            detail="گفت‌وگو در واتساپ"
            href={whatsappUrl}
          />

          <ChannelCard
            channel="telegram"
            title="تلگرام"
            detail="پیام در تلگرام"
            href={telegramUrl}
          />

          <ChannelCard
            channel="email"
            title="ایمیل"
            detail={email}
            href={`mailto:${email}`}
          />

          {phones.map((phone) => (
            <ChannelCard
              key={phone.number}
              channel="phone"
              title={phone.title}
              detail={phone.display}
              href={`tel:${phone.number}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}