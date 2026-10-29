import { createContext, useContext, useState, useCallback } from 'react'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [slugs, setSlugs] = useState([])

  const toggle = useCallback((slug) => {
    setSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug)
      }
      if (prev.length >= 2) {
        return prev // Cannot add more than two
      }
      return [...prev, slug]
    })
  }, [])

  const remove = useCallback((slug) => {
    setSlugs((prev) => prev.filter((s) => s !== slug))
  }, [])

  const clear = useCallback(() => {
    setSlugs([])
  }, [])

  const has = useCallback((slug) => slugs.includes(slug), [slugs])

  return (
    <CompareContext.Provider
      value={{
        slugs,
        toggle,
        remove,
        clear,
        has,
        count: slugs.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}

