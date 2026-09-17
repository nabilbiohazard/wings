export type Category = "all" | "necklace" | "bracelet" | "earrings" | "charms";
export type Product = { id: string; name: string; english: string; category: Category; price: number; image: string; label?: string; description: string };

export const products: Product[] = [
  { id: "butterfly", name: "گردنبند پروانه آبی", english: "Blue Butterfly Necklace", category: "necklace", price: 980000, image: "/images/necklace.png", label: "تازه رسیده", description: "یک پروانه کوچک، برای رویاهای بزرگ. گردنبندی ظریف با آویز مینایی آبی و زنجیر نقره‌ای‌رنگ؛ همراه دوست‌داشتنی استایل هر روز شما." },
  { id: "cherry", name: "دستبند چارم گیلاس", english: "Cherry Charm Bracelet", category: "bracelet", price: 1250000, image: "/images/bracelet.png", label: "محبوب شما", description: "چند تکه شادی دور مچ شما؛ ترکیبی از گیلاس‌های قرمز، گل‌های کوچک و پروانه‌های رنگی روی یک زنجیر نقره‌ای‌رنگ." },
  { id: "heart", name: "گوشواره قلب صورتی", english: "Pink Heart Huggies", category: "earrings", price: 850000, image: "/images/earrings.png", description: "قلب‌های کوچک صورتی با حلقه‌های ظریف نقره‌ای‌رنگ. سبک، بازیگوش و مناسب لحظه‌هایی که می‌خواهید کمی بیشتر خودتان باشید." },
  { id: "garden", name: "ست چارم باغ کوچک", english: "Little Garden Charms", category: "charms", price: 690000, image: "/images/charms.png", label: "تازه رسیده", description: "باغ کوچک خودتان را بسازید. مجموعه‌ای از پنج چارم رنگی با طرح پروانه، گیلاس، قلب، گل و ستاره برای شخصی‌سازی اکسسوری‌هایتان." },
];

export const categories: { id: Category; name: string; english: string; tagline: string; image: string }[] = [
  { id: "necklace", name: "گردنبند", english: "Necklaces", tagline: "نزدیک به قلبت", image: "/images/necklace.png" },
  { id: "bracelet", name: "دستبند", english: "Bracelets", tagline: "همراه لحظه‌های تو", image: "/images/bracelet.png" },
  { id: "earrings", name: "گوشواره", english: "Earrings", tagline: "یک درخشش کوچک", image: "/images/earrings.png" },
  { id: "charms", name: "چارم‌ها", english: "Charms", tagline: "داستان خودت را بساز", image: "/images/charms.png" },
];
export const persianNumber = (value: number) => new Intl.NumberFormat("fa-IR").format(value);
