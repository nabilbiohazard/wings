import { Wordmark } from "./header";
import { Icon } from "./icon";
export function Footer() {
  return <footer id="contact" className="footer section-container"><div className="footer-top"><div><Wordmark /><p>تکه‌های کوچک، حس‌های بزرگ.</p></div><div className="footer-contact"><span>خوشحال می‌شویم از تو بشنویم</span><a href="mailto:hello@wingsgallery.ir" dir="ltr">hello@wingsgallery.ir<Icon name="arrow" size={17} /></a></div><a href="#collections" className="footer-note" lang="en" dir="ltr">Spread a little<br /><em>more sparkle ♡</em></a></div><div className="footer-bottom"><span>© ۱۴۰۵ وینگز گالری. با عشق، برای تو.</span><span>نسخه نمایشی فروشگاه · محصولات و قیمت‌ها نمونه هستند</span><a href="#">بازگشت به بالا ↑</a></div></footer>;
}
