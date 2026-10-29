import { useState } from 'react'
import { useTypewriter } from '../lib/useTypewriter'
import { typewriterPhrases } from '../data/landing'

export default function Hero() {
  const [imageError, setImageError] = useState(false)
  const displayText = useTypewriter(typewriterPhrases)

  return (
    <section className="relative min-h-screen w-full flex items-center bg-cream overflow-hidden">
      {/* Background Image with graceful fallback if missing */}
      {!imageError && (
        <img
          src="/images/hero.png"
          alt=""
          aria-hidden="true"
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* Soft cream gradient behind text for readability (no dark overlay) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/80 to-transparent pointer-events-none max-w-5xl"
        aria-hidden="true"
      />

      {/* Content vertically centered, aligned left */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-32 flex flex-col justify-center items-start text-left">
        <div className="max-w-4xl">
          <h1 className="font-heading font-bold text-forest tracking-tight text-[clamp(3rem,8vw,8rem)] leading-[1.02]">
            Where shopping meets the planet.
          </h1>

          <p className="mt-6 font-medium text-leaf flex items-center min-h-[3rem] text-[clamp(1.5rem,3vw,2.5rem)] leading-snug">
            <span>{displayText}</span>
            <span
              className="inline-block w-[3px] h-[1.1em] bg-leaf ml-1.5 motion-safe:animate-pulse"
              aria-hidden="true"
            />
          </p>
        </div>
      </div>

      {/* Scroll cue at bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none text-forest select-none motion-safe:animate-bounce">
        <span className="text-xs uppercase tracking-[0.25em] font-medium text-forest/75">
          Scroll
        </span>
        <div className="w-[1.5px] h-8 bg-forest/60 rounded-full" />
      </div>
    </section>
  )
}
