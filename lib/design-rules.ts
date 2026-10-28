type CategorizedProduct = {
  name: string;
  category: string;
  categories?: { name: string; slug: string }[];
};

function normalize(value: string) {
  try {
    value = decodeURIComponent(value);
  } catch {
    /* Retain malformed slugs. */
  }
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\s\u200c_-]+/g, " ");
}

export function designRules(product: CategorizedProduct) {
  const categories = normalize(
    [
      product.category,
      ...(product.categories ?? []).flatMap((item) => [item.name, item.slug]),
    ].join(" "),
  );
  const text = /گردنبند|دستبند|necklace|bracelet/.test(categories)
    ? categories
    : normalize(product.name + " " + categories);
  const kind = /گردنبند|necklace/.test(text)
    ? "necklace"
    : /دستبند|bracelet/.test(text)
      ? "bracelet"
      : "other";
  const single = /تک\s*چارم|single\s*charm|one\s*charm/.test(text);
  return {
    kind,
    single,
    label: `${kind === "necklace" ? "گردنبند" : kind === "bracelet" ? "دستبند" : "محصول"} ${single ? "تک‌چارم" : "چندچارم"}`,
    anchor:
      kind === "necklace"
        ? { x: 300, y: 578, rotation: 0 }
        : kind === "bracelet" && single
          ? { x: 298, y: 472, rotation: 0 }
          : { x: 289, y: 516, rotation: 0 },
  };
}
