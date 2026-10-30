import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { LearnCardImage } from './LearnCard'

export default function LearnModal({ topic, onClose }) {
  const closeButtonRef = useRef(null)

  // Lock body scroll while open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Focus close button on open
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!topic) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="learn-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-cream text-charcoal rounded-3xl overflow-hidden shadow-2xl my-8 border border-forest/10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-forest/80 text-cream hover:bg-forest flex items-center justify-center transition-colors cursor-pointer shadow-md"
        >
          <X size={20} />
        </button>

        {/* Photo on top with capped height and object-fit: cover */}
        <div className="relative h-[120px] sm:h-[160px] w-full bg-sage shrink-0 overflow-hidden">
          <LearnCardImage src={topic.image} alt={topic.title} />
        </div>

        {/* Scrollable body content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Title */}
          <h2
            id="learn-modal-title"
            className="font-heading text-2xl sm:text-3xl font-bold text-forest leading-tight mb-2"
          >
            {topic.title}
          </h2>

          {/* Read Time below title */}
          <span className="text-xs font-semibold text-leaf mb-4 block">
            {topic.readTime}
          </span>

          {/* Stat Box */}
          {topic.stat && (
            <div className="my-6 p-5 sm:p-6 rounded-2xl bg-cream border border-forest/10 flex flex-col sm:flex-row items-baseline sm:items-center gap-3 sm:gap-4">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-forest whitespace-nowrap">
                {topic.stat.value}
              </span>
              <span className="text-sm sm:text-base text-charcoal/80 leading-snug">
                {topic.stat.label}
              </span>
            </div>
          )}

          {/* Body Text: line-height 1.6 and comfortable font size ~16px */}
          <p className="text-base text-charcoal/90 leading-[1.6] my-4">
            {topic.body}
          </p>

          {/* What you can do list from tips */}
          {topic.tips && topic.tips.length > 0 && (
            <div className="my-6 pt-4 border-t border-forest/10">
              <h4 className="font-heading text-lg font-bold text-forest mb-3">
                What you can do
              </h4>
              <ul className="space-y-2.5">
                {topic.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-charcoal">
                    <span className="w-2 h-2 rounded-full bg-leaf shrink-0 mt-2" aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source */}
          {topic.source && (
            <p className="text-xs text-charcoal/60 italic my-4">
              Source: {topic.source}
            </p>
          )}

          {/* Ask Eco Buddy about this */}
          <div className="mt-8 pt-4 border-t border-forest/10">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('ecobuddy:ask', { detail: topic.askPrompt })
                )
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-forest text-cream font-medium text-base hover:bg-forest/90 transition-colors shadow-sm cursor-pointer"
            >
              Ask Eco Buddy about this
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

