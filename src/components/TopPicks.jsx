import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from './ProductCard'

function getTopPicks(allProducts) {
  const pick = (minTotal) => {
    const sorted = allProducts
      .filter((p) => p.total >= minTotal)
      .sort((a, b) => b.total - a.total || a.price - b.price)

    const result = []
    const seenCategories = new Set()

    for (const p of sorted) {
      if (!seenCategories.has(p.category)) {
        seenCategories.add(p.category)
        result.push(p)
        if (result.length === 6) break
      }
    }
    return result
  }

  const picks9 = pick(9)
  if (picks9.length >= 6) return picks9
  return pick(8)
}

export default function TopPicks() {
  const scrollContainerRef = useRef(null)
  const topProducts = useMemo(() => getTopPicks(products), [])

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 304 // 280px card + 24px gap
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="w-full bg-sage py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Title & Arrow Buttons */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight">
              Top eco picks
            </h2>
            <div className="w-12 h-[3px] bg-marigold mt-3 rounded-full" aria-hidden="true" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-forest/90 transition-colors shadow-xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf btn-minor"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-forest/90 transition-colors shadow-xs cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf btn-minor"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scroll-snap Row */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Top eco picks"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              scroll('left')
            } else if (e.key === 'ArrowRight') {
              e.preventDefault()
              scroll('right')
            }
          }}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-4 -mx-6 px-6 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-leaf rounded-2xl"
        >
          {topProducts.map((product) => (
            <div
              key={product.slug}
              className="w-[280px] shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}

          {/* End card with "View all products" link */}
          <div className="w-[280px] shrink-0 snap-start flex flex-col items-center justify-center p-8 bg-white/70 rounded-2xl border border-forest/10 hover:border-forest/30 transition-all text-center">
            <div className="w-14 h-14 rounded-full bg-forest/10 text-forest flex items-center justify-center mb-4">
              <ArrowRight size={24} aria-hidden="true" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-forest mb-2">
              Looking for more?
            </h3>
            <p className="text-xs text-charcoal/70 mb-6 max-w-[200px]">
              Explore our full catalogue of verified sustainable essentials.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-cream font-semibold text-sm hover:bg-forest/90 transition-colors shadow-xs btn-major"
            >
              <span>View all products</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

