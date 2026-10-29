import EcoScoreBadge from './EcoScoreBadge'

/**
 * ImpactSummary
 * Props:
 *   plasticG  – grams of plastic avoided
 *   co2Kg     – kg CO₂ avoided
 *   avgScore  – quantity-weighted average eco score (one decimal)
 */
export default function ImpactSummary({ plasticG = 0, co2Kg = 0, avgScore = 0 }) {
  const plasticDisplay =
    plasticG >= 1000
      ? `${(plasticG / 1000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg`
      : `${plasticG} g`

  return (
    <div className="rounded-xl border border-forest/15 bg-forest/5 p-4 flex flex-col gap-3">
      <h3 className="font-heading font-semibold text-base text-forest">
        Your estimated impact
      </h3>

      <div className="flex items-start gap-4 flex-wrap">
        {/* Plastic stat */}
        <div className="flex flex-col min-w-0">
          <span className="font-heading font-bold text-xl text-forest leading-tight">
            {plasticDisplay}
          </span>
          <span className="text-xs text-charcoal/70 leading-snug mt-0.5">
            plastic avoided
          </span>
        </div>

        {/* CO₂ stat */}
        <div className="flex flex-col min-w-0">
          <span className="font-heading font-bold text-xl text-forest leading-tight">
            {co2Kg.toLocaleString('en-IN', { maximumFractionDigits: 2 })} kg
          </span>
          <span className="text-xs text-charcoal/70 leading-snug mt-0.5">
            CO₂ avoided
          </span>
        </div>

        {/* Average score badge */}
        <div className="flex flex-col items-center gap-1 ml-auto">
          <EcoScoreBadge total={Math.round(avgScore)} size="sm" />
          <span className="text-[10px] text-charcoal/60 text-center leading-tight">
            avg score
          </span>
        </div>
      </div>

      <p className="text-[11px] text-charcoal/50 leading-relaxed">
        Estimates compared with typical alternatives.
      </p>
    </div>
  )
}

