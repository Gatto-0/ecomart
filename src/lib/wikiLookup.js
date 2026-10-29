// src/lib/wikiLookup.js
// Online fallback lookup for eco terms without built-in answers.
// The only module in the app that communicates with an external online source.

const cache = new Map()

/**
 * Trims text to at most the first two complete sentences.
 */
function firstTwoSentences(text) {
  if (!text || typeof text !== 'string') return ''
  const trimmed = text.trim()
  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s|$)/g)
  if (sentences && sentences.length >= 2) {
    return (sentences[0] + sentences[1]).trim()
  }
  if (sentences && sentences.length === 1) {
    return sentences[0].trim()
  }
  return trimmed
}

/**
 * Looks up an eco term on Wikipedia.
 * Uses a 4-second timeout and never throws.
 * Returns { text, title, url } or null.
 */
export async function lookup(term) {
  if (!term || typeof term !== 'string') return null
  const cleanTerm = term.trim().toLowerCase()
  if (!cleanTerm) return null

  // Check cache for session
  if (cache.has(cleanTerm)) {
    return cache.get(cleanTerm)
  }

  // Check online status
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)

  try {
    // 1. Search for closest page title via OpenSearch
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      term
    )}&limit=1&format=json&origin=*`

    const searchRes = await fetch(searchUrl, { signal: controller.signal })
    if (!searchRes.ok) return null
    const searchData = await searchRes.json()

    const titles = searchData?.[1]
    const urls = searchData?.[3]
    if (!titles || !Array.isArray(titles) || titles.length === 0) {
      return null
    }

    const title = titles[0]
    const openSearchUrl = urls?.[0]
    if (!title) return null

    // 2. Fetch page summary extract
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`

    const summaryRes = await fetch(summaryUrl, { signal: controller.signal })
    if (!summaryRes.ok) return null
    const summaryData = await summaryRes.json()

    const rawExtract = summaryData?.extract
    if (!rawExtract) return null

    const twoSentences = firstTwoSentences(rawExtract)
    if (!twoSentences) return null

    const pageUrl =
      summaryData?.content_urls?.desktop?.page ||
      openSearchUrl ||
      `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`

    const result = {
      text: twoSentences,
      title: summaryData?.title || title,
      url: pageUrl,
    }

    cache.set(cleanTerm, result)
    return result
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

