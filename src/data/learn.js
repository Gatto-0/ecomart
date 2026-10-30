// src/data/learn.js
// Single source of truth for the Learn page AND the landing-page teasers
// (the teasers show the first four topics). Photos: /images/learn/<slug>.jpg

export const topics = [
  {
    slug: "carbon-footprint",
    title: "Our carbon footprint, in everyday terms",
    hook: "Every product has a footprint before it reaches you.",
    readTime: "2 min read",
    image: "/images/learn/footprint.jpg",
    imageAlt: "Carbon footprint comparison showing CO₂ per person in India and the world average",
    stat: {
      value: "~3 vs ~6.5",
      label:
        "tonnes of CO₂-equivalent per person each year: India vs the world average",
    },
    body:
      "Your carbon footprint is the greenhouse gas released by the things you do and buy, counted in tonnes of CO₂-equivalent. Travel and electricity are the obvious parts. The less obvious part is products: making, packing and shipping an item releases gases long before it reaches you. The average person in India is responsible for about 3 tonnes a year, roughly half the world average, but that number is rising as incomes and consumption grow. The good news is that a footprint is made of many small choices, and shopping is one you control every week.",
    tips: [
      "Buy fewer things and choose ones built to last.",
      "Prefer products with less packaging and shorter journeys.",
      "Check a product’s eco score before adding it to your cart.",
    ],
    source:
      "Global Carbon Project, Global Carbon Budget 2024 (figures vary slightly between reports)",
    askPrompt:
      "Explain my carbon footprint in everyday terms and suggest EcoMart products that help lower it.",
  },
  {
    slug: "why-plastic-matters",
    title: "Why plastic matters",
    hook: "Only about 9% of all plastic ever made has been recycled.",
    readTime: "2 min read",
    image: "/images/learn/9 percent plastic.jpg",
    imageAlt: "Only about nine percent of plastic is recycled",
    stat: {
      value: "9%",
      label: "of all plastic ever produced has been recycled",
    },
    body:
      "Plastic is cheap, light and useful, which is exactly why we make over 400 million tonnes of it every year. The problem is what happens next: only about 9% of all plastic ever made has been recycled, and around 11 million tonnes reach the ocean each year. Plastic doesn’t rot. It breaks into smaller and smaller pieces called microplastics, which now turn up in water, soil and food. Production is forecast to triple by 2060 if nothing changes. The simplest fix is to need less of it, starting with packaging we use once and throw away.",
    tips: [
      "Say no to single-use bags, cutlery and straws.",
      "Carry a reusable bottle and a cloth bag.",
      "Choose plastic-free packaging and refills.",
    ],
    source: "UN Environment Programme (UNEP)",
    askPrompt:
      "Why does plastic matter, and which EcoMart products help me use less of it?",
  },
  {
    slug: "small-switch",
    title: "What a small switch can save",
    hook: "One bulb. At least 75% less energy.",
    readTime: "2 min read",
    image: "/images/learn/bulb.jpg",
    imageAlt: "LED light bulb representing lower energy use",
    stat: {
      value: "75%",
      label:
        "less energy used by a quality LED bulb than an old incandescent bulb",
    },
    body:
      "Small switches matter because everyday items get used or replaced again and again. The US Department of Energy says a quality LED bulb uses at least 75% less energy than an old incandescent bulb and can last up to 25 times longer. A typical LED draws about 10 watts to do the job of a 60-watt bulb. The same thinking works elsewhere: a reusable bottle, a refill pouch or a bar of soap replaces packaging you would otherwise throw away again and again. One swap is tiny. A habit of swaps is not.",
    tips: [
      "Swap old bulbs for LEDs as they burn out.",
      "Replace one throwaway item with a reusable one this week.",
      "Look for refills, bars and concentrates.",
    ],
    source: "US Department of Energy",
    askPrompt:
      "Which small switches save the most, and which EcoMart products can I swap in?",
  },
  {
    slug: "greenwashing",
    title: "Why “eco-friendly” labels can mislead",
    hook: "Green words are cheap. Proof isn’t.",
    readTime: "2 min read",
    image: "/images/learn/deceptive green claims.jpg",
    imageAlt: "Misleading eco-friendly label on a product",
    stat: {
      value: "42%",
      label:
        "of green claims checked in a 2021 EU-led website review looked exaggerated, false or deceptive",
    },
    body:
      "Greenwashing is when a product sounds greener than it really is. Words like “eco”, “natural” or “green” have no fixed meaning, so anyone can print them. An EU study found that more than half of the green claims it looked at were vague, misleading or unfounded, and a 2021 check of shopping websites found 42% of the claims it examined looked exaggerated, false or deceptive. Even labels can fool you: one UK study found that about 60% of plastics marked home-compostable did not fully break down in a home compost heap. Trust specific, measurable claims, for example “70% recycled steel”, and certifications from independent bodies.",
    tips: [
      "Be wary of vague words with no numbers or proof.",
      "Look for specific claims and independent certifications.",
      "Ask Eco Buddy to check a claim before you buy.",
    ],
    source:
      "European Commission and national consumer authorities (2021); European Commission study (2020)",
    askPrompt:
      "How can I spot greenwashing, and how does EcoMart score products honestly?",
  },
  {
    slug: "food-waste",
    title: "The footprint on your plate",
    hook: "A fifth of the food we buy never gets eaten.",
    readTime: "2 min read",
    image: "/images/learn/a fifth of food we buy.jpg",
    imageAlt: "Food waste: one fifth of purchased food goes uneaten",
    stat: {
      value: "1.05 billion",
      label:
        "tonnes of food wasted worldwide in 2022, about 19% of the food available to consumers",
    },
    body:
      "Food that is grown, transported and then thrown away wastes everything that went into it: land, water, energy and money. In 2022 the world wasted about 1.05 billion tonnes of food, roughly a fifth of what was available to consumers, and households were behind about 60% of it. That is around 79 kg per person a year. Food loss and waste is linked to 8–10% of global greenhouse gas emissions, and food rotting in landfill releases methane, a powerful greenhouse gas. Cutting waste at home is one of the few climate actions that also saves you money.",
    tips: [
      "Plan meals and buy only what you will eat.",
      "Store food properly and use leftovers first.",
      "Compost scraps where you can.",
    ],
    source: "UNEP Food Waste Index Report 2024",
    askPrompt:
      "How can I waste less food, and which EcoMart products help with storage and composting?",
  },
  {
    slug: "wardrobe-water",
    title: "The hidden water in your wardrobe",
    hook: "How much water is in one shirt? Nobody agrees.",
    readTime: "2 min read",
    image: "/images/learn/water in shirts.jpg",
    imageAlt: "Glass T-shirt made of water",
    stat: {
      value: "600–7,000",
      label:
        "litres: the range of published estimates for the water needed to make one cotton shirt",
    },
    body:
      "Clothes have a hidden water bill. Cotton is a thirsty crop, and published estimates for the water needed to make one cotton shirt range from about 600 to 7,000 litres, depending on where it is grown and how it is measured. The figure you see most often is 2,700 litres, which traces back to the WWF. Be careful with headline numbers: researchers have challenged several popular fashion statistics, so we show a range instead of a single claim. Synthetic fabrics have their own problem, because washing them releases tiny plastic fibres. Wearing things longer is the most reliable fix.",
    tips: [
      "Buy fewer, better pieces and wear them longer.",
      "Repair, restyle or buy second-hand first.",
      "Wash less often and at lower temperatures.",
    ],
    source:
      "Planet Tracker review of fashion statistics; WWF (the 2,700-litre figure)",
    askPrompt:
      "How can I make my wardrobe more sustainable, and which EcoMart fashion products do you recommend?",
  },
  {
    slug: "ecosystems",
    title: "How ecosystems depend on each other",
    hook: "About a million species face extinction.",
    readTime: "2 min read",
    image: "/images/learn/extinction.jpg",
    imageAlt: "Wildlife affected by biodiversity loss and extinction",
    stat: {
      value: "1 million",
      label: "animal and plant species threatened with extinction",
    },
    body:
      "An ecosystem is a community of living things and the place they share, from a forest or a coral reef to a patch of soil. Every part depends on others: bees pollinate crops, trees hold soil and water, small animals feed bigger ones. Take enough pieces away and the whole system weakens. A major UN-backed assessment found that around one million animal and plant species are threatened with extinction, and that human activity has severely altered more than 75% of the land. The causes include land clearing, overfishing, climate change and pollution. What we buy and how it is produced helps decide how land and sea are used.",
    tips: [
      "Choose sustainably sourced wood, paper and food.",
      "Support organic and pesticide-light products.",
      "Plant native flowers and trees if you have space.",
    ],
    source: "IPBES Global Assessment on Biodiversity and Ecosystem Services (2019)",
    askPrompt:
      "How do ecosystems work, and how do my shopping choices affect them?",
  },
  {
    slug: "reuse-first",
    title: "Reuse beats recycle",
    hook: "Recycling is the last resort, not the first.",
    readTime: "2 min read",
    image: "/images/learn/reuse over recycle.jpg",
    imageAlt: "Reuse as a better choice before recycling",
    stat: {
      value: "30%",
      label:
        "of plastic pollution could be cut by 2040 through reuse, more than recycling (20%) or switching materials (17%)",
    },
    body:
      "The familiar slogan is reduce, reuse, recycle, and the order is not an accident. Recycling helps, but it only recovers a fraction of what we make. A UN Environment Programme analysis estimates that reusing plastic products could cut plastic pollution by about 30% by 2040, recycling by about 20% and switching to other materials by about 17%. Reusing wins because it stops waste from being created in the first place, and it usually saves energy too. So before you recycle, ask whether you can refuse it, refill it, repair it or pass it on.",
    tips: [
      "Choose refillable and reusable over disposable.",
      "Repair before you replace.",
      "Pass on things you no longer use.",
    ],
    source: "UN Environment Programme (UNEP), report on ending plastic pollution (2023)",
    askPrompt:
      "What is the best order to reduce, reuse and recycle, and which EcoMart products support reuse?",
  },
];

export const quickTips = [
  { title: "Refuse first", text: "Skip what you don’t need: extra bags, cutlery, freebies." },
  { title: "Carry your own", text: "A bottle and a cloth bag cover most single-use plastic." },
  { title: "Swap to LED", text: "The same light with at least 75% less energy." },
  { title: "Plan your meals", text: "Buy what you will eat and finish the leftovers." },
  { title: "Wear it longer", text: "Repair, restyle or buy second-hand before buying new." },
  { title: "Check the score", text: "Look at a product’s eco score before it goes in your cart." },
];
