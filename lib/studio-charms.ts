import catalogue from "./charm-catalogue.json";
import type { CharmData } from "@/components/custom-design/Charm";

const labels: Record<string, string[]> = {
  "pink-dress": ["لباس صورتی", "پیراهن صورتی"],
  cocktail: ["کوکتل", "نوشیدنی"],
  "ice-cream": ["بستنی"],
  travel: ["سفر"],
  tennis: ["راکت تنیس", "تنیس"],
  chocolate: ["شکلات"],
  "gold-dress": ["لباس طلایی", "پیراهن طلایی", "لباس سفید"],
  shrimp: ["میگو"],
  fashion: ["مد و زیبایی", "مد"],
};

const normalize = (value: string) => value.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\s_-]+/g, " ").trim();

// Local artwork stays usable for designing even when the store is unavailable.
// Prices and purchasable IDs must always come from the live catalogue.
export function studioCharms(storeCharms: CharmData[] = []): CharmData[] {
  const used = new Set<string>();
  const local = catalogue.filter((item) => item.id in labels).map((item): CharmData => {
    const names = [item.name, ...labels[item.id]].map(normalize);
    const matches = storeCharms.filter((charm) => names.includes(normalize(charm.name)));
    const storeCharm = matches.length === 1 ? matches[0] : undefined;
    if (storeCharm) used.add(storeCharm.id);
    return {
      ...storeCharm,
      id: storeCharm?.id ?? item.id,
      name: storeCharm?.name ?? labels[item.id][0],
      image: item.image,
      category: item.category,
      keywords: item.keywords,
      attachment: item.attachment,
    };
  });
  return [...local, ...storeCharms.filter((charm) => !used.has(charm.id))];
}
