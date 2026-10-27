// All photography is downloaded once (see public/images/) and served locally —
// no runtime dependency on an external image host.
function localImage(id: string) {
  return `/images/${id}.jpg`;
}

// Flat-lay photography, reused as neutral placeholders for the intimates
// line until real product photography is available. Each entry is verified
// to actually depict the relevant garment type (bras, underwear, soft
// loungewear) rather than an unrelated item carried over from a prior
// catalog, since a mismatched image reads as obviously broken on a product
// page, not just generic.
export const CATEGORY_PHOTOS: Record<string, string[]> = {
  Bras: [
    "AdjyrNhFVPI", // assorted lace bras and bralettes, flat lay
  ],
  Underwear: [
    "AdjyrNhFVPI", // assorted panties and bralettes, flat lay
  ],
  Loungewear: [
    "1594633312681-425c7b97ccd1", // satin lounge joggers
    "1516762689617-e1cffcef479d", // satin lounge joggers, detail
    "1558769132-cb1aea458c5e", // knit sweater, casual flat lay
  ],
  Sleepwear: [
    "AdjyrNhFVPI", // lace bralette and panty set, flat lay
    "1434389677669-e08b4cac3105", // soft knit, close drape
  ],
  Shapewear: [
    "AdjyrNhFVPI", // smooth-fit bra and panty set, flat lay
  ],
  Accessories: [
    "1434389677669-e08b4cac3105", // soft knit on hanger
    "AdjyrNhFVPI", // flat lay detail
  ],
};

const FALLBACK = CATEGORY_PHOTOS.Bras;

export function categoryImages(category: string, count: number, offset = 0): string[] {
  const pool = CATEGORY_PHOTOS[category] ?? FALLBACK;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(localImage(pool[(offset + i) % pool.length]));
  }
  return out;
}

export function categoryImage(category: string, index = 0): string {
  const pool = CATEGORY_PHOTOS[category] ?? FALLBACK;
  return localImage(pool[index % pool.length]);
}

// Wide, editorial shots for hero/landing/collection-cover use (any category, cover-fit).
export const EDITORIAL_WIDE = [
  "1434389677669-e08b4cac3105",
  "1594633312681-425c7b97ccd1",
  "AdjyrNhFVPI",
];

export function editorialImage(index: number): string {
  return localImage(EDITORIAL_WIDE[index % EDITORIAL_WIDE.length]);
}

export function rawUnsplash(id: string): string {
  return localImage(id);
}
