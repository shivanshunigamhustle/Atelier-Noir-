function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=65&fit=crop&fm=jpg&auto=compress`;
}

// Curated, visually-verified editorial fashion photography (Unsplash), grouped by category.
// Verified via browser: each id resolves to a real clothing/apparel photo matching its label.
export const CATEGORY_PHOTOS: Record<string, string[]> = {
  Outerwear: [
    "1539109136881-3be0616acf4b", // woman in blue trench, plaza
    "1525450824786-227cbef70703", // herringbone coat, sunglasses
    "1544022613-e87ca75a784a", // olive oversized jacket
    "1483985988355-763728e1935b", // maroon coat, shopping
    "1591047139829-d91aecb6caea", // rust bomber, flat
    "1485968579580-b6d095142e6e", // dark teal wrap coat
  ],
  Knitwear: [
    "1434389677669-e08b4cac3105", // cream fringe poncho
    "1562157873-818bc0726f68", // folded knitwear stack
    "1558769132-cb1aea458c5e", // rack of cardigans
  ],
  Dresses: [
    "1515372039744-b8f02a3ae446", // white dress on stairs
    "1524504388940-b1c1722653e1", // sheer black top portrait
    "1515886657613-9f3515b0c78f", // mustard co-ord, editorial
  ],
  Tailoring: [
    "1618886614638-80e3c103d31a", // man in black suit, architectural plaza
    "1542272604-787c3835535d", // tailored denim, hanging
    "1551488831-00ddcb6c6bd3", // rack of shirting
    "1507003211169-0a1dd7228f2d", // menswear portrait, white shirt
    "1516762689617-e1cffcef479d", // folded trousers stack
    "1594633312681-425c7b97ccd1", // blush trouser flat lay
    "1551232864-3f0890e580d9", // tailoring rack
  ],
  Accessories: [
    "1490114538077-0a7f8cb49891", // flat lay, scarf and leather
    "1441986300917-64674bd600d8", // store display, bags
    "1590874103328-eac38a683ce7", // structured leather bag
    "1581101767113-1677fc2beaa8", // flat lay, watch and leather
    "1507680434567-5739c80be1ac", // collar and watch, close detail
  ],
  Footwear: [
    "1608256246200-53e635b5b65f", // leather lace-up boot
    "1605812860427-4024433a70fd", // suede boots, hanging
    "1525507119028-ed4c629a60a3", // heeled shoes, detail
  ],
};

const FALLBACK = CATEGORY_PHOTOS.Tailoring;

export function categoryImages(category: string, count: number, offset = 0, w = 900, h = 1125): string[] {
  const pool = CATEGORY_PHOTOS[category] ?? FALLBACK;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(unsplash(pool[(offset + i) % pool.length], w, h));
  }
  return out;
}

export function categoryImage(category: string, index = 0, w = 900, h = 1125): string {
  const pool = CATEGORY_PHOTOS[category] ?? FALLBACK;
  return unsplash(pool[index % pool.length], w, h);
}

// Wide, editorial shots for hero/landing/collection-cover use (any category, cover-fit).
export const EDITORIAL_WIDE = [
  "1539109136881-3be0616acf4b",
  "1525450824786-227cbef70703",
  "1483985988355-763728e1935b",
  "1515886657613-9f3515b0c78f",
];

export function editorialImage(index: number, w = 1800, h = 1100): string {
  return unsplash(EDITORIAL_WIDE[index % EDITORIAL_WIDE.length], w, h);
}

export function rawUnsplash(id: string, w: number, h: number): string {
  return unsplash(id, w, h);
}
