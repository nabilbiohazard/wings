import type { Category } from "./types";

export type { Category };

export const categories = [
  { id: "necklace", name: "گردنبند", english: "Necklaces", tagline: "نزدیک به قلبت", image: "/images/necklace.png" },
  { id: "bracelet", name: "دستبند", english: "Bracelets", tagline: "همراه لحظه‌های تو", image: "/images/bracelet.png" },
  { id: "earrings", name: "گوشواره", english: "Earrings", tagline: "یک درخشش کوچک", image: "/images/earrings.png" },
  { id: "charms", name: "چارم‌ها", english: "Charms", tagline: "داستان خودت را بساز", image: "/images/charms.png" },
];

export const persianNumber = (value:number) =>
  new Intl.NumberFormat("fa-IR").format(value);
