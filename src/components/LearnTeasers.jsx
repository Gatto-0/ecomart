import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { topics } from '../data/learn'

const teaserImages = {
  'carbon-footprint': {
    src: '/images/why-it-matters/footprint.jpg',
    alt: 'Carbon footprint impact of everyday products',
  },
  'why-plastic-matters': {
    src: '/images/why-it-matters/plastic-9.jpg',
    alt: 'Plastic waste and the small share that gets recycled',
  },
  'small-switch': {
    src: '/images/why-it-matters/one-bulb.jpg',
    alt: 'An energy-saving light bulb representing a small action',
  },
  greenwashing: {
    src: '/images/why-it-matters/greenwashing.jpg',
    alt: 'Greenwashing and misleading environmental claims',
  },
}

function TeaserBox({ topic, index }) {
  const [imageFailed, setImageFailed] = useState(false)
  const isLeft = index % 2 === 0
  const image = teaserImages[topic.slug]

  return (
    <article
      aria-label={topic.title}
      style={{ backgroundColor: '#FBF3E4' }}
      className={`group why-matters-card why-matters-card--${isLeft ? 'left-text' : 'right-text'} relative w-full rounded-2xl md:rounded-3xl rounded-l-none border-l-4 border-l-walnut overflow-hidden h-auto md:h-[360px] border-y border-r border-forest/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* Picture zone; the cream card remains visible if the image fails. */}
      {image && !imageFailed && (
        <div className={`why-matters-picture why-matters-picture--${isLeft ? 'left-text' : 'right-text'}`}>
          <img
            src={image.src}
            alt={image.alt}
            onError={() => setImageFailed(true)}
            className={`why-matters-image why-matters-image--${topic.slug} h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none`}
          />
        </div>
      )}

      {/* Text zone */}
      <div className={`why-matters-copy why-matters-copy--${isLeft ? 'left' : 'right'} flex flex-col text-left`}>
        {/* 1. Bold hook line in Fraunces, large */}
        <h3 className="why-matters-heading font-heading font-bold tracking-tight mb-4">
          {topic.hook}
        </h3>

        {/* 2. Stat on one line: value in Fraunces, label beside in smaller size */}
        {topic.stat && (
          <div className="flex items-baseline gap-2.5 sm:gap-3 mb-6">
            <span className="why-matters-stat font-heading font-bold text-xl sm:text-2xl shrink-0">
              {topic.stat.value}
            </span>
            <span className="why-matters-body text-xs sm:text-sm leading-snug">
              {topic.stat.label}
            </span>
          </div>
        )}

        {/* 3. Row with readTime and Learn more link with arrow icon */}
        <div className="flex items-center gap-4 mt-auto">
          <span className="why-matters-read-time text-xs font-medium">
            {topic.readTime}
          </span>
          <Link
            to={`/learn?topic=${topic.slug}`}
            className="why-matters-link inline-flex items-center gap-1.5 text-sm font-semibold transition-colors group/link"
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
