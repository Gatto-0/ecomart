import { MessageCircle } from 'lucide-react'
import { buddyIntro, buddyQuestions } from '../data/ecoScore'

export default function BuddyIntro() {
  const handleAsk = (question) => {
    window.dispatchEvent(new CustomEvent('ecobuddy:ask', { detail: question }))
  }

  return (
    <section aria-labelledby="buddy-heading" className="w-full">
      <div className="bg-white/60 border border-forest/10 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl mb-8">
          <h2
            id="buddy-heading"
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-forest tracking-tight mb-3"
          >
            Meet Eco Buddy
          </h2>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed">
            {buddyIntro}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-3 block">
            Try asking Eco Buddy
          </span>
          <div className="flex flex-wrap gap-3">
            {buddyQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleAsk(question)}
                className="group rounded-2xl rounded-bl-xs px-4 py-3 bg-white border border-forest/15 hover:border-leaf text-forest text-sm font-medium shadow-xs cursor-pointer text-left transition-all duration-200 hover:shadow-sm motion-safe:hover:-translate-y-0.5 inline-flex items-center gap-2.5"
              >
                <MessageCircle
                  size={16}
                  className="text-leaf shrink-0 transition-transform duration-200 motion-safe:group-hover:scale-110"
                  aria-hidden="true"
                />
                <span>&ldquo;{question}&rdquo;</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

