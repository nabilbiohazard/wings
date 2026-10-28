import Link from "next/link";
import {
  ArrowUpLeft,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import styles from "./contact.module.css";
import { Icon as BrandIcon } from "@/components/icon";

function InstagramIcon({ size = 17 }: { size?: number; strokeWidth?: number }) {
  return <BrandIcon name="instagram" size={size} />;
}

// Replace these sample details with Wings' contact details when ready.
const phones = [
  { number: "+989120000000", label: "۰۹۱۲ ۰۰۰ ۰۰۰۰" },
  { number: "+989130000000", label: "۰۹۱۳ ۰۰۰ ۰۰۰۰" },
];
const socialLinks = [
  {
    name: "اینستاگرام",
    href: "https://www.instagram.com/YOUR_USERNAME/",
    icon: InstagramIcon,
  },
  { name: "واتساپ", href: "https://wa.me/989120000000", icon: MessageCircle },
  { name: "تلگرام", href: "https://t.me/YOUR_USERNAME", icon: Send },
];

export function ContactInfo() {
  return (
    <aside className={styles.contactInfo} aria-label="راه‌های ارتباطی وینگز">
      <p className={styles.eyebrow} lang="en" dir="ltr">
        LET’S MAKE A CONNECTION
      </p>
      <h2>
        هر پیام،
        <br />
        شروع یک آشنایی‌ست<span>.</span>
      </h2>
      <p className={styles.infoDescription}>
        برای انتخاب یک قطعه کمک می‌خواهی، دربارهٔ سفارشت سؤال داری یا ایده‌ای
        برای همکاری در ذهن داری؟ از همین‌جا شروع کنیم.
      </p>
      <div className={styles.channelList}>
        <div className={styles.phoneRow}>
          <span className={styles.channelIcon}>
            <Phone size={21} strokeWidth={1.3} />
          </span>
          <div>
            <strong>صدایت را بشنویم</strong>
            <div>
              {phones.map((phone) => (
                <a key={phone.number} href={`tel:${phone.number}`} dir="ltr">
                  {phone.label}
                </a>
              ))}
            </div>
            <small>شماره‌های نمونه؛ قابل جایگزینی</small>
          </div>
        </div>
        <a href="mailto:hello@wingsgallery.ir" className={styles.channel}>
          <span className={styles.channelIcon}>
            <Mail size={21} strokeWidth={1.3} />
          </span>
          <span>
            <strong>یک نامهٔ کوچک</strong>
            <small dir="ltr">hello@wingsgallery.ir</small>
          </span>
          <ArrowUpLeft size={17} />
        </a>
        <a href="#contact-form" className={styles.channel}>
          <span className={styles.channelIcon}>
            <MessageCircle size={21} strokeWidth={1.3} />
          </span>
          <span>
            <strong>پیامت را اینجا بگذار</strong>
            <small>سؤال، پیشنهاد یا شروع یک همکاری</small>
          </span>
          <ArrowUpLeft size={17} />
        </a>
        <Link href="/account" className={styles.channel}>
          <span className={styles.channelIcon}>
            <Package size={21} strokeWidth={1.3} />
          </span>
          <span>
            <strong>از سفارشت خبر بگیر</strong>
            <small>مشاهدهٔ سفارش‌ها در حساب کاربری</small>
          </span>
          <ArrowUpLeft size={17} />
        </Link>
      </div>
      <div className={styles.socialLinks} aria-label="شبکه‌های اجتماعی وینگز">
        {socialLinks.map(({ name, href, icon: Icon }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer">
            <Icon size={17} strokeWidth={1.3} />
            {name}
            <ArrowUpLeft size={12} />
          </a>
        ))}
      </div>
      <p className={styles.sampleNote}>
        لینک‌های شبکه‌های اجتماعی فعلاً نمونه‌اند.
      </p>
      <div className={styles.orderNote}>
        <Sparkles size={20} strokeWidth={1.2} />
        <div>
          <h3>یک جزئیات کوچک، یک کمک بزرگ</h3>
          <p>
            اگر دربارهٔ سفارشت می‌نویسی، شمارهٔ سفارش و شمارهٔ تماس ثبت‌شده را
            هم بفرست تا بهتر راهنمایی‌ات کنیم.
          </p>
        </div>
      </div>
      <span className={styles.infoSignature} lang="en" dir="ltr">
        A little closer to you.
      </span>
    </aside>
  );
}
