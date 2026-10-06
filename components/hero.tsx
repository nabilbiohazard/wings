import { Icon } from "./icon";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section className="relative h-dvh min-h-dvh overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/videoplayback.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/45 to-black/20" />

      <div className="absolute top-1/2 left-[-120px] h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-pink-300/10 blur-[130px]" />

      <div className="relative z-10 flex h-full items-center">
        <Reveal className="mx-auto w-full site-container ">
          <div className="items-center gap-12">
            {/* RIGHT SIDE */}

            <div className="mx-auto max-w-xl text-center">
              <div className="mb-8 flex items-center justify-center gap-4 text-xs tracking-[5px] text-white/60">
                <span>01</span>

                <span>THE LITTLE JOYS COLLECTION</span>
              </div>

              <h1 className="font-serif text-6xl leading-[1.05] sm:text-7xl lg:text-8xl">
                Your style,
                <br />
                <span className="text-pink-300 italic">Your story</span>
              </h1>

              <p className="mt-8 text-lg leading-9 text-white/80">
                اکسسوری‌هایی برای لحظه‌هایی که فقط متعلق به تو هستند.
                <br />
                هر انتخاب، یک داستان تازه.
              </p>

              <div className="mt-10 flex items-center justify-center gap-5">
                <a
                  href="#our-story"
                  className="flex items-center gap-3 text-sm transition hover:text-pink-300"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 backdrop-blur">
                    ▷
                  </span>
                  داستان وینگز
                </a>

                <a
                  href="#new-arrivals"
                  className="flex items-center gap-4 rounded-full bg-white px-9 py-4 text-sm text-black transition-all duration-300 hover:bg-pink-300"
                >
                  کشف کالکشن
                  <Icon name="arrow" size={18} />
                </a>
              </div>

              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-lg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                    ✦
                  </span>

                  <div className="text-center">
                    <p className="text-sm">خودت بساز</p>

                    <p className="mt-1 text-xs text-white/60">ترکیب چارم‌های مخصوص تو</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute right-10 bottom-10 z-10 flex items-center gap-4 text-xs tracking-[4px] text-white/60">
        SCROLL ↓
      </div>
    </section>
  );
}
