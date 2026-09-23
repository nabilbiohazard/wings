import Link from "next/link";

export function CustomDesignFeature() {
  return (
    <section className="w-full px-5 py-16 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div
          className="
            relative overflow-hidden
            rounded-[36px]
            bg-black
            px-6 py-16
            text-white
            sm:px-10
            lg:min-h-[560px]
            lg:px-20
            lg:py-20
          "
        >
          {/* BACKGROUND GLOW */}

          <div className="absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-white/[0.07] blur-[120px]" />

          <div className="absolute -bottom-52 -left-40 h-[500px] w-[500px] rounded-full bg-white/[0.05] blur-[130px]" />

          {/* DECORATIVE WORD */}

          <div
            dir="ltr"
            className="
              pointer-events-none
              absolute -bottom-5 left-1/2
              -translate-x-1/2
              select-none
              whitespace-nowrap
              font-serif
              text-[22vw]
              leading-none
              tracking-[-0.07em]
              text-white/[0.035]
              lg:text-[230px]
            "
          >
            CREATE
          </div>

          <div className="relative z-10 flex min-h-[400px] flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-[5px] text-white/35">
                CREATE YOUR OWN
              </p>

              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-lg">
                ✦
              </span>
            </div>

            <div className="mt-20 max-w-3xl text-right">
              <h2 className="font-serif text-5xl leading-[1.2] sm:text-6xl lg:text-7xl">
                این بار،
                <br />

                <span className="italic text-white/45">
                  خودت طراحی کن.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-8 text-white/50 sm:text-base">
                چارم‌ها و جزئیات مورد علاقه‌ات را انتخاب کن و ترکیبی بساز
                که فقط متعلق به خودت باشد.
              </p>

              <div className="mt-10">
                <Link
                  href="/custom-design"
                  className="
                    group inline-flex items-center
                    gap-6
                    rounded-full
                    bg-white
                    px-7 py-4
                    text-sm text-black
                    transition-all duration-300
                    hover:scale-[1.03]
                  "
                >
                  شروع طراحی

                  <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}