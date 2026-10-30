import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { topics } from '../data/learn'
import LearnCard, { LearnCardImage } from '../components/LearnCard'
import LearnModal from '../components/LearnModal'
import QuickTips from '../components/QuickTips'

export default function Learn() {
  const [searchParams, setSearchParams] = useSearchParams()
  const topicSlug = searchParams.get('topic')
  const [selectedTopic, setSelectedTopic] = useState(null)

  const featuredTopic = topics[0]
  const remainingTopics = topics.slice(1)

  // Active topic is from URL param if present, otherwise local state
  const currentTopic = topicSlug
    ? topics.find((t) => t.slug === topicSlug) || selectedTopic
    : selectedTopic

  const handleOpenTopic = (topic) => {
    setSelectedTopic(topic)
    setSearchParams({ topic: topic.slug })
  }

  const handleCloseModal = () => {
    setSelectedTopic(null)
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('topic')
    setSearchParams(newParams, { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full">
        {/* Page Header */}
        <div className="pt-4 sm:pt-8 pb-10 sm:pb-14">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-forest tracking-tight leading-[1.1] max-w-3xl mb-4">
            Small facts that change what's in your cart.
          </h1>
          <p className="text-base sm:text-lg text-charcoal/80 max-w-2xl">
            Simple explanations behind sustainable choices and how everyday swaps add up.
          </p>
        </div>

        {/* Featured Card */}
        {featuredTopic && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleOpenTopic(featuredTopic)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleOpenTopic(featuredTopic)
              }
            }}
            className="group grid grid-cols-1 md:grid-cols-2 bg-cream rounded-3xl overflow-hidden border border-forest/10 hover:border-forest/30 transition-all duration-300 hover:shadow-lg cursor-pointer text-left select-none mb-12 sm:mb-16"
          >
            {/* Photo left on desktop, stacked on mobile */}
            <div className="relative aspect-video w-full overflow-hidden bg-sage">
              <LearnCardImage
                src={featuredTopic.image}
                alt={featuredTopic.imageAlt || featuredTopic.title}
              />
            </div>

            {/* Text right on desktop */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight group-hover:text-leaf transition-colors mb-3">
                {featuredTopic.hook}
              </h2>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-leaf">
                  {featuredTopic.readTime}
                </span>
                <span className="text-xs font-semibold text-forest/50">
                  Featured
                </span>
              </div>

              <p className="text-base leading-[1.6] text-charcoal/80 mb-6">
                {featuredTopic.title}
              </p>

              <div className="mt-auto pt-2">
                <span className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-forest group-hover:text-leaf transition-colors">
                  Read story <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Responsive Grid with other 7 topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {remainingTopics.map((topic) => (
            <LearnCard
              key={topic.slug}
              topic={topic}
              onSelect={handleOpenTopic}
            />
          ))}
        </div>
      </main>

      {/* Quick Tips section under the grid */}
      <QuickTips />

      {/* Modal */}
      {currentTopic && (
        <LearnModal topic={currentTopic} onClose={handleCloseModal} />
      )}
    </div>
  )
}
