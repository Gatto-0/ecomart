import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, X as XIcon } from 'lucide-react'
import { products, categories, searchProducts, DATA_NOTE } from '../data/products'
import { getBand, bands } from '../data/ecoScore'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import FilterPanel, { FilterButton } from '../components/FilterPanel'

const SORT_OPTIONS = [
  { value: 'eco-high', label: 'Eco score: high to low' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

const DEFAULT_FILTERS = {
  categories: [],
  bands: [],
  minPrice: '',
  maxPrice: '',
}

function sortProducts(list, sort) {
  const arr = [...list]
  switch (sort) {
    case 'price-low':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-high':
      return arr.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    default: // eco-high
      return arr.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
  }
}

function applyFilters(list, filters) {
  return list.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
    if (filters.bands.length > 0) {
      const band = getBand(p.total)
      if (!filters.bands.includes(band.key)) return false
    }
    if (filters.minPrice !== '' && p.price < Number(filters.minPrice)) return false
    if (filters.maxPrice !== '' && Number(filters.maxPrice) > 0 && p.price > Number(filters.maxPrice)) return false
    return true
  })
}

function buildCategoryCounts(list) {
  const counts = {}
  list.forEach((p) => {
    counts[p.category] = (counts[p.category] ?? 0) + 1
  })
  return counts
}

function ActiveChips({ query, filters, onRemoveQuery, onUpdateFilters }) {
  const chips = []

  if (query) {
    chips.push({ id: 'query', label: `"${query}"`, onRemove: onRemoveQuery })
  }
  filters.categories.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug)
    chips.push({
      id: `cat-${slug}`,
      label: cat?.name ?? slug,
      onRemove: () =>
        onUpdateFilters({
          ...filters,
          categories: filters.categories.filter((s) => s !== slug),
        }),
    })
  })
  filters.bands.forEach((key) => {
    const band = bands.find((b) => b.key === key)
    chips.push({
      id: `band-${key}`,
      label: band?.label ?? key,
      onRemove: () =>
        onUpdateFilters({ ...filters, bands: filters.bands.filter((k) => k !== key) }),
    })
  })
  if (filters.minPrice !== '') {
    chips.push({
      id: 'min',
      label: `Min ₹${Number(filters.minPrice).toLocaleString('en-IN')}`,
      onRemove: () => onUpdateFilters({ ...filters, minPrice: '' }),
    })
  }
  if (filters.maxPrice !== '' && Number(filters.maxPrice) > 0) {
    chips.push({
      id: 'max',
      label: `Max ₹${Number(filters.maxPrice).toLocaleString('en-IN')}`,
      onRemove: () => onUpdateFilters({ ...filters, maxPrice: '' }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ id, label, onRemove }) => (
        <span
          key={id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-medium"
        >
          {label}
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove filter: ${label}`}
            className="text-forest/60 hover:text-forest transition-colors cursor-pointer btn-minor p-0.5 rounded-full"
          >
            <XIcon size={12} aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  )
}

function EmptyState({ query }) {
  const handleAskBuddy = () => {
    window.dispatchEvent(
      new CustomEvent('ecobuddy:ask', {
        detail: `Find me something like: ${query || 'eco-friendly products'}`,
      })
    )
  }

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4">
      <h2 className="font-heading text-xl sm:text-2xl font-semibold text-forest">
        No products found
      </h2>
      <p className="text-sm text-charcoal/70 max-w-sm">
        Try adjusting your search or filters, or ask Eco Buddy to help.
      </p>
      <button
        type="button"
        onClick={handleAskBuddy}
        className="mt-2 px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-forest/90 transition-colors cursor-pointer btn-major"
      >
        Ask Eco Buddy to find something similar
      </button>
    </div>
  )
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialise categories from URL on first render
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const cat = searchParams.get('category')
    return { ...DEFAULT_FILTERS, categories: cat ? [cat] : [] }
  })

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('eco-high')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Keep applied filters in sync if URL category changes externally (e.g. navigation)
  const urlCategory = searchParams.get('category')
  useEffect(() => {
    if (urlCategory) {
      setAppliedFilters((prev) => {
        if (prev.categories.length === 1 && prev.categories[0] === urlCategory) return prev
        return { ...prev, categories: [urlCategory] }
      })
    }
  }, [urlCategory])

  const searchResults = useMemo(() => searchProducts(query), [query])
  const filtered = useMemo(() => applyFilters(searchResults, appliedFilters), [searchResults, appliedFilters])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])

  // Category counts from search results minus any category filter
  const searchOnlyFiltered = useMemo(
    () => applyFilters(searchResults, { ...appliedFilters, categories: [] }),
    [searchResults, appliedFilters]
  )
  const productCounts = useMemo(() => buildCategoryCounts(searchOnlyFiltered), [searchOnlyFiltered])

  const handleApplyFilters = (nextDraft) => {
    setAppliedFilters(nextDraft)
    if (nextDraft.categories.length === 1) {
      setSearchParams({ category: nextDraft.categories[0] }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const handleClearAll = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setQuery('')
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Page heading */}
        <div className="pt-2 pb-6 sm:pb-8">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
            Shop
          </h1>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="flex gap-6 lg:gap-8 items-start">
          {/* Filter panel */}
          <FilterPanel
            filters={appliedFilters}
            categories={categories}
            productCounts={productCounts}
            onApply={handleApplyFilters}
            onClearAll={handleClearAll}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm text-charcoal/60 font-sans shrink-0">
                Showing {sorted.length} of {products.length} products
              </span>

              <div className="flex-1" />

              <FilterButton onClick={() => setMobileFiltersOpen(true)} />

              {/* Sort dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort products"
                  className="appearance-none h-9 pl-3 pr-8 rounded-xl border border-forest/20 bg-white text-sm text-charcoal cursor-pointer focus:outline-none focus:border-leaf focus:ring-1 focus:ring-leaf/20 transition-all shadow-xs"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/50">
                  <ChevronDown size={14} aria-hidden="true" />
                </span>
              </div>
            </div>

            {/* Active filter chips */}
            <ActiveChips
              query={query}
              filters={appliedFilters}
              onRemoveQuery={() => setQuery('')}
              onUpdateFilters={handleApplyFilters}
            />

            {/* Product grid */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {sorted.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                sorted.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))
              )}
            </div>

            {/* DATA_NOTE */}
            <p className="mt-10 text-xs text-charcoal/50 leading-relaxed text-center">
              {DATA_NOTE}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
