import { useState } from 'react'

export function LearnCardImage({ src, alt }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className="w-full h-full bg-[#CBD5C8] flex flex-col items-center justify-center p-4 transition-transform duration-500 ease-out group-hover:scale-105"
        aria-label={alt}
      >
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-leaf/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  )
}

export default function LearnCard({ topic, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(topic)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(topic)
        }
      }}
      className="group flex flex-col bg-cream rounded-2xl overflow-hidden border border-forest/10 hover:border-forest/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer text-left select-none"
    >
      {/* Photo on top with fallback */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#CBD5C8]">
        <LearnCardImage src={topic.image} alt={topic.title} />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-wider font-semibold text-leaf mb-2.5">
          {topic.readTime}
        </span>

        <h3 className="font-heading font-bold text-forest text-lg sm:text-xl leading-snug group-hover:text-leaf transition-colors mb-2">
          {topic.hook}
        </h3>

        <p className="text-sm text-charcoal/80 mt-auto pt-2">
          {topic.title}
        </p>
      </div>
    </div>
  )
}

