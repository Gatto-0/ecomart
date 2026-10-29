import { useEffect, useRef } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { bands } from '../data/ecoScore'

function CategoryList({ categories, selected, onChange, productCounts }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
        Category
      </p>
      <ul className="space-y-1">
        {categories.map((cat) => {
          const checked = selected.includes(cat.slug)
          const count = productCounts[cat.slug] ?? 0
          return (
            <li key={cat.slug}>
              <label className="flex items-center gap-2 cursor-pointer group select-none py-0.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onChange(
                      checked
                        ? selected.filter((s) => s !== cat.slug)
                        : [...selected, cat.slug]
                    )
                  }}
                  className="accent-forest w-4 h-4 rounded shrink-0"
                />
                <span className="text-sm text-charcoal/80 group-hover:text-charcoal transition-colors flex-1 leading-tight">
                  {cat.name}
                </span>
                <span className="text-[11px] text-charcoal/40 tabular-nums">{count}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function BandList({ selected, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
        Eco score
      </p>
      <ul className="space-y-1">
        {bands.map((band) => {
          const checked = selected.includes(band.key)
          return (
            <li key={band.key}>
              <label className="flex items-center gap-2 cursor-pointer group select-none py-0.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onChange(
                      checked
                        ? selected.filter((k) => k !== band.key)
                        : [...selected, band.key]
                    )
                  }}
                  className="accent-forest w-4 h-4 rounded shrink-0"
                />
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: band.color }}
                  aria-hidden="true"
                />
                <span className="text-sm text-charcoal/80 group-hover:text-charcoal transition-colors leading-tight">
                  {band.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function PriceRange({ minPrice, maxPrice, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">
        Price range
      </p>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 text-sm pointer-events-none">
            ₹
          </span>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => onChange({ minPrice: Number(e.target.value), maxPrice })}
            placeholder="Min"
            aria-label="Minimum price"
            className="w-full h-9 pl-6 pr-2 rounded-lg border border-forest/15 bg-white text-sm text-charcoal focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf/20 transition-all"
          />
        </div>
        <span className="text-charcoal/40 text-sm shrink-0">–</span>
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/50 text-sm pointer-events-none">
            ₹
          </span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => onChange({ minPrice, maxPrice: Number(e.target.value) })}
            placeholder="Max"
            aria-label="Maximum price"
            className="w-full h-9 pl-6 pr-2 rounded-lg border border-forest/15 bg-white text-sm text-charcoal focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf/20 transition-all"
          />
        </div>
      </div>
    </div>
  )
}

function FilterContent({ filters, categories, productCounts, onChange, onClearAll }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-forest">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-charcoal/50 hover:text-charcoal transition-colors cursor-pointer underline underline-offset-2"
        >
          Clear all
        </button>
      </div>

      <CategoryList
        categories={categories}
        selected={filters.categories}
        onChange={(categories) => onChange({ ...filters, categories })}
        productCounts={productCounts}
      />

      <div className="border-t border-forest/10" />

      <BandList
        selected={filters.bands}
        onChange={(bands) => onChange({ ...filters, bands })}
      />

      <div className="border-t border-forest/10" />

      <PriceRange
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={({ minPrice, maxPrice }) => onChange({ ...filters, minPrice, maxPrice })}
      />
    </div>
  )
}

export default function FilterPanel({
  filters,
  categories,
  productCounts,
  onChange,
  onClearAll,
  mobileOpen,
  onMobileClose,
}) {
  const drawerRef = useRef(null)

  // Esc closes mobile drawer
  useEffect(() => {
    if (!mobileOpen) return
    const handle = (e) => {
      if (e.key === 'Escape') onMobileClose()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [mobileOpen, onMobileClose])

  // Lock scroll while mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop: sticky left column with independent scroll */}
      <aside
        className="hidden lg:block w-[260px] shrink-0 sticky top-[96px] self-start max-h-[calc(100vh-112px)] overflow-y-auto [scrollbar-width:thin] bg-white border border-forest/10 rounded-2xl p-5 pb-8 shadow-xs"
        aria-label="Filters"
      >
        <FilterContent
          filters={filters}
          categories={categories}
          productCounts={productCounts}
          onChange={onChange}
          onClearAll={onClearAll}
        />
      </aside>

      {/* Mobile: backdrop + drawer */}
      <div
        aria-hidden="true"
        onClick={onMobileClose}
        className={`lg:hidden fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-xs transition-opacity duration-300 motion-reduce:transition-none ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-[300px] max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-forest/10 shrink-0">
          <span className="font-heading font-semibold text-forest text-lg">Filters</span>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close filters"
            className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-forest/5 transition-colors cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterContent
            filters={filters}
            categories={categories}
            productCounts={productCounts}
            onChange={onChange}
            onClearAll={onClearAll}
          />
        </div>
        <div className="p-4 border-t border-forest/10 shrink-0">
          <button
            type="button"
            onClick={onMobileClose}
            className="w-full py-2.5 rounded-xl bg-forest text-cream text-sm font-semibold cursor-pointer hover:bg-forest/90 transition-colors"
          >
            Show results
          </button>
        </div>
      </aside>

      {/* Mobile trigger button — rendered in Shop, but exported for convenience */}
    </>
  )
}

export function FilterButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 h-9 px-4 rounded-xl border border-forest/20 bg-white text-sm font-medium text-forest hover:border-forest/40 transition-colors cursor-pointer shadow-xs"
    >
      <SlidersHorizontal size={15} aria-hidden="true" />
      Filters
    </button>
  )
}

