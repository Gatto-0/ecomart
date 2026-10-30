const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function askEcoBuddy(messages, signal) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'openrouter/free'

  if (!apiKey) {
    throw new Error('VITE_OPENROUTER_API_KEY is not configured.')
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'EcoMart',
    },
    body: JSON.stringify({ model, messages, max_tokens: 400 }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}.`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('OpenRouter returned an empty response.')
  }

  return content.trim()
}
