// src/data/products.js
// Sample catalogue for the EcoMart demo: 12 categories, 6 products each (72 total).
// All products are fictional sample data with generic names (no real brands).
// Needs src/data/ecoScore.js (getTotal, getBand).
//
// Photos: /images/products/<slug>.jpg  (falls back to the category photo,
// /images/categories/<slug>.jpg, then to a placeholder block).
//
// impact = rough illustrative estimate over the first year of use, compared with a
// typical conventional alternative: { plasticG: grams of single-use plastic avoided,
// co2Kg: kg of CO2-equivalent avoided }. Always label it "estimate" in the UI.

import { getTotal } from "./ecoScore";

export const DATA_NOTE =
  "Sample products for demonstration. Scores and impact figures are illustrative estimates.";

export const categories = [
  { slug: "kitchen-dining", name: "Kitchen and Dining", blurb: "Reusable essentials for cooking, storing and eating." },
  { slug: "personal-care", name: "Personal Care", blurb: "Bars, refills and reusables for your daily routine." },
  { slug: "home-cleaning", name: "Home and Cleaning", blurb: "Cleaning without the plastic bottles." },
  { slug: "fashion-accessories", name: "Fashion and Accessories", blurb: "Clothes and accessories made to last." },
  { slug: "stationery-office", name: "Stationery and Office", blurb: "Notebooks, pens and desk things with less waste." },
  { slug: "food-drinks", name: "Food and Drinks", blurb: "Pantry staples with greener packaging." },
  { slug: "baby-kids", name: "Baby and Kids", blurb: "Gentler picks for little ones." },
  { slug: "garden-outdoors", name: "Garden and Outdoors", blurb: "Grow, compost and enjoy the outdoors." },
  { slug: "bags-travel", name: "Bags and Travel", blurb: "Carry more, throw away less." },
  { slug: "energy-gadgets", name: "Energy and Gadgets", blurb: "Smarter power and longer-lasting tech." },
  { slug: "pet-care", name: "Pet Care", blurb: "Lower-impact things for your companions." },
  { slug: "wellness-gifts", name: "Wellness and Gifts", blurb: "Thoughtful gifts and calming essentials." },
].map((c) => ({ ...c, image: `/images/categories/${c.slug}.jpg` }));

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// scores = [materials, packaging, sourcing, carbon, durability], each 0, 1 or 2
// impact = [plasticG, co2Kg]
const p = (category, name, price, scores, description, tags, impact) => {
  const slug = slugify(name);
  const ecoScores = {
    materials: scores[0],
    packaging: scores[1],
    sourcing: scores[2],
    carbon: scores[3],
    durability: scores[4],
  };
  return {
    slug,
    name,
    category,
    price, // in INR
    ecoScores,
    total: getTotal(ecoScores),
    description,
    tags,
    impact: { plasticG: impact[0], co2Kg: impact[1] },
    image: `/images/products/${slug}.${slug === "led-bulbs-9-w-pack-of-4" ? "png" : "jpg"}`,
  };
};

