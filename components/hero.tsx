import Image from "next/image";
import { Icon } from "./icon";
import { Reveal } from "./reveal";
export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading">
    <div className="hero-photo"><Image src="/images/hero-butterfly.png" alt="گردنبند و دستبند طلایی با پروانه‌های رنگی روی پارچه کتان روشن" fill preload sizes="100vw" className="object-cover" /><span className="photo-note" lang="en" dir="ltr">Same you.<br />A little more sparkle.<span>♡</span></span></div>
    <div className="hero-inner"><Reveal className="hero-copy">
      <p className="eyebrow">بیشتر از یک اکسسوری</p>
      <h1 id="hero-heading" lang="en" dir="ltr">Your style,<br /><span>Your choice</span></h1>
      <p className="hero-english" lang="en" dir="ltr">Small charms. <em>Brighter days.</em></p>
      <p className="hero-description">برای هر حالِ تو<br />هر روز، یک انتخاب تازه<br />اکسسوری برای سبک خودت</p>
      <div className="hero-ctas"><a href="#new-arrivals" className="button-primary">کشف تازه‌رسیده‌ها<Icon name="arrow" size={19} /></a><a href="#our-story" className="story-link"><span className="play-circle">▷</span>داستان وینگز</a></div>
      <aside id="build-your-own" className="hero-builder-card" aria-labelledby="builder-heading">
        <span className="builder-symbol"><Icon name="sparkle" size={25} /></span>
        <div className="builder-copy">
          <div className="builder-heading"><h2 id="builder-heading">خودت بساز</h2></div>
          <p>گردنبند، دستبند یا گوشواره‌ات رو با چارم‌های دلخواهت بساز؛ درست به سلیقه‌ی خودت.</p>
        </div>
      </aside>
      <div className="hero-footnote"><span className="fine-line" /><span>کالکشن های چارم جدید</span><Icon name="sparkle" size={13} /></div>
    </Reveal></div>
    <span className="hero-edition" lang="en" dir="ltr">THE LITTLE JOYS COLLECTION — 2026</span>
  </section>;
}
