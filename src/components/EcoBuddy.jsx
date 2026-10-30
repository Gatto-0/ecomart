// src/components/EcoBuddy.jsx
// Offline rule-based assistant panel and floating launcher button.

import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Send } from 'lucide-react'
import EcoScoreBadge from './EcoScoreBadge'
import { useCart } from '../context/CartContext'
import { categories } from '../data/products'
import { answer, STARTER_CHIPS } from '../lib/ecoBuddy'
import { lookup } from '../lib/wikiLookup'

/**
 * Compact thumbnail image with category and placeholder fallbacks.
 */
function MiniImage({ product }) {
  const categoryData = categories.find((c) => c.slug === product.category)
  const fallback = categoryData?.image ?? null
  const [src, setSrc] = useState(product.image)
  const imageAlt =
    src === fallback && categoryData
      ? categoryData.imageAlt || `${categoryData.name} category image`
      : product.name

  const handleError = () => {
    if (src === product.image && fallback && src !== fallback) {
      setSrc(fallback)
    } else {
      setSrc(null)
    }
  }

  if (src === null) {
    return (
      <div
        className="w-11 h-11 rounded-lg bg-forest/10 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <span className="text-[10px] text-forest/40 font-heading">Eco</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={imageAlt}
      onError={handleError}
      className="w-11 h-11 rounded-lg object-cover shrink-0"
      loading="lazy"
    />
  )
}

const INITIAL_MESSAGES = [
  {
    id: 'msg-init',
    sender: 'bot',
    text: 'Hi! I’m Eco Buddy, your shop assistant. How can I help you make greener choices today?',
    chips: STARTER_CHIPS,
  },
]

export default function EcoBuddy() {
  const { items: cartItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to the newest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Speech bubble: show once per session, ~5s after load, disappear after 6s
  useEffect(() => {
    let alreadyShown = false
    try {
      alreadyShown = !!sessionStorage.getItem('ecobuddy_bubble_shown')
    } catch {
      // sessionStorage unavailable — skip bubble
      return
    }
    if (alreadyShown || hasBeenOpened) return

    const showTimer = setTimeout(() => {
      setShowBubble(true)
      try { sessionStorage.setItem('ecobuddy_bubble_shown', '1') } catch {}
    }, 5000)

    const hideTimer = setTimeout(() => {
      setShowBubble(false)
    }, 11000) // 5s delay + 6s visible

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only on mount

  const handleOpen = () => {
    setIsOpen(true)
    setShowBubble(false)
    if (!hasBeenOpened) setHasBeenOpened(true)
  }

  // Message dispatcher
  const handleSendMessage = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const userMessage = {
        id: `user-${Date.now()}-${Math.random()}`,
        sender: 'user',
        text: trimmed,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      // 400ms typing indicator before processing response
      setTimeout(async () => {
        const response = answer(trimmed, { cartItems })

        // If eco term requires lookup and has a term, try Wikipedia lookup
        if (response.needsLookup && response.term) {
          setIsLookingUp(true)
          const wikiResult = await lookup(response.term)
          setIsLookingUp(false)

          if (wikiResult) {
            const botMessage = {
              id: `bot-${Date.now()}-${Math.random()}`,
              sender: 'bot',
              text: wikiResult.text,
              wiki: {
                title: wikiResult.title,
                url: wikiResult.url,
              },
              chips: [
                `Tell me about ${wikiResult.title}`,
                'Show plastic-free products',
                'Top eco picks',
              ],
            }
            setMessages((prev) => [...prev, botMessage])
            setIsTyping(false)
            return
          }
        }

        // Built-in answer (or fallback if lookup returns null)
        const botMessage = {
          id: `bot-${Date.now()}-${Math.random()}`,
          sender: 'bot',
          text: response.text,
          products: response.products,
          chips: response.chips,
          didYouMean: response.didYouMean,
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 400)
    },
    [cartItems]
  )

  // Listen for window event "ecobuddy:ask" (mounted even when panel is closed)
  useEffect(() => {
    const handleAskEvent = (e) => {
      const query = e.detail
      if (typeof query === 'string' && query.trim()) {
        handleOpen()
        handleSendMessage(query.trim())
      }
    }

    window.addEventListener('ecobuddy:ask', handleAskEvent)
    return () => {
      window.removeEventListener('ecobuddy:ask', handleAskEvent)
    }
  }, [handleSendMessage])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return
    const text = inputValue
    setInputValue('')
    handleSendMessage(text)
  }

  const onChipClick = (chipText) => {
    if (isTyping) return
    handleSendMessage(chipText)
  }

  return (
    <>
      {/* Closed Floating Trigger Button + speech bubble */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {/* Speech bubble — pointer-events-none so it never blocks clicks */}
          {showBubble && (
            <div
              aria-hidden="true"
              className="pointer-events-none relative mb-1 bg-[#FBF3E4] text-[#2F4A35] text-xs font-semibold px-3 py-2 rounded-xl shadow-md border border-[#2F4A35]/10 whitespace-nowrap select-none"
            >
              Ask me about eco swaps
              {/* Downward tail */}
              <span
                className="absolute -bottom-[7px] right-5 w-3 h-[7px] overflow-hidden pointer-events-none"
                aria-hidden="true"
              >
                <span className="block w-3 h-3 bg-[#FBF3E4] border border-[#2F4A35]/10 rotate-45 translate-y-[-6px] translate-x-[0px]" />
              </span>
            </div>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Open Eco Buddy"
              className={`relative w-14 h-14 rounded-full bg-[#2F4A35] text-[#FBF3E4] shadow-xl flex items-center justify-center transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-[#E3A63B] hover:ring-offset-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3A63B] focus:ring-offset-2${!hasBeenOpened ? ' eco-buddy-pulse' : ''}`}
            >
              <MessageCircle size={26} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Open Chat Panel */}
      {isOpen && (
        <aside
          role="region"
          aria-label="Eco Buddy, your shop assistant"
          className="fixed bottom-6 right-6 z-40 w-[380px] h-[520px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)] bg-[#FBF3E4] rounded-[16px] shadow-2xl border border-forest/15 flex flex-col overflow-hidden text-charcoal font-sans"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#FBF3E4] border-b border-forest/10 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-semibold text-xl text-forest tracking-tight leading-tight">
                Eco Buddy
              </h2>
              <p className="text-xs text-forest/75 font-sans leading-tight">
                Your shop assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Eco Buddy"
              className="w-8 h-8 rounded-full flex items-center justify-center text-forest/80 hover:text-forest hover:bg-forest/10 transition-colors cursor-pointer"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Scrolling message list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot'
              return (
                <div key={msg.id} className="space-y-2">
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      isBot
                        ? 'bg-[#E4EBDD] text-forest rounded-tl-xs mr-auto'
                        : 'bg-[#2F4A35] text-[#FBF3E4] rounded-tr-xs ml-auto'
                    }`}
                  >
                    <div>{msg.text}</div>

                    {/* Source link when enriched from Wikipedia */}
                    {isBot && msg.wiki && (
                      <div className="pt-2 text-xs text-forest/75 font-sans flex items-center gap-1 border-t border-forest/10 mt-2">
                        <span>From Wikipedia:</span>
                        <a
                          href={msg.wiki.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium hover:text-leaf transition-colors"
                        >
                          Read more
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Compact product mini cards */}
                  {isBot && msg.products && msg.products.length > 0 && (
                    <div className="space-y-1.5 max-w-[95%]">
                      {msg.products.map((p) => (
                        <Link
                          key={p.slug}
                          to={`/product/${p.slug}`}
                          className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/75 hover:bg-white border border-forest/10 shadow-2xs transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <MiniImage product={p} />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-forest truncate group-hover:text-leaf transition-colors font-sans">
                                {p.name}
                              </div>
                              <div className="text-xs text-forest/70 font-sans">
                                ₹{p.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                          <EcoScoreBadge total={p.total} size="sm" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {isBot && msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => onChipClick(chip)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-forest/10 hover:bg-forest hover:text-cream text-forest transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator (approx 400ms or while looking up) */}
            {isTyping && (
              <div className="bg-[#E4EBDD] text-forest rounded-2xl rounded-tl-xs mr-auto px-3.5 py-2.5 text-sm shadow-xs inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-forest/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-forest/60 animate-bounce" />
                {isLookingUp && (
                  <span className="text-xs text-forest/80 font-medium">
                    Looking it up…
                  </span>
                )}
              </div>
            )}

            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Input & Send */}
          <form
            onSubmit={onSubmit}
            className="px-3 py-2.5 bg-[#FBF3E4] border-t border-forest/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Eco Buddy..."
              className="flex-1 bg-white/80 border border-forest/20 rounded-full px-3.5 py-2 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-[#2F4A35] text-[#FBF3E4] flex items-center justify-center hover:bg-[#2F4A35]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send size={15} aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}
    </>
  )
}

