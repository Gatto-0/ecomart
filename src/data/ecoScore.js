// src/data/ecoScore.js
// Single source of truth for the eco score. Used by the How it works page,
// the Shop product cards, the checkout summary and Eco Buddy.
//
// Each product (src/data/products.js, added later) stores:
//   ecoScores: { materials, packaging, sourcing, carbon, durability }
// where every value is 0, 1 or 2. The total (out of 10) and the colour band
// are always calculated with getTotal() and getBand() below, never typed by hand.

export const MISSION =
  "We built EcoMart so you can see what a purchase really costs the planet.";

export const DISCLAIMER =
  "Scores in this demo are based on the product information we list. A claim only earns points when it is specific.";

export const MAX_SCORE = 10;

// icon = lucide-react icon name
export const criteria = [
  {
    key: "materials",
    name: "Materials",
    icon: "Sprout",
    question: "What is it made of?",
    levels: [
      "Virgin plastic or unknown",
      "Mixed or partly recycled",
      "Natural, recycled or certified",
    ],
  },
  {
    key: "packaging",
    name: "Packaging",
    icon: "Package",
    question: "What does it come in?",
    levels: [
      "Single-use plastic",
      "Some plastic or mixed",
      "Plastic-free, refillable or compostable",
    ],
  },
  {
    key: "sourcing",
    name: "Sourcing",
    icon: "MapPin",
    question: "Where and how was it made?",
    levels: [
      "Unknown origin",
      "Partly traceable",
      "Local or certified, ethically made",
    ],
  },
  {
    key: "carbon",
    name: "Carbon",
    icon: "Cloud",
    question: "What did making and shipping it cost the climate?",
    levels: ["High", "Medium", "Low"],
  },
  {
    key: "durability",
    name: "Durability",
    icon: "Hourglass",
    question: "How long does it last, and what happens after?",
    levels: [
      "Disposable",
      "Lasts a while",
      "Reusable, repairable or compostable",
    ],
  },
];

// Show the scale left to right: clay (0-4), yellow (5-7), green (8-10)
export const bands = [
  { key: "clay", min: 0, max: 4, label: "Think twice", color: "#C8773C" },
  {
    key: "yellow",
    min: 5,
    max: 7,
    label: "Good, with room to improve",
    color: "#E2B646",
  },
  { key: "green", min: 8, max: 10, label: "Great choice", color: "#4C9A5F" },
];

export function getTotal(ecoScores) {
  return criteria.reduce((sum, c) => sum + (ecoScores?.[c.key] ?? 0), 0);
}

export function getBand(total) {
  return (
    bands.find((b) => total >= b.min && total <= b.max) ?? bands[0]
  );
}

// Worked example shown on the How it works page (sample data, not a real product)
export const exampleProduct = {
  name: "Stainless steel water bottle",
  note: "Sample product for illustration",
  ecoScores: {
    materials: 2,
    packaging: 2,
    sourcing: 1,
    carbon: 1,
    durability: 2,
  },
  reasons: {
    materials: "Made from recycled stainless steel.",
    packaging: "Arrives in a paper sleeve, with no plastic.",
    sourcing: "The maker is known, but not independently certified.",
    carbon: "Moderate, because it is made far from the buyer.",
    durability: "Reusable for years and fully recyclable.",
  },
};

export const buddyIntro =
  "Eco Buddy is EcoMart’s shopping assistant. It recommends products, explains every eco score, and suggests a greener swap when something scores low. It can also answer your questions about sustainability.";

export const buddyQuestions = [
  "Find me a plastic-free shampoo",
  "Is this product really eco-friendly?",
  "What is a greener swap for my plastic water bottle?",
];
