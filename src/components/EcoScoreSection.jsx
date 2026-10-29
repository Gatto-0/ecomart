import { Sprout, Package, MapPin, Cloud, Hourglass } from 'lucide-react'
import { criteria, bands, DISCLAIMER } from '../data/ecoScore'

const iconMap = {
  Sprout,
  Package,
  MapPin,
  Cloud,
  Hourglass,
}

export default function EcoScoreSection() {
  return (
    <section aria-labelledby="eco-score-heading" className="w-full">
      <div className="mb-6">
        <h2
          id="eco-score-heading"
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-forest tracking-tight mb-2"
        >
          How the eco score works
        </h2>
        <p className="text-base sm:text-lg text-charcoal/80">
          Every product is scored out of 10 across five questions.
        </p>
      </div>

      {/* Scale bar */}
      <div className="bg-white/70 border border-forest/10 rounded-2xl p-5 sm:p-6 mb-10 shadow-xs">
        <div className="flex w-full h-3 sm:h-3.5 rounded-full overflow-hidden mb-4 bg-forest/5">
          {bands.map((band) => {
            const count = band.max - band.min + 1
            return (
              <div
                key={band.key}
                className="h-full transition-opacity"
                style={{
                  backgroundColor: band.color,
                  width: `${(count / 11) * 100}%`,
                }}
                title={`${band.label} (${band.min}–${band.max})`}
              />
            )
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bands.map((band) => (
            <div key={band.key} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: band.color }}
                  aria-hidden="true"
                />
                <span className="font-heading font-semibold text-sm text-forest">
                  {band.label}
                </span>
              </div>
              <span className="text-xs text-charcoal/70 pl-5">
                {band.min}–{band.max} points
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria Grid: 3 cols desktop, 1 col mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {criteria.map((criterion) => {
          const Icon = iconMap[criterion.icon] || Sprout
          return (
            <div
              key={criterion.key}
              className="bg-white/80 border border-forest/10 rounded-2xl p-6 flex flex-col shadow-xs hover:border-forest/20 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center mb-4 shrink-0">
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </div>

              <h3 className="font-heading text-lg font-semibold text-forest mb-1">
                {criterion.name}
              </h3>
              <p className="text-sm text-charcoal/80 mb-5 leading-snug">
                {criterion.question}
              </p>

              {/* 3-row scoring list */}
              <div className="border-t border-forest/10 pt-4 mt-auto">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/50 mb-2 block">
                  Scoring
                </span>
                <ul className="space-y-2 text-xs">
                  {criterion.levels.map((level, points) => (
                    <li key={points} className="flex items-start gap-2">
                      <span className="shrink-0 font-medium text-forest bg-forest/5 rounded px-1.5 py-0.5 text-[11px]">
                        {points} {points === 1 ? 'pt' : 'pts'}
                      </span>
                      <span className="text-charcoal/80 leading-tight pt-0.5">
                        {level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* Small muted disclaimer text */}
      <p className="text-xs text-charcoal/60 mt-6 leading-relaxed max-w-3xl">
        {DISCLAIMER}
      </p>
    </section>
  )
}

