// src/lib/ecoBuddy.js
// Rule-based, offline answer engine for Eco Buddy.

import {
  products,
  getProduct,
  getSwap,
  getCategory,
  getProductsByCategory,
} from '../data/products'
import { criteria, getBand, MAX_SCORE } from '../data/ecoScore'
import { cartImpact } from './impact'
import {
  KNOWLEDGE_TOPICS,
  CANONICAL_WORDS,
  QUESTION_WORDS,
  GENERAL_ECO_WORDS,
  INTENTS,
  dynamicCategories,
  dynamicTags,
} from './ecoVocab'

export const STARTER_CHIPS = [
  'Find a greener swap',
  'My cart\'s impact',
  'Plastic-free products',
  'How is the eco score worked out?',
  'What is greenwashing?',
]

/**
 * Hand-rolled Levenshtein distance algorithm.
 */
export function levenshtein(a, b) {
  if (a === b) return 0
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) d[i][0] = i
  for (let j = 0; j <= n; j++) d[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      )
    }
  }
  return d[m][n]
}

/**
 * Returns allowed typo count based on token length:
 * - 4 to 6 letters: 1 typo
 * - longer than 6 letters: 2 typos
 * - under 4 letters: 0
 */
export function allowedTypos(length) {
  if (length < 4) return 0
  if (length <= 6) return 1
  return 2
}

/**
 * Normalise and strip punctuation.
 */
