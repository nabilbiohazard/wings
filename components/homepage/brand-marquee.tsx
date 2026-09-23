const items = [
  "استایل تو، داستان تو",
  "ساخته شده برای تو",
  "جزئیاتی که فرق می‌سازند",
  "وینگز گالری",
  "انتخابی شبیه خودت",
  "برای لحظه‌های خاص",
  "درخشش در جزئیات",
  "هر انتخاب، یک داستان",
  "خاص باش، خودت باش",
  "اکسسوری برای سبک تو",
  "جزئیات کوچک، حس‌های بزرگ",
  "داستانت را با وینگز بساز",
];

function MarqueeGroup() {
  return (
    <div className="wings-marquee-group flex shrink-0 items-center">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex shrink-0 items-center"
        >
          <span
            dir="rtl"
            className="
              whitespace-nowrap
              px-8
              text-lg
              font-medium
              tracking-tight
              text-black/65
              sm:px-12
              sm:text-xl
              lg:px-14
              lg:text-2xl
            "
          >
            {item}
          </span>

          <span className="shrink-0 text-base text-black/20">
            ✦
          </span>
        </div>
      ))}
    </div>
  );
}

export function BrandMarquee() {
  return (
    <section
      dir="ltr"
      className="
        relative
        w-full
        overflow-hidden
        border-y border-black/[0.08]
        bg-white
        py-5
      "
    >
      <div className="wings-marquee-track flex w-max items-center">
        <MarqueeGroup />
        <MarqueeGroup />
        <MarqueeGroup />
      </div>
    </section>
  );
}