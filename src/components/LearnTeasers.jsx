import { useState } from 'react'
import { Link } from 'react-router-dom'
import { learnTopics } from '../data/landing'

function LearnCardImage({ src, alt }) {
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

export default function LearnTeasers() {
  return (
    <section className="py-20 sm:py-28 px-6 max-w-7xl mx-auto w-full border-t border-forest/10">
      <div className="flex flex-col items-start mb-8 sm:mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
          Why it matters
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {learnTopics.map((topic) => (
          <article
            key={topic.slug}
            className="group flex flex-col bg-cream rounded-2xl overflow-hidden border border-forest/10 hover:border-forest/30 transition-all hover:shadow-sm"
          >
            {/* Photo on top with fallback */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#CBD5C8]">
              <LearnCardImage src={topic.image} alt={topic.title} />
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-leaf mb-2.5">
                {topic.readTime}
              </span>

              <h3 className="font-heading font-bold text-forest text-lg sm:text-xl leading-snug group-hover:text-leaf transition-colors mb-4">
                {topic.title}
              </h3>

              <div className="mt-auto pt-2">
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-leaf transition-colors"
                >
                  Learn more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Centered Explore all topics button */}
      <div className="mt-12 sm:mt-16 flex justify-center">
        <Link
          to="/learn"
          className="inline-flex items-center px-8 py-3.5 rounded-full bg-forest text-cream font-medium text-base hover:bg-forest/90 transition-colors shadow-sm"
        >
          Explore all topics
        </Link>
      </div>
    </section>
  )
}

