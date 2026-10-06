const details = [
  {
    number: "01",
    title: "جزئیات",
    text: "هر قطعه با تمرکز روی کوچک‌ترین جزئیات انتخاب می‌شود.",
  },

  {
    number: "02",
    title: "انتخاب",
    text: "استایل واقعی از انتخاب‌هایی ساخته می‌شود که شبیه خود تو هستند.",
  },

  {
    number: "03",
    title: "داستان",
    text: "هر اکسسوری می‌تواند بخشی از داستان شخصی تو باشد.",
  },
];

export function WingsManifesto() {
  return (
    <section className="w-full border-y border-black/[0.07] bg-[#fafafa] py-20 sm:py-24 lg:py-32">
      <div className="mx-auto site-container  ">
        {/* HEADER */}

        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p
              dir="ltr"
              className="text-[10px] tracking-[5px] text-black/35"
            >
              THE WINGS PHILOSOPHY
            </p>

            <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.25] sm:text-6xl lg:text-7xl">
              چیزهای کوچک،
              <br />

              <span className="italic text-black/30">
                حس‌های بزرگ.
              </span>
            </h2>
          </div>

          <div className="lg:flex lg:justify-end">
            <p className="max-w-md text-sm leading-8 text-black/50">
              برای ما اکسسوری فقط یک قطعه تزئینی نیست.
              چیزی است که شخصیت، خاطره و بخشی از داستان تو را همراهت نگه می‌دارد.
            </p>
          </div>
        </div>

        {/* ITEMS */}

        <div className="mt-20 grid border-t border-black/10 md:grid-cols-3">
          {details.map((item) => (
            <article
              key={item.number}
              className="
                group
                border-b border-black/10
                py-10
                md:border-b-0
                md:border-l
                md:px-8
                md:first:pr-0
                md:last:border-l-0
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-black/25">
                  {item.number}
                </span>

                <span
                  className="
                    h-1.5 w-1.5
                    rounded-full
                    bg-black/20
                    transition-all duration-500
                    group-hover:scale-[2]
                    group-hover:bg-black
                  "
                />
              </div>

              <h3 className="mt-10 text-2xl">
                {item.title}
              </h3>

              <p className="mt-4 max-w-xs text-sm leading-7 text-black/45">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}