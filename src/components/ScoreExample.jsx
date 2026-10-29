import EcoScoreBadge from './EcoScoreBadge'
import { criteria, exampleProduct, getTotal, getBand } from '../data/ecoScore'

export default function ScoreExample() {
  const total = getTotal(exampleProduct.ecoScores)
  const band = getBand(total)

  return (
    <section aria-labelledby="worked-example-heading" className="w-full">
      <div className="bg-white/80 border border-forest/10 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-forest/10">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-leaf mb-1 block">
              Worked Example
            </span>
            <h3
              id="worked-example-heading"
              className="font-heading text-2xl sm:text-3xl font-semibold text-forest tracking-tight"
            >
              {exampleProduct.name}
            </h3>
            <p className="text-xs text-charcoal/60 mt-1 italic">
              {exampleProduct.note}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <EcoScoreBadge total={total} size="lg" />
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal/50 block">
                Total Rating
              </span>
              <span className="font-heading font-semibold text-lg text-forest block leading-tight">
                {band.label}
              </span>
              <span className="text-xs text-charcoal/70">
                {total} of 10 points
              </span>
            </div>
          </div>
        </div>

        {/* Criteria breakdown */}
        <div className="divide-y divide-forest/10 pt-2">
          {criteria.map((criterion) => {
            const score = exampleProduct.ecoScores[criterion.key] ?? 0
            const reason = exampleProduct.reasons[criterion.key]

            return (
              <div
                key={criterion.key}
                className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6"
              >
                <div className="sm:w-2/5 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-forest text-base">
                      {criterion.name}
                    </span>
                    {/* 2-segment bar */}
                    <div
                      className="flex items-center gap-1"
                      aria-label={`${score} of 2 points`}
                      title={`${score}/2 points`}
                    >
                      {[1, 2].map((segment) => (
                        <span
                          key={segment}
                          className="h-2 w-6 rounded-xs transition-colors"
                          style={{
                            backgroundColor:
                              segment <= score
                                ? band.color
                                : 'rgba(34, 42, 37, 0.15)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-charcoal/60">
                      {score}/2
                    </span>
                  </div>
                </div>

                <p className="text-sm text-charcoal/80 sm:w-3/5 leading-relaxed">
                  {reason}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