export function normalise(text) {
  if (!text || typeof text !== 'string') return ''

  let norm = text.toLowerCase().trim()

  // Collapse 3 or more repeated letters (e.g. plasticcc -> plastic)
  norm = norm.replace(/([a-z])\1{2,}/g, '$1')

  // Common expansions
  const expansions = [
    [/\bwhat's\b/g, 'what is'],
    [/\bwhats\b/g, 'what is'],
    [/\bhow's\b/g, 'how is'],
    [/\bhows\b/g, 'how is'],
    [/\bvs\.?\b/g, 'versus'],
    [/\bv\/s\b/g, 'versus'],
    [/\beco[- ]?friendly\b/g, 'eco-friendly'],
    [/\bgreen stuff\b/g, 'eco-friendly'],
    [/\bzero[- ]?waste\b/g, 'zero-waste'],
    [/\bno plastic\b/g, 'plastic-free'],
    [/\bplastic[- ]?free\b/g, 'plastic-free'],
    [/\baffordable\b/g, 'cheap'],
    [/\bbudget\b/g, 'cheap'],
    [/\bgreenwash(?:ing)?\b/g, 'greenwashing'],
    [/\b(?:fake|scam)\b/g, 'greenwashing'],
    [/\blegit\b/g, 'legitimate'],
  ]

  for (const [pattern, replacement] of expansions) {
    norm = norm.replace(pattern, replacement)
  }

  return norm
}

/**
 * Strip punctuation except hyphens.
 */
export function cleanPunctuation(str) {
  return str
    .replace(/['"“”‘’]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Known phone typos and phonetic corrections.
 */
const DIRECT_SPELL_MAP = {
  wat: 'what',
  globl: 'global',
  sustanability: 'sustainability',
  sustainibility: 'sustainability',
  enviroment: 'environment',
  recycleing: 'recycling',
  compostible: 'compostable',
  biodegradeble: 'biodegradable',
  microplastic: 'microplastics',
  plstic: 'plastic',
  bambo: 'bamboo',
  refilable: 'refillable',
  complsotable: 'compostable',
  greenwash: 'greenwashing',
}

const ALL_SPELL_WORDS = [...CANONICAL_WORDS, ...QUESTION_WORDS]

/**
 * Spell-correct a single word against vocabulary.
 */
function correctWord(word) {
  if (!word || word.length < 3) return word
  if (DIRECT_SPELL_MAP[word]) return DIRECT_SPELL_MAP[word]
  if (ALL_SPELL_WORDS.includes(word)) return word

  let best = null
  let bestDist = Infinity
  const maxAllowed = allowedTypos(word.length)

  for (const cw of ALL_SPELL_WORDS) {
    const dist = levenshtein(word, cw)
    if (dist > 0 && dist <= maxAllowed && dist < bestDist) {
      bestDist = dist
      best = cw
    }
  }

  return best || word
}

/**
 * Spell-correct all tokens in a normalised string.
 */
export function spellCorrectMessage(text) {
  const words = cleanPunctuation(text).split(' ')
  const corrected = words.map((w) => correctWord(w))
  return corrected.join(' ')
}

/**
 * Find exact or fuzzy match for a product in catalog.
 */
function findProduct(query) {
  const cleanQuery = cleanPunctuation(query).toLowerCase()

  // 1. Direct slug or exact name match
  const direct = products.find(
    (p) =>
      p.slug === query ||
      p.name.toLowerCase() === cleanQuery ||
      cleanPunctuation(p.name).toLowerCase() === cleanQuery
  )
  if (direct) return { product: direct, exact: true }

  // 2. Query contains exact product name (at least 5 characters)
  for (const p of products) {
    const pClean = cleanPunctuation(p.name).toLowerCase()
    if (cleanQuery.includes(pClean) && pClean.length >= 5) {
      return { product: p, exact: true }
    }
  }

  // 3. Product name contains query if long enough
  if (cleanQuery.length >= 8) {
    for (const p of products) {
      const pClean = cleanPunctuation(p.name).toLowerCase()
      if (pClean.includes(cleanQuery)) {
        return { product: p, exact: true }
      }
    }
  }

  // 4. Fuzzy Levenshtein match on product names
  let best = null
  let bestDist = Infinity

  for (const p of products) {
    const pClean = cleanPunctuation(p.name).toLowerCase()
    const dist = levenshtein(cleanQuery, pClean)
    const allowed = allowedTypos(pClean.length)
    if (dist > 0 && dist <= allowed && dist < bestDist) {
      bestDist = dist
      best = p
    }
  }

  if (best) {
    return { product: best, exact: false, dist: bestDist }
  }

  return null
}

/**
 * Format product score criteria breakdown.
 */
function formatProductAnswer(product) {
  const band = getBand(product.total)
  const categoryObj = getCategory(product.category)
  const priceFormatted = '₹' + product.price.toLocaleString('en-IN')

  let text = `${product.name} (${categoryObj?.name ?? 'Shop'}) has an eco score of ${product.total}/${MAX_SCORE} (${band.label}) and costs ${priceFormatted}.\n\nWhy this score:\n`

  for (const c of criteria) {
    const scoreVal = product.ecoScores?.[c.key] ?? 0
    const levelDesc = c.levels[scoreVal]
    text += `• ${c.name} (${scoreVal}/2): ${levelDesc}\n`
  }

  if (product.impact) {
    text += `\nEstimated impact (1st year): ${product.impact.plasticG}g plastic avoided, ${product.impact.co2Kg}kg CO₂ avoided versus conventional alternatives.`
  }

  if (product.tags?.includes('vague-claim')) {
    text += `\n\n⚠️ Vague-claim warning: This product carries green claims not backed up by verified data, and its eco score reflects that.`
  }

  const swap = getSwap(product)
  const productsList = [product]

  if (swap) {
    const pts = swap.total - product.total
    text += `\n\n🌱 Greener swap: ${swap.name} (+${pts} points, score ${swap.total}/${MAX_SCORE}, ₹${swap.price.toLocaleString('en-IN')}).`
    productsList.push(swap)
  }

  const chips = swap
    ? [`Tell me about ${swap.name}`, 'Find a greener swap', 'Top eco picks']
    : ['Find a greener swap', 'Top eco picks', 'My cart\'s impact']

  return {
    text: text.trim(),
    products: productsList,
    chips,
  }
}

function toStandardSpaced(str) {
  return str
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Match a knowledge topic from KNOWLEDGE_TOPICS.
 * Matches specific phrasings or core keywords.
 */
function matchKnowledgeTopic(message) {
  const msgSpaced = toStandardSpaced(message)

  // Sort topics so longer phrasings match first (e.g. "why sustainability" before "sustainability")
  const sortedTopics = [...KNOWLEDGE_TOPICS].sort((a, b) => {
    const maxA = Math.max(...a.phrasings.map((p) => p.length))
    const maxB = Math.max(...b.phrasings.map((p) => p.length))
    return maxB - maxA
  })

  for (const topic of sortedTopics) {
    for (const phrase of topic.phrasings) {
      const phraseSpaced = toStandardSpaced(phrase)
      if (
        msgSpaced === phraseSpaced ||
        msgSpaced.includes(phraseSpaced)
      ) {
        return topic
      }
    }
  }

  // Also check core keys
  for (const topic of sortedTopics) {
    const keySpaced = toStandardSpaced(topic.key)
    if (msgSpaced === keySpaced || msgSpaced.includes(keySpaced)) {
      return topic
    }
  }

  return null
}

/**
 * Check if any eco, environment, or shop word is present in text.
 */
function findAnyEcoWord(text) {
  const words = toStandardSpaced(text).split(' ')
  for (const w of words) {
    if (w.length < 3) continue
    if (CANONICAL_WORDS.includes(w)) return w
    if (GENERAL_ECO_WORDS.includes(w)) return w
    if (dynamicTags.includes(w) || dynamicTags.includes(w + '-free')) return w
  }
  return null
}

/**
 * Main Answer Engine Entrypoint
 * Follows strict decision order:
 * a. Greetings, thanks, goodbye, help.
 * b. Shop intents (product, swap, list, cart, score, greenwashing).
 * c. Knowledge intent (definitions for sustainability, global warming, bamboo, etc.).
 * d. Eco words present but no built-in answer: reply with explanation & flag needsLookup.
 * e. Only when no eco/shop word at all: polite refusal.
 */
export function answer(rawMessage, { cartItems = [] } = {}) {
  if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
    return {
      text: 'I didn’t catch that. How can I help you with sustainable products or your cart today?',
      chips: STARTER_CHIPS.slice(0, 3),
    }
  }

  const trimmed = rawMessage.trim()
  const normalised = normalise(trimmed)
  const cleaned = cleanPunctuation(normalised)
  const corrected = spellCorrectMessage(cleaned)

  // =============================================================
  // ORDER 1 (a): Greetings, thanks, goodbye, help
  // =============================================================
  if (
    INTENTS.greetings.some((g) => cleaned === g || cleaned.startsWith(g + ' ') || corrected === g)
  ) {
    return {
      text: 'Hello! I’m Eco Buddy, your shop assistant. I’m here to help you find greener swaps, explain eco scores, calculate your cart’s impact, or answer sustainability questions.',
      chips: ['Find a greener swap', 'My cart\'s impact', 'Top eco picks'],
    }
  }

  if (INTENTS.thanks.some((t) => cleaned === t || cleaned.startsWith(t + ' ') || corrected === t)) {
    return {
      text: 'You’re very welcome! Let me know if you need any other recommendations or tips for greener living.',
      chips: ['Top eco picks', 'How is the eco score worked out?', 'Plastic-free products'],
    }
  }

  if (INTENTS.goodbye.some((b) => cleaned === b || cleaned.startsWith(b + ' ') || corrected === b)) {
    return {
      text: 'Goodbye! Thanks for exploring sustainable living with EcoMart. Reach out whenever you need an eco check!',
      chips: ['Find a greener swap', 'Plastic-free products', 'Top eco picks'],
    }
  }

  if (INTENTS.help.some((h) => cleaned === h || cleaned.includes(h) || corrected.includes(h))) {
    return {
      text: 'I’m Eco Buddy, your shop assistant! Here is what I can do:\n• Look up any product and explain its 5 eco score criteria.\n• Recommend greener swaps for low-scoring items.\n• Calculate your cart\'s avoided single-use plastic and CO₂ impact.\n• Find top products by category, tag, or budget.\n• Explain eco concepts and flag greenwashing.',
      chips: ['How is the eco score worked out?', 'Find a greener swap', 'My cart\'s impact'],
    }
  }

  // =============================================================
  // ORDER 2 (b): Shop intents (product, swap, list, cart, score, greenwashing)
  // =============================================================

  // 1. "ecobuddy:ask" Event Pattern: "Tell me about <product> (eco score N/10)..."
  const askMatch = trimmed.match(
    /tell me about (.+?)(?:\s*\(eco score|\s*\.\s*is it|\s*\?|$)/i
  )
  if (askMatch && askMatch[1]) {
    const candidateName = askMatch[1].trim()
    const found = findProduct(candidateName)
    if (found?.product) {
      return formatProductAnswer(found.product)
    }
  }

  // 2. Cart impact
  if (
    INTENTS.cart_impact.some((ci) => cleaned.includes(ci) || corrected.includes(ci)) ||
    cleaned === 'cart' ||
    cleaned.includes('cart impact') ||
    cleaned.includes('plastic saved') ||
    cleaned.includes('co2 saved')
  ) {
    if (!cartItems || cartItems.length === 0) {
      return {
        text: 'Your cart is currently empty! Add sustainable items from the shop to see your total avoided plastic and CO₂ impact grow.',
        chips: ['Top eco picks', 'Plastic-free products', 'Under ₹500'],
      }
    }

    const { plasticG, co2Kg, avgScore } = cartImpact(cartItems)
    const band = getBand(Math.round(avgScore))
    const plasticDisplay =
      plasticG >= 1000 ? `${(plasticG / 1000).toFixed(1)} kg` : `${plasticG} g`

    let text = `Your estimated cart impact:\n• Avoided plastic: ${plasticDisplay}\n• Avoided CO₂: ${co2Kg} kg\n• Average eco score: ${avgScore}/${MAX_SCORE} (${band.label})\n\nEstimates compared with typical alternatives.`

    const lowScoreItems = cartItems
      .map((item) => getProduct(item.slug))
      .filter((p) => p && p.total < 5)

    const swaps = lowScoreItems
      .map((p) => ({ original: p, swap: getSwap(p) }))
      .filter((s) => s.swap)

    if (swaps.length > 0) {
      text += '\n\nGreener swaps for items in your cart:\n'
      for (const s of swaps) {
        const pts = s.swap.total - s.original.total
        text += `• Swap ${s.original.name} (${s.original.total}/10) for ${s.swap.name} (+${pts} points, score ${s.swap.total}/10, ₹${s.swap.price.toLocaleString('en-IN')})\n`
      }
      return {
        text: text.trim(),
        products: swaps.map((s) => s.swap).slice(0, 4),
        chips: ['Find a greener swap', 'Top eco picks', 'Under ₹500'],
      }
    }

    return {
      text: text.trim(),
      chips: ['Find a greener swap', 'Top eco picks', 'Plastic-free products'],
    }
  }

  // 3. How the eco score works
  if (
    INTENTS.eco_score_info.some((q) => cleaned.includes(q) || corrected.includes(q)) ||
    ((cleaned.includes('eco score') || corrected.includes('eco score')) &&
      (cleaned.includes('work') ||
        cleaned.includes('how') ||
        cleaned.includes('calculate') ||
        cleaned.includes('criteria') ||
        cleaned.includes('points')))
  ) {
    let explanation = `The EcoMart eco score evaluates products out of ${MAX_SCORE} across five transparent criteria (0 to 2 points each):\n\n`
    for (const c of criteria) {
      explanation += `• ${c.name}: ${c.question} (0 = ${c.levels[0]}, 2 = ${c.levels[2]})\n`
    }
    explanation += `\nScores fall into three clear bands:\n• 8–10: Great choice (High sustainability standards)\n• 5–7: Good, with room to improve\n• 0–4: Think twice (High environmental footprint)\n\nEvery claim must be specific and verified to earn points.`

    return {
      text: explanation,
      chips: ['Top eco picks', 'What is greenwashing?', 'Find a greener swap'],
    }
  }

  // 4. Greenwashing & Vague claims
  if (
    INTENTS.greenwashing_info.some((gw) => cleaned.includes(gw) || corrected.includes(gw)) ||
    cleaned.includes('greenwash') ||
    corrected.includes('greenwashing') ||
    cleaned.includes('vague claim') ||
    cleaned.includes('fake eco') ||
    cleaned.includes('is this legit')
  ) {
    const vagueProducts = products.filter((p) => p.tags?.includes('vague-claim'))
    return {
      text: 'Greenwashing is when brands make misleading or unverified environmental claims using buzzwords like "eco" or "all-natural" without proof.\n\nAt EcoMart, we flag unverified claims with our "vague-claim" tag and deduct points from the eco score. Here are products currently flagged for vague claims in our shop:',
      products: vagueProducts.slice(0, 4),
      chips: ['How is the eco score worked out?', 'Top eco picks', 'Find a greener swap'],
    }
  }

  // 5. Greener swap requests
  const isSwapIntent =
    INTENTS.greener_swaps.some((s) => cleaned.includes(s) || corrected.includes(s)) ||
    cleaned.startsWith('swap') ||
    cleaned.includes('greener swap') ||
    cleaned.includes('better option')

  if (isSwapIntent) {
    const found = findProduct(cleaned) || findProduct(corrected)
    if (found?.product) {
      const product = found.product
      const swap = getSwap(product)
      if (swap) {
        const pts = swap.total - product.total
        return {
          text: `For ${product.name} (score ${product.total}/${MAX_SCORE}), a greener swap is ${swap.name} (+${pts} points, score ${swap.total}/${MAX_SCORE}, ₹${swap.price.toLocaleString('en-IN')}).`,
          products: [swap],
          chips: [`Tell me about ${swap.name}`, 'More swaps', 'Top eco picks'],
        }
      } else {
        return {
          text: `${product.name} already has an eco score of ${product.total}/${MAX_SCORE} (${getBand(product.total).label}), making it one of the best choices in its category! No greener swap is needed.`,
          products: [product],
          chips: ['Top eco picks', 'Plastic-free products', 'My cart\'s impact'],
        }
      }
    }

    return {
      text: 'Which product would you like a greener swap for? Tell me a product name, or explore one of these popular items:',
      chips: [
        'Stainless steel water bottle',
        'Bamboo toothbrush',
        'Soy wax candle in glass jar',
      ],
    }
  }

  // 6. Price-based queries
  const priceRegex = /(?:under|below|less than|within|around)\s*(?:₹|rs\.?|rupees)?\s*(\d+)/i
  const priceMatch = normalised.match(priceRegex)
  const isBudgetWord =
    cleaned.includes('cheap') ||
    cleaned.includes('budget') ||
    cleaned.includes('affordable') ||
    cleaned.includes('inexpensive')

  if (priceMatch || (isBudgetWord && !cleaned.includes('how'))) {
    const limit = priceMatch ? parseInt(priceMatch[1], 10) : 500
    const matched = products
      .filter((p) => p.price <= limit)
      .sort((a, b) => b.total - a.total || a.price - b.price)

    return {
      text: `Here are great eco choices under ₹${limit.toLocaleString('en-IN')}:`,
      products: matched.slice(0, 4),
      chips: ['Plastic-free products', 'Find a greener swap', 'Top eco picks'],
    }
  }

  // 7. Top picks / Best products
  if (
    INTENTS.top_picks.some((tp) => cleaned === tp || corrected === tp) ||
    cleaned === 'best' ||
    cleaned === 'top' ||
    cleaned === 'top picks' ||
    cleaned === 'best products' ||
    cleaned === 'top products' ||
    cleaned.includes('highest score') ||
    cleaned.includes('top rated')
  ) {
    const top = [...products].sort((a, b) => b.total - a.total || a.price - b.price)
    return {
      text: 'Here are our highest-rated eco picks across the shop:',
      products: top.slice(0, 4),
      chips: ['Plastic-free products', 'Under ₹500', 'Find a greener swap'],
    }
  }

  // 8. Category lists
  for (const cat of dynamicCategories) {
    const isCategoryQuery = cat.keywords.some((kw) => {
      if (kw.length <= 3) return false
      return cleaned === kw || cleaned === kw + ' products' || cleaned === 'show ' + kw
    })
    if (isCategoryQuery) {
      const items = getProductsByCategory(cat.slug).sort(
        (a, b) => b.total - a.total || a.price - b.price
      )
      return {
        text: `Here are top eco picks in ${cat.name}:`,
        products: items.slice(0, 4),
        chips: ['Top eco picks', 'Under ₹500', 'Find a greener swap'],
      }
    }
  }

  // 9. Tag lists (explicit requests like "show plastic-free products" or "plastic-free products")
  for (const tag of dynamicTags) {
    const cleanTag = tag.replace(/-/g, ' ')
    if (
      cleaned === tag ||
      cleaned === cleanTag ||
      cleaned === tag + ' products' ||
      cleaned === cleanTag + ' products' ||
      cleaned === 'show ' + tag + ' products' ||
      cleaned === 'show ' + cleanTag + ' products'
    ) {
      const items = products
        .filter((p) => p.tags?.includes(tag))
        .sort((a, b) => b.total - a.total || a.price - b.price)

      if (items.length > 0) {
        return {
          text: `Here are our top ${cleanTag} products:`,
          products: items.slice(0, 4),
          chips: ['Top eco picks', 'Under ₹500', 'Find a greener swap'],
        }
      }
    }
  }

  // 10. Direct Product Query by full product name
  const foundProd = findProduct(cleaned)
  if (foundProd && foundProd.exact && foundProd.product.name.length >= 6) {
    return formatProductAnswer(foundProd.product)
  }

  // =============================================================
  // ORDER 3 (c): Knowledge intent (definitions for eco terms)
  // =============================================================
  const matchedTopic = matchKnowledgeTopic(corrected) || matchKnowledgeTopic(cleaned)
  if (matchedTopic) {
    // Check if relevant products can be attached (e.g. for bamboo, plastic-free, stainless steel, glass)
    const topicKey = matchedTopic.key
    let matchingProducts = []

    if (topicKey === 'bamboo') {
      matchingProducts = products.filter((p) => p.name.toLowerCase().includes('bamboo'))
    } else if (topicKey === 'stainless-steel') {
      matchingProducts = products.filter((p) => p.name.toLowerCase().includes('steel'))
    } else if (topicKey === 'glass') {
      matchingProducts = products.filter(
        (p) => p.name.toLowerCase().includes('glass') || p.description.toLowerCase().includes('glass')
      )
    } else if (topicKey === 'plastic-free' || topicKey === 'single-use-plastic' || topicKey === 'ocean-plastic') {
      matchingProducts = products.filter((p) => p.tags?.includes('plastic-free'))
    } else if (topicKey === 'organic-cotton') {
      matchingProducts = products.filter((p) => p.description.toLowerCase().includes('cotton'))
    }

    return {
      text: matchedTopic.text,
      products: matchingProducts.length > 0 ? matchingProducts.slice(0, 4) : undefined,
      chips: matchedTopic.chips,
    }
  }

  // =============================================================
  // ORDER 4 (d): Eco words present but no built-in answer
  // =============================================================
  const ecoWord = findAnyEcoWord(corrected) || findAnyEcoWord(cleaned)
  if (ecoWord) {
    const ambiguous = [
      'nature',
      'green',
      'clean',
      'earth',
      'soil',
      'fossil',
      'planet',
      'flora',
      'fauna',
    ]
    const searchTerm = ambiguous.includes(ecoWord.toLowerCase())
      ? `${ecoWord} environment`
      : ecoWord

    return {
      text: `I don't have a detailed answer on ${ecoWord} yet, but here is what I can help with:`,
      chips: STARTER_CHIPS.slice(0, 3),
      needsLookup: true,
      term: searchTerm,
    }
  }

  // =============================================================
  // ORDER 5 (e): Only when message has no eco/shop word at all
  // =============================================================
  return {
    text: 'I only cover eco-friendly living and this shop. Ask me about sustainable products, eco scores, or green swaps!',
    chips: STARTER_CHIPS.slice(0, 3),
  }
}
