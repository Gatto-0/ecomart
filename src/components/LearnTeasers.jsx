import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { topics } from '../data/learn'

function TeaserBox({ topic, index }) {
  const [imageFailed, setImageFailed] = useState(false)
  const isLeft = index % 2 === 0
  const fallbackBg = isLeft ? '#E4EBDD' : '#F1E8D8'

  return (
    <article
      aria-label={topic.title}
      style={{ backgroundColor: fallbackBg }}
      className="group relative w-full rounded-2xl md:rounded-3xl rounded-l-none border-l-4 border-l-walnut overflow-hidden h-auto md:h-[360px] flex flex-col justify-center border-y border-r border-forest/10 p-6 sm:p-8 md:p-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Background Image with Fallback */}
      {topic.image && !imageFailed && (
        <img
          src={topic.image}
          alt={topic.title}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        />
      )}

      {/* Gradient Overlay */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none bg-[rgba(246,241,231,0.95)] ${
          isLeft
            ? 'md:bg-gradient-to-r md:from-[rgba(246,241,231,0.95)] md:via-[rgba(246,241,231,0.85)_50%] md:to-transparent'
            : 'md:bg-gradient-to-l md:from-[rgba(246,241,231,0.95)] md:via-[rgba(246,241,231,0.85)_50%] md:to-transparent'
        }`}
      />

      {/* Text Block Content */}
      <div className={`relative z-10 flex w-full ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
        <div className="w-full md:w-[45%] flex flex-col text-left">
          {/* 1. Bold hook line in Fraunces, large */}
          <h3 className="font-heading font-bold text-2xl sm:text-3xl md:text-[28px] lg:text-3xl text-forest tracking-tight leading-tight mb-4">
            {topic.hook}
          </h3>

          {/* 2. Stat on one line: value in Fraunces, label beside in smaller size */}
          {topic.stat && (
            <div className="flex items-baseline gap-2.5 sm:gap-3 mb-6">
              <span className="font-heading font-bold text-xl sm:text-2xl text-forest shrink-0">
                {topic.stat.value}
              </span>
              <span className="text-xs sm:text-sm text-charcoal/85 leading-snug">
                {topic.stat.label}
              </span>
            </div>
          )}

          {/* 3. Row with readTime and Learn more link with arrow icon */}
          <div className="flex items-center gap-4 mt-auto">
            <span className="text-xs font-medium text-charcoal/70">
              {topic.readTime}
            </span>
            <Link
              to={`/learn?topic=${topic.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-leaf transition-colors group/link"
            >
              <span>Learn more</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover/link:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function LearnTeasers() {
  const teaserTopics = topics.slice(0, 4)

  return (
    <section className="w-full bg-forest text-cream py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-start mb-8 sm:mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cream tracking-tight">
            Why it matters
          </h2>
          <div className="w-12 h-[3px] bg-marigold mt-3 rounded-full" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8">
          {teaserTopics.map((topic, index) => (
            <TeaserBox key={topic.slug} topic={topic} index={index} />
          ))}
        </div>

        {/* Centered Explore all topics button */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <Link
            to="/learn"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-cream text-forest font-medium text-base hover:bg-cream/90 transition-colors shadow-sm btn-major"
          >
            Explore all topics
          </Link>
        </div>
      </div>
    </section>
  )
}
