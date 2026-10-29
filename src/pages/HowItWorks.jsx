import { Link } from 'react-router-dom'
import { MISSION } from '../data/ecoScore'
import EcoScoreSection from '../components/EcoScoreSection'
import ScoreExample from '../components/ScoreExample'
import BuddyIntro from '../components/BuddyIntro'

export default function HowItWorks() {
  const handleAskBuddy = () => {
    window.dispatchEvent(
      new CustomEvent('ecobuddy:ask', {
        detail: 'Help me find an eco-friendly product',
      })
    )
  }

  return (
    <div className="bg-cream text-charcoal min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 space-y-16 sm:space-y-24">
        {/* Header */}
        <header className="max-w-4xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-leaf mb-3 block">
            How it works
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-forest tracking-tight leading-[1.15]">
            {MISSION}
          </h1>
        </header>

        {/* Section 2: How the eco score works */}
        <EcoScoreSection />

        {/* Section 3: Worked example */}
        <ScoreExample />

        {/* Section 4: Meet Eco Buddy */}
        <BuddyIntro />
      </div>

      {/* Section 5: Closing band */}
      <section
        aria-label="Call to action"
        className="bg-forest text-cream py-16 sm:py-20 px-6 border-t border-forest/10"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-cream tracking-tight max-w-xl">
            Ready to shop with purpose?
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3.5 rounded-full bg-cream text-forest font-semibold text-sm hover:bg-cream/90 transition-all duration-200 shadow-sm cursor-pointer motion-safe:hover:-translate-y-0.5"
            >
              Start shopping
            </Link>

            <button
              type="button"
              onClick={handleAskBuddy}
              className="px-6 py-3.5 rounded-full bg-transparent border-2 border-cream/70 text-cream font-semibold text-sm hover:bg-cream/10 hover:border-cream transition-all duration-200 cursor-pointer motion-safe:hover:-translate-y-0.5"
            >
              Ask Eco Buddy
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
