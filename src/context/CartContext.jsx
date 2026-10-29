import { createContext, useContext, useState, useCallback } from 'react'
import { products } from '../data/products'

const CartContext = createContext(null)

const STORAGE_KEY = 'ecomart_cart'

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

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage unavailable — proceed in memory
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadFromStorage)

  const updateItems = useCallback((next) => {
    setItems(next)
    saveToStorage(next)
  }, [])

  const addItem = useCallback((slug) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug)
      const next = existing
        ? prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { slug, qty: 1 }]
      saveToStorage(next)
      return next
    })
  }, [])

  const removeItem = useCallback((slug) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug)
      saveToStorage(next)
      return next
    })
  }, [])

  const setQty = useCallback((slug, qty) => {
    if (qty < 1) return
    setItems((prev) => {
      const next = prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
      saveToStorage(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    updateItems([])
  }, [updateItems])

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const subtotal = items.reduce((sum, i) => {
    const product = products.find((p) => p.slug === i.slug)
    return sum + (product ? product.price * i.qty : 0)
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
