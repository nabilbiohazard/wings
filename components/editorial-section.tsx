import Image from "next/image";
import { Icon } from "./icon";
import { Reveal } from "./reveal";
export function EditorialSection() {
  return <section className="editorial-section section-container" id="our-story" aria-labelledby="story-heading"><Reveal className="editorial-grid">
    <div className="editorial-photo"><Image src="/images/hero.png" alt="لحظه‌ای آرام با اکسسوری‌های ظریف و رنگی" fill sizes="(max-width: 700px) 100vw, 50vw" className="object-cover" /><span lang="en" dir="ltr">Everyday<br /><em>happiness.</em><small>GOOD JEWELRY. GOOD MOOD.</small></span></div>
    <div className="editorial-copy"><Icon name="sparkle" size={29} /><p className="eyebrow">به قشنگیِ خودت</p><h2 id="story-heading">شادی، در همین<br /><span>چیزهای کوچک است.</span></h2><p>ما به جادوی جزئیات کوچک باور داریم. به یک چارم که خاطره‌ای را زنده می‌کند، یک رنگ که لبخند می‌آورد و هدیه‌ای که می‌گوید «به یادت هستم».</p><p>وینگز برای همین لحظه‌هاست؛ برای اینکه هر روز، کمی بیشتر شبیه خودت بدرخشی.</p><a className="text-link" href="#journal">از دنیای وینگز بیشتر بخوان<Icon name="arrow" size={18} /></a><span className="editorial-signature" lang="en">With love, Wings ♡</span></div>
  </Reveal>
  <div id="journal" className="journal-note"><div><p className="eyebrow">یادداشتی از مجله وینگز</p><h3>چطور یک اکسسوری، داستان تو می‌شود؟</h3></div><p>از رنگی که دوست داری شروع کن. یک چارم برای یک خاطره، یک قلب برای یک نفر و یک پروانه برای شروعی تازه. کنار هم بگذارشان؛ قشنگ‌ترین ترکیب، همان است که شبیه توست.</p><a href="#collections" className="text-link">داستانت را بساز<Icon name="arrow" size={18} /></a></div>
  </section>;
}
