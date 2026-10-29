import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import EcoScoreBadge from './EcoScoreBadge'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useCompare } from '../context/CompareContext'
import { getSwap, categories } from '../data/products'

function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN')
}

function ProductImage({ product }) {
  const [src, setSrc] = useState(product.image)
  const categoryData = categories.find((c) => c.slug === product.category)
  const fallback1 = categoryData?.image ?? null

  const handleError = () => {
    if (src === product.image && fallback1 && src !== fallback1) {
      setSrc(fallback1)
    } else {
      setSrc(null)
    }
  }

  if (src === null) {
    // Sage-toned placeholder block
    return (
      <div
        className="w-full h-full bg-forest/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-forest/30 font-heading text-xs text-center px-2">
          {product.name}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={product.name}
      onError={handleError}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100"
      loading="lazy"
    />
  )
}

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { toggle: toggleCompare, has: isCompared, count: compareCount } = useCompare()
  const [added, setAdded] = useState(false)
  const inWishlist = has(product.slug)
  const compared = isCompared(product.slug)
  const compareDisabled = !compared && compareCount >= 2

  const swap = product.total < 5 ? getSwap(product) : null
  const isVagueClaim = product.tags?.includes('vague-claim')

  const handleAddToCart = () => {
    addItem(product.slug)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const categoryData = categories.find((c) => c.slug === product.category)
  const categoryName = categoryData?.name ?? product.category

  return (
    <article className="group flex flex-col bg-white rounded-2xl rounded-l-none border-l-4 border-l-forest overflow-hidden shadow-xs border-y border-r border-forest/10 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden bg-forest/5">
        <Link to={`/product/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <ProductImage product={product} />
        </Link>

        {/* EcoScoreBadge top-left */}
        <div className="absolute top-2 left-2 z-10">
          <EcoScoreBadge total={product.total} size="sm" />
        </div>

        {/* Wishlist toggle top-right */}
        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer btn-minor ${
            inWishlist
              ? 'bg-forest text-cream'
              : 'bg-white/90 text-forest/60 hover:text-forest hover:bg-white'
          }`}
        >
          <Heart
            size={15}
            aria-hidden="true"
            fill={inWishlist ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
        {/* Category */}
        <span className="text-[11px] text-charcoal/50 font-sans leading-tight">
          {categoryName}
        </span>

        {/* Name */}
        <Link
          to={`/product/${product.slug}`}
          className="font-heading text-sm sm:text-base font-semibold text-forest leading-tight hover:text-leaf transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Price */}
        <p className="font-sans text-base font-semibold text-charcoal">
          {formatPrice(product.price)}
        </p>

        {/* Text holder chips with tinted backgrounds */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {product.total >= 9 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F6E3B8] text-[#5A3D12] text-[11px] font-medium leading-tight">
              Top eco pick
            </span>
          )}

          {product.tags?.includes('plastic-free') && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E4EBDD] text-[#2F4A35] text-[11px] font-medium leading-tight">
              Plastic-free
            </span>
          )}

          {isVagueClaim && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F3D5C8] text-[#6E2F1B] text-[11px] font-medium leading-tight border border-[#C4694A]/25">
              Unverified claim
            </span>
          )}
        </div>

        {/* Greener swap link */}
        {swap && (
          <Link
            to={`/product/${swap.slug}`}
            className="text-[11px] text-leaf hover:underline leading-tight mt-0.5"
          >
            Greener swap: {swap.name}
          </Link>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Compare checkbox */}
        <label className="flex items-center gap-1.5 text-xs text-charcoal/70 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={compared}
            disabled={compareDisabled}
            onChange={() => toggleCompare(product.slug)}
            className="accent-forest w-3.5 h-3.5 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          />
          <span className={compareDisabled ? 'text-charcoal/40' : ''}>Compare</span>
        </label>

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-1 w-full py-2 sm:py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer btn-major ${
            added
              ? 'bg-leaf text-cream'
              : 'bg-forest text-cream hover:bg-forest/90 active:scale-[0.98]'
          }`}
        >
          {added ? 'Added' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}

