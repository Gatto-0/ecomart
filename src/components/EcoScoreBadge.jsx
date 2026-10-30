import { getBand } from '../data/ecoScore'

export default function EcoScoreBadge({ total = 0, size = 'sm', className = '' }) {
  const band = getBand(total)
  const isLg = size === 'lg'
  const isGood = band.key === 'green'
  const isPoor = band.key === 'clay'

  return (
    <div
      title={band.label}
      aria-label={`Eco score ${total}/10 (${band.label})`}
      className={`eco-score-badge rounded-full shrink-0 flex items-center justify-center font-heading font-bold select-none transition-transform duration-200 ${
        isLg
          ? 'w-20 h-20 text-2xl sm:w-24 sm:h-24 sm:text-3xl shadow-md'
          : 'w-11 h-11 text-xs shadow-xs'
      } ${className}`}
      style={{ backgroundColor: isPoor ? 'var(--rust)' : isGood ? 'var(--leaf)' : '#fff', color: isPoor || isGood ? '#fff' : 'var(--ink)', border: isPoor || isGood ? 'none' : '1px solid var(--line)' }}
    >
      <span className="leading-none">
        {total}
        <span className={isLg ? 'text-sm font-sans font-medium opacity-90' : 'text-[10px] font-sans font-medium opacity-90'}>
          /10
        </span>
      </span>
    </div>
  )
}

