import { useState, useEffect } from 'react'

export function useTypewriter(phrases = [], options = {}) {
  const {
    typingSpeed = 60,
    deletingSpeed = 35,
    pauseTime = 2000,
  } = options

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || !phrases || phrases.length === 0) return

    const currentPhrase = phrases[phraseIndex] || ''

    if (!isDeleting) {
      if (displayText === currentPhrase) {
        const timer = setTimeout(() => {
          setIsDeleting(true)
        }, pauseTime)
        return () => clearTimeout(timer)
      }

      const timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timer)
    } else {
      if (displayText === '') {
        const timer = setTimeout(() => {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }, typingSpeed)
        return () => clearTimeout(timer)
      }

      const timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length - 1))
      }, deletingSpeed)
      return () => clearTimeout(timer)
    }
  }, [
    displayText,
    isDeleting,
    phraseIndex,
    prefersReducedMotion,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ])

  if (prefersReducedMotion) {
    return phrases[0] || ''
  }

  return displayText
}

export default useTypewriter
