import { createContext, useContext, useState, useCallback } from 'react'

const WishlistContext = createContext(null)

const STORAGE_KEY = 'ecomart_wishlist'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveToStorage(slugs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
  } catch {
    // storage unavailable — proceed in memory
  }
}

export function WishlistProvider({ children }) {
  const [slugs, setSlugs] = useState(loadFromStorage)

  const toggle = useCallback((slug) => {
    setSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
      saveToStorage(next)
      return next
    })
  }, [])

  const has = useCallback((slug) => slugs.includes(slug), [slugs])

  const count = slugs.length

  return (
    <WishlistContext.Provider value={{ slugs, toggle, has, count }}>
      {children}
    </WishlistContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