export const products = [
  // Kitchen and Dining
  p("kitchen-dining", "Stainless steel water bottle", 799, [2, 2, 1, 1, 2], "Reusable bottle made from recycled steel, with no plastic parts.", ["plastic-free", "reusable"], [2200, 3.5]),
  p("kitchen-dining", "Bamboo cutlery set", 349, [2, 2, 1, 2, 2], "Fork, knife, spoon and straw in a cotton pouch for the road.", ["plastic-free", "reusable"], [150, 0.6]),
  p("kitchen-dining", "Beeswax food wraps (pack of 3)", 599, [2, 2, 1, 2, 1], "Washable wraps that replace cling film.", ["plastic-free", "reusable"], [300, 0.8]),
  p("kitchen-dining", "Glass food storage jars (set of 4)", 899, [2, 1, 1, 1, 2], "Airtight glass jars with bamboo lids for leftovers and pantry staples.", ["plastic-free", "reusable"], [400, 1.0]),
  p("kitchen-dining", "Plant-fibre dish sponges (pack of 3)", 249, [2, 2, 0, 2, 2], "Compostable sponges, though the maker doesn’t say where they are produced.", ["compostable", "plastic-free"], [100, 0.3]),
  p("kitchen-dining", "Recycled-plastic cutting board", 499, [1, 1, 1, 1, 1], "Made from recycled plastic and long lasting, but still plastic.", ["recycled"], [0, 0.2]),

  // Personal Care
  p("personal-care", "Bamboo toothbrush (pack of 4)", 299, [1, 2, 1, 2, 1], "Bamboo handles with nylon bristles, so the head needs separating before disposal.", ["plastic-free-handle"], [60, 0.3]),
  p("personal-care", "Shampoo bar", 349, [2, 2, 1, 2, 2], "A solid bar in a paper wrap that replaces a plastic bottle.", ["plastic-free", "zero-waste"], [180, 1.2]),
  p("personal-care", "Refillable deodorant case with refills", 549, [2, 2, 1, 1, 2], "A metal case you keep and refill with paper-wrapped sticks.", ["refillable", "plastic-free"], [90, 0.5]),
  p("personal-care", "Reusable cotton rounds (set of 10)", 299, [2, 1, 1, 2, 2], "Washable rounds with a laundry bag, replacing disposable pads.", ["reusable"], [200, 0.7]),
  p("personal-care", "Body lotion in recycled-plastic tube", 399, [1, 1, 1, 1, 1], "Plant-based lotion in a tube made from recycled plastic.", ["recycled"], [20, 0.1]),
  p("personal-care", "“Natural” wet wipes (pack of 80)", 199, [0, 0, 0, 1, 0], "Labelled natural, but they contain plastic fibres and come in a plastic pack.", ["vague-claim", "single-use"], [0, 0]),

  // Home and Cleaning
  p("home-cleaning", "Dishwash soap bar", 199, [2, 2, 1, 2, 1], "A solid bar that lasts for weeks and needs no bottle.", ["plastic-free", "zero-waste"], [120, 0.6]),
  p("home-cleaning", "Floor cleaner concentrate (refill)", 349, [1, 2, 1, 2, 2], "Dilute at home in a bottle you already own.", ["refillable"], [250, 0.9]),
  p("home-cleaning", "Cellulose scrub cloths (pack of 5)", 299, [2, 1, 0, 2, 2], "Compostable cloths that replace disposable wipes.", ["compostable", "reusable"], [200, 0.6]),
  p("home-cleaning", "Soap nuts for laundry", 249, [2, 2, 1, 2, 1], "Natural berries that wash clothes, in a paper bag.", ["plastic-free", "natural"], [160, 0.7]),
  p("home-cleaning", "Compostable bin liners (30)", 279, [1, 1, 1, 1, 1], "A plant-based blend that needs industrial composting to break down.", ["compostable"], [60, 0.2]),
  p("home-cleaning", "“Biodegradable” plastic trash bags", 149, [0, 1, 0, 1, 0], "Labelled biodegradable, with no proof of what they are made of.", ["vague-claim", "single-use"], [0, 0]),

  // Fashion and Accessories
  p("fashion-accessories", "Organic cotton t-shirt", 699, [2, 1, 1, 1, 1], "Soft everyday tee in organic cotton, packed in a paper sleeve.", ["organic"], [0, 0.8]),
  p("fashion-accessories", "Recycled-fibre socks (3 pairs)", 399, [1, 1, 1, 1, 1], "Recycled fibres blended with synthetics for durability.", ["recycled"], [30, 0.3]),
  p("fashion-accessories", "Cork wallet", 899, [2, 2, 1, 1, 2], "A slim wallet in cork leather, made to last for years.", ["plastic-free", "durable"], [50, 0.8]),
  p("fashion-accessories", "Wooden-frame sunglasses", 1199, [1, 2, 1, 1, 2], "Wooden frames with standard plastic lenses.", ["durable"], [40, 0.5]),
  p("fashion-accessories", "Handloom cotton scarf", 549, [2, 2, 2, 2, 2], "Handwoven locally by a named weaver cooperative, in an undyed cotton.", ["local", "handmade"], [0, 1.2]),
  p("fashion-accessories", "“Eco” fleece jacket", 1499, [0, 1, 0, 0, 1], "Labelled eco, but the maker doesn’t state any recycled content.", ["vague-claim"], [0, 0]),

  // Stationery and Office
  p("stationery-office", "Recycled paper notebook (A5)", 149, [2, 2, 1, 2, 1], "Notebook made from post-consumer paper, with a stitched spine.", ["recycled", "plastic-free"], [0, 0.6]),
  p("stationery-office", "Plantable pencils (10)", 199, [2, 2, 1, 1, 1], "Pencils with a seed capsule on the end that you can plant.", ["compostable"], [20, 0.2]),
  p("stationery-office", "Refillable metal pen", 499, [2, 2, 1, 1, 2], "A metal pen you keep for years and refill with cartridges.", ["refillable", "durable"], [150, 0.5]),
  p("stationery-office", "Bamboo desk organiser", 799, [2, 1, 1, 1, 2], "A tidy tray with compartments for pens and phone.", ["durable"], [200, 0.6]),
  p("stationery-office", "Water-based glue sticks (4)", 149, [1, 1, 1, 2, 0], "Non-toxic glue, but in plastic casings.", ["non-toxic"], [0, 0.1]),
  p("stationery-office", "“Eco” gel pens (pack of 10)", 129, [0, 0, 0, 1, 0], "Labelled eco, but plastic bodies with no refills.", ["vague-claim", "single-use"], [0, 0]),

  // Food and Drinks
  p("food-drinks", "Loose-leaf green tea (100 g)", 349, [2, 2, 2, 1, 1], "Whole leaves in a compostable pouch, from a named estate.", ["organic", "compostable"], [40, 0.3]),
  p("food-drinks", "Rolled oats (1 kg)", 249, [2, 1, 2, 2, 1], "Whole-grain oats in a paper bag with a small plastic window.", ["organic"], [20, 0.2]),
  p("food-drinks", "Millet snack pouches (pack of 6)", 199, [2, 1, 1, 2, 1], "Roasted millet snacks in pouches that carry a recycling mark.", ["natural"], [30, 0.2]),
  p("food-drinks", "Cold-pressed coconut oil (500 ml)", 499, [2, 2, 1, 1, 2], "Cooking oil in a refillable glass jar.", ["plastic-free", "refillable"], [60, 0.3]),
  p("food-drinks", "Fair-sourced coffee beans (250 g)", 549, [2, 1, 2, 1, 1], "Single-origin beans from a named farm, in a paper bag with a liner.", ["sustainably-sourced"], [40, 0.3]),
  p("food-drinks", "Flavoured drink pods (12)", 399, [0, 0, 1, 0, 0], "Labelled recyclable, but the pods combine mixed materials.", ["vague-claim", "single-use"], [0, 0]),

  // Baby and Kids
  p("baby-kids", "Organic cotton baby bodysuit", 499, [2, 1, 1, 1, 1], "Soft bodysuit in organic cotton, packed in paper.", ["organic"], [0, 0.6]),
  p("baby-kids", "Wooden teether rings (set of 3)", 399, [2, 2, 1, 2, 2], "Smooth wooden rings with no plastic parts.", ["plastic-free"], [60, 0.4]),
  p("baby-kids", "Reusable cloth nappies (set of 4)", 1299, [2, 2, 1, 1, 2], "Washable nappies with inserts, replacing disposables.", ["reusable"], [2000, 8]),
  p("baby-kids", "Natural rubber toys (set of 3)", 599, [2, 2, 1, 2, 2], "Soft toys in natural rubber that last through many children.", ["plastic-free", "durable"], [150, 0.8]),
  p("baby-kids", "Bamboo kids’ tableware set", 699, [1, 2, 1, 1, 2], "Bamboo fibre plates and cups held together with a resin binder.", ["reusable"], [200, 0.6]),
  p("baby-kids", "Recycled-plastic building blocks", 799, [1, 1, 1, 1, 2], "Sturdy blocks made from recycled plastic, built to be passed on.", ["recycled", "durable"], [0, 0.4]),

  // Garden and Outdoors
  p("garden-outdoors", "Coir seedling pots (pack of 12)", 199, [2, 2, 1, 2, 2], "Plant the pot and seedling together, and the pot breaks down in soil.", ["compostable", "plastic-free"], [240, 0.6]),
  p("garden-outdoors", "Heirloom vegetable seed kit", 349, [2, 2, 2, 2, 1], "Open-pollinated seeds in paper packets, from a local seed bank.", ["local", "plastic-free"], [30, 0.4]),
  p("garden-outdoors", "Stainless compost caddy", 999, [2, 1, 1, 1, 2], "A countertop bin with a carbon filter for kitchen scraps.", ["durable"], [200, 1.0]),
  p("garden-outdoors", "Natural jute twine", 149, [2, 2, 1, 2, 1], "Plain jute twine for tying plants, with no plastic spool.", ["plastic-free", "compostable"], [120, 0.3]),
  p("garden-outdoors", "Recycled-plastic watering can", 649, [1, 1, 1, 1, 2], "A tough can made from recycled plastic.", ["recycled", "durable"], [0, 0.3]),
  p("garden-outdoors", "“Eco” plastic plant pots (10)", 179, [0, 1, 0, 1, 1], "Labelled eco, but made of ordinary plastic.", ["vague-claim"], [0, 0]),

  // Bags and Travel
  p("bags-travel", "Cotton tote bag", 299, [2, 2, 1, 1, 2], "A sturdy tote that replaces hundreds of plastic bags.", ["reusable"], [900, 1.5]),
  p("bags-travel", "Upcycled denim backpack", 1799, [2, 1, 1, 1, 2], "A backpack stitched from reclaimed denim.", ["upcycled", "durable"], [0, 1.8]),
  p("bags-travel", "Foldable produce bags (set of 6)", 349, [1, 2, 1, 2, 2], "Light recycled-polyester bags for fruit and vegetables.", ["reusable", "recycled"], [500, 0.8]),
  p("bags-travel", "Jute shopping bag", 249, [2, 2, 1, 2, 2], "A strong, natural-fibre bag for heavy shopping.", ["plastic-free", "reusable"], [900, 1.6]),
  p("bags-travel", "Travel toiletry tins (set of 3)", 449, [2, 1, 1, 1, 2], "Refillable tins for soap, balm and small items.", ["refillable", "plastic-free"], [200, 0.5]),
  p("bags-travel", "Recycled-polyester duffel bag", 2199, [1, 1, 1, 0, 2], "Made from recycled bottles and very durable, but made far away.", ["recycled", "durable"], [0, 0.9]),

  // Energy and Gadgets
  p("energy-gadgets", "LED bulbs, 9 W (pack of 4)", 349, [1, 1, 1, 2, 2], "Warm-white LED bulbs that use far less energy than old bulbs.", ["energy-saving"], [0, 80]),
  p("energy-gadgets", "Solar power bank", 1999, [1, 1, 1, 1, 1], "Charges from sunlight as a backup, with slow charging.", ["solar"], [0, 6]),
  p("energy-gadgets", "Rechargeable AA batteries with charger (4)", 799, [1, 1, 1, 1, 2], "Rechargeable cells that replace dozens of disposable ones.", ["reusable"], [120, 12]),
  p("energy-gadgets", "Bamboo phone stand", 399, [2, 2, 1, 1, 2], "A simple folding stand in solid bamboo.", ["plastic-free", "durable"], [30, 0.3]),
  p("energy-gadgets", "Recycled-plastic phone case", 499, [1, 1, 1, 1, 1], "A slim case made from recycled plastic.", ["recycled"], [0, 0.3]),
  p("energy-gadgets", "“Green” disposable batteries (pack of 8)", 199, [0, 1, 0, 0, 0], "Labelled green, but they are single-use alkaline cells.", ["vague-claim", "single-use"], [0, 0]),

  // Pet Care
  p("pet-care", "Hemp pet leash", 499, [2, 2, 1, 2, 2], "A strong, soft leash woven from hemp.", ["plastic-free", "durable"], [50, 0.5]),
  p("pet-care", "Compostable waste bags (60)", 249, [1, 1, 1, 1, 1], "Plant-based bags that need industrial composting.", ["compostable"], [60, 0.2]),
  p("pet-care", "Natural rubber chew toy", 349, [2, 2, 1, 2, 2], "A bouncy chew toy that lasts, in natural rubber.", ["plastic-free", "durable"], [100, 0.4]),
  p("pet-care", "Stainless steel pet bowl", 599, [2, 2, 1, 1, 2], "A weighted, non-slip bowl that lasts for years.", ["plastic-free", "durable"], [150, 0.6]),
  p("pet-care", "Cork-and-cotton pet bed", 1899, [2, 1, 1, 1, 2], "A washable cover over a cork-filled cushion.", ["durable"], [0, 1.0]),
  p("pet-care", "Recycled-fabric cat tunnel", 699, [1, 1, 1, 1, 1], "A play tunnel stitched from recycled fabric.", ["recycled"], [0, 0.3]),

  // Wellness and Gifts
  p("wellness-gifts", "Soy wax candle in glass jar", 599, [2, 1, 1, 1, 2], "A hand-poured candle in a jar you can reuse.", ["reusable"], [40, 0.3]),
  p("wellness-gifts", "Cork yoga mat", 1999, [2, 2, 1, 1, 2], "A grippy mat in cork and natural rubber.", ["plastic-free", "durable"], [200, 1.5]),
  p("wellness-gifts", "Herbal tea and soap gift box", 899, [2, 2, 1, 2, 1], "A paper-packed gift set with no plastic.", ["plastic-free", "gift"], [80, 0.5]),
  p("wellness-gifts", "Reusable gift wrap cloths (set of 3)", 399, [2, 2, 1, 2, 2], "Fabric wraps that replace single-use wrapping paper.", ["reusable", "gift"], [400, 1.0]),
  p("wellness-gifts", "Essential oil roll-on (glass)", 449, [2, 1, 1, 1, 1], "A calming blend in a small glass roller bottle.", ["natural"], [30, 0.2]),
  p("wellness-gifts", "“Biodegradable” glitter set", 199, [0, 1, 0, 1, 0], "Labelled biodegradable, but made of plastic film.", ["vague-claim", "single-use"], [0, 0]),
];

// ---------- helpers (also used by Eco Buddy) ----------

export const getProduct = (slug) => products.find((x) => x.slug === slug);

export const getProductsByCategory = (categorySlug) =>
  products.filter((x) => x.category === categorySlug);

export const getCategory = (slug) => categories.find((c) => c.slug === slug);

// A better-scoring product in the same category (best score first, then lowest price).
// Returns null if the product already scores 8 or more, or nothing scores higher.
export function getSwap(product) {
  if (!product || product.total >= 8) return null;
  const better = products
    .filter((x) => x.category === product.category && x.total > product.total)
    .sort((a, b) => b.total - a.total || a.price - b.price);
  return better[0] ?? null;
}

// Simple search over name, description, tags and category name.
export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((x) => {
    const cat = getCategory(x.category)?.name.toLowerCase() ?? "";
    return (
      x.name.toLowerCase().includes(q) ||
      x.description.toLowerCase().includes(q) ||
      x.tags.some((t) => t.includes(q)) ||
      cat.includes(q)
    );
  });
}
